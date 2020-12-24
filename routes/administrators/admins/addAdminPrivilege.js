const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const AdminPrivileges = require("../../../models/adminPrivileges");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: addAdminPrivilege
router.post("/addAdminPrivilege", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, async result => {
        try {
            if (result.Message === "Administrator found.") {
                const admin = await Administrators.findOne({
                    attributes: ["AdministratorID"],
                    where: { AdministratorID: request.body.AdministratorID }
                });

                if (!admin) {
                    response.json({
                        Message: "Administrator not found."
                    });

                    return;
                }

                response.json({
                    Message: await AdminPrivileges.create({
                        AdministratorID: request.body.AdministratorID,
                        Privilege: request.body.Privilege
                    }) ?
                        "Admin privilege is added." :
                        "Admin privilege is not added."
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