const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('corpus_annotationset', {
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
    })
};
