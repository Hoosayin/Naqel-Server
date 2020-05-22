var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "DriverQuestionClasses",
    {
        DriverQuestionClassID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        Class:
        {
            type: databaseHelper.Sequelize.STRING(200),
            allowNull: false
        }
    },
    {
        tableName: "DriverQuestionClasses"
    }    
);