const express = require("express");
const cors = require("cors");
const PermitTypes = require("../../models/permitTypes");

var router = express.Router();
router.use(cors());

// GET: getPermitTypes
router.get("/getPermitTypes", (request, response) => {
    try {
        PermitTypes.findAll().then(truckTypes => {
            if (permitTypes) {
                response.json({
                    Message: "Permit types found.",
                    PermitTypes: permitTypes
                });
            }
            else {
                response.json({
                    Message: "Permit types not found."
                });
            }
        });
    } catch (error) {
        response.json({
            Message: error.message
        });
    }
});

module.exports = router;