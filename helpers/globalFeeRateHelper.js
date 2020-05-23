const fileStream = require("fs");
const fileName = "globalFeeRate.json";

const setGlobalFeeRate = feeRate => {
    let json = JSON.stringify({
        FeeRate: feeRate
    });

    fileStream.writeFile(fileName, json, "utf8", () => { return; })
};

const getGlobalFeeRate = onFileRead => {
    fileStream.exists(fileName, exists => {
        if (exists) {
            fileStream.readFile(fileName, "utf8", (error, data) => {
                if (error) {
                    onFileRead({
                        Message: "Global fee rate not found."
                    });
                }
                else {
                    object = JSON.parse(data);

                    onFileRead({
                        Message: "Global fee rate found.",
                        FeeRate: object.FeeRate
                    });
                }
            });
        }
    });
};

module.exports = {
    SetGlobalFeeRate: setGlobalFeeRate,
    GetGlobalFeeRate: getGlobalFeeRate
};