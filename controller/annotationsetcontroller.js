let {annotationset} = require('../persitence/sql/annotationset');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(annotationset);
}

function get(id) {
    return baseController.get(id)(annotationset);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            description: item.description,
            name: item.name
        }
    };
    return baseController.create(item)(annotationset, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(annotationset, 's_id');
}

function update(id, item) {
    return baseController.update(id, item)(annotationset, 's_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
