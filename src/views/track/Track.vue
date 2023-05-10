<template>
  <section class="track-content" style="height: 100%; width: 100%">
    <div class="btn-amap-satellite" v-show="theMap == 'a-map'">
      <el-button @click="isSatellite1 = isSatellite1 ? false : true">
        {{ $t(isSatellite1 ? "playback.normal" : "playback.satellite") }}
      </el-button>
    </div>
    <div class="btn-satellite" v-show="theMap == 'google-map'">
      <el-button class="btn-show-satellite small" @click="showSatellite">
        {{ $t(isSatellite ? "playback.satellite" : "playback.normal") }}
      </el-button>
    </div>
    <!--切换地图 end-->
    <span
      style="position: absolute; margin-left: 60px; margin-top: 25px; z-index: 888"
    >
      <div class="circle-btn">{{ refreshTime }}</div>
      <div
        :class="['circle-btn', isStreet ? 'active' : '']"
        @click="isStreet = isStreet ? false : true"
      >
        <i class="iconfont icon-yanjing"></i>
      </div>
      <div
        :class="['circle-btn', isMeasureLine ? 'active' : '']"
        @click="measureLine"
        v-show="theMap != 'open-street-map'"
      >
        <i class="iconfont icon-chizi_o"></i>
      </div>
    </span>
    <!--切换地图 start-->
    <span
      class="white"
      style="position: absolute; margin-left: 60px; margin-top: 66px; z-index: 999"
    >
      <!-- 之前的只有两种地图切换 -->
      <!-- 现在显示4种 start -->
      <select class="select-map" v-model="theMap" @change="changeMapType">
        <option
          v-for="(item, idx) in theMapLists"
          :key="idx"
          :value="item.name"
          :class="['selected', idx == currentMap ? 'active' : '']"
          >{{ item.text }}</option
        >
      </select>
      <!-- end -->
    </span>
    <!--地图和街景 start-->
    <div
      style="height: 100%; width: 100%; overflow-x: hidden; overflow-y: hidden; display: flex"
    >
      <street-view
        :style="{
          width: isStreet ? '50%' : '',
          display: isStreet ? 'inline-block' : 'none',
          flex: 1
        }"
        :map-name="mapName"
        :lat="lat"
        :lng="lng"
        :is-show="isStreet"
        :the-map="theMap"
      ></street-view>
      <component
        :is="theMap"
        :map-name="mapName"
        @map-zoom="onMapZoom"
        :style="{
          width: isStreet ? '50%' : '100%',
          display: 'inline-block',
          flex: 1
        }"
        :is-satellite="isSatellite1"
      ></component>
    </div>
    <!--地图和街景 end-->
    <info-box
      :device-name="deviceName"
      :map-name="mapName"
      :device-imei="imei"
    ></info-box>
    <device-dialog></device-dialog>
  </section>
</template>

