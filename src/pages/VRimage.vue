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
    </div>
    <div class="flexCenter">
      <div class="imageContainer">
        <el-image :src="imageURL"></el-image>
      </div>
      <div class="canvasContainer"></div>
    </div>
  </div>
</template>

<script>
import { shootAll, cutImage } from "../../static/js/public.js";

export default {
  data() {
    return {
      imageURL: null,
      uploadUrl: "",
      fileList: [],
    };
  },
  created() {},
  mounted() {},
  methods: {
    uploadSuccess(res, file, fileList) {
      console.log(res, file, fileList);
    },
    beforeUpload(file) {
      this.imageURL = window.URL.createObjectURL(file);
    },
  },
};
</script>

<style scoped>
.topH {
  margin-bottom: 15px;
}
.imageContainer {
}
</style>
