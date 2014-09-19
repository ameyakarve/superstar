var Actor = function(name, data, action, dispatcher, tell) {
	var _name = name;
	var _data = data;
	var _action = action.bind({tell: tell, name: name});
	var act = function(payload) {

		if(payload.destination === _name) {
			_data = _action(payload, _data);
		}
	};
	var getName = function() {
		return _name;
	};
	var dispatchToken = dispatcher.register(act);
	return {
		dispatchToken: dispatchToken, 
		log: function() {
			console.log(_data, _action);
		},
		getName: getName,
		tell: tell
	};
};

module.exports = Actor;