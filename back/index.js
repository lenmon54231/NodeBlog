const schedule = require('node-schedule');//引入定时任务模块
const process = require('child_process');//引入cmd模块
const fs = require('fs');//引入fs模块
const compressing = require('compressing');
//cmd执行内容
//数据库地址及端口 如:127.0.0.1:27017
//要备份的数据库名称 如:test
//备份路径如:C:\\backup
// const cmd = 'mongodump -h [数据库地址:端口] -d [要备份的数据库名称] -o [备份路径]';
const cdIn = 'cd /www/server/mongodb/bin'
const cmd = 'mongodump';

function scheduleCronstyle() {
  console.log('start....')
  schedule.scheduleJob('0 30 5 * * *', function () {  //每天5点半
    console.log('scheduleJob....')
    process.exec(cdIn, function (error, stdout, stderr) {  //在cmd中执行上方定义的命令
      console.log('exec....', cdIn)
      console.log('exec....', cmd)
      process.exec(cmd, function (error, stdout, stderr) {  //在cmd中执行上方定义的命令
        if (error) {
          console.log('Error:' + error); //错误
        } else if (stderr.lenght > 0) {
          console.log('Stderr:' + stderr.toString())  //标准性错误
        } else {
          //成功之后写入日志
          let year = (new Date()).getFullYear();//获取年
          let month = ((new Date()).getMonth() + 1) > 9 ? ((new Date()).getMonth() + 1) : '0' + ((new Date()).getMonth() + 1);//获取月
          let date = (new Date()).getDate() > 9 ? (new Date()).getDate() : '0' + (new Date()).getDate();//获取日
          let hour = (new Date()).getHours() > 9 ? (new Date()).getHours() : '0' + (new Date()).getHours();//获取时
          let minute = (new Date()).getMinutes() > 9 ? (new Date()).getMinutes() : '0' + (new Date()).getMinutes();//获取分
          let seconds = (new Date()).getSeconds() > 9 ? (new Date()).getSeconds() : '0' + (new Date()).getSeconds();//获取秒
          let str = `${year}-${month}-${date} ${hour}:${minute}:${seconds} 备份`
          console.log(str, 'srt')
          compressing.zip.compressDir('./dump', './' + str + '.zip')
            .then(() => {
              console.log('success');
            })
            .catch(err => {
              console.error(err);
            });
          // fs.writeFile(path, `\n${str}`, { flag: 'a+' }, (err) => { //path 为存储路径 如:C:\\backup\\[数据库名]\\.log  我这里存储在备份数据库目录下
          //   if (err) {
          //     console.log(err)
          //   }
          // })
        }
      });

    });

  });
}

scheduleCronstyle();