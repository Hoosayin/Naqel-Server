const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const AdminPrivileges = require("../../../models/adminPrivileges");

var router = express.Router();
router.use(cors());

// GET: getAdminPrivileges
router.get("/getAdminPrivileges", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, result => {
        try {
            if (result.Message === "Administrator found.") {
                AdminPrivileges.findAll({
                    where: { AdministratorID: request.query.AdministratorID }
                }).then(async adminPrivileges => {
                    if (adminPrivileges) {
                        response.json({
                            Message: "Admin privileges found.",
                            AdminPrivileges: adminPrivileges
                        });
                    }
                    else {
                        response.json({
                            Message: "Admin privileges not found."
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