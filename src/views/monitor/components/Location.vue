<template>
  <section class="location-content">
    <div class="body-content-left" v-show="isShowLeft">
      <!-- 用户树 -->
      <div class="form-card" style="height: calc(35% - 8px)">
        <div class="card-header">
          <span>
            {{ $t("common.myCustomer") }}
            <span
              style="font-size: 12px; width: 200px; text-overflow: ellipsis"
              v-show="userName"
              >:{{ userName }}</span
            >
          </span>
          <span>
            <svg-icon icon-class="exit-fullscreen" @click="isShowLeft = false"/>
          </span>
        </div>
        <div
          class="card-body"
          style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; padding-right: 0; background: #f3fbfe; border-radius: unset; box-shadow: unset; border: 1px solid #ccc"
        >
          <user-tree
            tree-name="monitor"
            :user-id.sync="userId"
            @usertree-select="onSelectUser"
          ></user-tree>
        </div>
      </div>
      <!-- 设备列表 start-->
      <div class="form-card" style="height: 65%; padding-top: 0px">
        <div class="card-header">{{ $t("common.deviceList") }}</div>
        <div
          class="card-body"
          style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; background-color: #f3fbfe; border-radius: unset"
        >
          <device-list
            :user-id.sync="userId"
            :btn-type="currentTab"
            @devlist="onDevList"
            @do-dev-op="dealDevOp"
            @select-dev="onSelectDev"
            :device-imei.sync="deviceImei"
          ></device-list>
        </div>
      </div>
      <!-- 设备列表 end-->
    </div>
    <span class="full-screen" v-show="!isShowLeft">
      <svg-icon icon-class="exit-fullscreen" @click="isShowLeft = true"/>
    </span>
    <div class="form-card" style="height: 100%">
      <div class="btn-amap-satellite" v-show="theMap == 'a-map'">
        <el-button
          style="padding: 8px 18px !important"
          @click="isSatellite = isSatellite ? false : true"
        >
          {{ $t(isSatellite ? "playback.normal" : "playback.satellite") }}
        </el-button>
      </div>
      <div class="left-right-box1">
        <span class="left-box">
          <!-- <span @click="showChartPage" class="btn-item">
            <span><img src="@/assets/img/location/tv.png" alt="" /></span>
            {{ $t("location.monitorMap") }}
          </span> -->
          <span class="btn-item" @click="changeMapZoom">
            <span><img src="@/assets/img/location/eye.png" alt=""/></span>
            {{ $t("location.overview") }}
          </span>
          <span class="btn-item" @click="trackDevice">
            <span><img src="@/assets/img/location/car1.png" alt=""/></span>
            {{ $t(isTrack ? "location.cancelTrack" : "location.track") }}
          </span>
          <span class="btn-item" @click="loadAllDevs">
            <span><img src="@/assets/img/location/loading.png" alt=""/></span>
            {{ $t(isAll ? "location.list" : "location.all") }}
          </span>
          <span class="btn-item" style="line-height: 25px;">
            <el-checkbox class="btn-item-checkbox" v-model="isShowName">{{
              $t("location.showName")
            }}</el-checkbox>
          </span>
          <span class="btn-item" @click="showDialog">
            <span><img src="@/assets/img/location/sendmsg.png" alt=""/></span>
            {{ $t("batchCommandDialog.command") }}
          </span>
        </span>
        <span
          class="map-type-choose"
          style="margin-left: 10px; margin-top: -2px"
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
                    :class="[
                      'iconfont',
                      currentMap == idx ? 'el-icon-check' : ''
                    ]"
                    style="font-weight: bold"
                  ></i
                ></span>
              </li>
            </ul>
            <span
              slot="reference"
              style="cursor: pointer; padding: 9px 12px; background: #fff; color: #000; box-shadow: 0 2px 10px 0 rgb(0 0 0 / 30%)"
            >
              <i class="el-icon-copy-document" slot="reference"></i>
              <span style="font-size: 14px">{{ $t("common.maptype") }}</span>
            </span>
          </el-popover>
        </span>
      </div>
      <!-- 地图显示 start-->
      <div class="card-body" style="padding: 0; margin-top: 0">
        <span
          style="position: absolute; left:360px; margin-top: 10px; z-index: 888"
        >
          <div class="circle-btn">{{ refreshTime }}</div>
          <div
            :class="['circle-btn', isMeasureLine ? 'active' : '']"
            v-show="theMap != 'open-street-map'"
            @click="measureLine"
            :title="$t('common.youjiquxiao')"
          >
            <i class="iconfont icon-chizi_o"></i>
          </div>
        </span>
        <component
          v-if="theMap"
          :map-name="mapName"
          :is="theMap"
          @map-zoom="onMapZoom"
          @save-map="saveMap"
          :is-satellite="isSatellite"
        ></component>
        <info-box1
          map-name="location"
          :device-imei="deviceImei"
          :is-track.sync="isTrack"
        ></info-box1>
      </div>
      <!-- 地图显示 end-->
    </div>
    <!-- 地图 end-->
    <defense-dialog :map-name="mapName"></defense-dialog>
    <device-direct-dialog></device-direct-dialog>
    <recorder-dialog></recorder-dialog>
  </section>
