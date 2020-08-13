var express = require("express");
const bodyParser = require('body-parser');
var router = require("./router");
var app = express();
var PORT = 8080;

app.use(require('cors')());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(router);
app.listen(PORT,function(){
    console.log("服务器开始监听端口：%d",PORT);
});