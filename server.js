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
app.use("/users", require("./routes/users/login"));
app.use("/users", require("./routes/users/logout"));
app.use("/users", require("./routes/users/getWaitingTimes"));
app.use("/users", require("./routes/users/getTruckSizes"));
app.use("/users", require("./routes/users/getTruckTypes"));
app.use("/users", require("./routes/users/validateEmail"));
app.use("/users", require("./routes/users/resetSession"));

app.use("/users", require("./routes/users/driverProfile/getDriverProfile"));
app.use("/users", require("./routes/users/driverProfile/getDriverDocuments"));

app.use("/users", require("./routes/users/traderProfile/getTraderProfile"));
app.use("/users", require("./routes/users/traderProfile/getTraderDocuments"));

app.use("/users", require("./routes/users/driverTruck/getTruckProfile"));

// Drivers' routes.
app.use("/drivers", require("./routes/drivers/login/login"));

app.use("/drivers", require("./routes/drivers/recoverPassword/recoverPassword"));

app.use("/drivers", require("./routes/drivers/register/register"));

app.use("/drivers", require("./routes/drivers/profile/getDriver"));
app.use("/drivers", require("./routes/drivers/profile/getProfilePhoto"));
app.use("/drivers", require("./routes/drivers/profile/uploadDriverProfilePhoto"));
app.use("/drivers", require("./routes/drivers/profile/getDashboardData"));

app.use("/drivers", require("./routes/drivers/settings/generalSettings"));
app.use("/drivers", require("./routes/drivers/settings/usernameAndEmailSettings"));
app.use("/drivers", require("./routes/drivers/settings/passwordSettings"));

app.use("/drivers", require("./routes/drivers/trucks/getTruck"));
app.use("/drivers", require("./routes/drivers/trucks/getOwner"));
app.use("/drivers", require("./routes/drivers/trucks/addTruck"));
app.use("/drivers", require("./routes/drivers/trucks/updateTruck"));
app.use("/drivers", require("./routes/drivers/trucks/updateTruckPhoto"));
app.use("/drivers", require("./routes/drivers/trucks/deleteTruck"));

app.use("/drivers", require("./routes/drivers/trucks/trailers/getTrailers"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/addTrailer"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/deleteTrailer"));
app.use("/drivers", require("./routes/drivers/trucks/trailers/updateTrailer"));

app.use("/drivers", require("./routes/drivers/serverSideValidators/validateEmail"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validatePassword"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validateUsername"));
app.use("/drivers", require("./routes/drivers/serverSideValidators/validatePhoneNumber"));

app.use("/drivers", require("./routes/drivers/drivingLicences/getDrivingLicence"));
app.use("/drivers", require("./routes/drivers/drivingLicences/addDrivingLicence"));
app.use("/drivers", require("./routes/drivers/drivingLicences/deleteDrivingLicence"));
app.use("/drivers", require("./routes/drivers/drivingLicences/updateDrivingLicence"));

app.use("/drivers", require("./routes/drivers/entryExitCards/getEntryExitCard"));
app.use("/drivers", require("./routes/drivers/entryExitCards/addEntryExitCard"));
app.use("/drivers", require("./routes/drivers/entryExitCards/deleteEntryExitCard"));
app.use("/drivers", require("./routes/drivers/entryExitCards/updateEntryExitCard"));

app.use("/drivers", require("./routes/drivers/identityCards/getIdentityCard"));
app.use("/drivers", require("./routes/drivers/identityCards/addIdentityCard"));
app.use("/drivers", require("./routes/drivers/identityCards/deleteIdentityCard"));
app.use("/drivers", require("./routes/drivers/identityCards/updateIdentityCard"));

