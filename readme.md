![superstar](http://www.mumbaiishtyle.com/wp-content/uploads/2010/10/rajinikanth.jpg)

# Superstar: FRP Actors in JS

Superstar is a quick PoC implementation  of the actor pattern from Functional-Reactive Programming. It is built over Flux by Facebook, which is by itself, only a few lines of code. It works well on the browser as well as on nodejs. 

## What is an Actor?

Actors are used to represent blocks of code, that can run blocks of code independently depending on a *state* and a *behaviour*. Actors communicate with each other just like human beings do: by sending and receiving messages. Actors co-exist with each other in an *Actor System*. 

## How is all of this useful?

If one uses actors, the only part of the application that has a mutable state is the state of the actors. Further, we enforce that the state of an actor may only change when it receives a message. Thus, we limit the times when we can introduce a side-effect into the system, making it a lot more predictable. We also avoid a lot of callback-hell that comes with async programming. 

## All this is cool, but show me some code!

I have used an example of an auction to demonstrate the Actor flow. In our case, the seller/auction, the buyers as well as the logger, that prints out useful data for us are all actors. Let us look at the behaviour of the various actors. Please note that `say !` is a syntactic sugar, that is heavily used in Scala. `say a ! b` will expand to `this.tell(this.name, a, b);`. I have attached the sweetjs macro in the repo.

### Logger

The logger does not have any mutable state, as it just writes messages to a log. Hence, the data attribute is ` {} `. 

The logger can listen to a message and prints out the sender and the message text. The behaviour or action attribute looks like

```javascript
	
	var action = function(payload, data) {
		console.log("Log from " + payload.source + ": " + payload.value.message);
		return data;
	};

```

### Bidders

Assuming this is a blind auction, the buyer only needs to know if he is winning or not. Thus, the state variable consists of only one boolean initialized to false. 

The bidder may

1. Make an enquiry to the auction, and receive the status
1. Make a bid and receive the status (if the bid succeeds, or if it fails and what is the current maximum bid)
1. Get notified if he got outbid
1. Get notified if the auction is over and he wins

The action signature for the bidder looks like

```javascript

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

```

### Auction/seller

This is the most important piece of our example. The state of an auction includes:

1. isActive: Boolean initialized to false
1. Value of minimum bid
1. Current maximum bid and the corresponding bidder

The actions that need to be performed by the auction include

1. Start and end the auction. If the auction is over, notify the winner. 
1. Respond to enquiries
1. Respond to bids. If the bid is valid, then notify the previous highest bidder where applicable.

The action method looks like

```javascript

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

```

## Putting it all together

To use actors, we need an actor system. In the system, we can register the actors and kick off the flow. 

```javascript

var ActorSystem = require("./ActorSystem");
var Auction = require("./generated/auction");
var Bidder = require("./generated/bidder");
var Logger = require("./generated/logger");

var AS = ActorSystem();

var auction = new Auction();
var logger = new Logger();
var bidder1 = new Bidder();
var bidder2 = new Bidder();
var bidder3 = new Bidder();
var bidder4 = new Bidder();
var bidder5 = new Bidder();


AS.addActor("logger", logger.data, logger.action);
AS.addActor("auction", auction.data, auction.action);
AS.addActor("bidder1", bidder1.data, bidder1.action);
AS.addActor("bidder2", bidder2.data, bidder2.action);
AS.addActor("bidder3", bidder3.data, bidder3.action);
AS.addActor("bidder4", bidder4.data, bidder4.action);
AS.addActor("bidder5", bidder5.data, bidder5.action);

AS.tell("APP", "auction", {status: "START"});
AS.tell("bidder1", "auction", {status: "CHECK"});
AS.tell("bidder1", "auction", {status: "BID", currentBid: 5});
AS.tell("bidder2", "auction", {status: "BID", currentBid: 10});
AS.tell("bidder2", "auction", {status: "CHECK"});
AS.tell("bidder1", "auction", {status: "CHECK"});
AS.tell("APP", "auction", {status: "STOP"});


```