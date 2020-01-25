const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const jwtConfiguration = require("./jwtConfiguration");

const BCRYPT_SALT_ROUNDS = 12;
const Op = Sequelize.Op;

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const Drivers = require("../models/drivers");

// Register
passport.use("register", new LocalStrategy(
    {
        usernameField: "Username",
        passwordField: "Password",
        passReqToCallback: true,
        session: false,
    },
    (req, Username, Password, done) => {

        const newCredentails = {
            Username: req.body.Username,
            Email: req.body.Email,
        };

        try {
            Drivers.findOne({
                where: {
                    [Op.or]: [
                        { Username: req.body.Username },
                        { Email: req.body.Email },
                    ],
                },
            }).then(driver => {
                if (driver) {
                    console.log('Username or email is already taken.');
                    return done(null, false, {
                        message: "Username or email is already taken.",
                    });
                }
                else {
                    console.log("Credentials are new.");
                    return done(null, newCredentails);
                }
            });
        } catch (error) {
            return done(error);
        }
    }
));

// AccountSetup
passport.use("accountSetup", new LocalStrategy(
    {
        usernameField: "Username",
        passwordField: "Password",
        passReqToCallback: true,
        session: false,
    },
    (req, Username, Password, done) => {
        console.log(Username);
        console.log(req.body.Email);

        newDriver = {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Address: req.body.Address,
            PhoneNumber: req.body.PhoneNumber,
            Gender: req.body.Gender,
            Nationality: req.body.Nationality,
            DateOfBirth: req.body.DateOfBirth,
            Created: new Date(),
            Active: 1
        }

        try {
            bcrypt.hash(req.body.Password, BCRYPT_SALT_ROUNDS)
                .then(passwordHash => {
                    newDriver.Password = passwordHash;
                    Drivers.create(newDriver)
                        .then(driver => {
                            console.log(driver.Username + " registered.");
                            return done(null, driver);
                        });
                });
        } catch (error) {
            return done(error);
        }
    }
));

// Login
passport.use("login", new LocalStrategy(
    {
        usernameField: "EmailOrUsername",
        passwordField: "Password",
        passReqToCallback: true,
        session: false,
    },
    (req, EmailOrUsername, Password, done) => {
        try {
            Drivers.findOne({
                where: {
                    [Op.or]: [
                        { Username: req.body.EmailOrUsername },
                        { Email: req.body.EmailOrUsername },
                    ],
                },
            })
                .then(driver => {
                    if (!driver) {
                        return done(null, false, { message: "Username not found." });
                    }
                    else {
                        bcrypt.compare(req.body.Password, driver.Password)
                            .then(response => {
                                if (!response) {
                                    console.log("Invalid password.");
                                    return done(null, false, { message: "Invalid password." });
                                }
                                console.log("Driver found and authenticated");
                                return done(null, driver);
                            });
                    }
                });
        }
        catch (error) {
            done(error);
        }
    }
));

// GeneralSettings
passport.use("generalSettings", new LocalStrategy(
    {
        usernameField: "Username",
        passwordField: "Password",
        passReqToCallback: true,
        session: false,
    },
    (req, done) => {
        
    }
));

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtConfiguration.secret,
};

// JSON Web Token
passport.use('jwt', new JWTStrategy(opts, (jwtPayload, done) => {
    try {
        Drivers.findOne({
            where: { DriverID: jwtPayload.DriverID },
        })
            .then(driver => {
                if (driver) {
                    console.log("Driver found in database in passport");
                    done(null, driver);
                } else {
                    console.log("Driver not found in database");
                    done(null, false);
                }
            });
    } catch (error) {
        done(error);
    }
}),
);

module.exports = passport;