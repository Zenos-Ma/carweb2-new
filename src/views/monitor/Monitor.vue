<template>
  <section class="monitor-content" v-cloak>
    <!-- start -->
    <div class="main-left-navbar1">
      <div class="logo" style="margin-top: 50px; text-align: center">
        <!-- <img src="@/assets/img/logo1.png" alt="" style="width:50%" /> -->
        <img :src="theLogo" alt="" style="height: 40px; max-width: 120px" />
      </div>
      <ul class="nav-tabs1" style="flex: none; display: inline-flex">
        <li
          :class="['nav-tab', currentPart == item.name ? 'active' : '']"
          v-for="(item, idx) in $t('monitor.navTabs')"
          @click="changeCurrentTab(idx)"
          :key="'navTabs' + idx"
        >
          <i :class="['iconfont', item.icon]"></i>
          <span style="padding-left: 5px">{{ item.text }}</span>
        </li>
      </ul>
      <span
        style="line-height: 42px; display: inline-flex; color: #fff; position: absolute; left: 25px; bottom: 20px"
      >
        <span
          class="iconfont icon-zhuye"
          style="margin-right: 8px"
          @click="backHome"
        ></span>
        <span @click="backHome">{{ $t("common.backHome") }}</span>
      </span>
    </div>
    <!-- end -->

    <div
      class="home-body1"
      id="theBody"
      style="height: 100%; margin-left: 140px; width: calc(100% - 140px)"
    >
      <div class="body-content1">
        <div class="body-content-left" v-show="currentPart != 'location'">
          <!-- 用户树 -->
          <div class="form-card" style="height: calc(35% - 8px)">
            <div class="card-header">
              {{ $t("common.myCustomer") }}
              <span
                style="font-size: 12px; width: 200px; text-overflow: ellipsis"
                v-show="userName"
                >:{{ userName }}</span
              >
            </div>
            <div
              class="card-body"
              style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; padding-right: 0; background: #f3fbfe; border-radius: unset; box-shadow: unset; border: 1px solid #ccc"
            >
              <user-tree
                tree-name="monitor"
                :user-id.sync="userId"
                @usertree-select="onSelectUser"
              ></user-tree>
            </div>
          </div>
          <div class="move-bar-v"></div>
          <!-- 设备列表 start-->
          <div class="form-card" style="height: 65%; padding-top: 0px">
            <div class="card-header">{{ $t("common.deviceList") }}</div>
            <div
              class="card-body"
              style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; background-color: #f3fbfe; border-radius: unset"
            >
              <device-list
                :user-id.sync="userId"
                :btn-type="currentTab"
                @devlist="onDevList"
                @do-dev-op="dealDevOp"
                @select-dev="onSelectDev"
                :device-imei.sync="deviceImei"
              ></device-list>
            </div>
          </div>
          <!-- 设备列表 end-->
        </div>
        <div class="move-bar-h" v-show="currentPart != 'location'"></div>
        <div
          :class="[
            'body-content-right',
            currentPart == 'location' ? 'show-location-content-type' : ''
          ]"
        >
          <router-view></router-view>
        </div>
      </div>
    </div>

    <warn-list></warn-list>
    <device-dialog></device-dialog>
  </section>
</template>

