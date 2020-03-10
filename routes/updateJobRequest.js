const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const JobRequests = require("../models/jobRequests");
const DrivingLicences = require("../models/drivingLicences");
const DriverPermitLicences = require("../models/driverPermitLicences");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateJobRequest
router.post("/dashboard/updateJobRequest", (req, res) => {
    try {
        let driverToken = jwtDecode(req.body.Token);

        Drivers.findOne({
            where: { DriverID: driverToken.DriverID },
        }).then(driver => {
            if (!driver) {
                res.json({
                    Message: "Driver not found."
                });
            }
            else {
                JobRequests.findOne({
                    where: { JobRequestID: req.body.JobRequestID }
                }).then(jobRequest => {
                    if (jobRequest) {
                        let updatedJobRequest = {
                            LoadingPlace: req.body.LoadingPlace,
                            UnloadingPlace: req.body.UnloadingPlace,
                            TripType: req.body.TripType,
                            Price: req.body.Price,
                        };

                        JobRequests.update(updatedJobRequest, { where: { JobRequestID: jobRequest.jobRequestID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Job request is updated.",
                                    Token: token
                                });
                            });
                        });
                        
                    }
                    else {
                        res.json({
                            Message: "Job request not found."
                        });
                    }
                });
            }
        });
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;