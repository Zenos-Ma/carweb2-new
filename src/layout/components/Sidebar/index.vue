<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        v-if="routes1"
      >
        <sidebar-item
          v-for="route in routes1"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    routes1: []
  }),
  mounted() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      let navMenu = [];
      let navTabs = this.$router.options.routes;
      let navTabsOrigin = JSON.parse(JSON.stringify(navTabs));
      // console.log("navTabs", navTabsOrigin);
      let uiType;
      if (this.rootUser.userId == 1) {
        uiType = 1;
      } else {
        switch (this.rootUser.userTypeV2) {
          case 2:
          case 3:
          case 4:
          case 5:
            uiType = 2;
            break;
          default:
            uiType = 3;
        }
      }
      switch (uiType) {
        case 1: //root权限
          navMenu = navTabsOrigin;
          break;
        case 2:
          navMenu.push(
            navTabsOrigin[0],
            navTabsOrigin[1],
            navTabsOrigin[2],
            navTabsOrigin[3],
            navTabsOrigin[4],
            navTabsOrigin[5],
            navTabsOrigin[9]
          );
          if (this.rootUser.hasPolicy) {
            // 保单模块
            navMenu.push(navTabsOrigin[6]);
          }
          if (this.rootUser.railFlag) {
            // 围栏模块
            navMenu.push(navTabsOrigin[7]);
          }
          if (this.rootUser.isFrcType) {
            // 风控模块
            navMenu.push(navTabsOrigin[10]);
          }
          if (this.rootUser.isRefillCard || this.rootUser.isRechargCard) {
            // 充值卡模块
            navMenu.push(navTabsOrigin[8]);
          }
          for (let i = 0; i < navMenu.length; i++) {
            if (navMenu[i].name == "Account") {
              navMenu[i].children.splice(2, 1);
            }
          }
          // 充值卡的判断
          // console.log("navMenu", navMenu);
          // console.log("navTabsOrigin", navTabsOrigin);
          for (let i = 0; i < navMenu.length; i++) {
            if (navMenu[i].name == "Card") {
              const child = JSON.parse(JSON.stringify(navMenu[i].children));
              // console.log("child", child);
              let childArr = [];
              if (this.rootUser.isRefillCard || this.rootUser.isRechargCard) {
                childArr.push(child[2]);
              }
              if (this.rootUser.isRefillCard) {
                childArr.push(child[3]);
              }
              console.log("childArr", childArr);
              // 子路由权限问题
              navMenu[i].children = [];
              navMenu[i].children = childArr;
              // console.log("child", child);
            }
          }
          // 充值中心的判断
          // console.log("navMenu[6].children", navMenu[6].children[0].name);
          for (let i = 0; i < navMenu[6].children.length; i++) {
            if (
              navMenu[6].children[i].name == "RechargeDo" ||
              navMenu[6].children[i].name == "RechargeExamine"
            ) {
              navMenu[6].children.splice(i, 1);
              i--;
            }
          }
          // 风控蓝牙模块
          if (this.rootUser.userId == 238 || this.rootUser.userId == 21102) {
            navMenu.push(navTabsOrigin[14]);
          }
          //生产管理模块
          if (this.rootUser.produce) {
            // 不是管理员把设备升级的模块切除去
            navMenu.push(navTabsOrigin[15]);
            for (let i = 0; i < navMenu.length; i++) {
              if (navMenu[i].name == "Production") {
                navMenu[i].children.splice(1, 1);
              }
            }
          }
          break;
        default:
          navMenu.push(
            navTabsOrigin[0],
            navTabsOrigin[1],
            navTabsOrigin[2],
            navTabsOrigin[3],
            navTabsOrigin[4],
            navTabsOrigin[5]
          );
          for (let i = 0; i < navMenu.length; i++) {
            if (navMenu[i].name == "Account") {
              navMenu[i].children.splice(2, 1);
            }
          }
          break;
      }
      // 區分管理員和普通的經銷商的某些模塊是沒有權限的

      // console.log("navMenu", navMenu);
      this.routes1 = navMenu;
    }
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      // return navMenu;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
