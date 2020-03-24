var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "FixedPriceJobOffers",
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
        FixedPrice:
        {
            type: databaseHelper.Sequelize.FLOAT,
            allowNull: false
        }
    },
    {
        tableName: "FixedPriceJobOffers"
    }    
);