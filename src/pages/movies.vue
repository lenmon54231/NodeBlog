<template>
  <div class="page">
    <div class="flexCenter">
      <div>
        <el-upload
          class="upload-demo"
          :before-upload="beforeUpload"
          :action="uploadUrl"
          :on-success="uploadSuccess"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div v-if="movieUrl">
        <el-button size="small" type="primary" @click="shootIt">截图</el-button>
      </div>
    </div>

    <div class="flexCenter">
      <div v-if="movieUrl">
        <video ref="uploadVideo" :src="movieUrl" controls="controls"></video>
      </div>
      <div v-if="shootUrl">
        <el-image :src="shootUrl" :fit="fit"></el-image>
      </div>
    </div>

    <!-- <input id="uploadMovies" type="file" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      fit: "fit",
      uploadUrl: "/api/infor",
      movieUrl: "",
      shootUrl: "",
      fileList: [],
    };
  },
  created() {},
  mounted() {
    // let video = document.createElement("video");
    // video.setAttribute("controls", "controls");
    // console.log(document.querySelector("#uploadMovies"));
    // let movieContainer = document.querySelector(".page");
    // document
    //   .querySelector("#uploadMovies")
    //   .addEventListener("change", function () {
    //     console.log(this.files, "视频文件");
    //     movieContainer.appendChild(video);
    //     video.src = window.URL.createObjectURL(this.files[0]);
    //   });
  },
  methods: {
    shootIt() {
      let video = this.$refs.uploadVideo;
      let imgHeight = 0;
      let imgWidth = 0;
      let videoWidth = 0;
      let videoHeight = 0;

      let canvas = document.createElement("canvas");
      let canvasCtx = canvas.getContext("2d");

      //视频准备好可以播放
      // video.addEventListener("canplay", function () {
      //获取展示的video宽高作为画布的宽高和临时视频截图的宽高
      canvas.width = imgWidth = video.offsetWidth;
      canvas.height = imgHeight = video.offsetHeight;
      //获取实际视频的宽高，相当于视频分辨率吧
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
      // video.pause();
      //坐原图像的x,y轴坐标，大小，目标图像的x，y轴标，大小。
      canvasCtx.drawImage(
        video,
        0,
        0,
        videoWidth,
        videoHeight,
        0,
        0,
        imgWidth,
        imgHeight
      );
      //把图标base64编码后变成一段url字符串
      let dataUrl = canvas.toDataURL("image/png");
      this.shootUrl = dataUrl;
      // 获取图片的base64格式
      // 通过上一篇文章的：https://www.haorooms.com/post/js_file_base64_blob 把base64转换为file
      // let shootImage = base64ConvertFile(dataUrl, "haorooms截取视频帧");
      // console.log("dataUrl", dataUrl, shootImage);
      // 然后通过上一节的ajax进行上传
    },
    uploadSuccess(res, file, fileList) {
      console.log(res, file, fileList, "222222222");
      if (res.code == 200) {
        this.fileList = fileList;
        this.$message.success("上传成功");
        console.log(this.$refs.uploadVideo);
      }
    },
    beforeUpload(file) {
      console.log(file, "11111");
      this.movieUrl = window.URL.createObjectURL(file);
    },
  },
};
</script>

<style scoped></style>
