
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
