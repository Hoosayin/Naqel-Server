const databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "DriverReviews",
    {
        DriverReviewID:
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
        CompletedJobID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: true,
            references:
            {
                model: "CompletedJobs",
                key: "CompletedJobID"
            }
        },
        Rating:
        {
            type: databaseHelper.Sequelize.INTEGER,
            allowNull: false
        },
        Review:
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
        tableName: "DriverReviews"
    }
);