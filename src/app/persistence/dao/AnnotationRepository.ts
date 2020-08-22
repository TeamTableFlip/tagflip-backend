import {Singleton} from "typescript-ioc";
import "../index";
import {GenericRepository} from "./GenericRepository";
import {Identifier} from "sequelize";
import {Annotation} from "../model/Annotation";
import {ValidationError} from "../../exception/ValidationError";
import * as HttpStatus from "http-status-codes";
import {TagFlipErrorCode} from "@fhswf/tagflip-common";

@Singleton
export class AnnotationRepository extends GenericRepository<Annotation>{

    constructor() {
        super(Annotation);
    }

    public isNew(id: Identifier): boolean {
        return id == null || Number.isNaN(id) || id <= 0;
    }

    public getId(entity: Annotation): Identifier {
        return entity.annotationId;
    }

    public async validate(entity: Annotation): Promise<void | never> {
        let other = await this.repository.findOne({where: {name: entity.name, annotationSetId: entity.annotationSetId}});
        if(other && other.annotationId !== entity.annotationId) {
            throw new ValidationError(HttpStatus.UNPROCESSABLE_ENTITY, TagFlipErrorCode.ANNOTATION_NAME_ALREADY_TAKEN, "Name for Annotation is already taken.");
        }
    }


}
