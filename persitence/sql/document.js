const { DataTypes } = require('sequelize');

/**
 * Function to create Document Model
 *
 * @param connection: sequelize connection object
 * @returns {Model|void}
 */
let document =  (connection) => {
    return connection.define('document', {
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
};


module.exports = {
    document
};
