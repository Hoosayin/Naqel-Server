/* jshint indent: 2 */
var databaseHelper = require('../helpers/databaseHelper');
module.exports = databaseHelper.sequelize.define( 'TraderBroker',
    {
    TraderID:
    {
            type: databaseHelper.Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    UserName: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: false
    },
    Password: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: false
    },
    MobileNum: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: false
    },
    FName: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: false
    },
    LName: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: false
    },
    Nationality: {
        type: databaseHelper.Sequelize.TEXT,
      allowNull: false
    },
    EmailAdrs: {
        type: databaseHelper.Sequelize.TEXT,
      allowNull: false
    },
    Gender: {
        type: databaseHelper.Sequelize.TEXT,
      allowNull: false
    },
    BirthDate: {
        type: databaseHelper.Sequelize.DATEONLY,
      allowNull: false
    },
    RegistrationD: {
        type: databaseHelper.Sequelize.DATEONLY,
      allowNull: false
    },
    Address: {
        type: databaseHelper.Sequelize.TEXT,
      allowNull: false
    },
    Active: {
        type: databaseHelper.Sequelize.INTEGER(1),
      allowNull: false
    },
    Type: {
        type: databaseHelper.Sequelize.STRING(50),
      allowNull: false
    },
    BankName: {
        type: databaseHelper.Sequelize.TEXT,
      allowNull: true
    },
    IBAN: {
        type: databaseHelper.Sequelize.STRING(250),
      allowNull: true
    }
  },
    {
        tableName: 'TraderBroker'
    }
);
