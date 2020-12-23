const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const Trailers = require("../../../../models/trailers");

var router = express.Router();
router.use(cors());

// POST: updateTrailer
router.post("/updateTrailer", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trailers.findOne({
                    where: { TrailerID: request.body.TrailerID }
                }).then(trailer => {
                    if (trailer) {
                        let updatedTrailer = {
                            Capacity: request.body.Capacity,
                            PhotoURL: request.body.PhotoURL,
                            Type: request.body.Type
                        };

                        Trailers.update(updatedTrailer, { where: { TrailerID: trailer.TrailerID } }).then(() => {
                            response.json({
                                Message: "Trailer is updated."
                            });
                        });
                    }
                    else {
                        response.json({
                            Message: "Trailer not found."
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
                Message: error.message,
            });
        }
    })(request, response);
});

module.exports = router;