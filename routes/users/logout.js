const express = require("express");
const cors = require("cors");
const Drivers = require("../../models/drivers");
const Traders = require("../../models/traders");
const Responsibles = require("../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: Logout
router.post("/logout", (request, response) => {
    try {
        const userType = request.body.UserType;

        if (userType === "Driver") {
            Drivers.findOne({
                attributes: ["DriverID"],
                where: { DriverID: request.body.ID }
            }).then(driver => {
                if (driver) {
                    let updatedDriver = {
                        Online: false
                    };

                    Drivers.update(updatedDriver, {
                        where: { DriverID: driver.DriverID }
                    }).then(() => {
                        response.json({
                            Message: "Logout successful."
                        });
                    });
                } else {
                    response.json({
                        Message: "Driver not found."
                    });
                }
            });
        } else if (userType === "Trader") {
            Traders.findOne({
                attributes: ["TraderID"],
                where: { TraderID: request.body.ID }
            }).then(trader => {
                if (trader) {
                    let updatedTrader = {
                        Online: false
                    };

                    Traders.update(updatedTrader, {
                        where: { TraderID: trader.TraderID }
                    }).then(() => {
                        response.json({
                            Message: "Logout successful."
                        });
                    });
                } else {
                    response.json({
                        Message: "Trader not found."
                    });
                }
            });
        } else {
            Responsibles.findOne({
                attributes: ["TransportCompanyResponsibleID"],
                where: { TransportCompanyResponsibleID: request.body.ID }
            }).then(responsible => {
                if (responsible) {
                    let updatedResponsible = {
                        Online: false
                    };

                    Responsibles.update(updatedResponsible, {
                        where: { TransportCompanyResponsibleID: responsible.TransportCompanyResponsibleID }
                    }).then(() => {
                        response.json({
                            Message: "Logout successful."
                        });
                    });
                } else {
                    response.json({
                        Message: "Transport company responsible not found."
                    });
                }
            });
        }
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;


