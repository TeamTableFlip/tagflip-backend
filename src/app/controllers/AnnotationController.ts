import {DELETE, Errors, GET, Path, PathParam, POST, PUT} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {Annotation} from "../persistence/model/Annotation";
import {AnnotationSetRepository} from "../persistence/dao/AnnotationSetRepository";
import {AnnotationRepository} from "../persistence/dao/AnnotationRepository";

@Path("annotationset/:set/annotation")
export class AnnotationController {

    @Inject
    private annotationSetRepository!: AnnotationSetRepository

    @Inject
    private annotationRepository!: AnnotationRepository

    @GET
    public async list(@PathParam("set") annotationSetId: number): Promise<Annotation[]> {
        return this.annotationSetRepository.read(annotationSetId).then(r => r.getAnnotations());
    }

    @Path(":id")
    @GET
    public async read(@PathParam("set") annotationSetId: number, @PathParam("id") annotationId: number): Promise<Annotation> {
        let annotation = await this.annotationRepository.read(annotationId);
        if(annotationSetId !== annotation.annotationSetId) {
            throw new Errors.NotFoundError("Given annotationset with ID " + annotationSetId + " does not contain annotation");
        }
        return annotation
    }

    @POST
    public async create(@PathParam("set") annotationSetId: number, annotation: Annotation): Promise<Annotation> {
        annotation.annotationSetId = annotationSetId;
        annotation = await this.annotationRepository.save(annotation)

        return annotation
    }

    @PUT
    public async update(@PathParam("set") annotationSetId: number, annotation: Annotation): Promise<Annotation | null> {
        annotation.annotationSetId = annotationSetId;
        annotation = await this.annotationRepository.save(annotation);

        return annotation
    }

    @Path(":id")
    @DELETE
    public async delete(@PathParam("set") annotationSetId: number, @PathParam("id") annotationId: number): Promise<void> {
        let annotation = await this.annotationRepository.read(annotationId);
        if(annotationSetId !== annotation.annotationSetId) {
            throw new Errors.NotFoundError("Given annotationset with ID " + annotationSetId + " does not contain annotation");
        }
        await this.annotationRepository.delete(annotationId);
    }

}
