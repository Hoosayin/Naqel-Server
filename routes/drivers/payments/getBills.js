const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverBills = require("../../../models/driverBills");
const CompletedJobs = require("../../../models/completedJobs");
const DriverPayProofs = require("../../../models/driverPayProofs");

var router = express.Router();
router.use(cors());

// GET: getBills
router.get("/getBills", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverBills.findAll({
                    where: { DriverID: result.Driver.DriverID }
                }).then(async driverBills => {
                    if (driverBills) {
                        let modifiableDriverBills = [];
                        let count = 0;
                        let countPaid = 0;
                        let countUnpaid = 0;

                        for (let driverBill of driverBills) {
                            if (driverBill.Paid) {
                                countPaid++;
                            }
                            else {
                                countUnpaid++;
                            }

                            const completedJob = await CompletedJobs.findOne({
                                attributes: ["JobNumber"],
                                where: { CompletedJobID: driverBill.CompletedJobID }
                            });

                            const driverPayProof = await DriverPayProofs.findOne({
                                where: { DriverBillID: driverBill.DriverBillID }
                            });

                            let modifiableDriverBill = driverBill.dataValues;
                            modifiableDriverBill.JobNumber = completedJob.JobNumber;
                            modifiableDriverBill.HasPayProof = driverPayProof ? true : false;

                            modifiableDriverBills[count++] = modifiableDriverBill;
                        }

                        if (modifiableDriverBills.length > 0) {
                            modifiableDriverBills.sort((a, b) => {
                                let dateA = new Date(a.Created);
                                let dateB = new Date(b.Created);
                                return dateB - dateA;
                            });
                        }

                        response.json({
                            Message: "Bills found.",
                            Bills: modifiableDriverBills,
                            NumberOfPaidBills: countPaid,
                            NumberOfUnpaidBills: countUnpaid
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