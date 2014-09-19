var bidder$668 = function () {
    var data$669 = { win: false };
    var action$670 = function (payload$671, data$672) {
        if (payload$671.value.status === 'FINISHED') {
            this.tell(this.name, 'logger', { message: 'Yay! I is a win' });
        } else if (payload$671.value.status === 'CHECKREPLY') {
            this.tell(this.name, 'logger', { message: 'Received a reply from the auction with data ' + JSON.stringify(payload$671.value) });
        } else if (payload$671.value.status === 'FAILURE') {
            this.tell(this.name, 'logger', { message: 'My bid failed off' });
            data$672.win = false;
        } else if (payload$671.value.status === 'SUCCESS') {
            this.tell(this.name, 'logger', { message: 'My bid was successful' });
            data$672.win = true;
        } else if (payload$671.value.status === 'OVERTAKE') {
            this.tell(this.name, 'logger', { message: 'I got overtaken by a bid of ' + payload$671.value.maxBid });
        } else {
            this.tell(this.name, 'logger', { message: 'Invalid request made' });
        }
        return data$672;
    };
    return {
        data: data$669,
        action: action$670
    };
};
module.exports = bidder$668;