app.use("/drivers", require("./routes/drivers/jobRequests/getJobRequestPackages"));
app.use("/drivers", require("./routes/drivers/jobRequests/addJobRequest"));
app.use("/drivers", require("./routes/drivers/jobRequests/deleteJobRequest"));
app.use("/drivers", require("./routes/drivers/jobRequests/updateJobRequest"));
app.use("/drivers", require("./routes/drivers/jobRequests/getTraderRequestPackages"));
app.use("/drivers", require("./routes/drivers/jobRequests/toggleSelectTraderRequest"));


app.use("/drivers", require("./routes/drivers/permitLicences/getPermitLicences"));
app.use("/drivers", require("./routes/drivers/permitLicences/addPermitLicence"));
app.use("/drivers", require("./routes/drivers/permitLicences/deletePermitLicence"));
app.use("/drivers", require("./routes/drivers/permitLicences/updatePermitLicence"));

app.use("/drivers", require("./routes/drivers/jobOffers/getJobOfferPosts"));
app.use("/drivers", require("./routes/drivers/jobOffers/addDriverRequest"));
app.use("/drivers", require("./routes/drivers/jobOffers/deleteDriverRequest"));

app.use("/drivers", require("./routes/drivers/onGoingJobs/getOnGoingJob"));
app.use("/drivers", require("./routes/drivers/onGoingJobs/addJobObjection"));
app.use("/drivers", require("./routes/drivers/onGoingJobs/finishJob"));
app.use("/drivers", require("./routes/drivers/onGoingJobs/getJobObjections"));

app.use("/drivers", require("./routes/drivers/objectionReasons/addObjectionReason"));
app.use("/drivers", require("./routes/drivers/objectionReasons/getObjectionReasons"));

app.use("/drivers", require("./routes/drivers/completedJobs/getCompletedJobPackages"));
app.use("/drivers", require("./routes/drivers/completedJobs/getPaymentDetails"));
app.use("/drivers", require("./routes/drivers/completedJobs/approveTraderPayProof"));

app.use("/drivers", require("./routes/drivers/earnings/getEarnings"));

app.use("/drivers", require("./routes/drivers/payments/getBills"));
app.use("/drivers", require("./routes/drivers/payments/getBillData"));
app.use("/drivers", require("./routes/drivers/payments/addDriverPayProof"));
app.use("/drivers", require("./routes/drivers/payments/deleteDriverPayProof"));
app.use("/drivers", require("./routes/drivers/payments/getPaymentDetails"));
app.use("/drivers", require("./routes/drivers/payments/getClientSecret"));
app.use("/drivers", require("./routes/drivers/payments/addDriverPayDetails"));

app.use("/drivers", require("./routes/drivers/accountStatement/getAccountStatement"));

app.use("/drivers", require("./routes/drivers/questions/addQuestion"));
app.use("/drivers", require("./routes/drivers/questions/getQuestions"));
app.use("/drivers", require("./routes/drivers/questions/deleteQuestion"));

// Traders' | Brokers' routes.
app.use("/traders", require("./routes/traders/login/login"));

app.use("/traders", require("./routes/traders/recoverPassword/recoverPassword"));

app.use("/traders", require("./routes/traders/register/register"));

app.use("/traders", require("./routes/traders/profile/getTrader"));
app.use("/traders", require("./routes/traders/profile/getProfilePhoto"));
app.use("/traders", require("./routes/traders/profile/uploadTraderProfilePhoto"));
app.use("/traders", require("./routes/traders/profile/getDashboardData"));

app.use("/traders", require("./routes/traders/settings/generalSettings"));
app.use("/traders", require("./routes/traders/settings/passwordSettings"));
app.use("/traders", require("./routes/traders/settings/usernameAndEmailSettings"));

app.use("/traders", require("./routes/traders/serverSideValidators/validateUsername"));
app.use("/traders", require("./routes/traders/serverSideValidators/validateEmail"));
app.use("/traders", require("./routes/traders/serverSideValidators/validatePassword"));
app.use("/traders", require("./routes/traders/serverSideValidators/validatePhoneNumber"));

