const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverEarnings = require("../../../models/driverEarnings");
const CompletedJobs = require("../../../models/completedJobs");
const DriverBills = require("../../../models/driverBills");

var router = express.Router();
router.use(cors());

// GET: getEarnings
router.get("/getEarnings", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverEarnings.findAll({
                    where: { DriverID: result.Driver.DriverID }
                }).then(async driverEarnings => {
                    if (driverEarnings) {
                        let modifiableDriverEarnings = [];
                        let netEarning = 0.0;
                        let count = 0;

                        for (let driverEarning of driverEarnings) {
                            netEarning += driverEarning.Amount;

                            const completedJob = await CompletedJobs.findOne({
                                attributes: ["JobNumber"],
                                where: { CompletedJobID: driverEarning.CompletedJobID }
                            });

                            const driverBill = await DriverBills.findOne({
                                attributes: ["Paid"],
                                where: { DriverBillID: driverEarning.DriverBillID }
                            });

                            let modifiableDriverEarning = driverEarning.dataValues;
                            modifiableDriverEarning.JobNumber = completedJob.JobNumber;
                            modifiableDriverEarning.DuesPaid = driverBill.Paid;

                            modifiableDriverEarnings[count++] = modifiableDriverEarning;
                        }

                        if (modifiableDriverEarnings.length > 0) {
                            modifiableDriverEarnings.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Earnings found.",
                            Earnings: modifiableDriverEarnings,
                            NetEarning: netEarning
                        });
                    }
                    else {
                        response.json({
                            Message: "Earnings not found."
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