<template>
  <div id="content" v-loading="isLoading">
    <div class="mt_20 mb_25">
      <a @click="toHome" href="javascript:;">返回首页</a>
      <a @click="signOut" href="javascript:;">退出登录</a>
    </div>
    <!-- <h1 class="title">{{type=='article'?'文章':'文件'}}</h1> -->
    <div class="tab-box">
      <el-button-group>
        <el-button :type="type=='article'?'primary':'info'" @click="toggle">
          <i class="iconfont icon-archives"></i> 文章列表
        </el-button>
        <el-button :type="type=='demo'?'primary':'info'" @click="toggle">
          <i class="iconfont icon-play"></i> 文件列表
        </el-button>
      </el-button-group>
    </div>
    <div v-if="type=='article'">
      <el-button @click="handleAdd()" class="btn-add">新增+</el-button>
      <el-table :data="articleList" style="width: 100%" header-align="right" border stripe>
        <el-table-column label="标题" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" width="250">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="摘要" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.gist.slice(0,30) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.category.length === 0">未分类</span>
            <el-tag
              v-else
              class="tag_margin"
              type="primary"
              v-for="tag in scope.row.category"
              :key="tag.id"
            >{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleLook(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="type=='demo'">
      <el-button @click="handleAdd2()" class="btn-add">上传+</el-button>
      <el-table :data="demoList" border>
        <el-table-column label="名字">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="file">
          <template slot-scope="scope">
            <span>{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="图片" >
          <template slot-scope="scope">
            <span>{{ scope.row.pic }}</span>
          </template>
        </el-table-column>
        <el-table-column label="摘要" >
          <template slot-scope="scope">
            <span>{{ scope.row.gist.slice(0,30) }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="flexCenter" style="margin:0 50px">
              <div>
                <el-button size="mini" type="primary" @click="download(scope.$index, scope.row)">下载</el-button>
              </div>
              <div>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete2(scope.$index, scope.row)"
                >删除</el-button>
              </div>
            </div>
            <!-- <el-button size="mini" type="primary" @click="download(scope.$index, scope.row)">下载</el-button> -->
            <!-- <el-button size="mini" type="success" @click="handleEdit2(scope.$index, scope.row)">编辑</el-button> -->
            <!-- <el-button size="mini" type="danger" @click="handleDelete2(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--批量导入店铺-->
    <el-dialog title="上传文件" :visible.sync="showInfo" @close="cleanIt" width="580px">
      <el-form :model="submitForm" label-width="120px">
        <el-form-item required label="文件名">
          <el-input
            type="text"
            show-word-limit
            maxlength="10"
            placeholder="最多10字中文"
            v-model="submitForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item required label="上传">
          <el-upload
            class="upload-demo"
            :before-upload="beforeUpload"
            :action="uploadUrl"
            :on-success="uploadSuccess"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <div class="t_r mt_10">
          <el-button type="default" @click="showInfo = false">取消</el-button>
          <el-button type="primary" :loading="CloseShopFormLoading" @click="saveDemo">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { checkAdmin } from "../../../static/js/public.js";
import { webUrl } from "../../../static/js/public.js";
import { exportInfo } from "../../../static/js/export.js";

export default {
  mixins: [checkAdmin],
  data() {
    return {
      submitForm: {
        name: null,
        IDName: null,
        fileName: null,
      },
      showInfo: false,
      fileList: [],
      articleList: [],
      demoList: [],
      isLoading: false,
      type: "article",
      CloseShopFormLoading: false,
      CloseShopForm: {},
      // uploadUrl: "http://localhost:8088/infor",
      uploadUrl: "/api/infor",
    };
  },
  beforeCreate: function () {},
  mounted: function () {
    // 获取文章列表
    this.isLoading = true;
    this.getArticalList();
    this.getDemoList();
  },
  methods: {
    signOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("user_name");
      localStorage.removeItem("nickName");
      localStorage.removeItem("avatar");
      this.$router.push("/sign");
    },
    getArticalList() {
      this.$axios.post(webUrl + "articleList").then((res) => {
        if (res) {
          this.isLoading = false;
          this.articleList = res.data.reverse();
        }
      });
    },
    getDemoList() {
      // 获取demo列表
      this.$axios.post(webUrl + "demoList").then((res) => {
        if (res) {
          this.isLoading = false;
          this.demoList = res.data.reverse();
        }
      });
    },
    saveDemo() {
      this.CloseShopFormLoading = true;
      console.log();
      this.$axios
        .post(webUrl + "admin/saveDemo", this.submitForm)
        .then((res) => {
          this.$message.success("保存成功");
          this.showInfo = false;
          this.CloseShopFormLoading = false;
          this.getDemoList();
        })
        .catch(() => {
          this.CloseShopFormLoading = false;
        });
    },
    cleanIt() {
      this.submitForm = {
        name: null,
        IDName: null,
        fileName: null,
      };
      this.fileList = [];
    },
    uploadSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileList = fileList;
        this.submitForm.fileName = res.rows.originalname;
        this.submitForm.IDName = res.rows.IDName;
        this.$message.success("上传成功");
      } else if (res.code == 999) {
      } else {
        this.fileList = [];
        this.$message.error(res.msg);
      }
    },
    beforeUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 5;
      // if (!isLt2M) {
      //   this.$message.error("上传头像文件大小不能超过 5MB!");
      // }
      // return isLt2M;
    },
    toHome: function () {
      this.$router.replace({ name: "home" });
    },
    toggle() {
      //切换
      this.type = this.type == "article" ? "demo" : "article";
    },
    handleAdd() {
      //新增
      this.$router.push("/admin/edit");
    },
    handleAdd2() {
      this.showInfo = true;
      //新增-demo
      // this.$router.push("/admin/editt");
    },
    handleLook(index, row) {
      //查看
      let id = row._id;
      window.open("#/detail/" + id);
    },
    download(index, row) {
      let Tem = JSON.parse(JSON.stringify(row));
      let infoTem = Tem.fileName.split(".");
      let nameTem = infoTem.reduce((a, b) => {
        return a + "." + b;
      });
      let info = {
        method: "POST",
        url: "/api/download/" + row._id,
        responseType: "blob",
        type: infoTem[infoTem.length - 1],
        name: nameTem,
      };
      exportInfo(info)
        .then((res) => {})
        .catch(() => {});
    },
    handleEdit(index, row) {
      //编辑
      let id = row._id;
      this.$router.push("/admin/edit/" + id);
    },
    handleEdit2(index, row) {
      //编辑-demo
      let id = row._id;
      this.$router.push("/admin/editt/" + id);
    },
    handleDelete(index, row) {
      //删除
      let self = this;
      let _id = row._id;
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          self.$axios
            .post(webUrl + "admin/deleteArticle", { _id: _id })
            .then((res) => {
              if (res.data.status == 1) {
                self.$message({
                  type: "success",
                  message: "删除成功!",
                });
                self.fetchData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    cleanCloseShop() {},
    handleDelete2(index, row) {
      //删除--demo
      let self = this;
      let _id = row._id;
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          self.$axios
            .post(webUrl + "admin/deleteDemo", { _id: _id })
            .then((res) => {
              if (res.data.status == 1) {
                self.$message({
                  type: "success",
                  message: "删除成功!",
                });
                self.fetchData2();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    fetchData: function () {
      // 更新数据
      this.isLoading = true;
      this.$axios.post(webUrl + "articleList").then((res) => {
        if (res) {
          this.isLoading = false;
          this.articleList = res.data.reverse();
        }
      });
    },
    fetchData2: function () {
      this.isLoading = true;
      // 更新数据---demo
      this.$axios.post(webUrl + "demoList").then((res) => {
        if (res) {
          this.isLoading = false;
          this.demoList = res.data.reverse();
        }
      });
    },
  },
};
</script>


<style>
.el-table .cell {
  text-align: center;
}
</style>
<style lang="scss" scoped>
#content {
  width: 1300px;
  margin: 0 auto;
  > .title {
    margin: 30px 0;
    text-align: center;
  }
  .tab-box {
    text-align: center;
    margin-bottom: 20px;
  }
  .btn-add {
    float: right;
    margin-bottom: 20px;
  }
}
</style>