app.use("/traders", require("./routes/traders/identityCards/addIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/getIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/updateIdentityCard"));
app.use("/traders", require("./routes/traders/identityCards/deleteIdentityCard"));

app.use("/traders", require("./routes/traders/commercialRegisterCertificates/addCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/deleteCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/getCommercialRegisterCertificate"));
app.use("/traders", require("./routes/traders/commercialRegisterCertificates/updateCommercialRegisterCertificate"));

app.use("/traders", require("./routes/traders/jobOffers/addJobOffer"));
app.use("/traders", require("./routes/traders/jobOffers/getJobOfferPackages"));
app.use("/traders", require("./routes/traders/jobOffers/deleteJobOffer"));
app.use("/traders", require("./routes/traders/jobOffers/updateJobOffer"));
app.use("/traders", require("./routes/traders/jobOffers/getDriverRequestPackages"));

app.use("/traders", require("./routes/traders/jobRequests/getJobRequestPosts"));
app.use("/traders", require("./routes/traders/jobRequests/addTraderRequest"));
app.use("/traders", require("./routes/traders/jobRequests/deleteTraderRequest"));

app.use("/traders", require("./routes/traders/onGoingJobs/getOnGoingJob"));
app.use("/traders", require("./routes/traders/onGoingJobs/getJobObjections"));
app.use("/traders", require("./routes/traders/onGoingJobs/addJobObjection"));
app.use("/traders", require("./routes/traders/onGoingJobs/approveJob"));
app.use("/traders", require("./routes/traders/onGoingJobs/addOnGonigJobFromJobOffer"));
app.use("/traders", require("./routes/traders/onGoingJobs/addOnGonigJobFromJobRequest"));
app.use("/traders", require("./routes/traders/onGoingJobs/addDriverReviewFromOnGoingJob"));

app.use("/traders", require("./routes/traders/objectionReasons/addObjectionReason"));
app.use("/traders", require("./routes/traders/objectionReasons/getObjectionReasons"));

app.use("/traders", require("./routes/traders/completedJobs/getCompletedJobPackages"));
app.use("/traders", require("./routes/traders/completedJobs/addDriverReview"));

app.use("/traders", require("./routes/traders/payments/getBills"));
app.use("/traders", require("./routes/traders/payments/getBillData"));
app.use("/traders", require("./routes/traders/payments/addTraderPayProof"));
app.use("/traders", require("./routes/traders/payments/deleteTraderPayProof"));
app.use("/traders", require("./routes/traders/payments/getPaymentDetails"));
app.use("/traders", require("./routes/traders/payments/getClientSecret"));
app.use("/traders", require("./routes/traders/payments/addTraderPayDetails"));
app.use("/traders", require("./routes/traders/payments/requestSpecialBill"));

app.use("/traders", require("./routes/traders/accountStatement/getAccountStatement"));

app.use("/traders", require("./routes/traders/questions/addQuestion"));
app.use("/traders", require("./routes/traders/questions/deleteQuestion"));
app.use("/traders", require("./routes/traders/questions/getQuestions"));

// Administrators' routes.
app.use("/administrators", require("./routes/administrators/register/register"));
app.use("/administrators", require("./routes/administrators/register/setupAccount"));

app.use("/administrators", require("./routes/administrators/login/login"));

app.use("/administrators", require("./routes/administrators/recoverPassword/recoverPassword"));

app.use("/administrators", require("./routes/administrators/profile/getAdministrator"));
app.use("/administrators", require("./routes/administrators/profile/uploadProfilePhoto"));

app.use("/administrators", require("./routes/administrators/profile/settings/generalSettings"));
app.use("/administrators", require("./routes/administrators/profile/settings/usernameAndEmailSettings"));
app.use("/administrators", require("./routes/administrators/profile/settings/passwordSettings"));
app.use("/administrators", require("./routes/administrators/profile/settings/getNaqelSettings"));
app.use("/administrators", require("./routes/administrators/profile/settings/updateNaqelSettings"));
app.use("/administrators", require("./routes/administrators/profile/settings/getAdminSecret"));
app.use("/administrators", require("./routes/administrators/profile/settings/updateAdminSecret"));

