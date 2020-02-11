let {corpusModel, annotationsetModel, documentModel} = require('../persitence/sql/sequelize');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(corpusModel);
}

function get(id) {
    return baseController.get(id)(corpusModel);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            description: item.description,
            name: item.name
        }
    };
    return baseController.create(item)(corpusModel, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(corpusModel, 'c_id');
}

function update(id, item) {
    return baseController.update(id, item)(corpusModel, 'c_id');
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
    await corp.addAnnotationset(set);
    return true;
}

async function removeAnnotationset(c_id, s_id) {
    let corp = await corpusModel.findByPk(c_id);
    let set = await annotationsetModel.findByPk(s_id);
    await corp.removeAnnotationset(set);
    return true;
}

async function getAnnotationsets(c_id) {
    let corp = await corpusModel.findByPk(c_id);
    return corp.getAnnotationsets();
}

async function getDocuments(c_id) {
    let corp = await corpusModel.findByPk(c_id);
    return corp.getDocuments();
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
    getAnnotationsets
};
