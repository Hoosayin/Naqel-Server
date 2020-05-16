var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "DriverPayProofs",
    {
        DriverPayProofID:
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
        PhotoURL:
        {
            type: databaseHelper.Sequelize.TEXT,
            allowNull: false
        },
        Approved:
        {
            type: databaseHelper.Sequelize.INTEGER(1),
            allowNull: false
        },
        Created:
        {
            type: databaseHelper.Sequelize.DATE,
            allowNull: false
        }
    },
    {
        tableName: "DriverPayProofs"
    }    
);