const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('annotationset', {
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
    })
};
