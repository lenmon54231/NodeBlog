<template>
  <div class="page flexCenter">
    <div class="center">
      <el-image class="mb_15" :src="nofoundUrl" :fit="fit">
        <div slot="placeholder" class="image-slot">
          加载中
          <span class="dot">...</span>
        </div>
      </el-image>
      <div>找不到此页面哈</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fit: "fit",
      nofoundUrl: "../../static/img/404.gif",
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.center {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
</style>
