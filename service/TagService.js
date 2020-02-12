let {tagModel} = require('../persitence/sql/models');
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
    return BaseCrudServiceFunctions.create(item)(tagModel, findOrCreateOptions);
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
