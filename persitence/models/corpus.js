const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('corpus', {
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
    })
};
