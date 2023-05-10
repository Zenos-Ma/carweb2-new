<template>
  <section
    style="position:absolute;width: 100%;height: 100%;"
    class="box-content"
  >
    <!--登录框 start-->
    <div class="back-cont-head">
      <p>{{ $t("login.titleHead") }}</p>
    </div>
    <div class="main-content">
      <div class="left" />
      <div class="right">
        <div class="icon-er">
          <div class="iphone-qr main-qr">
            <i class="iconfont icon-iPhone" />
            <span>iPhone</span>
            <div class="qr-box">
              <img src="@/assets/img/login/apple_domilink_app_logo.png" />
            </div>
          </div>
          <div class="android-qr main-qr">
            <a href="https://www.basegps.com/updateapk/domilinkV2.4.apk">
              <!-- <img src="anzhuo.png" alt=""> -->
              <i class="iconfont icon-android" />
              <span>Android</span>
            </a>

            <div class="qr-box">
              <img src="@/assets/img/login/domilinkV2_4.png" />
            </div>
          </div>
          <div class="wechat-qr main-qr">
            <!-- <img src="WeChat.png" alt=""> -->
            <i class="iconfont icon-weixin1" />
            <span>Wechat</span>
            <div class="qr-box">
              <img src="@/assets/img/login/domilink-wechat.png" />
            </div>
          </div>
        </div>

        <!-- 登录框框 -->
        <div class="login">
          <!-- 提示框 start -->
          <div class="version-tips">
            <!-- <p>{{ $t("login.versionTips") }}</p> -->
            <p>
              <!-- <i class="iconfont icon-voice" style="vertical-align: middle;padding-right:5px"></i> -->
              <img class="laba-show" src="@/assets/img/laba.gif" alt="" />
              <span>{{ $t("common.domilinkTip") }}</span>
            </p>
          </div>
          <!-- 提示框 end -->
          <span style="color:#fff;font-size:18px;padding-left:15px">{{
            $t("login.login")
          }}</span>
          <!-- <a href="http://domilink.com/carweb2/" style="color:#fff;padding-left:100px;text-decoration:none;font-size:14px">
            <i class="iconfont icon-houtui-shi"></i>
            To old version
          </a> -->
          <el-select
            v-model="version"
            class="version-select"
            style="width:70px;margin-left:150px"
            @change="chooseUrl"
          >
            <el-option value="v2">{{ $t("login.v2version") }}</el-option>
            <el-option value="v3">{{ $t("login.v3version") }}</el-option>
          </el-select>

          <div id="web_qr_login" class="web_qr_login">
            <!--账号登录-->
            <div id="web_login" class="web_login" style="display: block;">
              <div class="inputOuter iteminput">
                <i class="iconfont icon-denglu" />
                <input
                  id="login_name"
                  v-model.trim="loginNo"
                  type="text"
                  class="i-account1"
                  :placeholder="$t('common.account')"
                  @keyup.enter="changeFocus('pwd')"
                />
              </div>
              <div class="inputOuter itempwd">
                <i class="iconfont icon-mima" />
                <input
                  id="login_pwd"
                  v-model.trim="loginPwd"
                  type="text"
                  class="i-password1"
                  :placeholder="$t('login.pwdTip')"
                  autocomplete="off"
                  clearable
                  @keyup.enter="doLogin"
                />
              </div>
              <div class="tips" style="margin-bottom: 0px;">
                <div class="switch" style="margin-left: 0px;">
                  <!-- <input type="checkbox" v-model="isCookie" />
                  <span style="margin-left: 10px;white-space: nowrap;font-size: 14px;">{{ $t("login.remeberPwd") }}</span> -->
                  <el-checkbox v-model="isCookie" style="color:#fff">{{
                    $t("login.remeberPwd")
                  }}</el-checkbox>
                </div>
              </div>
              <!-- <p style="color:red;font-size:1.2rem;" v-if="isFail">{{ $t("login.loginError") }}</p> -->
              <div style="padding-top:10px">
                <button class="button_blue" @click="doLogin">
                  {{ $t(isLogin ? "login.loginBtn1" : "login.loginBtn") }}
                </button>
              </div>
            </div>
          </div>
          <!--账号登录end-->
        </div>
      </div>
    </div>
    <!--登录框 end-->
    <div class="bottom">
      <div class="left">
        <div>
          <a
            href="http://beian.miit.gov.cn"
            target="_blank"
            style="color: white;white-space: nowrap;"
          >
            <span>{{ nowYear.getFullYear() }}</span>
            <span>广州市正唐信息科技有限公司 粤ICP备17155539号-3</span>
          </a>
        </div>
      </div>
      <div class="lang-select-type">
        <div class="lang-select-cur">
          <a href="javascript:void(0);">
            <span :class="[langClass, 'iconfont']" />
            <span>{{ langName }}</span>
          </a>
        </div>
        <div class="lang-box" data-index="0" @click="changLangType">
          <a href="javascript:void(0);">
            <span class="iconfont icon-zhongwenyuyan" />
            <span>简体中文</span>
          </a>
          <a href="javascript:void(0);">
            <span class="iconfont icon-yingwenyuyan" />
            <span>English</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import LoginHelper from "@/utils/loginHelper.js";
