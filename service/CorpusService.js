let {corpusModel, annotationsetModel, documentModel, connection} = require('../persitence/sql/Models');
let FileManager = require('../persitence/filesystem/FileManager');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');
let config = require('../config/Config');
let zip = require('../persitence/filesystem/Zippper');
let path = require('path');
let hashing = require('../persitence/Hashing');
let fileType = require('file-type');


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
        if (valid) resolve();
        else reject(Error(failReasons.join(" ; ")));
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

async function importZip(c_id, zipLocation, prefix, name) {
    let corpus = await corpusModel.findByPk(c_id);
    if (corpus === undefined || corpus === null)
        return null;
    let result = await zip.extractZip(zipLocation);
    let corpusDocuments = await corpus.getDocuments();
    let docHashSet = new Set();
    for (let doc of corpusDocuments) {
        docHashSet.add(doc.document_hash);
    }
    let dataBasesEntries = [];
    let skippedFiles = [];
    for (let file of result.files) {
        let targetFileName = null;
        if (file.startsWith(config.files.unzipBuffer)){
            if (prefix && prefix.length > 0)
                targetFileName =  path.join(prefix,name,file.slice(config.files.unzipBuffer.length));
            else
                targetFileName =  path.join(name,file.slice(config.files.unzipBuffer.length));
            let type = await FileManager.checkFileType(file);
            if (type.ext !== 'txt') {
                skippedFiles.push({fileName: file, reason: "file is not a plain text file"});
                continue;
            }
            await FileManager.moveFile(file,targetFileName, false, true);
        } else {
            skippedFiles.push({fileName: file, reason: "file does not have a correct path"}); // should never happen
            continue;
        }
        try {
            let text = await FileManager.readFile(targetFileName);
            let hash = hashing.sha256Hash(text);
            let timestamp = Date.now();
            if (docHashSet.has(hash)) {
                skippedFiles.push({fileName: file, reason: "file content is already present in corpus"});
                continue;
            }
            let [doc, created] = await documentModel.findOrCreate({
                where: {
                    c_id: c_id,
                    filename: targetFileName,
                    document_hash: hash,
                    last_edited: timestamp
                }
            });
            dataBasesEntries.push({
                "doc": doc,
                "created": created
            })
        } catch (e) {
            console.error("caught error, skipping file: ", e);
            skippedFiles.push({fileName: file, reason: "failed to create database entry"});
            await FileManager.deleteFile(targetFileName);
            continue;
        }
        console.debug("finished file import for new file: ", targetFileName)
    } // end for loop
    return {
        "dataBasesEntries": dataBasesEntries,
        "skippedFiles": skippedFiles
    };
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
    importZip
};
