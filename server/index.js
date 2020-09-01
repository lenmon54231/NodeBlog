const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
<<<<<<< HEAD
const api = require('./api');
const app = express();
const multer = require('multer');

// const cookieParser=require('cookie-parser');
const session = require('express-session');
=======
const api = require('./api'); 
const app = express();
// const cookieParser=require('cookie-parser');
const session=require('express-session');
>>>>>>> 39a14467ea9c416559e284c28b2181acfb29080f

//跨域
app.use(cors());
// app.use(cookieParser());
<<<<<<< HEAD
app.use(express.json({ limit: '5mb' }));
=======
app.use(express.json({limit: '5mb'}));
>>>>>>> 39a14467ea9c416559e284c28b2181acfb29080f
// app.use(session({
//     secret:'12345',
//     cookie:{maxAge:60 * 1000 * 60},
//     resave:false,
//     saveUninitialized:true
// }))

app.use(bodyParser.json());
//当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: false }));

const objMulter = multer({ dest: '../static/files' });
app.use(objMulter.any());

=======
app.use(bodyParser.urlencoded({extended: false}));
>>>>>>> 39a14467ea9c416559e284c28b2181acfb29080f
app.use(api);

// 监听8088端口
app.listen(8088);
console.log('success listen…………');