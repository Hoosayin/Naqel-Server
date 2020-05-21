const express = require("express");
const cors = require("cors");
const Drivers = require("../../../models/drivers");
const DriverIdentityCards = require("../../../models/driverIdentityCards");
const DriverEntryExitCards = require("../../../models/driverEntryExitCards");
const DrivingLicences = require("../../../models/drivingLicences");

var router = express.Router();
router.use(cors());

// GET: getDriverDocuments
router.get("/getDriverDocuments", (request, response) => {
    try {
        Drivers.findOne({
            where: { DriverID: request.query.DriverID }
        }).then(async driver => {
            if (driver) {
                const driverIdentityCard = await DriverIdentityCards.findOne({
                    where: { DriverID: driver.DriverID }
                });

                const driverEntryExitCard = await DriverEntryExitCards.findOne({
                    where: { DriverID: driver.DriverID }
                });

                const drivingLicence = await DrivingLicences.findOne({
                    where: { DriverID: driver.DriverID }
                });

                let driverDocuments = {};

                if (!driverIdentityCard &&
                    !driverEntryExitCard &&
                    !drivingLicence) {
                    driverDocuments = null;
                }
                else {
                    driverDocuments = {
                        IdentityCard: driverIdentityCard,
                        EntryExitCard: driverEntryExitCard,
                        DrivingLicence: drivingLicence
                    };
                }

                response.json({
                    Message: "Driver documents found.",
                    DriverDocuments: driverDocuments
                });
            }
            else {
                response.json({
                    Message: "Driver not found."
                });
            }
        });
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;