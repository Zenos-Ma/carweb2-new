<template>
  <section :id="'info_box_' + mapName">
    <!--监控跟踪地图信息框 start-->
    <div
      class="info-box1"
      v-if="mapName != 'playback' && mapName != 'home'"
      v-show="isShowInfoBox && deviceImei"
      :style="{ height: heightItem + 'px' }"
    >
      <div class="info-box1-content">
        <div class="info-box-header" :title="$t('infobox.moveTip')">
          <span class="header-title">{{ devInfo.deviceName }}</span>
          <span
            class="close-btn"
            style="height: 20px; width: 20px"
            :title="mapName"
            @click="closeInfoBox"
          ></span>
        </div>
        <div class="info-box-subhead">
          <span>({{ deviceImei }})</span>
          <span v-if="devInfo.enableSts == 1">{{ devInfo.status }}</span>
          <!-- 设备激活 -->
          <span
            v-if="devInfo.enableSts != 1"
            class="isdevice-active-btn"
            @click="dealDeviceActive"
            >{{ $t("common.activing")
            }}<i
              class="iconfont icon-warn"
              :title="$t('infobox.isActiveTip1')"
            ></i
          ></span>
        </div>
        <div
          class="expire-content"
          v-show="devInfo.enableSts != 0 && devInfo.enableDate != null"
        >
          <div v-if="devInfo.isflowExpireTime" style="color: red">
            {{ $t("infobox.flowExpireTip") }}
          </div>
          <div v-if="devInfo.isplatformExpireTime" style="color: red">
            {{ $t("infobox.platExpireTip") }}
          </div>
          <div v-if="devInfo.flowTime" style="color: red">
            {{ $t("infobox.flowTime") }} {{ devInfo.flowTime }}
            {{ $t("infobox.timeExpire") }}
          </div>
          <div v-if="devInfo.platTime" style="color: red">
            {{ $t("infobox.platTime") }} {{ devInfo.platTime }}
            {{ $t("infobox.timeExpire") }}
          </div>
        </div>
        <!-- && !devInfo.isplatformExpireTime && !devInfo.isflowExpireTime -->
        <div
          class="info-box-body"
          v-show="
            (devInfo.enableSts == 1 && !devInfo.isplatformExpireTime) ||
              (devInfo.enableSts == 1 && !devInfo.enableDate) ||
              userId == 10000035
          "
        >
          <table>
            <tr>
              <td
                colspan="2"
                style="white-space: normal; word-break: break-all"
              >
                <!-- baidu -->
                <span v-show="!isdetailAddress">
                  <span v-show="isaddress"
                    >{{ devInfo.locaAddress }}[{{ $t("infobox.poiType") }}:{{
                      devInfo.locaWay
                    }}]</span
                  >
                  <span
                    v-show="!isaddress"
                    style="cursor: pointer"
                    @click="getTheDeviceAddress"
                    >{{ $t("common.showAddress") }}>>></span
                  >
                  <el-button
                    class="primary-btn-table-shadow"
                    size="small"
                    v-if="theMap == 'google-map'"
                    @click="showGoogleLocation"
                    >Detail Address</el-button
                  >
                </span>
                <!-- google -->
                <span v-show="isdetailAddress">
                  <span
                    >{{ googleAddress }}[{{ $t("infobox.poiType") }}:{{
                      devInfo.locaWay
                    }}]</span
                  >
                  <el-button
                    class="primary-btn-table-shadow"
                    size="small"
                    v-if="theMap == 'google-map'"
                    @click="backAddress"
                    >Back</el-button
                  >
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/img/infobox/signalTime.png" />
                {{ $t("infobox.signalTime") }}:{{ devInfo.signalTime }}
              </td>

              <td>
                <img src="@/assets/img/infobox/locaTime.png" />
                {{ $t("infobox.locaTime") }}:{{ devInfo.locaTime }}
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/img/infobox/voltage.png" />
                {{ $t("infobox.voltage") }}{{ $t("infobox.power") }}:{{
                  devInfo.voltage
                }}{{ devInfo.power }}
              </td>

              <td class="hover-box">
                <img
                  src="@/assets/img/infobox/signal0.png"
                  v-show="signalIcon <= 0"
                />
                <img
                  src="@/assets/img/infobox/signal1.png"
                  v-show="signalIcon == 1"
                />
                <img
                  src="@/assets/img/infobox/signal2.png"
                  v-show="signalIcon == 2"
                />
                <img
                  src="@/assets/img/infobox/signal3.png"
                  v-show="signalIcon == 3"
                />
                <img
                  src="@/assets/img/infobox/signal4.png"
                  v-show="signalIcon >= 4"
                />
                {{ $t("infobox.signal") }}[?]:{{ devInfo.signal }}
                <span class="orange-box"
                  >{{ $t("infobox.sanValue") }}:<br />{{
                    $t("infobox.signalType")
                  }}</span
                >
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/img/infobox/defense.png" />
                {{ $t("infobox.defenseSts") }}:{{ devInfo.defenseSts }}
              </td>

              <td>
                <img src="@/assets/img/infobox/ACC.png" />
                ACC:
                {{ devInfo.runStatus }}
              </td>
            </tr>
            <tr>
              <td>
                <img src="@/assets/img/infobox/mode.png" />
                {{ $t("infobox.workMode") }}:{{ devInfo.workMode }}
              </td>
              <td v-show="devInfo.temperature">
                <img src="@/assets/img/infobox/wendu.png" alt="" />
                {{ $t("infobox.temperature") }} : {{ devInfo.temperature }}
              </td>
            </tr>
          </table>
        </div>
        <!--监控地图按钮-->
        <div
          class="info-box-footer"
          v-if="
            mapName == 'location' || mapName == 'Cluster' || mapName == 'points'
          "
          :title="deviceImei"
        >
          <button title="location" @click="onInfoBoxAction('location')">
            <img src="@/assets/img/infobox/address.png" />
            <!-- <img src="@/assets/img/infobox/track1.png" v-show="!isTrack" /> -->
            {{ $t("infobox.location") }}
          </button>
          <button title="defense" @click="onInfoBoxAction('defense')">
            <img src="@/assets/img/infobox/defense.png" v-show="!isDefense" />
            <img src="@/assets/img/infobox/undefense.png" v-show="isDefense" />
            {{ $t(isDefense ? "infobox.undefense" : "infobox.defense") }}
          </button>
          <button title="playback" @click="onInfoBoxAction('playback')">
            <img src="@/assets/img/infobox/playback.png" />
            {{ $t("infobox.playback") }}
          </button>
          <button title="recording" @click="onInfoBoxAction('recording')">
            <img src="@/assets/img/infobox/recorder.png" alt="" />
            {{ $t("common.record") }}
          </button>
          <button title="more" @click="onInfoBoxAction('more')">
            <img src="@/assets/img/infobox/more.png" />
            {{ $t("infobox.more") }}
          </button>
        </div>
        <div
          class="info-box-footer"
          v-if="mapName.indexOf('Fence') >= 0"
          :title="deviceImei"
        >
          <button title="location" @click="onInfoBoxAction('location')">
            <img src="@/assets/img/infobox/address.png" />
            {{ $t("infobox.location") }}
          </button>
          <button title="playback" @click="onInfoBoxAction('playback')">
            <img src="@/assets/img/infobox/playback.png" />
            {{ $t("infobox.playback") }}
          </button>
          <button title="more" @click="onInfoBoxAction('more')">
            <img src="@/assets/img/infobox/more.png" />
            {{ $t("infobox.more") }}
          </button>
        </div>
        <!--跟踪地图按钮-->
        <div
          class="info-box-footer"
          v-if="mapName == 'track'"
          :title="deviceImei"
        >
          <button title="street" @click="onInfoBoxAction('street')">
            <i class="iconfont icon-yanjing"></i>
            {{ $t("infobox.street") }}
          </button>
          <button title="playback" @click="onInfoBoxAction('playback')">
            <img src="@/assets/img/infobox/playback.png" />
            {{ $t("infobox.playback") }}
          </button>
          <button title="more" @click="onInfoBoxAction('more')">
            <img src="@/assets/img/infobox/more.png" />
            {{ $t("infobox.more") }}
          </button>
        </div>
        <!--设备登录地图按钮-->
        <div
          class="info-box-footer"
          v-if="mapName == 'location1'"
          :title="deviceImei"
        >
          <button title="street" @click="onInfoBoxAction('street')">
            <i class="iconfont icon-yanjing"></i>
            {{ $t("infobox.street") }}
          </button>
          <button title="playback" @click="onInfoBoxAction('playback')">
            <img src="@/assets/img/infobox/playback.png" />
            {{ $t("infobox.playback") }}
          </button>
        </div>
        <!--设备详情对话框跟踪地图按钮-->
        <div
          class="info-box-footer"
          v-if="mapName == 'deviceTrack'"
          :title="deviceImei"
        >
          <button title="street" @click="onInfoBoxAction('street')">
            <i class="iconfont icon-yanjing"></i>
            {{ $t("infobox.street") }}
          </button>
          <button title="location" @click="onInfoBoxAction('location')">
            <img src="@/assets/img/infobox/address.png" />
            {{ $t("infobox.location") }}
          </button>
          <button title="defense" @click="onInfoBoxAction('defense')">
            <img src="@/assets/img/infobox/defense.png" v-show="!isDefense" />
            <img src="@/assets/img/infobox/undefense.png" v-show="isDefense" />
            {{ $t(isDefense ? "infobox.undefense" : "infobox.defense") }}
          </button>
          <button title="playback" @click="onInfoBoxAction('playback')">
            <img src="@/assets/img/infobox/playback.png" />
            {{ $t("infobox.playback") }}
          </button>
        </div>
      </div>
    </div>
    <!--监控跟踪地图信息框 end-->
  </section>
