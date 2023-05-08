//引入express模块
const express = require('express')
//创建WEB服务器
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
// const cors = require('cors');
const io = new Server(server,{
    cors:{
         origin:'*'
    }
});
module.exports=server

//数据处理



let count = 0
io.on('connection', (socket) => {
  console.log('有客户端连进来了:'+socket.id);
  //计数数量
  socket.emit('textmsg2','自动消息:你好呀')
  // pauseTime(5000)
  count++
  io.emit('countmsg',count)
    //监听socket的断开
    socket.on('disconnect',function(){
        count --
        io.emit('countmsg',count)
    })
  // 连接建立成功时,获取用户端的socket对象

  // 监听textmsg类型的消息,一旦接受开始处理信息
  
  socket.on('gkmsg',function(data){
    // console.log(data)
    io.emit('textmsg1',data)
  })
  socket.on('kfmsg',function(data){
    // console.log(data)
    io.emit('textmsg2',data)
  })

});



