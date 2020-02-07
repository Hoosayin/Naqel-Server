const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Trailers = require("../models/trailers");
const tokenGenerator = require("../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: deleteTrailer
router.post("/dashboard/deleteTrailer", (req, res) => {
    try {
        let driver = jwtDecode(req.body.Token);

        if (driver.Truck) {
            if (driver.Truck.Trailers) {
                Trailers.findOne({
                    where: { TrailerID: req.body.TrailerID }
                }).then(trailer => {
                    if (trailer) {
                        trailer.destroy();

                        tokenGenerator.generateDriverToken(driver.DriverID, token => {
                            res.json({
                                Message: "Trailer is deleted.",
                                Token: token
                            });
                        });
                    }
                    else {
                        res.json({
                            Message: "Trailer not found."
                        });
                    }
                });
            }
            else {
                res.json({
                    Message: "No Trailers Found."
                });
            }
        }
        else {
            res.json({
                Message: "No Truck Found."
            });
        }
    } catch (error) {
        return res.json({
            Message: error
        });
    }
});

module.exports = router;