const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// GET: getAdmins
router.get("/getAdmins", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                Administrators.findAll({
                    where: { IsSuperAdmin: false }
                }).then(async admins => {
                    if(admins) {
                        response.json({
                            Message: "Admins found.",
                            Admins: admins
                        });
                    }
                    else {
                        response.json({
                            Message: "Admins not found."
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