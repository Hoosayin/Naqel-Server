const express = require("express");
const cors = require("cors");
const Drivers = require("../../models/drivers");
const Traders = require("../../models/traders");
const TCResponsibles = require("../../models/transportCompanyResponsibles");
const Administrators = require("../../models/administrators");

var router = express.Router();
router.use(cors());

// POST: Login
router.post("/validateEmail", async (request, response) => {
    try {
        const driver = await Drivers.findOne({
            attributes: ["Email"],
            where: { Email: request.body.Email }
        });

        const trader = await Traders.findOne({
            attributes: ["Email"],
            where: { Email: request.body.Email }
        });

        const responsible = await TCResponsibles.findOne({
            attributes: ["Email"],
            where: { Email: request.body.Email }
        });

        const administrator = await Administrators.findOne({
            attributes: ["Email"],
            where: { Email: request.body.Email }
        });

        if (driver ||
            trader ||
            responsible ||
            administrator) {
            response.json({
                Message: "Email is invalid."
            });
        }
        else {
            response.json({
                Message: "Email is valid."
            });
        }
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;


