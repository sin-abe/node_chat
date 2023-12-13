const express = require('express');
const app = express();


// マルチバイト対応・/publicを公開
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// サーバーの作成
const { createServer } = require('node:http');
const server = createServer(app);

// .envの読み込み
const dotenv = require('dotenv');
dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

// サーバーを待機
server.listen(port,host,() =>{
    console.log(`listening on http://${host}:${port}`);
})

const {Server} = require('socket.io');
const io = new Server(server);
io.on("connection",(socket) =>{
    console.log("connected:" + socket.id);
    socket.on("chat_message",(data) =>{
        console.log(data);
        data.socketID = socket.id;
        data.time = Date.now();
        io.emit("chat_message",data);
    });
});