import {Table, Column, Model, HasMany, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';
import {Corpus} from "./Corpus";
import {AnnotationSet} from "./AnnotationSet";

@Table({
    tableName: "corpus_to_annotationset"
})
export class CorpusToAnnotationSet extends Model<CorpusToAnnotationSet> {

    @Column
    @ForeignKey(() => Corpus)
    corpusId!: number;

    @Column
    @ForeignKey(() => AnnotationSet)
    annotationSetId!: number;

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date
}
