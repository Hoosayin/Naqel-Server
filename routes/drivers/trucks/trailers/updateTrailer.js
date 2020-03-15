const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");
const Trailers = require("../../../../models/trailers");
const tokenGenerator = require("../../../../helpers/tokenGenerator");

var router = express.Router();
router.use(cors());

// POST: updateTrailer
router.post("/updateTrailer", (req, res) => {
    try {
        let driver = jwtDecode(req.body.Token);

        if (driver.Truck) {
            if (driver.Truck.Trailers) {
                Trailers.findOne({
                    where: { TrailerID: req.body.TrailerID }
                }).then(trailer => {
                    if (trailer) {
                        let updatedTrailer = {
                            MaximumWeight: req.body.MaximumWeight,
                            PhotoURL: req.body.PhotoURL,
                            Type: req.body.Type
                        };

                        Trailers.update(updatedTrailer, { where: { TrailerID: trailer.TrailerID } }).then(() => {
                            tokenGenerator.generateDriverToken(driver.DriverID, token => {
                                res.json({
                                    Message: "Trailer is updated.",
                                    Token: token
                                });
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