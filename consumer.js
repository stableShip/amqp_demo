var co = require('co');
var amqp = require('amqplib');

co(function* () {
    var connect;
    var channel1;
    try {
        var q = 'tasks';
        connect1 = yield amqp.connect('amqp://localhost');

        channel1 = yield connect1.createChannel();

        yield channel1.assertQueue(q);

        var num = 0;
        channel1.consume(q, function (msg) {
            if (msg !== null) {
                console.log("get Message: ", msg.content.toString());
                channel1.ack(msg);
                num++;
                console.log("total: ", num);
            }
        });
    } catch (err) {
        console.log(err);
    } 
})