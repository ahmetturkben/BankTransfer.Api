module.exports = app => {
    const banktransfer = require("../controllers/bankTransferController.js");
    // Send Bank Tranfer
    app.post("/banktransfer", banktransfer.send);
};