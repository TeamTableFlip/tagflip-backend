const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');

const { annotation } = require('./annotation');
const { document } = require('./document');

let tag = connection.define('tag', {
    t_id: {
        type: DataTypes.INTEGER({length: 11}),
        primaryKey: true,
        autoIncrement: true
    },
    d_id: {
        type: DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        allowNull: false
    },
    a_id: {
        type:  DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        allowNull: false
    },
    start_index: {
        type:  DataTypes.INTEGER({length: 11}),
        allowNull: false
    },
    end_index: {
        type:  DataTypes.INTEGER({length: 11}),
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

tag.belongsTo(annotation, {
    as: 'annotation',
    onDelete: 'CASCADE',
    sourceKey: 't_id',
    foreignKey: 'a_id'
});

annotation.hasMany(tag, {
    as: 'tags',
    sourceKey: 'a_id',
    foreignKey: 'a_id'
});

tag.belongsTo(document, {
    as: 'document',
    foreignKey: 'd_id',
    sourceKey: 't_id',
    onDelete: 'CASCADE'
});

document.hasMany(tag,  {
    as: 'tags',
    sourceKey: 'd_id',
    foreignKey: 'd_id'
});

module.exports = {
    tag
};
