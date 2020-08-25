import {
    Table,
    Column,
    Model,
    HasMany,
    PrimaryKey,
    BelongsToMany,
    AllowNull,
    CreatedAt,
    UpdatedAt, AutoIncrement
} from 'sequelize-typescript';
import {AnnotationSet} from "./AnnotationSet";
import {Document} from "./Document";
import {CorpusToAnnotationSet} from "./CorpusToAnnotationSet";
import {CorpusAttributes} from "@fhswf/tagflip-common";
import {HasManyAddAssociationMixin, HasManyGetAssociationsMixin, HasManyRemoveAssociationMixin} from "sequelize";
import {Annotation} from "./Annotation";

@Table({
    tableName: "corpus"
})
export class Corpus extends Model<Corpus> implements CorpusAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column
    corpusId!: number

    @Column
    name!: string;

    @AllowNull
    @Column
    description!: string;

    @BelongsToMany(() => AnnotationSet, () => CorpusToAnnotationSet)
    annotationSets!: AnnotationSet[];

    @HasMany(() => Document)
    documents!: Document[];

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date

    public addAnnotationSet!: HasManyAddAssociationMixin<AnnotationSet, number>;

    public getAnnotationSets!: HasManyGetAssociationsMixin<AnnotationSet>;

    public removeAnnotationSet!: HasManyRemoveAssociationMixin<AnnotationSet, number>;

    public addDocument!: HasManyAddAssociationMixin<Document, number>;

    public getDocuments!: HasManyGetAssociationsMixin<Document>;
}
