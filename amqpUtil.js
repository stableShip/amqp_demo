"use strict";

var co = require('co');
var amqp = require('amqplib');

class AmqpUtil {

    /**
     * 获取amqp连接
     */
    static getConn() {
        return co(function* () {
            if (!AmqpUtil.connect) {
                var connect = yield amqp.connect('amqp://localhost');
                AmqpUtil.connect = connect;
            }
            return AmqpUtil.connect;
        })
    }
}

module.exports = AmqpUtil;