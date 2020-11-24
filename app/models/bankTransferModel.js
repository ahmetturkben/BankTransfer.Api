const ResultBankTransferModel = require('./ResultBankTransferModel.js')

//constructor
const BankTransferModel = function (transfer) {
    this.SendGroupBy = transfer.Sender + '-' + transfer.Receiver;
    this.ReceiverGroupBy = transfer.Receiver + '-' + transfer.Sender;
    this.Sender = transfer.Sender;
    this.Receiver = transfer.Receiver;
    this.Amount = transfer.Amount;
};

const BankTransferGroup = new ResultBankTransferModel();

function getReceiverBank(bank) {
    let index = -1;
    index = BankTransferGroup.Receivers.findIndex(x => x.SendGroupBy == bank.SendGroupBy);
    if (index == -1) {
        index = BankTransferGroup.Receivers.findIndex(x => x.ReceiverGroupBy == bank.ReceiverGroupBy);
    }
    if (index == -1) {
        index = BankTransferGroup.Receivers.findIndex(x => x.SendGroupBy == bank.ReceiverGroupBy);
    }
    if (index == -1) {
        index = BankTransferGroup.Receivers.findIndex(x => x.ReceiverGroupBy == bank.SendGroupBy);
    }

    return index;
}


BankTransferModel.Send = (transfer, result) => {
    console.log("Send success.");
    var lenght = Object.keys(transfer).length;

    for (var i = 0; i < lenght; i++) {
        var receiverDataIndex = getReceiverBank(transfer[i]);
        console.log(receiverDataIndex);
        if (receiverDataIndex > -1) {
            console.log(BankTransferGroup.Receivers[receiverDataIndex])
            if (BankTransferGroup.Receivers[receiverDataIndex].Sender == transfer[i].Sender) {
                BankTransferGroup.Receivers[receiverDataIndex].Amount = BankTransferGroup.Receivers[receiverDataIndex].Amount + transfer[i].Amount;
            }
            else if (BankTransferGroup.Receivers[receiverDataIndex].Receiver == transfer[i].Sender) {
                let result = transfer[i].Amount - BankTransferGroup.Receivers[receiverDataIndex].Amount;
                if (result < 0) {
                    var tempReceiver = transfer[i].Sender;
                    console.log(tempReceiver)
                    BankTransferGroup.Receivers[receiverDataIndex].Sender = transfer[i].Receiver;
                    BankTransferGroup.Receivers[receiverDataIndex].Receiver = tempReceiver;
                    BankTransferGroup.Receivers[receiverDataIndex].Amount = result;
                }
                else {
                    var tempSender = transfer[i].Sender;
                    BankTransferGroup.Receivers[receiverDataIndex].Sender = tempSender;
                    BankTransferGroup.Receivers[receiverDataIndex].Receiver = transfer[i].Receiver;
                    BankTransferGroup.Receivers[receiverDataIndex].Amount = result;
                }
            }
        }
        else {
            console.log(transfer[i])
            BankTransferGroup.Receivers.push(transfer[i]);
        }
    }

    //eksi olan de?erleri pozitife çeviriyoruz. 0 lanan / borçlar?n? kapatan bankalar? listeden kald?r?r?z.
    BankTransferGroup.Receivers.forEach(function (item, index, object) {
        if (item.Amount < 0)
            item.Amount = Math.abs(item.Amount);
        if (item.Amount == 0)
            BankTransferGroup.Receivers.splice(index, 1);
    })

    //Modelde Receiver borçlu, Sender borç veren bilgisidir. Amount d???nda ki di?er alanlar teknik k?s?m için kullan?lm??t?r.
    //Result ile verilen response da ki receiver ve sender alanlar? dinamik olarak de?i?ebilmektedir. Dilenirse farkl? bir modele maplenere
    //response döndürülebilir.


    //Question 2 START
    var array = [1, 4, 6, 9];
    let lengthArray = array.length;
    for (lengthArray -= 2; lengthArray > -1; lengthArray -= 1) {
        array.push(array[lengthArray]);
        array.splice(lengthArray, 1);
    }

    console.log(array);
    //Question 2 END


    result(null, BankTransferGroup.Receivers);
};

module.exports = BankTransferModel;