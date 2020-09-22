<template>
  <div class="page" ref="allPage">
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
          <el-button :disabled="!shootUrl" size="small" type="primary" @click="addText">添加文字</el-button>
          <el-button size="small" type="primary" @click="shootAllPre">全屏截图</el-button>
          <el-button :disabled="loadImage" size="small" type="primary" @click="setOption">裁剪截图</el-button>
          <el-popover placement="right" width="400" trigger="click">
            <el-table style="width: 100%" border :data="gridData">
              <el-table-column property="date" label="参数"></el-table-column>
              <el-table-column property="content" label="描述"></el-table-column>
            </el-table>
            <el-button size="mini" slot="reference" type="info" icon="el-icon-s-grid" circle></el-button>
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
            <el-button size="small" type="primary" @click="makeInfoClean">清空</el-button>
            <el-button size="small" type="primary" @click="shootSome">确定</el-button>
          </div>
        </div>
        <div v-if="showTextOption">
          <el-row :gutter="24" class="mb_15">
            <el-col :span="16">
              <el-input size="small" placeholder="规定在画布上输出的文本" v-model="TextInfo.content"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input size="small" placeholder=" x 坐标位置（相对于画布）" v-model="TextInfo.XPosition"></el-input>
            </el-col>
            <el-col :span="3">
              <el-input size="small" placeholder=" y 坐标位置（相对于画布）" v-model="TextInfo.YPosition"></el-input>
            </el-col>
          </el-row>
          <div class="mb_15">
            <el-button size="small" type="primary" @click="sureaAddText">确定</el-button>
            <el-button size="small" type="primary" @click="cutWithText">下载</el-button>
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
        <div ref="imageWithTextContainer" class="imgContainerR">
          <div class="cutImageContainer btntest">
            <el-image v-if="shootUrl" ref="OriginImage" @load="cut" :src="shootUrl" :fit="fit"></el-image>
          </div>
          <div ref="imageContainer" class="TextContainer"></div>
        </div>
        <div v-if="shootUrl">
          <div>图片信息</div>
          <div>
            <span>宽：{{info.swidth}}, 高：{{info.sheight}}</span>
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
      showTextOption: false,
      currentCanvas: null,
      showOption: false,
      loadImage: true,
      fit: "fit",
      uploadUrl: "",
      movieUrl: "",
      shootUrl: "",
      fileList: [],
      video: null,
      TextInfo: {
        content: null,
        XPosition: null,
        YPosition: null,
      },
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
    cutWithText() {
      let tem = this.$refs.imageWithTextContainer;
      shootAll(tem).then((res) => {
        console.log(res);
        let a = document.createElement("a");
        a.href = res.url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
        // let aTem = document.createElement("a");
        // aTem.href = res.url;
        // atem.downlaod = "带文字的截图";
      });
    },
    sureaAddText() {
      let imageContainer = this.$refs.imageContainer;
      let canvas = document.createElement("canvas");
      canvas.width = this.info.swidth;
      canvas.height = this.info.sheight;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "white"; // 填充颜色为白色
      ctx.strokeStyle = "blue"; // 画笔的颜色
      ctx.lineWidth = 5; // 指定描边线的宽度
      ctx.font = "20px Georgia";
      ctx.fillText(this.TextInfo.content, canvas.width / 3, canvas.height - 10);
      console.log(canvas);
      imageContainer.appendChild(canvas);
    },
    addText() {
      this.showTextOption = !this.showTextOption;
    },
    makeInfoClean() {
      this.info = {
        sx: null,
        sy: null,
        swidth: null,
        sheight: null,
        x: null,
        y: null,
        width: null,
        height: null,
      };
    },
    assertElement(obj) {
      //判断是不是dom节点
      var d = document.createElement("div");
      try {
        d.appendChild(obj.cloneNode(true));
        return obj.nodeType == 1 ? true : false;
      } catch (e) {
        return false;
      }
    },
    shootAllPre(e) {
      let shootDom = this.$refs.allPage;
      e.path.forEach((v) => {
        //寻找到 container dom节点
        let judge = this.assertElement(v);
        if (judge && v.getAttribute("class") == "container") {
          shootDom = v;
        }
      });
      shootAll(shootDom).then((res) => {
        this.shootUrl = res.url;
        this.info.swidth = res.width;
        this.info.sheight = res.height;
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
        this.currentCanvas = cutImage(
          this.$refs.OriginImage._vnode.elm.children[0],
          infoTem.sx ? infoTem.sx : 0,
          infoTem.sy ? infoTem.sy : 0,
          infoTem.swidth ? infoTem.swidth : 90,
          infoTem.sheight ? infoTem.sheight : 90,
          infoTem.x ? infoTem.x : 0,
          infoTem.y ? infoTem.y : 0,
          infoTem.width ? infoTem.width : 90,
          infoTem.height ? infoTem.height : 90
        );
        this.shootUrl = this.currentCanvas.toDataURL();
      });
    },
    shootIt() {
      let video = this.$refs.uploadVideo;
      let imgHeight = 0;
      let imgWidth = 0;
      let videoWidth = 0;
      let videoHeight = 0;
      let canvas = document.createElement("canvas");
      let canvasCtx = canvas.getContext("2d");
      //获取展示的video宽高作为画布的宽高和临时视频截图的宽高
      this.info.swidth = canvas.width = imgWidth = video.offsetWidth;
      this.info.sheight = canvas.height = imgHeight = video.offsetHeight;
      //获取实际视频的宽高，相当于视频分辨率吧
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
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
      // let shootImage = base64ConvertFile(dataUrl, "haorooms截取视频帧");
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
.imgContainerR {
  position: relative;
  min-height: 160px;
}
.cutImageContainer {
  position: absolute;
  left: 0;
  top: 0;
}
.TextContainer {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
