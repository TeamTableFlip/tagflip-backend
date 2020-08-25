import {AutoIncrement, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Document} from "./Document";
import {TagAttributes} from "@fhswf/tagflip-common";
import {Annotation} from "./Annotation";

@Table({
    tableName: "tag"
})
export class Tag extends Model<Tag> implements TagAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column
    tagId!: number

    @Column
    startIndex!: number;

    @Column
    endIndex!: number;

    @ForeignKey(() => Document)
    @Column
    documentId!: number;

    @ForeignKey(() => Annotation)
    @Column
    annotationId!: number;

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date


}
