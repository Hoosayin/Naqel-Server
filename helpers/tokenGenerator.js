const jsonWebToken = require("jsonwebtoken");
const Drivers = require("../models/drivers");
const DriverProfilePhotos = require("../models/driverProfilePhotos");
const DrivingLicences = require("../models/drivingLicences");
const Trucks = require("../models/trucks");
const Trailers = require("../models/trailers");
const jwtConfiguration = require("../helpers/jwtConfiguration");

const tokenGenerator = {};

tokenGenerator.generateDriverToken = (driverID, onTokenGenerated) => {
    Drivers.findOne({
        where: { DriverID: driverID }
    }).then(driver => {
        if (driver) {
            let driverData = driver.dataValues;

            DriverProfilePhotos.findOne({
                where: { DriverID: driverData.DriverID }
            }).then(driverProfilePhoto => {
                if (driverProfilePhoto) {
                    driverData.ProfilePhotoURL = driverProfilePhoto.dataValues.URL;
                }

                DrivingLicences.findOne({
                    where: { DriverID: driverData.DriverID }
                }).then(drivingLicence => {
                    if (drivingLicence) {
                        driverData.DrivingLicence = drivingLicence.dataValues;
                    }

                    Trucks.findOne({
                        where: { DriverID: driverData.DriverID }
                    }).then(truck => {
                        if (truck) {
                            driverData.Truck = truck.dataValues;

                            Trailers.findAll({
                                where: { TruckID: truck.TruckID }
                            }).then(trailers => {
                                if (trailers) {
                                    let trailersArray = [];

                                    trailers.forEach((value, index) => {
                                        trailersArray[index] = value.dataValues;
                                    });

                                    driverData.Truck.Trailers = trailersArray;
                                }

                                console.log(driverData);
                                let token = jsonWebToken.sign(driverData, jwtConfiguration.secret);
                                onTokenGenerated(token);
                            });
                        }
                        else {
                            console.log(driverData);
                            let token = jsonWebToken.sign(driverData, jwtConfiguration.secret);
                            onTokenGenerated(token);
                        }
                    });
                });
            });
        }
        else {
            onTokenGenerated(null);
        }
    });
};

module.exports = tokenGenerator;