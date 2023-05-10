<template>
  <section style="height: 100%; width: 100%" class="monitor-single">
    <!-- start -->
    <div class="main-left-navbar1">
      <div class="logo" style="margin-top: 20px; text-align: center">
        <img :src="theLogo" alt="" style="height: 38px; max-width: 120px" />
      </div>
      <div class="title-bar">
        <span class="iconfont icon-user" @click="showDevDialog"></span>
        <!-- <span @click="showDevDialog">{{ deviceImei }}</span> -->
        <el-tooltip
          :content="$t('common.detail')"
          effect="light"
          placement="right"
        >
          <span @click="showDevDialog">{{ deviceImei }}</span>
        </el-tooltip>
      </div>
      <ul class="nav-tabs1" style="flex: none; display: inline-flex">
        <li
          :class="['nav-tab', currentPart == item.name ? 'active' : '']"
          v-for="(item, idx) in $t('monitorSingle.navTabs')"
          @click="changeCurrentTab(idx)"
          :key="'navTabs' + idx"
        >
          <i :class="['iconfont', item.icon]"></i>
          <span>{{ item.text }}</span>
        </li>
      </ul>
      <div class="login-out">
        <el-tooltip :content="$t('common.loginout')" effect="light">
          <span class="iconfont icon-icon" @click="doLogout"></span>
        </el-tooltip>
      </div>
    </div>
    <!-- end -->
    <!--  -->
    <div
      class="home-body"
      id="theBody"
      style="margin-left: 150px; width: calc(100% - 160px); padding: 0; height: 100%; box-shadow: 0 2px 10px 0 rgb(0 0 0 / 20%)"
    >
      <router-view></router-view>
    </div>

    <device-dialog></device-dialog>
  </section>
</template>

<script>
import DeviceDialog from "@/components/deviceDialog1/DeviceDialog1";
import LoginHelper from "@/utils/loginHelper.js";
import { Logout } from "@/api/login.js";
export default {
  name: "Monitor",
  components: {
    "device-dialog": DeviceDialog
  },
  data: () => ({
    langType: window.localStorage.getItem("langType"),
    currentPart: "location", //当前导航内容

    deviceImei: JSON.parse(window.localStorage.getItem("carweb_user"))
      .deviceImei, //登录设备imei
    theLogo: LoginHelper.getLogo()
  }),
  methods: {
    //显示设备对话框
    showDevDialog() {
      this.app.$emit("show-device-dialog1");
    }, //改变tab
    changeCurrentTab(idx) {
      var item = this.$t("monitorSingle.navTabs[" + idx + "]");
      this.currentPart = item.name;
      window.location.hash = "#/monitor-single/" + item.name;
      document.title = `${LoginHelper.getTitle()}-${item.text}`;
    }, //改变语言类型
    changeLangType() {
      // this.langType = this.langType == "zh" ? "en" : "zh";
      window.localStorage.setItem("langType", this.langType);

      if (this.langType == "en") {
        this.$i18n.locale = "en";
      } else {
        this.$i18n.locale = "zh";
      }

      this.app.$emit("change-lang-type");
    },
    doLogout() {
      //退出登录
      Logout().then(res => {
        if (res.errCode == "200") {
          window.localStorage.removeItem("carweb_user");
          window.localStorage.removeItem("carweb_time");
          window.location.href = LoginHelper.redirectLocation();
        }
      });
    }
  },
  mounted() {
    // 设置成英文版
    this.changeLangType();
    if (window.location.hash.indexOf("running") >= 0) {
      this.changeCurrentTab(1);
    } else {
      this.changeCurrentTab(0);
    }

    this.app.$emit("refresh-login-time");
    var www = window.location.origin;
  }
};
</script>

<style lang="scss"></style>
