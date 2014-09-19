var ActorSystem$709 = require('./../ActorSystem');
var Auction$710 = require('./auction');
var Bidder$711 = require('./bidder');
var Logger$712 = require('./logger');
var AS$713 = ActorSystem$709();
var auction$714 = Auction$710();
var logger$715 = Logger$712();
var bidder$716 = Bidder$711();
AS$713.addActor('logger', logger$715.data, logger$715.action);
AS$713.addActor('auction', auction$714.data, auction$714.action);
AS$713.addActor('bidder1', bidder$716.data, bidder$716.action);
AS$713.addActor('bidder2', bidder$716.data, bidder$716.action);
AS$713.addActor('bidder3', bidder$716.data, bidder$716.action);
AS$713.addActor('bidder4', bidder$716.data, bidder$716.action);
AS$713.addActor('bidder5', bidder$716.data, bidder$716.action);
AS$713.tell('APP', 'auction', { status: 'STOP' });
AS$713.tell('APP', 'auction', { status: 'START' });
AS$713.tell('APP', 'auction', { status: 'START' });
AS$713.tell('bidder1', 'auction', { status: 'CHECK' });
AS$713.tell('bidder1', 'auction', {
    status: 'BID',
    currentBid: 5
});
AS$713.tell('bidder1', 'auction', { status: 'CHECK' });
AS$713.tell('bidder1', 'auction', { status: 'CHECK' });