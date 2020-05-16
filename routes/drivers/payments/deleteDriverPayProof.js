const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const DriverPayProofs = require("../../../models/driverPayProofs");

var router = express.Router();
router.use(cors());

// POST: deleteDriverPayProof
router.delete("/deleteDriverPayProof", (request, response) => {
    passport.authenticate("AuthenticateDriver", { session: false }, result => {
        try {
            if (result.Message === "Driver found.") {
                DriverPayProofs.findOne({
                    where: { DriverPayProofID: request.body.DriverPayProofID }
                }).then(driverPayProof => {
                    if (driverPayProof) {
                        if (driverPayProof.Approved) {
                            response.json({
                                Message: "Cannot delete approved driver pay proof."
                            });
                        }
                        else {
                            driverPayProof.destroy();

                            response.json({
                                Message: "Driver pay proof is deleted."
                            });
                        }
                    }
                    else {
                        response.json({
                            Message: "Driver pay proof not found."
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