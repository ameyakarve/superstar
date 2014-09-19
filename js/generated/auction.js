var auction$642 = function () {
    var data$643 = {
            isActive: false,
            minBid: 10,
            maxBidder: null,
            maxBid: 0,
            minRaise: 10
        };
    var action$644 = function (payload$645, data$646) {
        if (payload$645.value.status === 'START') {
            if (data$646.isActive === false) {
                data$646.isActive = true;
                this.tell(this.name, 'logger', { message: 'Started the auction' });
            } else {
                this.tell(this.name, 'logger', { message: 'Auction has already begun' });
            }
        } else if (payload$645.value.status === 'STOP') {
            if (data$646.isActive === true) {
                data$646.isActive = false;
                if (data$646.maxBid < data$646.minBid) {
                    this.tell(this.name, 'logger', { message: 'The item went unsold' });
                } else {
                    this.tell(this.name, 'logger', { message: 'The item was sold to ' + data$646.maxBidder + ' for ' + data$646.maxBid });
                    this.tell(this.name, data$646.maxBidder, { status: 'FINISHED' });
                }
            }
        } else if (payload$645.value.status === 'CHECK') {
            this.tell(this.name, 'logger', { message: 'The auction status was checked by ' + payload$645.source });
            this.tell(this.name, payload$645.source, {
                status: 'CHECKREPLY',
                isActive: this.isActive,
                maxBid: this.maxBid,
                minBid: this.minBid
            });
        } else if (payload$645.value.status === 'BID') {
            if (payload$645.value.currentBid < this.maxBid || payload$645.value.currentBid < this.minBid) {
                this.tell(this.name, payload$645.source, { status: 'FAILURE' });
            } else {
                if (this.minBid <= this.maxBid) {
                    this.tell(this.name, data$646.maxBidder, {
                        status: 'OVERTAKE',
                        maxBid: payload$645.value.currentBid
                    });
                }
                data$646.maxBidder = payload$645.source;
                data$646.maxBid = payload$645.value.currentBid;
                this.tell(this.name, data$646.maxBidder, {
                    status: 'SUCCESS',
                    maxBid: data$646.maxBid
                });
            }
        } else {
            this.tell(this.name, 'logger', { message: 'Invalid message' });
        }
        return data$646;
    };
    return {
        data: data$643,
        action: action$644
    };
};
module.exports = auction$642;