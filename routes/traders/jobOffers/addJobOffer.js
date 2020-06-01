const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");

var router = express.Router();
router.use(cors());

// POST: addJobOffer
router.post("/addJobOffer", (request, response) => {
    passport.authenticate("AuthenticateTrader", { session: false }, (result) => {
        try {
            if (result.Message === "Trader found.") {
                let newJobOffer = {
                    TraderID: result.Trader.TraderID,
                    TripType: request.body.TripType,
                    CargoType: request.body.CargoType,
                    CargoWeight: request.body.CargoWeight,
                    LoadingPlace: request.body.LoadingPlace,
                    LoadingLat: request.body.LoadingLat,
                    LoadingLng: request.body.LoadingLng,
                    UnloadingPlace: request.body.UnloadingPlace,
                    UnloadingLat: request.body.UnloadingLat,
                    UnloadingLng: request.body.UnloadingLng,
                    LoadingDate: request.body.LoadingDate,
                    LoadingTime: request.body.LoadingTime,
                    TruckModel: null,
                    DriverNationality: null,
                    EntryExit: request.body.EntryExit,
                    AcceptedDelay: request.body.AcceptedDelay,
                    JobOfferType: request.body.JobOfferType,
                    Price: request.body.Price,
                    WaitingTime: 48,
                    TimeCreated: new Date()
                };

                JobOffers.create(newJobOffer).then(() => {
                    response.json({
                        Message: "Job offer is added."
                    });
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