import CryptoJs from "crypto-js";
import { encrypt, decrypt } from "@/utils/crypto.js";
import {
  Login,
  getUserInfo,
  checkLogin,
  superParentUserInfo
} from "@/api/login.js";

export default {
  name: "Login2",
  components: {},
  data: () => ({
    langType: window.localStorage.getItem("langType"), // 当前语言
    isDev: false, // 是否设备登录
    isFocus: false, // 输入框聚焦
    isLogin: false, // 是否处于登录中，防止重复点击登录
    loginNo: "", // 登录账号
    loginPwd: "", // 登录密码
    // isCookie: false, //是否保存账号密码
    isCookie: JSON.parse(window.localStorage.getItem("isCookie")),
    isFail: false, // 是否登录失败
    isInt: false,
    langName: "简体中文",
    langClass: "icon-zhongwenyuyan",
    version: "v3",
    isShowloading: false,
    nowYear: new Date(),
    loginForm: {
      username: "admin",
      password: "111111"
    },
    redirect: undefined,
    otherQuery: {}
  }),

  watch: {
    version() {
      const www = window.location.origin;
      if (/domilink\.com/.test(www)) {
        // 香港服务器
        if (this.version == "v2") {
          window.location.href = "http://domilink.com/carweb2/";
        } else {
          window.location.href = "https://domilink.com/";
        }
      } else {
        // 阿里云内地服务器（先指向测试服务）
        if (this.version == "v2") {
          window.localStorage.setItem("carweb_tag", "v2");
        } else {
          window.localStorage.setItem("carweb_tag", "v3");
        }
      }
    },
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = route.query && route.query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    if (localStorage.getItem("isCookie") == "true") {
      this.getCookie();
    }
  },
  mounted() {
    var that = this;
    this.checkLoginCookie();
    this.listenEvent();
    document.title = `${LoginHelper.getTitle()}-${this.$t("login.login")}`;
    this.langType = window.localStorage.getItem("langType");
    switch (this.langType) {
      case "zh":
        this.$i18n.locale = "zh";
        window.localStorage.setItem("langType", "zh");
        this.app.$emit("change-lang-type");
        this.langName = "简体中文";
        this.langClass = "icon-zhongwenyuyan";
        break;
      case "en":
        this.$i18n.locale = "en";
        window.localStorage.setItem("langType", "en");
        this.app.$emit("change-lang-type");
        this.langName = "English";
        this.langClass = "icon-yingwenyuyan";
        break;
      case "jap":
        this.$i18n.locale = "jap";
        window.localStorage.setItem("langType", "jap");
        this.app.$emit("change-lang-type");
        this.langName = "Japanese";
        this.langClass = "jap-an";
    }

    document.getElementById("login_name").onfocus = function() {
      that.isFocus = false;
    };
    document.getElementById("login_pwd").onfocus = function() {
      that.isFocus = true;
    };
    // $(".main-qr").hover(
    //   function() {
    //     // console.log("12");
    //     var index = $(this).index();
    //     $(".main-qr .qr-box")
    //       .eq(index)
    //       .fadeIn(300);
    //     $(this)
    //       .siblings()
    //       .find(".qr-box")
    //       .hide();
    //   },
    //   function() {
    //     $(".main-qr .qr-box").fadeOut(100);
    //   }
    // );
    //
    var timer;
    // $(".lang-select-type").hover(
    //   function() {
    //     $(".lang-box").attr("data-index", "1");
    //     $(this).addClass("hover");
    //     clearInterval(timer);
    //   },
    //   function() {
    //     timer = setTimeout(() => {
    //       $(".lang-box").attr("data-index", "0");
    //       $(this).removeClass("hover");
    //     }, 500);
    //   }
    // );
  },
  methods: {
    changLangType(e) {
      // console.log(e.target);
      const lang = e.target.innerText;
      switch (lang) {
        case "简体中文":
          this.$i18n.locale = "zh";
          window.localStorage.setItem("langType", "zh");
          this.app.$emit("change-lang-type");
          this.langName = "简体中文";
          this.langClass = "icon-zhongwenyuyan";
          break;
        case "English":
          this.$i18n.locale = "en";
          window.localStorage.setItem("langType", "en");
          this.app.$emit("change-lang-type");
          this.langName = "English";
          this.langClass = "icon-yingwenyuyan";
          break;
        case "Japanese":
          this.$i18n.locale = "jap";
          window.localStorage.setItem("langType", "jap");
          this.app.$emit("change-lang-type");
          this.langName = "Japanese";
          this.langClass = "jap-an";
      }
    },
    chooseUrl(e) {
      console.log(e);
    },
    changeFocus(tag) {
      if (tag == "pwd") {
        // 聚焦到密码输入框
        this.isFocus = true;
        $("#login_name").blur();
        $("#login_pwd").focus();
      } else {
        // 聚焦到账号输入框
        this.isFocus = false;
        $("#login_name").focus();
        $("#login_pwd").blur();
      }
    },

    //
    setCookie(login, pwd, days) {
      // 设置cookie的值
      const str = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz";
      const loginName = CryptoJs.AES.encrypt(login + "", str).toString();
      const passWord = CryptoJs.AES.encrypt(pwd + "", str).toString();
      const exdata = new Date(); // 获取当前的时间
      exdata.setTime(exdata.getTime() + 24 * 60 * 60 * 1000 * days); // 设置保存的天数
      window.document.cookie =
        "loginName" +
        "==" +
        loginName +
        ";path=/;expires=" +
        exdata.toGMTString();
      window.document.cookie =
        "userPassword" +
        "==" +
        passWord +
        ";path=/;expires=" +
        exdata.toGMTString();
    },

    getCookie() {
      // 获取cookie的值
      if (document.cookie.length > 0) {
        const arr = document.cookie.split(";");
        // console.log(arr);
        const str1 = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz";
        for (var i = 0; i < arr.length; i++) {
          const arrStr = arr[i].split("==");
          if (arrStr[0].trim() == "loginName") {
            const bytes = CryptoJs.AES.decrypt(arrStr[1], str1);
            this.loginNo = bytes.toString(CryptoJs.enc.Utf8);
          }
          if (arrStr[0].trim() == "userPassword") {
            const bytes1 = CryptoJs.AES.decrypt(arrStr[1], str1);
            this.loginPwd = bytes1.toString(CryptoJs.enc.Utf8);
          }
        }
      }
    },
    clearCookie() {
      this.setCookie("", "", -1);
    },

    doLogin() {
      // 登录
      if (!this.loginNo) {
        this.$message.warning(this.$t("login.loginNoTip"));
        return;
      }
      if (!this.loginPwd) {
        this.$message.warning(this.$t("login.loginPwdTip"));
        return;
      }
      if (this.loginPwd && this.loginNo) {
        var device_pattern = /[0-9]{15,16}/;
        if (device_pattern.test(this.loginNo)) {
          // 设备登录
          this.isDev = true;
          this.onLogin({
            loginType: "4",
            checkPwd2: this.isCookie ? "1" : "0",
            loginNo: this.loginNo,
            loginPwd: encrypt(this.loginPwd)
          });
        } else {
          // 用户登录
          this.isDev = false;
          this.onLogin({
            loginType: "3",
            checkPwd1: this.isCookie ? "1" : "0",
            loginNo: this.loginNo,
            passwords: encrypt(this.loginPwd)
          });
        }
      }
    },

    onLogin(data) {
      // 登录
      this.isLogin = true;
      Login(data).then(res => {
        if (res.errCode == 200) {
          if (this.version == "v2") {
            const main_url = "/carweb2/v2/login/home.action";
            window.location.href = main_url;
          } else {
            this.getUserInfo();
            // 设置cookie
            if (this.isCookie) {
              this.setCookie(this.loginNo, this.loginPwd, 30);
            } else {
              this.clearCookie();
            }
            localStorage.setItem("isCookie", this.isCookie);
          }
        } else {
          this.isLogin = false;
          this.$message.warning(
            "Login failed, user name does not exist or password is incorrect or expired! [501]."
          );
        }
      });
    }, // onDevLogin

    checkLoginCookie() {
      // console.log("zhixing");
      // 判断是否登录了
      var dtime = new Date().getTime();
      if (
        (window.localStorage.getItem("carweb_time") &&
          dtime >= window.localStorage.getItem("carweb_time")) ||
        !window.localStorage.getItem("carweb_user")
      ) {
        checkLogin().then(res => {
          if (res.errCode == 200) {
            this.getUserInfo();
          } else {
            this.isLogin = false;
          }
        });
      } else {
        // console.log("zhixing", !window.localStorage.getItem("carweb_user"));
        if (this.isDev) {
          window.location.hash = "#/monitor-single";
        } else {
          if (this.$route.query.redirect) {
            window.location.hash = "#" + this.$route.query.redirect;
          } else {
            window.location.hash = "#/home";
          }
        }
      }
    },
    // 登录失败
    loginFail() {
      this.isLogin = false;
      this.isFail = true;
      window.localStorage.removeItem("carweb_user");
      window.localStorage.removeItem("carweb_time");
      window.localStorage.removeItem("carweb_customer");
      window.localStorage.removeItem("carweb_logo");
      window.localStorage.removeItem("carweb_icon");
    },
    getRelation(userId) {
      // 判断该用户是否为邓总用户
      superParentUserInfo().then(res => {
        if (res.errCode == 200) {
          if (res.data.typeId == 1 || userId == 470 || userId == 16880) {
            window.localStorage.setItem("carweb_customer", "shanghai_deng");
          } else {
            window.localStorage.setItem("carweb_customer", "normal");
          }
        }
        if (this.isDev) {
          window.location.hash = "#/monitor-single";
        } else {
          console.log(
            "zhixing",
            this.$router,
            this.$router.push({ path: this.redirect || "/home/index" })
          );

          this.$router.push({
            path: this.redirect || "/home/index",
            query: this.otherQuery
          });
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getUserInfo() {
      // 获取登录用户的信息
      getUserInfo().then(res => {
        if (res.errCode == "200") {
          // console.log(res);
          res.data.loginUser.isRefillCard = res.data.isRefillCard;
          res.data.loginUser.isRechargCard = res.data.isRechargCard;
          res.data.loginUser.loginType = res.data.loginType;
          res.data.loginUser.isFrcType = res.data.isFrcType;
          res.data.loginUser.initFlag = res.data.isInitType;
          res.data.loginUser.railFlag = res.data.isRailType;
          res.data.loginUser.trinityFlag = res.data.trinityFlag;
          res.data.loginUser.produce = res.data.produce;
          res.data.loginUser.openApi = res.data.openApi;
          window.localStorage.setItem(
            "carweb_user",
            JSON.stringify(res.data.loginUser)
          );
          window.sessionStorage.setItem(
            "carweb_user",
            JSON.stringify(res.data.loginUser)
          );
          window.localStorage.setItem("carweb_tag", "v3");
          window.localStorage.setItem(
            "carweb_time",
            new Date().getTime() + 1 * 60 * 60 * 1000
          );
          // var contextPath = location.origin;
          if (res.data.loginUser.deviceImei) {
            window.location.hash = "#/monitor-single";
          } else {
            this.getRelation(res.data.loginUser.userId);
          }
        }
      });
    },
    listenEvent() {
      this.app.$on("home1-refresh", this.getUserInfo);
    },
    offEvent() {
      this.app.$off("home1-refresh", this.getUserInfo);
    }, // 刷新用户树
    getBase64(url, callback) {
      // 本地图片转成base64位
      const Img = new Image();
      let dataURL = "";
      // let imgExt = this.extname(url);
      const imgExt = url;
      Img.src = url + "?v=" + Math.random(); // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
      Img.setAttribute("crossOrigin", "Anonymous"); // 解决控制台跨域报错的问题（没用就跟后台沟通添加跨域）
      Img.onload = function() {
        // 要先确保图片完整获取到，这是个异步事件
        const canvas = document.createElement("canvas"); // 创建canvas元素
        const width = Img.width; // 确保canvas的尺寸和图片一样
        const height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); // 将图片绘制到canvas中
        dataURL = canvas.toDataURL("image/" + imgExt); // 转换图片为dataURL
        callback ? callback(dataURL) : null; // 调用回调函数
      };
    }
  },
  beforeDestory() {
    this.offEvent();
  }
};
</script>
<style lang="scss">
@import "~@/styles/login.scss";
#login_pwd {
  -webkit-text-security: disc;
  text-security: disc;
}
@media screen and (max-width: 750px) {
  .back-cont-head {
    display: none;
  }
  .box-content .right .login {
    padding: 20px 0px;
  }
  .icon-er {
    width: 100%;
  }
}
.version-tips {
  position: absolute;
  color: #3e3939;
  top: -52px;
  width: 344px;
  left: 0px;
  background: #edf2fc;
  padding: 0 10px;
  border-radius: 5px;
  p {
    margin: 8px 0;
  }
}
</style>
<style lang="scss" scoped>
.login {
  ::v-deep .el-input__inner {
    line-height: 30px !important;
    height: 30px !important;
  }
  ::v-deep .el-input__icon {
    line-height: 30px !important;
  }
}
.laba-show {
  width: 28px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}
.version-select {
  ::v-deep .el-input__icon {
    height: 30px !important;
  }
}
</style>
