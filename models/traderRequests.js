var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderRequests",
    {
        TraderRequestID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        JobRequestID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "JobRequests",
                key: "JobRequestID"
            }
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
        Selected:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
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
        tableName: "TraderRequests"
    }    
);