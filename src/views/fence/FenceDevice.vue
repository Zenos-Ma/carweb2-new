<template>
  <section class="fence-device layout-container">
    <div class="body-content-left" style="width: 350px">
      <!-- 用户树 -->
      <div class="form-card" style="height: calc(35% - 8px)">
        <div class="card-header">{{ $t("common.myCustomer") }}</div>
        <div
          class="card-body"
          style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; padding-right: 0"
        >
          <user-tree
            tree-name="monitor"
            :user-id.sync="userId"
            @usertree-select="onSelectUser"
          ></user-tree>
        </div>
      </div>
      <div class="move-bar-v"></div>
      <div class="form-card" style="height: 65%; padding-top: 0px">
        <!-- <div class="card-header"> -->
        <!-- <ul class="select-tabs">
            <li :class="[currentList == 0 ? 'active' : '']" @click="currentList = 0">{{ $t("common.deviceList") }}</li>
            <li :class="[currentList == 1 ? 'active' : '']" @click="currentList = 1">{{ $t("fencePolygon.fenceList") }}</li>
            <li v-show="deviceImei" :class="[currentList == 2 ? 'active' : '']" @click="currentList = 2">{{ $t("fenceDevice.linkFence") }}</li>
          </ul> -->
        <el-tabs v-model="currentList" @tab-click="changeTab">
          <el-tab-pane name="0" :label="$t('common.deviceList')"></el-tab-pane>
          <el-tab-pane
            name="1"
            :label="$t('fencePolygon.fenceList')"
          ></el-tab-pane>
          <el-tab-pane
            name="2"
            v-show="deviceImei"
            :label="$t('fenceDevice.linkFence')"
          ></el-tab-pane>
        </el-tabs>
        <!-- </div> -->
        <div class="card-body" v-show="currentList == '0'">
          <device-list
            :user-id.sync="userId"
            :btn-type="3"
            @devlist="onDevList"
            @do-dev-op="dealDevOp"
            @select-dev="onSelectDev"
            :device-imei.sync="deviceImei"
          ></device-list>
        </div>
        <div class="card-body" v-show="currentList == '1'">
          <div style="display: flex; align-items: center" class="card-top">
            <el-input
              size="small"
              :placeholder="$t('fence.fenceName')"
              v-model="searchFenceKey"
              style="flex: 1; margin-right: 8px"
              @keyup.enter="searchFenceList"
            />
            <el-button type="warning" @click="searchFenceList">{{
              $t("common.search")
            }}</el-button>
          </div>
          <fence-list
            :fence-list="fenceList"
            :link-list.sync="linkList"
            style="height: calc(100% - 24px)"
            :fence-id.sync="fenceId"
            @select-fence="showFence"
            @link-fence="onLinkFence"
            @unlink-fence="onUnLinkFence"
          ></fence-list>
        </div>
        <div class="card-body" v-show="currentList == '2'">
          <div style="display: flex; align-items: center" class="card-top">
            <el-input
              size="small"
              :placeholder="$t('fence.fenceName')"
              v-model="searchFenceKey1"
              style="flex: 1; margin-right: 8px"
              @keyup.enter="searchLinkList"
            />
            <el-button type="warning" @click="searchLinkList">{{
              $t("common.search")
            }}</el-button>
          </div>
          <fence-list
            :fence-list="linkList"
            :link-list.sync="linkList"
            style="height: calc(100% - 24px)"
            :fence-id.sync="fenceId"
            :is-tip="true"
            @select-fence="showFence"
            @link-fence="onLinkFence"
            @unlink-fence="onUnLinkFence"
            @select-area="showArea"
          ></fence-list>
        </div>
      </div>
    </div>
    <div class="move-bar-h"></div>
    <div class="form-card body-content-right" style="width: calc(100% - 350px)">
      <div class="card-header">
        {{ $t("fencePolygon.fenceMap") }}
        <span style="margin: 0 10px">
          {{ $t("fenceDevice.currentDevice") }}:
          <span style="font-weight: bold">{{ this.deviceImei }}</span>
        </span>
        <span style="margin: 0 10px" v-show="fenceId">
          {{ $t("fenceDevice.currentFence") }}:
          <span style="font-weight: bold">{{ this.fenceName }}</span>
          <el-button type="primary" size="small" @click="onOverView">{{
            $t("fenceDevice.devFence")
          }}</el-button>
        </span>
      </div>
      <!-- 地图显示 start-->
      <div class="card-body" style="padding: 0">
        <baidu-map :map-name="mapName"></baidu-map>
        <info-box1 :map-name="mapName" :device-imei="deviceImei"></info-box1>
      </div>
      <!-- 地图显示 end-->
    </div>
    <!-- 地图 end-->
  </section>
</template>

