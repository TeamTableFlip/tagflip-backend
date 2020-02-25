let {corpusModel, annotationsetModel, documentModel, connection} = require('../persitence/sql/Models');
let FileManager = require('../persitence/filesystem/FileManager');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');
let config = require('../config/Config');
let zip = require('../persitence/filesystem/Zippper');
let path = require('path');
let hashing = require('../persitence/Hashing');
let fileType = require('file-type');
let {UserError, SystemError, NotFoundError} = require('./Exceptions');

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

function create(item) {
    let findOrCreateOptions = {
        where: {
            name: item.name
        },
        defaults:  {
            description: item.description
        }
    };
    let optionsValidator = (findOptions)=> new Promise((resolve, reject) => {
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
        else reject(new Error(failReasons.join(" ; ")));
    });
    return BaseCrudServiceFunctions.create(item)(corpusModel, findOrCreateOptions, optionsValidator);
}

function del(id) {
    return BaseCrudServiceFunctions.del(id)(corpusModel, 'c_id');
}

function update(id, item) {
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

async function importFiles(c_id, uploadedFiles, prefix) {
    let corpus = await corpusModel.findByPk(c_id);
    if (corpus === undefined || corpus === null)
        throw new NotFoundError("corpus with id " + c_id + " not found");

    let docHashSet = new Set();

    let corpusDocuments = await corpus.getDocuments();
    for (let doc of corpusDocuments) {
        docHashSet.add(doc.document_hash);
    }

    let dataBasesEntries = [];
    let skippedFiles = [];

    let _processFile = async (filePath, targetFileName) => {
        try {
            let text = await FileManager.readFile(filePath, true);
            let hash = hashing.sha256Hash(text);
            if (docHashSet.has(hash)) {
                skippedFiles.push({
                    item: {
                        filename: targetFileName
                    }, reason: "file content is already present in corpus"});
                return;
            }
            try {
                await FileManager.moveFile(filePath,targetFileName, false, true);
            } catch (e) {
                console.error(e);
                skippedFiles.push({
                    item: {
                        filename: targetFileName
                    }, reason: "failed to move document into storage, reason: " + e.message});
                return;
            }
            let timestamp = Date.now();
            let [doc, created] = await documentModel.findOrCreate({
                where: {
                    c_id: c_id,
                    filename: targetFileName,
                    document_hash: hash,
                    last_edited: timestamp
                }
            });
            dataBasesEntries.push(doc);
        } catch (e) {
            console.error("caught error, skipping file: ", e);
            skippedFiles.push({
                item: {
                    filename: targetFileName
                }, reason: "failed to create database entry"});
            await FileManager.deleteFile(targetFileName);
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
                if (file.startsWith(config.files.unzipBuffer)){
                    if (prefix && prefix.length > 0)
                        targetFileName =  path.join(c_id.toString(), prefix,possibleZipFile.name,file.slice(config.files.unzipBuffer.length));
                    else
                        targetFileName =  path.join(c_id.toString(), possibleZipFile.name,file.slice(config.files.unzipBuffer.length));
                    let type = await FileManager.checkFileType(file);
                    if (!(type.ext === 'txt' || type.ext === 'ics' || type.ext === 'xml')) {
                        skippedFiles.push({
                            item: {
                                filename: targetFileName
                            }, reason: "file is not a plain text file"});
                        continue;
                    }
                } else {
                    skippedFiles.push({
                        item: {
                            filename: targetFileName
                        }, reason: "file does not have a correct path"}); // should never happen
                    continue;
                }
                await _processFile(file, targetFileName);
            }
        } else if (possibleZipFile.mimetype === "text/plain") {
            let targetFileName = null;
            if (prefix && prefix.length > 0)
                targetFileName =  path.join(c_id.toString(), prefix,possibleZipFile.name);
            else
                targetFileName =  path.join(c_id.toString(), possibleZipFile.name);
            await _processFile(possibleZipFile.tempFilePath, targetFileName)
        } else {
            skippedFiles.push({
                item: {
                    filename: possibleZipFile.name
                },reason: "unsupported file type. Allowed: application/zip or plain/text"}); // should never happen
            return;
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
        "items": dataBasesEntries,
        "skippedItems": skippedFiles
    };
}


async function exportJson() {

}


async function exportZip(format) {

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