app.use("/administrators", require("./routes/administrators/serverSideValidators/validateUsername"));
app.use("/administrators", require("./routes/administrators/serverSideValidators/validateEmail"));
app.use("/administrators", require("./routes/administrators/serverSideValidators/validatePassword"));
app.use("/administrators", require("./routes/administrators/serverSideValidators/validatePhoneNumber"));

app.use("/administrators", require("./routes/administrators/drivers/getDrivers"));
app.use("/administrators", require("./routes/administrators/drivers/activateDriverAccount"));
app.use("/administrators", require("./routes/administrators/drivers/blockDriverAccount"));
app.use("/administrators", require("./routes/administrators/drivers/unblockDriverAccount"));

app.use("/administrators", require("./routes/administrators/traders/getTraders"));
app.use("/administrators", require("./routes/administrators/traders/setRefundRate"));
app.use("/administrators", require("./routes/administrators/traders/exonerateTrader"));
app.use("/administrators", require("./routes/administrators/traders/chargeTrader"));

app.use("/administrators", require("./routes/administrators/traderObjectionReasons/getTraderObjectionReasons"));
app.use("/administrators", require("./routes/administrators/traderObjectionReasons/addTraderObjectionReason"));
app.use("/administrators", require("./routes/administrators/traderObjectionReasons/deleteTraderObjectionReason"));
app.use("/administrators", require("./routes/administrators/traderObjectionReasons/verifyTraderObjectionReason"));

app.use("/administrators", require("./routes/administrators/driverObjectionReasons/addDriverObjectionReason"));
app.use("/administrators", require("./routes/administrators/driverObjectionReasons/deleteDriverObjectionReason"));
app.use("/administrators", require("./routes/administrators/driverObjectionReasons/getDriverObjectionReasons"));
app.use("/administrators", require("./routes/administrators/driverObjectionReasons/verifyDriverObjectionReason"));

app.use("/administrators", require("./routes/administrators/objectionableJobs/getObjectionableJobs"));
app.use("/administrators", require("./routes/administrators/objectionableJobs/getJobObjections"));
app.use("/administrators", require("./routes/administrators/objectionableJobs/discardObjectionableJob"));

app.use("/administrators", require("./routes/administrators/driverQuestions/getDriverQuestions"));
app.use("/administrators", require("./routes/administrators/driverQuestions/addDriverAnswer"));
app.use("/administrators", require("./routes/administrators/driverQuestions/classifyDriverQuestion"));

app.use("/administrators", require("./routes/administrators/driverQuestionClasses/getDriverQuestionClasses"));
app.use("/administrators", require("./routes/administrators/driverQuestionClasses/addDriverQuestionClass"));

app.use("/administrators", require("./routes/administrators/traderQuestions/getTraderQuestions"));
app.use("/administrators", require("./routes/administrators/traderQuestions/addTraderAnswer"));
app.use("/administrators", require("./routes/administrators/traderQuestions/classifyTraderQuestion"));

app.use("/administrators", require("./routes/administrators/traderQuestionClasses/getTraderQuestionClasses"));
app.use("/administrators", require("./routes/administrators/traderQuestionClasses/addTraderQuestionClass"));

app.use("/administrators", require("./routes/administrators/responsibleQuestions/getResponsibleQuestions"));
app.use("/administrators", require("./routes/administrators/responsibleQuestions/addResponsibleAnswer"));
app.use("/administrators", require("./routes/administrators/responsibleQuestions/classifyResponsibleQuestion"));

app.use("/administrators", require("./routes/administrators/responsibleQuestionClasses/getResponsibleQuestionClasses"));
app.use("/administrators", require("./routes/administrators/responsibleQuestionClasses/addResponsibleQuestionClass"));

