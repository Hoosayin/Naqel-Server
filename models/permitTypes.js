var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "PermitTypes",
    {
        PermitTypeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        PermitType:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "PermitTypes"
    }    
);