</template>

<script>
import mapUtil from "@/utils/mapUtil.js";
import { doDeviceActive, sendDeviceCmd } from "@/api/common.js";
import { updateDevice } from "@/api/monitor.js";

var InfoBoxComp = {
  name: "InfoBox",
  props: {
    mapName: {
      //地图标志名称
      type: String,
      default: ""
    },
    deviceName: {
      //设备名称
      type: String,
      default: ""
    },
    deviceImei: {
      //选中设备
      type: String,
      default: ""
    },
    isTrack: {
      //是否显示跟踪线
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isaddress: false,
    heightItem: 180,
    devInfo: {
      //定位信息框
      deviceName: "",
      status: "",
      runStatus: "",
      defenseSts: "",
      signalTime: "",
      locaTime: "",
      voltage: "",
      power: "",
      acc: "",
      workMode: "",
      locaWay: "",
      locaAddress: "",
      locagoogleAddress: "",
      temperature: ""
    },
    address: "",
    googleAddress: "",
    lat: 0,
    lng: 0,
    isDefense: false, //是否已经布防
    isDefensePage: false,
    playInfo: {
      //回放信息框
      locaTime: "",
      speed: "",
      locaWay: "",
      runTime: "",
      mileage: "",
      title: ""
    },
    signalIcon: 0, //信号程度icon
    isShowInfoBox: false,
    infoOption: null,
    locaWay1: "",
    theMap: "",
    currentMap: "",
    isdetailAddress: false,
    googleLat: "",
    googleLng: "",
    isRecord: false, //是否可以开始录音功能
    deviceAddress: {
      lat: 0,
      lng: 0
    },
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId
  }),
  watch: {
    theMap() {
      // console.log(this.theMap);
      this.currentMap = this.getTheMapIndex(this.theMap);
    }
  },
  methods: {
    getTheDeviceAddress() {
      // 点击获取地址
      let lat = this.deviceAddress.lat;
      let lng = this.deviceAddress.lng;
      if (
        lng &&
        lat &&
        lat != 0 &&
        lng > -180 &&
        lng <= 180 &&
        lat <= 90 &&
        lat >= -90
      ) {
        this.address = this.$t("common.loading");
        this.devInfo.locaAddress = this.address;
        this.getPoiLocation(this.lng, this.lat, address => {
          if (this.deviceImei) {
            this.isaddress = true;
            this.address = address
              ? address
              : this.locaWay1 == "基站"
              ? this.$t("common.addressFail")
              : this.locaWay1 == "卫星"
              ? this.$t("common.addressFail2")
              : this.$t("common.addressFail1");

            this.devInfo.locaAddress = address;
          }
        });
      } else {
        this.isaddress = true;
        this.devInfo.locaAddress =
          this.locaWay1 == "基站"
            ? this.$t("common.addressFail")
            : this.locaWay1 == "卫星"
            ? this.$t("common.addressFail2")
            : this.$t("common.addressFail1");
      }
    },
    getTheMapIndex(name) {
      var theMapList = this.$t("playback.theMapList");
      var str = "";
      for (var i = 0; i < theMapList.length; i++) {
        if (name == theMapList[i].name) {
          return str + theMapList[i].num;
        }
      }
      return "";
    },
    doDefense() {
      //布防对话框
      this.app.$emit("show-defense-dialog", {
        imei: this.deviceImei,
        isDefense: this.isDefense
      });
    },
    closeInfoBox() {
      //关闭信息框
      this.isShowInfoBox = false;
    },
    doPlayback() {
      //回放界面
      window.location.hash = "#/home/playback?deviceImei=" + this.deviceImei;
    },
    doTrack() {
      //跟踪界面
      window.location.hash = "#/home/track?deviceImei=" + this.deviceImei;
    },
    showDeviceDetail() {
      //显示设备详情对话框
      this.app.$emit("location-device-page");
    },
    getInfoBox(options, mapName) {
      // console.log(options);
      this.isRecord =
        options.info.sts == "行驶" || options.info.sts == "静止" ? true : false;
      this.googleLat = options.location.lat;
      this.googleLng = options.location.lon;
      // console.log(options);
      //更新信息框信息
      if (mapName != this.mapName && this.deviceImei == options.deviceImei)
        return;
      var that = this;
      this.infoOption = options;
      this.signalIcon = parseInt(options.gsmSignal / 8);
      //this.deviceImei = options.deviceImei;
      this.isDefense = options.defense.isDefense;
      var infoBoxData = {
        deviceName: options.info.name
          ? options.info.name
          : this.$t("infobox.unNameDev"),
        runStatus:
          options.info.accSts == "开启"
            ? `${this.$t("infobox.openAcc")} ${
                options.info.accTime
                  ? mapUtil.cnTime(new Date().getTime() - options.info.accTime)
                  : ""
              }`
            : `${this.$t("infobox.closeAcc")} ${
                options.info.accTime
                  ? mapUtil.cnTime(new Date().getTime() - options.info.accTime)
                  : ""
              }`,
        signal: `${
          options.gsmSignal && options.gsmSignal > 0 ? options.gsmSignal : 0
        }/${options.bdStar && options.bdStar > 0 ? options.bdStar : 0}/${
          options.gpsStar && options.gpsStar > 0 ? options.gpsStar : 0
        }`,
        status: mapUtil.cnStatus(options),
        defenseSts: options.defense.isDefense
          ? this.$t("infobox.defenseRadius") +
            options.defense.radius +
            this.$t("infobox.meter")
          : this.$t("infobox.undefensed"),
        signalTime: options.info.signalTime
          ? new Date(options.info.signalTime).format("yyyy-MM-dd hh:mm:ss")
          : "--",
        locaTime: options.info.locateTime
          ? new Date(options.info.locateTime).format("yyyy-MM-dd hh:mm:ss")
          : "--",
        voltage:
          options.info.voltage !== null && options.info.voltage.length > 0
            ? options.info.voltage + "V"
            : "--",
        power:
          options.info.electricity > 0 ? options.info.electricity + "%" : "0%",
        // workMode: `1:${options.info.model1},2:${(options.info.model2 / 120).toFixed(1) + this.$t("infobox.hour")}`,
        workMode: `1:${options.info.model1},2:${(
          (options.info.model2 * 3) /
          60
        ).toFixed(1) + this.$t("infobox.hour")}`,
        locaWay:
          options.info.locateType == "卫星"
            ? this.$t("infobox.weixing")
            : options.info.locateType == "基站"
            ? this.$t("infobox.jizhan")
            : "WIFI",
        locaAddress: this.$t("common.loading"),
        locagoogleAddress: this.$t("common.loading"),
        temperature:
          options.temperature && options.temperature != -1
            ? options.temperature
            : "",
        enableSts: options.info.enableSts,
        enableDate: options.info.enableDate
      };
      // 显示流量平台
      var flow, plat;
      var flag = false;
      var flag1 = false;
      plat = this.judgmentTheTime(options.info.platExpire);
      if (options.info.flowFlag && options.info.flowExpire) {
        flow = this.judgmentTheTime(options.info.flowExpire);
        if (flow < plat && flow < 0) {
          flag = true;
          infoBoxData.isflowExpireTime = flag;
          if (flow == plat) {
            flag = true;
            infoBoxData.isflowExpireTime = flag;
          }
        } else if (flow < plat && flow > 0 && flow < this.minExpireTime) {
          infoBoxData.flowTime = flow;
        }
      }
      if (plat < 0) {
        if (options.info.flowExpire) {
          if (plat < flow) {
            flag1 = true;
            infoBoxData.isplatformExpireTime = flag1;
          }
        } else {
          flag1 = true;
          infoBoxData.isplatformExpireTime = flag1;
        }
      } else if (plat > 0 && this.minExpireTime > plat) {
        // infoBoxData.platTime = plat;
        // console.log(infoBoxData.isflowExpireTime);
        if (!infoBoxData.isflowExpireTime) {
          infoBoxData.platTime = plat;
        }
      }
      this.devInfo = infoBoxData;

      // var lng = options.location.bdlng,
      //   lat = options.location.bdlat;
      // 2021-6-8
      var lat, lng;

      if (this.theMap == "baidu-map") {
        console.log("theMap", this.theMap);
        lng = options.location.bdlng;
        lat = options.location.bdlat;
      } else {
        lng = options.location.lon;
        lat = options.location.lat;
      }
      this.deviceAddress = {
        lat: lat,
        lng: lng
      };

      setTimeout(() => {
        that.showInfobox(lat, lng, options);
      }, 50);
      // console.log(this.theMap);
      if (options.defense.isDefense) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-circle",
          lat: lat,
          lng: lng,
          radius: options.defense.radius,
          theMap: that.theMap
        });
      } else {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-circle"
        });
      }

      //获取当前经纬度地址
      this.locaWay1 = this.devInfo.locaWay;
      if (
        lng &&
        lat &&
        lat != 0 &&
        lng > -180 &&
        lng <= 180 &&
        lat <= 90 &&
        lat >= -90 &&
        this.lat != lat &&
        this.lng != lng
      ) {
        // if(lng>360){
        this.lat = lat;
        this.lng = lng;
      } else {
        if (lng && lat && that.isaddress) {
          if (options.info.stsNum == 1) {
            that.getTheDeviceAddress();
          }
          infoBoxData.locaAddress = that.address
            ? that.address
            : that.locaWay1 == "基站"
            ? that.$t("common.addressFail")
            : that.locaWay1 == "卫星"
            ? that.$t("common.addressFail2")
            : that.$t("common.addressFail1");
        } else {
          infoBoxData.locaAddress =
            that.locaWay1 == "基站"
              ? that.$t("common.addressFail")
              : that.locaWay1 == "卫星"
              ? that.$t("common.addressFail2")
              : that.$t("common.addressFail1");
        }
        that.devInfo = infoBoxData;
      }
      setTimeout(() => {
        that.showInfobox(lat, lng, options);
      }, 50);
    },
    // 谷歌地图的转换地址start
    backAddress() {
      // console.log("1234");
      this.isdetailAddress = false;
      this.isaddress = false;
    },
    postLocationOrder() {
      // 发送自定义指令的定位指令
      let data = {
        cmdContent: "123",
        isOfflineCmd: false,
        deviceImei: this.deviceImei
      };
      sendDeviceCmd(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", res.data);
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.systemTip"));
        }
      });
    },
    showGoogleLocation() {
      // console.log("chufa");
      this.isdetailAddress = true;
      var that = this;
      if (this.theMap == "google-map") {
        that.googleAddress = that.$t("common.loading");
        this.getGoogleLocation(this.googleLat, this.googleLng, function(
          address
        ) {
          that.googleAddress = address;
        });
      }
    },
    // 谷歌地图的转换地址end
    onInfoBoxAction(tag) {
      //监听信息框
      var op = this.infoOption;
      var imei = op.deviceImei;
      var that = this;
      switch (tag) {
        case "playback": //跳转到回放界面   "#/playback?deviceImei=" + imei
          window.open(
            window.location.origin +
              window.location.pathname +
              `#playback?deviceImei=${imei}&mapkey=${this.currentMap}`
          );
          break;
        case "more": //显示设备详情对话框
          that.app.$emit(
            "show-device-dialog",
            {
              name: "DeviceDialog",
              imei: imei
            },
            that.mapName
          );
          break;
        case "defense": //布防和撤防对话框
          that.app.$emit(
            "show-defense-dialog",
            {
              name: "DefenseDialog",
              imei: imei,
              isDefense: op.defense.isDefense
            },
            that.mapName
          );
          break;
        case "location": //跳转到跟踪界面
          // that.$emit("update:isTrack", that.isTrack ? false : true);
          that.postLocationOrder();
          break;
        case "street": //是否显示街景
          that.app.$emit(
            "show-street-view",
            op.location.bdlat,
            op.location.bdlng
          );
          break;
        case "recording": //显示语音
          that.app.$emit("show-recording-dialog", {
            name: "RecordingDialog",
            imei: imei,
            isRecord: this.isRecord
          });
      }
    },
    showInfobox(lat, lng, options) {
      // console.log(lat, lng, options);
      //显示信息框
      // console.log(this.theMap);
      this.isShowInfoBox = true;
      if (this.theMap == "google-map") {
        var infoContent = `<div class='device-label1 active' >${
          options.info.name
        }</div>`;
      } else {
        if (this.theMap == "baidu-map") {
          infoContent = `<div class='device-label device-label-left active' >${
            options.info.name
          }</div>`;
        } else if (this.theMap == "a-map") {
          infoContent = `<div class='device-label device-label-left active' >${
            options.info.name
          }</div>`;
        } else {
          infoContent = `<div class='device-label active' >${
            options.info.name
          }</div>`;
        }
      }
      // console.log(options);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "show-infobox",
        infoContent: infoContent,
        lat: lat,
        lng: lng,
        offsetX: 0,
        offsetY: 0,
        style: { border: "none", background: "transparent" }
      });
    },
    getDeviceInfo(data, mapName, theMap) {
      // console.log(data);
      // console.log("data", data, mapName, theMap);
      this.theMap = theMap;
      //获取设备最新定位信息
      var that = this;
      if (
        this.deviceImei &&
        data.deviceImei &&
        this.mapName == mapName &&
        this.deviceImei == data.deviceImei
      ) {
        updateDevice({ deviceImei: data.deviceImei }).then(res => {
          if (res.errCode == "200") {
            // mapUtil.disposeDeviceIcon(res.data.info, false);
            that.app.$emit("infobox-data", res.data, that.mapName);
            that.getInfoBox(res.data, that.mapName);
          }
        });
      }
    },
    getLocaWay(locateSts) {
      //获取当前定位方式
      switch (locateSts) {
        case "0":
          return this.$t("infobox.weixing");

        case "1":
          return this.$t("infobox.jizhan");

        case "2":
          return "WIFI";

        default:
          return "--";
      }
    },
    doPlayInfoBox(op, title) {
      //回放信息
      var that = this;
      this.playInfo = {
        locaTime: new Date(op.realTime).format("yyyy-MM-dd hh:mm:ss"),
        speed: op.speed + "km/h",
        locaWay: this.getLocaWay(op.locateSts),
        runTime: mapUtil.cnTime(op.totalRunTime),
        mileage: (op.totalDist * 0.001).toFixed(2) + "km",
        title: title ? title : ""
      };
      setTimeout(() => {
        var elmt = document.getElementById(`info_box_${this.mapName}`);
        var content = elmt.innerHTML;
        that.app.$emit("map-operation", {
          mapName: that.mapName,
          action: "show-infobox",
          infoContent: `<div style="display:inline-block;position:absolute;margin-left:-120px;margin-top:-${
            title ? 180 : 130
          }px;">${content}</div>`,
          lat: op.baiduPt.lat,
          lng: op.baiduPt.lng,
          offsetX: 0,
          offsetY: 0,
          style: { border: "none", background: "transparent" }
        });
        setTimeout(() => {
          $(".close-btn").click(function(e) {
            //关闭
            that.app.$emit("map-operation", {
              action: "hide-infobox",
              mapName: that.mapName
            });
            e.preventDefault();
          });
        }, 50);
      }, 20);
    },
    dealDeviceActive() {
      let str = this.$t("customer.deviceActive");
      this.app.$emit(
        "show-confirm-msg",
        str.replace("_device_", this.deviceImei),
        () => {
          doDeviceActive({ deviceImei: this.deviceImei }).then(res => {
            if (res.errCode == 200) {
              this.app.$emit("refresh-current-dev");
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceActiveTip")
              );
            } else {
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceImeiActiced")
              );
            }
          });
        }
      );
      //
    },
    listenEvent() {
      this.app.$on("onselectDevice", this.backAddress);
      this.app.$on("refresh-infobox", this.getDeviceInfo);
      this.app.$on("update-infobox", this.getInfoBox);
      this.app.$on("playback-infobox", this.doPlayInfoBox);
    },
    offEvent() {
      this.app.$off("onselectDevice", this.backAddress);
      this.app.$off("refresh-infobox", this.getDeviceInfo);
      this.app.$off("update-infobox", this.getInfoBox);
      this.app.$off("playback-infobox", this.doPlayInfoBox);
    }
  },
  mounted() {
    this.listenEvent();

    $(
      `#info_box_${this.mapName}>.info-box1 .info-box-header>.header-title`
    ).mousedown(function(ev) {
      var model = $(this)
        .parent()
        .parent()
        .parent();
      // console.log(model);
      $("#moving_page").show();
      $("#moving_page").css("cursor", "move");
      var x = 0,
        y = 0,
        dx = ev.pageX - $(model).prop("offsetLeft"),
        dy = ev.pageY - $(model).prop("offsetTop");
      function m(e) {
        if ($("#moving_page").is(":visible")) {
          x = e.pageX;
          y = e.pageY;
          var xx = x - dx;
          if (xx <= 0) {
            xx = 0;
          } else if (xx + $(model).width() >= $("#moving_page").width()) {
            xx = $("#moving_page").width() - $(model).width();
          }
          var yy = y - dy;
          if (yy <= 0) {
            yy = 0;
          } else if (yy + $(model).height() >= $("#moving_page").height()) {
            yy = $("#moving_page").height() - $(model).height();
          }

          $(model).css("left", xx + "px");
          $(model).css("top", yy + "px");
        }
      }
      function mm() {
        if ($("#moving_page").is(":visible")) {
          $("#moving_page").hide();
          $("#moving_page").off({ mousemove: m });
        }
      }
      $("#moving_page").on({
        mousemove: m,
        mouseup: mm
      });
    });
  },
  beforeDestroy() {
    this.offEvent();
  }
};
export default InfoBoxComp;
</script>

<style lang="scss" scoped>
.device-label-left {
  left: -51.5% !important;
}
table > tr {
  > td.hover-box {
    cursor: pointer;
    position: relative;
  }
  > td.hover-box .orange-box {
    display: none;
    position: absolute;
    white-space: normal;
    width: 160px;
    border-radius: 5px;
    z-index: 2;
  }
  > td.hover-box:hover .orange-box {
    display: inline-block;

    top: -50px;
    left: 19px;
  }
}

.isdevice-active-btn {
  color: red;
  padding-right: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  i {
    font-size: 14px;
    vertical-align: middle;
    padding-left: 3px;
  }
}
</style>
