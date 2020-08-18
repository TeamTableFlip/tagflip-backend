import {
    Table,
    Column,
    Model,
    HasMany,
    PrimaryKey,
    UpdatedAt,
    CreatedAt,
    AutoIncrement,
    ForeignKey, Is
} from 'sequelize-typescript';
import {AnnotationSet} from "./AnnotationSet";
import {AnnotationAttributes} from "tagflip-common";

@Table({
    tableName: "annotation"
})
export class Annotation extends Model<Annotation> implements AnnotationAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column({ field:"annotation_id" })
    annotationId!: number

    @Column
    name!: string;

    @Is(/^\#[a-fA-F0-9]{6}$/)
    @Column
    color!: string;

    @ForeignKey(() => AnnotationSet)
    @Column({field: 'annotationset_id'})
    annotationSetId!: number;

    @CreatedAt
    @Column({field:'created_at'})
    createdAt!: Date

    @UpdatedAt
    @Column({field:'updated_at'})
    updatedAt!: Date
}