app.use("/administrators", require("./routes/administrators/globalAndTemporaryFeeRates/getGlobalAndTemporaryFeeRates"));
app.use("/administrators", require("./routes/administrators/globalAndTemporaryFeeRates/setGlobalFeeRate"));
app.use("/administrators", require("./routes/administrators/globalAndTemporaryFeeRates/setTemporaryFeeRate"));
app.use("/administrators", require("./routes/administrators/globalAndTemporaryFeeRates/clearTemporaryFeeRate"));

app.use("/administrators", require("./routes/administrators/priceRanges/getPriceRanges"));
app.use("/administrators", require("./routes/administrators/priceRanges/addPriceRange"));
app.use("/administrators", require("./routes/administrators/priceRanges/updatePriceRange"));
app.use("/administrators", require("./routes/administrators/priceRanges/deletePriceRange"));

app.use("/administrators", require("./routes/administrators/traderRates/getTraderRates"));
app.use("/administrators", require("./routes/administrators/traderRates/addTraderRate"));
app.use("/administrators", require("./routes/administrators/traderRates/updateTraderRate"));
app.use("/administrators", require("./routes/administrators/traderRates/deleteTraderRate"));

app.use("/administrators", require("./routes/administrators/tradersBills/getTradersBills"));

app.use("/administrators", require("./routes/administrators/driversBills/getDriversBills"));
app.use("/administrators", require("./routes/administrators/driversBills/approveDriverPayProof"));

app.use("/administrators", require("./routes/administrators/traderAccountStatements/getTraderAccountStatement"));
app.use("/administrators", require("./routes/administrators/driverAccountStatements/getDriverAccountStatement"));
app.use("/administrators", require("./routes/administrators/responsibleAccountStatements/getResponsibleAccountStatement"));
app.use("/administrators", require("./routes/administrators/accountStatement/getAccountStatement"));

app.use("/administrators", require("./routes/administrators/waitingTimes/addWaitingTime"));
app.use("/administrators", require("./routes/administrators/waitingTimes/deleteWaitingTime"));

app.use("/administrators", require("./routes/administrators/truckSizes/addTruckSize"));
app.use("/administrators", require("./routes/administrators/truckSizes/deleteTruckSize"));

app.use("/administrators", require("./routes/administrators/truckTypes/addTruckType"));
app.use("/administrators", require("./routes/administrators/truckTypes/deleteTruckType"));

app.use("/administrators", require("./routes/administrators/permitTypes/addPermitType"));
app.use("/administrators", require("./routes/administrators/permitTypes/deletePermitType"));

// Transport Company Responsibles' routes.
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/register/register"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/register/setupAccount"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/login/login"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/recoverPassword/recoverPassword"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/profile/getTransportCompanyResponsible"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/commercialRegisterCertificates/addCommercialRegisterCertificate"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/commercialRegisterCertificates/deleteCommercialRegisterCertificate"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/commercialRegisterCertificates/getCommercialRegisterCertificate"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/commercialRegisterCertificates/updateCommercialRegisterCertificate"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/serverSideValidators/validateEmail"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/serverSideValidators/validatePassword"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/serverSideValidators/validateUsername"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/serverSideValidators/validatePhoneNumber"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/settings/generalSettings"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/settings/passwordSettings"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/settings/usernameAndEmailSettings"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/trucks/getTrucks"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/truckJobs/getTruckJobs"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/truckJobs/getTruckJobDetails"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/questions/addQuestion"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/questions/deleteQuestion"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/questions/getQuestions"));

app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/financialAccounts/getAccountStatement"));
app.use("/transportCompanyResponsibles", require("./routes/transportCompanyResponsibles/financialAccounts/getTruckAccountStatement"));

app.get("/", (request, response) => {
    response.send("Naqel Server - Up and Running!");
});

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})