const fileStream = require("fs");
const fileName = "temporaryFeeRateData.json";

const setTemporaryFeeRateData = temporaryFeeRateData => {
    let json = temporaryFeeRateData ? JSON.stringify(temporaryFeeRateData) : JSON.stringify({});

    fileStream.writeFile(fileName, json, "utf8", () => {
        return;
    });
};

const getTemporaryFeeRateData = onFileRead => {
    fileStream.exists(fileName, exists => {
        if (exists) {
            fileStream.readFile(fileName, "utf8", (error, data) => {
                if (error) {
                    onFileRead({
                        Message: "Temporary fee rate data not found."
                    });
                }
                else {
                    temporaryFeeRateData = JSON.parse(data);

                    if (temporaryFeeRateData.FeeRate) {
                        const dateDifference = new Date(temporaryFeeRateData.Date) - new Date();

                        if (dateDifference < 0) {
                            let json = JSON.stringify({});

                            fileStream.writeFile(fileName, json, "utf8", () => {
                                onFileRead({
                                    Message: "Temporary fee rate data not found."
                                });
                            });
                        }
                        else {
                            onFileRead({
                                Message: "Temporary fee rate data found.",
                                TemporaryFeeRateData: temporaryFeeRateData
                            });
                        }
                    }
                    else {
                        onFileRead({
                            Message: "Temporary fee rate data not found."
                        });
                    }
                }
            });
        }
    });
};

module.exports = {
    SetTemporaryFeeRateData: setTemporaryFeeRateData,
    GetTemporaryFeeRateData: getTemporaryFeeRateData
};