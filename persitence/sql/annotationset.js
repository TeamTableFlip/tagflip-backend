const { DataTypes } = require('sequelize');
const { connection } = require('./sequelize');


let annotationset = connection.define('annotationset', {
    s_id: {
        type:  DataTypes.INTEGER({length: 11}),
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'set_name_unique'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = {
    annotationset
};
