import {DELETE, Errors, GET, Path, PathParam, POST, PUT} from "typescript-rest";
import {Inject} from "typescript-ioc";
import {Annotation} from "../persistence/model/Annotation";
import {AnnotationSetRepository} from "../persistence/dao/AnnotationSetRepository";
import {AnnotationRepository} from "../persistence/dao/AnnotationRepository";

@Path("test")
export class TestController {

    @GET
    public test(): void {
        console.log("test")
    }

}
