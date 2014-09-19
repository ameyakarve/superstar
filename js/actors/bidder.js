var bidder = function() {
	var data = {
		win: false
	};
	var action = function(payload, data) {
		
		if(payload.value.status === "FINISHED") {
			say "logger" ! {message: "Yay! I is a win"}
		} else if(payload.value.status === "CHECKREPLY") {
			say "logger" ! {message: "Received a reply from the auction with data " + JSON.stringify(payload.value)}
		} else if(payload.value.status === "FAILURE") {
			say "logger" ! {message: "My bid failed off"}
			data.win = false
		} else if(payload.value.status === "SUCCESS") {
			say "logger" ! {message: "My bid was successful"}
			data.win = true
		} else if(payload.value.status === "OVERTAKE") {
			say "logger" ! {message: "I got overtaken by a bid of " + payload.value.maxBid}
		} else {
			say "logger" ! {message: "Invalid request made"}
		}

		return data;
	};
	return {
		data: data,
		action: action
	};
};

module.exports = bidder;