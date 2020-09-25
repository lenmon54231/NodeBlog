<template>
  <div id="content" v-loading="isLoading">
    <div class="mt_20 mb_25">
      <a @click="toHome" href="javascript:;">返回首页</a>
      <a @click="signOut" href="javascript:;">退出登录</a>
    </div>
    <div class="tab-box">
      <el-button-group>
        <el-button
          :type="type == 'article' ? 'primary' : 'info'"
          @click="toggle(0)"
        >
          <i class="iconfont icon-archives"></i> 文章列表
        </el-button>
        <el-button
          :type="type == 'demo' ? 'primary' : 'info'"
          @click="toggle(1)"
        >
          <i class="iconfont icon-play"></i> 文件列表
        </el-button>
        <el-button
          :type="type == 'mergeVedio' ? 'primary' : 'info'"
          @click="toggle(2)"
        >
          <i class="iconfont icon-play"></i> 视频列表
        </el-button>
      </el-button-group>
    </div>
    <div v-if="type == 'article'">
      <div class="addAndMerge">
        <el-button @click="handleAdd()">新增+</el-button>
      </div>
      <el-table
        :key="'keytable0'"
        :data="articleList"
        style="width: 100%"
        header-align="right"
        border
        stripe
      >
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
            <span>{{ scope.row.gist.slice(0, 30) }}</span>
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
              >{{ tag }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleLook(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="type == 'demo'">
      <div class="addAndMerge">
        <el-button @click="handleAdd2()">上传</el-button>
        <el-button @click="mergeVedioClick()">合并</el-button>
        <el-button @click="changeOptions()">更改预设值</el-button>
      </div>
      <el-table
        :key="'keytable1'"
        ref="multipleTable"
        :data="demoList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="handleClickSortTable"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="名字">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">原始素材</span>
            <span v-if="scope.row.type == 1">过渡动画</span>
          </template>
        </el-table-column>
        <el-table-column label="完成状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">未完成</span>
            <span v-if="scope.row.status == 1">已完成</span>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小" sortable="size">
          <template slot-scope="scope">
            <span>{{
              scope.row.size
                ? parseFloat(scope.row.size).toFixed(1) + "kb"
                : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="flexCenter" style="margin: 0 50px">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="download(scope.$index, scope.row)"
                  >下载</el-button
                >
              </div>
              <div>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete2(scope.$index, scope.row)"
                  >删除</el-button
                >
              </div>
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="cut(scope.$index, scope.row)"
                  >剪切</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div v-if="type == 'mergeVedio'">
      <el-table :key="'keytable2'" :data="mergeVedioList" border>
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
        <el-table-column label="大小">
          <template slot-scope="scope">
            <span>{{
              scope.row.size
                ? parseFloat(scope.row.size).toFixed(1) + "kb"
                : "-"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="flexCenter" style="margin: 0 50px">
              <div>
                <el-button
                  size="mini"
                  type="primary"
                  @click="download(scope.$index, scope.row)"
                  >下载</el-button
                >
              </div>
              <div>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete2(scope.$index, scope.row)"
                  >删除</el-button
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--上传文件-->
    <el-dialog
      title="上传文件"
      :visible.sync="showInfo"
      @close="cleanIt"
      width="580px"
    >
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
        <el-form-item required label="素材类型">
          <el-input
            type="text"
            placeholder="原始素材：0，过渡动画：1"
            v-model="submitForm.type"
          ></el-input>
        </el-form-item>
        <el-form-item required label="上传">
          <el-upload
            class="upload-demo"
            :before-upload="beforeUpload"
            :action="uploadUrl"
            :on-success="uploadSuccess"
            :file-list="fileList"
            :on-remove="removeFile"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <div class="t_r mt_10">
          <el-button type="default" @click="showInfo = false">取消</el-button>
          <el-button
            type="primary"
            :loading="CloseShopFormLoading"
            @click="saveDemo"
            >确定</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <!--更改预设值-->
    <el-dialog
      title="更改合并参数"
      :visible.sync="showMergeInfo"
      @close="cleanIt"
      width="580px"
    >
      <el-form :model="MergeInfoSubmitForm" label-width="120px">
        <el-form-item required label="视频分辨率">
          <el-input
            type="text"
            show-word-limit
            maxlength="10"
            placeholder="1600x?（允许用问号代替另一个参数）"
            v-model="MergeInfoSubmitForm.withSize"
          ></el-input>
        </el-form-item>
        <el-form-item required label="宽高比例">
          <el-input
            type="text"
            show-word-limit
            maxlength="10"
            placeholder="16:9"
            v-model="MergeInfoSubmitForm.aspect"
          ></el-input>
        </el-form-item>
        <el-form-item required label="视频帧率">
          <el-input
            type="text"
            show-word-limit
            maxlength="10"
            placeholder="24（帧率会影响合并效率）"
            v-model="MergeInfoSubmitForm.fps"
          ></el-input>
        </el-form-item>
        <el-form-item required label="视频比特率">
          <el-input
            type="text"
            show-word-limit
            maxlength="10"
            placeholder="300（数值越大生成的文件会越大）"
            v-model="MergeInfoSubmitForm.videoBitrate"
          ></el-input>
        </el-form-item>
        <div class="t_r mt_10">
          <el-button type="default" @click="showMergeInfo = false"
            >取消</el-button
          >
        </div>
      </el-form>
    </el-dialog>

    <!--合并弹窗-->
    <el-dialog
      title="确认合并参数"
      :visible.sync="checkMergeInfo"
      width="580px"
    >
      <div>
        <div>视频分辨率：{{ MergeInfoSubmitForm.withSize }}</div>
        <div>视频宽高比：{{ MergeInfoSubmitForm.aspect }}</div>
        <div>视频帧率：{{ MergeInfoSubmitForm.fps }}</div>
        <div>视频比特率：{{ MergeInfoSubmitForm.videoBitrate }}</div>
      </div>
      <div>
        <div>排序</div>
        <div>
          <el-table :data="checkedVedioList" border>
            <el-table-column label="名字">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{ scope.row.sort }}</span>
              </template>
            </el-table-column>
            <el-table-column label="大小">
              <template slot-scope="scope">
                <span>{{
                  scope.row.size
                    ? parseFloat(scope.row.size).toFixed(1) + "kb"
                    : "-"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="flexCenter" style="margin: 0 50px">
                  <div>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="up(scope.$index, scope.row)"
                      >上移</el-button
                    >
                  </div>
                  <div>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="down(scope.$index, scope.row)"
                      >下移</el-button
                    >
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="t_r mt_10">
        <el-button type="default" @click="checkMergeInfo = false"
          >取消</el-button
        >
        <el-button type="primary" @click="toMergeVedio">确定</el-button>
      </div>
    </el-dialog>

    <!--剪切视频-->
    <el-dialog
      title="剪切视频参数"
      :visible.sync="showCutInfo"
      @close="cleanIt"
      width="580px"
    >
      <el-form :model="cutInfoSubmitForm" label-width="120px">
        <el-form-item required label="起始时间">
          <el-input type="text" v-model="cutInfoSubmitForm.start"></el-input>
        </el-form-item>
        <el-form-item required label="持续时间">
          <el-input type="text" v-model="cutInfoSubmitForm.duration"></el-input>
        </el-form-item>
        <el-form-item required label="名称">
          <el-input type="text" v-model="cutInfoSubmitForm.name"></el-input>
        </el-form-item>
        <el-form-item required label="类型">
          <el-input type="text" v-model="cutInfoSubmitForm.type"></el-input>
        </el-form-item>
        <div class="t_r mt_10">
          <el-button type="default" @click="showCutInfo = false"
            >取消</el-button
          >
          <el-button type="primary" @click="toCutSigleVedio">确定</el-button>
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
      showCutInfo: false,
      showcheckedVedioName: [],
      checkedVedioList: [],
      mergeVedioList: [],
      submitForm: {
        name: null,
        IDName: null,
        fileName: null,
        type: null,
      },
      cutInfoSubmitForm: {
        start: null,
        duration: null,
        name: null,
        type: null,
      },
      MergeInfoSubmitForm: {
        withSize: "1600x?",
        aspect: "16:9",
        fps: "24",
        videoBitrate: "300",
      },
      checkMergeInfo: false,
      showMergeInfo: false,
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
  mounted: function () {
    // 获取文章列表
    this.isLoading = true;
    this.getArticalList();
    this.getDemoList();
  },
  methods: {
    handleClickSortTable({ column, prop, order }) {
      switch (order) {
        case "ascending":
          this.demoList.sort((a, b) => {
            return a.size - b.size;
          });
          break;
        case "descending":
          this.demoList.sort((a, b) => {
            return b.size - a.size;
          });
          break;
        default:
          break;
      }
    },
    toCutSigleVedio() {
      if (this.checkedVedioList.length == 1) {
        let cutSigleVedioInfo = JSON.parse(
          JSON.stringify(this.checkedVedioList[0])
        );
        this.cutInfoSubmitForm.IDName = cutSigleVedioInfo.IDName;
        this.$axios
          .post(webUrl + "cutSigleVedio", this.cutInfoSubmitForm)
          .then((res) => {
            console.log(res, "res");
            if (res.data.code == 200) {
              this.$message.success("剪切成功");
              this.showCutInfo = false;
              this.getDemoList();
            }
          });
      }
    },
    cut() {
      this.showCutInfo = true;
    },
    sortVedioList(arr, prev, after) {
      arr[prev] = arr.splice(after, 1, arr[prev])[0];
      return arr;
    },
    up(index, item) {
      if (index != 0) {
        this.sortVedioList(this.checkedVedioList, index, index - 1);
      } else {
        this.$message.error("已经是第一了");
      }
    },
    down(index, item) {
      if (index != this.checkedVedioList.length - 1) {
        this.sortVedioList(this.checkedVedioList, index, index + 1);
      } else {
        this.$message.error("已经是最后了");
      }
    },
    toMergeVedio() {
      let mergeOptions = {
        info: this.MergeInfoSubmitForm,
        list: this.checkedVedioList,
      };
      this.$axios.post(webUrl + "mergeVedio", mergeOptions).then((res) => {
        this.$message.success("开始合并，合并成功后，可以在视频列表查看");
        this.checkMergeInfo = false;
      });
    },
    changeOptions() {
      this.showMergeInfo = true;
    },
    mergeVedioClick() {
      this.checkMergeInfo = true;
    },
    handleSelectionChange(val) {
      this.checkedVedioList = [];
      let num = 0;
      val.forEach((v) => {
        v.sort = num++;
        this.checkedVedioList.push(v);
      });
    },
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
          this.demoList = res.data;
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
        type: null,
      };
      this.fileList = [];
    },
    removeFile() {
      this.$axios
        .post(webUrl + "admin/deleteDemoTem", {
          IDName: this.submitForm.IDName,
        })
        .then((res) => {
          if (res.data.status == 1) {
            self.$message({
              type: "success",
              message: "成功!",
            });
            self.fetchData2();
          }
        });
    },
    uploadSuccess(res, file, fileList) {
      console.log(res.rows);
      if (res.code == 200) {
        this.fileList = fileList;
        this.submitForm.fileName = res.rows.originalname;
        this.submitForm.IDName = res.rows.IDName;
        this.submitForm.size = res.rows.size;
        this.$message.success("上传成功");
      } else if (res.code == 999) {
      } else {
        this.fileList = [];
        this.$message.error(res.msg);
      }
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 150;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 150MB!");
      }
      return isLt2M;
    },
    toHome: function () {
      this.$router.replace({ name: "home" });
    },
    toggle(index) {
      //切换
      switch (index) {
        case 0:
          this.type = "article";
          break;
        case 1:
          this.type = "demo";
          break;
        case 2:
          this.type = "mergeVedio";
          break;
        default:
          break;
      }
      // this.type = this.type == "article" ? "demo" : "article";
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
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
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
}
.addAndMerge {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-flow: row nowrap;
  margin-bottom: 15px;
}
</style>