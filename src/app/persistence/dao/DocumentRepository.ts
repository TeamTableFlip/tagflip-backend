import {Singleton} from "typescript-ioc";
import "../index";
import {GenericRepository} from "./GenericRepository";
import {Identifier} from "sequelize";
import {Document} from "../model/Document";
import {ValidationError} from "../../exception/ValidationError";
import * as HttpStatus from "http-status-codes";
import {TagFlipErrorCode} from "@fhswf/tagflip-common";

@Singleton
export class DocumentRepository extends GenericRepository<Document> {

    constructor() {
        super(Document);
    }

    public isNew(id: Identifier): boolean {
        return id == null || Number.isNaN(id) || id <= 0;
    }

    public getId(entity: Document): Identifier {
        return entity.documentId;
    }

    public async validate(entity: Document): Promise<void | never> {
        let other = await this.repository.findOne({where: {documentHash: entity.documentHash}});
        if(other && other.corpusId === entity.corpusId) {
            throw new ValidationError(HttpStatus.UNPROCESSABLE_ENTITY, TagFlipErrorCode.CORPUS_DOCUMENT_SAME_CONTENT_FOUND, "Corpus already contains Document with same content as '" +entity.filename+ "'.");
        }
    }

}
