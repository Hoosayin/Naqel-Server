const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const AdminPrivileges = require("../../../models/adminPrivileges");
const Administrators = require("../../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: deleteAdminPrivilege
router.delete("/deleteAdminPrivilege", (request, response) => {
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

                const adminPrivilege = await AdminPrivileges.findOne({
                    where: {
                        AdministratorID: request.body.AdministratorID,
                        Privilege: request.body.Privilege
                    }
                });

                if (adminPrivilege) {
                    await adminPrivilege.destroy();

                    response.json({
                        Message: "Admin privilege is deleted."
                    });
                } else {
                    response.json({
                        Message: "Admin privilege not found."
                    });
                }
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