<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="theLogo" :src="miniLogo" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="theLogo" :src="theLogo" class="sidebar-logo" />
      </router-link>
    </transition>
    <div class="sidebar-btn-cont" v-show="!collapse">
      <div class="item" @click="jumpPage('monitor')">
        <span class="icon-item">
          <i class="iconfont icon-jiankong"></i>
        </span>
        <span>
          监控
        </span>
      </div>
      <div class="item" @click="jumpPage('password')">
        <span class="icon-item">
          <i class="iconfont icon-mima1"></i>
        </span>
        <span>
          修改密码
        </span>
      </div>
      <div class="item" @click="jumpPage('exit')">
        <span class="icon-item">
          <i class="iconfont icon-tuichu"></i>
        </span>
        <span>
          退出
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Logout } from "@/api/login.js";
import { loadQiyeLogo } from "@/api/account.js";
import LoginHelper from "@/utils/loginHelper.js";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // logo: require("@/assets/logo/logo.png"),
      theLogo: LoginHelper.getLogo(),
      miniLogo: require("@/assets/logo/logo-small.png"),
      rootUser: JSON.parse(window.localStorage.getItem("carweb_user"))
    };
  },
  mounted() {
    setTimeout(() => {
      this.loadLogo();
    }, 500);
  },
  methods: {
    loadLogo() {
      if (JSON.parse(window.localStorage.getItem("carweb_user"))) {
        var userId = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userId;
        loadQiyeLogo({ userId: userId }).then(res => {
          if (res.errCode == 200) {
            let iconLink = document.querySelector('link[rel="icon"]');
            if (res.data.logo) {
              this.theLogo = this.API.staticResource + res.data.logo;
              window.localStorage.setItem("carweb_logo", this.theLogo);
            } else if (res.data.icon) {
              iconLink.href = this.API.staticResource + res.data.icon;
            } else {
              LoginHelper.getLogo();
            }
          }
        });
      } else {
        var iconLink = document.querySelector('link[rel="icon"]');
        iconLink.href = this.API.logoPath + "zhongxin-small.png";
        return;
      }
    },
    jumpPage(tag) {
      switch (tag) {
        case "monitor":
          window.open(
            window.location.origin +
              window.location.pathname +
              "#/monitor/location?userId=" +
              this.rootUser.userId
          );
          break;
        case "password":
          this.app.$emit("show-user-pwd-dialog", {
            userId: this.rootUser.userId
          });
          break;
        case "exit":
          this.doLoginOut();
          break;
      }
    },
    doLoginOut() {
      Logout().then(res => {
        if (res.errCode == "200") {
          window.localStorage.removeItem("carweb_user");
          window.localStorage.removeItem("carweb_time");
          window.localStorage.removeItem("carweb_tag");
          window.localStorage.removeItem("carweb_logo");
          window.localStorage.removeItem("carweb_icon");
          window.localStorage.removeItem("carweb_customer");
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          this.app.$emit("load-account-logo");
          // 退出的时候把上方的导航先删除，避免不同的客户登录有不同的菜单，导致会报错
          this.$store.dispatch("tagsView/delAllViews");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar-btn-cont {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  .item {
    display: flex;
    flex-direction: column;
    height: 50px;
    align-items: center;
    cursor: pointer;
    .icon-item {
      border-radius: 50%;
      background: #515762;
      width: 30px;
      height: 30px;
      line-height: 30px;
      .iconfont {
        font-size: 16px;
      }
    }
    &:hover span {
      color: hsla(0, 0%, 100%, 0.5) !important;
    }
  }
  span {
    display: inline-block;
    height: 30px;
    // color: hsla(0, 0%, 100%, 0.5);
    color: #fff;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 280px;
  line-height: 84px;
  // background: #73c5c5;
  background: #060f1e;
  text-align: center;
  overflow: hidden;
  background: url("~@/assets/img/login/logo_bg.png") center / cover no-repeat;
  background-size: auto;
  background-position: center 0;
  & .sidebar-logo-link {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    & .sidebar-logo {
      height: 40px;
      vertical-align: middle;
      margin-right: 12px;
      margin-top: 140px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
