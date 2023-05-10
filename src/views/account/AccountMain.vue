<template>
  <section class="account-main">
    <!--超级管理员和经销商界面 start-->
    <div style="display:flex;height:100%;width:100%;flex-direction: row;">
      <div style="width: 458px;position:relative;">
        <!--我的工作台 start-->
        <div
          class="form-card2"
          style="padding: 1rem 2rem 2rem 2rem;border-radius:2rem"
        >
          <div class="card-header left-right-box">
            <span class="left-box">{{ $t("accountMain.myWorkPlatform") }}</span>
            <span class="right-box">
              <i
                class="iconfont icon-chart"
                @click="showChartPage"
                style="font-weight: normal;color:#0095ec"
              ></i>
            </span>
          </div>
          <div class="card-body">
            <div class="login-name">
              <p>
                <span style="font-weight:bold;padding-right:0.5rem"
                  >{{ $t("common.userName") }}:</span
                >
                {{ user.userName }}
              </p>
              <p>
                <span style="font-weight:bold;padding-right:0.5rem"
                  >{{ $t("accountMain.loginName") }}:</span
                >
                {{ user.loginNo }}
              </p>
            </div>
            <div class="btn-cont">
              <span class="btn-primary" @click="onUserOp('monitor')">{{
                $t("accountMain.monitor")
              }}</span>
              <span class="btn-primary" @click="onUserOp('edit')">{{
                $t("accountMain.edit")
              }}</span>
              <span class="btn-primary" @click="onUserOp('pwd')">{{
                $t("accountMain.editPwd")
              }}</span>
            </div>
            <div class="henggang"></div>
            <!--  -->
            <div class="login-message" style="margin-top:3rem">
              <p>{{ $t("accountMain.statistics") }}</p>
              <div class="login-user-message">
                <div>
                  <img src="@/assets/img/update-time.jpg" alt="" />
                  <span>{{ $t("common.updateTime") }}</span>
                  <span>{{ updateTime }}</span>
                </div>
                <div>
                  <img src="@/assets/img/expired.jpg" alt="" />
                  <span>{{ $t("accountMain.expiring") }}</span>
                  <span>{{ deviceStatistics.willExpireDeviceCount }}</span>
                </div>
                <div>
                  <img src="@/assets/img/offline.png" alt="" />
                  <span>{{ $t("accountMain.latestOffline") }}</span>
                  <span>{{ deviceStatistics.lastOfflineDeviceCount }}</span>
                </div>
                <div>
                  <img src="@/assets/img/stock.jpg" alt="" />
                  <span>{{ $t("accountMain.stock") }}</span>
                  <span>{{ deviceStatistics.deviceCount }}</span>
                </div>
                <div>
                  <img src="@/assets/img/store.jpg" alt="" />
                  <span>{{ $t("accountMain.storage") }}</span>
                  <span>{{ deviceStatistics.directDeviceCount }}</span>
                </div>
              </div>
            </div>

            <div class="btn-cont">
              <span class="btn-primary" @click="jumpPage('manage')">{{
                $t("accountMain.manage")
              }}</span>
              <span class="btn-primary" @click="jumpPage('expired')">{{
                $t("accountMain.expired")
              }}</span>
              <span class="btn-primary" @click="jumpPage('offline')">{{
                $t("accountMain.offline")
              }}</span>
              <span class="btn-primary" @click="jumpPage('statistics')">{{
                $t("accountMain.statistics")
              }}</span>
            </div>
          </div>
        </div>
        <!--我的工作台 end-->

        <!--我的服务商 start-->
        <div class="form-card12" :style="{ marginTop: browerMarginTop + 'px' }">
          <div class="card-header">
            {{ $t("accountMain.myServiceProvider") }}
          </div>
          <div class="card-body" style="margin-top:0">
            <!--  -->
            <table class="form-table" style="flex: 1;height:auto;">
              <tr>
                <td>{{ $t("accountMain.provider") }}:</td>
                <td>{{ superUser.userName }}</td>
              </tr>
              <tr>
                <td>{{ $t("common.linkman") }}:</td>
                <td>{{ superUser.linkman }}</td>
              </tr>
              <tr>
                <td>{{ $t("common.phone") }}:</td>
                <td>{{ superUser.tel }}</td>
              </tr>
              <tr>
                <td>{{ $t("common.address") }}:</td>
                <td>{{ superUser.addr }}</td>
              </tr>
            </table>
          </div>
        </div>
        <!--我的服务商 end-->
      </div>

      <div class="sale-cont-choose" v-if="rootUser.userTypeV2 == 2">
        <!--快速销售、批量销售 start-->
        <div
          class="form-card1"
          style="flex: none;max-height:calc(100% - 0.8rem);min-height:50%;padding-top:0;padding-bottom:0;height:100%"
        >
          <div class="card-header">
            <ul class="select-tabs">
              <li
                :class="[currentSale == 0 ? 'active' : '']"
                @click="currentSale = 0"
              >
                {{ $t("accountMain.quickSale") }}
              </li>
              <li
                :class="[currentSale == 1 ? 'active' : '']"
                @click="currentSale = 1"
              >
                {{ $t("accountMain.batchSale") }}
              </li>
            </ul>
          </div>
          <div class="card-body12" style="height:100%">
            <!-- <quick-sale v-show="currentSale == 0"></quick-sale>
            <batch-sale v-show="currentSale == 1" dname="account"></batch-sale> -->
          </div>
        </div>
        <!--快速销售、批量销售 end-->
      </div>
    </div>
    <!--超级管理员和经销商界面 end-->
    <!--
    <user-pwd-dialog></user-pwd-dialog>
    <statistic-dialog></statistic-dialog> -->
  </section>
