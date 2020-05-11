var ws = require("nodejs-websocket");
var Excute = require("./routes/excute.js");
console.log("开始建立连接...")

var game1 = null, game1Ready = false;
var server = ws.createServer(function(conn){
    conn.on("text", function (str) {
        console.log("收到的信息为:" + str)
        // 路由地址
        if(str === "/api/geneShellByConfig"){
            game1 = conn;
            game1Ready = true;
            conn.sendText("success");
        }
        // 执行脚本
        Excute('hello-world', '', conn)
    })
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
})
server.listen(8001)
console.log("WebSocket建立完毕")
