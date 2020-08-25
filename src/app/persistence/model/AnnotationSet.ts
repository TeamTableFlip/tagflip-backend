import {
    Table,
    Column,
    Model,
    HasMany,
    PrimaryKey,
    AllowNull,
    BelongsToMany,
    CreatedAt,
    UpdatedAt, AutoIncrement
} from 'sequelize-typescript';
import {Corpus} from "./Corpus";
import {CorpusToAnnotationSet} from "./CorpusToAnnotationSet";
import {Annotation} from "./Annotation";
import {HasManyAddAssociationMixin, HasManyGetAssociationsMixin} from "sequelize";
import {AnnotationSetAttributes} from "@fhswf/tagflip-common";

@Table({
    tableName: "annotationset"
})
export class AnnotationSet extends Model<AnnotationSet> implements AnnotationSetAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column
    annotationSetId!: number

    @Column
    name!: string;

    @AllowNull
    @Column
    description!: string;

    @HasMany(() => Annotation)
    annotations!: Annotation[];

    @BelongsToMany(() => Corpus, () => CorpusToAnnotationSet)
    corpus!: Corpus[];

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date

    public getAnnotations!: HasManyGetAssociationsMixin<Annotation>;

}
