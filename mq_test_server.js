"use strict"


/**
 * http 服务器配置
 * @type {*|exports|module.exports}
 */
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var co = require('co');
var amqp = require('amqplib');

// express配置
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 86400000}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/message/post", function (req, res) {
    co(function* (){
        try{
         var q = 'tasks';

        var connect = yield amqp.connect('amqp://localhost');

        var channel = yield connect.createChannel();

        yield channel.assertQueue(q);

        var result = channel.sendToQueue(q, new Buffer(JSON.stringify(req.body)));
        console.log("result:", result);
        res.send(result);
        }catch(err){
            console.log(err);
            res.send("system error");
        }
    })
});

app.listen(3003, function(){
    console.log("server listen in 3003")
})