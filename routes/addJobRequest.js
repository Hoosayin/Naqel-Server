const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Drivers = require("../models/drivers");
const JobRequests = require("../models/jobRequests");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: addJobRequest
router.post("/dashboard/addJobRequest", (req, res) => {
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
                let newJobRequest = {
                    DriverID: driver.DriverID,
                    LoadingPlace: req.body.LoadingPlace,
                    UnloadingPlace: req.body.UnloadingPlace,
                    TripType: req.body.TripType,
                    Price: req.body.Price,
                    WaitingTime: 48,
                    TimeCreated: new Date()
                };

                JobRequests.create(newJobRequest).then(() => {
                    tokenGenerator.generateDriverToken(driver.DriverID, token => {
                        res.json({
                            Message: "Job request is added.",
                            Token: token
                        });
                    });
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