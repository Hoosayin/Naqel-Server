var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var passport = require("./helpers/passportHelper");

var app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.set("json spaces", 4);

app.use("/users", require("./routes/parseToken"));
app.use("/users", require("./routes/login"));
app.use("/users", require("./routes/traderBrokerLogin"));
app.use("/users", require("./routes/register"));
app.use("/users", require("./routes/traderRegister")); 
app.use("/users", require("./routes/accountSetup"));
app.use("/users", require("./routes/generalSettings"));
app.use("/users", require("./routes/tbgeneralSettings"));
app.use("/users", require("./routes/usernameAndEmailSettings"));
app.use("/users", require("./routes/tbusernameAndEmailSettings"));
app.use("/users", require("./routes/passwordSettings"));
app.use("/users", require("./routes/tbpasswordSettings"));
app.use("/users", require("./routes/validateUsername"));
app.use("/users", require("./routes/validateEmail"));
app.use("/users", require("./routes/validatePassword"));
app.use("/users", require("./routes/sendCode"));
app.use("/users", require("./routes/uploadDriverProfilePhoto"));
app.use("/users", require("./routes/uploadTraderBrokerProfilePhoto"));
app.use("/users", require("./routes/addTruck"));
app.use("/users", require("./routes/updateTruckPhoto"));
app.use("/users", require("./routes/updateTruck"));
app.use("/users", require("./routes/addTrailer"));
app.use("/users", require("./routes/findAllTrailers"));
app.use("/users", require("./routes/deleteTrailer"));
app.use("/users", require("./routes/updateTrailer"));
app.use("/users", require("./routes/addDrivingLicence"));
app.use("/users", require("./routes/updateDrivingLicence"));
app.use("/users", require("./routes/deleteDrivingLicence"));
app.use("/users", require("./routes/addEntryExitCard"));
app.use("/users", require("./routes/updateEntryExitCard"));
app.use("/users", require("./routes/deleteEntryExitCard"));
app.use("/users", require("./routes/addIdentityCard"));
app.use("/users", require("./routes/updateIdentityCard"));
app.use("/users", require("./routes/deleteIdentityCard"));
app.use("/users", require("./routes/addPermitLicence"));
app.use("/users", require("./routes/updatePermitLicence"));
app.use("/users", require("./routes/deletePermitLicence"));
app.use("/users", require("./routes/addJobRequest"));
app.use("/users", require("./routes/updateJobRequest"));

app.get("/", (req, res) => {
    res.send("Naqel Server - Up and Running!");
});

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})