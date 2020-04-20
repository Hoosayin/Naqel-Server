var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "JobObjections",
    {
        JobObjectionID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        OnGoingJobID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "OnGoingJobs",
                key: "OnGoingJobID"
            }
        },
        DriverID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "Drivers",
                key: "DriverID"
            }
        },
        TraderID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "Traders",
                key: "TraderID"
            }
        },
        Reason:
        {
            type: databaseHelper.Sequelize.STRING(200),
            allowNull: false
        },
        Comment:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        ObjectionBy:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        }
    },
    {
        tableName: "JobObjections"
    }    
);