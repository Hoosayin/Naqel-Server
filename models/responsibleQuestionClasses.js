var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "ResponsibleQuestionClasses",
    {
        ResponsibleQuestionClassID:
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
        tableName: "ResponsibleQuestionClasses"
    }    
);