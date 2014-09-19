var auction = function() {
	var data = {
		isActive: false,
		minBid: 10.0,
		maxBidder: null,
		maxBid: 0.0,
		minRaise: 10.0
	};
	var action = function(payload, data) {
		if(payload.value.status === "START") {
			if(data.isActive === false) {
				data.isActive = true;
				say "logger" ! {message: "Started the auction"}
			} else {
				say "logger" ! {message: "Auction has already begun"}
			}
		} else if(payload.value.status === "STOP") {
			if(data.isActive === true) {
				data.isActive = false;
				if(data.maxBid < data.minBid) {
					say "logger" ! {message: "The item went unsold"}

				} else {
					say "logger" ! {message: "The item was sold to " + data.maxBidder + " for " + data.maxBid}
					say data.maxBidder ! {status: "FINISHED"}
				}
			}
		} else if(payload.value.status === "CHECK") {
			say "logger" ! {message: "The auction status was checked by " + payload.source}
			say payload.source ! {status: "CHECKREPLY", isActive: this.isActive, maxBid: this.maxBid, minBid: this.minBid}
		} else if(payload.value.status === "BID") {
			if(payload.value.currentBid < this.maxBid || payload.value.currentBid < this.minBid) {
				say payload.source ! {status: "FAILURE"}
			} else {
				if(this.minBid <= this.maxBid) {
					say data.maxBidder ! {status: "OVERTAKE", maxBid: payload.value.currentBid}
				}

				data.maxBidder = payload.source;
				data.maxBid = payload.value.currentBid;

				say data.maxBidder ! {status: "SUCCESS", maxBid: data.maxBid}
			}

		} else {
			say "logger" ! {message: "Invalid message"}
		}
		return data;
	};

	return {
		data: data,
		action: action
	};
};

module.exports = auction;