</template>

<script>
import DefenseDialog from "@/components/DefenseDialog/DefenseDialog";
import mapUtil from "@/utils/mapUtil.js";
import gpsHelper from "@/utils/gpsHelper.js";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import baiduMapComp from "@/components/map/BaiduMapComp";
import bingMapComp from "@/components/map/BingMapComp";
import AMapComp from "@/components/map/AMapComp";
import googleMapComp from "@/components/map/GoogleMapComp";
import deviceDirectDialog from "@/components/DeviceDirectDialog/DeviceDirectDialog";
import DeviceList from "@/components/DeviceList/DeviceList";
import UserTreeComp from "@/components/UserTree/UserTree";
import {
  loadDeviceImeiList,
  deviceRelationInfo,
  updateDevice
} from "@/api/monitor.js";
import RecorderDialog from "@/components/RecorderDialog/RecorderDialog";
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
// 2023-2-24
import mapComp from "@/components/map/mapComp";
import lealefBaiduMapVue from "@/components/map/lealefBaiduMap.vue";
import { getUserTreeInfo } from "@/api/customer";
export default {
  name: "Location",
  components: {
    "defense-dialog": DefenseDialog,
    "info-box1": InfoBox1,
    "bing-map": bingMapComp,
    "baidu-map": baiduMapComp,
    "a-map": AMapComp,
    "google-map": googleMapComp,
    "device-direct-dialog": deviceDirectDialog,
    "recorder-dialog": RecorderDialog,
    "open-street-map": OpenStreetMapComp,
    "map-comp": mapComp,
    "open-baidu-map": lealefBaiduMapVue,
    "user-tree": UserTreeComp,
    "device-list": DeviceList
  },
  data: () => ({
    //当前地图类型
    theMap: "a-map",
    // theMap: "map-comp",
    mapOption: {
      //地图数据
      zoom: 5,
      center: {}
    }, //地图参数
    refreshInterval: null, //刷新间隔计时器
    refreshTime: 9, //刷新时间
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //当前登录用户
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId, //选中的用户
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    deviceImei: "", //选中的设备
    devList: [], //设备列表中设备
    pager: {
      //设备列表分页器
      current: 1,
      num: 1,
      limit: 100
    },
    isAll: false, //是否加载全部设备
    isCurrent: false, //是否只显示选中设备
    isLoading: true, //是否处于加载设备状态
    isAdd: false, //是否处于递归添加设备的状态
    points: [], //设备点
    lat: 0, //当前设备的纬度
    lng: 0, //当前设备的经度
    bigZoom: 16, //点击选中设备后放缩地图

    mapName: "location", //地图名称
    isTrack: false, //是否开启设备跟踪线
    isShowName: false, //是否显示设备名称标签
    isMeasureLine: false, //是否在测量距离
    currentMap: 0,
    isDirect: false,
    isSatellite: false, //控制高德地图的类型
    currentTab: 0,
    isShowLeft: true
  }),
  watch: {
    isShowName() {
      //是否显示设备名称标签
      if (this.isShowName) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "show-marker-labels"
        });
      } else {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "hide-marker-labels"
        });
      }
    }
  },
  methods: {
    onSelectUser(userId, userName) {
      this.userId = userId;
      if (!userName) {
        getUserTreeInfo({ userId: userId }).then(res => {
          if (res.errCode == 200) {
            this.userName = res.data.userName;
          }
        });
      } else {
        this.userName = userName;
      }
      this.app.$emit("usertree-userid", userId, userName);
      window.location.hash = this.$route.path + "?userId=" + userId;
    },
    showDialog() {
      this.app.$emit("show-device-direct-dialog", {
        name: "deviceDirectDialog",
        imei: this.deviceImei
      });
    },
    trackDevice() {
      //设备跟踪线开关
      this.isTrack = this.isTrack ? false : true;
      if (!this.isTrack) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "clear-run-line"
        });
      }
    },
    changeMapZoom() {
      //总览地图上的设备
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: this.points
      });
    },
    showHideDevices() {
      this.isCurrent = this.isCurrent ? false : true;
      if (this.isCurrent) {
        //隐藏未选中设备
        this.app.$emit("map-operation", {
          action: "hide-other-markers",
          prop: "deviceImei",
          mapName: this.mapName
        });
      } else {
        //显示未选中的设备
        this.app.$emit("map-operation", {
          action: "show-other-markers",
          prop: "deviceImei",
          mapName: this.mapName
        });
      }
    },
    addAllDevs(current) {
      //分批加载全部设备
      var that = this;
      if (current <= that.pager.num && that.isAll) {
        this.isAdd = true;
        this.isLoading = true;
        const data = {
          userId: that.userId ? that.userId : that.rootUser.userId,
          page: current,
          pageSize: that.pager.limit,
          actionType: "all"
        };
        loadDeviceImeiList(data).then(res => {
          if (res.errCode == "200" && that.isAll) {
            that.addDevToMap(0, res.data.devList);
            setTimeout(function() {
              that.addAllDevs(current + 1);
            }, 100 * 20);
          }
        });
      } else {
        this.isLoading = false;
      }
    },
    loadAllDevs() {
      // console.log("dadasssssss");
      this.isAll = this.isAll ? false : true;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      if (this.isAll) {
        //加载全部设备到地图上

        this.addAllDevs(1);
      } else {
        //加载设备列表到地图上
        this.onDevList({
          devList: this.devList,
          pager: this.pager
        });
      }
    },
    measureLine() {
      //测量地图距离
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
    changeMapType(e) {
      // console.log(e);
      // this.currentMap = idx;
      // var theMapList = this.$t("playback.theMapList");
      // this.theMap = theMapList[idx].name;
      //
      let theMapList = this.$t("playback.theMapList");
      let name = e.target.dataset.index.trim();
      this.currentMap = this.getTheMapCurrent(name);
      this.theMap = theMapList[this.currentMap].name;
      this.app.$emit("change-the-maptype", { mapType: this.theMap });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      //切换地图并重新加载到另个地图中
      // this.theMap = this.theMap == "baidu-map" ? "bing-map" : "baidu-map";
      var that = this;
      this.isAll = false;
      this.isCurrent = false;
      this.isLoading = true;
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }
      setTimeout(function() {
        that.onDevList({
          devList: that.devList,
          pager: that.pager
        });
        setTimeout(() => {
          var center = that.mapOption.center;
          var zoom = that.mapOption.zoom;
          // console.log(center);gcj_encrypt:原始转高德；bd_decrypt：百度转高德；bd_encrypt：高德转百度
          if (this.theMap == "baidu-map") {
            center = gpsHelper.bd_encrypt(center.lat, center.lng);
            zoom = mapUtil.getBaiduZoomByBing(zoom);
          } else if (this.theMap == "bing-map") {
            center = gpsHelper.gcj_encrypt(center.lat, center.lng);
            zoom = mapUtil.getBingZoomByBaidu(zoom);
          } else if (this.theMap == "a-map") {
            center = gpsHelper.gcj_encrypt(center.lat, center.lng);
            zoom = mapUtil.getGaodeZoomByBaidu(zoom);
          } else if (this.theMap == "google-map") {
            center = gpsHelper.gcj_encrypt(center.lat, center.lng);
            zoom = mapUtil.getBaiduZoomByBing(zoom);
          } else if (this.theMap == "open-street-map") {
            center = gpsHelper.gcj_encrypt(center.lat, center.lng);
            zoom = mapUtil.getBingZoomByBaidu(zoom);
          }
          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "set-center",
            lat: center.lat,
            lng: center.lng
          });

          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "set-zoom",
            zoom: zoom
          });
          that.refreshInfoBox();
        }, 1000);
      }, 1000);
    },
    saveMap(op) {
      console.log(op);
      //切换地图前保存地图数据
      this.mapOption = op;
    },
    showChartPage() {
      //设备分布图
      window.open(
        window.location.origin +
          window.location.pathname +
          "#/location-points?userId=" +
          this.userId
      );
    },
    dealDevOp(op) {
      //设备列表的操作
      var idx = op.idx;
      var imei = op.imei;
      if (op.btnType == 0) {
        //监控平台设备列表操作
        if (idx == 0) {
          //跳转跟踪界面 currentMap
          window.open(
            window.location.origin +
              window.location.pathname +
              `#/track?deviceImei=${imei}&mapkey=${this.currentMap}`
          );
        } else if (idx == 1) {
          //跳转回放界面 "#/playback?deviceImei=" + imei
          window.open(
            window.location.origin +
              window.location.pathname +
              `#/playback?deviceImei=${imei}&mapkey=${this.currentMap}`
          );
        } else if (idx == 2) {
          //更多 查看设备详情对话框
          this.app.$emit(
            "show-device-dialog",
            {
              name: "DeviceDialog",
              imei: op.imei
            },
            "location"
          );
        }
      }
    },
    addDevToMap(idx, list) {
      // console.log("this.deviceImei", this.deviceImei);

      //设备列表中设备递归添加到地图
      var that = this;
      if (idx < list.length && this.isAdd) {
        var item = list[idx];
        // console.log(item);
        var lat, lng;
        if (this.theMap == "baidu-map") {
          lat = item.bdlat;
          lng = item.bdlng;
          this.points.push(new BMap.Point(item.bdlng, item.bdlat));
        } else {
          lat = item.lat;
          lng = item.lng;
          this.points.push({
            lat: item.lat,
            lng: item.lng
          });
        }
        //lat, lng, icon, title, rotation, data
        // mapUtil.disposeDeviceIcon(item, false);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-marker",
          lat: lat,
          lng: lng,
          icon: mapUtil.getMarkerIcon(item),
          // icon: item.iconPath,
          title: "",
          rotation: item.course,
          data: item
        });

        this.$nextTick(function() {
          that.addDevToMap(idx + 1, list);
        });
      } else {
        this.isAdd = false;
        if (this.deviceImei) {
          //判断选中设备是否在列表中
          var tag = true;
          for (let i = 0; i < this.devList.length; i++) {
            if (this.devList[i].deviceImei == this.deviceImei) {
              // mapUtil.disposeDeviceIcon(this.devList[i], false);
              this.onSelectDev(this.devList[i]);
              this.app.$emit("monitor-change-device", this.devList[i]);
              tag = false;
              break;
            }
          }
          if (tag) {
            this.addDeviceMarker();
          }
        } else {
          if (this.devList[0]) {
            // mapUtil.disposeDeviceIcon(this.devList[0], false);
            this.onSelectDev(this.devList[0]);
            this.app.$emit("monitor-change-device", this.devList[0]);
            // console.log(this.devList[0]);
            // 首次加载也要让设备居中
            var lat1, lng1;
            if (this.theMap == "baidu-map") {
              lat1 = this.devList[0].bdlat;
              lng1 = this.devList[0].bdlng;
            } else {
              lat1 = this.devList[0].lat;
              lng1 = this.devList[0].lng;
            }
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "set-center",
              lat: lat1,
              lng: lng1
            });
          }
        }
        if (!this.isAll) {
          this.isLoading = false;
        }

        this.refreshInfoBox();
        // this.app.$emit("map-operation", {
        //   mapName: this.mapName,
        //   action: "set-view-port",
        //   points: this.points
        // });
      }
    },
    onDevList(op) {
      //设备列表中设备改变
      var that = this;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      // end

      this.isShowName = false;
      // that.devList = JSON.parse(JSON.stringify(op.devList));
      that.devList = op.devList;
      that.pager = op.pager;
      this.isLoading = true;
      this.isAdd = false;
      that.points = [];
      setTimeout(() => {
        that.isAdd = true;
        that.addDevToMap(0, op.devList);
      }, 900);
    },
    onSelectDev(device) {
      // console.log("device", device);
      //选中设备
      if (device && device.deviceImei && device.deviceImei == this.deviceImei) {
        return;
      }
      // console.log(device);
      this.app.$emit("onselectDevice");
      var tag = true;
      for (var i = 0; i < this.devList.length; i++) {
        //选中设备列表设备
        if (this.devList[i].deviceImei == device.deviceImei) {
          this.onDev(device, i);
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "select-marker",
            data: this.devList[i],
            prop: "deviceImei"
          });
          // if (this.devList[i].bdlat && this.devList[i].bdlng) {
          var lat, lng;
          if (this.theMap == "baidu-map") {
            lat = this.devList[i].bdlat;
            lng = this.devList[i].bdlng;
          } else {
            lat = this.devList[i].lat;
            lng = this.devList[i].lng;
          }
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: lat,
            lng: lng
            // lat: this.devList[i].bdlat,
            // lng: this.devList[i].bdlng,
          });
          if (!this.isLoading && !this.isAll) {
            if (this.theMap == "baidu-map") {
              // 百度地图 点击单个居中放大
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "center-zoom",
                lat: lat,
                lng: lng,
                zoom: this.bigZoom > 16 ? this.bigZoom : 16
              });
            } else {
              //2021-12-27 加上了居中 百度地图不知道啥情况，首次居中不了所以加上了上段
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "set-center",
                lat: lat,
                lng: lng
              });
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "set-zoom",
                zoom: this.bigZoom > 16 ? this.bigZoom : 16
              });
            }
          }
          // }
          tag = false;
          break;
        }
      }
      if (tag) {
        //如果不在设备列中则添加到设备列表
        if (this.isAll) {
          this.onDev(device);
          this.refreshInfoBox();
        } else {
          this.addDeviceMarker("select");
        }
      }
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-run-line"
      });
      this.refreshInfoBox();
    },

    onDev(device) {
      this.deviceImei = device.deviceImei;

      if (this.isShowName) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "show-marker-labels"
        });
      }
    },
    dealInfoxBoxData(op, mapName) {
      // console.log(op);
      //更新选中设备的信息
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        this.lat = op.location.lat;
        this.lng = op.location.lon;
      }
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
          flowExpire: op.info.flowExpire,
          platExpire: op.info.platExpire,
          flowFlag: op.info.flowFlag,
          enableSts: op.info.enableSts,
          enableDate: op.info.enableDate,
          voltage: op.info.voltage,
          electricity: op.info.electricity,
          iconPath: op.info.iconPath
        };
        // this.lat = op.location.bdlat;
        // this.lng = op.location.bdlng;
        // console.log("device", device);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "move-marker",
          lat: this.lat,
          lng: this.lng,
          icon: mapUtil.getMarkerIcon(device),
          // icon: device.iconPath,
          title: "",
          rotation: op.info.course,
          deviceImei: op.deviceImei
        });
        if (this.isTrack) {
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
        }
        for (var i = 0; i < this.devList.length; i++) {
          if (this.devList[i].deviceImei == device.deviceImei) {
            this.devList.splice(i, 1, device);
            break;
          }
        }
      }
    },
    refreshInfoBox() {
      //10s刷新地图上设备信息
      var that = this;
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }

      this.$nextTick(function() {
        that.app.$emit(
          "refresh-infobox",
          {
            deviceImei: that.deviceImei
          },
          that.mapName,
          that.theMap
        );
      });

      that.refreshTime = 9;
      this.refreshInterval = setInterval(function() {
        if (that.refreshTime <= 0) {
          that.refreshTime = 9;
          if (!that.isAll) {
            that.app.$emit("refresh-dev-list", {
              mapName: this.mapName
            });
          }

          that.app.$emit(
            "refresh-infobox",
            {
              deviceImei: that.deviceImei
            },
            that.mapName,
            that.theMap
          );
        } else {
          that.refreshTime--;
        }
      }, 1000);
    },
    addDeviceMarker(operation) {
      // console.log("operation", operation);
      // console.log("this.deviceImei", this.deviceImei);
      //添加设备列表中不存在的设备到设备列表中
      var that = this;
      if (!this.deviceImei) {
        return;
      }
      updateDevice({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == "200") {
          var op = res.data;
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
            flowExpire: op.info.flowExpire,
            platExpire: op.info.platExpire,
            flowFlag: op.info.flowFlag,
            enableSts: op.info.enableSts,
            enableDate: op.info.enableDate,
            voltage: op.info.voltage,
            electricity: op.info.electricity
          };
          // that.devList.push(device);
          // mapUtil.disposeDeviceIcon(device, false);
          var lat, lng;
          if (that.theMap == "baidu-map") {
            lat = device.bdlat;
            lng = device.bdlat;
          } else {
            lat = device.lat;
            lng = device.lng;
          }
          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "add-marker",
            lat: lat,
            lng: lng,
            icon: mapUtil.getMarkerIcon(device),
            // icon: device.iconPath,
            title: "",
            rotation: device.course,
            data: device
          });
          if (operation == "select" && !that.isLoading) {
            that.app.$emit("map-operation", {
              mapName: that.mapName,
              action: "set-center",
              lat: lat,
              lng: lng
            });
            that.app.$emit("map-operation", {
              mapName: that.mapName,
              action: "set-zoom",
              zoom: that.bigZoom > 14 ? that.bigZoom : 14
            });
          }
        }
      });
    },
    loadDeviceRelation(imei) {
      //根据设备号获取用户关系列表，为用户树展开
      this.isLoading = true;
      this.deviceImei = imei;
      deviceRelationInfo({ deviceImei: imei }).then(res => {
        if (res.errCode == "200") {
          var userId = res.data.uList[0].userId;
          this.onSelectUser(userId, res.data.uList[0].userName);
          this.onSelectDev({
            deviceImei: imei
          });
          this.app.$emit("monitor-change-device", {
            deviceImei: imei
          });
          this.onSelectUser(userId, res.data.uList[0].userName);
          //用户树展开延时
          setTimeout(() => {
            this.app.$emit("monitor-userid", userId);
            //加载设备列表延时
            this.$nextTick(() => {
              this.onSelectDev({
                deviceImei: imei
              });
              this.app.$emit("monitor-change-device", {
                deviceImei: imei
              });
            });
          }, res.data.uList.length * 100);
        }
      });
    },
    onMapZoom(center, zoom) {
      this.bigZoom = zoom > 14 ? zoom : 14;
      //this.app.$emit("map-operation",{mapName:this.mapName,action:"set-center", lat:this.lat, lng:this.lng});
    },
    offMeasureLine() {
      //关闭测量距离
      this.isMeasureLine = false;
    },
    reseTheDeviceImei() {
      this.deviceImei = "";
      this.devList = [];
      if (this.refreshInterval)
        this.refreshInterval = clearInterval(this.refreshInterval);
      this.refreshTime = 9;
    },
    listenEvent() {
      this.app.$on("refresh-current-dev", this.refreshInfoBox);
      this.app.$on("infobox-data", this.dealInfoxBoxData);
      this.app.$on("select-user", this.onSelectUser);
      this.app.$on("map-select-marker", this.onSelectDev);
      this.app.$on("off-measure-line", this.offMeasureLine);
      this.app.$on("reset-the-deviceImei", this.reseTheDeviceImei);
      this.app.$on("usertree-userid", this.reseTheDeviceImei);
    },
    offEvent() {
      this.app.$off("refresh-current-dev", this.refreshInfoBox);
      this.app.$off("infobox-data", this.dealInfoxBoxData);
      this.app.$off("select-user", this.onSelectUser);
      this.app.$off("map-select-marker", this.onSelectDev);
      this.app.$off("off-measure-line", this.offMeasureLine);
      this.app.$off("reset-the-deviceImei", this.reseTheDeviceImei);
      this.app.$off("usertree-userid", this.reseTheDeviceImei);
    }
  },
  mounted() {
    this.listenEvent();
    var localLanguage = (
      navigator.language || navigator.browserLanguage
    ).toLowerCase();
    // console.log(localLanguage);
    if (localLanguage == "zh-cn") {
      // console.log("dadad");
      this.theMap = "a-map";
      this.currentMap = 0;
    } else {
      this.theMap = "google-map";
      this.currentMap = 3;
    }
    if (this.$route.query.deviceImei) {
      //url中包含设备号，加载设备号所在用户的设备列表，用户树展开至该用户
      var imei = this.$route.query.deviceImei;
      this.loadDeviceRelation(imei);
    }
  },
  beforeDestroy() {
    if (this.refreshInterval)
      this.refreshInterval = clearInterval(this.refreshInterval);
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.full-screen {
    position: absolute;
    left: 55px;
    top: 12px;
    z-index: 999;
    background: #eee;
    padding: 9px;
    background-color: rgba(0,0,0,0.2);
    /* color: #fff; */
    width: 36px;
    height: 36px;
    font-size: 18px;
    cursor: pointer;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
.location-content {
  height: 100%;
  width: 100%;
  position: relative;
}
.body-content-left {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 999;
  width: 340px;
  height: calc(100% - 60px);
}

.selected.active {
  color: #0066ff;
  font-weight: bold;
}
.location-content {
  .gm-style .gm-style-mtc {
    right: 0;
    top: 45px !important;
    left: 20px !important;
  }
}
</style>
