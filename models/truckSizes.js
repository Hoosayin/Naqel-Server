var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TruckSizes",
    {
        TruckSizeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TruckSize:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        }
    },
    {
        tableName: "TruckSizes"
    }    
);