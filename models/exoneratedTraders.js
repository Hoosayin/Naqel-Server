var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "ExoneratedTraders",
    {
        ExoneratedTraderID:
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
        ExonerateDate:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        },
        Reason:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },  
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        }
    },
    {
        tableName: "ExoneratedTraders"
    },
    {
        timestamps: false
    }
);