var co = require('co');
var amqp = require('amqplib');

class AmqpUtil {

    /**
     * 获取amqp连接
     */
    static getConn() {
        return co(function* () {
            var connect = yield amqp.connect('amqp://localhost');
            return connect;
        })
    }

    
}