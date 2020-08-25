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
import {AnnotationAttributes} from "@fhswf/tagflip-common";

@Table({
    tableName: "annotation"
})
export class Annotation extends Model<Annotation> implements AnnotationAttributes{

    @PrimaryKey
    @AutoIncrement
    @Column
    annotationId!: number

    @Column
    name!: string;

    @Is(/^\#[a-fA-F0-9]{6}$/)
    @Column
    color!: string;

    @ForeignKey(() => AnnotationSet)
    @Column
    annotationSetId!: number;

    @CreatedAt
    @Column
    createdAt!: Date

    @UpdatedAt
    @Column
    updatedAt!: Date
}
