/****用户路由器模块****/
//引入express模块
const express = require('express')
//引入连接池模块
const pool = require('../pool.js')
 
//创建路由器对象
const router = express.Router()
module.exports = router

// 测试接口
//测试地址：http://127.0.0.1:4021/v1/doc/select
router.get('/select',(req,res)=>{
    let sql = 'select * from ph_doc_info'
    pool.query(sql,(error,result)=>{
        if(error) throw error
        if(result.length > 1){
			res.send({code:200,msg:'注册成功',data:result})
		}else{
			res.send({code:501,msg:'注册失败'})
		}
    })
})

//1.完成验证"医生注册"的路由
//GET /v1/doc/register
//请求参数：
//返回结果：注册成功 或 注册失败
//测试地址：http://127.0.0.1:4021/v1/doc/register
router.post('/register',(req,res)=>{
    let id = req.body.doc_id
    let name = req.body.doc_name
    let phone = req.body.doc_phone
    let gender = req.body.doc_gender
    let dept_id = req.body.dept_id
    let img = req.body.doc_image
    let workyears = req.body.doc_workyears
    let details = req.body.doc_details
    let logo = req.body.doc_logo
    let goodat = req.body.doc_goodat

    // console.log(id,name,phone,gender,dept_id,img,workyears,details,logo,goodat);

    let sql = 'insert into ph_doc_info(doc_id,doc_name,doc_phone,doc_gender,dept_id,doc_image,doc_workyears,doc_details,doc_logo,doc_goodat) values (null,?,?,?,?,?,?,?,?,?)'

    pool.query(sql,[name,phone,gender,dept_id,img,workyears,details,logo,goodat],(error,result)=>{
        
        if(error) throw error
        if(result.affectedRows===1){
            res.send({code:200,msg:'注册成功',data:result})
            
        }else{
            res.send({code:501,msg:'注册失败'})
        }
    })
})

//2.完成验证"医生登录"的路由
//post /v1/doc/login
//请求参数：
//返回结果：登录成功 或 登录失败
//测试地址：http://127.0.0.1:4021/v1/doc/login
router.post('/login',(req,res)=>{

    let phone = req.body.doc_phone
    let upwd = req.body.doc_upwd

    let sql = 'select * from ph_doc_info where doc_phone = ?'
    pool.query(sql,[phone],(error,result)=>{
        if(error) throw error
        // res.send(result[0].doc_phone)
        // console.log(result[0].doc_phone,phone);
        // console.log(result[0].doc_upwd)
        if(result.length != 0 && result[0].doc_upwd == upwd){
            res.send({code:200,msg:'登录成功',data:result})
        }else{
            res.send({code:501,msg:'登录失败'})
        }
    })
})

//3.完成验证"医生修改信息"的路由
//post /v1/doc/
//请求参数：
//返回结果：登录成功 或 登录失败
//测试地址：http://127.0.0.1:4021/v1/doc/alter
router.post('/alter',(req,res)=>{
    let obj = req.body
    let sql = 'update ph_doc_info set doc_phone=?,doc_image=?,doc_workyears=?,doc_details=?,doc_logo=?,doc_goodat=?,dept_id=? where doc_name=?'
    pool.query(sql,[obj.doc_phone,obj.doc_image,obj.doc_workyears,obj.doc_details,obj.doc_logo,obj.doc_goodat,obj.dept_id,obj.doc_name],(error,result)=>{
        if(error) throw error
        if(result.affectedRows===1){
			res.send({code:200,msg:'修改信息成功',data:result})
			
		}else{
			res.send({code:501,msg:'修改信息失败,请重新提交信息'})
		}
    })
})

//4.完成验证"删除医生"的路由
//GET /v1/doc/del
//请求参数：
//返回结果：添加成功 或 添加失败
//测试地址：http://127.0.0.1:4021/v1/doc/del
router.post('/del',(req,res)=>{

    let name = req.body.doc_name
    let sql= 'delete from ph_doc_info where doc_name = ?'
    // res.send(obj)
    // obj.did,obj.d_name,obj.d_address,obj.d_local,obj.d-phone,obj.d_detail,obj.d_star
    pool.query(sql,[name],(error,result)=>{
        if(error) throw error
        // console.log(result);
        if(result.affectedRows == 1){
			res.send({code:200,msg:'删除成功'})
			
		}else{
			res.send({code:501,msg:'删除失败'})
		}
    })
})

//5.完成验证"查询医院信息"的路由
//post /v1/doc/find
//请求参数：
//返回结果：登录成功 或 登录失败
//测试地址：http://127.0.0.1:4021/v1/doc/find
router.post('/find',(req,res)=>{
    let id = req.body.doc_id
    let sql = 'select * from ph_doc_info where doc_id=?'
    pool.query(sql,[id],(error,result)=>{
        if(error) throw error
        // res.send(result)
        // console.log(result);
        if(result.length > 0){
			res.send({code:200,msg:'查询成功',data:result})
			
		}else{
			res.send({code:501,msg:'查询失败,请重新提交信息'})
		}
    })
})
//8.医生列表显示
//接口地址:http://127.0.0.1:4021/v1/doc/all
//请求方式:get (query)
router.get('/all',(req,res,next)=>{
    pool.query('select * from ph_doc_info',(err,r)=>{
        if(err){
            next(err)
            return
        }
        if(r.length==0){
            res.send({code:501,msg:'此页无用户信息'})
        }else{
            res.send({code:200,msg:'查询用户列表成功',data:r})
        }
    })
})

//2.所有商品,一页五条分页
//get /showlist?page=页数 参数是页码
//测试地址：http://127.0.0.1:4021/v1/doc/showlist?page=
router.get('/showlist',(req,res)=>{
	let page = (req.query.page-1)*5
	// let sql1 = 'select count(order_number) from ph_business'
	let sql = 'select * from ph_doc_info limit ?,5  '
	pool.query(sql,[page],(err,result)=>{
		if(err){
			throw err
		}
		res.send({code:200,msg:result})
	})
})
//2.总条数
//get /showcount 总条数
//测试地址：http://127.0.0.1:4021/v1/doc/showcount
router.get('/showcount',(req,res)=>{
	let sql = 'select count(doc_id) sum from ph_doc_info'
	pool.query(sql,(err,result)=>{
		if(err){
			throw err
		}
		res.send({code:200,msg:result})
	})
})
//