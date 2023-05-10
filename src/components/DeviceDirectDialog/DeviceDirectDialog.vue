<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('common.direction')"
    :dialog-width="900"
    :iconWindow="'icon-ico_minglingxiafa_xuanzhong'"
  >
    <div class="direct-content">
      <div class="direct-left">
        <span class="title" style="padding-bottom: 10px; font-weight: bold">{{
          $t("common.basicfn")
        }}</span>
        <div class="direct-left-item">
          <el-row :gutter="20">
            <el-col
              :span="6"
              v-for="(item, index) in normalList.secList"
              :key="index"
            >
              <div class="direct-item" @click="showCommand(item)">
                <img
                  :src="require('@/assets/img/directimg/' + item.img + '.png')"
                  alt=""
                />
                <span>{{ item.text }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- end -->
        <span class="title" style="padding: 10px 0; font-weight: bold">{{
          $t("common.userdirect")
        }}</span>
        <!-- <span class="title">用户指令</span> -->
        <div class="direct-left-item">
          <!-- 指令模式start -->
          <el-row :gutter="20">
            <div class="special-device">
              <el-col :span="6" v-for="(it, ii) in cmdList" :key="ii">
                <div class="direct-item" @click="showCommand(it)">
                  <img
                    :src="require('@/assets/img/directimg/' + it.img + '.png')"
                    alt=""
                  />
                  <span>{{ it.text }}</span>
                </div>
              </el-col>
            </div>
          </el-row>
        </div>

        <span class="title" style="padding: 10px 0; font-weight: bold">{{
          $t("common.gongchengzhiling")
        }}</span>
        <div class="direct-left-item" style="padding: 10px 10px 20px 10px">
          <el-row :gutter="20">
            <el-col
              :span="6"
              v-for="(item, index) in normalCmdList.secList"
              :key="index"
            >
              <div class="direct-item" @click="showCommand(item)">
                <img
                  :src="require('@/assets/img/directimg/' + item.img + '.png')"
                  alt=""
                />
                <span>{{ item.text }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 右边的内容 -->
      <div class="direct-right" v-show="currentCmd.panelId != 'direct-record'">
        <div class="top-request">
          <div class="top-title">
            <div>
              <span v-if="currentCmd.panelId != 'manual'">
                {{ $t("deviceCommand.commandName") }}:
                <span style="font-weight: bold">{{ currentCmd.text }}</span>
              </span>
            </div>
            <div>
              <span v-if="currentCmd.panelId != 'manual'">
                {{ $t("common.deviceName") }}:
                <span style="font-weight: bold">{{ deviceImei }}</span>
              </span>
            </div>
          </div>
          <!-- 运动上报模式 -->
          <div class="right-item" v-show="currentCmdPanelId == 'play-report'">
            <div>
              <input
                type="text"
                v-model.number="staticTime"
                class="text-input small"
                style="width: 50px; text-align: center"
                min="30"
              />
            </div>
            <div>{{ $t("deviceCommand.staticReport") }}(M)</div>
          </div>
          <!-- 在线运动上报 -->
          <div class="right-item" v-show="currentCmdPanelId == 'realtime-mode'">
            <div>
              <span>{{ $t("deviceCommand.realTimeMode") }}:</span>>
              <input
                type="text"
                v-model.number="realtimeMode"
                class="text-input small"
                style="width: 50px; text-align: center"
                min="10"
              />
            </div>
            <div>{{ $t("deviceCommand.importTimeTip") }}</div>
          </div>
          <!-- 省电定时上报 -->
          <div
            class="right-item"
            v-show="currentCmdPanelId == 'circle-update1'"
          >
            <div>{{ $t("deviceCommand.timeRange") }}:</div>
            <div>
              <input
                type="number"
                v-model.number="circleUp.hour"
                class="text-input small"
                style="width: 30px"
                max="6"
                min="0"
              />
              {{ $t("deviceCommand.hour") }}
              <input
                type="number"
                v-model.number="circleUp.minute"
                class="text-input small"
                style="width: 30px"
                max="59"
                min="0"
              />
              {{ $t("deviceCommand.minute") }}
            </div>
            <div>{{ $t("deviceCommand.circleTip") }}</div>
          </div>
          <!-- 省电闹铃上报 -->
          <div class="right-item" v-show="currentCmdPanelId == 'timing-mode'">
            <div>
              <div>
                {{ $t("common.reporting") }}:<input
                  type="number"
                  v-model.number="daytime"
                  class="text-input small"
                  style="width: 50px"
                  max="30"
                  min="1"
                />{{ $t("deviceCommand.day") }}
              </div>
            </div>
            <div
              v-for="(item, idx) in workModeList"
              :key="'workModeList11' + idx"
            >
              <span>{{ $t("deviceCommand.timePoint") + (idx + 1) }}:</span>
              <span>
                <input
                  type="number"
                  v-model.number="workModeList[idx].hour"
                  class="text-input small"
                  style="width: 30px"
                  max="23"
                  min="0"
                />
                {{ $t("deviceCommand.hours") }}
                <input
                  type="number"
                  v-model.number="workModeList[idx].minute"
                  class="text-input small"
                  style="width: 30px"
                  max="59"
                  min="0"
                />
                {{ $t("deviceCommand.minutes") }}
                <input
                  type="checkbox"
                  class="text-input"
                  v-model="workModeList[idx].enable"
                />
                {{ $t("deviceCommand.use") }}
              </span>
            </div>
          </div>
          <!-- 周期上报 2021-12-23关掉-->
          <!-- <div class="right-item" v-show="currentCmdPanelId == 'circle-update'">
            <div>{{ $t("deviceCommand.timeRange") }}:</div>
            <div>
              <input type="number" v-model.number="circleUp.hour" class="text-input small" style="width: 30px" max="6" min="0" />
              {{ $t("deviceCommand.hour") }}
              <input type="number" v-model.number="circleUp.minute" class="text-input small" style="width: 30px" max="59" min="0" />
              {{ $t("deviceCommand.minute") }}
            </div>
            <div>{{ $t("deviceCommand.circleTip") }}</div>
          </div> -->
          <!-- 在线定时上报 2021-12-23-->
          <div class="right-item" v-show="currentCmdPanelId == 'timing-online'">
            <div>
              <span>{{ $t("deviceCommand.onlineTimeMode") }}:</span>>
              <input
                type="number"
                v-model.number="onlineTimeMode"
                class="text-input small"
                style="width: 30px"
              />
            </div>
            <div>{{ $t("deviceCommand.circleTip1") }}</div>
          </div>
          <!-- 定点查车 -->
          <div
            class="right-item"
            v-show="currentCmdPanelId == 'find-car-by-time'"
          >
            <div>
              {{ $t("deviceCommand.workMode") }}:
              <input type="radio" checked class="text-input" />
              {{ $t("deviceCommand.gpsMode") }}
            </div>
            <div
              v-for="(item, idx) in workModeList"
              :key="'workModeList11' + idx"
            >
              <span>{{ $t("deviceCommand.timePoint") + (idx + 1) }}:</span>
              <span>
                <input
                  type="number"
                  v-model.number="workModeList[idx].hour"
                  class="text-input small"
                  style="width: 30px"
                  max="23"
                  min="0"
                />
                {{ $t("deviceCommand.hours") }}
                <input
                  type="number"
                  v-model.number="workModeList[idx].minute"
                  class="text-input small"
                  style="width: 30px"
                  max="59"
                  min="0"
                />
                {{ $t("deviceCommand.minutes") }}
                <input
                  type="checkbox"
                  class="text-input"
                  v-model="workModeList[idx].enable"
                />
                {{ $t("deviceCommand.use") }}
              </span>
            </div>
          </div>
          <!-- sos上报 2021-12-29 -->
          <div class="right-item1" v-show="currentCmdPanelId == 'sos-send'">
            <div class="sos-acontent">
              <el-tabs v-model="activeName" @tab-click="changeTabs">
                <el-tab-pane label="SOS号码添加" name="first">
                  <!-- start -->
                  <!-- <span class="sos-title">添加号码</span> -->
                  <el-form label-width="30px">
                    <el-form-item prop="ParameterDataList">
                      <el-col :span="18">
                        <el-input
                          v-model="postForm.ParameterDataList[0]"
                          size="small"
                          placeholder="请填写"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          size="small"
                          type="info"
                          icon="el-icon-plus"
                          @click="addItem"
                          style="margin-left: 5px !important; padding: 8px 12px !important"
                          :disabled="isbtnSOS"
                        ></el-button>
                      </el-col>
                    </el-form-item>
                    <div
                      v-for="(item, index) in postForm.ParameterDataList"
                      :key="index"
                    >
                      <el-form-item v-if="index !== 0">
                        <el-col :span="18">
                          <el-input
                            size="small"
                            v-model="postForm.ParameterDataList[index]"
                            placeholder="请填写"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button
                            size="small"
                            type="info"
                            icon="el-icon-delete"
                            @click="deleteItem(item, index)"
                            style="margin-left: 5px !important; padding: 8px 12px !important"
                          ></el-button>
                        </el-col>
                      </el-form-item>
                    </div>
                  </el-form>
                  <!-- end -->
                </el-tab-pane>
                <el-tab-pane label="SOS号码删除" name="second">
                  <el-form label-width="30px">
                    <el-form-item prop="ParameterDataList">
                      <el-col :span="18">
                        <el-input
                          v-model="postForm.ParameterDataList[0]"
                          size="small"
                          placeholder="请填写"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          size="small"
                          type="info"
                          icon="el-icon-plus"
                          @click="addItem"
                          style="margin-left: 5px !important; padding: 8px 12px !important"
                          :disabled="isbtnSOS"
                        ></el-button>
                      </el-col>
                    </el-form-item>
                    <div
                      v-for="(item, index) in postForm.ParameterDataList"
                      :key="index"
                    >
                      <el-form-item v-if="index !== 0">
                        <el-col :span="18">
                          <el-input
                            size="small"
                            v-model="postForm.ParameterDataList[index]"
                            placeholder="请填写"
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button
                            size="small"
                            type="info"
                            icon="el-icon-delete"
                            @click="deleteItem(item, index)"
                            style="margin-left: 5px !important; padding: 8px 12px !important"
                          ></el-button>
                        </el-col>
                      </el-form-item>
                    </div>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
          <!-- sos上报 end -->
          <!-- 油电 -->
          <div class="right-item" v-show="currentCmdPanelId == 'defaultpw'">
            <div v-show="currentCmd.cmdContent != 'RESET'">
              <div>
                {{ $t("deviceCommand.confirmPwd") }}:
                <input
                  type="password"
                  class="text-input small"
                  v-model="cmdPwd"
                />
              </div>
            </div>
          </div>
          <!-- 版本查询 -->
          <div class="right-item" v-show="currentCmdPanelId == 'default'">
            <div v-show="currentCmd.img == 'zidingyizhiling'">
              {{ $t("deviceCommand.inputCommand") }}:
              <input type="text" class="text-input small" v-model="customCmd" />
            </div>
          </div>
          <!-- 按钮 -->
          <div class="btn-cont-cmd">
            <el-button
              type="primary"
              size="small"
              @click="doCommand"
              :disabled="currentCmd.panelId == 'alarm-set' ? true : false"
              >{{ $t("deviceCommand.send") }}</el-button
            >
          </div>
        </div>
        <!-- 返回的结果 -->
        <div class="main-response">
          <div class="right-box" style="height: 100%">
            <div style="line-height: 40px; border-bottom: dashed 1px gainsboro">
              {{ $t("deviceCommand.backInfo") }}
            </div>
            <div
              style="height: calc(100% - 40px); padding-left: 8px; overflow-x: hidden; overflow-y: auto"
            >
              <ul class="log-list" style="list-style: none; padding-left: 0">
                <li
                  v-for="(item, idx) in logList"
                  :style="{ color: item.isSend ? 'green' : 'red' }"
                  :key="'logList' + idx"
                >
                  <div class="left-right-box">
                    <span class="left-box1" v-if="item.isSend"
                      >SEND &gt;&gt;</span
                    >
                    <span v-else>RECV &lt;&lt;</span>
                    <span class="right-box">{{ item.utcTime }}</span>
                  </div>
                  <div
                    style="text-align: left; word-break: break-word; white-space: normal"
                  >
                    {{ item.cmdContent }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 设备记录 -->
      <div class="direct-right" v-show="currentCmd.panelId == 'direct-record'">
        <device-decord :imei="deviceImei"></device-decord>
      </div>
    </div>
    <dialog-comp
      :visible.sync="isShow1"
      :dialog-title="$t('accountMain.editPwd')"
      :dialog-width="400"
      :iconWindow="'icon-ico_minglingxiafa_xuanzhong'"
    >
      <div style="text-align: center; width: 100%; height: 100%">
        <!--修改当前用户密码-->
        <table style="margin: 8px auto" class="form-table">
          <tr>
            <td>
              <font class="require-icon">*</font>
              {{ $t("userPwd.oldPwd") }}:
            </td>
            <td>
              <el-input style="width: 180px" show-password v-model="oldPwd" />
            </td>
          </tr>
          <tr>
            <td>
              <font class="require-icon">*</font>
              {{ $t("userPwd.newPwd") }}:
            </td>
            <td>
              <el-input
                style="width: 180px"
                show-password
                v-model="newPwd"
                @change="checkPwd"
              />
            </td>
          </tr>
          <tr>
            <td>
              <font class="require-icon">*</font>
              {{ $t("userPwd.confirmPwd") }}:
            </td>
            <td>
              <el-input
                style="width: 180px"
                show-password
                v-model="newPwd1"
                @change="checkPwd"
              />
            </td>
          </tr>
          <tr v-if="pwdWarn">
            <td></td>
            <td style="font-size: 12px; color: red">
              {{ $t("userPwd.pwdTip") }}
            </td>
          </tr>
        </table>

        <div style="text-align: center; line-height: 40px">
          <el-button type="primary" @click="changePwd">{{
            $t("common.submit")
          }}</el-button>
        </div>
      </div>
    </dialog-comp>
  </dialog-comp>
</template>

<script>
import deviceDirectRecord from "@/components/DeviceDirectRecord/DeviceDirectRecord";
import { getDeviceDetail, sendDeviceCmd } from "@/api/common.js";
import { changeDevPwd, loadDeviceRecordInfo } from "@/api/monitor.js";
export default {
  components: {
    "device-decord": deviceDirectRecord
  },
  name: "deviceDirectDialog",
  data: () => ({
    postForm: {
      ParameterDataList: [""]
    },
    activeName: "first",
    deviceImei: "",
    isShow: false,
    deviceDetail: {},
    deviceModel: "",
    deviceNormalLx: "",
    cmdList: [], //操作命令
    normalCmdList: [],
    currentCmd: {},
    currentCmdPanelId: "",
    realtimeMode: 10,
    workModeList: [
      //工作模式时间点设置
      {
        hour: 0,
        minute: 0,
        enable: false
      },
      {
        hour: 0,
        minute: 0,
        enable: false
      },
      {
        hour: 0,
        minute: 0,
        enable: false
      },
      {
        hour: 0,
        minute: 0,
        enable: false
      },
      {
        hour: 0,
        minute: 0,
        enable: false
      }
    ],
    sendable: true, //命令是否可发送
    circleUp: {
      hour: 0,
      minute: 5
    }, //周期上报模式，
    cmdPwd: "", //设备密码验证
    customCmd: "", //自定义指令
    daytime: 1,
    logList: [], //返回日志信息
    normalList: [],
    recordList: [],
    pager: {
      name: "commandRecord",
      limit: 20,
      num: 1,
      current: 1
    },
    isDevicePwd: false, //判断设备的密码
    isShow1: false,
    oldPwd: "", //旧密码
    newPwd: "", //新密码
    newPwd1: "", //确认密码
    pwdWarn: false, //提示错误
    loginType: 4,
    onlineTimeMode: 1,
    isbtnSOS: false,
    staticTime: 30
  }),
  watch: {
    workModeList: {
      deep: true,
      handler() {
        for (var i = 0; i < this.workModeList.length; i++) {
          if (this.workModeList[i].minute > 60) {
            this.workModeList[i].hour = Math.floor(
              this.workModeList[i].minute / 60
            );
            this.workModeList[i].minute = this.workModeList[i].minute % 60;
          }
          if (
            this.workModeList[i].hour * 60 + this.workModeList[i].minute >
            60 * 24
          ) {
            this.workModeList[i].hour = 23;
            this.workModeList[i].minute = 59;
          }
        }
      }
    },
    "circleUp.minute"() {
      if (this.circleUp.minute > 60) {
        this.circleUp.hour = Math.floor(this.circleUp.minute / 60);
        this.circleUp.minute = this.circleUp.minute % 60;
      }
    },
    "circleUp.hour"() {
      if (this.circleUp.hour * 60 + this.circleUp.minute > 360) {
        this.circleUp.hour = 6;
        this.circleUp.minute = 0;
      }
    }
  },
  computed: {
    workModeList1() {
      var list = JSON.parse(JSON.stringify(this.workModeList));
      return list.slice(0, 3);
    }
  },
  methods: {
    changeTabs(idx) {
      // console.log(idx);
      this.postForm.ParameterDataList = [""];
      this.isbtnSOS = false;
    },
    addItem() {
      this.isbtnSOS = false;
      this.postForm.ParameterDataList.push("");
      if (this.postForm.ParameterDataList.length > 2) {
        this.isbtnSOS = true;
      } else {
        this.isbtnSOS = false;
      }
    },
    deleteItem(item, index) {
      this.postForm.ParameterDataList.splice(index, 1);
      this.isbtnSOS = false;
    },
    //更改密码
    changePwd() {
      if (!this.pwdWarn && this.oldPwd && this.newPwd1 && this.newPwd) {
        var data = {
          oldPwd: this.oldPwd,
          newPwd: this.newPwd1
        };
        data.deviceImei = this.deviceImei;
        //
        changeDevPwd(data).then(res => {
          if (res.errCode == "200") {
            this.app.$emit(
              "show-alert-msg",
              this.$t("userPwd.changePwdSuccess")
            );
            this.isShow1 = false;
            this.oldPwd = "";
            this.newPwd = "";
            this.newPwd1 = "";
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("userPwd.changePwdFail") + ":" + res.errMsg
            );
          }
        });
      }
    },
    checkPwd() {
      //检查密码输入是否一致
      if (
        this.newPwd != this.newPwd1 &&
        this.oldPwd &&
        this.newPwd1 &&
        this.newPwd
      ) {
        this.pwdWarn = true;
      } else {
        this.pwdWarn = false;
      }
    },
    checkDevPwd() {
      // console.log("1");
      // 检查设备的密码是否正确 改成同步请求
      //
      const data = {
        deviceImei: this.imei,
        password: this.cmdPwd
      };
      return checkDevicePwd(data);
    },
    doCommand() {
      // 获取要执行的指令
      if (!this.sendable) {
        return;
      }
      var cmd = "";
      switch (this.currentCmd.panelId) {
        case "position-type": //位置类型
          cmd = "POITYPE," + this.deviceImei;
          break;
        case "find-car-by-time": //定点查车
          var t = [];
          for (let i = 0; i < this.workModeList.length; i++) {
            if (this.workModeList[i].enable) {
              var h = this.workModeList[i].hour,
                m = this.workModeList[i].minute;
              t.push((h <= 9 ? "0" + h : "" + h) + (m <= 9 ? "0" + m : "" + m));
            }
          }
          if (t.length > 0) {
            cmd = "MODE,1" + t.join(",");
          } else {
            cmd = "MODE,1";
          }
          break;
        case "circle-update":
          {
            //省电定时上报
            let h = this.circleUp.hour;
            let m = this.circleUp.minute;
            if (m < 5 && h === 0) m = 5;
            if (m > 59) m = 59;
            if (h > 24) {
              h = 24;
              m = 0;
            }
            cmd = "MODE,3" + (h * 60 + m) + "M";
          }
          break;
        case "play-report": //省电运动上报
          // mode23是以时间点的形式传过去
          if (this.staticTime < 30 || this.staticTime > 1439) {
            this.app.$emit("show-alert-msg", "Out of the range");
            return;
          }
          cmd = "MODE,23," + this.staticTime;
          break;
        case "realtime-mode": //在线运动上报
          {
            if (this.realtimeMode < 10) {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceCommand.intervarTimeTip1")
              );
              this.realtimeMode = 10;
              return;
            }
            if (this.realtimeMode > 999) {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceCommand.intervarTimeTip2")
              );
              this.realtimeMode = 999;
              return;
            }
            cmd = "MODE,2," + this.realtimeMode;
          }
          break;
        case "timing-mode": //省电闹铃上报
          var t1 = [];
          for (let i = 0; i < this.workModeList.length; i++) {
            if (this.workModeList[i].enable) {
              var h1 = this.workModeList[i].hour,
                m1 = this.workModeList[i].minute,
                d = this.daytime;
              t1.push(
                (h1 <= 9 ? "0" + h1 : "" + h1) + (m1 <= 9 ? "0" + m1 : "" + m1)
              );
            }
          }
          if (t1.length > 0) {
            cmd = "MODE,1," + t1.join(",") + "," + d;
          } else {
            cmd = "MODE,1";
          }
          break;
        case "timing-online": //在线定时上报 2021-12-23
          {
            if (this.onlineTimeMode < 1) {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceCommand.intervarTimeTip1")
              );
              this.onlineTimeMode = 1;
              return;
            }
            if (this.onlineTimeMode > 999) {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceCommand.intervarTimeTip2")
              );
              this.onlineTimeMode = 999;
              return;
            }
            cmd = "MODE,2,0," + this.onlineTimeMode + "M";
          }
          break;
        case "circle-update1": //省电定时上报
          {
            let h = this.circleUp.hour;
            let m = this.circleUp.minute;
            if (m < 5 && h === 0) m = 5;
            if (m > 59) m = 59;
            if (h >= 24) {
              h = 24;
              m = 0;
            }
            cmd = "MODE,3," + (h * 60 + m) + "M";
          }
          break;
        case "default": //普通指令
          if (this.currentCmd.img == "zidingyizhiling") {
            cmd = this.customCmd;
          } else {
            cmd = this.currentCmd.cmdContent;
          }
          break;
        case "defaultpw": //需要密码验证的指令
          cmd = this.currentCmd.cmdContent;
          break;
        // case "manual": //自定义指令
        //   cmd = this.customCmd;
        //   break;
        case "sos-send": {
          //SOS上报
          let numarr = this.postForm.ParameterDataList.join(",");
          if (this.activeName == "first") {
            if (!numarr) {
              this.app.$emit(
                "show-alert-msg",
                this.$t("deviceCommand.deviceCommandTip")
              );
              return;
            }
            cmd = "SOS,A," + numarr;
          } else if (this.activeName == "second") {
            cmd = "SOS,D," + numarr;
          }
        }
      }
      // console.log(cmd);
      if (cmd) {
        this.sendCommand(cmd);
      } else {
        this.app.$emit(
          "show-alert-msg",
          this.$t("deviceCommand.deviceCommandTip")
        );
      }
    },
    async sendCommand(cmd) {
      //发送指令
      var that = this;
      var data = {
        deviceImei: this.deviceImei,
        cmdContent: cmd
      };
      if (
        this.currentCmd.panelId == "defaultpw" &&
        this.currentCmd.cmdContent != "RESET"
      ) {
        if (!this.cmdPwd) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceCommand.confirmDevicePwd")
          );
          return;
        }
        let flag = await this.checkDevPwd();
        if (flag.errCode == 200) {
          this.isDevicePwd = true;
        } else {
          this.isDevicePwd = false;
        }
        if (this.isDevicePwd) {
          data.password = this.cmdPwd;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceCommand.isDevicePwd")
          );
          return;
        }
      } else if (this.currentCmd.img == "zidingyizhiling") {
        data.isOfflineCmd = false;
      }
      that.logList.unshift({
        isSend: true,
        cmdContent: data.cmdContent,
        utcTime: new Date().format("yyyy-MM-dd hh:mm:ss")
      });
      that.sendable = false;
      // console.log(data);
      //
      sendDeviceCmd(data).then(res => {
        this.sendable = true;
        if (res.errCode == "200") {
          this.logList.unshift({
            isSend: false,
            cmdContent: res.data,
            utcTime: new Date().format("yyyy-MM-dd hh:mm:ss")
          });
        } else {
          this.logList.unshift({
            isSend: false,
            cmdContent: "fail:" + this.$t("deviceCommand.errTip"),
            utcTime: new Date().format("yyyy-MM-dd hh:mm:ss")
          });
        }
      });
    },
    showCommand(item) {
      this.currentCmdPanelId = "";
      // console.log(item);
      this.currentCmd = item;
      this.currentCmdPanelId = item.panelId;
      if (this.currentCmd.panelId == "alarm-set") {
        this.isShow1 = true;
      } else {
        this.isShow1 = false;
      }
      if (item.panelId == "direct-record") {
        this.app.$emit("load-device-record");
      }
    },
    showDialog(op) {
      this.currentCmd = "";
      // console.log(op);
      this.recordList = [];
      this.logList = [];
      if (!op.imei) {
        return;
      }
      this.isShow = true;
      this.deviceImei = op.imei;
      this.initCmdType(op.imei);
      this.loadDeviceRecord();
    },
    closeDialog() {
      this.currentCmdPanelId = "";
    },
    //加载设备指令记录
    loadDeviceRecord() {
      var that = this;
      var data = {
        deviceImei: this.deviceImei,
        page: this.pager.current,
        pageSize: this.pager.limit
      };
      //
      loadDeviceRecordInfo(data).then(res => {
        if (res.errCode == "200") {
          that.recordList = res.data.items;
          that.recordList.forEach(item => {
            // item.num = that.getOrderNumber(item.orderName);
            // item.number = that.getOrderStautsNumber(item.orderSts);
          });
          // that.pager.num = Math.ceil(res.data.itemCnt / that.pager.limit);
        }
      });
    },
    initCmdType(imei) {
      const lxcommand = JSON.parse(JSON.stringify(this.$t("LXdeivce.secList"))); //lx设备的离线指令
      const lxcommand1 = JSON.parse(
        JSON.stringify(this.$t("LXdeivce1.secList"))
      ); //k8系列的无线设备
      const lxcommand2 = JSON.parse(
        JSON.stringify(this.$t("LXdeivce2.secList"))
      ); //k8系列的有线设备
      const lxcommand3 = JSON.parse(
        JSON.stringify(this.$t("youdianDirect.secList"))
      ); //油电指令
      const lxcommand4 = JSON.parse(
        JSON.stringify(this.$t("normalDeiveDirect"))
      ); //普通设备指令
      const lxcommand5 = JSON.parse(
        JSON.stringify(this.$t("normalDirectList"))
      ); //普通设备指令
      const lxcommand6 = JSON.parse(
        JSON.stringify(this.$t("LXdeivce3.secList"))
      ); //fn202设备指令
      this.normalList = lxcommand5;
      this.normalCmdList = lxcommand4;
      getDeviceDetail({ deviceImei: imei }).then(res => {
        if (res.errCode == 200) {
          let data = res.data;
          for (let key in data) {
            if (
              data[key] === "" ||
              data[key] === undefined ||
              data[key] === "undefined" ||
              data[key] === null ||
              data[key] === "null"
            ) {
              data[key] = "";
            }
          }
          this.deviceDetail = data;
          this.deviceModel = data.model;
          //
          var commandList = [];
          const commandCtrl = [
            /ZT19W/,
            /E09W/,
            /DM09W/,
            /ZT09W/,
            /E19W/,
            /DM19W/,
            /A7W/,
            /K8/,
            /ZT02W/
          ];
          var tag = false;
          for (var i = 0; i < commandCtrl.length; i++) {
            let model = new RegExp(data.model);
            // let model = data.model;
            // console.log(model);
            if (commandCtrl[i].test(model)) {
              tag = true;
            }
          }
          // 判断集合的
          if (tag) {
            // 是k8系列的设备
            if (data.baseType == "0") {
              // 如果是有线
              commandList = [...lxcommand2, ...lxcommand3];
            } else {
              // 无线
              commandList = [...lxcommand1, ...lxcommand3];
            }
          } else if (data.baseType == "0" && data.model != "FN202") {
            // 普通的离线设备指令有线
            commandList = [...lxcommand2, ...lxcommand3];
          } else if (data.baseType == "1" && data.model != "FN202") {
            // 普通的离线设备指令无线
            commandList = [...lxcommand1, ...lxcommand3];
          } else if (data.model == "FN202") {
            // console.log(data.model);
            // fn202 在线定时 重启 SOS
            commandList = [...lxcommand6];
          } else {
            // commandList.push(lxcommand3);
            commandList = [...lxcommand3];
          }
          // else if (data.model.toUpperCase().indexOf("LX_") != -1) {
          //   // 普通的离线设备指令
          //   commandList = [...lxcommand, ...lxcommand3];
          // }

          commandList;

          this.cmdList = commandList;
        }
      });
    },
    listenEvent() {
      this.app.$on("show-device-direct-dialog", this.showDialog);
      this.app.$on("close-user-box", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-device-direct-dialog", this.showDialog);
      this.app.$off("close-user-box", this.closeDialog);
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
.btn-cont-cmd {
  text-align: center;
  margin-top: 10px;
}
.direct-content {
  display: flex;
  justify-content: space-between;
  height: 600px;
  padding: 10px;
  font-size: 12px;
  .direct-left {
    width: 500px;
    position: relative;
    // &::after {
    //   content: "";
    //   position: absolute;
    //   right: -10px;
    //   top: 0;
    //   width: 1px;
    //   height: 100%;
    //   background: #ddd;
    // }
  }
  .direct-right {
    padding: 10px;
    width: calc(100% - 530px);
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    background: #f2f2f2;
  }
  .right-item {
    // width: 280px;
    div {
      margin-bottom: 5px;
    }
  }
  .sos-acontent {
    margin-bottom: 0 !important;
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      font-size: 12px;
    }
    .el-form-item {
      margin-bottom: 0 !important;
    }
    .el-tabs__header {
      margin: 0 0 5px;
    }
    .sos-title {
      font-size: 12px;
      font-weight: 500;
      color: #303133;
    }
  }
  .direct-left-item {
    padding: 10px;
    background: #e6f7ff;
    span {
      text-align: center;
    }
  }
  .top-request {
    height: 266px;
    background: #fff;
    position: relative;
    padding: 5px 5px 0 5px;
    // text-align: center;
    .btn-cont-cmd {
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .main-response {
    margin-top: 10px;
    height: calc(100% - 290px);
    background: #fff;
    padding: 5px;
  }
  .direct-item {
    // background: #0066ff;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    height: 70px;
    img {
      display: inline-block;
      width: 40px;
    }
  }
  .title {
    display: inline-block;
  }
  .record-list-item {
    overflow: scroll;
    height: 100%;
  }
  .record-list {
    height: 100%;
    overflow: hidden;
  }
  .group-list {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
    background: #fff;
    padding: 8px;
    border-radius: 10px;
    margin: 5px;
    .item {
      display: flex;
      flex-direction: row;
      div:nth-of-type(2) {
        word-break: break-word;
        padding-left: 10px;
      }
      div:nth-of-type(1) {
        white-space: nowrap;
      }
    }
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .top-title {
    div {
      background: #f2f2f2;
      margin-bottom: 5px;
      padding: 5px;
    }
  }
  input.text-input.small,
  select.text-input.small {
    height: 22px !important;
    line-height: 22px !important;
  }
  .special-device {
    // height: 82px;
  }
}
</style>
