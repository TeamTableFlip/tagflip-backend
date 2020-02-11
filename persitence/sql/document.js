const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');
const { corpus } = require('./corpus');


let document =  connection.define('document', {
    d_id: {
        type:  DataTypes.INTEGER({length: 11}),
        primaryKey: true,
        autoIncrement: true
    },
    c_id: {
        type:  DataTypes.INTEGER({length: 11}),
        foreignKey: true,
        allowNull: false,
        unique: 'unique_doc_per_corpus'
    },
    filename: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    last_edited: {
        type: DataTypes.DATE,
        allowNull: true
    },
    document_hash: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: 'unique_doc_per_corpus'
    }
}, {
    timestamps: false,
    freezeTableName: true
});

document.belongsTo(corpus, {
    as: 'corpus',
    foreignKey: 'c_id',
    sourceKey: 'd_id',
    onDelete: 'CASCADE'
});

corpus.hasMany(document, {
    as: 'documents',
    sourceKey: 'c_id',
    foreignKey: 'c_id'
});


module.exports = {
    document
};
