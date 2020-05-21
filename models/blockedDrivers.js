var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "BlockedDrivers",
    {
        BlockedDriverID:
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
        BlockDate:
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
        tableName: "BlockedDrivers"
    },
    {
        timestamps: false
    }
);