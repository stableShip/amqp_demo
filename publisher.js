var co = require('co');
var amqp = require('amqplib');

co(function* () {
    var connect;
    var channel;
    try {
        connect = yield amqp.connect('amqp://localhost');
        channel = yield connect.createChannel();
        var q = 'tasks';
        yield channel.assertQueue(q);

        var num = 0;
        setInterval(function () {
            console.log("publish to mq", num + 1);
            channel.sendToQueue(q, new Buffer(++num + ""), { persistent: true });
            channel && channel.close();
        }, 1000)
    } catch (err) {
        console.log(err);
    } 

})

