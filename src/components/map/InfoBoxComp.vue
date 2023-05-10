<template>
  <section :id="'info_box_' + mapName" style="display: none">
    <!--监控跟踪地图信息框 start-->
    <div
      class="info-box"
      v-if="mapName != 'playback' && mapName != 'circuit'"
      :title="mapName"
    >
      <div class="info-box-header">
        <span class="header-title">{{ devInfo.deviceName }}</span>
        <span class="close-btn" :title="mapName"></span>
      </div>

      <div class="info-box-body">
        <div class="info-box-tip">
          <span>({{ deviceImei }})</span>
          <span v-if="devInfo.enableSts == 1">{{ devInfo.status }}</span>
          <!-- 设备激活 -->
          <span v-if="devInfo.enableSts != 1" class="isdevice-active-btn"
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
        <table
          style="height: calc(100% - 20px)"
          class="form-table-track"
          v-show="
            (devInfo.enableSts == 1 && !devInfo.isplatformExpireTime) ||
              (devInfo.enableSts == 1 && !devInfo.enableDate) ||
              userId == 10000035
          "
        >
          <tr>
            <td colspan="2" style="white-space: normal; word-break: break-all">
              <!-- baidu -->
              <span v-show="!isdetailAddress">
                <span v-show="isaddress"
                  >{{ devInfo.locaAddress }}[{{ $t("infobox.poiType") }}:{{
                    devInfo.locaWay
                  }}]</span
                >
                <span
                  class="show-address"
                  v-show="!isaddress"
                  style="cursor: pointer"
                  >{{ $t("common.showAddress") }}>>></span
                >
                <button
                  v-if="mapTypeName == 'google-map'"
                  class="btnGoogleAddress"
                >
                  Detail Address
                </button>
              </span>
              <!-- google -->
              <span v-show="isdetailAddress">
                <span
                  >{{ googleAddress }}[{{ $t("infobox.poiType") }}:{{
                    devInfo.locaWay
                  }}]</span
                >
                <button v-if="mapTypeName == 'google-map'" class="btnBack">
                  Back
                </button>
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
              {{ $t("infobox.voltage") }}{{ $t("infobox.power") }}:
              {{ devInfo.voltage }}{{ devInfo.power }}
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
            <!-- 温度 -->
            <td v-show="devInfo.temperature">
              <img src="@/assets/img/infobox/wendu.png" alt="" />
              {{ $t("infobox.temperature") }}: {{ devInfo.temperature }}
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
        <button title="track">
          <img src="@/assets/img/infobox/track.png" />
          {{ $t("infobox.track") }}
        </button>
        <button title="defense">
          <img src="@/assets/img/infobox/defense.png" v-show="!isDefense" />
          <img src="@/assets/img/infobox/undefense.png" v-show="isDefense" />
          {{ $t(isDefense ? "infobox.undefense" : "infobox.defense") }}
        </button>
        <button title="playback">
          <img src="@/assets/img/infobox/playback.png" />
          {{ $t("infobox.playback") }}
        </button>
        <button title="more">
          <img src="@/assets/img/infobox/more.png" />
          {{ $t("infobox.more") }}
        </button>
      </div>
      <div
        class="info-box-footer"
        v-if="mapName.indexOf('Fence') >= 0"
        :title="deviceImei"
      >
        <button title="track">
          <img src="@/assets/img/infobox/track.png" />
          {{ $t("infobox.track") }}
        </button>
        <button title="playback">
          <img src="@/assets/img/infobox/playback.png" />
          {{ $t("infobox.playback") }}
        </button>
        <button title="more">
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
        <button title="street">
          <!-- <i class="iconfont icon-view"></i> -->
          <i class="iconfont icon-yanjing"></i>
          {{ $t("infobox.street") }}
        </button>
        <button title="playback">
          <img src="@/assets/img/infobox/playback.png" />
          {{ $t("infobox.playback") }}
        </button>
        <button title="more">
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
        <button title="street">
          <i class="iconfont icon-yanjing"></i>
          {{ $t("infobox.street") }}
        </button>
        <button title="playback">
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
        <button title="street">
          <i class="iconfont icon-yanjing"></i>
          {{ $t("infobox.street") }}
        </button>
        <button title="track">
          <img src="@/assets/img/infobox/track.png" />
          {{ $t("infobox.track") }}
        </button>
        <button title="defense">
          <img src="@/assets/img/infobox/defense.png" v-show="!isDefense" />
          <img src="@/assets/img/infobox/undefense.png" v-show="isDefense" />
          {{ $t(isDefense ? "infobox.undefense" : "infobox.defense") }}
        </button>
        <button title="playback">
          <img src="@/assets/img/infobox/playback.png" />
          {{ $t("infobox.playback") }}
        </button>
      </div>
      <div class="info-box-triangle">
        <span></span>
      </div>
    </div>
    <!--监控跟踪地图信息框 end-->
    <!--回放地图信息框 start-->
    <div
      class="info-box"
      v-if="mapName == 'playback'"
      style="width: 240px"
      :title="mapName"
    >
      <div class="info-box-body" style="padding: 8px; border-radius: 3px">
        <table>
          <tr>
            <td>{{ $t("common.deviceName") }}:</td>
            <td style="white-space: normal">
              {{ deviceName }}
              <span
                style="height: 14px; width: 14px; float: right"
                class="close-btn"
                :title="mapName"
              ></span>
            </td>
          </tr>
          <tr>
            <td>{{ $t("infobox.locaTime") }}:</td>
            <td>{{ playInfo.locaTime }}</td>
          </tr>
          <tr>
            <td>{{ $t("infobox.speed") }}:</td>
            <td>{{ playInfo.speed }}</td>
          </tr>
          <tr>
            <td>{{ $t("infobox.runTime") }}:</td>
            <td>{{ playInfo.runTime ? playInfo.runTime : 0 }}</td>
          </tr>
          <tr>
            <td>{{ $t("infobox.mileage") }}:</td>
            <td>{{ playInfo.mileage }}</td>
          </tr>
          <tr v-if="playInfo.title">
            <td>{{ $t("common.note") }}:</td>
            <td>{{ playInfo.title }}</td>
          </tr>
          <tr v-if="playInfo.altitude">
            <td>{{ $t("trackTable.altitude") }}:</td>
            <td>
              {{ playInfo.altitude
              }}{{ playInfo.altitude != "--" ? $t("infobox.meter") : "" }}
            </td>
          </tr>
          <tr v-if="playInfo.accuracyType">
            <td>{{ $t("trackTable.accuracyType") }}:</td>
            <td>{{ playInfo.accuracyType }}</td>
          </tr>
          <tr v-if="playInfo.temperature">
            <td>{{ $t("trackTable.temperature") }}:</td>
            <td>{{ playInfo.accuracyType }}</td>
          </tr>
        </table>
      </div>
      <div class="info-box-triangle">
        <span
          :style="{
            backgroundImage:
              mapName == 'deviceTrack'
                ? 'linear-gradient(to right bottom, transparent 51%, #d9dafd 51%)'
                : 'linear-gradient(to right bottom, transparent 51%, #fff 51%)'
          }"
        ></span>
      </div>
    </div>
    <!--回放地图信息框 end-->
  </section>
