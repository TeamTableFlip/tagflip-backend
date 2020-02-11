let {tag} = require('../persitence/sql/tag');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(tag);
}

function get(id) {
    return baseController.get(id)(tag);
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
    return baseController.create(item)(tag, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(tag, 't_id');
}

function update(id, item) {
    return baseController.update(id, item)(tag, 't_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
