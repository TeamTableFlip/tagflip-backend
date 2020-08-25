import {Singleton} from "typescript-ioc";
import {GenericRepository} from "./GenericRepository";
import {AnnotationSet} from "../model/AnnotationSet";
import {Identifier} from "sequelize";
import {ValidationError} from "../../exception/ValidationError";
import * as HttpStatus from 'http-status-codes'
import {TagFlipErrorCode} from "@fhswf/tagflip-common";

@Singleton
export class AnnotationSetRepository extends GenericRepository<AnnotationSet>{

    constructor() {
        super(AnnotationSet);
    }

    public isNew(id: Identifier): boolean {
        return id == null || Number.isNaN(id) || id <= 0;
    }

    public getId(entity: AnnotationSet): Identifier {
        return entity.annotationSetId;
    }

    public async validate(entity: AnnotationSet): Promise<void | never> {
        let other = await this.repository.findOne({where: {name: entity.name}});
        if(other && other.annotationSetId !== entity.annotationSetId) {
            throw new ValidationError(HttpStatus.UNPROCESSABLE_ENTITY, TagFlipErrorCode.ANNOTATION_SET_NAME_ALREADY_TAKEN, "Name for Annotation Set is already taken.");
        }
    }

}
