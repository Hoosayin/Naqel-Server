var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "AuctionableJobOffers",
    {
        ID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        JobOfferID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "JobOffers",
                key: "JobOfferID"
            }
        },
        MaximumAcceptedaPrice:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        }
    },
    {
        tableName: "AuctionableJobOffers"
    }    
);