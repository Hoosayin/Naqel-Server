var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var passport = require("./helpers/passportHelper.js");

var app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.set("json spaces", 4);

// Users' routes.
app.use("/users", require("./routes/users/parseToken"));
app.use("/users", require("./routes/users/accountSetup"));
app.use("/users", require("./routes/users/sendCode"));

// Drivers' routes.
app.use("/drivers", require("./routes/drivers/login/login"));
app.use("/drivers", require("./routes/drivers/register/register"));
app.use("/drivers", require("./routes/drivers/settings/generalSettings"));
app.use("/drivers", require("./routes/drivers/settings/usernameAndEmailSettings"));
app.use("/drivers", require("./routes/drivers/settings/passwordSettings"));
app.use("/drivers", require("./routes/drivers/trucks/addTruck"));
app.use("/drivers", require("./routes/drivers/trucks/updateTruck"));
app.use("/drivers", require("./routes/drivers/trucks/updateTruckPhoto"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/addTrailer"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/deleteTrailer"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/updateTrailer"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/findAllTrailers"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validateEmail"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validatePassword"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validateUsername"));
app.use("/drivers", require("./routes/drivers/profilePhotos/uploadDriverProfilePhoto"));
app.use("/drivers", require("./routes/drivers/drivingLicences/addDrivingLicence"));
app.use("/drivers", require("./routes/drivers/drivingLicences/deleteDrivingLicence"));
app.use("/drivers", require("./routes/drivers/drivingLicences/updateDrivingLicence"));
app.use("/drivers", require("./routes/drivers/entryExitCards/addEntryExitCard"));
app.use("/drivers", require("./routes/drivers/entryExitCards/deleteEntryExitCard"));
app.use("/drivers", require("./routes/drivers/entryExitCards/updateEntryExitCard"));
app.use("/drivers", require("./routes/drivers/identityCards/addIdentityCard"));
app.use("/drivers", require("./routes/drivers/identityCards/deleteIdentityCard"));
app.use("/drivers", require("./routes/drivers/identityCards/updateIdentityCard"));
app.use("/drivers", require("./routes/drivers/jobRequests/addJobRequest"));
app.use("/drivers", require("./routes/drivers/jobRequests/deleteJobRequest"));
app.use("/drivers", require("./routes/drivers/jobRequests/updateJobRequest"));
app.use("/drivers", require("./routes/drivers/permitLicences/addPermitLicence"));
app.use("/drivers", require("./routes/drivers/permitLicences/deletePermitLicence"));
app.use("/drivers", require("./routes/drivers/permitLicences/updatePermitLicence"));

// Traders' | Brokers' routes.
app.use("/traders", require("./routes/traders/login/login"));
app.use("/traders", require("./routes/traders/register/register"));
app.use("/traders", require("./routes/traders/profile/getTrader"));
app.use("/traders", require("./routes/traders/profile/getProfilePhoto"));
app.use("/traders", require("./routes/traders/profile/uploadTraderProfilePhoto"));
app.use("/traders", require("./routes/traders/settings/generalSettings"));
app.use("/traders", require("./routes/traders/settings/passwordSettings"));
app.use("/traders", require("./routes/traders/settings/usernameAndEmailSettings"));
app.use("/traders", require("./routes/traders/serverSideValidators/validateUsername"));
app.use("/traders", require("./routes/traders/serverSideValidators/validateEmail"));
app.use("/traders", require("./routes/traders/serverSideValidators/validatePassword"));
app.use("/traders", require("./routes/traders/identityCards/addIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/getIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/updateIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/deleteIdentityCard"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/addCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/deleteCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/getCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/updateCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/jobOffers/addJobOffer"));

app.get("/", (request, response) => {
    response.send("Naqel Server - Up and Running!");
});

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})