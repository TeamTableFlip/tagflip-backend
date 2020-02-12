let {annotationModel} = require('../persitence/sql/models');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(annotationModel);
}

function get(id) {
    return baseController.get(id)(annotationModel);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            color: item.color,
            name: item.name,
            s_id: item.s_id
        }
    };
    return baseController.create(item)(annotationModel, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(annotationModel, 'a_id');
}

function update(id, item) {
    return baseController.update(id, item)(annotationModel, 'a_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
