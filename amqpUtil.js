"use strict";

var co = require('co');
var amqp = require('amqplib');
var config = require('./config');

class AmqpUtil {

    /**
     * 获取amqp连接
     */
    static getConnAsync() {
        return co(function*() {
            if (!AmqpUtil.connect) {
                var connect = yield amqp.connect(config.rabbitMqUrl);
                AmqpUtil.connect = connect;
            }
            return AmqpUtil.connect;
        })
    }

    /**
     * 发送消息到mq的queue (点对点)
     * @param queue String mq渠道名
     * @param msg String 发送的消息
     * @returns {*}
     */
    static sendToPointAsync(queue, msg) {
        return co(function*() {
                var connect = yield AmqpUtil.getConnAsync();
                var channel = yield connect.createChannel();
                yield channel.assertQueue(queue);
                var result = channel.sendToQueue(queue, new Buffer(msg), {persistent: true});
                channel && channel.close();
                return result;
            }
        )
    }

    static sendToExchangeAsync(exchange, queue, msg) {
        return co(function*() {
                var connect = yield AmqpUtil.getConnAsync();
                var channel = yield connect.createChannel();
                channel.assertExchange(exchange, 'direct', {durable: true});
                var result = channel.sendToQueueAsync(queue, new Buffer(msg), {persistent: true});
                channel && channel.close();
                return result;
            }
        )
    }

    /**
     *
     * @param queue
     * @param dealFun 接收queue发送过来的消息进行处理
     */
    static consumeQueueAsync(queue, dealFun) {
        return co(function* () {
            console.log(typeof dealFun , isGenerator(dealFun));
            var connect = yield AmqpUtil.getConnAsync();
            var channel = yield connect.createChannel();
            yield channel.assertQueue(queue);
            channel.consume(queue, co.wrap(dealFun));
        });
    }
}

module.exports = AmqpUtil;