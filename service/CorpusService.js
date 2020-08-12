let {corpusModel, annotationsetModel, documentModel, connection} = require('../persistence/sql/Models');
let FileManager = require('../persistence/filesystem/FileManager');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');
let documentService = require('./DocumentService');
let config = require('../config/Config');
let zip = require('../persistence/filesystem/Zippper');
let path = require('path');
let hashing = require('../persistence/Hashing');
let {UserError, NotFoundError} = require('./Exceptions');

/**
 * custom query to get the number of associated documents for a gavin corpus a well as corpus data as a bit of visual sugar in the gui.
 * used by findAll() and get(id).
 * @type {{include: {as: string, model: *, attributes: []}[], attributes: [string, string, string, [*, string]], group: [string]}}
 */
let findQuery = {
    attributes: [
        'c_id',
        'name',
        'description',
        [
            connection.fn('count', connection.col('documents.d_id')), 'num_documents'
        ]
    ],
    include: [
        {
            model: documentModel,
            as: 'documents',
            attributes: []
        }
    ],
    group: ['corpus.c_id']
};

async function listAll() {
    return corpusModel.findAll(findQuery);
}

async function get(id) {
    return corpusModel.findByPk(id, findQuery);
}

async function create(item) {
    let findOrCreateOptions = {
        where: {
            name: item.name
        },
        defaults: {
            description: item.description
        }
    };
    let optionsValidator = (findOptions) => new Promise((resolve, reject) => {
        let valid = true;
        let failReasons = [];
        if (findOptions.defaults.description === undefined || findOptions.defaults.description === null ||
            (typeof findOptions.defaults.description !== "string")) {
            findOptions.defaults.description = null;
        }
        if (findOptions.where.name === undefined || findOptions.where.name === null ||
            (typeof findOptions.where.name !== "string")) {
            valid = false;
            failReasons.push("specified name incorrect, name is " + String(findOptions.where.name));
        }
        if (valid) resolve(valid);
        else reject(new UserError(failReasons.join(" ; ")));
    });
    return BaseCrudServiceFunctions.create(item)(corpusModel, findOrCreateOptions, optionsValidator);
}

async function del(id) {
    let corp = await corpusModel.findByPk(id);
    // get documents and delete them first (including files on disk)
    await documentService.deleteMany(corp);
    return BaseCrudServiceFunctions.del(id)(corpusModel, 'c_id');
}

async function update(id, item) {
    return BaseCrudServiceFunctions.update(id, item)(corpusModel, 'c_id');
}

async function addDocument(c_id, d_id) {
    let corp = await corpusModel.findByPk(c_id);
    let doc = await documentModel.findByPk(d_id);
    await corp.setDocument(doc);
    return true;
}

async function addAnnotationset(c_id, s_id) {
    let corp = await corpusModel.findByPk(c_id);
    let set = await annotationsetModel.findByPk(s_id);
    let ret = await corp.addAnnotationset(set); // ret is a object if created, undefined if not created
    return (ret !== undefined);
}

async function removeAnnotationset(c_id, s_id) {
    let corp = await corpusModel.findByPk(c_id);
    let set = await annotationsetModel.findByPk(s_id);
    let ret = await corp.removeAnnotationset(set); // here its just a boolean...
    return (ret === 1);
}

async function getAnnotationsets(c_id) {
    let corp = await corpusModel.findByPk(c_id);
    return corp.getAnnotationsets();
}

async function getDocuments(c_id) {
    let corp = await corpusModel.findByPk(c_id);
    return corp.getDocuments();
}

async function getDocumentCount(c_id) {
    let count = await documentModel.count({
        where: {
            c_id: c_id
        }
    });
    return {
        num_documents: count
    };
}

/**
 * Imports uploaded contents into database and file storage.
 * This function first determines the type of files that where uploaded and picks either a direct import or a import of zip contents.
 * In case a file could not be imported the file gets skipped and this functions continues with importing the other ones.
 * All successful and unsuccessful files are getting collected and returned as lists.
 *
 * @param c_id id of corpus where the documents are supposed to go
 * @param uploadedFiles a list of files (residing in config.files.temp)
 * @param prefix a string that gets prepended before every file in uploadedFiles (including zip)
 * @returns {Promise<{skippedItems: [{item: {filename: string}, reason: string}], items: [Document]}>}
 *          two lists of items (document entities) that imported successfully and the once that failed.
 */
