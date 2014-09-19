var system = function() {
	var _ = require("mori");
	var Dispatcher = require("flux").Dispatcher;
	var Actor = require("./Actor");

	var _actors = _.hash_map();
	var _dispatcher = new Dispatcher();
	var self = this;

	var addActor = function(name, data, action) {
		var actor = new Actor(name, data, action, _dispatcher, tell);
		_actors = _.assoc(_actors, name, actor);
		return self;
	};

	var tell = function(source, destination, value) {
		_dispatcher.dispatch({
			source: source,
			destination: destination,
			value: value,
			tell: this
		});
	};

	return {
		addActor: addActor,
		tell: tell
	};
};

module.exports = system;

