const BankTransferModel = require("../models/bankTransferModel.js");

//Sending a new Bank Transfers
exports.send = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Bank transfer
    const bankTransfer = [];

    var data = req.body;
    data.forEach(function (item) {
        bankTransfer.push(new BankTransferModel(
            {
                SendGroupBy: item.Sender + '-' + item.Receiver,
                ReciverGroupBy: item.Receiver + '-' + item.Sender,
                Sender: item.Sender,
                Receiver: item.Receiver,
                Amount: item.Amount
            })
        );
    })

    // Running Bank Transfer
    BankTransferModel.Send(bankTransfer, (err, data) => {
        console.log(data);
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Bank Transfer."
            });
        else res.send(data);
    });
};
