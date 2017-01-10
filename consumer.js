var co = require('co');
var amqpUtil = require('./amqpUtil');


co(function* () {
    try {
        var queue = "nodeToJava";
        // yield amqpUtil.consumeQueueAsync(queue, function (msg) {
        //     console.log(msg.content.toString());
        // });
        var exchange = "test";
        yield amqpUtil.consumeExchangeAsync(exchange, function (msg) {
            console.log(msg.content.toString());
        })
    } catch (err) {
        console.log(err, err.status);
    } 
});