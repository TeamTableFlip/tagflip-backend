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
import {DocumentAttributes} from "@fhswf/tagflip-common";
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
    @Column
    documentId!: number

    @ForeignKey(() => Corpus)
    @Column
    corpusId!: number;

    @Column
    filename!: string;

    @Column
    documentHash!: string;

    @AllowNull
    @Column
    content?: string;

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date

    @HasMany(() => Tag)
    tags!: Tag[];

    @BelongsTo(() => Corpus)
    corpus!: Corpus;

    public getTags!: HasManyGetAssociationsMixin<Tag>;

}
