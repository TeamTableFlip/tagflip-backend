let {tagModel} = require('../persitence/sql/Models');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');

function listAll() {
    return BaseCrudServiceFunctions.listAll()(tagModel);
}

function get(id) {
    return BaseCrudServiceFunctions.get(id)(tagModel);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            a_id: item.a_id,
            d_id: item.d_id,
            start_index: item.start_index,
            end_index: item.end_index,
        }
    };

    let optionsValidator = (findOptions)=> new Promise((resolve, reject) => {
        let valid = true;
        let failReasons = [];
        if (findOptions.where.start_index === undefined || findOptions.where.start_index === null ) {
            valid = false;
            failReasons.push("specified start_index missing, start_index is " + String(findOptions.where.start_index));
        }
        if (findOptions.where.end_index === undefined || findOptions.where.end_index === null ) {
            valid = false;
            failReasons.push("specified end_index missing, end_index is " + String(findOptions.where.end_index));
        }
        if (valid) resolve();
        else reject(Error(failReasons.join(" ; ")));
    });

    return BaseCrudServiceFunctions.create(item)(tagModel, findOrCreateOptions, optionsValidator);
}

function del(id) {
    return BaseCrudServiceFunctions.del(id)(tagModel, 't_id');
}

function update(id, item) {
    return BaseCrudServiceFunctions.update(id, item)(tagModel, 't_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
