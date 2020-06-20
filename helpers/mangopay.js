const Mangopay = require("mangopay2-nodejs-sdk");

const mangopay = new Mangopay({
    clientId: "naqeltb",
    clientApiKey: "049RBmcjsZobtJu6jfqP02r1TNQBjZN8ZfUz25gr8FBBg9dXM8",
    baseUrl: "https://api.sandbox.mangopay.com"
});

module.exports = mangopay;
