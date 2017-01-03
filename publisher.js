var co = require('co');
var amqp = require('amqplib');
var config = require('./config');
var amqpUtil = require('./amqpUtil');

co(function* () {
    try {
        // connect = yield amqp.connect(config.rabbitMqUrl);
        // channel = yield connect.createChannel();
        // setInterval(function () {
        // yield amqpUtil.sendToPointAsync(queue, JSON.stringify({test: "测试"}));
        // }, 1000);
        // yield channel.assertQueue(q);
        // var num = 0;
        // setInterval(function () {
        //     console.log("publish to mq", num + 1);
        //     channel.sendToQueueAsync(q, new Buffer(++num + ""), { persistent: true });
        // }, 1000);
        // channel && channel.close();
        var queue = 'nodeToJava';
        var num = 0;
        setInterval(co.wrap(function*() {
            console.log("publish to mq", num + 1);
            var result = yield amqpUtil.sendToPointAsync(queue, JSON.stringify({test: "测试"}));
            console.log(result);
        }), 2000);

    } catch (err) {
        console.log(err);
    } 

})

