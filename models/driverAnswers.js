var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverAnswers",
    {
        DriverAnswerID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverQuestionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "DriverQuestions",
                key: "DriverQuestionID"
            }
        },
        AdministratorID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "Administrators",
                key: "AdministratorID"
            }
        },
        Answer:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Edited:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "DriverAnswers"
    }    
);