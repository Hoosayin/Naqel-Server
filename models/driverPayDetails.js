var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "DriverPayDetails",
    {
        DriverPayDetailID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        DriverBillID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "DriverBills",
                key: "DriverBillID"
            }
        },
        CardType:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        OwnerName:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        OwnerEmail:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "DriverPayDetails"
    }    
);