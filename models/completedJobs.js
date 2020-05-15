var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "CompletedJobs",
    {
        CompletedJobID:
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
                model: "Drivers",
                key: "DriverID"
            }
        },
        JobNumber:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
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
        TripType:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        CargoType:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        CargoWeight:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        },
        LoadingPlace:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        UnloadingPlace:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        LoadingDate:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            allowNull: false
        },
        LoadingTime:
        {
            type: databaseHelper.Sequelize.TIME,
            allowNull: false
        },
        EntryExit:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        AcceptedDelay:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false
        },
        Price:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "CompletedJobs"
    }    
);