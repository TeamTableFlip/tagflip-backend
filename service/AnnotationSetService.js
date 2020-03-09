let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');
let {annotationsetModel, corpusModel} = require('../persitence/sql/Models');

/**
 * according to BaseCrudServiceFunctions.listAll() returns all AnnotationSets.
 * @returns {Promise<Object[]>}
 */
function listAll() {
    return BaseCrudServiceFunctions.listAll()(annotationsetModel);
}

/**
 * according to BaseCrudServiceFunctions.get() returns a AnnotationSet.
 * @param id prim key of entity
 * @returns {Promise<Object>}
 */
function get(id) {
    return BaseCrudServiceFunctions.get(id)(annotationsetModel);
}

/**
 * according to BaseCrudServiceFunctions.create creates a entity and returns it.
 * @param item
 * @returns {Promise<Object>}
 */
function create(item) {
    let optionsValidator = (findOptions)=> new Promise((resolve, reject) => {
        let valid = true;
        let failReasons = [];
        if (findOptions.where.name === undefined || findOptions.where.name === null ||
            (typeof findOptions.where.name !== "string")) {
            valid = false;
            failReasons.push("specified name incorrect, name is " + String(findOptions.where.name));
        }
        if (findOptions.defaults.description === undefined || findOptions.defaults.description === null ||
            (typeof findOptions.defaults.description !== "string")) {
            findOptions.defaults.description = null;
        }
        if (valid) resolve();
        else reject(Error(failReasons.join(" ; ")));
    });

    let findOrCreateOptions = {
        where: {
            name: item.name,
        },
        defaults:  {
            description: item.description
        }
    };
    return BaseCrudServiceFunctions.create(item)(annotationsetModel, findOrCreateOptions, optionsValidator);
}

/**
 * according to BaseCrudServiceFunctions.del deletes item with id as prim key.
 * @param id
 * @returns {Promise<int>} id of deleted item
 */
function del(id) {
    return BaseCrudServiceFunctions.del(id)(annotationsetModel, 's_id');
}

/**
 * updates item prim key id with data in item. See BaseCrudServiceFunctions.update.
 * @param id
 * @param item
 * @returns {Promise<Object>}
 */
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

/**
 * get corpora connected to  annotationset s_id.
 *
 * @param s_id
 * @returns {Promise<*>}
 */
async function getCorpora(s_id) {
    let set = await annotationsetModel.findByPk(s_id);
    return await set.getCorpus();
}

/**
 * get Annotations connected to annotationset s_id.
 *
 * @param s_id
 * @returns {Promise<*>}
 */
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
