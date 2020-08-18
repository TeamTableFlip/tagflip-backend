import {HttpError} from "typescript-rest/dist/server/model/errors";
import {TagFlipErrorCode, TagFlipError} from "tagflip-common";

export class ValidationError extends HttpError implements TagFlipError {

    tagFlipErrorCode?: TagFlipErrorCode | undefined;

    constructor(statusCode: number, tagFlipErrorCode: TagFlipErrorCode, message?: string) {
        super("ValidationError", message || 'Validation Error')
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.tagFlipErrorCode = tagFlipErrorCode
        this.statusCode = statusCode;
    }

}
