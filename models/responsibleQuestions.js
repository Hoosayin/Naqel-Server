var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "ResponsibleQuestions",
    {
        ResponsibleQuestionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TransportCompanyResponsibleID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "TransportCompanyResponsibles",
                key: "TransportCompanyResponsibleID"
            }
        },
        QuestionNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        Question:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Class:
        {
            type: databaseHelper.Sequelize.STRING(100),
            allowNull: true
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "ResponsibleQuestions"
    }    
);