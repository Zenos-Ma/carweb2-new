<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 设置全局所搜的功能 -->
    <device-user-search></device-user-search>
    <div class="d-flex-1"></div>
    <div class="right-menu">
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <el-dropdown trigger="hover" class="right-menu-item hover-effect">
        <span class="el-dropdown-link">
          <i
            class="el-icon-s-comment"
            style="color: #f44336; font-size: 25px"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="clearfix">
            <div
              @click="jumpToRouter('message')"
              style="cursor: pointer; line-height: 20px"
            >
              {{ $t("common.message") }}
              <el-badge class="mark" :value="warns > 0 ? warns : 0"></el-badge>
            </div>
          </el-dropdown-item>
          <el-dropdown-item class="clearfix">
            <div
              @click="jumpToRouter('flow')"
              style="cursor: pointer; line-height: 20px"
              v-if="rootUser.userId"
              v-show="rootUser.userId === 1"
            >
              {{ $t("common.flowAudit1") }}
              <el-badge
                class="mark"
                :value="rechargeNum > 0 ? rechargeNum : 0"
              ></el-badge>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-popover placement="bottom" width="80" trigger="hover">
        <div class="lang-box1" @click="changLangType">
          <div>
            <span class="iconfont icon-zhongwenyuyan"></span>
            <span>简体中文</span>
          </div>
          <div>
            <span class="iconfont icon-yingwenyuyan"></span>
            <span>English</span>
          </div>
          <div>
            <span class="iconfont icon-a-yuyanfanti"></span>
            <span>繁体中文</span>
          </div>
        </div>
        <span slot="reference" class="btn-change-lang">
          <i class="iconfont icon-huaban-" slot="reference"></i>
        </span>
      </el-popover>
      <span
        v-show="rootUser.openApi"
        class="api-img"
        @click="showDialog('api')"
      >
        <img src="@/assets/img/point/apilogo.png" alt="" />
      </span>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <i class="el-icon-user-solid" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item icon="el-icon-user-solid" disabled>{{
            rootUser.userName
          }}</el-dropdown-item>
          <router-link to="/">
            <el-dropdown-item divided
              ><svg-icon
                icon-class="home"
                class-name="svg-icon"
              />首页</el-dropdown-item
            >
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              <svg-icon icon-class="exit" class-name="svg-icon" />退出</span
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { Logout } from "@/api/login.js";
import LoginHelper from "@/utils/loginHelper";
import DeviceUserSearch from "@/layout/components/DeviceUserSearch";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    DeviceUserSearch,
    Screenfull: () => import("@/components/Screenfull")
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "name"])
  },
  data: () => ({
    warns: 0,
    rechargeNum: 0, //报警信息条数
    rootUser: null
  }),
  created() {
    if(JSON.parse(window.localStorage.getItem('carweb_user'))) {
      this.rootUser = JSON.parse(window.localStorage.getItem('carweb_user'))
    }
  },
  methods: {
    showDialog(tag) {
      if (tag == "api") {
        this.app.$emit("show-api-dialog", {
          name: "DateApiDialog"
        });
      }
    },
    dealWarnList(num, recharge) {
      //未读消息数量
      this.warns = num;
      this.rechargeNum = recharge;
    },
    jumpToRouter(tag) {
      // 跳转
    },
    changLangType(e) {
      // 切换语言
      let lang = e.target.innerText.trim();
      switch (lang) {
        case "简体中文":
          this.$i18n.locale = "zh";
          window.localStorage.setItem("langType", "zh");
          this.app.$emit("change-lang-type");
          break;
        case "English":
          this.$i18n.locale = "en";
          window.localStorage.setItem("langType", "en");
          this.app.$emit("change-lang-type");
          break;
        case "繁体中文":
          this.$i18n.locale = "tc";
          window.localStorage.setItem("langType", "tc");
          this.app.$emit("change-lang-type");
          break;
        case "French":
          this.$i18n.locale = "fr";
          window.localStorage.setItem("langType", "fr");
          this.app.$emit("change-lang-type");
          break;
      }
      this.app.$emit("change-lang-type", lang);
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout1() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    logout() {
      Logout().then(res => {
        if (res.errCode == "200") {
          window.localStorage.removeItem("carweb_user");
          window.localStorage.removeItem("carweb_time");
          window.localStorage.removeItem("carweb_tag");
          // window.localStorage.removeItem("isAlert");
          window.localStorage.removeItem("carweb_logo");
          window.localStorage.removeItem("carweb_icon");
          window.localStorage.removeItem("carweb_customer");
          // window.location.href =
          //   LoginHelper.redirectLocation() +
          //   "?redirect=" +
          //   this.$route.fullPath;
          // console.log(LoginHelper.redirectLocation());
          // this.$router.push(
          //   LoginHelper.redirectLocation() + "?redirect=" + this.$route.fullPath
          // );
          // this.$store.dispatch("user/logout");
          // 退出的时候把上方的导航先删除，避免不同的客户登录有不同的菜单，导致会报错
          this.$store.dispatch("tagsView/delAllViews");
          console.log("this.$route.fullPath", this.$route.fullPath);
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          this.app.$emit("load-account-logo");
        }
      });
    },
    listenEvent() {
      this.app.$on("warn-list-num", this.dealWarnList);
    },
    offEvent() {
      this.app.$off("warn-list-num", this.dealWarnList);
    }
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.api-img {
  display: inline-block;
  width: 21px;
  height: 21px;
  line-height: 21px;
  margin: 0 5px 0 10px;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.btn-change-lang {
  cursor: pointer;
  color: #3f47f4;
  .iconfont {
    font-size: 24px;
  }
}
.d-flex-1 {
  flex: 1;
}
.svg-icon {
  margin-right: 8px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #f1f1f1;
  display: flex;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    // line-height: 50px;
    display: flex;
    align-items: center;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      // height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 10px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
