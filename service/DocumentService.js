/**
 * because we also have to read text data from filesystem. This class requires more logic than the other services...
 * All Functions read and write data from and to the database as well as the file storage.
 * They try and keep them in sync with each other, by rolling back changes in case of errors.
 *
 * TODO: create some kind of timed cleanup procedure that runs over night and makes sure everything is as it's supposed to.
 */
let {SystemError, UserError} = require('./Exceptions');
let {documentModel, corpusModel} = require('../persitence/sql/Models');
let hashing = require('../persitence/Hashing');
let fileManager = require('../persitence/filesystem/FileManager');

async function listAll() {
    let documents = await documentModel.findAll();
    if (documents) {
        for (let doc of documents) {
            doc.dataValues['text'] = await fileManager.readFile(documentModel.filename);
        }
    }
    return documents;
}

async function get(id) {
    let doc = await documentModel.findByPk(id);
    doc.dataValues['text'] = await fileManager.readFile(doc.filename);
    return doc;
}

async function create(item) {
    if (item.id)
        item.id = undefined;
    if (!item.text)
        throw UserError("no text specified");

    let valid = true;
    let failReasons = [];
    if (item.filename === undefined || item.filename === null ||
        (typeof item.filename !== "string")) {
        valid = false;
        failReasons.push("specified filename missing, filename is " + String(item.filename));
    }
    if (!valid) throw UserError(failReasons.join("; "));

    let hash = hashing.sha256Hash(item.text);
    let ts = Date.now();
    let cor = await corpusModel.findByPk(item.c_id);
    let corpusDocuments = await cor.getDocuments();
    for (let doc of corpusDocuments) {
        if (doc.document_hash === hash) throw UserError("file content already present in this corpus");
    }
    let [doc, created] = await documentModel.findOrCreate({
        where: {
            c_id: item.c_id,
            filename: item.filename,
            document_hash: hash,
            last_edited: ts
        }
    });
    try {
        if (item.text) await fileManager.saveFile(doc.filename, !created, item.text);
    } catch (e) { // roll back database creation
        console.error(e);
        documentModel.delete(doc.d_id);
        throw new SystemError("failed to write file content to disk, reverting database update", e);
    }
    doc.dataValues['text'] = item.text;
    return doc;
}

async function del(id) {
    let doc = await documentModel.findByPk(id);
    await documentModel.destroy({where: {d_id: id}});
    try {
        await fileManager.deleteFile(doc.filename);
    } catch (e) {
        console.error("failed to delete file from disk, reverting database update");
        await documentModel.create(doc);
        throw new SystemError("failed to delete file from disk, reverting database update", e);
    }
    return id;
}

async function update(id, item) {
    if (item.id) {
        if (item.id !== id) {
            console.warn("request for item update has different ids, setting id to url param");
            item.id = id;
        }
    }
    let old_doc = await documentModel.findByPk(id);
    let updatesArray = await documentModel.update(item, {where: {d_id: id}});
    // TODO do something with return value (seems to be somewhat ambiguous)
    let new_doc = await documentModel.findByPk(id);
    try {
        if (new_doc.filename !== old_doc.filename) await fileManager.moveFile(old_doc.filename, new_doc.filename);
        new_doc.dataValues['text'] = await fileManager.readFile(new_doc.filename);
    } catch (e) {
        console.error("failed to move file on disk, reverting database update");
        await documentModel.update(old_doc, {where: {d_id: id}});
        throw new SystemError("failed to delete file from disk, reverting database update", e);
    }
    return new_doc;
}

async function getTags(d_id) {
    let doc = await documentModel.findByPk(d_id);
    return await doc.getTags();
}

module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create,
    getTags
};
