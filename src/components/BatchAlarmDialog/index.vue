<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('customer.batchAlarm')"
    :dialog-width="45"
    dialog-unit="rem"
    :icon-window="'icon-jingbao'"
  >
    <div class="batch-alarm">
      <span class="form-table-bg1">{{ $t("deviceDetail.alarmInfo") }}</span>
      <table class="form-table" style="width:100%;margin-top:10px">
        <!-- 报警设置 start -->
        <!-- 超速设置 start -->
        <tr>
          <td class="hover-box">
            {{ $t("deviceDetail.overSpeed") }}:
            <span class="orange-box">{{
              $t("deviceDetail.overSpeedTip")
            }}</span>
          </td>
          <td>
            <el-input style="width:8rem" v-model="overspeed" />
            <!-- <input type="checkbox"  class="text-input" v-model="overspeedRecursion"/>
            {{ $t("deviceDetail.applyTip") }} -->
          </td>

          <td>{{ $t("deviceDetail.overSpeedAlarm") }}:</td>
          <td>
            <el-checkbox v-model="isOverspeed">{{
              $t("deviceDetail.open")
            }}</el-checkbox>
            <!-- <input type="checkbox" v-model="isOverspeedRecursion" class="text-input" />
            {{ $t("deviceDetail.applyTip") }} -->
          </td>
        </tr>
        <!-- 超速设置 end -->
        <!-- 离线预警设置 start -->
        <tr>
          <td class="hover-box">
            {{ $t("deviceDetail.offlineAlarmTime") }}(h):
            <span class="orange-box">{{ $t("deviceDetail.offlineTip") }}</span>
          </td>
          <td>
            <el-input style="width: 8rem;" v-model="offlineLong" />
            <!-- <input type="checkbox" class="text-input" v-model="isOfflineLongRecursion"/>
            {{ $t("deviceDetail.applyTip") }} -->
          </td>

          <td>{{ $t("deviceDetail.offlineAlarm") }}:</td>
          <td>
            <el-checkbox v-model="isOffline">{{
              $t("deviceDetail.open")
            }}</el-checkbox>
            <!-- <input type="checkbox" class="text-input" v-model="isOfflineRecursion"/>
            {{ $t("deviceDetail.applyTip") }} -->
          </td>
        </tr>
        <!-- 离线预警设置 end -->
        <!-- 低电报警电量 start -->
        <tr>
          <td class="hover-box">
            {{ $t("deviceDetail.lowAlarmVolume") }}(%):
            <span class="orange-box">{{ $t("deviceDetail.lowPowerTip") }}</span>
          </td>
          <td>
            <el-input style="width: 8rem;" v-model="electricPercent" />
            <!-- <input type="checkbox" class="text-input" v-model="isElectricPercent"/>
            {{ $t("deviceDetail.applyTip") }} -->
          </td>

          <td>{{ $t("deviceDetail.lowPowerAlarm") }}:</td>
          <td>
            <el-checkbox v-model="lowElectric">{{
              $t("deviceDetail.open")
            }}</el-checkbox>
            <!-- <input type="checkbox" class="text-input" v-model="isLowElectricRecursion"/>
            {{ $t("deviceDetail.applyTip") }} -->
          </td>
        </tr>
        <!-- 低电报警电量 end -->
        <!-- 报警设置 end -->
      </table>

      <div class="btn-input" style="text-align:center;margin-top: 5px">
        <el-button type="warning" size="small" @click="batchReset">{{
          $t("common.reset1")
        }}</el-button>
        <el-button type="primary" size="small" @click="saveBatchDevice">{{
          $t("common.submit")
        }}</el-button>
      </div>
    </div>
  </dialog-comp>
</template>

