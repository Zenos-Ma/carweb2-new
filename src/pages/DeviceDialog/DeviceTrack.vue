<template>
  <div
    class="device-track"
    style="overflow-x: hidden; overflow-y: hidden;position:relative"
  >
    <!--切换地图 start  switch-box white-->
    <!-- <span class="white" style="position: absolute; margin-left: 6rem; margin-top: 1rem;z-index:99">
      <select class="text-input small" v-model="theMap" @change="changeMapType">
        <option v-for="(item, idx) in theMapLists" :key="idx" :value="item.name" :class="['selected', idx == currentMap ? 'active' : '']">{{ item.text }}</option>
      </select>
    </span> -->
    <span
      class="map-type-choose"
      style="margin-left:1rem;margin-top:-2px;position:absolute;z-index:9999;left:50px;top:20px"
    >
      <!-- 地图切换switch start-->
      <el-popover placement="bottom" trigger="hover">
        <ul class="map-type" @click="changeMapType" style="padding:0;margin:0">
          <li
            v-for="(item, idx) in $t('playback.theMapList')"
            :key="idx"
            :data-index="item.name"
          >
            <img
              :src="require('@/assets/img/mapicon/' + item.img + '.png')"
              alt=""
            />
            {{ item.text }}
            <span
              ><i
                :class="['iconfont', currentMap == idx ? 'icon-check' : '']"
                style="font-weight:bold"
              ></i
            ></span>
          </li>
        </ul>
        <span
          slot="reference"
          style="cursor:pointer;padding:9px 12px;background:#fff;color:#000;box-shadow: 0 2px 10px 0 rgb(0 0 0 / 30%)"
        >
          <i class="el-icon-copy-document map-type-icon" slot="reference"></i>
          <span style="font-size: 14px;">{{ $t("common.maptype") }}</span>
        </span>
      </el-popover>
      <!-- 地图切换switch end-->
    </span>
    <!--切换地图 end-->
    <span
      style="position: absolute; margin-left: 60px;margin-top: 50px;z-index: 888;"
    >
      <div class="circle-btn">{{ refreshTime }}</div>
      <div
        :class="['circle-btn', isStreet ? 'active' : '']"
        @click="isStreet = isStreet ? false : true"
      >
        <i class="iconfont icon-view"></i>
      </div>
      <!-- <div class="circle-btn" @click="measureLine">
        <i class="iconfont icon-ruler"></i>
      </div> -->
    </span>
    <!--地图和街景 start-->
    <div
      style="height: 100%; width: 100%; overflow-x: hidden;overflow-y: hidden; display: flex; "
    >
      <street-view
        :style="{
          width: isStreet ? '50%' : '',
          display: isStreet ? 'inline-block' : 'none',
          flex: 1
        }"
        map-name="track"
        :lat="lat"
        :lng="lng"
        :is-show="isStreet"
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
      ></component>
    </div>
    <!--地图和街景 end-->
    <info-box :map-name="mapName" :device-imei="imei"></info-box>
    <defense-dialog map-name="deviceTrack"></defense-dialog>
  </div>
</template>

