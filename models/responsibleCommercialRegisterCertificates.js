var databaseHelper = require("../helpers/databaseHelper");

module.exports = databaseHelper.sequelize.define(
    "ResponsibleCommercialRegisterCertificates",
    {
        ID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        TransportCompanyResponsibleID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            references:
            {
                model: "TransportCompanyResponsibles",
                key: "TransportCompanyResponsibleID"
            }
        },
        Number:
        {
            type: databaseHelper.Sequelize.STRING(250),
            allowNull: false
        },
        Type:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        },
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        }
    },
    {
        tableName: "ResponsibleCommercialRegisterCertificates"
    }    
);