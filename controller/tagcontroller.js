let {tagModel} = require('../persitence/sql/sequelize');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(tagModel);
}

function get(id) {
    return baseController.get(id)(tagModel);
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
    return baseController.create(item)(tagModel, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(tagModel, 't_id');
}

function update(id, item) {
    return baseController.update(id, item)(tagModel, 't_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
