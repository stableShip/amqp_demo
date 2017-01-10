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
                // use a confirm channel so we can check the message is sent OK.
                var channel = yield connect.createConfirmChannel();
                // 声明渠道
                yield channel.assertQueue(queue);
                // 发送消息到渠道
                var result = channel.sendToQueue(queue, new Buffer(msg), {persistent: true});
                // if message has been nacked, this will result in an error (rejected promise);
                yield channel.waitForConfirms();
                // 必须发送成功才能进行关闭,使用waitForConfirms进行保证
                channel && channel.close();
                return result;
            }
        )
    }

    /**
     * 发送消息到mq的exchange (所有绑定exchange都可收到)
     * @param exchange String exchange名称
     * @param msg String 发送的消息
     * @param exchangeType String exchange类型
     * @returns {*}
     */
    static sendToExchangeAsync(exchange, msg, exchangeType) {
        return co(function*() {
                exchangeType = exchangeType || 'direct';
                var connect = yield AmqpUtil.getConnAsync();
                var channel = yield connect.createConfirmChannel();
                // 声明exchange
                channel.assertExchange(exchange, exchangeType, {durable: true});
                var result = channel.publish(exchange, '', new Buffer(msg));
                // if message has been nacked, this will result in an error (rejected promise);
                yield channel.waitForConfirms();
                // 必须发送成功才能进行关闭,使用waitForConfirms进行保证
                channel && channel.close();
                return result;
            }
        )
    }

    /**
     *
     * @param queue 监听queue名称
     * @param dealFun 接收queue发送过来的消息处理函数
     */
    static consumeQueueAsync(queue, dealFun) {
        return co(function*() {
            var connect = yield AmqpUtil.getConnAsync();
            var channel = yield connect.createChannel();
            yield channel.assertQueue(queue);
            if (dealFun.constructor.name !== 'GeneratorFunction') {
                channel.consume(queue, dealFun);
            } else {
                channel.consume(queue, co.wrap(dealFun));
            }
        });
    }


    /**
     *
     * @param exchange 监听exchange名称
     * @param dealFun 接收queue发送过来的消息处理函数
     */
    static consumeExchangeAsync(exchange, dealFun) {
        return co(function*() {
            var connect = yield AmqpUtil.getConnAsync();
            var channel = yield connect.createConfirmChannel();
            // 声明exchange
            yield channel.assertExchange(exchange, 'direct', {durable: true});
            var queue = yield channel.assertQueue('',   {exclusive: true});
            queue = queue.queue;
            channel.bindQueue(queue, exchange);
            if (dealFun.constructor.name !== 'GeneratorFunction') {
                channel.consume(queue, dealFun);
            } else {
                channel.consume(queue, co.wrap(dealFun));
            }
        });
    }
}

module.exports = AmqpUtil;