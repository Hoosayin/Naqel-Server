const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TraderBills = require("../../../models/traderBills");
const CompletedJobs = require("../../../models/completedJobs");
const TraderPayProofs = require("../../../models/traderPayProofs");
const TraderPayDetails = require("../../../models/traderPayDetails");
const SpecialTraderBills = require("../../../models/specialTraderBills");

var router = express.Router();
router.use(cors());

// GET: getBills
router.get("/getBills", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, result => {
        try {
            if (result.Message === "Trader found.") {
                TraderBills.findAll({
                    where: { TraderID: result.Trader.TraderID }
                }).then(async traderBills => {
                    if (traderBills) {
                        let modifiableTraderBills = [];
                        let count = 0;
                        let countPaid = 0;
                        let countUnpaid = 0;

                        for (let traderBill of traderBills) {
                            if (traderBill.Paid) {
                                countPaid++;
                            }
                            else {
                                countUnpaid++;
                            }

                            const completedJob = await CompletedJobs.findOne({
                                attributes: ["JobNumber"],
                                where: { CompletedJobID: traderBill.CompletedJobID }
                            });

                            const traderPayProof = await TraderPayProofs.findOne({
                                where: { TraderBillID: traderBill.TraderBillID }
                            });

                            const traderPayDetail = await TraderPayDetails.findOne({
                                where: { TraderBillID: traderBill.TraderBillID }
                            });

                            let specialTraderBill = null;

                            if (result.Trader.Type === "Broker") {
                                specialTraderBill = await SpecialTraderBills.findOne({
                                    where: { TraderBillID: traderBill.TraderBillID }
                                });
                            }

                            let modifiableTraderBill = traderBill.dataValues;
                            modifiableTraderBill.JobNumber = completedJob.JobNumber;
                            modifiableTraderBill.SpecialTraderBill = specialTraderBill;
                            modifiableTraderBill.HasPayProof = traderPayProof ? true : false;
                            modifiableTraderBill.HasPayDetails = traderPayDetail ? true : false;

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
                            Bills: modifiableTraderBills,
                            NumberOfPaidBills: countPaid,
                            NumberOfUnpaidBills: countUnpaid,
                            CanRequestSpecialBills: result.Trader.Type === "Broker" ? true : false
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