<script>
// import API1 from "@/util/POSTGET.js";
export default {
  name: "BatchAlarmDialog",
  props: {},
  data: () => ({
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    isShow: false,
    devList: [],
    deviceImei: "",
    overspeed: "", //超速填写
    overspeedRecursion: true, //超速报警是否应用下级
    isOverspeed: "", //是否开启超速报警
    isOverspeedRecursion: true, //超速速度应用到下级
    offlineLong: "", //离线预警时间填写
    isOfflineLongRecursion: true, //离线时长应用到下级
    isOffline: "", //是否离线预警报警
    isOfflineRecursion: true, //离线报警是否应用下级
    electricPercent: "", //低电量设置填写
    isElectricPercent: true, //低电量到下级
    isLowElectricRecursion: true, //低电报警应用到下级
    lowElectric: "", //是否开启低电量报警到下级
    conStr: ""
  }),
  watch: {},
  methods: {
    saveBatchDevice() {
      var data = {
        deviceImei: "",
        model: "",
        name: "",
        plateNumber: "",
        linkman: "",
        tel: "",
        msisdn: "",
        icon: "",
        isRent: "",
        remark: "",
        deviceRemark: "",
        iccid: "",
        isObd: "",
        platformExpire: "",
        userExpire: "",
        warnClose: "",
        baseType: "",
        productType: "",
        refillType: "",
        isStation: "",
        isLock: "",
        userId: this.userId,
        offlineLong: this.offlineLong ? this.offlineLong : "-1", //离线预警时间填写
        overspeed: this.overspeed ? this.overspeed : "-1", //超速填写
        electricPercent: this.electricPercent ? this.electricPercent : "-1", //低电量设置填写
        // overspeedRecursion: this.overspeedRecursion,//超速应用到同下级所有
        overspeedRecursion: true,
        isOffline: this.isOffline ? "1" : "0",
        // isOfflineRecursion: this.isOfflineRecursion,//离线预警报警到所有
        isOfflineRecursion: true,
        // isOfflineLongRecursion: this.isOfflineLongRecursion,//离线预警到同下级所有
        isOfflineLongRecursion: true,
        isOverspeed: this.isOverspeed ? "1" : "0",
        // isOverspeedRecursion: this.isOverspeedRecursion,//超速报警应用到所有
        isOverspeedRecursion: true,
        lowElectric: this.lowElectric ? "1" : "0",
        // isLowElectricRecursion: this.isLowElectricRecursion,//低电电量报警到同下级所有
        isLowElectricRecursion: true,
        // isElectricPercent: this.isElectricPercent,//低电电量到所有
        isElectricPercent: true
      };
      data.autoDefense = "";
      // console.log(data);
      if (
        this.isOverspeed ||
        this.isOffline ||
        this.lowElectric ||
        this.overspeed ||
        this.offlineLong ||
        this.electricPercent
      ) {
        // 开启时数值不为空
        if (this.isOverspeed) {
          if (!this.overspeed) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("deviceDetail.overSpeedTip1")
            );
            return "";
          }
        }
        if (this.isOffline) {
          if (!this.offlineLong) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("deviceDetail.offlineLongTip")
            );
            return "";
          }
        }
        if (this.lowElectric) {
          if (!this.electricPercent) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("deviceDetail.lowEleTip1")
            );
            return "";
          }
        }
        this.conStr = this.$t("deviceDetail.batchDeviceTip");
        this.app.$emit("show-confirm-msg", this.conStr, () => {
          this.post(this.API.batchDeviceWarnPush, data, res => {
            if (res.errCode == "200") {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceDetail.saveSuccess1")
              );
              setTimeout(() => {
                this.isShow = false;
              }, 1000);
            } else {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceDetail.saveFail2")
              );
            }
          });
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("deviceDetail.nochange"));
      }
    },
    batchReset() {
      this.lowElectric = false;
      this.isOffline = false;
      this.isOverspeed = false;
      this.overspeed = "";
      this.offlineLong = "";
      this.electricPercent = "";
    },
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
    },
    showDialog(op) {
      this.isShow = true;
      this.uploadFile = "";
      this.isFile = false;
      this.deviceImei = "";
    },
    closeDialog() {
      this.isShow = false;
    },
    dealUserTree(userId) {
      // console.log(userId);
      this.userId = userId
        ? userId
        : JSON.parse(window.localStorage.getItem("carweb_user")).userId;
    },
    listenEvent() {
      this.app.$on("customer-userid1", this.dealUserTree);
      this.app.$on("show-batch-alarm-dialog", this.showDialog);
      this.app.$on("close-batch-alarm-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("customer-userid1", this.dealUserTree);
      this.app.$off("show-batch-alarm-dialog", this.showDialog);
      this.app.$off("close-batch-alarm-dialog", this.closeDialog);
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

<style lang="scss">
.batch-alarm {
  table.form-table > tr {
    white-space: nowrap;
    > td:nth-child(odd) {
      font-weight: normal;
    }
    > td.hover-box {
      cursor: pointer;
      font-weight: bold !important;
      position: relative;
    }
    > td.hover-box .orange-box {
      display: none;
      position: fixed;
      white-space: normal;
      width: 20rem;
      border-radius: 0.5rem;
      z-index: 2;
    }
    > td.hover-box:hover .orange-box {
      display: inline-block;

      top: unset !important;
      left: unset !important;
    }
    > td {
      overflow: unset !important;
    }
  }
  .form-table-bg1 {
    font-size: 16px;
    font-weight: bold;
    background: #cedeee;
    text-align: center;
    width: 100%;
    display: inline-block;
    padding: 2px 0;
  }
}
</style>
