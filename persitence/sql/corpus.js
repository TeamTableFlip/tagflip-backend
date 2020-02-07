const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');

let corpus = connection.define('corpus', {
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

module.exports = {
   corpus
};