<script>
import DeviceDialog from "@/pages/DeviceDialog/index.vue";
import DefenseDialog from "@/components/DefenseDialog/DefenseDialog";
import StreetView from "@/components/map/StreetView";
import mapUtil from "@/utils/mapUtil.js";
import LoginHelper from "@/utils/loginHelper.js";
import InfoBox from "@/components/map/InfoBoxComp";
import baiduMapComp from "@/components/map/BaiduMapComp";
import bingMapComp from "@/components/map/BingMapComp";
import AMapComp from "@/components/map/AMapComp";
//
import googleMapComp from "@/components/map/GoogleMapComp";
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
import { updateDevice } from "@/api/monitor.js";
export default {
  name: "Track",
  components: {
    "device-dialog": DeviceDialog,
    "street-view": StreetView,
    "defense-dialog": DefenseDialog,
    "info-box": InfoBox,
    "baidu-map": baiduMapComp,
    "bing-map": bingMapComp,
    "google-map": googleMapComp,
    "a-map": AMapComp,
    "open-street-map": OpenStreetMapComp
  },
  data: () => ({
    // theMap: "baidu-map", //当前地图
    theMap: "",
    mapOption: {}, //地图数据
    imei: "", //设备号
    refreshInterval: null,
    isStreet: false, //是否显示街景
    refreshTime: 5,
    lat: 0,
    lng: 0,
    mapName: "track",
    deviceName: "",
    deviceImei: "",
    currentMap: 0,
    theMapLists: "",
    isSatellite: false,
    isSatellite1: false,
    isMeasureLine: false
  }),
  watch: {
    $route(to, from) {
      // console.log(to, from);
    }
  },
  methods: {
    changeMapType(e) {
      // console.log(e);
      // 新增的 start
      var idx = e.target.options.selectedIndex;
      this.currentMap = idx;

      const query = JSON.parse(JSON.stringify(this.$route.query));
      query.mapkey = e.target.options.selectedIndex;
      this.$router.push({ path: this.$route.path, query });

      var theMapList = this.$t("playback.theMapList");
      this.theMap = theMapList[idx].name;
      // end
      //切换地图
      // this.theMap = this.theMap == "baidu-map" ? "bing-map" : "baidu-map";
      var that = this;
      setTimeout(function() {
        that.dealDevice(that.deviceImei);
      }, 2000);
    },
    dealDevice(imei) {
      //获取当前设备信息
      // console.log(imei);
      this.imei = imei;
      updateDevice({ deviceImei: imei }).then(res => {
        if (res.errCode == "200") {
          var op = res.data;
          setTimeout(() => {
            mapUtil.disposeDeviceIcon(op.info, false);
            this.dealInfoBox(op);
            this.app.$emit("update-infobox", op, this.mapName, this.theMap);
            this.refreshInfoBox();
          }, 900);
        }
      });
    },
    measureLine() {
      //测量距离
      this.app.$emit("map-operation", {
        action: "measure-line",
        mapName: this.mapName
      });
      // if (this.theMap == "open-street-map") {
      //   this.isMeasureLine = this.isMeasureLine ? false : true;
      //   if (this.isMeasureLine) {
      //     this.app.$emit("map-operation", {
      //       action: "measure-line",
      //       mapName: this.mapName,
      //     });
      //   } else {
      //     this.app.$emit("map-operation", {
      //       action: "off-measure-line",
      //       mapName: this.mapName,
      //     });
      //   }
      // } else {
      //   this.app.$emit("map-operation", {
      //     action: "measure-line",
      //     mapName: this.mapName,
      //   });
      // }
    },
    showSatellite() {
      this.isSatellite = !this.isSatellite;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "show-weixing"
      });
    },
    dealInfoBox(op) {
      // console.log(op);
      //处理当前设备信息
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        this.lat = op.location.lat;
        this.lng = op.location.lon;
      }
      var device = {
        bdlat: op.location.bdlat,
        bdlng: op.location.bdlng,
        course: op.info.course,
        deviceImei: op.deviceImei,
        icon: op.info.icon,
        lat: op.location.lat,
        lng: op.location.lon,
        locateTime: op.info.locateTime,
        name: op.info.name,
        signalTime: op.info.signalTime,
        sts: op.info.sts,
        stsNum: op.info.stsNum,
        iconPath: op.info.iconPath,
        selectTag: op.info.selectTag
      };
      // this.lat = op.location.bdlat;
      // this.lng = op.location.bdlng;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-marker",
        lat: this.lat,
        lng: this.lng,
        // icon: mapUtil.getMarkerIcon(device),
        icon: device.iconPath,
        title: "",
        rotation: op.info.course,
        data: device,
        item: device
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-zoom",
        zoom: 16
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        lat: this.lat,
        lng: this.lng
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "select-marker",
        data: device,
        prop: "deviceImei"
      });
    },
    showStreet() {
      //显示街景
      this.isStreet = this.isStreet ? false : true;
    },
    dealInfoxBoxData(op, mapName) {
      // console.log(op, mapName);
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        this.lat = op.location.lat;
        this.lng = op.location.lon;
      }
      //更新信息框信息
      if (mapName == this.mapName) {
        var device = {
          bdlat: op.location.bdlat,
          bdlng: op.location.bdlng,
          course: op.info.course,
          deviceImei: op.deviceImei,
          icon: op.info.icon,
          lat: op.location.lat,
          lng: op.location.lon,
          locateTime: op.info.locateTime,
          name: op.info.name,
          signalTime: op.info.signalTime,
          sts: op.info.sts,
          stsNum: op.info.stsNum,
          iconPath: op.info.iconPath,
          selectTag: op.info.selectTag
        };
        // this.lat = op.location.bdlat;
        // this.lng = op.location.bdlng;
        // this.app.$emit("map-operation", {
        //   mapName: this.mapName,
        //   action: "set-center",
        //   lat: this.lat,
        //   lng: this.lng,
        // });
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-run-line",
          lat: this.lat,
          lng: this.lng
        });
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "move-marker",
          lat: this.lat,
          lng: this.lng,
          // icon: mapUtil.getMarkerIcon(device),
          icon: op.info.iconPath,
          title: "",
          rotation: op.info.course,
          item: device
        });
      }
    },
    onMapZoom() {
      //放大地图
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        lat: this.lat,
        lng: this.lng
      });
    },
    listenEvent() {
      this.app.$on("infobox-data", this.dealInfoxBoxData);
      this.app.$on("show-street-view", this.showStreet);
    },
    offEvent() {
      this.app.$off("infobox-data", this.dealInfoxBoxData);
      this.app.$off("show-street-view", this.showStreet);
    },
    //更新地图设备信息
    refreshInfoBox() {
      var that = this;
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }
      this.refreshInterval = setInterval(function() {
        if (that.refreshTime == 0) {
          that.app.$emit(
            "refresh-infobox",
            {
              deviceImei: that.deviceImei
            },
            that.mapName,
            that.theMap
          );
          that.refreshTime = 5;
        } else {
          that.refreshTime--;
        }
      }, 1000);
    },
    getDefaultMap() {
      var localLanguage = (
        navigator.language || navigator.browserLanguage
      ).toLowerCase();
      console.log(localLanguage);
      if (localLanguage == "zh-cn") {
        this.theMap = "baidu-map";
        this.currentMap = 0;
      } else {
        this.theMap = "google-map";
        this.currentMap = 3;
      }
    }
  },
  mounted() {
    this.theMapLists = this.$t("playback.theMapList");
    var that = this;
    LoginHelper.getLogo();

    this.listenEvent();
    if (this.$route.query.deviceImei) {
      this.deviceImei = this.$route.query.deviceImei;
      this.dealDevice(this.deviceImei);
      this.$nextTick(function() {
        document.title = `${that.deviceImei.substring(
          that.deviceImei.length - 6
        )}-${that.$t("common.track")}`;
        that.app.$emit("refresh-login-time");
      });
    }
    this.theMap = "baidu-map";
    if (this.$route.query.mapkey) {
      this.currentMap = this.$route.query.mapkey;
      this.theMap = this.$t("playback.theMapList")[this.currentMap].name;
    } else {
      // 判断当前浏览器使用的语言，国外的就默认显示谷歌地图
      this.getDefaultMap();
    }
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      this.refreshInterval = clearInterval(this.refreshInterval);
    }
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.select-map {
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  height: 30px;
  width: 150px;
}
.btn-amap-satellite {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 999;
}
.selected.active {
  color: #0066ff;
  font-weight: bold;
}
.btn-satellite {
  position: absolute;
  right: 60px;
  top: 10px;
  z-index: 999;

  .btn-show-satellite {
    background: none rgb(255, 255, 255);
    border: 0px;
    padding: 0px;
    text-transform: none;
    -webkit-appearance: none;
    position: absolute;
    cursor: pointer;
    user-select: none;
    border-radius: 2px;
    height: 40px;
    width: 50px;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
    overflow: hidden;
    top: 0px;
    right: 0px;
  }
}
</style>
<style lang="scss">
.track-content {
  .leaflet-popup-content-wrapper {
    background: unset !important;
    color: unset;
    box-shadow: unset !important;
  }
  .leaflet-popup-tip {
    background: unset !important;
    color: unset;
    box-shadow: unset !important;
  }
}
</style>
