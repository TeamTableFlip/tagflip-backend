import {DELETE, Errors, FilesParam, GET, Path, PathParam, POST, QueryParam} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {CorpusRepository} from "../persistence/dao/CorpusRepository";
import {DocumentRepository} from "../persistence/dao/DocumentRepository";
import {DocumentImportService} from "../services/documentImport/DocumentImportService";
import {Document} from "../persistence/model/Document";
import {Op, OrderItem} from "sequelize";
import {SearchFilter} from "@fhswf/tagflip-common"
import "reflect-metadata";
import SearchFilterImpl, {ConvertSearchFilter, SearchFilterParam} from "./util/SearchFilter";


@Path("corpus/:corpusId/document")
export class DocumentController {

    @Inject
    private corpusRepository!: CorpusRepository;

    @Inject
    private documentRepository!: DocumentRepository;

    @Inject
    private documentImportService!: DocumentImportService;

    @GET
    @ConvertSearchFilter
    public async listDocuments(@PathParam("corpusId") corpusId: number,
                               @QueryParam("count") count?: boolean,
                               @QueryParam("offset") offset?: number,
                               @QueryParam("limit")  limit?: number,
                               @QueryParam("sortField")  sortField: string = "documentId",
                               @QueryParam("sortOrder")  sortOrder: string = "ASC",
                               @QueryParam("searchFilter") @SearchFilterParam searchFilter?: SearchFilter[]
    ): Promise<Document[] | number> {
        if (count) {
            if (searchFilter) {
                return this.documentRepository.count({where: {[Op.and]: [corpusId, searchFilter.map(s => SearchFilterImpl.toSequelize(s))]}})
            }
            return this.documentRepository.count({where: {corpusId}});
        }

        let corpus = await this.corpusRepository.read(corpusId);
        let options = {limit, offset, order: [[sortField, sortOrder] as OrderItem]}
        if (searchFilter) {
            Object.assign(options, {where: {[Op.and]: searchFilter.map(s => SearchFilterImpl.toSequelize(s))}})
        }

        return corpus.getDocuments(options);
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
