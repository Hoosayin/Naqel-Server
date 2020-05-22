var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "TraderQuestions",
    {
        TraderQuestionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TraderID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "Traders",
                key: "TraderID"
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
        tableName: "TraderQuestions"
    }    
);