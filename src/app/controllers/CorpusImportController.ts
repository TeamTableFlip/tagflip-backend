import {FilesParam, FormParam, Path, POST} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {Corpus} from '../persistence/model/Corpus';
import {BadRequestError} from 'typescript-rest/dist/server/model/errors';
import {CorpusImportService} from '../services/corpusImport/CorpusImportService';
import {AnnotationSetRepository} from '../persistence/dao/AnnotationSetRepository';


@Path("corpus/import")
export class CorpusImportController {

    @Inject
    private annotationSetRepository!: AnnotationSetRepository;

    @Inject
    private corpusImportService!: CorpusImportService;

    @POST
    public async import(
        @FormParam("name") name: string,
        @FormParam("annotationSetName") annotationSetName: string,
        @FilesParam("files") files: Express.Multer.File[]): Promise<Corpus> {
        if (files.length == 0) {
            throw new BadRequestError("no files were uploaded")
        }
        if (!name) {
            throw new BadRequestError("no name specified")
        }
        if (!annotationSetName) {
            throw new BadRequestError("no annotationSetName specified")
        }

        return this.corpusImportService.import(name, annotationSetName, files);
    }
}
