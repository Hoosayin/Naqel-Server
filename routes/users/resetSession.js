const express = require("express");
const cors = require("cors");
const jwt_decode = require("jwt-decode");
const Drivers = require("../../models/drivers");
const Traders = require("../../models/traders");
const Responsibles = require("../../models/transportCompanyResponsibles");

var router = express.Router();
router.use(cors());

// POST: ResetSession
router.post("/resetSession", (request, response) => {
    try {
        const user = jwt_decode(request.body.Token);

        if (user.DriverID) {
            Drivers.findOne({
                attributes: ["DriverID"],
                where: { DriverID: user.DriverID }
            }).then(driver => {
                if (driver) {
                    let updatedDriver = {
                        Online: false
                    };

                    Drivers.update(updatedDriver, {
                        where: { DriverID: driver.DriverID }
                    }).then(() => {
                        response.json({
                            Message: "Session is reset."
                        });
                    });
                } else {
                    response.json({
                        Message: "Driver not found."
                    });
                }
            });
        } else if (user.TraderID) {
            Traders.findOne({
                attributes: ["TraderID"],
                where: { TraderID: user.TraderID }
            }).then(trader => {
                if (trader) {
                    let updatedTrader = {
                        Online: false
                    };

                    Traders.update(updatedTrader, {
                        where: { TraderID: trader.TraderID }
                    }).then(() => {
                        response.json({
                            Message: "Session is reset."
                        });
                    });
                } else {
                    response.json({
                        Message: "Trader not found."
                    });
                }
            });
        } else if (user.TransportCompanyResponsibleID) {
            Responsibles.findOne({
                attributes: ["TransportCompanyResponsibleID"],
                where: { TransportCompanyResponsibleID: user.TransportCompanyResponsibleID }
            }).then(responsible => {
                if (responsible) {
                    let updatedResponsible = {
                        Online: false
                    };

                    Responsibles.update(updatedResponsible, {
                        where: { TransportCompanyResponsibleID: responsible.TransportCompanyResponsibleID }
                    }).then(() => {
                        response.json({
                            Message: "Session is reset."
                        });
                    });
                } else {
                    response.json({
                        Message: "Transport company responsible not found."
                    });
                }
            });
        } else {
            response.json({
                Message: "Invalid token."
            });
        }
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;


