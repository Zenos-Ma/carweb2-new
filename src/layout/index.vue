<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
    </div>
    <!-- 全局显示的 -->
    <user-dialog></user-dialog>
    <device-dialog></device-dialog>
    <search-result-dialog></search-result-dialog>
    <user-pwd-dialog></user-pwd-dialog>
    <date-api-dialog></date-api-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import UserDialog from "@/pages/UserDialog";
import DeviceDialog from "@/pages/DeviceDialog/index.vue";
import SearchResultDialog from "@/pages/SearchResultDialog";
import DateApiDialog from "@/components/DateApiDialog"
const UserPwdDialog = resolve =>
  require(["@/components/UserPwdDialog"], resolve);

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    UserDialog,
    DeviceDialog,
    SearchResultDialog,
    UserPwdDialog,
    DateApiDialog
  },
  mixins: [ResizeMixin],
  data: () => ({
    deviceImei: ""
  }),
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    needTagsView() {
      return this.$store.state.settings.tagsView;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  mounted() {
    this.checkLogin();
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
    checkLogin() {
      var dtime = new Date().getTime();
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
        // console.log("zhixing");
        if (this.$route.fullPath.indexOf("login") == -1) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
