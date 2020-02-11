let {documentModel, corpusModel} = require('../persitence/sql/sequelize');
let hashing = require('../persitence/hashing');
let fileManager = require('../persitence/filesystem/filemanager');

// TODO define error types for better returns in rest api.

async function listAll() {
    let documents = await documentModel.findAll();
    if (documents) {
        for (let doc of documents) { // TODO error handling when operations fail have way through...
            doc.dataValues['text'] = await fileManager.readFile(documentModel.filename);
        }
    }
    return documents;
}

async function get(id) {
    let doc = await documentModel.findByPk(id);
    doc.dataValues['text'] = await fileManager.readFile(doc.filename) // TODO find a better way of adding attributes?
    return doc;
}

async function create(item) {   // TODO make this a atomic transaction!
    if (item.id)
        item.id = undefined;
    if (!item.text)
        throw Error("no text specified");
    let hash = hashing.sha256Hash(item.text);
    let ts = Date.now();
    let cor = await corpusModel.findByPk(item.c_id);
    let corpusDocuments = await cor.getDocuments();
    for (let doc of corpusDocuments) {
        if (doc.document_hash === hash) throw Error("file content already present in this corpus");
    }
    let [doc, created] = await documentModel.findOrCreate({
        where: {
            c_id: item.c_id,
            filename: item.filename,
            document_hash: hash,
            last_edited: ts
        }
    });
    if (item.text) await fileManager.saveFile(doc.filename, !created, item.text);
    doc.dataValues['text'] = item.text;
    return doc;
}

async function del(id) {  // TODO make this a atomic transaction!
    let doc = await documentModel.findByPk(id);
    await documentModel.destroy({where: {d_id: id}});
    await fileManager.deleteFile(doc.filename);
    return id;
}

async function update(id, item) {   // TODO make this a atomic transaction!
    if (item.id) {
        if (item.id !== id) {
            console.warn("request for item update has different ids, setting id to url param");
            item.id = id;
        }
    }
    try {
        let old_doc = await documentModel.findByPk(id);
        let updatesArray = await documentModel.update(item, {where: {d_id: id}});
        // TODO do something with return value (seems to be very ambiguous)
        let new_doc = await documentModel.findByPk(id);
        if (new_doc.filename !== old_doc.filename) await fileManager.moveFile(old_doc.filename, new_doc.filename);
        new_doc.dataValues['text'] = await fileManager.readFile(new_doc.filename);
        return new_doc;
    } catch (e) {
        throw e;
    }
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
