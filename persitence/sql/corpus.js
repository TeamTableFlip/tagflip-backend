const { DataTypes } = require('sequelize');

/**
 * Function to create Corpus Model
 *
 * @param connection: sequelize connection object
 * @returns {Model|void}
 */
let corpus = (connection) => {
    return connection.define('corpus', {
        c_id: {
            type:  DataTypes.INTEGER({length: 11}),
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};

module.exports = {
   corpus
};
