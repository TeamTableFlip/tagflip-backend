import {DELETE, GET, Path, PathParam, POST, PUT} from "typescript-rest";
import {Corpus} from "../persistence/model/Corpus";
import {CorpusRepository} from "../persistence/dao/CorpusRepository";
import {Inject} from "typescript-ioc";
import {DocumentRepository} from "../persistence/dao/DocumentRepository";
import {AnnotationSetRepository} from "../persistence/dao/AnnotationSetRepository";
import {AnnotationSet} from "../persistence/model/AnnotationSet";
import {Document} from "../persistence/model/Document";

@Path("corpus")
export class CorpusController {

    @Inject
    private corpusRepository!: CorpusRepository

    @Inject
    private annotationSetRepository!: AnnotationSetRepository

    @Inject
    private documentRepository!: DocumentRepository

    @GET
    public async list(): Promise<Corpus[]> {
        return this.corpusRepository.list();
    }

    @Path(":id")
    @GET
    public async read(@PathParam("id") corpusId: number): Promise<Corpus> {
        return this.corpusRepository.read(corpusId);
    }

    @POST
    public async create(corpus: Corpus): Promise<Corpus> {
        return this.corpusRepository.save(corpus);
    }

    @PUT
    public async update(corpus: Corpus): Promise<Corpus | null> {
        return this.corpusRepository.save(corpus);
    }

    @Path(":id")
    @DELETE
    public async delete(@PathParam("id") corpusId: number): Promise<void> {
        await this.corpusRepository.delete(corpusId);
    }

    @Path(":corpusId/annotationset")
    @GET
    public async listAnnotationSets(@PathParam("corpusId") corpusId: number): Promise<AnnotationSet[]> {
        let corpus = await this.corpusRepository.read(corpusId);
        return corpus.getAnnotationSets();
    }


    @Path(":corpusId/annotationset/:annotationSetId")
    @PUT
    public async addAnnotationSet(@PathParam("corpusId") corpusId: number, @PathParam("annotationSetId") annotationSetId: number): Promise<void> {
        let corpus = await this.corpusRepository.read(corpusId);
        let annotationSet = await this.annotationSetRepository.read(annotationSetId);
        corpus.addAnnotationSet(annotationSet)
    }

    @Path(":corpusId/annotationset/:annotationSetId")
    @DELETE
    public async removeAnnotationSet(@PathParam("corpusId") corpusId: number, @PathParam("annotationSetId") annotationSetId: number): Promise<void> {
        let corpus = await this.corpusRepository.read(corpusId);
        let annotationSet = await this.annotationSetRepository.read(annotationSetId);
        corpus.removeAnnotationSet(annotationSet)
    }

}
