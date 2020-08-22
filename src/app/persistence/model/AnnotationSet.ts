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
import {AnnotationSetAttributes} from "tagflip-common";

@Table({
    tableName: "annotationset"
})
export class AnnotationSet extends Model<AnnotationSet> implements AnnotationSetAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column({ field:"annotationset_id" })
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
    @Column({field:'created_at'})
    createdAt!: Date

    @UpdatedAt
    @Column({field:'updated_at'})
    updatedAt!: Date

    public getAnnotations!: HasManyGetAssociationsMixin<Annotation>;

}
