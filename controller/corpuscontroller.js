let {corpus} = require('../persitence/sql/corpus');
let {connection} = require('../persitence/sql/sequelize');

function listAll() {
    return new Promise((resolve, reject) => {
        corpus.findAll().then( (corpus) => {
            resolve(corpus);
        }).catch((err)=>reject(err))
    })
}

function get(id) {
    return new Promise((resolve, reject) => {
        corpus.findByPk(id).then((instance) => {
            resolve(instance);
        }).catch((err)=>reject(err))
    })
}

function create(item) {
    if (item.id)
        item.id = undefined;
    return new Promise((resolve, reject) => {
            corpus.findOrCreate({
                where: {
                    description: item.description,
                    name: item.name
                }
            }).then((instance, created) => {
                resolve(instance);
            }).catch((err)=>reject(err))
    })
}

function del(id) {
    return new Promise((resolve, reject) => {
        corpus.destroy({where: {c_id: id}}).then(() => {
            resolve(id);
        }).catch((err)=>reject(err))
    })
}

function update(id, item) {
    if (item.id) {
        if (item.id !== id) {
            console.warn("request for item update has different ids, setting id to url param");
            item.id = id;
        }
    }
    return new Promise((resolve, reject) => {
        corpus.update(item, {where: {c_id: id}}).then( (updatesArray) => {
            if (updatesArray) { //TODO check if rows where actual updated
                corpus.findByPk(id).then((updatedItem) => {
                    resolve(updatedItem);
                }).catch((err) => reject(err));
            } else {
                resolve(null);
            }
        }).catch((err)=>reject(err))
    })
}


module.exports = {
    listAll: listAll,
    getOne: get,
    updateOne: update,
    deleteOne: del,
    createOne: create
};
