/****用户路由器模块****/
//引入express模块
const express = require('express')
//引入连接池模块
const pool = require('../pool.js')

//创建路由器对象
const router = express.Router()
module.exports = router

//1.完成验证"新增医院"的路由
//GET /v1/doc/add
//请求参数：
//返回结果：添加成功 或 添加失败
//测试地址：http://127.0.0.1:4021/v1/hos/add
router.post('/add',(req,res)=>{

    let obj = req.body
    let sql= 'insert into ph_dept values (?,?,?,?,?,?,?)'
    // res.send(obj)
    // obj.did,obj.d_name,obj.d_address,obj.d_local,obj.d-phone,obj.d_detail,obj.d_star 
    pool.query(sql,[obj.did,obj.d_name,obj.d_address,obj.d_local,obj.d_phone,obj.d_detail,obj.d_star],(error,result)=>{
        console.log(obj);
        if(error) throw error
        if(result.affectedRows===1){
			res.send({code:200,msg:'添加成功',data:result})
			
		}else{
			res.send({code:501,msg:'添加失败'})
		}
    })
})

//2.完成验证"删除医院"的路由
//GET /v1/doc/del
//请求参数：
//返回结果：添加成功 或 添加失败
//测试地址：http://127.0.0.1:4021/v1/hos/del
router.post('/del',(req,res)=>{

    let did = req.body.did
    let sql= 'delete from ph_dept where did = ?'
    // res.send(obj)
    // obj.did,obj.d_name,obj.d_address,obj.d_local,obj.d-phone,obj.d_detail,obj.d_star
    pool.query(sql,[did],(error,result)=>{
        if(error) throw error
        console.log(result);
        if(result.affectedRows == 1){
			res.send({code:200,msg:'删除成功'})
			
		}else{
			res.send({code:501,msg:'删除失败'})
		}
    })
})

//3.完成验证"修改医院信息"的路由
//post /v1/hos/alter
//请求参数：
//返回结果：登录成功 或 登录失败
//测试地址：http://127.0.0.1:4021/v1/hos/alter
router.post('/alter',(req,res)=>{
    let obj = req.body
    let sql = 'update ph_dept set d_name=?,d_address=?,d_local=?,d_phone=?,d_detail=?,d_star=? where did=?'
    pool.query(sql,[obj.d_name,obj.d_address,obj.d_local,obj.d_phone,obj.d_detail,obj.d_star,obj.did],(error,result)=>{
        if(error) throw error
        console.log(result);
        console.log(sql,obj);
        if(result.affectedRows===1){
			res.send({code:200,msg:'修改信息成功',data:result})
			
		}else{
			res.send({code:501,msg:'修改信息失败,请重新提交信息'})
		}
    })
})

//4.完成验证"查询医院信息"的路由
//post /v1/hos/find
//请求参数：
//返回结果：查询成功 或 查询失败
//测试地址：http://127.0.0.1:4021/v1/hos/find
router.post('/find',(req,res)=>{
    let did = req.body.did
    let sql = 'select * from ph_dept where did=?'
    pool.query(sql,[did],(error,result)=>{
        if(error) throw error
        // res.send(result)
        console.log(result);
        if(result.length > 0){
			res.send({code:200,msg:'查询成功',data:result})
			
		}else{
			res.send({code:501,msg:'查询失败,请重新提交信息'})
		}
    })
})

//5.完成验证"查询医院信息和该医院医生的信息"的路由
//post /v1/hos/findall
//请求参数：
//返回结果：查询成功 或 查询失败
//测试地址：http://127.0.0.1:4021/v1/hos/findall
router.post('/findall',(req,res)=>{
    let did = req.body.did
    let sql = 'select * from ph_dept,ph_doc_info where did=? && dept_id =?'
    pool.query(sql,[did,did],(error,result)=>{
        if(error) throw error
        if(result.length > 0){
			res.send({code:200,msg:'查询成功',data:result})
			
		}else{
			res.send({code:501,msg:'查询失败,请重新提交信息'})
		}
    })
})

//6.完成查询"医院的名称和经纬度坐标"的路由
//post /v1/hos/local
//请求参数：
//返回结果：查询成功 或 查询失败
//测试地址：http://127.0.0.1:4021/v1/hos/local
router.get('/local',(req,res)=>{
    let sql = 'select * from ph_dept'
    pool.query(sql,(error,result)=>{
        if(error) throw error
        if(result.length > 0){
			res.send({code:200,msg:'查询成功',data:result})
			
		}else{
			res.send({code:501,msg:'查询失败'})
		}
    })
})

