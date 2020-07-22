const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// POST: updateJobOffer
router.post("/updateJobOffer", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                JobOffers.findOne({
                    where: { JobOfferID: request.body.JobOfferID }
                }).then(jobOffer => {
                    if (jobOffer) {
                        let updatedJobOffer = {
                            TripType: request.body.TripType,
                            CargoType: request.body.CargoType,
                            CargoWeight: request.body.CargoWeight,
                            DriverNationalities: request.body.DriverNationalities,
                            TruckTypes: request.body.TruckTypes,
                            TruckSizes: request.body.TruckSizes,
                            LoadingPlace: request.body.LoadingPlace,
                            LoadingLat: request.body.LoadingLat,
                            LoadingLng: request.body.LoadingLng,
                            UnloadingPlace: request.body.UnloadingPlace,
                            UnloadingLat: request.body.UnloadingLat,
                            UnloadingLng: request.body.UnloadingLng,
                            LoadingDate: request.body.LoadingDate,
                            LoadingTime: request.body.LoadingTime,
                            EntryExit: request.body.EntryExit,
                            Price: request.body.Price,
                            WaitingTime: request.body.WaitingTime,
                            PermitType: request.body.PermitType,
                            AcceptedDelay: request.body.AcceptedDelay,
                            JobOfferType: request.body.JobOfferType
                        };

                        JobOffers.update(updatedJobOffer, { where: { JobOfferID: jobOffer.JobOfferID } }).then(() => {
                            response.json({
                                Message: "Job offer is updated."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Job offer not found."
                        });
                    }
                });
            }
            else {
                response.json({
                    Message: "Trader not found."
                });
            }
        } catch (error) {
            response.json({
                Message: error.Message,
            });
        }
    })(request, response);
});

module.exports = router;