<script>
import DeviceList from "@/components/DeviceList/DeviceList";
import WarnList from "@/components/WarnList/WarnList";
import UserTreeComp from "@/components/UserTree/UserTree";
import DeviceDialog from "@/pages/DeviceDialog/index.vue";
import LoginHelper from "@/utils/loginHelper.js";
import { getUserTreeInfo } from "@/api/customer.js";
export default {
  name: "Monitor",
  components: {
    "warn-list": WarnList,
    "device-dialog": DeviceDialog,
    "user-tree": UserTreeComp,
    "device-list": DeviceList
  },
  data: () => ({
    langType: window.localStorage.getItem("langType"),
    currentTab: 0, //当前导航
    currentPart: "location", //当前导航内容

    // theLogo: LoginHelper.getLogo(),
    theLogo: window.localStorage.getItem("carweb_logo"),
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    deviceImei: "",
    devList: [],
    pager: { current: 1, num: 1, limit: 100 },
    ads: ""
  }),
  computed: {
    langType1() {
      return window.localStorage.getItem("langType");
    }
  },
  methods: {
    changeLangType1(lang) {
      console.log(lang);
      console.log("chufa");
      switch (this.langType1) {
        case "zh":
          this.$i18n.locale = "zh";
          window.localStorage.setItem("langType", "zh");
          break;
        case "en":
          this.$i18n.locale = "en";
          window.localStorage.setItem("langType", "en");
          break;
        case "jap":
          this.$i18n.locale = "jap";
          window.localStorage.setItem("langType", "jap");
      }
    },
    //返回主页
    backHome() {
      window.location.hash = "#/home";
    }, //改变tab
    changeCurrentTab(idx) {
      // console.log(idx);
      this.currentTab = idx;
      var address = window.location.hash;
      if (address.indexOf("?") >= 0) {
        address = address.substring(address.indexOf("?"));
      } else {
        address = "";
      }
      var item = this.$t("monitor.navTabs[" + idx + "]");
      this.currentPart = item.name;
      window.location.hash = "#/monitor/" + this.currentPart + address;
      document.title = `${LoginHelper.getTitle()}-${item.text}`;
      var that = this;
      if (this.currentPart == "location") {
        setTimeout(function() {
          that.app.$emit("monitor-devlist", {
            pager: that.pager,
            devList: that.devList
          });
        }, 200);
      }
      setTimeout(function() {
        that.app.$emit("monitor-select-user", that.userId);
        that.app.$emit("monitor-select-dev", { deviceImei: that.deviceImei });
      }, 200);
    }, //改变语言类型
    changeLangType() {
      this.langType = this.langType == "zh" ? "en" : "zh";
      window.localStorage.setItem("langType", this.langType);

      if (this.langType == "en") {
        this.$i18n.locale = "en";
      } else {
        this.$i18n.locale = "zh";
      }

      this.app.$emit("change-lang-type");
    },
    onSelectUser(userId, userName) {
      var that = this;
      this.userId = userId;
      if (!userName) {
        getUserTreeInfo({ userId: userId }).then(res => {
          if (res.errCode == "200") {
            that.userName = res.data.userName;
          }
        });
      } else {
        this.userName = userName;
      }

      this.app.$emit("usertree-userid", userId, userName);
      window.location.hash = this.$route.path + "?userId=" + userId;
      this.app.$emit("monitor-select-user", userId, userName);
    },
    onSelectUserId(userId) {
      this.userId = userId;
      this.app.$emit("usertree-userid", userId);
    },
    onSelectDev(device) {
      if (device && device.deviceImei) {
        this.deviceImei = device.deviceImei;
        this.app.$emit("monitor-select-dev", device);
      }
    },
    dealDevOp(op) {
      this.app.$emit("monitor-dev-op", op);
    },
    onDevList(op) {
      this.devList = op.devList;
      this.pager = op.pager;
      this.app.$emit("monitor-devlist", op);
    },
    selectDevice(device) {
      if (device && device.deviceImei) {
        this.deviceImei = device.deviceImei;
      }
    },
    listenEvent() {
      this.app.$on("monitor-change-device", this.selectDevice);
      this.app.$on("monitor-userid", this.onSelectUserId);
      this.app.$on("monitor-user", this.onSelectUser);
      this.app.$on("map-select-marker", this.selectDevice);
      this.app.$on("change-lang-type", this.changeLangType1);
    },
    offEvent() {
      this.app.$off("monitor-change-device", this.selectDevice);
      this.app.$off("monitor-userid", this.onSelectUserId);
      this.app.$off("monitor-user", this.onSelectUser);
      this.app.$off("map-select-marker", this.selectDevice);
      this.app.$off("change-lang-type", this, this.changeLangType1);
    },
    parsePath(tag) {
      for (let i = 0; i < this.$t("monitor.navTabs").length; i++) {
        if (tag == this.$t("monitor.navTabs[" + i + "].name")) {
          this.changeCurrentTab(i);
          break;
        }
      }
    }
  },
  mounted() {
    // this.changeLangType1();
    this.listenEvent();
    this.moveVertical();
    this.moveHoriztion();
    var that = this;
    var address = window.location.hash;
    if (this.$route.query.userId) {
      var userId = parseInt(this.$route.query.userId);
      if (userId != this.rootUser.userId) {
        setTimeout(() => {
          that.onSelectUser(userId);
        }, 200);
        this.currentPart = address.match(/monitor\/(\S+)\?/)
          ? address.match(/monitor\/(\S+)\?/)[1]
          : address.match(/monitor\/(\S+)/)[1];
      }
    } else if (this.$route.query.deviceImei) {
      var deviceImei = this.$route.query.deviceImei;
      if (this.deviceImei != deviceImei) {
        setTimeout(() => {
          that.onSelectDev({ deviceImei: deviceImei });
        }, 200);
        this.currentPart = address.match(/monitor\/(\S+)\?/)
          ? address.match(/monitor\/(\S+)\?/)[1]
          : address.match(/monitor\/(\S+)/)[1];
      }
    }
    this.$nextTick(function() {
      that.app.$emit("refresh-login-time");
      if (window.location.hash.match(/\//g).length == 1) {
        that.changeCurrentTab(0);
      } else {
        that.parsePath(
          address.match(/monitor\/(\S+)\?/)
            ? address.match(/monitor\/(\S+)\?/)[1]
            : address.match(/monitor\/(\S+)/)[1]
        );
      }
    });
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.monitor-content {
  height: 100%;
  width: 100%;
  min-width: 1200px;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: #eff2f9;
  display: flex;
}
.body-content-left {
  width: 340px !important;
  height: calc(100% - 10px) !important;
}
.body-content-right {
  width: calc(100% - 340px);
  height: calc(100% - 10px);
  overflow: hidden;
}
.show-location-content-type {
  width: 100% !important;
  height: 100% !important;
  margin-left: 0 !important;
}
</style>
