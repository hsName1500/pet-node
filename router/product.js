/****商品路由器模块*****/
const express = require('express')
const pool = require('../pool.js')

const router = express.Router()
module.exports = router


//1.表中狗狗所有商品
//GET /show/:class
//测试地址：http://127.0.0.1:4021/v1/pro/show/
router.get('/show/:name',(req,res)=>{
	let name1 = req.params.name
	let sql = 'select item_price from ph_business where item_name = ? '
	pool.query(sql,name1,(err,result)=>{
		if(err){
			throw err 
		}
		res.send({code:200, msg:result})
	})
})
//2.表中所有宠物服务商品路由
//GET /show 没有参数
//测试地址：http://127.0.0.1:4021/v1/pro/show
router.get('/show',(req,res)=>{
	let sql = 'select * from ph_business where count is Null'
	pool.query(sql,(err,result)=>{
		if(err){
			throw err 
		}
		res.send({code:200, msg:result})
	})
})


//3.表中狗狗所有商品（包括服务以及食物）
//GET /show/product
//测试地址：http://127.0.0.1:4021/v1/pro/showpro
router.get('/showpro',(req,res)=>{
	let sql = 'select * from ph_business '
	pool.query(sql,(err,result)=>{
		if(err){
			throw err 
		}
		res.send({code:200, msg:result})
	})
})

//4-1.所有商品,一页五条分页
//get /showlist?page=页数 参数是页码
//测试地址：http://127.0.0.1:4021/v1/pro/showlist?page=
router.get('/showlist',(req,res)=>{
	let page = (req.query.page-1)*5
	// let sql1 = 'select count(order_number) from ph_business'
	let sql = 'select * from ph_business limit ?,5  '
	pool.query(sql,[page],(err,result)=>{
		if(err){
			throw err
		}
		res.send({code:200,msg:result})
	})
})
//4-2.总条数
//get /showcount 总条数
//测试地址：http://127.0.0.1:4021/v1/pro/showcount
router.get('/showcount',(req,res)=>{
	let sql = 'select count(item_id) sum from ph_business'
	pool.query(sql,(err,result)=>{
		if(err){
			throw err
		}
		res.send({code:200,msg:result})
	})
})

// 5.声明商品删除路由
  // 接口信息 post /del
  // 请求参数：lid=n
  // 响应消息：{code:201,msg:'删除失败!'}{code:200,msg:'删除成功!'}
  // 测试地址：ApiPost中测试
  // http://127.0.0.1:4021/v1/pro/del
  router.post("/del", (req, res, next) => {
	let id = req.body.item_id;
	// console.log(id);
  
	// let item_id = obj.item_id; //获取查询字符串中参数lid的值
	//console.log(lid+'的类型是：'+typeof(lid))
	// item_id = parseInt(item_id); //将string类型转为number类型
	let sql = "delete from ph_business where item_id=?";
	pool.query(sql, [id], (err, result) => {
	  if (err) {
		next(err);
		return;
	  }
	  //affected被影响的  Rows行数
	  if (result.affectedRows == 1) {
		res.send({ code: 200, msg: "删除成功!" });
	  } else {
		res.send({ code: 201, msg: "删除失败!" });
	  }
	});
  });

  // 6、添加商品路由
  //接口信息 post /pro/add/:item_name/:item_price/:count/:item_image
  
  // http://127.0.0.1:4021/v1/pro/add
  router.post("/add", (req, res, next) => {
	let obj = req.body;
	// console.log(obj);
	if(obj.count==0){
		obj.count=null
	}
	let sql = "insert into ph_business values(null,?,?,?,?,?)";
	pool.query(
	  sql,
	  [obj.item_name, obj.item_price, obj.count, obj.item_image, obj.item_class],
	  (err, result) => {
		if (err) {
		  next(err);
		  return;
		}
		if (result.affectedRows == 1) {
		  res.send({ msg: "商品添加成功", code: 200, result: result });
		} else {
		  res.send({ msg: "商品信息添加失败", code: 201 });
		}
	  }
	);
  });
  
  //  只有狗狗服务业务，无商品信息接口
//7-1.所有商品,一页五条分页
//get /petlist?page=页数 参数是页码
//测试地址：http://127.0.0.1:4021/v1/pro/petlist?page=
router.get("/petlist", (req, res, next) => {
  // let page1 = Number(req.query.page)
  let page = (req.query.page - 1) * 5;
  let sql = "select * from ph_business where count is null limit ?,5";
  pool.query(sql, [page], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.send({ code: 200, msg: result });
  });
});

//7-2.总条数
//get /petcount 总条数
//测试地址：http://127.0.0.1:4021/v1/pro/petcount
router.get("/petcount", (req, res, next) => {
  let sql = "select count(item_id) sum from ph_business where count is null";
  pool.query(sql, (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.send({ code: 200, msg: result });
  });
});

// 修改商品信息
// 测试地址：http://127.0.0.1:4021/v1/pro/updatePro
router.post("/updatePro",(req,res,next)=>{
    let sql = "update ph_business set item_name = ?, item_price=?,count=?,item_image=? where item_id = ?";
    let name = req.body.item_name
    let price = req.body.item_price
    let count = req.body.count
    let image = req.body.item_image
    let id = req.body.item_id
    pool.query(sql,[name,price,count,image,id],(err,result)=>{
        if (err) {
            next(err);
            return;
          }
          res.send({ code: 200, msg: result });
    })
})