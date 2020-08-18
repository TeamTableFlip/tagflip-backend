import {Singleton} from "typescript-ioc";
import "../index";
import {GenericRepository} from "./GenericRepository";
import {Identifier} from "sequelize";
import {Document} from "../model/Document";
import {ValidationError} from "../../exception/ValidationError";
import * as HttpStatus from "http-status-codes";
import {TagFlipErrorCode} from "tagflip-common";
import {Tag} from "../model/Tag";

@Singleton
export class TagRepository extends GenericRepository<Tag> {

    constructor() {
        super(Tag);
    }

    public isNew(id: Identifier): boolean {
        return id == null || Number.isNaN(id) || id <= 0;
    }

    public getId(entity: Tag): Identifier {
        return entity.tagId;
    }

    public async validate(entity: Tag): Promise<void | never> {

    }

}
