<template>
  <section class="body-content layout-container" style="flex-direction: row;">
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
        <el-tabs v-model="currentList" @tab-click="changeTab">
          <el-tab-pane name="0" :label="$t('common.deviceList')"></el-tab-pane>
          <el-tab-pane
            name="1"
            :label="$t('fencePolygon.fenceList1')"
          ></el-tab-pane>
          <el-tab-pane
            v-show="deviceImei"
            name="2"
            :label="$t('fenceDevice.linkFence1')"
          ></el-tab-pane>
        </el-tabs>
        <!--  -->
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
              @keyup.enter.native="searchFenceList"
            />
            <el-button type="warning" @click="searchFenceList">{{
              $t("common.search")
            }}</el-button>
          </div>
          <pledge-list
            :linkPledgeList="fenceList"
            :link-list.sync="linkList"
            style="height: calc(100% - 24px)"
            :pledge-id.sync="fenceId"
            @select-pledge="showArea1"
            @link-pledge="onLinkPledge1"
            @unlink-pledge="onUnLinkPledge"
          >
          </pledge-list>
        </div>
        <div class="card-body" v-show="currentList == '2'">
          <div style="display: flex; align-items: center" class="card-top">
            <el-input
              size="small"
              :placeholder="$t('fence.fenceName')"
              v-model="searchFenceKey1"
              style="flex: 1; margin-right: 8px"
              @keyup.enter.native="searchLinkList"
            />
            <el-button
              type="warning"
              class="btn-orange small"
              @click="searchLinkList"
              >{{ $t("common.search") }}</el-button
            >
          </div>
          <pledge-list
            :linkPledgeList="linkList"
            :link-list.sync="linkList"
            style="height: calc(100% - 24px)"
            :pledge-id.sync="fenceId"
            :is-tip="true"
            @select-pledge="showArea1"
            @link-pledge="onLinkPledge1"
            @unlink-pledge="onUnLinkPledge"
          ></pledge-list>
        </div>
        <!--  -->
      </div>
    </div>
    <!-- 地图的显示 -->
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
          <span style="font-weight: bold">{{ pledgeName }}</span>
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
import UserTree from "@/components/UserTree/UserTree";
import DeviceList from "@/components/DeviceList/DeviceList.vue";
import mapUtil from "@/utils/mapUtil.js";
import Province from "@/json/province/province.json";
import City from "@/json/province/city.json";
import Area from "@/json/province/area.json";
import FenceList from "@/components/FenceList";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import baiduMap from "@/components/map/BaiduMapComp";
import pledgeList from "@/components/PledgeList/PledgeList";
import {
  loadDevicePledgeInfo,
  unLinkPledge,
  onLinkPledge,
  loadPledgeListInfo,
  loadDevPledgeInfo
} from "@/api/risk.js";
export default {
  name: "PledgeDevice",
  components: {
    "user-tree": UserTree,
    "info-box1": InfoBox1,
    "device-list": DeviceList,
    "baidu-map": baiduMap,
    "fence-list": FenceList,
    "pledge-list": pledgeList
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    currentList: "0",
    deviceImei: "",
    mapName: "PledgeDevice", //当前地图类型
    theMap: "baidu-map",
    mapOption: {
      zoom: 5,
      center: {}
    }, //地图参数
    linkList: [],
    searchFenceKey: "",
    searchFenceKey1: "",
    fenceList: [],
    fenceId: 0,
    fenceName: "",
    originFence: [],
    pledgeName: "",
    points: [],
    isFenceSearch1: false,
    originLink: [],
    deviceInfo: null
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
    loadDevicePledge(deviceImei) {
      // console.log(deviceImei);
      // 显示设备关联的围栏
      loadDevicePledgeInfo({ deviceImei: deviceImei }).then(res => {
        if (res.errCode == 200) {
          // 显示设备已关联的围栏
          var result = res.data;
          result = result.filter(item => {
            return item != null;
          });
          this.linkList = result;
          this.originLink = JSON.stringify(res.data);
        }
      });
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
    showArea1(idx, item) {
      //显示图形
      this.fenceId = item.rdId;
      this.pledgeName = item.defenseName;
      this.shapeType = item.shapeType;
      if (this.shapeType) {
        this.drawType = this.shapeType == 1 && 3 ? "circle" : "polygon";
      }
      var points = [];
      var params = item.shapeParam;
      if (params) {
        params = params.split(";");
        for (let i = 0; i < params.length; i++) {
          let item = params[i].split(",");

          points.push(new BMap.Point(parseFloat(item[0]), parseFloat(item[1])));
        }
      }
      this.points = points;
      // 更新于2020-10-29-10-16-00
      // 多边形的展示
      if (this.points.length > 2) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-circle"
          // points: points,
        });
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-polygon",
          points: points
        });
      }

      // 圆形的展示
      if (this.points.length == 2) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-polygon"
          // points: points,
        });
        this.radius = mapUtil.getDistance(
          this.points[0].lat,
          this.points[0].lng,
          this.points[1].lat,
          this.points[1].lng
        );
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-circle",
          lat: this.points[0].lat,
          lng: this.points[0].lng,
          radius: this.radius,
          isDraw: true
        });
      }

      // 共享点的圆形的展示
      if (this.points.length == 1) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-polygon",
          points: points
        });
        if (item.shapeParam) {
          let item1 = item.shapeParam.split(",");
          this.radius = parseFloat(item1[2]);
        }
        console.log("item", this.radius);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-circle",
          lat: this.points[0].lat,
          lng: this.points[0].lng,
          radius: this.radius,
          isDraw: true
        });
      }

      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });

      // this.loadLinkDevice();
    },
    onUnLinkPledge(idx, item) {
      // console.log(this.deviceImei);
      console.log(item);
      var str = this.$t("pledge.unlinkTip").replace(
        "_device_",
        this.deviceImei
      );
      str = str.replace("_pledge_", item.defenseName);
      this.app.$emit("show-confirm-msg", str, () => {
        const data = {
          deviceImei: this.deviceImei,
          rdId: item.rdId
        };
        unLinkPledge(data).then(res => {
          if (res.errCode == 200) {
            this.app.$emit("show-alert-msg", this.$t("fenceDevice.unlinkOk"));
            this.loadDevicePledge(this.deviceImei);
          } else {
            this.app.$emit("show-alert-msg", this.$t("fenceDevice.unlinkFail"));
          }
        });
      });
    },
    onLinkPledge1(idx, item) {
      // console.log(this.deviceImei);
      console.log(item);
      var str = this.$t("pledge.linkTip").replace("_device_", this.deviceImei);
      str = str.replace("_pledge_", item.defenseName);
      this.app.$emit("show-confirm-msg", str, () => {
        const data = {
          deviceImei: this.deviceImei,
          rdId: item.rdId
        };
        onLinkPledge(data).then(res => {
          if (res.errCode == 200) {
            this.app.$emit("show-alert-msg", this.$t("pledge.linkOk"));
            this.loadDevicePledge(this.deviceImei);
          } else {
            this.app.$emit("show-alert-msg", this.$t("pledge.linkFail"));
          }
        });
      });
    },
    loadFenceList() {
      // 加载二押点列表;
      loadPledgeListInfo({
        userId: this.userId ? this.userId : this.rootUser.userId
      }).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.length; i++) {
            // res.data[i].address = that.getAreaName(res.data[i].province);
          }
          this.fenceList = res.data;
          this.originFence = JSON.stringify(res.data);
        }
      });
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
    onSelectUser(userId) {
      this.app.$emit("usertree-userid", userId);
    },
    onSelectDev(item) {
      if (item.deviceImei != this.deviceImei) {
        var that = this;
        this.deviceImei = item.deviceImei;
        setTimeout(function() {
          that.app.$emit("refresh-infobox", item, that.mapName, that.theMap);
        }, 100);

        if (item.bdlat && item.bdlng) {
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: item.bdlat,
            lng: item.bdlng
          });
        }
        this.loadDevicePledge(item.deviceImei);
      }
    },
    onDevList(op) {
      this.deviceList = op.devList;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      var points = [];
      setTimeout(() => {
        for (var i = 0; i < this.deviceList.length; i++) {
          var item = this.deviceList[i];
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "add-marker",
            lat: item.bdlat,
            lng: item.bdlng,
            icon: mapUtil.getMarkerIcon(item),
            // icon: item.iconPath,
            title: item.name,
            rotation: item.course,
            data: item,
            item: item
          });
          points.push(new BMap.Point(item.bdlng, item.bdlat));
        }
        this.onSelectDev(this.deviceList[0]);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "set-view-port",
          points: points
        });
      }, 500);
    },
    loadDeviceFence(deviceImei) {
      // 通过设备查询二押点信息
      loadDevPledgeInfo({ deviceImei: deviceImei }).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].shapeType === "2") {
              res.data[i].address = this.getAreaName(res.data[i].defenseName);
            }
          }
          this.linkList = res.data;
          this.originLink = JSON.stringify(res.data);
        }
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

<style lang="scss" scoped></style>
