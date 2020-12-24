var databaseHelper = require('../helpers/databaseHelper');

module.exports = databaseHelper.sequelize.define(
    "AdminPrivileges",
    {
        AdminPrivilegeID:
        {
            type: databaseHelper.Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        Privilege:
        {
            type: databaseHelper.Sequelize.STRING(50),
            allowNull: false
        }
    },
    {
        tableName: "AdminPrivileges"
    }    
);