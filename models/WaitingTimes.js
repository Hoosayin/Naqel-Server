var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "WaitingTimes",
    {
        WaitingTimeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        WaitingTime:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        }
    },
    {
        tableName: "WaitingTimes"
    }    
);