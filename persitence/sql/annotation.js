const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');

const { annotationset } = require('./annotationset');

let annotation = connection.define('annotation', {
    a_id: {
        type:  DataTypes.INTEGER({length: 11}),
        primaryKey: true,
        autoIncrement: true
    },
    s_id: {
        type: DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        allowNull: false,
        unique: 'set_name_unique'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'set_name_unique'
    },
    color: {
        type: DataTypes.CHAR(7)
    }
}, {
    timestamps: false,
    freezeTableName: true
});

annotation.belongsTo(annotationset, {
    as: 'annotationset',
    foreignKey: 's_id',
    sourceKey: 'a_id',
    onDelete: 'CASCADE'
});

annotationset.hasMany(annotation, {
    as: 'annotations',
    sourceKey: 's_id',
    foreignKey: 's_id'
});

module.exports = {
    annotation
};
