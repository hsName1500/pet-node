/****用户路由器模块****/
//引入express模块
const express = require("express");
//引入连接池模块
const pool = require("../pool.js");

//创建路由器对象
const router = express.Router();
module.exports = router;

//1.root查询所有订单的接口
//GET /v1/order/root
//请求参数:无
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/root/all
router.get("/root/all", (req, res) => {
  //定义sql语句
  var sql = "select * from ph_order_list";
  //执行sql语句
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send({ code: 200, msg: result });
  });
});
//////////////////////////////////////////////////////

//1-1.所有商品,一页五条分页
//get /alllist?page=页数 参数是页码
//测试地址：http://127.0.0.1:4021/v1/order/alllist?page=
router.get("/alllist", (req, res, next) => {
  // let page1 = Number(req.query.page)
  let page = (req.query.page - 1) * 5;
  let sql = "select * from ph_order_list limit ?,5";
  pool.query(sql, [page], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.send({ code: 200, msg: result });
  });
});

//1-2.总条数
//get /allcount 总条数
//测试地址：http://127.0.0.1:4021/v1/order/allcount
router.get("/allcount", (req, res, next) => {
  let sql = "select count(order_number) sum from  ph_order_list";
  pool.query(sql, (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.send({ code: 200, msg: result });
  });
});

////////////////////////////////////////////////////////

//2.root查询全部预约订单的接口
//GET /v1/order/root
//请求参数:无
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/root/apt
router.get("/root/apt", (req, res) => {
  //定义sql语句
  var sql = "select * from ph_order_list where order_status = 0 ";
  //执行sql语句
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send({ code: 200, msg: result });
  });
});

//3.root查询全部已完成订单的接口
//GET /v1/order/root
//请求参数:无
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/root/finish
router.get("/root/finish", (req, res) => {
  //定义sql语句
  var sql = "select * from ph_order_list where order_status = 1 order by order_number DESC";
  //执行sql语句
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send({ code: 200, msg: result });
  });
});

//4.root查询未完成的全部订单
//GET /v1/order/root
//请求参数:无
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/root/unfinish
router.get("/root/unfinish", (req, res) => {
  //定义sql语句
  var sql = "select * from ph_order_list where order_status = 2 order by order_number DESC";
  //执行sql语句
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send({ code: 200, msg: result });
  });
});

//4.所有猫的文章:http://127.0.0.1:4021/v1/order/cat
//get //showd/:id
router.get("/cat", (req, res) => {
  var sql = "select * from tips where class = 0";
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

//5.所有狗狗的文章:http://127.0.0.1:4021/v1/order/dog
//get //showd/:id
router.get("/dog", (req, res) => {
  var sql = "select * from tips where class = 1";
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});
//6.完成验证"新增预约订单"的路由
//POST /v1/ord/add
//请求参数：
//返回结果：预约成功 或 预约失败
//测试地址：http://127.0.0.1:4021/v1/ord/add
router.post("/add", (req, res) => {
  let obj = req.body;
  let sql =
    "insert into ph_order_list(order_number,order_uname,order_phone,order_time,order_name,order_price,order_status) values (null,?,?,?,?,?,0)";

  // res.send(obj)
  // obj.did,obj.d_name,obj.d_address,obj.d_local,obj.d-phone,obj.d_detail,obj.d_star
  pool.query(
    sql,
    [
      obj.order_uname,
      obj.order_phone,
      obj.order_time,
      obj.order_name,
      obj.order_price,
    ],
    (error, result) => {
      // console.log(obj);
      if (error) throw error;
      if (result.affectedRows == 1) {
        res.send({ code: 200, msg: "添加成功", data: result });
      } else {
        res.send({ code: 501, msg: "添加失败" });
      }
    }
  );
});

// 点击确认修改订单状态的路由
//请求参数:order_number
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/updateStauts
router.post("/updateStauts", (req, res) => {
  //定义sql语句
  var sql = "update ph_order_list set order_status = 1 where order_number = ?";
  //执行sql语句
  pool.query(sql, [req.body.order_number], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.affectedRows == 1) {
      res.send({ code: 200, msg: result });
    } else {
      res.send({ code: 501, msg: "修改失败" });
    }
  });
});

// 点击确认修改订单状态的路由
//请求参数:order_number
//返回结果：
//测试地址：http://127.0.0.1:4021/v1/order/updateMsg
router.post("/updateMsg", (req, res) => {
  //定义sql语句
  var sql =
    "update ph_order_list set doc_name = ?, p_name=?, case_spends = ? where order_number = ?";
  let obj = req.body;
  //执行sql语句
  pool.query(
    sql,
    [obj.doc_name, obj.p_name, obj.case_spends, obj.order_number],
    (err, result) => {
      if (err) {
        throw err;
      }

      if (result.affectedRows == 1) {
        res.send({ code: 200, msg: result });
      } else {
        res.send({ code: 501, msg: "修改失败" });
      }
    }
  );
});

//7.留言板查询所有
//测试地址:http://127.0.0.1:4021/v1/order/all
//get
router.get('/all',(req,res)=>{
	//定义SQL语句
	//var sql='select * from ph_forum order by forum_time desc'
	var sql='SELECT a.*,b.uname,b.address FROM ph_forum a LEFT JOIN ph_user b on a.forum_phone=b.phone order by a.forum_time desc'
	pool.query(sql,(err,result)=>{
		if(err) throw err
		res.send(result)
	})
})

//8.新增留言信息接口
//测试地址:http://127.0.0.1:4021/v1/order/add2
//post
router.post('/add2',(req,res)=>{
	//获取post传递参数
	var obj=req.body
	console.log(obj)
	//定义sql语句
	var sql='insert into ph_forum set ?'
	//var sql='insert into ph_forum values ?'
	//执行sql语句
	pool.query(sql,[obj],(err,result)=>{
		if(err){
			throw err
		}
		// console.log(result)
		//执行成功后,再响应
		res.send({code:200,msg:'执行成功'})
	})
})
//9.新增删除留言信息接口
//测试地址:http://127.0.0.1:4021/v1/order/del
//post
router.post('/del',(req,res)=>{
  //获取post传递参数
  var obj=req.body
  // console.log(obj)
  //定义sql语句
  var sql='delete from ph_forum where forum_id=?'
  //var sql='insert into ph_forum values ?'
  //执行sql语句
  pool.query(sql,[obj.forum_id],(err,result)=>{
   if(err){
    throw err
   }
   // console.log(result)
   //执行成功后,再响应
   res.send({code:200,msg:'执行成功'})
  })
 })
