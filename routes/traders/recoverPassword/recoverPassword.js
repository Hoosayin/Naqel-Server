const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Traders = require("../../../models/traders");

const BCRYPT_SALT_ROUNDS = 12;

var router = express.Router();
router.use(cors());

// POST: recoverPassword
router.post("/recoverPassword", (request, response) => {
    Traders.findOne({
        where: { PhoneNumber: request.body.PhoneNumber }
    }).then(trader => {
        if (trader) {
            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                let updatedTrader = {
                    Password: passwordHash,
                };

                Traders.update(updatedTrader, { where: { TraderID: trader.TraderID } }).then(() => {
                    response.json({
                        Message: "Password is updated."
                    });
                });
            });
        }
        else {
            response.json({
                Message: "Trader not found."
            });
        }
    }).catch(error => {
        response.json({
            Message: error.message
        })
    });
});

module.exports = router;