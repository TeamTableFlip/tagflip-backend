/*
 * GET /CRUD/corpus            findAll
 * POST /CRUD/corpus           createOne
 * GET /CRUD/corpus/{c_id}     getOne
 * PUT /CRUD/corpus/{c_id}     alterOne
 * DELETE /CRUD/corpus/{c_id}  deleteOne
 */

/**
 * Calls the listAll() function of the controller and resolves its Promise.
 *
 * @param controller The controller to be used.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function listAll(controller) {
    return (req, res, next) => {
        controller.listAll().then(items => {
            res.send(items);
        }).catch((err) => {
            res.status(500).send(err);
        });
    };
}

/**
 * Calls the createOne(object) function of the controller and resolves its Promise.
 *
 * @param controller The controller to be used.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function createOne(controller) {
    return (req, res, next) => {
        controller.createOne(req.body).then(newItem => {
            res.status(200).send(newItem);
        }).catch((err)=>{
            console.error(err);
            res.status(500).send(err);
        });
    };
}

/**
 * Calls the getOne(identifier) function of the controller and resolves its Promise.
 *
 * @param controller The controller to be used.
 * @param property_name The property of req.params to be used, as in controller.getOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function getOne(controller, property_name) {
    return (req, res, next) => {
        controller.getOne(req.params[property_name]).then(item => {
            if (item == null) {
                res.sendStatus(404);
            } else {
                res.status(200).send(item);
            }
        }).catch((err)=>{
            res.status(500).send(err);
        });
    };
}

/**
 * Calls the updateOne(identifier) function of the controller and resolves its Promise.
 *
 * @param controller The controller to be used.
 * @param property_name The property of req.params to be used, as in controller.updateOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function updateOne(controller, property_name) {
    return (req, res, next) => {
        controller.updateOne(req.params[property_name], req.body).then(updatedItem => {
            if (updatedItem) {
                res.status(200).send(updatedItem);
            } else {
                res.sendStatus(404);
            }
        }).catch((err)=>{
            res.status(500).send(err);
        });
    };
}

/**
 * Calls the deleteOne(identifier) function of the controller and resolves its Promise.
 *
 * @param controller The controller to be used.
 * @param property_name The property of req.params to be used, as in controller.deleteOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function deleteOne(controller, property_name) {
    return (req, res, next) => {
        controller.deleteOne(req.params[property_name]).then(deleted => {
            if (deleted) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500); // TODO better responses....
            }
        }).catch((err)=>{
            res.status(500).send(err);
        });
    };
}

module.exports = {
    listAll,
    createOne,
    getOne,
    updateOne,
    deleteOne
};
