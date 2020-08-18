import {Inject, Singleton} from "typescript-ioc";
import {CorpusRepository} from "../../persistence/dao/CorpusRepository";
import DocumentExtractor from "./persistors";
import {Document} from "../../persistence/model/Document";

@Singleton
export class DocumentImportService {

    @Inject
    private corpusRepository!: CorpusRepository


    public async import(corpusId: number, files: Express.Multer.File[]) : Promise<Document[]> {
        let totalDocuments = new Array<Document>();
        for (let file of files) {
            totalDocuments.push(...await DocumentExtractor.forType(file.mimetype).persist(corpusId, file));
        }

        return totalDocuments;
    }
}



