const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const Traders = require("../../../models/traders");
const TraderPayProofs = require("../../../models/traderPayProofs");
const TraderPayDetails = require("../../../models/traderPayDetails");

var router = express.Router();
router.use(cors());

// GET: getTradersBills
router.get("/getTradersBills", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                TraderBills.findAll().then(async traderBills => {
                    if (traderBills) {
                        let modifiableTraderBills = [];
                        let count = 0;

                        for (let traderBill of traderBills) {
                            const trader = await Traders.findOne({
                                attributes: ["Username"],
                                where: { TraderID: traderBill.TraderID }
                            });

                            const traderPayProof = await TraderPayProofs.findOne({
                                where: { TraderBillID: traderBill.TraderBillID }
                            });

                            const traderPayDetails = await TraderPayDetails.findOne({
                                where: { traderBillID: traderBill.TraderBillID }
                            });

                            let modifiableTraderBill = traderBill.dataValues;
                            modifiableTraderBill.Username = trader.Username;
                            modifiableTraderBill.TraderPayProof = traderPayProof;
                            modifiableTraderBill.TraderPayDetails = traderPayDetails;

                            modifiableTraderBills[count++] = modifiableTraderBill;
                        }

                        if (modifiableTraderBills.length > 0) {
                            modifiableTraderBills.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Bills found.",
                            Bills: modifiableTraderBills
                        });

                    }
                    else {
                        response.json({
                            Message: "Bills not found."
                        });
                    }
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