<script>
import DeviceDialog from "@/pages/DeviceDialog";
import DefenseDialog from "@/components/DefenseDialog/DefenseDialog.vue";
import InfoBox from "@/components/map/InfoBoxComp";
import StreetView from "@/components/map/StreetView";
import mapUtil from "@/utils/mapUtil.js";
import baiduMapComp from "@/components/map/BaiduMapComp";
import bingMapComp from "@/components/map/BingMapComp";
//
import AMapComp from "@/components/map/AMapComp";
import googleMapComp from "@/components/map/GoogleMapComp";
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
import { updateDevice } from "@/api/monitor.js";
export default {
  name: "DeviceTrack",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
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
    //当前地图
    theMap: "a-map",
    mapOption: {}, //地图数据
    imei: "",
    refreshInterval: null,
    isStreet: false, //是否显示街景
    refreshTime: 9,
    lat: 0,
    lng: 0,
    mapName: "deviceTrack",
    currentMap: 0,
    theMapLists: ""
  }),
  watch: {
    isShow() {
      if (!this.isShow) {
        this.clearRefresh();
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "clear-map"
        });
      }
    }
  },
  methods: {
    getTheMapCurrent(name) {
      // 通过地图名称拿到相应的idx
      // console.log(name);
      let theMapList = this.$t("playback.theMapList");
      for (let i = 0; i < theMapList.length; i++) {
        if (name == theMapList[i].name) {
          return theMapList[i].num;
        }
      }
      return "";
    },
    changeMapType(e) {
      // console.log(e);
      //切换地图
      // this.currentMap = e.target.options.selectedIndex;
      let name = e.target.dataset.index.trim();
      this.currentMap = this.getTheMapCurrent(name);
      this.theMap = this.theMapLists[this.currentMap].name;
      var that = this;
      setTimeout(function() {
        that.dealDevice(that.imei);
      }, 2000);
    },
    dealDevice(imei) {
      //获取当前设备信息
      var that = this;
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
      this.app.$emit("measure-line");
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
        lat: this.lat,
        lng: this.lng,
        locateTime: op.info.locateTime,
        name: op.info.name,
        signalTime: op.info.signalTime,
        sts: op.info.sts,
        stsNum: op.info.stsNum,
        iconPath: op.info.iconPath,
        selectTag: op.info.selectTag
      };
      console.log("chufa", this.lat, this.lng);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-marker",
        lat: this.lat,
        lng: this.lng,
        icon: mapUtil.getMarkerIcon(device),
        // icon: device.iconPath,
        title: "",
        rotation: op.info.course,
        data: device,
        item: device
      });
      // console.log("chufadaodi", this.mapName);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-zoom",
        zoom: 14
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        // lat: this.lat + 0.11,
        lat: this.lat,
        lng: this.lng
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "select-marker",
        data: device,
        prop: "deviceImei"
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "draw-run-line",
        lat: this.lat,
        lng: this.lng
      });
    }, //显示街景
    showStreet() {
      this.isStreet = this.isStreet ? false : true;
    },
    dealInfoxBoxData(op, mapName) {
      // console.log(op);
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        //
        // console.log("不是百度");
        this.lat = op.location.lat;
        this.lng = op.location.lon;
      }
      if (mapName == this.mapName && op.deviceImei == this.imei) {
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
          action: "draw-run-line",
          lat: this.lat,
          lng: this.lng
        });
        // 居中
        // this.app.$emit("map-operation", {
        //   mapName: this.mapName,
        //   action: "set-center",
        //   lat: this.lat,
        //   lng: this.lng,
        // });
        // this.app.$emit("map-operation", {
        //   mapName: this.mapName,
        //   action: "set-zoom",
        //   zoom: 16,
        // });
        //
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "move-marker",
          lat: this.lat,
          lng: this.lng,
          icon: mapUtil.getMarkerIcon(device),
          // icon: device.iconPath,
          title: "",
          rotation: op.info.course,
          item: device
        });
      }
    },
    onMapZoom() {
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        lat: this.lat,
        lng: this.lng
      });
    },
    clearRefresh() {
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }
    },
    listenEvent() {
      this.app.$on("refresh-current-dev1", this.refreshInfoBox);
      this.app.$on("close-dialog", this.clearRefresh);
      this.app.$on("infobox-data", this.dealInfoxBoxData);
      this.app.$on("show-street-view", this.showStreet);
      this.app.$on("device-dialog", this.dealDevice);
    },
    offEvent() {
      this.app.$off("refresh-current-dev1", this.refreshInfoBox);
      this.app.$off("close-dialog", this.clearRefresh);
      this.app.$off("infobox-data", this.dealInfoxBoxData);
      this.app.$off("show-street-view", this.showStreet);
      this.app.$off("device-dialog", this.dealDevice);
    }, //更新地图设备信息
    refreshInfoBox() {
      var that = this;
      this.clearRefresh();
      this.refreshInterval = setInterval(function() {
        if (that.refreshTime == 0) {
          that.app.$emit(
            "refresh-infobox",
            {
              deviceImei: that.imei
            },
            that.mapName,
            that.theMap
          );
          that.refreshTime = 9;
        } else {
          that.refreshTime--;
        }
      }, 1000);
    }
  },
  mounted() {
    this.theMapLists = this.$t("playback.theMapList");
    this.clearRefresh();
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
    this.clearRefresh();
  }
};
</script>

<style scoped>
.selected.active {
  color: #0066ff;
  font-weight: bold;
}
</style>

<style lang="scss">
.device-track {
  height: 520px;

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
