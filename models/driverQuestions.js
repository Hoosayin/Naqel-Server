var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverQuestions",
    {
        DriverQuestionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: 'Drivers',
                key: 'DriverID'
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
        tableName: "DriverQuestions"
    }    
);