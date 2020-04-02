const express = require("express");
const cors = require("cors");
const passport = require("../../../../helpers/passportHelper");
const Trailers = require("../../../../models/trailers");

var router = express.Router();
router.use(cors());

// POST: deleteTrailer

router.delete("/deleteTrailer", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                Trailers.findOne({
                    where: { TrailerID: request.body.TrailerID }
                }).then(trailer => {
                    if (trailer) {
                        trailer.destroy();

                        response.json({
                            Message: "Trailer is deleted."
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