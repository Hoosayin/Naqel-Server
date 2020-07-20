var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TruckTypes",
    {
        TruckTypeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TruckType:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "TruckTypes"
    }    
);