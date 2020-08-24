import {
    DELETE,
    Errors,
    FileParam,
    FilesParam,
    FormParam,
    GET,
    Path,
    PathParam,
    POST,
    PreProcessor, QueryParam
} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {CorpusRepository} from "../persistence/dao/CorpusRepository";
import {DocumentRepository} from "../persistence/dao/DocumentRepository";
import {DocumentImportService} from "../services/documentImport/DocumentImportService";
import {Document} from "../persistence/model/Document";
import {Annotation} from "../persistence/model/Annotation";
import {OrderItem, where} from "sequelize";

@Path("corpus/:corpusId/document")
export class DocumentController {

    @Inject
    private corpusRepository!: CorpusRepository;

    @Inject
    private documentRepository!: DocumentRepository;

    @Inject
    private documentImportService!: DocumentImportService;

    @GET
    public async listDocuments(@PathParam("corpusId") corpusId: number,
                               @QueryParam("count") count?: boolean,
                               @QueryParam("offset") offset?: number,
                               @QueryParam("limit")  limit?: number,
                               @QueryParam("sortField")  sortField?: string,
                               @QueryParam("sortOrder")  sortOrder?: string,
                               ): Promise<Document[] | number> {
        if(count) {
            return this.documentRepository.count({
                where: {corpusId}
            });
        }

        let corpus = await this.corpusRepository.read(corpusId);
        let orderBy : OrderItem = ['documentId', 'ASC']
        if(sortField && sortOrder) {
            orderBy = [sortField, sortOrder]
        }
        return corpus.getDocuments({
            limit,
            offset,
            order: [orderBy]
        });
    }

    @Path(":id")
    @GET
    public async read(@PathParam("corpusId") corpusId: number, @PathParam("id") documentId: number): Promise<Document> {
        let document = await this.documentRepository.read(documentId, 'full');
        if (document.corpusId !== corpusId) {
            throw new Errors.NotFoundError("Given coprus with ID " + corpusId + " does not contain document");
        }
        return document;
    }

    @Path(":id")
    @DELETE
    public async delete(@PathParam("corpusId") corpusId: number, @PathParam("id") documentId: number): Promise<void> {
        let document = await this.documentRepository.read(documentId);
        if (document.corpusId !== corpusId) {
            throw new Errors.NotFoundError("Given coprus with ID " + corpusId + " does not contain document");
        }
        await this.documentRepository.delete(documentId);
    }

    @Path("import")
    @POST
    public async documentImport(@PathParam("corpusId") corpusId: number, @FilesParam("files") files: Express.Multer.File[]): Promise<Document[]> {
        return this.documentImportService.import(corpusId, files);
    }

}
