<template>
  <div class="page">
    <div class="wrapper" v-loading="isLoading">
      <el-row>
        <el-col :xs="24" :sm="4" :md="18" :lg="18" :xl="18">
          <div class="main">
            <ListHome :items="items"></ListHome>
          </div>
        </el-col>
        <el-col :xs="0" :sm="4" :md="6" :lg="6" :xl="6">
          <div>
            <div id="pic" @click="cut">
              <el-image
                class="avatar"
                ref="originImg"
                src="../../static/img/avatar.png"
              ></el-image>
            </div>
            <div v-if="circleImg">
              <el-image :src="circleImg"></el-image>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ListHome from "../components/list_home";
import { webUrl } from "../../static/js/public.js";
export default {
  data() {
    return {
      items: [],
      isLoading: false,
      circleImg: null,
    };
  },
  components: {
    ListHome,
  },
  created() {
    this.isLoading = true;
    this.$axios.post(webUrl + "articleList").then((res) => {
      this.isLoading = false;
      this.items = res.data.reverse();
    });
    // 打开一个WebSocket:
    var ws = new WebSocket("ws://localhost:3001");

    // 响应onmessage事件:
    ws.onmessage = function (msg) {
      console.log(msg);
    };

    // 给服务器发送一个字符串:
    ws.addEventListener("open", function () {
      let msg = "我是客户端： " + location.href;
      ws.send(msg);
    });
  },
  methods: {
    cut() {
      let img = this.$refs.originImg;
      this.circleImg = this.circle_image_v2(img);
    },
    circle_image_v2(img, imgType) {
      let imgNode = img.$el.children[0];
      let type = imgType || 0;
      let radius, diameter, ctx, natural;
      console.log(img, "img.naturalWidth");
      if (type) {
        if (img.naturalWidth > img.naturalHeight) {
          radius = img.naturalHeight / 2;
        } else {
          radius = img.naturalWidth / 2;
        }
      } else {
        if (img.imageWidth > img.imageHeight) {
          radius = img.imageHeight / 2;
        } else {
          radius = img.imageWidth / 2;
        }
        if (img.imageWidth > img.imageHeight) {
          natural = img.imageHeight;
        } else {
          natural = img.imageWidth;
        }
      }
      diameter = radius * 2;
      let canvas = document.createElement("canvas");
      let contex = canvas.getContext("2d");
      if (!canvas.getContext) {
        // 判断浏览器是否支持canvas，如果不支持在此处做相应的提示
        console.log("您的浏览器版本过低，暂不支持。");
        return false;
      }
      canvas.width = diameter;
      canvas.height = diameter;
      contex.clearRect(0, 0, diameter, diameter);
      contex.save();
      contex.beginPath();
      contex.arc(radius, radius, radius, 0, Math.PI * 2, false);
      contex.clip();
      if (type) {
        contex.drawImage(
          imgNode,
          0,
          0,
          diameter,
          diameter,
          0,
          0,
          diameter,
          diameter
        );
      } else {
        contex.drawImage(
          imgNode,
          0,
          0,
          natural,
          natural,
          0,
          0,
          diameter,
          diameter
        );
      }
      contex.restore();
      console.log(natural, diameter);
      return canvas.toDataURL("image/png");
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  background: #f8f8fd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 30px rgba(10, 10, 0, 0.1) inset;
  margin: 0 10px;
  padding: 10px;
}

#pic {
  min-height: 150px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.avatar {
  width: 125px;
  height: 125px;
}
#pic:hover {
  transform: rotate(666turn);
  transition-property: all;
  transition-duration: 59s;
  transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
  transition-delay: 1s;
}

@media (min-width: 768px) {
  //pc
  .main {
    margin: 0 20px;
    padding: 20px;
  }
}
</style>
