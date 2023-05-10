<template>
  <div id="app">
    <router-view />
    <!-- 转圈圈等待界面 -->
    <div id="loading_page" style="display: none" class="loading-page">
      <div class="loading-img">
        <div class="loading-logo"></div>
      </div>
    </div>
    <!-- 带进度条等待界面 -->
    <!-- 带进度进度条等待界面 -->
    <div v-show="isProgressLoading" class="loading-page1">
      <div class="loading-progress">
        <div class="loading-bar" :style="{ width: progressPercent + '%' }">
          {{ progressPercent }}%
        </div>
      </div>
    </div>
    <div id="moving_page" style="display: none" class="moving-page"></div>
    <div id="moving_page1" style="display: none" class="moving-page"></div>
    <div id="moving_page2" style="display: none" class="moving-page"></div>
    <!-- alert的弹窗 -->
    <dialog-comp
      :visible.sync="isAlert"
      dialog-title="Tips"
      :dialog-width="400"
    >
      <div
        style="text-align: center; line-height: 20px; margin: 20px; max-height: 500px; overflow-x: hidden; overflow-y: auto"
      >
        {{ alertMsg }}
      </div>
      <div style="text-align: center">
        <el-button type="primary" size="small" @click="isAlert = false">
          OK
        </el-button>
      </div>
    </dialog-comp>
    <!-- confirm的对话框 -->
    <dialog-comp
      :visible.sync="isConfirm"
      dialog-title="Tips"
      :dialog-width="400"
    >
      <div
        style="text-align: center; line-height: 20px; margin: 20px; max-height: 500px; overflow-x: hidden; overflow-y: auto"
      >
        {{ confirmMsg }}
      </div>
      <div style="text-align: center" class="confirm-btn">
        <el-button type="primary" size="small" @click="onConfirmMsg">
          {{ $t("common.ok") }}
        </el-button>
        <el-button
          type="warning"
          size="small"
          style="margin-left: 10px"
          @click="onConfirmMsg1"
        >
          {{ $t("common.cancel") }}
        </el-button>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import LoginHelper from "@/utils/loginHelper.js";
