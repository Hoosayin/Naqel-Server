const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const TransportCompanyResponsibles = require("../../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// GET: getOnwer
router.get("/getOwner", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            console.log(result);
            if (result.Message === "Driver found.") {
                TransportCompanyResponsibles.findOne({
                    attributes: ["TransportCompanyResponsibleID", "Username"],
                    where: { Username: request.query.Owner }
                }).then(transportCompanyResponsible => {
                    if (transportCompanyResponsible) {
                        response.json({
                            Message: "Owner found.",
                            Owner: transportCompanyResponsible
                        })
                    }
                    else {
                        response.json({
                            Message: "Onwer not found."
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
                Message: error.message
            });
        }
    })(request, response);
});

module.exports = router;