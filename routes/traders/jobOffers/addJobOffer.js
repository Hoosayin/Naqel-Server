const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const JobOffers = require("../../../models/jobOffers");
const FixedPriceJobOffers = require("../../../models/fixedPriceJobOffers");
const AuctionableJobOffers = require("../../../models/auctionableJobOffers");

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
                    UnloadingPlace: request.body.UnloadingPlace,
                    LoadingLocation: null,
                    UnloadingLocation: null,
                    LoadingDate: request.body.LoadingDate,
                    LoadingTime: request.body.LoadingTime,
                    TruckModel: null,
                    DriverNationality: null,
                    EntryExit: request.body.EntryExit,
                    AcceptedDelay: request.body.AcceptedDelay,
                    JobOfferType: request.body.JobOfferType,
                    WaitingTime: 48,
                    TimeCreated: new Date()
                };

                JobOffers.create(newJobOffer).then(jobOffer => {
                    if (request.body.JobOfferType === "Fixed-Price") {
                        let newFixedPriceJobOffer = {
                            JobOfferID: jobOffer.JobOfferID,
                            FixedPrice: request.body.Price,
                        };

                        FixedPriceJobOffers.create(newFixedPriceJobOffer).then(() => {
                            response.json({
                                Message: "Job offer is added."
                            });
                        });
                    }
                    else if (request.body.JobOfferType === "Auctionable") {
                        let newAuctionableJobOffer = {
                            JobOfferID: jobOffer.JobOfferID,
                            MaximumAcceptedaPrice: request.body.Price
                        };

                        AuctionableJobOffers.create(newAuctionableJobOffer).then(() => {
                            response.json({
                                Message: "Job offer is added."
                            });
                        });
                    }
                    else {
                        jobOffer.destroy();
                        response.json({
                            Message: "Job offer is not added."
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