</template>

<script>
// import BatchSale from "@/page/BatchSale";
// import QuickSale from "@/page/QuickSale";
// import UserPwdDialog from "@/page/UserPwdDialog";
// import StatisticDialog from "@/page/StatisticDialog";
// const BatchSale = (resolve) => require(["@/page/BatchSale.vue"], resolve);
// const QuickSale = (resolve) => require(["@/page/QuickSale.vue"], resolve);
// const UserPwdDialog = (resolve) => require(["@/page/UserPwdDialog.vue"], resolve);
// const StatisticDialog = (resolve) => require(["@/page/StatisticDialog.vue"], resolve);

export default {
  name: "AccountMain",
  components: {
    // "batch-sale": BatchSale,
    // "quick-sale": QuickSale,
    // "user-pwd-dialog": UserPwdDialog,
    // "statistic-dialog": StatisticDialog,
  },
  props: {},
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //登录用户信息

    superUser: {
      //服务商
      userName: "",
      linkman: "",
      tel: "",
      addr: ""
    },
    user: {
      //用户信息
      userName: "",
      loginNo: ""
    },
    deviceStatistics: {
      //设备统计
      willExpireDeviceCount: 0,
      deviceCount: 0,
      lastOfflineDeviceCount: 0,
      directDeviceCount: 0
    },
    updateTime: "13:20:12", //更新时间
    updateTimeStr: "",
    currentSale: 0, //0-快速销售    1-批量销售
    billInfo: {
      ordersId: "",
      cardTypeStr: "",
      shouldPay: 0,
      discount: 0,
      payWay: 2,
      note: "",
      orderTime: "",
      aliHtml: ""
    },
    isShowLoading: false,
    browerMarginTop: 60
  }),
  watch: {
    // updateTime() {
    //   if (window.localStorage.getItem("langType") != "zh") {
    //     if (this.isChinese(this.updateTime)) {
    //       this.updateTime = this.$t("accountMain.willupdataTime");
    //     }
    //   }
    // },
  },
  methods: {
    changeUpateTime() {
      if (window.localStorage.getItem("langType") != "zh") {
        if (this.isChinese(this.updateTime)) {
          this.updateTime = this.$t("accountMain.willupdataTime");
        }
      } else {
        this.updateTime = this.updateTimeStr;
      }
    },
    jumpPage(page) {
      //查看该用户设备
      if (page == "statistics") {
        //显示统计对话框
        this.app.$emit("show-statistic-dialog");
      } else {
        //跳转到对应的界面
        this.app.$emit("change-tab", 1);
        window.location.hash = "#/home/customer?tag=" + page;
      }
    },
    showChartPage() {
      //跳转到设备驾驶舱图表界面
      window.open(
        window.location.origin + window.location.pathname + "#/device-chart"
      );
    },

    onUserOp(tag) {
      //当前登录用户操作
      if (tag == "monitor") {
        //监控平台
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?userId=" +
            this.rootUser.userId
        );
      } else if (tag == "edit") {
        //用户详情
        this.app.$emit("show-user-dialog", {
          userId: this.rootUser.userId,
          userName: this.rootUser.userName
        });
      } else if (tag == "pwd") {
        //修改登录密码
        this.app.$emit("show-user-pwd-dialog", {
          userId: this.rootUser.userId
        });
      }
    },
    loadAccountMain() {
      //获取当前用户相关账号信息
      var that = this;
      this.get(this.API.accountMain, function(res) {
        if (res.errCode == "200") {
          that.superUser = res.data.superUser;
          that.user = res.data.user;
          that.updateTime = res.data.uSumUpdateTime;
          that.updateTimeStr = res.data.uSumUpdateTime;
          that.deviceStatistics = res.data.uSum;
        }
      });
    },
    listenEvent() {
      this.app.$on("change-lang-type", this.changeUpateTime);
      this.app.$on("close-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("change-lang-type", this.changeUpateTime);
      this.app.$off("close-dialog", this.closeDialog);
    },
    thebrowerFrom() {
      if (/(QQBrowser)/i.test(navigator.userAgent)) {
        // console.log("dadad");
        this.browerMarginTop = 50;
      }
      let is360 = this._mime(
        "type",
        "application/vnd.chromium.remoting-viewer"
      );
      if (this.isChrome && is360) {
        this.browerMarginTop = 20;
        // alert("nihao");
      }
    },
    isChrome() {
      //检测是否是谷歌内核(可排除360及谷歌以外的浏览器)
      var ua = navigator.userAgent.toLowerCase();
      return ua.indexOf("chrome") > 1;
    },
    _mime(option, value) {
      //测试mime
      var mimeTypes = navigator.mimeTypes;
      for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    this.thebrowerFrom();
    this.listenEvent();
    setTimeout(() => {
      this.loadAccountMain();
      this.changeUpateTime();
    }, 10);
  }
};
</script>

<style lang="scss" scoped>
.my-workdesk {
  tr {
    line-height: 2rem;
  }
}
.body-content {
  position: relative;
}
.btn-input {
  text-align: center;
  margin-top: 10px;
  .btn-cont {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: bold;
    padding: 5px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #533c0f;
    background-image: linear-gradient(#feda78, #f3b74b);
    box-shadow: 0 0.1rem 0 0 white, inset 0 0.1rem 0 rgba(255, 255, 255, 0.3);
  }
}
.permission {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  // width: 100%;
  padding: 0 1rem;
}
.login-user-message {
  div {
    img {
      width: 4rem;
      filter: contrast(190%);
    }
  }
}

@media screen and (max-height: 768px) {
  .form-card12 {
    margin-top: 0rem !important;
    padding: 5px 16px;
  }
}
</style>
