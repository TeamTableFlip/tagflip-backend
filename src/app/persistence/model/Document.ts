import {
    Table,
    Column,
    Model,
    HasMany,
    PrimaryKey,
    UpdatedAt,
    CreatedAt,
    AllowNull,
    BelongsTo, ForeignKey, AutoIncrement, Scopes, DefaultScope
} from 'sequelize-typescript';
import {Tag} from "./Tag";
import {Corpus} from "./Corpus";
import {DocumentAttributes} from "tagflip-common";
import {BuildOptions, HasManyGetAssociationsMixin} from "sequelize";

@DefaultScope(() => ({
    attributes: ['documentId', 'corpusId', 'filename', 'documentHash', 'createdAt', 'updatedAt']
}))
@Scopes(() => ({
    full: {
        attributes: ['documentId', 'corpusId', 'filename', 'documentHash', 'content', 'createdAt', 'updatedAt'],
    },
}))
@Table({
    tableName: "document"
})
export class Document extends Model<Document> implements DocumentAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column({field: "document_id"})
    documentId!: number

    @ForeignKey(() => Corpus)
    @Column({field: 'corpus_id'})
    corpusId!: number;

    @Column
    filename!: string;

    @Column({field: "document_hash"})
    documentHash!: string;

    @AllowNull
    @Column
    content?: string;

    @CreatedAt
    @Column({field:'created_at'})
    createdAt!: Date

    @UpdatedAt
    @Column({field:'updated_at'})
    updatedAt!: Date

    @HasMany(() => Tag)
    tags!: Tag[];

    @BelongsTo(() => Corpus)
    corpus!: Corpus;

    public getTags!: HasManyGetAssociationsMixin<Tag>;

}
