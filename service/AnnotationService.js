let {annotationModel} = require('../persitence/sql/Models');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');

function listAll() {
    return BaseCrudServiceFunctions.listAll()(annotationModel);
}

function get(id) {
    return BaseCrudServiceFunctions.get(id)(annotationModel);
}

function create(item) {
    let optionsValidator = (findOptions)=> new Promise((resolve, reject) => {
        let valid = true;
        let failReasons = [];
        if (findOptions.where.color === undefined || findOptions.where.color === null ||
            (typeof findOptions.where.color !== "string") || findOptions.where.color.length !== 7) {
            valid = false;
            failReasons.push("specified color incorrect, name is " + String(findOptions.where.color));
        }
        if (findOptions.where.name === undefined || findOptions.where.name === null ||
            (typeof findOptions.where.name !== "string")) {
            valid = false;
            failReasons.push("specified name incorrect, name is " + String(findOptions.where.name));
        }
        if (valid) resolve();
        else reject(Error(failReasons.join(" ; ")));
    });

    let findOrCreateOptions = {
        where: {
            color: item.color,
            name: item.name,
            s_id: item.s_id
        }
    };
    return BaseCrudServiceFunctions.create(item)(annotationModel, findOrCreateOptions, optionsValidator);
}

function del(id) {
    return BaseCrudServiceFunctions.del(id)(annotationModel, 'a_id');
}

function update(id, item) {
    return BaseCrudServiceFunctions.update(id, item)(annotationModel, 'a_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
