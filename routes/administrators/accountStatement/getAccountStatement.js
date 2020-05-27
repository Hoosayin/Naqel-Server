const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const NaqelTransactions = require("../../../models/naqelTransactions");
const Drivers = require("../../../models/drivers");
const Traders = require("../../../models/traders");
const NaqelSettingsHelper = require("../../../helpers/naqelSettingsHelper");

var router = express.Router();
router.use(cors());

// GET: getAccountStatement
router.get("/getAccountStatement", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                NaqelSettingsHelper.GetNaqelSettings(async result => {
                    let naqelSettings = result.NaqelSettings;

                    NaqelTransactions.findAll().then(async naqelTransactions => {
                        let modifiableNaqelTransactions = [];
                        let count = 0;
                        let netAmount = 0.0;

                        if (naqelTransactions) {
                            for (let naqelTransaction of naqelTransactions) {
                                let user;
                                netAmount += naqelTransaction.Amount;

                                if (naqelTransaction.UserType === "Driver") {
                                    user = await Drivers.findOne({
                                        attributes: ["Username"],
                                        where: { DriverID: naqelTransaction.DriverID }
                                    });
                                }
                                else {
                                    user = await Traders.findOne({
                                        attributes: ["Username"],
                                        where: { TraderID: naqelTransaction.TraderID }
                                    });
                                }

                                let modifiableNaqelTransaction = naqelTransaction.dataValues;
                                modifiableNaqelTransaction.Payee = user.Username;

                                modifiableNaqelTransactions[count++] = modifiableNaqelTransaction;
                            }
                        }

                        let accountStatement = {
                            NaqelSettings: naqelSettings,
                            Transactions: modifiableNaqelTransactions,
                            NetAmount: netAmount
                        };

                        response.json({
                            Message: "Account statement found.",
                            AccountStatement: accountStatement
                        });
                    });
                });
            }
            else {
                response.json({
                    Message: result.Message
                });
            }
        } catch (error) {
            response.json({
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;