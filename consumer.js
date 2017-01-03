var co = require('co');
var amqpUtil = require('./amqpUtil');


co(function* () {
    try {
        var queue = "nodeToJava";
        amqpUtil.consumeQueueAsync(queue, function* (msg) {
            console.log(msg.content.toString());
        });
    } catch (err) {
        console.log(err);
    } 
});