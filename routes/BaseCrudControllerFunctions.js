/**
 * provides basic function wrappers for following functionality:
 *
 * for primary type:
 *
 * GET /CRUD/type            findAll
 * POST /CRUD/type           createOne
 * GET /CRUD/type/{t_id}     getOne
 * PUT /CRUD/type/{t_id}     alterOne
 * DELETE /CRUD/type/{t_id}  deleteOne
 *
 * for associated types:
 * (PUT ignores body and only set association for this one)
 *
 * GET /CRUD/type/{t_id}/other              findAllOthers
 * PUT /CRUD/type/{t_id}/other/{o_id}       setOther (aka type.addOther())
 * DELETE /CRUD/type/{t_id}/other/{o_id}    unsetOther (aka type.removeOther())
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
            console.error(err);
            res.sendStatus(500);
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
            res.sendStatus(500);
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
            console.error(err);
            res.sendStatus(500);
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
            console.error(err);
            res.sendStatus(500);
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
            console.error(err);
            res.sendStatus(500);
        });
    };
}

/**
 * Calls add function of the controller for adding reference object and resolves its Promise.
 *
 * @param func The controller-function to be used.
 * @param property_name The property of req.params to be used, as in controller.deleteOne(property).
 * @param other_property_name associated model instance id.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function setOther(func, property_name, other_property_name) {
    return (req, res, next) => {
        func(req.params[property_name], req.params[other_property_name]).then(newItem => {
            res.status(200).send(newItem);
        }).catch((err)=>{
            console.error(err);
            res.sendStatus(500);
        });
    };
}

/**
 * Calls delete function of the controller for removing reference object and resolves its Promise.
 *
 * @param func The controller-function to be used.
 * @param property_name The property of req.params to be used, as in controller.deleteOne(property).
 * @param other_property_name associated model instance id.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function unsetOther(func, property_name, other_property_name ) {
    return (req, res, next) => {
        func(req.params[property_name], req.params[other_property_name]).then(deleted => {
            if (deleted) {
                res.sendStatus(200);
            } else {
                res.sendStatus(500); // TODO better responses....
            }
        }).catch((err)=>{
            console.error(err);
            res.sendStatus(500);
        });
    };
}

/**
 * Calls getter function of the controller for retrieving reference objects.
 *
 * @param func The controller-function to be used.
 * @param property_name The property of req.params to be used, as in controller.deleteOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function listOther(func, property_name ) {
    return (req, res, next) => {
        func(req.params[property_name]).then(items => {
            if (items) {
                res.status(200).send(items);
            } else {
                res.sendStatus(404);
            }
        }).catch((err)=>{
            console.error(err);
            res.sendStatus(500);
        });
    };
}

module.exports = {
    listAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
    setOther,
    unsetOther,
    listOther
};
