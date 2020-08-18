import {DELETE, GET, Path, PathParam, POST, PUT} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {AnnotationSet} from "../persistence/model/AnnotationSet";
import {AnnotationSetRepository} from "../persistence/dao/AnnotationSetRepository";

@Path("annotationset")
export class AnnotationSetController {

    @Inject
    private annotationSetRepository!: AnnotationSetRepository

    @GET
    public async list(): Promise<AnnotationSet[]> {
        return this.annotationSetRepository.list();
    }

    @Path(":id")
    @GET
    public async read(@PathParam("id") annotationSetId: number): Promise<AnnotationSet> {
        return this.annotationSetRepository.read(annotationSetId);
    }

    @POST
    public async create(annotationSet: AnnotationSet): Promise<AnnotationSet> {
        return this.annotationSetRepository.save(annotationSet);
    }

    @PUT
    public async update(annotationSet: AnnotationSet): Promise<AnnotationSet | null> {
        return this.annotationSetRepository.save(annotationSet);
    }

    @Path(":id")
    @DELETE
    public async delete(@PathParam("id") annotationSetId: number): Promise<void> {
        await this.annotationSetRepository.delete(annotationSetId);
    }

}
