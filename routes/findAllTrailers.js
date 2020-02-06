const express = require("express");
const cors = require("cors");
const Trailers = require("../models/trailers");

var router = express.Router();
router.use(cors());

// POST: findAllTrailers
router.post("/findAllTrailers", (req, res) => {
    try {
        Trailers.findAndCountAll().then(trailers => {
            console.log(trailers);

            let totalTrailers = trailers.count;

            let trailersArray = [];

            trailers.rows.forEach((value, index) => {
                trailersArray[index] = value.dataValues;
            });

            console.log(`Total Trailers Found: ${totalTrailers}`);
            console.log(trailersArray);
            console.log(trailersArray.length);
        });

        console.log("Out of Then Promise.");
    } catch (error) {
        console.log(error);
        return;
    }
});

module.exports = router;