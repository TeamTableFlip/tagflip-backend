let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');
let {annotationsetModel, corpusModel} = require('../persitence/sql/models');

function listAll() {
    return BaseCrudServiceFunctions.listAll()(annotationsetModel);
}

function get(id) {
    return BaseCrudServiceFunctions.get(id)(annotationsetModel);
}

function create(item) {
    let optionsValidator = (findOptions)=> new Promise((resolve, reject) => {
        let valid = true;
        let failReasons = [];
        if (findOptions.where.name === undefined || findOptions.where.name === null ||
            (typeof findOptions.where.name !== "string")) {
            valid = false;
            failReasons.push("specified name incorrect, name is " + String(findOptions.where.name));
        }
        if (findOptions.where.description === undefined || findOptions.where.description === null ||
            (typeof findOptions.where.description !== "string")) {
            findOptions.where.description = null;
        }
        if (valid) resolve();
        else reject(Error(failReasons.join(" ; ")));
    });

    let findOrCreateOptions = {
        where: {
            description: item.description,
            name: item.name
        }
    };
    return BaseCrudServiceFunctions.create(item)(annotationsetModel, findOrCreateOptions, optionsValidator);
}

function del(id) {
    return BaseCrudServiceFunctions.del(id)(annotationsetModel, 's_id');
}

function update(id, item) {
    return BaseCrudServiceFunctions.update(id, item)(annotationsetModel, 's_id');
}

/**
 * Removes association between annotationset s_id and corpus c_id.
 * Does not delete items.
 *
 * @param s_id source id
 * @param c_id target id
 * @returns {Promise<boolean>}
 */
async function removeCorpus(s_id, c_id) {
    let corp = await corpusModel.findByPk(c_id);
    let set = await annotationsetModel.findByPk(s_id);
    await set.removeCorpus(corp);
    return true;
}

/**
 * Adds corpus with id c_id to annotationset s_id.
 *
 * @param s_id source id
 * @param c_id target id
 * @returns {Promise<boolean>}
 */
async function addCorpus(s_id, c_id) {
    let corp = await corpusModel.findByPk(c_id);
    let set = await annotationsetModel.findByPk(s_id);
    await set.addCorpus(corp);
    return true;
}

async function getCorpora(s_id) {
    let set = await annotationsetModel.findByPk(s_id);
    return await set.getCorpus();
}

async function getAnnotations(s_id) {
    let set = await annotationsetModel.findByPk(s_id);
    return await set.getAnnotations();
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create,
    addCorpus,
    removeCorpus,
    getAnnotations,
    getCorpora
};
