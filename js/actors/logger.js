var logger = function() {
	var data = {

	};

	var action = function(payload, data) {
		console.log("Log from " + payload.source + ": " + payload.value.message);
		return data;
	};

	return {
		data: data,
		action: action
	};
};

module.exports = logger;