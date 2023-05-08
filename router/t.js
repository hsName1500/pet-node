const express = require("express");
const r = express.Router();
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const uuid = require('uuid');
const path = require('path')

// let name = '';
// let filePath = '';
// // 自定义 multer 的 diskStorage 的存储目录与文件名
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	  cb(null, 'public/docimg') // 注意一下这里，这个是设置上传到哪个文件夹的
// 	},
// 	filename: function (req, file, cb) {
// 	  let extname = path.extname(file.originalname)
// 	  filePath = uuid.v1();
// 	//   console.log(file,'file')
// 	  // 可以在这里读取文件类型，然后判断存储类型
// 	  cb(null, filePath +extname);
// 	  name = filePath +extname
// 	}
// })
// var upload = multer({ storage: storage })

// r.post('/updoc',upload.any(), (req,res,next)=> {
// 	console.log(req.body,'请求体')
// 	if(filePath){
// 		res.send({code: 200, msg: '上传成功',imgname:name})
// 		// 在此处执行sql语句

// 	} else {
// 		res.status(200).send({code: 201, msg: '上传图片失败'});
// 	}
// })
const fs = require('fs')
//111111111111111

//医生图片上传
r.post(
    "/updoc",
    multer({
      //设置文件存储路径
      dest: "public/docimg",
    }).array("photo", 1),
    function (req, res, next) {
		// console.log(req);
      let files = req.files;
	//   console.log(files);
      let file = files[0];
	//   console.log(file);
      let fileInfo = {};
      let path = "public/docimg/" + Date.now().toString() + "_" + file.originalname;
      fs.renameSync("public/docimg/" + file.filename, path);
      //获取文件基本信息
      fileInfo.type = file.mimetype;
      fileInfo.name = file.originalname;
      fileInfo.size = file.size;
      fileInfo.path = path;
      res.send({
        code: 200,
        msg: "OK",
        data: fileInfo,
      });
    }
)

// 商品图片上传
r.post(
  "/uppro",
  multer({
    //设置文件存储路径
    dest: "public/img",
  }).array("photo", 1),
  function (req, res, next) {
  // console.log(req);
    let files = req.files;
//   console.log(files);
    let file = files[0];
//   console.log(file);
    let fileInfo = {};
    let path = "public/img/" + Date.now().toString() + "_" + file.originalname;
    fs.renameSync("public/img/" + file.filename, path);
    //获取文件基本信息
    fileInfo.type = file.mimetype;
    fileInfo.name = file.originalname;
    fileInfo.size = file.size;
    fileInfo.path = path;
    res.send({
      code: 200,
      msg: "OK",
      data: fileInfo,
    });
  }
)


// let name = '';
// let filePath = '';
// // 自定义 multer 的 diskStorage 的存储目录与文件名
// var storage = multer.diskStorage({
//  destination: function (req, file, cb) {
//    cb(null, 'public/docimg') // 注意一下这里，这个是设置上传到哪个文件夹的
//  },
//  filename: function (req, file, cb) {
//    let extname = path.extname(file.originalname)
//    console.log('uuid.v1:',uuid.v1());
//    console.log('extname',extname);
// //    if(!filePath){}filePath = uuid.v1();
// filePath = uuid.v1();
//    console.log(file,'file')
// console.log('filePath',filePath);
//    // 可以在这里读取文件类型，然后判断存储类型
//    cb(null, filePath +extname);
//    name = filePath +extname
//  }
// })
// var upload = multer({ storage: storage })

// r.post('/updoc',upload.any(), (req,res,next)=> {
//  // console.log(req.body,'请求体')
//  if(filePath){
//   res.send({code: 200, msg: '上传成功',imgname:name})
//   // 在此处执行sql语句
  
//  } else {
//   res.status(200).send({code: 201, msg: '上传图片失败'});
//  }
// })

module.exports = r;