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
