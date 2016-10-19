var co = require('co');
var amqp = require('amqplib');

co(function* () {
    try {
        var q = 'tasks';

        var connect = yield amqp.connect('amqp://localhost');

        var channel = yield connect.createChannel();

        yield channel.assertQueue(q);

        var num = 0;
        setInterval(function () {
            console.log("publish to mq", num + 1);
            channel.sendToQueue(q, new Buffer(++num + ""));
        }, 1000)
    } catch (err) {
        console.log(err);
    }
})

