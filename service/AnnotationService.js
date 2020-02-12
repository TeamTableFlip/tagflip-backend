let {annotationModel} = require('../persitence/sql/models');
let BaseCrudServiceFunctions = require('./BaseCrudServiceFunctions');

function listAll() {
    return BaseCrudServiceFunctions.listAll()(annotationModel);
}

function get(id) {
    return BaseCrudServiceFunctions.get(id)(annotationModel);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            color: item.color,
            name: item.name,
            s_id: item.s_id
        }
    };
    return BaseCrudServiceFunctions.create(item)(annotationModel, findOrCreateOptions);
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
