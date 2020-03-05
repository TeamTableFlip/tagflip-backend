/**
 * class UserError.
 * specifies an Error created by incorrect input.
 */
class UserError extends Error {
    constructor(message = "",  ...params) {
        super(...params);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserError)
        }
        this.name = 'UserError'
    }
}

/**
 * class SystemError.
 * specifies an Error created by some bug.
 */
class SystemError extends Error {
    constructor(message = "",  ...params) {
        super(...params);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SystemError)
        }
        this.name = 'SystemError'
    }
}

/**
 * class NotFoundError.
 * specifies an Error where a resource was not found.
 */
class NotFoundError extends Error {
    constructor(message = "",  ...params) {
        super(...params);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError)
        }
        this.name = 'NotFoundError'
    }
}

/**
 * class AuthenticationError.
 * specifies an Error where a resource can not be accessed by security constraints.
 */
class AuthenticationError extends Error {
    constructor(message = "",  ...params) {
        super(...params);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError)
        }
        this.name = 'AuthenticationError'
    }
}

/**
 * class ConflictError.
 * specifies an Error where a resource conflicts with already existing resource(s).
 */
class ConflictError extends Error {
    constructor(message = "",  ...params) {
        super(...params);
        this.message = message;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConflictError)
        }
        this.name = 'ConflictError'
    }
}


module.exports = {
    NotFoundError, SystemError, UserError, AuthenticationError, ConflictError
};