import { loadQiyeLogo } from "@/api/account.js";
export default {
  name: "App",
  data: () => ({
    isAlert: false,
    alertMsg: "",
    isConfirm: false,
    confirmMsg: "",
    confirmCallback: null,
    confirmCallback1: null,
    refreshCheck: null,

    progressPercent: 0,
    isProgressLoading: false
  }),
  methods: {
    showAlertMsg(msg) {
      var that = this;
      this.alertMsg = msg;
      this.$nextTick(function(params) {
        that.isAlert = true;
      });
    },
    showConfirmMsg(msg, callback, callback1) {
      var that = this;
      this.confirmMsg = msg;
      if (callback) {
        this.confirmCallback = callback;
      }
      if (callback1) {
        this.confirmCallback1 = callback1;
      }

      this.$nextTick(function(params) {
        that.isConfirm = true;
      });
    },
    onConfirmMsg() {
      if (this.confirmCallback) {
        this.confirmCallback();
      }
      this.isConfirm = false;
    },
    onConfirmMsg1() {
      if (this.confirmCallback1) {
        this.confirmCallback1();
      }
      this.isConfirm = false;
    },
    //检查登录
    checkLogin: function() {
      var dtime = new Date().getTime();
      // console.log('zhisssssssssssssss')
      if (
        (window.localStorage.getItem("carweb_time") &&
          dtime >= window.localStorage.getItem("carweb_time")) ||
        !window.localStorage.getItem("carweb_user")
      ) {
        window.localStorage.removeItem("carweb_user");
        window.localStorage.removeItem("carweb_time");
        window.localStorage.removeItem("carweb_tag");
        // window.localStorage.removeItem("isAlert");
        window.localStorage.removeItem("carweb_logo");
        window.localStorage.removeItem("carweb_icon");
        console.log("zhixing", this.$route.fullPath.indexOf("login"));
        if (this.$route.fullPath.indexOf("login") == -1) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }
        // 退出的话直接其他页面都没有重定向路径了
        if (this.refreshCheck) {
          this.refreshCheck = clearInterval(this.refreshCheck);
        }
        return false;
      }

      return true;
    },
    refreshLoginTime() {
      var that = this;
      if (this.refreshCheck) {
        this.refreshCheck = clearInterval(this.refreshCheck);
      }
      this.refreshCheck = setInterval(function() {
        that.checkLogin();
      }, 1000);
    },
    showProgressPage(percent) {
      // console.log(percent);
      if (percent >= 100) {
        this.progressPercent = 100;
        var that = this;
        setTimeout(() => {
          that.isProgressLoading = false;
        }, 500);
      } else {
        this.progressPercent = percent;

        this.isProgressLoading = true;
      }
    },
    closeProgressPage() {
      this.isProgressLoading = false;
    },
    loadLogo() {
      if (JSON.parse(window.localStorage.getItem("carweb_user"))) {
        if (JSON.parse(window.localStorage.getItem("carweb_user")).userId) {
          var userId = JSON.parse(window.localStorage.getItem("carweb_user"))
            .userId;
          loadQiyeLogo({ userId: userId }).then(res => {
            if (res.errCode == 200) {
              let iconLink = document.querySelector('link[rel="icon"]');
              if (res.data.logo) {
                let logo = this.API.staticResource + res.data.logo;
                window.localStorage.setItem("carweb_logo", logo);
              }
              if (res.data.icon) {
                iconLink.href = this.API.staticResource + res.data.icon;
              } else {
                // iconLink.href = this.API.logoPath + "zhongxin-small.png";

                LoginHelper.getLogo();
              }
            }
          });
        }
      } else {
        // var iconLink = document.querySelector('link[rel="icon"]');
        // iconLink.href = this.API.logoPath + "zhongxin-small.png";
        LoginHelper.getLogo();
        return;
      }
    },
    listenEvent() {
      this.app.$on("load-account-icon", this.loadLogo);
      this.app.$on("refresh-login-time", this.refreshLoginTime);
      this.app.$on("show-alert-msg", this.showAlertMsg);
      this.app.$on("show-confirm-msg", this.showConfirmMsg);
      this.app.$on("show-progress-page", this.showProgressPage);
    },
    offEvent() {
      this.app.$off("load-account-icon", this.loadLogo);
      this.app.$off("refresh-login-time", this.refreshLoginTime);
      this.app.$off("show-alert-msg", this.showAlertMsg);
      this.app.$off("show-confirm-msg", this.showConfirmMsg);
      this.app.$off("show-progress-page", this.showProgressPage);
    }
  },
  mounted: function() {
    this.checkLogin();
    this.loadLogo();
    this.listenEvent();
    this.refreshLoginTime();
  },
  beforeDestroy() {
    this.offEvent();
    if (this.refreshCheck) {
      this.refreshCheck = clearInterval(this.refreshCheck);
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/carweb_style.scss";
</style>

<style lang="scss" scoped>
#app {
  display: block;
  height: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  position: absolute;
  color: #0b0d13;
}
.moving-page {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  cursor: move;
}

.loading-page {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes loading {
  0% {
    border-color: transparent #00ccff #0099ff #0066ff;
  }

  25% {
    border-color: #0066ff transparent #00ccff #0099ff;
  }
  50% {
    border-color: #0099ff #0066ff transparent #00ccff;
  }
  75% {
    border-color: #00ccff #0099ff #0066ff transparent;
  }
  100% {
    border-color: transparent #00ccff #0099ff #0066ff;
  }
}

.loading-page .loading-img {
  height: 20rem;
  width: 20rem;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-width: 0.8rem;
  border-style: solid;
  border-color: white;
  border-radius: 50%;
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: running;
}

.loading-page .loading-logo {
  height: 3.2rem;
  width: 12.8rem;
  display: inline-block;
  //background-size: 100% 100%;
  //background-image: url("./assets/img/LOGO.png");
}

@keyframes loading1 {
  0% {
    background-image: linear-gradient(
      to right,
      #0066ff 33%,
      #0099ff 33%,
      #0099ff 66%,
      #00ccff 66%,
      #00ccff 100%
    );
  }

  33% {
    background-image: linear-gradient(
      to right,
      #0099ff 33%,
      #00ccff 33%,
      #00ccff 66%,
      #0066ff 66%,
      #0066ff 100%
    );
  }
  66% {
    background-image: linear-gradient(
      to right,
      #00ccff 33%,
      #0066ff 33%,
      #0066ff 66%,
      #0099ff 66%,
      #0099ff 100%
    );
  }
  100% {
    background-image: linear-gradient(
      to right,
      #0066ff 33%,
      #0099ff 33%,
      #0099ff 66%,
      #00ccff 66%,
      #00ccff 100%
    );
  }
}

.loading-page1 {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-progress {
    display: inline-block;
    width: 30rem;
    height: 3rem;
    border-radius: 3rem;
    background-color: gainsboro;
    overflow-x: hidden;
    overflow-y: hidden;
    .loading-bar {
      border-radius: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      color: white;
      display: inline-block;
      background-color: #0066ff;
      animation-name: loading1;
      animation-duration: 1s;
      animation-timing-function: ease;
      animation-iteration-count: infinite;
      animation-play-state: running;
    }
  }
}
</style>
