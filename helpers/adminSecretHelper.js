const fileStream = require("fs");
const fileName = "adminSecret.json";

const setAdminSecret = secret => {
    let json = JSON.stringify({
        AdminSecret: secret
    });

    fileStream.writeFile(fileName, json, "utf8", () => { return; })
};

const getAdminSecret = () => {
    fileStream.exists(fileName, exists => {
        if (exists) {
            fileStream.readFile(fileName, "utf8", (error, data) => {
                if (error) {
                    return null;
                }
                else {
                    object = JSON.parse(data);
                    return object.AdminSecret;
                }
            });
        }
    });
};

module.exports = {
    SetAdminSecret: setAdminSecret,
    GetAdminSecret: getAdminSecret
};