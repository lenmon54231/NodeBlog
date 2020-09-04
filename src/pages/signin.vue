<template>
  <div :id="red ? 'red_sign_wrap' : 'sign_wrap'">
    <div v-if="status==1" class="main" @keyup.enter="signIn">
      <input v-model="name" placeholder="请输入登录账号" />
      <input v-model="password" placeholder="请输入密码" type="password" />
      <el-button @click="signIn" class="sign">登录</el-button>
      <div v-if="!red">
        <p class="toSignUp">
          没有账号 ?
          <span @click="toSignUp">新建一个 !</span>
        </p>
        <p class="toSignUp red">
          网易云 ?
          <span class="red" @click="red = true">GO GO GO !</span>
        </p>
      </div>
      <div v-if="red">
        <p class="toSignUp">
          不了，不了 ?
          <span @click="red = false">返回</span>
        </p>
      </div>
    </div>
    <div v-else-if="status==2" class="main" @keyup.enter="signUp">
      <input v-model="name" placeholder="请输入登录账号" />
      <input v-model="nickName" placeholder="请输入昵称" />
      <input v-model="password" placeholder="请输入密码" type="password" />
      <el-button @click="signUp" class="sign">新建</el-button>
      <p class="toSignUp">
        <span @click="back">返回登录 !</span>
      </p>
    </div>
    <!-- <div v-else-if="status==3" class="loading">
      <div v-if="!txtSignIn" class="outside"></div>
      <p v-else class="txt">登录</p>
    </div>-->
  </div>
</template>

<script>
import { webUrl, musicUrl } from "../../static/js/public.js";

export default {
  created() {},
  data() {
    return {
      red: false,
      status: 1, //1登录,2注册，3loading
      name: "",
      password: "",
      nickName: "",
      txtSignIn: false,
    };
  },
  mounted() {},
  methods: {
    toSignUp: function () {
      this.status = 2;
      this.reset();
    },
    back: function () {
      this.status = 1;
      this.reset();
    },
    reset: function () {
      this.name = "";
      this.password = "";
      this.nickName = "";
    },
    signUp: function () {
      //注册
      let that = this;

      if (that.name.length > 20) {
        that.$message({
          type: "warning",
          message: "登录账号太长!",
        });
        return;
      }
      if (that.nickName.length > 12) {
        that.$message({
          type: "warning",
          message: "昵称太长!",
        });
        return;
      }
      if (
        that.name.length == 0 ||
        that.nickName.length == 0 ||
        that.password.length == 0
      ) {
        that.$message({
          type: "warning",
          message: "有未填写项!",
        });
        return;
      }
      that.$axios
        .post(webUrl + "admin/signUp", {
          name: that.name,
          password: that.password,
          nickName: that.nickName,
        })
        .then((response) => {
          that.$message({
            type: "success",
            message: response.data.msg,
          });
          if (response.data.status == 1) {
            that.back();
          }
        })
        .catch((reject) => {
          console.log(reject);
        });
    },
    signIn: function () {
      //登录
      let that = this;
      if (this.red) {
        this.$axios
          .get(
            musicUrl +
              "login/cellphone?phone=" +
              this.name +
              "&password=" +
              this.password
          )
          .then((res) => {
            console.log(res.data);
            this.$axios({
              method: "get",
              url: musicUrl + "recommend/resource",
              withCredentials: true,
            }).then(function (res) {
              console.log(res.data);
            });
          });
      } else {
        this.$axios
          .post(webUrl + "admin/signIn", {
            name: this.name,
            password: this.password,
          })
          .then((response) => {
            if (response.data.status == 1) {
              let type = response.data.type;

              this.status = 3;
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("user_name", response.data.user_name);
              localStorage.setItem("nickName", response.data.nickName);
              localStorage.setItem("avatar", response.data.avatar);
              if (type == 1) {
                this.$store.commit("changeIsSignIn", 1); //admin
              } else if (type == 2) {
                this.$store.commit("changeIsSignIn", 2); //游客
                this.$store.commit("changeIndex", "7");
              }

              this.txtSignIn = true;
              if (type == 1) {
                this.$router.push({ name: "ArticleList" }); //admin
              } else if (type == 2) {
                this.$router.push({ name: "visiter" }); //游客
              }
            } else {
              that.$message({
                type: "error",
                message: response.data.msg,
              });
            }
          })
          .catch((reject) => {
            console.log(reject);
          });
      }
    },
  },
  beforeCreate: function () {
    document.getElementsByTagName("body")[0].className = "admin";
  },
  beforeDestroy: function () {
    document.body.removeAttribute("class", "admin");
  },
};
</script>

<style scoped lang='scss'>
#sign_wrap {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: lightgrey;
  background: #43c6ac; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #191654,
    #43c6ac
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #191654,
    #43c6ac
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
#red_sign_wrap {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #aa4b6b; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #3b8d99,
    #6b6b83,
    #aa4b6b
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #3b8d99,
    #6b6b83,
    #aa4b6b
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.main {
  width: 300px;
  height: 100%;
}
input {
  background: hsla(0, 0%, 100%, 0.08);
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: hsla(0, 0%, 100%, 0.58);
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 1;
  outline: 0;
  padding: 0 15px;
  transition: all 0.25s ease;
  width: 100%;
  margin-bottom: 20px;
  &:focus {
    border-color: #409eff;
    background: hsla(0, 0%, 100%, 0.28);
  }
  &::-webkit-input-placeholder {
    color: hsla(0, 0%, 100%, 0.58);
  }
  &::-moz-placeholder {
    color: hsla(0, 0%, 100%, 0.58);
  }
  &:-moz-placeholder {
    color: hsla(0, 0%, 100%, 0.58);
  }
  &:-ms-input-placeholder {
    color: hsla(0, 0%, 100%, 0.58);
  }
}
.sign {
  transition: all 0.25s ease;
  background: hsla(0, 0%, 100%, 0.08);
  border: 1px solid hsla(0, 0%, 100%, 0.65);
  border-radius: 3px;
  box-shadow: 0 0 8px hsla(0, 0%, 100%, 0.3);
  color: #fff;
  display: inline-block;
  font-size: 2rem;
  padding: 0.78rem 1.3rem;
  text-decoration: none;
  text-shadow: none;
  width: 300px;
  &:hover {
    background: hsla(0, 0%, 100%, 0.28);
  }
}
.toSignUp {
  color: #ddd;
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  > span {
    color: #ecf5ff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: #5da9ff;
    }
  }
}
.loading {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 50px auto;
  .outside {
    border: 4px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    animation: loadOut 1s infinite;
    position: absolute;
    left: 50%;
    top: 50%;
  }
  .txt {
    color: rgba(255, 255, 255, 0);
    animation: txtLarge 1.5s;
    text-align: center;
    line-height: 100px;
  }
}
@keyframes loadOut {
  from {
    width: 0;
    height: 0;
    margin-left: 0;
    margin-top: 0;
  }
  to {
    width: 92px;
    height: 92px;
    margin-left: -50px;
    margin-top: -50px;
    opacity: 0;
  }
}
@keyframes txtLarge {
  from {
    transform: scale(1);
    color: rgba(255, 255, 255, 0);
  }
  to {
    transform: scale(3);
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
