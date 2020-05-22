var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "TraderAnswers",
    {
        TraderAnswerID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TraderQuestionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "TraderQuestions",
                key: "TraderQuestionID"
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
        tableName: "TraderAnswers"
    }    
);