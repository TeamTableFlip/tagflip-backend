let {UserError, SystemError, NotFoundError, ConflictError, AuthenticationError} = require('../service/Exceptions');

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
 * checks for custom Exceptions defined in ..//service/Exceptions.js
 * @param res response object for sending back Http Status Codes
 * @returns {Function} error handler function
 * @private
 */
function _errorHandler(res) {
    return (err) => {
        console.error(err);
        if (err instanceof UserError)
            res.sendStatus(400);
        else if (err instanceof NotFoundError)
            res.sendStatus(404);
        else if (err instanceof ConflictError)
            res.sendStatus(409);
        else if (err instanceof AuthenticationError)
            res.sendStatus(401);
        else if (err instanceof SystemError)
            res.sendStatus(500);
        else
            res.sendStatus(500); // unknown error
    }
}


/**
 * Calls the listAll() function of the service and resolves its Promise.
 *
 * @param service The service to be used.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function listAll(service) {
    return (req, res, next) => {
        service.listAll().then(items => {
            res.send(items);
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls the createOne(object) function of the service and resolves its Promise.
 *
 * @param service The service to be used.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function createOne(service) {
    return (req, res, next) => {
        service.createOne(req.body).then(newItem => {
            res.status(200).send(newItem);
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls the getOne(identifier) function of the service and resolves its Promise.
 *
 * @param service The service to be used.
 * @param property_name The property of req.params to be used, as in service.getOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function getOne(service, property_name) {
    return (req, res, next) => {
        service.getOne(req.params[property_name]).then(item => {
            if (!item) {
                res.sendStatus(404);
            } else {
                res.status(200).send(item);
            }
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls the updateOne(identifier) function of the service and resolves its Promise.
 *
 * @param service The service to be used.
 * @param property_name The property of req.params to be used, as in service.updateOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function updateOne(service, property_name) {
    return (req, res, next) => {
        service.updateOne(req.params[property_name], req.body).then(updatedItem => {
            if (!updatedItem) {
                res.sendStatus(404);
            } else {
                res.status(200).send(updatedItem);
            }
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls the deleteOne(identifier) function of the service and resolves its Promise.
 *
 * @param service The service to be used.
 * @param property_name The property of req.params to be used, as in service.deleteOne(property).
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function deleteOne(service, property_name) {
    return (req, res, next) => {
        service.deleteOne(req.params[property_name]).then(deleted => {
            if (!deleted) {
                res.sendStatus(200);
            } else {
                res.sendStatus(200);
                // res.status(200).send(deleted);
            }
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls add function of the service for adding reference object and resolves its Promise.
 *
 * @param func The service-function to be used.
 * @param property_name The property of req.params to be used, as in service.deleteOne(property).
 * @param other_property_name associated model instance id.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function setOther(func, property_name, other_property_name) {
    return (req, res, next) => {
        func(req.params[property_name], req.params[other_property_name]).then(created => {
            if (!created)
                res.sendStatus(404);
            else
                res.sendStatus(200);
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls delete function of the service for removing reference object and resolves its Promise.
 *
 * @param func The service-function to be used.
 * @param property_name The property of req.params to be used, as in service.deleteOne(property).
 * @param other_property_name associated model instance id.
 * @returns {Function} ExpressJS routing function (req, res, next) => { ... }.
 */
function unsetOther(func, property_name, other_property_name ) {
    return (req, res, next) => {
        func(req.params[property_name], req.params[other_property_name]).then(deleted => {
            if (deleted) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        }).catch(_errorHandler(res));
    };
}

/**
 * Calls getter function of the service for retrieving reference objects.
 *
 * @param func The service-function to be used.
 * @param property_name The property of req.params to be used, as in service.deleteOne(property).
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
        }).catch(_errorHandler(res));
    };
}

/**
 * warpper for document importing with or without zip (defined by importFunc).
 *
 * @param importFunc import function of service.
 * @param propertyName rest resource id.
 * @returns {Function} router function for express.js.
 */
function importWrapper(importFunc, propertyName) {
    return(req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let importPrefix = (req.body.prefix && req.body.prefix.length > 0) ? req.body.prefix : "";
        let uploadedFiles = req.files.file; // file := input form field name
        importFunc(req.params[propertyName], uploadedFiles, importPrefix)
            .then(r => {
                if (r)
                    res.status(200).send(r);
                else
                    res.sendStatus(500);
            })
            .catch(_errorHandler(res));
    }
}

module.exports = {
    listAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
    setOther,
    unsetOther,
    listOther,
    importWrapper
};
