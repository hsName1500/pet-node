/****WEB服务器****/
//引入express模块
const express = require('express')
//laowang
const bodyParser = require('body-parser')


//创建WEB服务器
const app = express()
//express设置端口
const port = 4021
// 启动express服务器
app.listen(port,()=>{
	console.log('WEB服务器已启动成功'+port)
})
//socket设置端口
const socketport = 3000
const server = require('./socket.js')

//laowang
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

app.use(express.static('./public'))

//将post传递的参数转为对象
app.use(express.urlencoded({
	extended:false  //内部是否使用第三方模块
}))

// 加载CORS模块
const cors = require('cors');

// 使用CORS中间件
app.use(cors({
  origin: '*'
}));

const tjs = require('./router/t.js');
app.use('/v1/free', tjs);

const userRouter = require('./router/user.js')
app.use('/v1/user',userRouter)

const orderRouter = require('./router/order.js')
app.use('/v1/order',orderRouter)

const hosRouter = require('./router/hospital.js')
app.use('/v1/hos',hosRouter)

const proRouter = require('./router/product.js')
app.use('/v1/pro',proRouter)

const petRouter = require('./router/pet.js')
app.use('/v1/pet',petRouter)

const docRouter = require('./router/doc.js')
app.use('/v1/doc',docRouter)


//错误中间件
app.use((err,req,res,next)=>{
    console.log(err)
    res.send({code:500,msg:'服务器错误'})
})

// 错误处理中间件 写在路由器之后  拦截所有请求
app.use((err,req,res,next)=>{
	if(err.name==="UnauthorizedError"){
		return res.status(401).send({code:401,message:"无效的token或者过期的token"})
	}
	console.log(err); 
	res.status(500).send({code:500,msg:"服务器端错误"});
})

server.listen(socketport, () => {
  console.log('websocket服务启动已启动,正在监听 *:',socketport);
});