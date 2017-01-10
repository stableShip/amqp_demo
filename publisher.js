var co = require('co');
var amqp = require('amqplib');
var config = require('./config');
var amqpUtil = require('./amqpUtil');

co(function* () {
    try {
        // 通过queue发送消息
        // var queue = 'nodeToJava';
        // var num = 0;
        // setInterval(co.wrap(function*() {
        //     console.log("publish to mq", num + 1);
        //     var result = yield amqpUtil.sendToPointAsync(queue, JSON.stringify({test: "测试"}));
        //     console.log(result);
        // }), 2000);

        //通过exchange发送消息
        setInterval(co.wrap(function*() {
            console.log("publish to mq", num + 1);
            var result = yield amqpUtil.sendToExchangeAsync('test', JSON.stringify({test: "exchange"}));
            console.log(result);
        }), 2000);
    } catch (err) {
        console.log(err);
    } 

});

