function listAll() {
    return model => {
        return new Promise((resolve, reject) => {
            model.findAll().then((instance) => {
                resolve(instance);
            }).catch((err) => reject(err))
        })
    };
}

function get(id) {
    return model => {
        return new Promise((resolve, reject) => {
            model.findByPk(id).then((instance) => {
                resolve(instance);
            }).catch((err) => reject(err))
        })
    };
}

function create(item) {
    return (model, findOrCreateOptions) => {
        if (item.id)
            item.id = undefined;
        return new Promise((resolve, reject) => {
            model.findOrCreate(findOrCreateOptions).then((instance, created) => {
                resolve(instance);
            }).catch((err) => reject(err))
        })
    }
}

function del(id) {
    return (model, id_property_name) => {
        return new Promise((resolve, reject) => {
            model.destroy({where: {[id_property_name]: id}}).then(() => {
                resolve(id);
            }).catch((err) => reject(err))
        })
    };
}

function update(id, item) {
    return (model, id_property_name) => {
        if (item.id) {
            if (item.id !== id) {
                console.warn("request for item update has different ids, setting id to url param");
                item.id = id;
            }
        }
        return new Promise((resolve, reject) => {
            model.update(item, {where: {[id_property_name]: id}}).then((updatesArray) => {
                model.findByPk(id).then((updatedItem) => {
                    resolve(updatedItem);
                }).catch((err) => reject(err));
            }).catch((err) => reject(err))
        })
    };
}


module.exports = {
    listAll,
    get,
    create,
    del,
    update
};
