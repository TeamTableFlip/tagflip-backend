import {Table, Column, Model, HasMany, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import {Corpus} from "./Corpus";
import {AnnotationSet} from "./AnnotationSet";

@Table({
    tableName: "corpus_to_annotationset"
})
export class CorpusToAnnotationSet extends Model<CorpusToAnnotationSet> {

    @Column({ field:"corpus_id" })
    @ForeignKey(() => Corpus)
    corpusId!: number;

    @Column({ field:"annotationset_id" })
    @ForeignKey(() => AnnotationSet)
    annotationSetId!: number;

    @CreatedAt
    @Column({field:'created_at'})
    createdAt!: Date

    @UpdatedAt
    @Column({field:'updated_at'})
    updatedAt!: Date
}
