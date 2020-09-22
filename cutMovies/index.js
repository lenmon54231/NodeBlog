
const ffmpeg = require('fluent-ffmpeg')
const filePath = '../static/files/' //上传文件位置
const outFilePath = '../cutMovies/standardVideo/standardVideo' //输出标准格式文件位置
const outputFilePath = '../cutMovies/output/' //最终合并文件位置

//将输入的视频改造成标准格式并输出promise格式
function standardFormat(inFormatPath, outFormatPath, vedioInfo) {
  return new Promise(resolve => {
    let infoTem = vedioInfo ? JSON.parse(JSON.stringify(vedioInfo)) : {}
    const formatFFmpeg = new ffmpeg(inFormatPath)
    formatFFmpeg.withSize(infoTem ? infoTem.withSize : '1600x?').aspect(infoTem ? infoTem.aspect : '16:9').autoPad().fps(infoTem ? infoTem.fps : 24).videoBitrate(infoTem ? infoTem.videoBitrate : 300);
    formatFFmpeg.save(outFormatPath)
    formatFFmpeg.on('start', () => {
      console.log('开始格式化视频')
    }).on('end', () => {
      console.log('格式化输出成功')
      resolve("格式化输出成功")
    })
  })
}
//等待改造标准格式后，再合并视频，
const mergeRun = async (object) => {
  let vedioList = object['list']
  console.log(vedioList, vedioList.length, 'vedioList')
  let allPromise = []
  let outFileName = []
  for (let i = 0; i < vedioList.length; i++) {
    let element = vedioList[i]['IDName'];
    let varName = "Vedio" + i
    varName = await standardFormat(filePath + element, outFilePath + i + '.mp4', object.info);
    outFileName.push(outFilePath + i + '.mp4')
    allPromise.push(varName)
  }
  // 改成await函数，等待异步操作
  Promise.all(allPromise).then((res) => {
    console.log(outFileName, allPromise, '333333')
    let finalVedioName = 'allmov.mp4';
    let finalVedioTotalPath = outputFilePath + finalVedioName;
    const mergeFFmpeg = new ffmpeg(outFileName[0])
    for (let j = 1; j < outFileName.length; j++) {
      mergeFFmpeg.input(outFileName[j])
    }
    mergeFFmpeg.mergeToFile(finalVedioTotalPath, './output/tempDir');
    mergeFFmpeg.on('start', () => {
      console.log('开始合并视频')
    })
      .on('end', () => {
        console.log('合并视频结束')
        resolve(finalVedioTotalPath);
      })
  })

}
//暴露一个promise合并视频函数出去，方便测试await
const waitMerege = (object) => {
  return new Promise((resolve) => {
    mergeRun(object)
  })
}
//剪切单个视频的一部分
const cutSigleVedio = (info) => {
  return new Promise(resolve => {
    let timeStamp = new Date() - 0
    let saveCutName = filePath + timeStamp + '.mp4'
    const cutSigleVedioFF = new ffmpeg(filePath + info.IDName)
    cutSigleVedioFF.seek(info.start).duration(info.duration);
    cutSigleVedioFF.save(saveCutName)
    cutSigleVedioFF.on('start', () => { '剪切单个视频开始' })
      .on('end', () => {
        console.log('剪切单个视频结束')
        resolve(saveCutName)
      })
  })

}

exports.waitMerege = waitMerege;
exports.cutSigleVedio = cutSigleVedio;
