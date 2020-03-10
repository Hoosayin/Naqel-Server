const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");

var router = express.Router();
router.use(cors());

// POST: parseToken
router.post("/parseToken", (req, res) => {
    try {
        res.json(jwtDecode(req.body.Token));
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;