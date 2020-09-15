// //ffmpeg
// const main = async () => {
//   const FFMPEGOperation = require('./cut.js')
//   const FFMPEGOperationObj = new FFMPEGOperation()
//   const videoPath1 = './movies/mov1.mp4'
//   const videoPath2 = './movies/mov2.mp4'
//   const outputFileName = './movies/allmov.mp4'
//   const outputPath = './output'
//   await FFMPEGOperationObj.concatVideos(videoPath1, videoPath2, outputFileName, outputPath)
//   //获取视频时长
//   // const duration = await FFMPEGOperationObj.getVideoTotalDuration(videoPath)
//   //获取缩略图
//   // await FFMPEGOperationObj.getVideoSceenshots(videoPath, outputPath, 1, 5)
//   //拆分视频
//   // await FFMPEGOperationObj.splitVideo(videoPath, '00:00:02', '00:00:05', outputPath + 'splitResult.mp4')
// }
// main().then().catch(console.error)

const videoPath1 = './movies/mov1.mp4'
const videoPath2 = './movies/mov2.mp4'
const outputFileName = './movies/allmov.mp4'
const outputPath = './output'
const ffmpeg = require('fluent-ffmpeg')


ffmpeg(videoPath1)
  .input(videoPath2)
  .mergeToFile(outputFileName, outputPath);
