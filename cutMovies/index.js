
// const videoPath1 = './movies/mov1.mp4'
// const videoPath2 = './movies/mov2.mp4'
// const videoPath3 = './movies/mov3.mp4'
// const videoPath4 = './movies/mov4.mp4'
// const outFormatPath1 = './standardVideo/standardVideo1.mp4'
// const outFormatPath2 = './standardVideo/standardVideo2.mp4'


const ffmpeg = require('fluent-ffmpeg')
const filePath = '../static/files/'
const outFilePath = '../cutMovies/standardVideo/standardVideo'
const outputFileName = '../cutMovies/output/allmov.mp4'


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

const mergeRun = async (object) => {
  let vedioList = object['list']
  console.log(vedioList, vedioList.length, 'vedioList')
  let allPromise = []
  let outFileName = []
  for (let i = 0; i < vedioList.length; i++) {
    let element = vedioList[i];
    let varName = "Vedio" + i
    varName = await standardFormat(filePath + element, outFilePath + i + '.mp4', object.info);
    outFileName.push(outFilePath + i + '.mp4')
    allPromise.push(varName)
  }
  // 改成await函数，等待异步操作
  Promise.all(allPromise).then((res) => {
    console.log(outFileName, allPromise, '333333')
    const mergeFFmpeg = new ffmpeg(outFileName[0])
    for (let j = 1; j < outFileName.length; j++) {
      mergeFFmpeg.input(outFileName[j])
    }
    mergeFFmpeg.mergeToFile(outputFileName, './output/tempDir');
    mergeFFmpeg.on('start', () => {
      console.log('开始合并视频')
    })
      .on('end', () => {
        console.log('合并视频结束')
      })
  })

}

module.exports = mergeRun
