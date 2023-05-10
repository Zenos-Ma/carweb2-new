<template>
  <div class="phone-notify-setting">
    <!-- <div class="orange-box">
      设备电话报警通知设置
    </div> -->
    <h3 style="padding:0 10px">
      {{ $t("common.deviceImei") }}:{{ deviceImei }}
    </h3>
    <div class="phone-setting-content">
      <el-tabs type="card" v-model="activeName" @tab-click="changeTabs">
        <el-tab-pane :label="$t('phoneNotify.notifySetting')" name="first">
          <el-form label-width="160px">
            <el-form-item :label="$t('common.deviceImei')">
              <!-- <el-input v-model="deviceNotifyDetail.deviceImei" size="small" style="width:180px" :disabled="true"></el-input> -->
              <span>{{ deviceNotifyDetail.deviceImei }}</span>
            </el-form-item>
            <el-form-item
              :label="$t('phoneNotify.surplusNotify')"
              v-show="deviceType != '1' || rootUser.userId == 1"
            >
              <el-input
                v-model="notifyCount"
                size="small"
                style="width:180px"
                :disabled="rootUser.userId != 1"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('phoneNotify.serviceWorker')"
              v-show="deviceType == '1' || rootUser.userId == 1"
            >
              <!-- <el-input v-model="deviceNotifyDetail.deviceImei"></el-input> -->
              <el-date-picker
                v-model="devExpireDate"
                format="yyyy-MM-dd"
                type="date"
                :disabled="rootUser.userId != 1"
                size="small"
                style="width:180px"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('phoneNotify.notifyPhone')">
              <!-- <span v-show="deviceNotifyDetail.telNo">{{ deviceNotifyDetail.telNo }}</span> -->
              <a
                :title="$t('car.update')"
                style="border-bottom: 1px solid;cursor: pointer;"
                v-show="deviceNotifyDetail.telNo"
                @click="showBandPhone"
                >{{ deviceNotifyDetail.telNo }}</a
              >
              <span v-show="!deviceNotifyDetail.telNo">
                <a class="go-bangding" @click="showBandPhone">{{
                  $t("phoneNotify.goBangPhone")
                }}</a>
              </span>
              <!-- <el-button v-show="deviceNotifyDetail.telNo" plain type="success" size="small" style="margin-left: 5px;" @click="showBandPhone">{{ $t("car.update") }}</el-button> -->
            </el-form-item>
            <!-- <el-form-item label="通知电话2">
              <el-input v-model="deviceNotifyDetail.telNo2" size="small" style="width:180px"></el-input>
            </el-form-item> -->
            <el-form-item
              :label="$t('phoneNotify.sendStatus')"
              v-show="rootUser.userId == 1"
            >
              <el-checkbox
                v-model="deviceNotifyDetail.status"
                true-label="1"
                false-label="0"
                :disabled="rootUser.userId != 1"
              ></el-checkbox>
              <el-tag type="danger" v-if="deviceNotifyDetail.status == '0'">{{
                $t("phoneNotify.yuYinServerOver")
              }}</el-tag>
              <el-tag type="success" v-if="deviceNotifyDetail.status == '1'">{{
                $t("phoneNotify.yuYinServerNormal")
              }}</el-tag>
            </el-form-item>
            <el-form-item
              :label="$t('phoneNotify.sendStatus')"
              v-show="rootUser.userId != 1"
            >
              <el-tag type="success" v-if="deviceNotifyDetail.status == '1'">{{
                $t("phoneNotify.yuYinServerNormal")
              }}</el-tag>
              <el-tag type="danger" v-if="deviceNotifyDetail.status == '0'">{{
                $t("phoneNotify.yuYinServerOver")
              }}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('phoneNotify.telSwitch')">
              <el-checkbox
                v-model="deviceNotifyDetail.telSwitch"
                true-label="1"
                false-label="0"
              ></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('phoneNotify.smsSwitch')">
              <el-checkbox
                v-model="deviceNotifyDetail.smsSwitch"
                true-label="1"
                false-label="0"
              ></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('phoneNotify.appSwitch')">
              <el-checkbox
                v-model="deviceNotifyDetail.appSwitch"
                true-label="1"
                false-label="0"
              ></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('phoneNotify.weChatSwitch')">
              <el-checkbox
                v-model="deviceNotifyDetail.weChatSwitch"
                true-label="1"
                false-label="0"
              ></el-checkbox>
            </el-form-item>
          </el-form>
          <div class="btn-cont-right">
            <el-button
              type="primary"
              size="small"
              @click="updatePhoneNotifyDetail"
              >{{ $t("common.save") }}</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('phoneNotify.phoneSwitchSetting')"
          name="second"
        >
          <div class="warn-list-selcet">
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.offline" true-label="1" false-label="0">{{ $t("warnList.offlineLong") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.overspeed" true-label="1" false-label="0">{{ $t("warnList.overspeed") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.lowElectric" true-label="1" false-label="0">{{ $t("warnList.lowEleTip2") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.weakSignal" true-label="1" false-label="0">{{ $t("warnList.weakSignal") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.collisionAlarm" true-label="1" false-label="0">{{ $t("warnList.collisionAlarm") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.rolloverAlarm" true-label="1" false-label="0">{{ $t("warnList.rolloverAlarm") }}</el-checkbox>
            </div> -->
            <!-- <div class="item-type">
              <el-checkbox v-model="deviceSwitchDetail.signalRecover" true-label="1" false-label="0">{{ $t("warnList.signalRecoveryAlarm") }}</el-checkbox>
            </div> -->
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.lightSensitive"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.PhotosensitivityAlarm") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.sosAlarm"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.sosHelp") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.powerFailure"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.powerOffAlarm") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.vibrationAlarm"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.shockAlarm") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.flowExpiration"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.isFlowExpiration") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.platformExpires"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.isPlatformExpires") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.outFence"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.isOutFence") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.shieldAlarm"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.shieldAlarm") }}</el-checkbox
              >
            </div>
            <div class="item-type">
              <el-checkbox
                v-model="deviceSwitchDetail.offline"
                true-label="1"
                false-label="0"
                >{{ $t("warnList.offlineAlarm") }}</el-checkbox
              >
            </div>
            <div class="btn-cont-right1">
              <div class="btn-cont1-left" v-if="!deviceNotifyDetail.telNo">
                {{ $t("phoneNotify.noBangPhone") }},<a
                  class="go-bangding"
                  @click="showBandPhone"
                  >{{ $t("phoneNotify.goBangPhone") }}</a
                >
              </div>
              <div class="btn-cont1-left" v-if="deviceNotifyDetail.telNo">
                {{ $t("phoneNotify.yibangdingPhone") }}
                <a
                  :title="$t('car.update')"
                  style="border-bottom: 1px solid;cursor: pointer;"
                  v-show="deviceNotifyDetail.telNo"
                  @click="showBandPhone"
                  >{{ deviceNotifyDetail.telNo }}</a
                >
              </div>
              <div class="btn-cont2-right">
                <el-button
                  @click="updateDeviceSwitch"
                  size="small"
                  type="primary"
                  >{{ $t("common.save") }}</el-button
                >
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('phoneNotify.batchXiuGaiBaoJingTongZhi')"
          name="third"
          v-if="rootUser.userId == 1 || rootUser.userId == 2702"
        >
          <div class="batch-phone-alert">
            <!-- <div class="orange-box">
              <div v-html="$t('batchTransfer.downloadTip2')"></div>
              <div>
                <font style="color: red;font-weight: bold;">{{ $t("common.template") }}</font>
                <a class="btn-white" style="margin-left: 0.8rem;" :href="API.batchInitFile">{{ $t("common.download") }}</a>
              </div>
            </div>
            <div>
              <file-upload accept="application/vnd.ms-excel" @select-file="onUploadFile"></file-upload>
            </div> -->
            <el-form label-width="160px">
              <el-form-item label="IMEI设备号">
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="一行一个设备"
                  style="width:180px"
                  v-model="deviceImeis"
                  clearable
                ></el-input
                ><br />
                <span style="font-size: 14px;color: #606266;"
                  >最多可操作50条</span
                >
              </el-form-item>
              <el-form-item label="推送状态">
                <el-checkbox
                  v-model="status1"
                  true-label="1"
                  false-label="0"
                ></el-checkbox>
              </el-form-item>
              <el-form-item label="报警通知数">
                <el-input
                  size="small"
                  style="width:180px"
                  v-model="notifyCount1"
                ></el-input>
              </el-form-item>
              <el-form-item label="到期时间">
                <el-date-picker
                  v-model="expireDate1"
                  format="yyyy-MM-dd"
                  type="date"
                  size="small"
                  style="width:180px"
                ></el-date-picker>
              </el-form-item>
            </el-form>
            <div class="btn-cont-right">
              <el-button @click="batchSave" type="primary" size="small">{{
                $t("common.save")
              }}</el-button>
            </div>
          </div>
          <!-- <div v-show="rootUser.userId != 1" style="text-align: center;">
            暂无权限修改
          </div> -->
        </el-tab-pane>
        <el-tab-pane
          :label="$t('phoneNotify.batchTongBuPlatformTime')"
          name="fourth"
          v-if="rootUser.userId == 1 || rootUser.userId == 2702"
        >
          <div class="batch-plat-expiretime">
            <div class="orange-box">
              <div v-html="$t('batchTransfer.downloadTip')"></div>
              <div>
                <font style="color: red;font-weight: bold;">{{
                  $t("common.template")
                }}</font>
                <a
                  class="btn-white"
                  style="margin-left: 0.8rem;"
                  :href="API.batchCmdFile"
                  >{{ $t("common.download") }}</a
                >
              </div>
            </div>
            <div style="height:35px">
              <file-upload
                accept="application/vnd.ms-excel"
                @select-file="onUploadFile1"
              ></file-upload>
            </div>
            <!-- 下面的表格 -->
            <div class="left-right-box" style="line-height:32px">
              <div class="left-box">
                <span style="font-weight: bold; color: gray;margin-left:16px">{{
                  $t("common.deviceList")
                }}</span>
                <span style="margin-left:16px;margin-right:0.8rem"
                  >{{ $t("batchTransfer.devNum") }}:</span
                >
                {{ upLoadDeviceList.length }}
              </div>
              <div class="right-box">
                <el-button type="warning" size="small" @click="resetList">{{
                  $t("common.reset")
                }}</el-button>
                <el-button type="primary" size="small" @click="doAllTongBu">{{
                  $t("batchCommandDialog.runCmd")
                }}</el-button>
              </div>
            </div>
            <!-- 指令执行清单 -->
            <div style="height:calc(100% - 240px)">
              <data-table :table-data="upLoadDeviceList" :is-num="true">
                <template slot="data-table-head">
                  <th style="width:130px">{{ $t("common.deviceImei") }}</th>
                  <th style="width:180px">
                    {{ $t("infobox.platExpireTip1") }}
                  </th>
                  <th style="width:180px">
                    {{ $t("phoneNotify.serverExpire") }}
                  </th>
                  <th style="width:100px">{{ $t("common.operation") }}</th>
                </template>
                <template slot="data-table-content">
                  <data-table-row
                    v-for="(item, idx) in upLoadDeviceList"
                    :key="idx"
                    :idx="idx"
                    :item="item"
                  >
                    <td style="width:130px">{{ item.deviceImei }}</td>
                    <td style="width:180px">{{ item.platformExpire }}</td>
                    <td style="width:180px">{{ item.expireDate }}</td>
                    <td style="width:100px">
                      <a @click="delDeviceList(idx)">{{
                        $t("common.delete")
                      }}</a>
                      <a
                        v-show="item.expireDate != item.platformExpire"
                        @click="doTongbuTime(item)"
                        >同步</a
                      >
                    </td>
                  </data-table-row>
                </template>
              </data-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <dialog-comp
      :visible.sync="isShow"
      :dialog-title="$t('common.phone1')"
      :dialog-width="500"
      :dialog-height="500"
    >
      <div class="add-phone-content">
        <div class="add-top">
          <div class="add-left">
            {{ $t("phoneNotify.verifyPhone") }}
          </div>
          <div class="add-right">
            <el-button
              class="btn-primary-button"
              size="small"
              @click="isShowBox = true"
            >
              {{ $t("phoneNotify.batchBang") }}
            </el-button>
            <device-choose
              :is-show-box.sync="isShowBox"
              @select-result="dealUserItem"
            ></device-choose>
          </div>
        </div>
        <el-form label-width="120px">
          <el-form-item :label="$t('withdraw.phone')">
            <el-input
              size="small"
              v-model="phoneNum"
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('phoneNotify.phoneVerCode')">
            <el-input
              size="small"
              v-model="verCode"
              style="width:200px"
            ></el-input>
            <el-button
              size="small"
              type="primary"
              style="padding: 9px 12px !important;"
              @click="getPhoneCode"
              :disabled="!isSendAble"
              >{{
                isSendAble
                  ? $t("card.vertifyCode")
                  : refreshTime + $t("card.resendCode")
              }}</el-button
            >
          </el-form-item>
        </el-form>
        <div class="btn-content" style="text-align: right;">
          <el-button size="small" type="danger" @click="doResetDeviceList">{{
            $t("common.reset")
          }}</el-button>
          <el-button size="small" type="primary" @click="doBatchBondTel">{{
            $t("phoneNotify.bangding")
          }}</el-button>
        </div>
        <div style="height: 280px;overflow-x: auto; overflow-y: hidden;">
          <data-table :data="deviceList" :show-index="true" :show-page="false">
            <!--  -->
            <el-table-column
              :label="$t('batchTransfer.device')"
              width="130px"
              prop="deviceImei"
            ></el-table-column>
            <el-table-column
              :label="$t('common.deviceName')"
              style="flex:1"
              prop="name"
            ></el-table-column>
            <el-table-column :label="$t('common.operation')" width="100px">
              <template slot-scope="props">
                <a @click="delSingalDev(props.$index)">{{
                  $t("common.delete")
                }}</a>
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import DeviceChooseBox from "@/components/DeviceChooseBox";
import FileUpload from "@/components/FileUpload";
import ExportUtil from "@/utils/exportUtil.js";
import {
  updateAlertNotifyInfo,
  queryPhoneAlertSwitch,
  queryDeviceAlertNotify,
  loadPhoneNotify,
  batchSavePhoneAlertNotify,
  singelTelBond,
  batchTelBond,
  sendPhoneCode,
  getDeviceDetail,
  updatePhoneAlertSwitch
} from "@/api/common";
export default {
  name: "PhoneNotifyAlertSetting",
  components: {
    "device-choose": DeviceChooseBox,
    "file-upload": FileUpload
  },
  data: () => ({
    activeName: "first",
    deviceImei: "",
    deviceNotifyDetail: {
      weChatSwitch: "",
      deviceImei: "",
      telNo: "",
      // telNo2: "",
      telSwitch: "",
      smsSwitch: "",
      appSwitch: "",
      status: "0"
    },
    devExpireDate: new Date(),
    // expireDate1: new Date(),
    expireDate1: new Date(
      new Date().getTime() + 1 * 365 * 24 * 3600 * 1000
    ).format("yyyy-MM-dd"),
    notifyCount1: 200,
    status1: "1",
    deviceImeis: "",
    notifyCount: 0,
    deviceSwitchDetail: {
      offline: "",
      overspeed: "",
      lowElectric: "",
      weakSignal: "",
      collisionAlarm: "",
      rolloverAlarm: "",
      signalRecover: "",
      lightSensitive: "",
      sosAlarm: "",
      powerFailure: "",
      vibrationAlarm: "",
      flowExpiration: "",
      platformExpires: "",
      outFence: "",
      shieldAlarm: ""
    },
    phoneNum: "",
    verCode: "",
    isShow: false,
    deviceList: [],

    isShowBox: false,
    refreshTime: 59,
    isSendAble: true,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    deviceType: "0",
    upLoadDeviceList: [],
    platTimeDevList: [],
    serverTimeList: []
  }),
  methods: {
    delDeviceList(idx) {
      // 删除某一项
      this.upLoadDeviceList.splice(idx, 1);
    },
    doAllTongBu() {
      console.log("zhixing");
      // 同步所有的设备的服务到期时间
      if (this.upLoadDeviceList.length == 0) {
        this.app.$emit("show-alert-msg", this.$t("phoneNotify.tongbudaoqiTip"));
        return;
      }
      this.app.$emit(
        "show-confirm-msg",
        this.$t("phoneNotify.tongbuallTip"),
        () => {
          for (let i = 0; i < this.upLoadDeviceList.length; i++) {
            this.doTongbuTime(this.upLoadDeviceList[i]);
          }
        }
      );
    },
    doTongbuTime(item) {
      // 同步某一项的时间
      // console.log("item", item);
      let data = {};
      for (let i = 0; i < this.serverTimeList.length; i++) {
        if (item.deviceImei == this.serverTimeList[i].deviceImei) {
          data = {
            deviceImei: this.serverTimeList[i].deviceImei,
            weChatSwitch: this.serverTimeList[i].weChatSwitch,
            appSwitch: this.serverTimeList[i].appSwitch,
            smsSwitch: this.serverTimeList[i].smsSwitch,
            telSwitch: this.serverTimeList[i].telSwitch,
            notifyCount: this.serverTimeList[i].notifyCount,
            // expireTime: this.serverTimeList[i].expireDate.time,
            expireTime: new Date(item.platformExpire).getTime(),
            telNo: this.serverTimeList[i].telNo,
            status: this.serverTimeList[i].status
          };
        }
      }
      // console.log(data);
      // return;
      // this.app.$emit("show-confirm-msg", "是否同步当前设备的平台到期时间", () => {
      updateAlertNotifyInfo(data).then(res => {
        if (res.errCode == 200) {
          this.updateDeviceListTime(item);
          this.app.$emit("show-alert-msg", "平台到期和服务时间同步成功");
        } else {
          this.app.$emit("show-alert-msg", "平台到期和服务时间同步失败");
        }
      });
      // });
    },
    updateDeviceListTime(item) {
      // console.log("item", item);
      // 查询报警详情
      queryDeviceAlertNotify({ deviceImei: item.deviceImei }).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          let data = res.data;
          for (let i = 0; i < this.upLoadDeviceList.length; i++) {
            if (data.deviceImei == this.upLoadDeviceList[i].deviceImei) {
              this.upLoadDeviceList[i].expireDate = new Date(
                data.expireDate.time
              ).format("yyyy-MM-dd");
              break;
            }
          }
        }
      });
    },
    resetList() {
      // 清空表格
      this.upLoadDeviceList = [];
      this.app.$emit("reset-file-upload");
    },
    async dealExcel1(result) {
      // 处理上传的设备号
      // console.log(result);
      var imeiKey = "";
      for (let key in result[0]) {
        imeiKey = key;
        break;
      }
      // console.log(imeiKey);
      let devList = [];
      for (var i = 0; i < result.length; i++) {
        let item = result[i][imeiKey];
        // console.log(item);
        devList.push(item);
      }
      // console.log(devList);
      let platArr = [];
      let serverArr = [];
      platArr = await this.getThePlatExpiredTime(devList);
      serverArr = await this.getTheServerExpiredTime(devList);
      // console.log("platArr", platArr);
      // console.log("serverArr", serverArr);
      //
      setTimeout(() => {
        // this.upLoadDeviceList = platArr.map((item) => {
        //   const data = serverArr.find((i) => item.deviceImei == i.deviceImei);
        //   console.log(item);
        //   console.log(data);
        //   return {
        //     ...item,
        //     ...data,
        //   };
        // });
        // console.log("uploadDeviceList", this.upLoadDeviceList);
        let uploadList = [];
        uploadList = platArr.map(item => {
          const data = serverArr.find(i => item.deviceImei == i.deviceImei);
          // console.log(item);
          // console.log(data);
          return {
            ...item,
            ...data
          };
        });
        let newArr = [];
        let obj = {};
        for (let i = 0; i < uploadList.length; i++) {
          if (!obj[uploadList[i].deviceImei]) {
            newArr.push(uploadList[i]);
            obj[uploadList[i].deviceImei] = true;
          }
        }
        this.upLoadDeviceList = newArr;
      }, 1500);
    },
    async getThePlatExpiredTime(devList) {
      // 获取设备的平台到期时间  { deviceImei }
      let timeList = [];
      await devList.forEach(item => {
        getDeviceDetail({ deviceImei: item }).then(res => {
          if (res.errCode == 200) {
            timeList.push({
              deviceImei: res.data.deviceImei,
              platformExpire: res.data.platformExpire
            });
            this.platTimeDevList.push(res.data);
          }
        });
      });
      // console.log("timeList", timeList);
      return timeList;
    },
    async getTheServerExpiredTime(devList) {
      // 获取设备的服务到期时间  { deviceImei }
      let serverTimeList = [];
      await devList.forEach(item => {
        loadPhoneNotify({ deviceImei: item }).then(res => {
          if (res.errCode == 200) {
            serverTimeList.push({
              deviceImei: res.data.deviceImei,
              expireDate: new Date(res.data.expireDate.time).format(
                "yyyy-MM-dd"
              )
            });
            this.serverTimeList.push(res.data);
          }
        });
      });
      return serverTimeList;
    },
    onUploadFile1(files) {
      // 上传的表格数据
      ExportUtil.parseExcel(files[0], this.dealExcel1);
    },
    batchSave() {
      // 批量保存电话报警通知
      let list = this.deviceImeis.replace(/\n|\r\n/g, ",");
      let arrList = list.split(",");
      let stsList = [];
      for (let i = 0; i < arrList.length; i++) {
        stsList.push(arrList[i].trim());
      }
      // console.log("stsList", stsList.join(","));
      if (!stsList) {
        this.app.$emit("show-alert-msg", "请输入设备号");
        return;
      }
      const data = {
        deviceImeis: stsList.join(","),
        status: this.status1,
        notifyCount: this.notifyCount1,
        expireTime: new Date(this.expireDate1).getTime()
      };
      // return;
      batchSavePhoneAlertNotify(data).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          this.app.$emit("show-alert-msg", "批量修改报警通知成功");
        } else {
          this.app.$emit("show-alert-msg", "批量修改报警通知失败");
        }
      });
    },
    dealExcel(result) {
      console.log("result", result);
    },
    onUploadFile(files) {
      // 上传的设备表格数
      ExportUtil.parseExcel(files[0], this.dealExcel);
    },
    doResetDeviceList() {
      // 清空列表
      this.deviceList = [];
    },
    delSingalDev(idx) {
      this.deviceList.splice(idx, 1);
    },
    doBatchBondTel() {
      if (!this.phoneNum) {
        this.app.$emit("show-alert-msg", this.$t("withdraw.phoneTip"));
        return;
      }
      if (!this.verCode) {
        this.app.$emit("show-alert-msg", this.$t("phoneNotify.vertifyCodeTip"));
        return;
      }
      if (!this.isPhoneNumber(this.phoneNum)) {
        this.app.$emit("show-alert-msg", this.$t("withdraw.phoneRightTip"));
        return;
      }
      if (this.deviceList.length == 1) {
        const data = {
          deviceImei: this.deviceImei,
          telNo: this.phoneNum,
          checkCode: this.verCode
        };
        // console.log(data);
        // return;
        singelTelBond(data).then(res => {
          if (res.errCode == 200) {
            this.loadPhoneNotifyDetail(this.deviceImei);
            this.app.$emit(
              "show-alert-msg",
              this.$t("phoneNotify.bangdingPhoneSuccessTip")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("phoneNotify.bangdingPhoneFailTip") + res.errMsg
            );
          }
        });
      } else if (this.deviceList.length > 1) {
        let list = [];
        for (let i = 0; i < this.deviceList.length; i++) {
          list.push(this.deviceList[i].deviceImei);
        }
        const data1 = {
          deviceImeis: list.join(","),
          phoneNo: this.phoneNum,
          checkCode: this.verCode
        };
        // console.log(data1);
        // return;
        batchTelBond(data1).then(res => {
          if (res.errCode == 200) {
            this.loadPhoneNotifyDetail(this.deviceImei);
            this.app.$emit(
              "show-alert-msg",
              this.$t("phoneNotify.bangdingPhoneSuccessTip")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("phoneNotify.bangdingPhoneFailTip") + "," + res.errMsg
            );
          }
        });
      }
    },
    getPhoneCode() {
      // 发送手机验证码
      if (!this.phoneNum) {
        this.app.$emit("show-alert-msg", this.$t("withdraw.phoneTip"));
        return;
      }
      if (!this.isPhoneNumber(this.phoneNum)) {
        this.app.$emit("show-alert-msg", this.$t("withdraw.phoneRightTip"));
        return;
      }
      sendPhoneCode({ phoneNo: this.phoneNum }).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", this.$t("card.sendCodeOk"));
        }
      });
      let timer = null;
      if (timer) timer = clearInterval(timer);
      this.isSendAble = false;
      this.refreshTime = 59;
      timer = setInterval(() => {
        if (this.refreshTime <= 0) {
          this.isSendAble = true;
          timer = clearInterval(timer);
        } else {
          this.refreshTime--;
        }
      }, 1000);
    },
    dealUserItem(val) {
      // console.log(val);
      let devlist = [];
      // this.phoneNum = "";
      // this.verCode = "";
      for (let i = 0; i < val.length; i++) {
        let item = val[i];
        devlist.push({
          deviceImei: item.deviceImei,
          name: item.name
        });
      }
      this.deviceList = this.deviceList.concat(devlist);
      // let hash = {};
      // let newDate = [...this.deviceList];
      // this.deviceList = newDate.reduce((item, next) => {
      //   hash[next.deviceImei] ? "" : (hash[next.deviceImei] = true && item.push(next));
      //   return item;
      // }, []);
      this.deviceList = this.filterDate(this.deviceList);
    },
    filterDate(list) {
      let hash = {};
      let newDate = [...list];
      list = newDate.reduce((item, next) => {
        hash[next.deviceImei]
          ? ""
          : (hash[next.deviceImei] = true && item.push(next));
        return item;
      }, []);
      return list;
    },
    showBandPhone() {
      this.phoneNum = "";
      this.verCode = "";
      this.deviceList = [];
      this.isShow = true;
      this.deviceList.unshift({
        deviceImei: this.deviceImei,
        name: ""
      });
      this.deviceList = this.filterDate(this.deviceList);
    },
    changeTabs(idx) {
      // console.log(idx);
      if (idx.name == "first") {
        this.loadPhoneNotifyDetail(this.deviceImei);
      } else if (idx.name == "second") {
        this.loadDeviceSwitch();
      } else if (idx.name == "third") {
        this.status1 = "1";
        this.notifyCount1 = 200;
        this.deviceImeis = "";
      } else if (idx.name == "fourth") {
        this.resetList();
      }
    },
    dealDevDetail(imei) {
      this.deviceImei = imei;
      // let textDevice = "684611121300033";
      this.loadDeviceDetail();
      this.loadPhoneNotifyDetail(imei);
    },
    loadDeviceDetail() {
      getDeviceDetail({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == 200) {
          // console.log("res", res);
          this.deviceType = res.data.refillType;
        }
      });
    },
    loadPhoneNotifyDetail(imei) {
      // 查询报警详情
      loadPhoneNotify({ deviceImei: imei }).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          let data = res.data;
          for (let key in this.deviceNotifyDetail) {
            this.deviceNotifyDetail[key] = data[key];
          }
          // console.log("this.deviceNotifyDetial", this.deviceNotifyDetail);
          this.devExpireDate = res.data.expireDate.time;
          this.notifyCount = res.data.notifyCount;
        }
      });
    },
    updatePhoneNotifyDetail() {
      // 更新保存手机报警通知
      const data = {
        deviceImei: this.deviceImei,
        weChatSwitch: this.deviceNotifyDetail.weChatSwitch,
        appSwitch: this.deviceNotifyDetail.appSwitch,
        smsSwitch: this.deviceNotifyDetail.smsSwitch,
        telSwitch: this.deviceNotifyDetail.telSwitch,
        notifyCount: this.notifyCount,
        expireTime: new Date(this.devExpireDate).getTime(),
        telNo: this.deviceNotifyDetail.telNo
          ? this.deviceNotifyDetail.telNo
          : "",
        // telNo2: this.deviceNotifyDetail.telNo2 ? this.deviceNotifyDetail.telNo2 : "",
        status: this.deviceNotifyDetail.status
      };
      updateAlertNotifyInfo(data).then(res => {
        if (res.errCode == 200) {
          this.loadPhoneNotifyDetail(this.deviceImei);
          this.app.$emit(
            "show-alert-msg",
            this.$t("phoneNotify.phoneNotifySuccessTip")
          );
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("phoneNotify.phoneNotifyFailTip")
          );
        }
      });
    },
    loadDeviceSwitch() {
      queryPhoneAlertSwitch({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == 200) {
          for (let key in this.deviceSwitchDetail) {
            this.deviceSwitchDetail[key] = res.data[key];
          }
        }
      });
    },
    updateDeviceSwitch() {
      const data = {
        deviceImei: this.deviceImei,
        offline: this.deviceSwitchDetail.offline,
        overspeed: this.deviceSwitchDetail.overspeed,
        lowElectric: this.deviceSwitchDetail.lowElectric,
        weakSignal: this.deviceSwitchDetail.weakSignal,
        collisionAlarm: this.deviceSwitchDetail.collisionAlarm,
        rolloverAlarm: this.deviceSwitchDetail.rolloverAlarm,
        signalRecover: this.deviceSwitchDetail.signalRecover,
        lightSensitive: this.deviceSwitchDetail.lightSensitive,
        sosAlarm: this.deviceSwitchDetail.sosAlarm,
        powerFailure: this.deviceSwitchDetail.powerFailure,
        vibrationAlarm: this.deviceSwitchDetail.vibrationAlarm,
        flowExpiration: this.deviceSwitchDetail.flowExpiration,
        platformExpires: this.deviceSwitchDetail.platformExpires,
        outFence: this.deviceSwitchDetail.outFence,
        shieldAlarm: this.deviceSwitchDetail.shieldAlarm
      };
      updatePhoneAlertSwitch(data).then(res => {
        if (res.errCode == 200) {
          this.loadDeviceSwitch();
          this.app.$emit(
            "show-alert-msg",
            this.$t("phoneNotify.phoneSwitchSuccessTip")
          );
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("phoneNotify.phoneSwitchFailTip")
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

<style scoped lang="scss">
.btn-content {
  text-align: right;
  margin: 5px 0;
}
.add-phone-content {
  .el-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .add-top {
    display: flex;
    justify-content: space-between;
    padding: 5px 40px;
    background: #ccc;
    align-items: center;
  }
}
.btn-cont-right1 {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.phone-notify-setting {
  height: 100%;
}
.phone-setting-content {
  height: calc(100% - 50px);
  overflow: scroll;
  position: relative;
  .el-form-item {
    margin-bottom: 0;
  }
  .btn-cont-right {
    position: absolute;
    right: 20px;
    bottom: 0px;
  }
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
  .go-bangding {
    cursor: pointer;
  }
}
</style>
