const fileStream = require("fs");
const fileName = "naqelSettings.json";

const setNaqelSettings = naqelSettings => {
    let json = naqelSettings ? JSON.stringify(naqelSettings) : JSON.stringify({});

    fileStream.writeFile(fileName, json, "utf8", () => {
        return;
    });
};

const getNaqelSettings = onFileRead => {
    fileStream.exists(fileName, exists => {
        if (exists) {
            fileStream.readFile(fileName, "utf8", (error, data) => {
                if (error) {
                    onFileRead({
                        Message: "Naqel settings not found."
                    });
                }
                else {
                    onFileRead({
                        Message: "Naqel settings found.",
                        NaqelSettings: JSON.parse(data)
                    });
                }
            });
        }
    });
};

module.exports = {
    SetNaqelSettings: setNaqelSettings,
    GetNaqelSettings: getNaqelSettings
};