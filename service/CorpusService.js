let {corpusModel, annotationsetModel, documentModel, connection} = require('../persitence/sql/Models');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');

async function listAll() {
    return await corpusModel.findAll({
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
    });
}

async function get(id) {
    return await corpusModel.findByPk(id, {
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
    });
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
    getDocumentCount
};
