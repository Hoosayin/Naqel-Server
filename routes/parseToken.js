const express = require("express");
const cors = require("cors");
const jwtDecode = require("jwt-decode");

var router = express.Router();
router.use(cors());

// GET: parseToken
router.get("/parseToken/:Token", (req, res) => {
    let decodedToken = jwtDecode(req.params.Token);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(decodedToken, null, 3));
});

module.exports = router;