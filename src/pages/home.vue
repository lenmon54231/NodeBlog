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
          <div id="pic" @click="cut">
            <el-image
              ref="originImg"
              src="../../static/img/avatar.png"
            ></el-image>
          </div>
          <div v-if="circleImg">
            <el-image :src="circleImg"></el-image>
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
.aside {
  background: #f8f8fd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 30px rgba(10, 10, 0, 0.1) inset;
  .card {
    border-top: 1px solid #eee;
    .title {
      padding: 10px;
      font-weight: 600;
      color: #808080;
      margin-bottom: 10px;
    }
    .pic {
      width: 100%;
    }
    .row {
      padding: 0 10px;
      & > p {
        color: #bfbfbf;
      }
      .icons {
        padding: 10px 0;
        .iconfont {
          transition: all 0.3s;
          margin: 5px;
          color: #000;
          font-size: 20px;
          background-color: rgba(200, 200, 200, 0.3);
          padding: 8px;
          border-radius: 50%;
          &:hover {
            color: #fff;
            background-color: rgba(0, 133, 166, 0.8);
            border-radius: 5px;
          }
        }
      }

      & > .link {
        color: #bfbfbf;
        display: inline-block;
        padding: 5px;
        transition: all 0.3s;
        &:hover {
          color: #0085a1;
        }
      }
    }
  }
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
