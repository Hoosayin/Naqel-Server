const express = require("express");
const cors = require("cors");
const passport = require("../../../helpers/passportHelper");
const AdminPriviliges = require("../../../models/adminPrivileges");

var router = express.Router();
router.use(cors());

// GET: getDashboardData
router.get("/getDashboardData", (request, response) => {
    passport.authenticate("AuthenticateAdministrator", { session: false }, async result => {
        try {
            if (result.Message === "Administrator found.") {
                const adminPrivileges = await AdminPriviliges.findAll({
                    where: { AdministratorID: result.Administrator.AdministratorID }
                });

                if (!adminPrivileges) {
                    response.json({
                        Message: "Dashboard data not found."
                    });

                    return;
                }

                let privileges = [];
                let count = 0;

                for (let adminPrivilege of adminPrivileges) {
                    privileges[count++] = adminPrivilege.Privilege;
                }

                response.json({
                    Message: "Dashboard data found.",
                    Privileges: privileges
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