async function importFiles(c_id, uploadedFiles, prefix) {
    let corpus = await corpusModel.findByPk(c_id);
    if (corpus === undefined || corpus === null)
        throw new NotFoundError("corpus with id " + c_id + " not found");

    let skippedFiles = [];
    let newDocuments = new Map();

    let _processFile = async (filePath, targetFileName) => {
        try {
            let text = await FileManager.readFile(filePath);
            let hash = hashing.sha256Hash(text);

            let existingSameDocument = await documentService.findOneByCorpusIdAndHash(c_id, hash);
            if (!existingSameDocument) {
                let newDocument = await documentService.createOne({
                    c_id: c_id,
                    filename: targetFileName,
                    document_hash: hash,
                    content: text
                });
                newDocuments.set(newDocument.document_hash, newDocument);
            } else {
                skippedFiles.push({
                    item: {
                        filename: targetFileName
                    },
                    reason: "file with same content already exists in corpus. file: " + existingSameDocument.filename + ", SHA256: " + existingSameDocument.document_hash
                }); // should never happen
            }
            await FileManager.deleteFile(filePath);
        } catch (e) {
            console.error("caught error, skipping file: ", e);
            skippedFiles.push({
                item: {
                    filename: targetFileName
                }, reason: "failed to create database entry"
            });
            return;
        }
        console.debug("finished file import for new file: ", targetFileName);
        // return;
    };

    let _processZipOrFile = async (possibleZipFile) => {
        // uploadedFiles.name uploadedFiles.tempFilePath uploadedFiles.mimetype
        // let fileType = await FileManager.checkFileType(possibleZipFile);
        if (possibleZipFile.mimetype === "application/zip" || possibleZipFile.mimetype === "application/x-zip-compressed" || possibleZipFile.mimetype === "multipart/x-zip") {
            let result = await zip.extractZip(possibleZipFile.tempFilePath);
            for (let file of result.files) { // many files from zip extract
                let targetFileName = null;
                if (path.normalize(file).startsWith(path.normalize(config.files.unzipBuffer))) {
                    if (prefix && prefix.length > 0)
                        targetFileName = path.join(prefix, file.slice(result.parentFolder.length));
                    else
                        targetFileName = file.slice(result.parentFolder.length + 1);
                    let type = await FileManager.checkFileType(file);
                    if (!(type.ext === 'txt' || type.ext === 'ics' || type.ext === 'xml')) {
                        skippedFiles.push({
                            item: {
                                filename: targetFileName
                            }, reason: "file is not a plain text file"
                        });
                        continue;
                    }
                } else {
                    skippedFiles.push({
                        item: {
                            filename: targetFileName
                        }, reason: "file does not have a correct path"
                    }); // should never happen
                    continue;
                }
                await _processFile(file, targetFileName);

            }
            await FileManager.deleteFile(possibleZipFile.tempFilePath);
            await FileManager.deleteFile(result.parentFolder);

        } else if (possibleZipFile.mimetype === "text/plain") {
            let targetFileName = null;
            if (prefix && prefix.length > 0)
                targetFileName = path.join(prefix, possibleZipFile.name);
            else
                targetFileName = path.join(possibleZipFile.name);
            await _processFile(possibleZipFile.tempFilePath, targetFileName);
        } else {
            skippedFiles.push({
                item: {
                    filename: possibleZipFile.name
                }, reason: "unsupported file type. Allowed: application/zip or plain/text"
            }); // should never happen
            // return;
        }
    };

    if (Array.isArray(uploadedFiles)) {
        for (let uploadedFile of uploadedFiles) {
            console.log(uploadedFile);
            await _processZipOrFile(uploadedFile);
        }
    } else {
        console.log(uploadedFiles);
        await _processZipOrFile(uploadedFiles);
    }

    return {
        "items": [...newDocuments.values()],
        "skippedItems": skippedFiles
    };
}


async function exportJson() {
    //TBI
}


async function exportZip(format) {
    //TBI
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create,
    addDocument,
    addAnnotationset,
    removeAnnotationset,
    getDocuments,
    getAnnotationsets,
    getDocumentCount,
    importFiles
};