</template>

<script>
import mapUtil from "@/utils/mapUtil.js";
import { updateDevice } from "@/api/monitor.js";
import { doDeviceActive } from "@/api/common.js";
var InfoBoxComp = {
  name: "InfoBox",
  props: {
    mapName: {
      type: String,
      default: ""
    },
    deviceName: {
      type: String,
      default: ""
    },
    deviceImei: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    isaddress: false,
    devInfo: {
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
      temperature: ""
    },
    address: "",
    googleAddress: "",
    lat: 0,
    lng: 0,
    isDefense: false,
    isDefensePage: false,
    playInfo: {
      locaTime: "",
      speed: "",
      locaWay: "",
      runTime: "",
      mileage: "",
      title: "",
      altitude: "",
      accuracyType: "",
      temperature: ""
    },
    signalIcon: 0,
    isShowAdd: false,
    locaWay1: "",
    mapTypeName: "",
    currentMap: "",
    isdetailAddress: false,
    googleLat: 0,
    googleLng: 0,
    deviceAddress: {
      lat: 0,
      lng: 0
    },
    optionsAll: {},
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId
  }),
  watch: {
    mapTypeName() {
      this.currentMap = this.getTheMapIndex(this.mapTypeName);
    }
  },
  computed: {
    googleAdd() {
      return this.googleAddress;
    }
  },
  methods: {
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
      this.app.$emit("show-defense-dialog", {
        imei: this.deviceImei,
        isDefense: this.isDefense
      });
    },
    doPlayback() {
      window.location.hash = "#/home/playback?deviceImei=" + this.deviceImei;
    },
    doTrack() {
      window.location.hash = "#/home/track?deviceImei=" + this.deviceImei;
    },
    showDeviceDetail() {
      this.app.$emit("location-device-page");
    },

    getInfoBox(options, mapName, theMap) {
      this.optionsAll = options;
      this.googleLat = options.location.lat;
      this.googleLng = options.location.lon;
      // console.log(options);
      this.mapTypeName = theMap;
      if (mapName != this.mapName && this.deviceImei == options.deviceImei)
        return;
      var that = this;
      this.signalIcon = parseInt(options.gsmSignal / 8);
      //this.deviceImei = options.deviceImei;
      this.isDefense = options.defense.isDefense;
      // console.log("dada", new Date().getTime() - options.info.accTime);
      // console.log(mapUtil.cnTime(new Date().getTime() - options.info.accTime));
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
        // locaAddress: ""
        temperature:
          options.temperature && options.temperature != -1
            ? options.temperature
            : "",
        enableSts: options.info.enableSts,
        enableDate: options.info.enableDate
      };
      // console.log(infoBoxData);
      //
      var flow, plat;
      var flag = false;
      var flag1 = false;
      plat = this.judgmentTheTime(options.info.platExpire);
      if (options.info.flowFlag && options.info.flowExpire) {
        flow = this.judgmentTheTime(options.info.flowExpire);
        if (flow < plat && flow < 0) {
          flag = true;
          infoBoxData.isflowExpireTime = flag;
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
        if (!infoBoxData.isflowExpireTime) {
          infoBoxData.platTime = plat;
        }
      }
      //
      this.devInfo = infoBoxData;
      var lat, lng;
      if (this.mapTypeName == "baidu-map") {
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
      // lng经度，lat纬度
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
        this.lat = lat;
        this.lng = lng;
      }
      if (lng && lat && that.isaddress) {
        if (options.info.stsNum == 1) {
          that.getTheDeviceAddress();
        }
        // console.log('1');
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
    },
    offInfoBoxOp() {
      var elmts = document.getElementsByClassName("info-box");
      if (elmts.length > 0) {
        for (var i = 0; i < elmts.length; i++) {
          if (!elmts[i].hidden) {
            elmts[i].onclick = null;
          }
        }
      }
    },
    getTheDeviceAddress() {
      // 点击才显示地址
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
            this.devInfo.locaAddress = this.address;
            setTimeout(() => {
              this.showInfobox(lat, lng, this.optionsAll);
            }, 500);
          }
        });
      } else {
        this.isaddress = true;
        setTimeout(() => {
          this.showInfobox(lat, lng, this.optionsAll);
        }, 500);
        this.devInfo.locaAddress =
          this.locaWay1 == "基站"
            ? this.$t("common.addressFail")
            : this.locaWay1 == "卫星"
            ? this.$t("common.addressFail2")
            : this.$t("common.addressFail1");
      }
    },
    listenGoogleAddress() {
      // 控制谷歌转换地址 start
      var that = this;
      const btnGoogle = document.querySelector(".btnGoogleAddress");
      const btnBack = document.querySelector(".btnBack");
      // console.log(btnGoogle);
      // console.log(btnBack);
      if (btnGoogle && btnBack) {
        btnGoogle.onclick = function(e) {
          // console.log(that.mapTypeName);
          // console.log("chufa");
          that.isdetailAddress = true;
          if (that.mapTypeName == "google-map") {
            // console.log("google");
            that.googleAddress = that.$t("common.loading");
            that.getGoogleLocation(that.googleLat, that.googleLng, address => {
              // console.log(address);
              that.googleAddress = address;
            });
          }
          e.preventDefault();
        };
        btnBack.onclick = function(e) {
          that.isdetailAddress = false;
          e.preventDefault();
        };
      }
      // 控制谷歌转换地址 end
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
    listenInfoBoxOp(op) {
      var that = this;
      var infobox = document.querySelectorAll(".info-box");
      for (let i = 0; i < infobox.length; i++) {
        infobox[i].onclick = function(e) {
          e.preventDefault();
        };
      }
      var closeBtn = document.querySelectorAll(".info-box-header>.close-btn");
      for (let i = 0; i < closeBtn.length; i++) {
        closeBtn[i].onclick = function(e) {
          var mapName = this.title;
          that.app.$emit("map-operation", {
            action: "hide-infobox",
            mapName: mapName
          });
          e.preventDefault();
        };
      }

      // 2022-5-30补充激活的
      if (this.devInfo.enableSts != 1) {
        var closeBtn1 = document.querySelectorAll(
          ".info-box-tip>.isdevice-active-btn"
        );
        for (let i = 0; i < closeBtn1.length; i++) {
          closeBtn1[i].onclick = function(e) {
            // console.log(e);
            that.dealDeviceActive();
            e.preventDefault();
          };
        }
      }
      // 2022-8-24 点击才显示地址
      const showAddress = document.querySelector(".show-address");
      showAddress.onclick = function(e) {
        console.log("e", e);
        that.getTheDeviceAddress();
        e.preventDefault(e);
      };

      var elmts = document.querySelectorAll(".info-box-footer>button");

      for (let i = 0; i < elmts.length; i++) {
        elmts[i].onclick = function(e) {
          var imei = this.parentElement.title;
          switch (this.title) {
            case "playback": //跳转到回放界面
              window.open(
                window.location.origin +
                  window.location.pathname +
                  `#/playback?deviceImei=${imei}&mapkey=${that.currentMap}`
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
            case "track": //跳转到跟踪界面
              window.open(
                window.location.origin +
                  window.location.pathname +
                  "#/track?deviceImei=" +
                  imei
              );
              break;
            case "street": //是否显示街景
              that.app.$emit(
                "show-street-view",
                op.location.bdlat,
                op.location.bdlng
              );
              break;
          }
          e.preventDefault();
        };
      } //for
      that.listenGoogleAddress();
    },
    showInfobox(lat, lng, options) {
      var elmt = document.getElementById(`info_box_${this.mapName}`);
      var content = elmt.innerHTML;
      var html = `<div style="display:inline-block;position:absolute;left: 50%;top:50%;transform: translate(-50%, -120%);">${content}</div>`;
      if (
        this.mapTypeName == "google-map" &&
        (this.mapName == "track" ||
          this.mapName == "location1" ||
          this.mapName == "deviceTrack")
      ) {
        html = `<div style="display:inline-block;">${content}</div>`;
      }
      if (
        (this.mapTypeName == "bing-map" && this.mapName == "track") ||
        (this.mapTypeName == "bing-map" && this.mapName == "deviceTrack") ||
        (this.mapTypeName == "bing-map" && this.mapName == "location1")
      ) {
        html = `<div style="display:inline-block;position:absolute;top:50%;left:50%;transform: translate(-54%, -120%);">${content}</div>`;
      }
      if (this.mapTypeName == "a-map" && this.mapName == "track") {
        html = `<div style="display:inline-block;position:absolute;top:50%;left:50%;transform: translate(-51%, -112%);">${content}</div>`;
      }
      if (this.mapTypeName == "open-street-map" && this.mapName == "track") {
        html = `<div style="display:inline-block;position:absolute;top:50%;left:50%;transform: translate(-50.5%, -105%);">${content}</div>`;
      }
      //
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "show-infobox",
        infoContent: html,
        lat: lat,
        lng: lng,
        offsetX: 0,
        offsetY: 0,
        style: { border: "none", background: "transparent" }
      });
      var that = this;
      setTimeout(function() {
        that.listenInfoBoxOp(options);
      }, 100);
    },
    getDeviceInfo(data, mapName, theMap) {
      var that = this;
      this.mapTypeName = theMap;
      // console.log(theMap);
      if (
        this.deviceImei &&
        data.deviceImei &&
        this.mapName == mapName &&
        this.deviceImei == data.deviceImei
      ) {
        this.offInfoBoxOp();
        //this.deviceImei = data.deviceImei;
        updateDevice({ deviceImei: data.deviceImei }).then(res => {
          if (res.errCode == "200") {
            // mapUtil.disposeDeviceIcon(res.data.info, false);
            this.app.$emit("infobox-data", res.data, this.mapName);
            this.getInfoBox(res.data, this.mapName, this.mapTypeName);
          }
        });
      }
    }, //获取当前定位方式
    getLocaWay(locateSts) {
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
    getaCcuracyType(num) {
      // 拿到精度类型
      var list = this.$t("trackTable.accuracyTypeList");
      // console.log(list);
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == num) {
          return str + list[i].text;
        }
      }
      return "";
    },
    getAltitude(op, num) {
      // console.log(op, num);
      // 判断精度类型，海拔高度的显示
      switch (num) {
        case "0":
        case "-1":
          return this.$t("trackTable.nodata");
        case "1":
        case "2":
        case "4":
        case "5":
        case "6":
          return op.altitude;
        default:
          return 0;
      }
    },
    getTemperature(num) {
      switch (num) {
        case "-1":
          return this.$t("trackTable.nodata");
      }
    },
    doPlayInfoBox(op, title) {
      // console.log(op);
      //轨迹回放信息提示框位置的变化
      var lat, lng;
      op.theMap == "baidu-map" ? (lat = op.baiduPt.lat) : (lat = op.realPt.lat);
      op.theMap == "baidu-map" ? (lng = op.baiduPt.lng) : (lng = op.realPt.lng);
      var that = this;
      if (op) {
        this.playInfo = {
          locaTime: new Date(op.realTime).format("yyyy-MM-dd hh:mm:ss"),
          speed: op.speed + "km/h",
          locaWay: this.getLocaWay(op.locateSts),
          runTime: mapUtil.cnTime(op.totalRunTime),
          mileage: (op.totalDist * 0.001).toFixed(2) + "km",
          title: title ? title : "",

          accuracyType:
            op.accuracyType == "-1"
              ? that.$t("trackTable.nodata")
              : that.getaCcuracyType(op.accuracyType),
          temperature:
            op.temperature && op.temperature != "-1" ? op.temperature : ""
        };
        that.playInfo.altitude = that.getAltitude(op, op.accuracyType);
        //
        setTimeout(() => {
          var elmt = document.getElementById(`info_box_${this.mapName}`);
          var content = elmt.innerHTML;
          var marginTop;
          title
            ? (marginTop = 210)
            : that.playInfo.altitude || that.playInfo.accuracyType
            ? (marginTop = 190)
            : (marginTop = 130);
          if (this.playInfo.temperature) {
            marginTop = 230;
          }
          if (op.theMap == "open-street-map") {
            title
              ? (marginTop = 190)
              : that.playInfo.altitude || that.playInfo.accuracyType
              ? (marginTop = 150)
              : (marginTop = 130);
            if (this.playInfo.temperature) {
              marginTop = 210;
            }
          }
          let infoBoxWindow = null;
          // op.theMap == "google-map"
          //   ? `<div style="display:inline-block;">${content}</div>`
          //   : `<div style="display:inline-block;position:absolute;margin-left:-120px;margin-top:-${marginTop}px;">${content}</div>`;
          if (op.theMap == "google-map") {
            infoBoxWindow = `<div style="display:inline-block;margin-bottom:20px">${content}</div>`;
          } else if (op.theMap == "open-street-map") {
            infoBoxWindow = `<div style="display:inline-block;position:absolute;margin-left:-71px;margin-top:-${marginTop}px;">${content}</div>`;
          } else {
            infoBoxWindow = `<div style="display:inline-block;position:absolute;margin-left:-120px;margin-top:-${marginTop}px;">${content}</div>`;
          }
          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "show-infobox",
            // infoContent: `<div style="display:inline-block;position:absolute;margin-left:-120px;margin-top:-${title ? 180 : 130}px;">${content}</div>`,
            infoContent: infoBoxWindow,
            lat: lat,
            lng: lng,
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
      }
    },
    listenEvent() {
      this.app.$on("refresh-infobox", this.getDeviceInfo);
      this.app.$on("update-infobox", this.getInfoBox);
      this.app.$on("playback-infobox", this.doPlayInfoBox);
    },
    offEvent() {
      this.app.$off("refresh-infobox", this.getDeviceInfo);
      this.app.$off("update-infobox", this.getInfoBox);
      this.app.$off("playback-infobox", this.doPlayInfoBox);
    }
  },
  mounted() {
    setTimeout(() => {
      // this.listenGoogleAddress();
    }, 100);
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
export default InfoBoxComp;
</script>

<style lang="scss" scoped>
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
