import {AutoIncrement, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {Document} from "./Document";
import {TagAttributes} from "tagflip-common";
import {Annotation} from "./Annotation";

@Table({
    tableName: "tag"
})
export class Tag extends Model<Tag> implements TagAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column({ field:"tag_id" })
    tagId!: number

    @Column({ field:"start_index" })
    startIndex!: number;

    @Column({ field:"end_index" })
    endIndex!: number;

    @ForeignKey(() => Document)
    @Column({field: 'document_id'})
    documentId!: number;

    @ForeignKey(() => Annotation)
    @Column({field: 'annotation_id'})
    annotationId!: number;

    @CreatedAt
    @Column({field:'created_at'})
    createdAt!: Date

    @UpdatedAt
    @Column({field:'updated_at'})
    updatedAt!: Date


}
