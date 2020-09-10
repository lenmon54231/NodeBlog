<template>
  <div class="page" id="allPage">
    <div class="flexCenter">
      <div class="topH">
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
      </div>

      <div class="topH">
        <div v-if="movieUrl" class="mb_15">
          <el-button size="small" type="primary" @click="shootIt">截图</el-button>
          <el-button size="small" type="primary" @click="shootAllPre">全屏截图</el-button>
          <el-button :disabled="loadImage" size="small" type="primary" @click="setOption">裁剪截图</el-button>
          <el-popover placement="right" width="400" trigger="click">
            <el-table style="width: 100%" border :data="gridData">
              <el-table-column property="date" label="参数"></el-table-column>
              <el-table-column property="content" label="描述"></el-table-column>
            </el-table>
            <el-button size="small" slot="reference" type="info" icon="el-icon-message" circle></el-button>
          </el-popover>
        </div>
        <div v-if="showOption">
          <el-row :gutter="16" class="mb_15">
            <el-col :span="2">
              <el-input size="small" placeholder="sx" v-model="info.sx"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="sy" v-model="info.sy"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="swidth" v-model="info.swidth"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="sheight" v-model="info.sheight"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="x" v-model="info.x"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="y" v-model="info.y"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="width" v-model="info.width"></el-input>
            </el-col>
            <el-col :span="2">
              <el-input size="small" placeholder="height" v-model="info.height"></el-input>
            </el-col>
          </el-row>
          <div class="mb_15">
            <el-button size="small" type="primary" @click="shootSome">确定</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="flexCenter">
      <div v-if="movieUrl">
        <div>
          <video ref="uploadVideo" :src="movieUrl" controls="controls"></video>
        </div>
      </div>
      <div>
        <el-image v-if="shootUrl" ref="OriginImage" @load="cut" :src="shootUrl" :fit="fit"></el-image>
        <div v-if="shootUrl">
          <div>图片信息</div>
          <div>
            <span>宽：{{videoWidth}}, 高：{{videoHeight}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shootAll, cutImage } from "../../static/js/public.js";

export default {
  data() {
    return {
      showOption: false,
      videoWidth: null,
      videoHeight: null,
      loadImage: true,
      fit: "fit",
      uploadUrl: "",
      movieUrl: "",
      shootUrl: "",
      fileList: [],
      video: null,
      info: {
        sx: null,
        sy: null,
        swidth: null,
        sheight: null,
        x: null,
        y: null,
        width: null,
        height: null,
      },
      gridData: [
        { date: "sx", content: "可选。开始剪切的 x 坐标位置。" },
        { date: "sy", content: "可选。开始剪切的 y 坐标位置。" },
        { date: "swidth", content: "可选。被剪切图像的宽度。" },
        { date: "sheight", content: "可选。被剪切图像的高度。" },
        { date: "x", content: "在画布上放置图像的 x 坐标位置。" },
        { date: "y", content: "	在画布上放置图像的 y 坐标位置。" },
        {
          date: "width",
          content: "可选。要使用的图像的宽度。（伸展或缩小图像）",
        },
        {
          date: "height",
          content: "	可选。要使用的图像的高度。（伸展或缩小图像）",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    shootAllPre() {
      let shootDom = document.getElementById("allPage");
      shootAll(shootDom).then((res) => {
        this.shootUrl = res.url;
        this.videoWidth = res.width;
        this.videoHeight = res.height;
      });
    },
    cut() {
      this.loadImage = false;
    },
    setOption() {
      this.showOption = !this.showOption;
    },
    shootSome() {
      this.$nextTick(() => {
        let infoTem = JSON.parse(JSON.stringify(this.info));
        let canvas = cutImage(
          this.$refs.OriginImage._vnode.elm.children[0],
          infoTem.sx ? infoTem.sx : 0,
          infoTem.sy ? infoTem.sy : 0,
          infoTem.swidth ? infoTem.swidth : 0,
          infoTem.sheight ? infoTem.sheight : 0,
          infoTem.x ? infoTem.x : 0,
          infoTem.y ? infoTem.y : 0,
          infoTem.width ? infoTem.width : 90,
          infoTem.height ? infoTem.height : 90
        );
        this.shootUrl = canvas.toDataURL();
      });
    },
    shootIt() {
      // this.video = this.$refs.uploadVideo;
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
      this.videoWidth = canvas.width = imgWidth = video.offsetWidth;
      this.videoHeight = canvas.height = imgHeight = video.offsetHeight;
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
    uploadSuccess(res, file, fileList) {},
    beforeUpload(file) {
      // console.log(file);
      this.movieUrl = window.URL.createObjectURL(file);
    },
  },
};
</script>

<style scoped>
.topH {
  min-height: 160px;
}
.center {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
