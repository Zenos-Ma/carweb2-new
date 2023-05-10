<template>
  <div class="dialog_body">
    <div class="orange-box" style="font-weight:bold;margin:4px 10px">
      {{ $t("warnList.alarmTip") }}
    </div>
    <div class="btn-warn">
      <div>
        <span>{{ $t("common.deviceImei") }}:</span>
        <span>{{ AlarmChangeDev }}</span>
      </div>
      <div style="margin-right:55px">
        <!-- <el-button type="primary" size="small" @click="selectAll('all')">{{ $t("alarm.selectAll") }}</el-button>
        <el-button type="warning" size="small" @click="selectAll">{{ $t("alarm.unselectAll") }}</el-button> -->
        <!-- <el-button type="primary" style="padding:6px 26px !important" size="small" @click="updateAlarmSwitch">{{ $t("common.save") }}</el-button> -->
      </div>
    </div>
    <div class="warn-list-selcet">
      <!-- 2021-11-5 start -->
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isOffline">{{
          $t("warnList.offlineAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isOverspeed">{{
          $t("deviceDetail.overSpeedAlarm")
        }}</el-checkbox>
        <el-input-number
          style="width: 6rem;margin-left:10px;height:26px !important;line-height:26px !important"
          v-model="overspeed"
          controls-position="right"
          size="small"
          :step="10"
          :min="10"
          :max="300"
        ></el-input-number>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.lowElectric">{{
          $t("deviceDetail.lowPowerAlarm")
        }}</el-checkbox>
        <el-input-number
          style="width: 6rem;margin-left:10px;height:26px !important;line-height:26px !important"
          v-model="electricPercent"
          controls-position="right"
          size="small"
          :step="10"
          :min="10"
          :max="100"
        ></el-input-number>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isWeakSignal">{{
          $t("warnList.weakSignal")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isAwake">{{
          $t("warnList.isAwake")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isParkingGuard">{{
          $t("warnList.isParkingGuard")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isCollisionAlarm">{{
          $t("warnList.collisionAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRolloverAlarm">{{
          $t("warnList.rolloverAlarm")
        }}</el-checkbox>
      </div>
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isDoorAlarm">{{ $t("warnList.onOffTheDoor") }}</el-checkbox>
      </div> -->
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isSignalRecover">{{
          $t("warnList.signalRecoveryAlarm")
        }}</el-checkbox>
      </div>
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRapidAccelerate">{{ $t("alarm.acceleration") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRapidDecelerate">{{ $t("warnList.decelerationAlarm") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRapidLeft">{{ $t("warnList.turnLeftAlarm") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRapidRight">{{ $t("warnList.turnRightAlarm") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isCarStop">{{ $t("warnList.isCarStop") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isCarRun">{{ $t("warnList.isCarRun") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRoadBumps">{{ $t("warnList.isRoadBumps") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isRoadNormal">{{ $t("warnList.isRoadNormal") }}</el-checkbox>
      </div> -->
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isLightSensitive">{{
          $t("warnList.PhotosensitivityAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isDeviceSwitch">{{
          $t("warnList.isDeviceSwitch")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isSosAlarm">{{
          $t("warnList.sosHelp")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isPowerFailure">{{
          $t("warnList.powerOffAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isVibrationAlarm">{{
          $t("warnList.shockAlarm")
        }}</el-checkbox>
      </div>
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isFlowExpiration">{{ $t("warnList.isFlowExpiration") }}</el-checkbox>
      </div> -->
      <!-- <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isPlatformExpires">{{ $t("warnList.isPlatformExpires") }}</el-checkbox>
      </div> -->
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isOutFence">{{
          $t("warnList.isOutFence")
        }}</el-checkbox>
      </div>

      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.warnClose">{{
          $t("warnList.warnClose")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isGuard">{{
          $t("warnList.isGuard")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.closeSosAlarm">{{
          $t("warnList.closeSosAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.blueToothError">{{
          $t("warnList.blueToothError")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.attendanceAlarm">{{
          $t("warnList.attendanceAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.inactivityAlarm">{{
          $t("warnList.inactivityAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.shieldAlarm">{{
          $t("warnList.shieldAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.btBreakdownAlarm">{{
          $t("warnList.btBreakdownAlarm")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.recoveryOilElectric">{{
          $t("warnList.recoveryOilElectric")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.recoveryBtConnect">{{
          $t("warnList.recoveryBtConnect")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.manualMove">{{
          $t("warnList.manualMove")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.runLocationError">{{
          $t("warnList.runLocationError")
        }}</el-checkbox>
      </div>
      <div class="item-type">
        <el-checkbox v-model="AlarmConfigurationList.isLock">{{
          $t("warnList.isLock")
        }}</el-checkbox>
      </div>
      <div class="item-type" style="white-space:nowrap">
        {{ $t("warnList.offlineLong") }}
        <el-input
          style="width:60px"
          size="small"
          v-model="offlineLong"
        ></el-input>
      </div>
      <!-- <div class="item-type"> -->
      <!-- {{ $t("warnList.overspeed") }} -->
      <!-- <el-input style="width: 10rem" size="small" v-model="overspeed"></el-input> -->
      <!-- <el-input-number style="width: 8rem" size="small" v-model="overspeed" controls-position="right" :step="10" :min="10" :max="300"></el-input-number> -->
      <!-- <span>公里/时</span> -->
      <!-- </div> -->
      <!-- <div class="item-type">
        {{ $t("warnList.electricPercent") }}
        <el-input style="width:10rem" size="small" v-model="electricPercent"></el-input>
      </div> -->
      <!-- end -->
    </div>
    <div class="btn-content-alarm" style="text-align: center;">
      <el-button
        type="primary"
        style="padding:6px 26px !important"
        size="small"
        @click="updateAlarmSwitch"
        >{{ $t("common.save") }}</el-button
      >
    </div>
  </div>
</template>

<script>
import { loadAlarmDevSwitch, updateAlarmDevSwitch } from "@/api/common.js";
export default {
  name: "DeviceAlarmSetting",
  data: () => ({
    AlarmConfigurationList: {
      isLock: 0,
      isOffline: 0,
      isOverspeed: 0,
      lowElectric: 0,
      isWeakSignal: 0,
      isAwake: 0,
      isParkingGuard: 0,
      isCollisionAlarm: 0,
      isRolloverAlarm: 0,
      // isDoorAlarm: 0,
      isSignalRecover: 0,
      // isRapidAccelerate: 0,
      // isRapidDecelerate: 0,
      // isRapidLeft: 0,
      // isRapidRight: 0,
      // isCarStop: 0,
      // isCarRun: 0,
      // isRoadBumps: 0,
      // isRoadNormal: 0,
      isLightSensitive: 0,
      isDeviceSwitch: 0,
      isSosAlarm: 0,
      isPowerFailure: 0,
      isVibrationAlarm: 0,
      // isFlowExpiration: 0,
      // isPlatformExpires: 0,
      isOutFence: 0,
      warnClose: 0, //关闭报警推送
      isGuard: 0, //守卫报警
      closeSosAlarm: 0, //取消sos报警
      blueToothError: 0, //蓝牙断连锁车报警
      attendanceAlarm: 0, //考勤打卡
      inactivityAlarm: 0, //静止报警
      shieldAlarm: 0, //干扰屏蔽锁车报警
      btBreakdownAlarm: 0, //蓝牙连接异常
      recoveryOilElectric: 0, //油电恢复报警
      recoveryBtConnect: 0, //蓝牙连接恢复
      manualMove: 0, //推车报警
      runLocationError: 0 //行车定位异常报警
    },
    electricPercent: 10, //电量百分比
    overspeed: 100, //超速度报警
    offlineLong: 0, //离线推送间隔时间
    originAlarmList: {},
    AlarmChangeDev: ""
  }),
  methods: {
    selectAll(tag) {
      // 报警类型筛选
      // console.log(tag);
      if (tag == "all") {
        for (let key in this.AlarmConfigurationList) {
          this.AlarmConfigurationList[key] = true;
        }
      } else {
        for (let key in this.AlarmConfigurationList) {
          this.AlarmConfigurationList[key] = false;
        }
        this.loadAlarmSwitch(this.AlarmChangeDev);
      }
    },
    //处理设备详情对话框操作
    dealDevDetail(imei) {
      this.AlarmChangeDev = imei;
      this.loadAlarmSwitch(imei);
    },
    loadAlarmSwitch(imei) {
      loadAlarmDevSwitch({ deviceImei: imei }).then(res => {
        if (res.errCode == 200) {
          this.originAlarmList = JSON.stringify(res.data);
          for (let key in this.AlarmConfigurationList) {
            this.AlarmConfigurationList[key] = res.data[key];
          }
          for (let key in this.AlarmConfigurationList) {
            if (this.AlarmConfigurationList[key] == 1) {
              this.AlarmConfigurationList[key] = true;
            } else {
              this.AlarmConfigurationList[key] = false;
            }
          }
          this.electricPercent = res.data.electricPercent;
          this.offlineLong = res.data.offlineLong;
          this.overspeed = res.data.overspeed;
        }
      });
    },
    updateAlarmSwitch() {
      // 保存报警设置
      var data = {
        isOffline: this.AlarmConfigurationList.isOffline ? 1 : 0,
        isOverspeed: this.AlarmConfigurationList.isOverspeed ? 1 : 0,
        lowElectric: this.AlarmConfigurationList.lowElectric ? 1 : 0,
        isWeakSignal: this.AlarmConfigurationList.isWeakSignal ? 1 : 0,
        isAwake: this.AlarmConfigurationList.isAwake ? 1 : 0,
        isParkingGuard: this.AlarmConfigurationList.isParkingGuard ? 1 : 0,
        isCollisionAlarm: this.AlarmConfigurationList.isCollisionAlarm ? 1 : 0,
        isRolloverAlarm: this.AlarmConfigurationList.isRolloverAlarm ? 1 : 0,
        // isDoorAlarm: this.AlarmConfigurationList.isDoorAlarm ? 1 : 0,
        isSignalRecover: this.AlarmConfigurationList.isSignalRecover ? 1 : 0,
        // isRapidAccelerate: this.AlarmConfigurationList.isRapidAccelerate ? 1 : 0,
        // isRapidDecelerate: this.AlarmConfigurationList.isRapidDecelerate ? 1 : 0,
        // isRapidLeft: this.AlarmConfigurationList.isRapidLeft ? 1 : 0,
        // isRapidRight: this.AlarmConfigurationList.isRapidRight ? 1 : 0,
        // isCarStop: this.AlarmConfigurationList.isCarStop ? 1 : 0,
        // isCarRun: this.AlarmConfigurationList.isCarRun ? 1 : 0,
        // isRoadBumps: this.AlarmConfigurationList.isRoadBumps ? 1 : 0,
        // isRoadNormal: this.AlarmConfigurationList.isRoadNormal ? 1 : 0,
        isLightSensitive: this.AlarmConfigurationList.isLightSensitive ? 1 : 0,
        isDeviceSwitch: this.AlarmConfigurationList.isDeviceSwitch ? 1 : 0,
        isSosAlarm: this.AlarmConfigurationList.isSosAlarm ? 1 : 0,
        isPowerFailure: this.AlarmConfigurationList.isPowerFailure ? 1 : 0,
        isVibrationAlarm: this.AlarmConfigurationList.isVibrationAlarm ? 1 : 0,
        isFlowExpiration: 1,
        isPlatformExpires: 1,
        isOutFence: this.AlarmConfigurationList.isOutFence ? 1 : 0,
        offlineLong: Number(this.offlineLong) ? Number(this.offlineLong) : 0,
        overspeed: this.overspeed ? this.overspeed : 0,
        electricPercent: this.electricPercent
          ? this.electricPercent + ".0"
          : 0.0,
        warnClose: this.AlarmConfigurationList.warnClose ? 1 : 0,
        isGuard: this.AlarmConfigurationList.isGuard ? 1 : 0,
        closeSosAlarm: this.AlarmConfigurationList.closeSosAlarm ? 1 : 0,
        blueToothError: this.AlarmConfigurationList.blueToothError ? 1 : 0,
        attendanceAlarm: this.AlarmConfigurationList.attendanceAlarm ? 1 : 0,
        inactivityAlarm: this.AlarmConfigurationList.inactivityAlarm ? 1 : 0,
        shieldAlarm: this.AlarmConfigurationList.shieldAlarm ? 1 : 0,
        btBreakdownAlarm: this.AlarmConfigurationList.btBreakdownAlarm ? 1 : 0,
        recoveryBtConnect: this.AlarmConfigurationList.recoveryBtConnect
          ? 1
          : 0,
        manualMove: this.AlarmConfigurationList.manualMove ? 1 : 0,
        runLocationError: this.AlarmConfigurationList.runLocationError ? 1 : 0,
        recoveryOilElectric: this.AlarmConfigurationList.recoveryOilElectric
          ? 1
          : 0,
        isLock: this.AlarmConfigurationList.isLock ? 1 : 0
      };
      if (this.originAlarmList == JSON.stringify(data)) {
        this.app.$emit("show-alert-msg", this.$t("warnList.isNochange"));
        return;
      }
      data.deviceImei = this.AlarmChangeDev;
      // data.deviceImei = "357784086300553";
      updateAlarmDevSwitch(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("warnList.isAlarmChangeTip")
          );
          // this.isTypeAlarm = false;
          this.loadAlarmSwitch(this.AlarmChangeDev);
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("warnList.AlarmChangeFailTip")
          );
        }
      });
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDetail);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDetail);
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
.dialog_body {
  .warn-list-selcet {
    // width: 100%;
    padding: 10px;
    .item-type {
      width: 32%;
      display: inline-block;
      line-height: 30px;
      font-size: 15px;
      color: #606266;
      // background: #ccc;
      input {
        vertical-align: middle;
        // width: 14px;
        // height: 14px;
      }
      span {
        vertical-align: middle;
        font-size: 14px;
      }
    }
  }
  .btn-warn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
    padding: 0 10px;
  }

  .el-input-number__increase .el-icon-arrow-up:before,
  .el-input__suffix-inner .el-icon-arrow-up:before {
    content: "\E78F";
  }
  .el-input-number__decrease .el-icon-arrow-down:before {
    content: "\E790";
  }
  .el-input-number--small .el-input-number__decrease,
  .el-input-number--small .el-input-number__increase {
    width: 20px;
    border: none !important;
    background: none;
  }
  .el-input--small .el-input__inner {
    height: 26px !important;
    line-height: 26px !important;
  }
}
</style>
