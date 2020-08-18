import {Corpus} from "../model/Corpus";
import {Singleton} from "typescript-ioc";
import "../index";
import {GenericRepository} from "./GenericRepository";
import {Identifier} from "sequelize";
import {Errors} from "typescript-rest";

@Singleton
export class CorpusRepository extends GenericRepository<Corpus>{

    constructor() {
        super(Corpus);
    }

    public isNew(id: Identifier): boolean {
        return id == null || Number.isNaN(id) || id <= 0;
    }

    public getId(entity: Corpus): Identifier {
        return entity.corpusId;
    }

    public async validate(entity: Corpus): Promise<void | never> {
        let other = await this.repository.findOne({where: {name: entity.name}});
        if(other && other.corpusId !== entity.corpusId) {
            throw new Errors.UnprocessableEntityError("Name for Corpus is already taken.");
        }
    }

}
