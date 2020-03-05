/**
 * Analog to BaseCrudControllerFunctions.
 * Provides some abstraction for basic crud service operations such as findAll, getOne, etc...
 * The functions return functions that expect a working sequalize model as the first argument.
 *
 * created by Max Kuhmichel.
 */

/**
 * listsAll items from model.
 *
 * @returns {function(model): Promise<[Object]>}
 */
function listAll() {
    return model => {
        return new Promise((resolve, reject) => {
            model.findAll().then((instance) => {
                resolve(instance);
            }).catch((err) => {reject(err)});
        })
    };
}

/**
 * returns one item from model.
 *
 * @param id primary key of db object.
 * @returns {function(model): Promise<Object>}
 */
function get(id) {
    return model => {
        return new Promise((resolve, reject) => {
            model.findByPk(id).then((instance) => {
                resolve(instance);
            }).catch((err) => {reject(err)});
        })
    };
}

/**
 * creates one database instance with data provided by item.
 *
 * Arguments of returning function:
 * First argument = sequalize model
 * Second argument = search query {id: ..., name: ...}
 * Third argument = function to check item for correctness
 *
 * TODO simplify this with basic find check and create in this order.
 *
 * @param item:Object item data
 * @returns {function(model, *=, *=): Promise<Object>}
 */
function create(item) {
    return (model, findOrCreateOptions, // validator is necessary because sequalize does not convert undefined to null.
                optionsValidator = (findOrCreateOptions) => new Promise((resolve, reject) => {resolve()})
            ) => {
        if (item.id)
            item.id = undefined;
        return new Promise((resolve, reject) => {
            optionsValidator(findOrCreateOptions).then(()=> {
                model.findOrCreate(findOrCreateOptions).then(([instance, created]) => {
                    resolve(instance);
                }).catch((err) => {reject(err)});
            }).catch((err)=> {reject(err)});
        })
    }
}

/**
 * deletes item with id from database.
 * id_property_name corresponds to the table column name of primary key.
 * @param id
 * @returns {function(model, string): Promise<int>}
 */
function del(id) {
    return (model, id_property_name) => {
        return new Promise((resolve, reject) => {
            model.destroy({where: {[id_property_name]: id}}).then(() => {
                resolve(id);
            }).catch((err) => {reject(err)});
        })
    };
}

/**
 * updates database entry with id to the values specified in item.
 * resulting function returns the new updated item.
 *
 * @param id
 * @param item
 * @returns {function(model, string): Promise<Object>}
 */
function update(id, item) {
    return (model, id_property_name) => {
        if (item.id) {
            if (item.id !== id) {
                console.warn("request for item update has different ids, setting id to url param");
                item.id = id;
            }
        }
        return new Promise((resolve, reject) => {
            model.update(item, {where: {[id_property_name]: id}}).then((updatesArray) => {
                let updated = false;
                if (updatesArray && updatesArray[0] === 1)
                    updated = true;
                model.findByPk(id).then((updatedItem) => {
                    if (updatedItem === null && updated) {
                        reject(Error("apparently something got updated and its id changed, this should not happen!"));
                    }
                    else resolve(updatedItem);  // covers the following cases:
                    /*
                        if (updatedItem === null && !updated) // return 404 not found => ret null
                        if (updatedItem !== null && !updated) // found but not updated => ret current(old) item
                        if (updatedItem !== null && updated) // found and updated => ret current(new) item
                    }*/
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {reject(err)});
        })
    };
}


module.exports = {
    listAll,
    get,
    create,
    del,
    update
};
