<template>
  <section
    class="location1-content"
    style="height: 100%; width: 100%; overflow: hidden"
  >
    <span
      class="map-type-choose"
      style="position: absolute; z-index: 9999; right: 120px; top: 17px"
    >
      <!-- 地图切换switch start-->
      <el-popover placement="bottom" trigger="hover">
        <ul
          class="map-type"
          @click="changeMapType"
          style="padding: 0; margin: 0"
        >
          <li
            v-for="(item, idx) in $t('playback.theMapList')"
            :key="idx"
            :data-index="item.name"
          >
            <img
              :src="require('@/assets/img/map/' + item.img + '.png')"
              alt=""
            />
            {{ item.text }}
            <span
              ><i
                :class="['iconfont', currentMap == idx ? 'el-icon-check' : '']"
                style="font-weight: bold"
              ></i
            ></span>
          </li>
        </ul>
        <span
          slot="reference"
          style="cursor: pointer; padding: 9px 12px; background: #fff; color: #000; box-shadow: 0 2px 10px 0 rgb(0 0 0 / 30%)"
        >
          <i class="el-icon-copy-document map-type-icon" slot="reference"></i>
          <span style="font-size: 14px">{{ $t("common.maptype") }}</span>
        </span>
      </el-popover>
      <!-- 地图切换switch end-->
    </span>
    <!--切换地图 end-->
    <span
      style="position: absolute; margin-left: 60px; margin-top: 15px; z-index: 888"
    >
      <div class="circle-btn">{{ refreshTime }}</div>
      <div
        :class="['circle-btn', isStreet ? 'active' : '']"
        @click="isStreet = isStreet ? false : true"
      >
        <i class="iconfont icon-yanjing"></i>
      </div>
      <div
        class="circle-btn"
        @click="measureLine"
        v-show="theMap != 'open-street-map'"
      >
        <i class="iconfont icon-chizi_o"></i>
      </div>
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
    <info-box
      :map-name="mapName"
      :device-imei="imei"
      style="display: inline-block"
    ></info-box>
  </section>
</template>

<script>
import StreetView from "@/components/map/StreetView";
import mapUtil from "@/utils/mapUtil.js";
import InfoBox from "@/components/map/InfoBoxComp";
import baiduMapComp from "@/components/map/BaiduMapComp";
import bingMapComp from "@/components/map/BingMapComp";
import AMapComp from "@/components/map/AMapComp";
import googleMapComp from "@/components/map/GoogleMapComp";
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
import { updateDevice } from "@/api/monitor.js";
export default {
  name: "Location1",
  components: {
    "street-view": StreetView,
    "info-box": InfoBox,
    "baidu-map": baiduMapComp,
    "bing-map": bingMapComp,
    "a-map": AMapComp,
    "google-map": googleMapComp,
    "open-street-map": OpenStreetMapComp
  },
  data: () => ({
    //当前地图
    theMap: "",
    mapOption: {}, //地图数据
    imei: JSON.parse(window.localStorage.getItem("carweb_user")).deviceImei,
    refreshInterval: null,
    isStreet: false, //是否显示街景
    refreshTime: 9,
    lat: 0,
    lng: 0,
    mapName: "location1",
    theMapLists: "",
    currentMap: 0,
    isMeasureLine: false
  }),
  methods: {
    getTheMapCurrent(name) {
      // console.log(name);
      let theMapList = this.$t("playback.theMapList");
      for (let i = 0; i < theMapList.length; i++) {
        if (name == theMapList[i].name) {
          return theMapList[i].num;
        }
      }
      return "";
    },
    //切换地图
    changeMapType(e) {
      // var idx = e.target.options.selectedIndex;
      // console.log(idx);
      // this.currentMap = idx;
      let theMapList = this.$t("playback.theMapList");
      let name = e.target.dataset.index.trim();
      this.currentMap = this.getTheMapCurrent(name);
      // 加上路由
      const query = JSON.parse(JSON.stringify(this.$route.query));
      // console.log(query);
      query.mapkey = this.currentMap;
      this.$router.push({ path: this.$route.path, query: query });
      //
      // var theMapList = this.$t("playback.theMapList");
      this.theMap = theMapList[this.currentMap].name;
      var that = this;
      setTimeout(function() {
        that.dealDevice(that.imei);
      }, 2000);
    }, //获取当前设备信息
    dealDevice(imei) {
      console.log(imei);
      this.imei = imei;
      updateDevice({ deviceImei: imei }).then(res => {
        if (res.errCode == "200") {
          var op = res.data;
          setTimeout(() => {
            this.dealInfoBox(op);
            this.app.$emit("update-infobox", op, this.mapName, this.theMap);
            this.refreshInfoBox();
          }, 900);
        }
      });
    },
    measureLine() {
      this.app.$emit("map-operation", {
        action: "measure-line",
        mapName: this.mapName
      });
      //测量地图距离
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
    }, //处理当前设备信息
    getMapLatLng(op) {
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        this.lat = op.location.lat;
        this.lng = op.location.lon;
      }
    },
    dealInfoBox(op) {
      // console.log(op);
      // 地图不同坐标系不同
      this.getMapLatLng(op);
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
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-marker",
        lat: this.lat,
        lng: this.lng,
        icon: mapUtil.getMarkerIcon(device),
        // icon: op.info.iconPath,
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

      // this.app.$emit("map-operation", {
      //   mapName: this.mapName,
      //   action: "center-zoom",
      //   lat: this.lat,
      //   lng: this.lng,
      //   zoom: 16,
      // });
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
      this.getMapLatLng(op);
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
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "set-center",
          lat: this.lat,
          lng: this.lng
        });
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
          icon: mapUtil.getMarkerIcon(device),
          // iconPath: device.iconPath,
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
    listenEvent() {
      this.app.$on("infobox-data", this.dealInfoxBoxData);
      this.app.$on("show-street-view", this.showStreet);
    },
    offEvent() {
      this.app.$off("infobox-data", this.dealInfoxBoxData);
      this.app.$off("show-street-view", this.showStreet);
    }, //更新地图设备信息
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
    },
    getDefaultMap() {
      // 根据浏览器语言设置地图的显示
      var localLanguage = (
        navigator.language || navigator.browserLanguage
      ).toLowerCase();
      // console.log(localLanguage);
      if (localLanguage == "zh-cn") {
        this.theMap = "baidu-map";
        this.currentMap = 0;
        // this.$router.push({
        //   query: { ...this.$route.query, mapkey: 0 },
        // });
      } else {
        this.theMap = "google-map";
        this.currentMap = 3;
      }
    }
  },
  mounted() {
    // console.log(...this.$route.query);
    this.theMapLists = this.$t("playback.theMapList");
    //
    if (this.$route.query.mapkey) {
      this.currentMap = this.$route.query.mapkey;
      this.theMap = this.$t("playback.theMapList")[this.currentMap].name;
    } else {
      this.getDefaultMap();
    }
    this.listenEvent();
    this.dealDevice(this.imei);
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      this.refreshInterval = clearInterval(this.refreshInterval);
    }
    this.offEvent();
  }
};
</script>

<style>
.selected.active {
  color: #0066ff;
  font-weight: bold;
}
</style>

<style lang="scss">
.location1-content {
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
