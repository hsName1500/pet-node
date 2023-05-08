//创建users路由器
const express = require('express')
const r = express.Router()
//引入连接池pool
const pool = require('../pool.js')

//添加路由(接口)

//1.根据id调用所有数据
//接口地址:http://127.0.0.1:4021/v1/pet/query
//请求方式:post
r.get('/query/:id',(req,res,next)=>{
	var obj=req.params
	pool.query('select * from tips where id=?',[obj.id],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		// console.log(r)
		if(r.length===0){
			res.send({code:501,msg:'文章不存在'})
		}else{
			res.send({code:200,msg:'查找成功',data:r})
		}
	})
})


//2.根据用户手机号查找所用订单
//接口地址:http://127.0.0.1:4021/v1/pet/list?phone=
//请求方式:get
r.get('/list',(req,res,next)=>{
	var obj=req.query
	pool.query('select * from ph_order_list where order_phone = ? order by order_number DESC',[obj.phone],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		// console.log(r)
		if(r.length===0){
			res.send({code:501,msg:'不存在'})
		}else{
			res.send({code:200,msg:'查找成功',data:r})
		}
	})
})

//3.根据手机查找查自己的宠物信息
//接口地址:http://127.0.0.1:4021/v1/pet/mypets?phone=
//请求方式:get
r.get('/mypets',(req,res,next)=>{
	var obj=req.query
    pool.query('select * from ph_pet_info where user_id =  (select uid from ph_user where phone = ?)',[obj.phone],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		if(r.length===0){
			res.send({code:501,msg:'不存在'})
		}else{
            uid = r[0].uid
            // console.log(uid)
			res.send({code:200,msg:'查找成功',data:r})
		}
	})
})

//4.根据用户手机号查找用户自己的信息
//接口地址:http://127.0.0.1:4021/v1/pet/user?phone=
//请求方式:get
r.get('/user',(req,res,next)=>{
	var obj=req.query
	pool.query('select * from ph_user where phone = ?',[obj.phone],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		// console.log(r)
		if(r.length===0){
			res.send({code:501,msg:'不存在'})
		}else{
			res.send({code:200,msg:'查找成功',data:r})
		}
	})
})

//5.插入用户信息
//接口地址:http://127.0.0.1:4021/v1/pet/usermsg
//请求方式:post  参数:uid=&uname= &phone= &address=
r.post('/usermsg',(req,res,next)=>{
	var obj=req.body
    let sql = 'update ph_user set uname=?,phone=?,address =? where uid= ? '
	pool.query(sql,[obj.uname,obj.phone,obj.address,obj.uid],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		// console.log(r)
		if(r.affectedRows===0){
			res.send({code:501,msg:'不存在'})
		}else{
			res.send({code:200,msg:'修改成功',data:r})
		}
	})
})



//6.修改用户自己的密码
//接口地址:http://127.0.0.1:4021/v1/pet/userpsd
//请求方式:post 参数:uid=?&upwd=?&nupwd=?
r.post('/userpsd',(req,res,next)=>{
	var obj=req.body
	pool.query('select upwd from ph_user where uid = ?',[obj.uid],(err,r)=>{
		if(err){
			//throw err
			//如果有错误，交给下一个错误处理中间件
			next(err)
			//阻止往后执行
			return
		}
		// console.log(r)
		if(r[0].upwd==obj.upwd){
			pool.query('update ph_user set upwd=? where uid= ? ',[obj.nupwd,obj.uid],(err,r)=>{
				if(err){
					next(err)
					return
				}
				res.send({code:200,msg:'修改成功'})
			})
			
		}else{
			res.send({code:501,msg:'修改失败'})
		}
	})
})



//暴露users路由
module.exports = r