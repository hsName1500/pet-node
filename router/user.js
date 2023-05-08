/****用户路由器模块****/
//引入express模块
const express = require('express')
//引入连接池模块
const pool = require('../pool.js')

//创建路由器对象
const router = express.Router()
module.exports = router

//1.用户注册
//post   /register
//测试地址：http://127.0.0.1:4021/v1/user/register
router.post('/register',(req,res,next)=>{
	//获取post传递参数
	let obj=req.body
	// 验证手机号的格式
	if(!/^1[3-9]\d{9}$/.test( obj.phone ) ){
		res.send({code:401,msg:'手机号码格式错误'})
	}else{
		//定义sql语句
	let sql='select uid from ph_user where phone = ?;'
	//执行sql语句
	pool.query(sql,[obj.phone],(err,results)=>{
		if(err) {
			next (err)
			return
		};
		if(results.length!= 0){
			res.send({msg:'用户已存在',code:401});
		}else{
			// 将用户的相关信息插入到用户数据表中
			sql = 'insert into ph_user set ?;'
			pool.query(sql,[obj],(err,results)=>{
			 if(err)throw err;
			 res.send({msg:'注册成功！',code:200,result:results});
			})
		}
	})
	}
	})
	
//2.用户登录//
//post   /login
//测试地址：http://127.0.0.1:4021/v1/user/login
router.post('/login',(req,res,next)=>{
	//获取post传递参数
	let phone=req.body.phone
	let upwd=req.body.upwd
	//定义sql语句
	let sql='select uid,uname,phone,address,upwd from ph_user where phone=? and upwd=?;'
	//执行sql语句
	pool.query(sql,[phone,upwd],(err,results)=>{
		// console.log(results[0].upwd)
		if(err) {
			next(err)
			return
		}else if(results.length ==0 || results[0].upwd !=req.body.upwd){
				// 查询结果是数组，如果是空数组，登录失败，否则登录成功
			res.send({msg:'用户名或者密码错误',code:201})
		}else{
			res.send({msg:'登录成功',code:200,result:results})
		}
	
	
	})
})


//3.用户修改信息并上传
// post /set
//测试地址：http://127.0.0.1:4021/v1/user/set
router.post('/set',(req,res,next)=>{
	console.log(req.body);
	let obj = req.body
	let sql='update ph_user set uname=?,upwd=?,phone=?,address=? where uid=?;'
	pool.query(sql,[obj.uname,obj.upwd,obj.phone,obj.address,obj.uid],(err,results)=>{
		if(err){
			next(err)
			return
		}else if(results.length==0){
			res.send({msg:'修改信息失败',code:201})
		}else{
			res.send({msg:'信息修改成功',code:200,result:results})
		}
	})
})

//4.修改宠物信息
// post /set_pet
//测试地址：http://127.0.0.1:4021/v1/user/set_pet
router.post('/set_pet',(req,res,next)=>{
	let obj=req.body
	console.log(obj);
	let sql='update ph_pet_info set pet_name=?,pet_age=?,pet_image=? where user_id=?;'
	pool.query(sql,[obj.pet_name,obj.pet_age,obj.pet_image,obj.user_id],(err,results)=>{
		if(err){
			next(err)
			return
		}else if(results.length==0){
			res.send({msg:'修改信息失败',code:201})
		}else{
			res.send({msg:'信息修改成功',code:200,result:results})
		}
	})
})

//5.查找用户(get /detail)
//接口地址：http://127.0.0.1:4021/v1/user/detail/2
//请求方式：get 
router.get('/detail/:uid',(req,res,next)=>{
	//获取params传递的参数
	let obj=req.params
	console.log(obj)
	// 定义sql语句
	let sql = 'select uname,phone,address from ph_user where uid=?;'
	//执行SQL命令，查询编号对应的用户
	pool.query(sql,[obj.uid],(err,results)=>{
		//如果SQL命令执行有错误(连接错误或者SQL命令书写错误)，会抛出错误，真正上线不能使用这种
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		console.log(results)
		//结果是数组，如果是空数组，说明该用户不存在，否则存在
		if(results.length===0){
			res.send({code:500,msg:'该用户不存在'})
		}else{
			res.send({code:200,msg:'查找成功',result:results})
		}
	})

})

//6.用户列表
// get  /list
//接口地址：http://127.0.0.1:4021/v1/user/list
router.get('/list',(req,res,next)=>{
	//获取get传递的参数
	let obj=req.query
	//如果页码为空，设置默认值为1
	if(!obj.pno){
		obj.pno=1
	}
	//如果每页数量为空，设置默认值5       
	if(!obj.count){
		obj.count=5
	}
	console.log(obj)
	//计算开始查询的值
  let start=(obj.pno-1)*obj.count
	//将每页数据量转为数值型
	let size=Number(obj.count)
	//执行SQL命令，分页查询
	let sql = 'select uname,phone,address from ph_user limit ?,?'
	pool.query(sql,[start,size],(err,results)=>{
		if(err){
			//交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		console.log(results)
		//把查询到的响应到前端
		res.send({code:200,msg:'查找成功',result:results})
	})
	
})

//1.完成验证"用户名是否存在"的路由
//GET /v2/user/check_uname
//请求参数：uname=dingding
//返回结果：exists 或 non-exists
//测试地址：http://127.0.0.1:4021/v1/user/fund?uid=2
router.get('/fund',(req,res)=>{
	//获取query传递参数
	var n=req.query.uname
	//定义sql语句
	var sql='select * from ph_user'
	//执行sql语句
	pool.query(sql,[n],(err,result)=>{
		if(err){
			throw err 
		}
		res.send(result)
	})
})
	

//2.完成"通过用户名与密码登录"的接口
//GET /login
//请求参数 uname=tom&upwd=123
//返回结果 login success 或 login failed
//测试地址：http://127.0.0.1:8080/v2/user/login?uname=tom&upwd=123
router.get('/login',(req,res)=>{
	//console.log('1111')
	//获取query传递参数
	var n=req.query.uname
	var p=req.query.upwd
	//console.log(typeof(p))
	//定义sql语句
	var sql='select uid from xz_user where uname=? and upwd=?'
	//执行sql语句
	pool.query(sql,[n,p],(err,result)=>{
		if(err){
			throw err 
		}
		console.log(result)
		if(result.length>0){
			res.send('login success')
		}else{
			res.send('login failed')
		}
	})
})