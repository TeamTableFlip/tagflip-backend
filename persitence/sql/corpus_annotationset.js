const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');

const { corpus } = require('./corpus');
const { annotationset } = require('./annotationset');

let corpus_annotationset = connection.define('corpus_annotationset', {
    c_id: {
        type:  DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        primaryKey: true,
        autoIncrement: true
    },
    s_id: {
        type:  DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        primaryKey: true,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

annotationset.belongsToMany(corpus, {
    through: corpus_annotationset,
    sourceKey: 's_id',
    foreignKey: 's_id',
    onDelete: 'CASCADE'
});

corpus.belongsToMany(annotationset, {
    through: corpus_annotationset,
    sourceKey: 'c_id',
    foreignKey: 'c_id',
    onDelete: 'CASCADE'
});

module.exports =  {
    corpus_annotationset
};
