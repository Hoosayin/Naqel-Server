const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const uuid = require("uuid-v4");

const jwtConfiguration = require("./jwtConfiguration");
const codeGenerator = require("./codeGenerator");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const Drivers = require("../models/drivers");
const Traders = require("../models/traders");
const Administrators = require("../models/administrators");
const TransportCompanyResponsibles = require("../models/transportCompanyResponsibles");

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

// Register Administrator
passport.use("RegisterAdministrator", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        Administrators.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.Username },
                    { Email: request.body.Email },
                ],
            },
        }).then(administrator => {
            if (administrator) {
                return onAuthenticated({
                    Message: "Username or email is already taken.",
                });
            }
            else {
                return onAuthenticated({
                    Message: "Credentials are verified.",
                });
            }
        });
    } catch (error) {
        return onAuthenticated({
            Message: error.message,
        });
    }
}));

// Register TransportCompanyResponsible
passport.use("RegisterTransportCompanyResponsible", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
        try {
            TransportCompanyResponsibles.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.Username },
                    { Email: request.body.Email },
                ],
            },
            }).then(transportCompanyResponsible => {
                if (transportCompanyResponsible) {
                return onAuthenticated({
                    Message: "Username or email is already taken.",
                });
            }
            else {
                return onAuthenticated({
                    Message: "Credentials are verified.",
                });
            }
        });
    } catch (error) {
        return onAuthenticated({
            Message: error.message,
        });
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
                Type: request.body.RegisterAs,
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

// Setup Administrator Account
passport.use("SetupAdministratorAccount", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        if (request.body.AdministratorSecret === "admin123123") {
            let newAdministrator = {
                Email: request.body.Email,
                Username: request.body.Username,
                Password: request.body.Password,
                FirstName: request.body.FirstName,
                LastName: request.body.LastName,
                PhotoURL: null,
                Created: new Date()
            };

            bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
                newAdministrator.Password = passwordHash;
                Administrators.create(newAdministrator).then(() => {
                    return onAuthenticated({
                        Message: "Administrator created."
                    });
                });
            });
        }
        else {
            return onAuthenticated({
                Message: "Invalid secret code."
            });
        }
    } catch (error) {
        return onAuthenticated({
            Message: error.message
        });
    }
}));

// Setup Transport Company Responsible Account
passport.use("SetupTransportCompanyResponsibleAccount", new LocalStrategy({
    usernameField: "Username",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        let newTransportCompanyResponsible = {
            Email: request.body.Email,
            Username: request.body.Username,
            Password: request.body.Password,
            Name: request.body.Name,
            PhoneNumber: request.body.PhoneNumber,
            InternalNumber: uuid().substring(0, 12).toUpperCase(),
            CommercialRegisterNumber: codeGenerator(10),
            Active: true,
            Created: new Date()
        };

        bcrypt.hash(request.body.Password, BCRYPT_SALT_ROUNDS).then(passwordHash => {
            newTransportCompanyResponsible.Password = passwordHash;

            TransportCompanyResponsibles.create(newTransportCompanyResponsible).then(() => {
                return onAuthenticated({
                    Message: "Transport company responsible created."
                });
            });
        });
    } catch (error) {
        return onAuthenticated({
            Message: error.message
        });
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
                ]
            }
        }).then(driver => {
            if (!driver) {
                return onAuthenticated({
                    Message: "Driver not found."
                });
            }
            else {
                bcrypt.compare(request.body.Password, driver.Password).then(response => {
                    if (!response) {
                        return onAuthenticated({
                            Message: "Invalid password."
                        });
                    }
                    return onAuthenticated({
                        Message: "Driver found.",
                        Driver: driver.dataValues
                    });
                });
            }
        });
    }
    catch (error) {
        onAuthenticated({
            Message: error.message
        });
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

// Login Administrator
passport.use("LoginAdministrator", new LocalStrategy({
    usernameField: "EmailOrUsername",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
    try {
        Administrators.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.EmailOrUsername },
                    { Email: request.body.EmailOrUsername },
                ]
            }
        }).then(administrator => {
            if (!administrator) {
                return onAuthenticated({
                    Message: "Administrator not found."
                });
            }
            else {
                bcrypt.compare(request.body.Password, administrator.Password).then(response => {
                    if (!response) {
                        return onAuthenticated({
                            Message: "Invalid password."
                        });
                    }
                    return onAuthenticated({
                        Message: "Administrator found.",
                        Administrator: administrator.dataValues
                    });
                });
            }
        });
    }
    catch (error) {
        onAuthenticated({
            Message: error.message
        });
    }
}));

// Login Transport Company Responsible
passport.use("LoginTransportCompanyResponsible", new LocalStrategy({
    usernameField: "EmailOrUsername",
    passwordField: "Password",
    passReqToCallback: true,
    session: false,
}, (request, username, password, onAuthenticated) => {
        try {
            TransportCompanyResponsibles.findOne({
            where: {
                [Op.or]: [
                    { Username: request.body.EmailOrUsername },
                    { Email: request.body.EmailOrUsername },
                ]
                }
            }).then(transportCompanyResponsible => {
                if (!transportCompanyResponsible) {
                return onAuthenticated({
                    Message: "Transport company responsible not found."
                });
            }
                else {
                    bcrypt.compare(request.body.Password, transportCompanyResponsible.Password).then(response => {
                    if (!response) {
                        return onAuthenticated({
                            Message: "Invalid password."
                        });
                    }
                    return onAuthenticated({
                        Message: "Transport company responsible found.",
                        TransportCompanyResponsible: transportCompanyResponsible.dataValues
                    });
                });
            }
        });
    }
    catch (error) {
        onAuthenticated({
            Message: error.message
        });
    }
}));

// Authenticate Driver 
passport.use("AuthenticateDriver", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtConfiguration.secret,
}, (JWTPayload, onAuthenticated) => {
        try {
            console.log(JWTPayload);
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

// Authenticate Administrator 
passport.use("AuthenticateAdministrator", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtConfiguration.secret,
}, (JWTPayload, onAuthenticated) => {
    try {
        Administrators.findOne({
            where: { AdministratorID: JWTPayload.AdministratorID },
        }).then(administrator => {
            if (administrator) {
                onAuthenticated({
                    Message: "Administrator found.",
                    Administrator: administrator
                });
            } else {
                onAuthenticated({
                    Message: "Administrator not found."
                });
            }
        });
    } catch (error) {
        onAuthenticated({
            Message: error.message
        });
    }
}));

// Authenticate Transport Company Responsible
passport.use("AuthenticateTransportCompanyResponsible", new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: jwtConfiguration.secret,
}, (JWTPayload, onAuthenticated) => {
    try {
        TransportCompanyResponsibles.findOne({
            where: { TransportCompanyResponsibleID: JWTPayload.TransportCompanyResponsibleID },
        }).then(transportCompanyResponsible => {
            if (transportCompanyResponsible) {
                onAuthenticated({
                    Message: "Transport company responsible found.",
                    TransportCompanyResponsible: transportCompanyResponsible
                });
            } else {
                onAuthenticated({
                    Message: "Transport company responsible not found."
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