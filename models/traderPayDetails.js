var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderPayDetails",
    {
        TraderPayDetailID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TraderBillID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "TraderBills",
                key: "TraderBillID"
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
        tableName: "TraderPayDetails"
    }    
);