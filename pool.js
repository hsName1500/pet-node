/****数据库连接池模块****/
const mysql = require("mysql");
const pool = mysql.createPool({

  host: "127.0.0.1",
  port: 3306,
  user: "root", //必需
  // password:'20210505',
  database: "Pet_Hospital", //必需
  //connectionLimit:15
  charset: "utf8", //数据库服务器的编码方式
});
//暴露连接池对象
module.exports = pool;

