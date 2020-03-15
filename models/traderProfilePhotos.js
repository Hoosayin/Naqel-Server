var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "TraderProfilePhotos",
    {
        ProfilePhotoID:
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
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        DateUploaded:
        {
            type: databaseHelper.Sequelize.DATEONLY,
            defaultValue: databaseHelper.Sequelize.NOW,
            allowNull: false
        },
        FileName:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
    },
    {
        tableName: "TraderProfilePhotos"
    }    
);