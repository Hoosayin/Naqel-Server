var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderQuestionClasses",
    {
        TraderQuestionClassID:
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
        tableName: "TraderQuestionClasses"
    }    
);