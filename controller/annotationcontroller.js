let {annotation} = require('../persitence/sql/annotation');
let baseController = require('./basecontroller');

function listAll() {
    return baseController.listAll()(annotation);
}

function get(id) {
    return baseController.get(id)(annotation);
}

function create(item) {
    let findOrCreateOptions = {
        where: {
            color: item.color,
            name: item.name,
            s_id: item.s_id
        }
    };
    return baseController.create(item)(annotation, findOrCreateOptions);
}

function del(id) {
    return baseController.del(id)(annotation, 'a_id');
}

function update(id, item) {
    return baseController.update(id, item)(annotation, 'a_id');
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