<script>
import Province from "@/json/province/province.json";
import City from "@/json/province/city.json";
import Area from "@/json/province/area.json";
import mapUtil from "@/utils/mapUtil.js";
import UserTreeComp from "@/components/UserTree/UserTree";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import DeviceList from "@/components/DeviceList/DeviceList";
import baiduMapComp from "@/components/map/BaiduMapComp";
import FenceList from "@/components/FenceList";
//
import {
  doUnLinkFence,
  doLinkFence,
  loadFenceByImei,
  loadUserFenceList
} from "@/api/fence.js";
export default {
  name: "FenceDevice",
  components: {
    "user-tree": UserTreeComp,
    "info-box1": InfoBox1,
    "device-list": DeviceList,
    "baidu-map": baiduMapComp,
    "fence-list": FenceList
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    deviceList: [],
    currentList: 0,
    deviceImei: "",
    mapName: "FenceDevice", //当前地图类型
    theMap: "baidu-map",
    mapOption: {
      zoom: 5,
      center: {}
    }, //地图参数
    linkList: [],
    fenceList: [],
    fenceId: 0,
    fenceName: "",
    deviceInfo: null,
    points: [],
    searchFenceKey: "",
    isFenceSearch: false,
    originFence: "[]",
    searchFenceKey1: "",
    isFenceSearch1: false,
    originLink: "[]"
  }),
  watch: {
    searchFenceKey() {
      if (!this.searchFenceKey) {
        this.isFenceSearch = false;
        this.fenceList = JSON.parse(this.originFence);
      }
    },
    searchFenceKey1() {
      if (!this.searchFenceKey1) {
        this.isFenceSearch1 = false;
        this.linkList = JSON.parse(this.originLink);
      }
    }
  },
  methods: {
    changeTab(idx) {
      this.currentList = idx.name;
    },
    searchFenceList() {
      if (this.searchFenceKey) {
        this.isFenceSearch = true;
        var list = [];
        var originFence = JSON.parse(this.originFence);
        for (var i = 0; i < originFence.length; i++) {
          if (originFence[i].defenseName.indexOf(this.searchFenceKey) >= 0) {
            list.push(originFence[i]);
          }
        }
        this.fenceList = list;
      } else {
        this.isFenceSearch = false;
        this.fenceList = JSON.parse(this.originFence);
        this.app.$emit("show-alert-msg", this.$t("fenceDevice.fenceNameTip"));
      }
    },
    searchLinkList() {
      if (this.searchFenceKey1) {
        this.isFenceSearch1 = true;
        var linkList = JSON.parse(this.originLink);
        var list = [];
        for (var i = 0; i < linkList.length; i++) {
          var item = linkList[i];
          if (
            (item.shapeType == 1 &&
              item.defenseName.indexOf(this.searchFenceKey1) >= 0) ||
            (item.shapeType == 2 &&
              item.address &&
              item.address.indexOf(this.searchFenceKey1) >= 0)
          ) {
            list.push(linkList[i]);
          }
        }
        this.linkList = list;
      }
    },
    onOverView() {
      var points = this.points;
      if (this.deviceInfo) {
        points.push(
          new BMap.Point(
            this.deviceInfo.location.bdlng,
            this.deviceInfo.location.bdlat
          )
        );
      }
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });
    },
    getAreaName(code) {
      var list = [];
      var str = "";
      if (code.length == 2) {
        list = Province;
      } else if (code.length == 4) {
        list = City;
        str = this.getAreaName(code.substring(0, 2));
      } else if (code.length == 6) {
        list = Area;
        str =
          this.getAreaName(code.substring(0, 2)) +
          this.getAreaName(code.substring(0, 4));
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i].code == code) {
          return str + list[i].name;
        }
      }
      return "";
    },
    showArea(idx, item) {
      this.fenceId = item.rdId;
      this.fenceName = item.address;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        address: item.address,
        action: "add-area-boundary"
      });
    },
    getLinkState(item) {
      for (var i = 0; i < this.linkList.length; i++) {
        if (item.rdId == this.linkList[i].rdId) {
          return true;
        }
      }
      return false;
    },
    onUnLinkFence(idx, item) {
      // 取消围栏设备的关联
      var that = this;
      var str = this.$t("fenceDevice.unlinkTip").replace(
        "_device_",
        this.deviceImei
      );
      str = str.replace(
        "_fence_",
        item.shapeParam === "0" ? item.address : item.defenseName
      );
      this.app.$emit("show-confirm-msg", str, function() {
        doUnLinkFence({ deviceImei: that.deviceImei, rdId: item.rdId }).then(
          res => {
            if (res.errCode == "200") {
              that.app.$emit("show-alert-msg", that.$t("fenceDevice.unlinkOk"));
              that.loadDeviceFence(that.deviceImei);
            } else {
              that.app.$emit(
                "show-alert-msg",
                that.$t("fenceDevice.unlinkFail")
              );
            }
          }
        );
      });
    },
    onLinkFence(idx, item) {
      // 关联围栏设备
      var that = this;
      var str = this.$t("fenceDevice.linkTip").replace(
        "_device_",
        this.deviceImei
      );
      str = str.replace(
        "_fence_",
        item.shapeParam === "0" ? item.address : item.defenseName
      );
      this.app.$emit("show-confirm-msg", str, function() {
        doLinkFence({ deviceImei: that.deviceImei, rdId: item.rdId }).then(
          res => {
            if (res.errCode == "200") {
              that.app.$emit("show-alert-msg", that.$t("fenceDevice.linkOk"));
              that.loadDeviceFence(that.deviceImei);
            } else {
              that.app.$emit("show-alert-msg", that.$t("fenceDevice.linkFail"));
            }
          }
        );
      });
    },
    showFence(idx, item) {
      this.fenceId = item.rdId;
      this.fenceName = item.defenseName;
      var params = item.shapeParam.split(";");
      var points = [];
      for (let i = 0; i < params.length; i++) {
        let item = params[i].split(",");

        points.push(new BMap.Point(parseFloat(item[0]), parseFloat(item[1])));
      }
      this.points = points;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "draw-polygon",
        points: points
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });
    },
    onDevList(op) {
      // console.log(op);
      this.deviceList = op.devList;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      var points = [];
      setTimeout(() => {
        for (var i = 0; i < this.deviceList.length; i++) {
          var item = this.deviceList[i];
          mapUtil.disposeDeviceIcon(item, false);
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "add-marker",
            lat: item.bdlat,
            lng: item.bdlng,
            // icon: mapUtil.getMarkerIcon(item),
            icon: item.iconPath,
            title: item.name,
            rotation: item.course,
            data: item,
            item: item
          });
          points.push(new BMap.Point(item.bdlng, item.bdlat));
        }
        this.onSelectDev(this.deviceList[0]);
        // this.app.$emit("map-operation", {
        //   mapName: this.mapName,
        //   action: "set-view-port",
        //   points: points,
        // });
      }, 500);
    },
    onSelectUser(userId) {
      this.app.$emit("usertree-userid", userId);
    },
    dealDevOp(op) {
      this.app.$emit(
        "show-device-dialog",
        {
          name: "DeviceDialog",
          imei: op.imei
        },
        this.mapName
      );
    },
    onSelectDev(item) {
      if (item.deviceImei != this.deviceImei) {
        // console.log(item);
        this.app.$emit("onselectDevice");
        var that = this;
        this.deviceImei = item.deviceImei;
        setTimeout(function() {
          that.app.$emit("refresh-infobox", item, that.mapName, that.theMap);
        }, 100);

        // if (item.bdlat && item.bdlng) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "set-center",
          lat: item.bdlat,
          lng: item.bdlng
        });
        // }
        this.loadDeviceFence(item.deviceImei);
      }
    },
    loadDeviceFence(deviceImei) {
      loadFenceByImei({ deviceImei: deviceImei }).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          data = data.filter(item => {
            return item != null;
          });
          for (var i = 0; i < data; i++) {
            if (res.data[i].shapeType === "2") {
              res.data[i].address = this.getAreaName(res.data[i].defenseName);
            }
          }
          // console.log(data);
          this.linkList = data;
          this.originLink = JSON.stringify(res.data);
        }
      });
    },
    loadFenceList() {
      const data = {
        userId: this.rootUser.userId,
        shapeType: 1
      };
      loadUserFenceList(data).then(res => {
        if (res.errCode == "200") {
          this.fenceList = res.data;
          this.originFence = JSON.stringify(res.data);
        }
      });
    },
    onInfoBox(op, mapName) {
      if (mapName == this.mapName) {
        this.deviceInfo = op;
        if (op.location.bdlat && op.location.bdlng) {
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: op.location.bdlat,
            lng: op.location.bdlng
          });
        }
      }
    },
    onMapBoundary(points) {
      this.points = points;
    },
    listenEvent() {
      this.app.$on("map-select-marker", this.onSelectDev);
      this.app.$on("infobox-data", this.onInfoBox);
      this.app.$on("map-boundary", this.onMapBoundary);
    },
    offEvent() {
      this.app.$off("map-select-marker", this.onSelectDev);
      this.app.$off("map-boundary", this.onMapBoundary);
      this.app.$off("infobox-data", this.onInfoBox);
    }
  },
  mounted() {
    this.moveVertical();
    this.moveHoriztion();
    this.listenEvent();
    this.loadFenceList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.fence-device {
  display: flex;
  flex-direction: row;
}
</style>
