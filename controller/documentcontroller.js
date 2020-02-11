let {document} = require('../persitence/sql/document');
let {connection} = require('../persitence/sql/sequelize');
let fileManager = require('../persitence/filesystem/filemanager');

async function listAll() {
    let documents = await document.findAll();
    if (documents) {
        for (let document of documents) { // TODO error handling when operations fail have way through...
            document.text = await fileManager.readFile(document.fileName);
        }
    }
    return documents;
}

async function get(id) {
    let doc = await document.findByPk(id);
    doc.text = await fileManager.readFile(doc.fileName);
}

async function create(item) {   // TODO make this a atomic transaction!
    if (item.id)
        item.id = undefined;
    let [document, created] = await document.findOrCreate({
        where: {
            fileName: item.fileName
        }
    });
    if (item.text) await fileManager.saveFile(document.filename, !created, item.text);
    document.text = item.text;
    return document;
}

async function del(id) {  // TODO make this a atomic transaction!
    let doc = await document.findByPk(id);
    await document.destroy({where: {d_id: id}});
    await fileManager.deleteFile(doc.fileName);
    return id;
}

async function update(id, item) {   // TODO make this a atomic transaction!
    if (item.id) {
        if (item.id !== id) {
            console.warn("request for item update has different ids, setting id to url param");
            item.id = id;
        }
    }
    let updatesArray = await document.update(item, {where: {d_id: id}});
    if (updatesArray && updatesArray.size === 1) {
        return document.findByPk(id);
    } else {
        throw Error("failed to updates items properly");
    }
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create,

};
