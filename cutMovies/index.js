
// const videoPath1 = './movies/mov1.mp4'
// const videoPath2 = './movies/mov2.mp4'
// const videoPath3 = './movies/mov3.mp4'
// const videoPath4 = './movies/mov4.mp4'
const filePath = '../static/files/'
const outFilePath = './standardVideo/standardVideo'
const outputFileName = './output/allmov.mp4'
const ffmpeg = require('fluent-ffmpeg')
const outFormatPath1 = './standardVideo/standardVideo1.mp4'
const outFormatPath2 = './standardVideo/standardVideo2.mp4'

function standardFormat(inFormatPath, outFormatPath, vedioInfo) {
  return new Promise(resolve => {
    let infoTem = vedioInfo ? JSON.parse(JSON.stringify(vedioInfo)) : {}
    const formatFFmpeg = new ffmpeg(inFormatPath)
    formatFFmpeg.on('start', () => {
      console.log('开始格式化视频')
    })
    formatFFmpeg.withSize(infoTem ? infoTem.withSize : '1600x?').aspect(infoTem ? infoTem.aspect : '16:9').autoPad().fps(infoTem ? infoTem.fps : 24).videoBitrate(infoTem ? infoTem.videoBitrate : 300);
    formatFFmpeg.save(outFormatPath)
    let haveDone = formatFFmpeg.on('end', () => {
      console.log('格式化输出成功')
      resolve("格式化输出成功")
    })
  })
}
const mergeRun = async (object) => {
  let uploadInfo = {
    info: {
      withSize: null,
      aspect: null,
      fps: null,
    },
    list: ['mov1.mp4']
  }
  let vedioList = uploadInfo['list']
  for (let i = 0; i < vedioList.length; i++) {
    const element = vedioList[i];
    const nameTem = 'vedio' + i;
    nameTem = await standardFormat(filePath + element, outFilePath + i + '.mp4');
  }
  // 改成await函数，等待异步操作
  const firstVedio = await standardFormat(videoPath1, outFormatPath1);
  const secondVedio = await standardFormat(videoPath3, outFormatPath2);

  Promise.all([firstVedio, secondVedio]).then((res) => {
    const mergeFFmpeg = new ffmpeg(outFormatPath1)
    mergeFFmpeg.input(outFormatPath2)
      .mergeToFile(outputFileName, './output/tempDir');
    mergeFFmpeg.on('start', () => {
      console.log('开始合并视频')
    })
      .on('end', () => {
        console.log('合并视频结束')
      })
    // ffmpeg(outFormatPath1).input(outFormatPath2).mergeToFile(outputFileName, './output/tempDir')
  })
}

return mergeRun()
