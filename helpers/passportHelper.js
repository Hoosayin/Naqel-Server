const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const jwtConfiguration = require("./jwtConfiguration");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const Drivers = require("../models/drivers");
const Traders = require("../models/traders");

const BCRYPT_SALT_ROUNDS = 12;
const Op = Sequelize.Op;

// Register Driver
passport.use("RegisterDriver", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    const newCredentails = {
        Username: request.body.Username,
        Email: request.body.Email,
    };

    try {
        Drivers.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.Username },
                    { Email: request.body.Email },
                ],
            },
        }).then(driver => {
            if (driver) {
                return onAuthenticated(null, false, {
                    message: "Username or email is already taken.",
                });
            }
            else {
                return onAuthenticated(null, newCredentails);
            }
        });
    } catch (error) {
        return onAuthenticated(error);
    }
}));

// Register Trader
passport.use("RegisterTrader", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    const newCredentails = {
        Username: request.body.Username,
        Email: request.body.Email,
    };

    try {
        Traders.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.Username },
                    { Email: request.body.Email },
                ],
            },
        }).then(trader => {
            if (trader) {
                return onAuthenticated(null, false, {
                    message: "Username or email is already taken.",
                });
            }
            else {
                return onAuthenticated(null, newCredentails);
            }
        });
    } catch (error) {
        return onAuthenticated(error);
    }
}));


// Setup Account
passport.use("SetupAccount", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        if (request.body.RegisterAs === "Driver") {
            newDriver = {
                Username: request.body.Username,
                Password: request.body.Password,
                Email: request.body.Email,
                FirstName: request.body.FirstName,
                LastName: request.body.LastName,
                Address: request.body.Address,
                PhoneNumber: request.body.PhoneNumber,
                Gender: request.body.Gender,
                Nationality: request.body.Nationality,
                DateOfBirth: request.body.DateOfBirth,
                Created: new Date(),
                Active: 1
            };

            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                newDriver.Password = passwordHash;
                Drivers.create(newDriver).then(driver => {
                    return onAuthenticated(null, driver);
                });
            });
        } else {
            newTrader = {
                Username: request.body.Username,
                Password: request.body.Password,
                PhoneNumber: request.body.PhoneNumber,
                FirstName: request.body.FirstName,
                LastName: request.body.LastName,
                Nationality: request.body.Nationality,
                Email: request.body.Email,
                Gender: request.body.Gender,
                DateOfBirth: request.body.DateOfBirth,
                Address: request.body.Address,
                Type: req.body.RegisterAs,
                Created: new Date(),
                BankName: "",
                IBAN: "",
                Active: 1
            };

            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                newTrader.Password = passwordHash;
                Traders.create(newTrader).then(trader => {
                    return onAuthenticated(null, trader);
                });
            });
        }
    } catch (error) {
        return onAuthenticated(error);
    }
}));

// Login Driver
passport.use("LoginDriver", new LocalStrategy({
    usernameField: "EmailOrUsername",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        Drivers.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.EmailOrUsername },
                    { Email: request.body.EmailOrUsername },
                ],
            },
        }).then(driver => {
            if (!driver) {
                return onAuthenticated(null, false, { message: "Username not found." });
            }
            else {
                bcrypt.compare(request.body.Password, driver.Password).then(response => {
                    if (!response) {
                        console.log("Invalid password.");
                        return onAuthenticated(null, false, { message: "Invalid password." });
                    }
                    console.log("Driver found and authenticated");
                    return onAuthenticated(null, driver);
                });
            }
        });
    }
    catch (error) {
        onAuthenticated(error);
    }
}));

// Login Trader
passport.use("LoginTrader", new LocalStrategy({
    usernameField: "EmailOrUsername",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        Traders.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.EmailOrUsername },
                    { Email: request.body.EmailOrUsername },
                ],
            },
        }).then(trader => {
            if (!trader) {
                return onAuthenticated(null, false, { Message: "Username not found." });
            }
            else {
                bcrypt.compare(request.body.Password, trader.Password).then(response => {
                    if (!response) {
                        return onAuthenticated(null, false, { Message: "Invalid password." });
                    }

                    return onAuthenticated(null, trader);
                });
            }
        });
    }
    catch (error) {
        onAuthenticated(error);
    }
}));

// Authenticate Driver 
passport.use("AuthenticateDriver", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtConfiguration.secret,
}, (JWTPayload, onAuthenticated) => {
    try {
        Drivers.findOne({
            where: { DriverID: JWTPayload.DriverID },
        }).then(driver => {
            if (driver) {
                onAuthenticated({
                    Message: "Driver found.",
                    Driver: driver
                });
            } else {
                onAuthenticated({
                    Message: "Driver not found."
                });
            }
        });
    } catch (error) {
        onAuthenticated({
            Message: error.message
        });
    }
}));


// Authenticate Trader
passport.use("AuthenticateTrader", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtConfiguration.secret,
}, (JWTPayload, onAuthenticated) => {
    try {
        Traders.findOne({
            where: { TraderID: JWTPayload.TraderID },
        }).then(trader => {
            if (trader) {
                onAuthenticated({
                    Message: "Trader found.",
                    Trader: trader.dataValues
                });
            }
            else {
                onAuthenticated({
                    Message: "Trader not found."
                });
            }
        });
    } catch (error) {
        onAuthenticated({
            Message: error.message
        });
    }
}));

module.exports = passport;