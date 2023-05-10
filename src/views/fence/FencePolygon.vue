<template>
  <section class="fence-polygon layout-container" style="flex-direction: row">
    <div class="body-content-left" style="width: 350px">
      <div class="form-card" style="height: 35%">
        <div class="card-header">{{ $t("fencePolygon.fenceList") }}</div>

        <div
          class="card-body"
          style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden"
        >
          <div style="display: flex; align-items: center" class="card-top">
            <el-input
              size="small"
              :placeholder="$t('fence.fenceName')"
              @keyup.enter="searchFenceList"
              v-model="searchFenceKey"
              style="margin-right: 10px"
            ></el-input>
            <el-button type="warning" @click="searchFenceList">{{
              $t("common.search")
            }}</el-button>
          </div>
          <fence-list
            :fence-list="fenceList"
            style="height: calc(100% - 24px); overflow-x: scroll"
            :fence-id.sync="fenceId"
            :is-del="true"
            @select-fence="showFence"
            @link-fence="showLinkDialog"
            @del-fence="onDelFence"
            :d-height="'100%'"
          ></fence-list>
        </div>
      </div>

      <div class="move-bar-v"></div>

      <div class="form-card" style="height: calc(65% - 8px)">
        <div class="card-header" style="position: relative">
          <!--  -->
          <el-tabs v-model="currentTab" @tab-click="changeTab">
            <el-tab-pane
              name="3"
              :label="$t('common.myCustomer')"
            ></el-tab-pane>
            <el-tab-pane
              name="0"
              :label="$t('common.deviceList')"
            ></el-tab-pane>
            <el-tab-pane
              name="1"
              v-show="fenceId || isDraw"
              :label="$t('fencePolygon.linkedDevice')"
            ></el-tab-pane>
            <!-- <el-tab-pane v-show="fenceId || isDraw">
              <span slot="label">
                <el-button type="primary" size="small" @click="onSaveFence()">{{ $t("common.save") }}</el-button>
              </span>
            </el-tab-pane> -->
          </el-tabs>
          <span class="btn-save-fence" v-show="fenceId || isDraw">
            <el-button type="primary" size="small" @click="onSaveFence()">{{
              $t("common.save")
            }}</el-button>
          </span>
        </div>
        <div class="card-body" v-show="currentTab == '3'">
          <user-tree
            tree-name="linkdevice"
            @usertree-select="onSelectUser"
            :user-id.sync="userId"
          ></user-tree>
        </div>
        <div class="card-body" v-show="currentTab == '0'">
          <div style="display: flex; align-items: center" class="card-top">
            <!-- <input type="text" class="text-input small" v-model="searchKey" :placeholder="$t('common.searchDevTip')" @keyup.enter="onSearchDevice" style="flex:1" /> -->
            <el-input
              size="small"
              v-model="searchKey"
              :placeholder="$t('common.searchDevTip')"
              @keyup.enter="onSearchDevice"
              style="margin-right: 10px"
            ></el-input>
            <el-button type="warning" @click="onSearchDevice">{{
              $t("common.search")
            }}</el-button>
          </div>
          <link-device-list
            :link-list.sync="linkList"
            :dev-list="deviceList"
            :device-imei.sync="deviceImei"
            :is-operate="isDraw"
            :d-height="'100%'"
            style="height: calc(100% - 60px); overflow: hidden"
            @select-dev="showDevice"
          ></link-device-list>
          <el-pagination
            v-show="!isSearch"
            center
            :pager-count="5"
            :page-size="page.limit"
            :total="page.total"
            background
            layout="prev,pager,next"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
        <div class="card-body" v-show="currentTab == '1' || currentTab == '2'">
          <link-device-list
            :link-list.sync="linkList"
            :dev-list="linkList"
            :device-imei.sync="deviceImei"
            :is-operate="isDraw"
            @select-dev="showDevice"
          ></link-device-list>
        </div>
      </div>
    </div>

    <div class="move-bar-h"></div>
    <div class="form-card body-content-right-fence">
      <div class="card-header">
        {{ $t("fencePolygon.fenceMap") }}
        <el-button type="primary" size="small" @click="onFenceAction('add')">{{
          $t("fencePolygon.addFence")
        }}</el-button>
        <span v-show="isDraw" style="margin-left: 10px">
          <!-- <el-button type="primary" size="small" v-show="!isEdit && fenceId" @click="onFenceAction('draw')">{{ $t("fencePolygon.drawFence") }}</el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="onFenceAction('clear')"
            >{{ $t("fencePolygon.clearFence") }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-show="!isEdit"
            @click="onFenceAction('quit')"
            >{{ $t("fencePolygon.outEdit") }}</el-button
          >
          <!-- <el-button type="primary" size="small" v-show="!isEdit" @click="onFenceAction('edit')">{{ $t("fencePolygon.editFence") }}</el-button> -->
          <el-button type="primary" size="small" @click="onOverView">{{
            $t("fencePolygon.devFence")
          }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="isDrawBox = isDrawBox ? false : true"
            >{{ $t("fencePolygon.fenceSet") }}</el-button
          >
          <el-button type="primary" size="small" @click="onSaveFence()">{{
            $t("common.save")
          }}</el-button>
        </span>
      </div>
      <div class="card-body" style="padding: 0">
        <!-- 设置围栏box -->
        <div
          class="result-box"
          v-if="isDraw && isDrawBox"
          style="width: 350px; height: 250px; padding: 10px; z-index: 999"
        >
          <table class="form-table">
            <tr>
              <td>{{ $t("fence.fenceName") }}:</td>
              <td>
                <el-input
                  style="width: 200px"
                  v-model="fenceName"
                  :placeholder="$t('fence.fenceName')"
                />
              </td>
            </tr>
            <tr>
              <td>{{ $t("fencePolygon.inFenceAlarm") }}:</td>
              <td>
                <el-checkbox v-model="isInFenceAlarm">{{
                  $t("fencePolygon.isOpen")
                }}</el-checkbox>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-input
                  style="width: 50px"
                  size="small"
                  v-model.number="inFenceTime"
                ></el-input
                >{{ $t("fencePolygon.fenceTime") }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("fencePolygon.outFenceAlarm") }}:</td>
              <td>
                <el-checkbox v-model="isOutFenceAlarm">{{
                  $t("fencePolygon.isOpen")
                }}</el-checkbox>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-input
                  style="width: 50px"
                  size="small"
                  v-model.number="outFenceTime"
                ></el-input
                >{{ $t("fencePolygon.fenceTime") }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-button
                  style="margin-left: 0 !important"
                  type="warning"
                  size="small"
                  @click="isDrawBox = false"
                  >{{ $t("common.close") }}</el-button
                >
                <el-button type="primary" size="small" @click="onSaveFence()">{{
                  $t("fencePolygon.saveFence")
                }}</el-button>
              </td>
            </tr>
          </table>

          <!-- <div style="font-size: 12px">{{ $t("fencePolygon.drawTip") }}</div> -->
        </div>
        <!-- 地图类型的选择 -->
        <!-- <div class="map-type-choose">
          <el-popover placement="bottom" trigger="hover">
            <ul class="map-type" @click="mapNavigation" style="padding: 0; margin: 0">
              <li v-for="(item, idx) in theMapLists" :key="idx" :data-index="item.name">
                <img :src="require('@/assets/img/map/' + item.img + '.png')" alt="" />
                {{ item.text }}
                <span><i :class="['iconfont', currentMap == idx ? 'el-icon-check' : '']" style="font-weight: bold"></i></span>
              </li>
            </ul>
            <span slot="reference" style="cursor: pointer; border-radius: 50%; padding: 15px; background: #f5a403; color: #fff">

              <i class="iconfont icon-ditu"></i>
            </span>
          </el-popover>
        </div> -->
        <!-- <baidu-map :map-name="mapName"></baidu-map> -->
        <!-- <google-map :map-name="mapName"></google-map> -->
        <info-box1 :map-name="mapName" :device-imei="deviceImei"></info-box1>
        <component
          :is="theMap"
          :map-name="mapName"
          @map-zoom="onMapZoom"
          @save-map="saveMap"
        ></component>
      </div>
    </div>

    <dialog-comp
      :visible.sync="isLinkShow"
      :dialog-title="$t('fencePolygon.dialogTitle') + ':' + this.fenceName"
      :dialog-width="900"
    >
      <div
        class="s-link-device"
        style="display: flex; flex-direction: row; height: 600px; width: 100%"
      >
        <div class="form-card" style="width: 30%">
          <div class="card-header">{{ $t("common.myCustomer") }}</div>
          <div class="card-body">
            <user-tree
              tree-name="linkdevice"
              @usertree-select="onSelectUser"
              :user-id.sync="userId"
            ></user-tree>
          </div>
        </div>

        <div class="form-card" style="width: 70%; padding-left: 0.8rem">
          <div class="card-header left-right-box">
            <span class="left-box">
              <ul class="select-tabs">
                <li
                  :class="[currentTab == '0' ? 'active' : '']"
                  @click="currentTab = '0'"
                >
                  {{ $t("common.deviceList") }}
                </li>
                <li
                  :class="[currentTab == '1' ? 'active' : '']"
                  @click="currentTab = '1'"
                >
                  {{ $t("fencePolygon.linkedDevice") }}
                </li>
                <li
                  :class="[currentTab == '2' ? 'active' : '']"
                  @click="currentTab = '2'"
                >
                  {{ $t("fencePolygon.alarmSet") }}
                </li>
              </ul>
            </span>
            <span class="right-box">
              <el-input
                style="width: 200px"
                size="small"
                v-model="searchKey"
                v-show="currentTab == '0'"
                :placeholder="$t('common.searchDevTip')"
                @keyup.enter="onSearchDevice"
              />
              <el-button
                type="primary"
                style="padding: 8px 12px !important"
                v-show="currentTab == '0'"
                @click="onSearchDevice"
                >{{ $t("common.search") }}</el-button
              >

              <el-button
                type="primary"
                style="padding: 8px 12px !important"
                @click="onSaveFence"
                >{{ $t("common.save") }}</el-button
              >
            </span>
          </div>
          <div class="card-body" v-show="currentTab == '0'">
            <link-device-list
              :link-list.sync="linkList"
              :dev-list="deviceList"
              :device-imei.sync="deviceImei"
              style="height: calc(100% - 30px)"
              :is-operate="isDraw"
              @select-dev="showDevice"
            ></link-device-list>
            <el-pagination
              v-show="!isSearch"
              center
              :pager-count="5"
              :page-size="page.limit"
              :total="page.total"
              background
              layout="prev,pager,next"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
          <div class="card-body" v-show="currentTab == '1'">
            <link-device-list
              :link-list.sync="linkList"
              :dev-list="linkList"
              :device-imei.sync="deviceImei"
              :is-operate="isDraw"
              @select-dev="showDevice"
            ></link-device-list>
          </div>
          <div class="card-body" v-show="currentTab == '2'">
            <table class="form-table">
              <tr>
                <td>{{ $t("fence.fenceName") }}:</td>
                <td>
                  <el-input style="width: 200px" v-model="fenceName" disabled />
                </td>
              </tr>
              <tr>
                <td>{{ $t("fencePolygon.inFenceAlarm") }}:</td>
                <td>
                  <el-checkbox v-model="isInFenceAlarm">{{
                    $t("fencePolygon.isOpen")
                  }}</el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-input
                    style="width: 50px"
                    size="small"
                    v-model.number="inFenceTime"
                  />
                  {{ $t("fencePolygon.fenceTime") }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("fencePolygon.outFenceAlarm") }}</td>
                <td>
                  <el-checkbox v-model="isOutFenceAlarm">{{
                    $t("fencePolygon.isOpen")
                  }}</el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-input
                    size="small"
                    style="width: 50px"
                    v-model.number="outFenceTime"
                  />
                  {{ $t("fencePolygon.fenceTime") }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </dialog-comp>
  </section>
</template>

<script>
import mapUtil from "@/utils/mapUtil.js";
import gpsHelper from "@/utils/gpsHelper.js";
import UserTreeComp from "@/components/UserTree/UserTree";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import baiduMapComp from "@/components/map/BaiduMapComp";
import AMapComp from "@/components/map/AMapComp.vue";
import LinkDeviceList from "@/components/LinkDeviceList/LinkDeviceList";
import FenceList from "@/components/FenceList";
//
import googleMapComp from "@/components/map/GoogleMapComp";
import OpenStreetMap from "@/components/map/OpenStreetMapComp";
import {
  searchDevInfo,
  updateDevice,
  loadDeviceImeiList
} from "@/api/monitor.js";
import {
  loadFenceByImei,
  doBatchSaveFence,
  doDeleteFence,
  loadLinkFenceDevice,
  loadUserFenceList
} from "@/api/fence.js";
export default {
  name: "FencePolygon",
  props: {},
  components: {
    "user-tree": UserTreeComp,
    "info-box1": InfoBox1,
    "baidu-map": baiduMapComp,
    "link-device-list": LinkDeviceList,
    "fence-list": FenceList,
    "google-map": googleMapComp,
    "a-map": AMapComp,
    "open-street-map": OpenStreetMap
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    deviceImei: "", //当前选中设备
    currentList: 0, //当前列表，客户，设备，已关联设备
    deviceList: [], //设备列表
    fenceList: [], //围栏列表
    mapName: "FencePolygon", //地图标识名称
    page: {
      //设备列表分页器
      name: "FencePolygon",
      limit: 50,
      num: 1,
      current: 1,
      total: 0
    },
    isDraw: false, //是否处于绘图状态
    isEdit: false, //是否处于编辑图形状态
    points: [], //绘图的经纬度端点
    fenceName: "", //围栏名称
    fenceId: 0, //围栏id
    isInFenceAlarm: false, //进围栏报警是否开启
    isOutFenceAlarm: false, //出围栏报警是否开启
    inFenceTime: 20, //进围栏后时间
    outFenceTime: 20, //出围栏后时间
    searchKey: "", //搜索设备关键词
    linkList: [], //已关联设备列表
    currentTab: "0", //对话框当前tab，设备，已关联设备，围栏设置
    isSearch: false, //是否处于搜索设备状态
    originList: "[]", //原始设备列表
    originLink: "[]", //原始关联设备列表
    deviceInfo: null, //设备信息
    isLinkShow: false, //关联对话框是否显示
    isDrawBox: false, //绘图时围栏信息悬浮box
    searchFenceKey: "", //搜索围栏的关键词
    isFenceSearch: false, //是否搜索围栏列表状态
    originFence: "[]", //原始围栏列表
    deviceImeiByShow: "",
    theMap: "baidu-map",
    // theMap: "open-street-map",
    bigZoom: 13,
    mapOption: {},
    theMapLists: [],
    currentMap: 1
  }),
  created() {
    this.theMapLists = this.$t("playback.theMapList");
  },
  watch: {
    searchKey() {
      //搜索设备关键词
      if (!this.searchKey) {
        this.isSearch = false;
        this.deviceList = JSON.parse(this.originList);
      }
    },
    searchFenceKey() {
      //搜索围栏关键词
      if (!this.searchFenceKey) {
        this.isFenceSearch = false;
        this.fenceList = JSON.parse(this.originFence);
      }
    }
  },
  methods: {
    getTheMapCurrent(name) {
      console.log(name);
      let theMapList = this.$t("playback.theMapList");
      for (let i = 0; i < theMapList.length; i++) {
        if (name == theMapList[i].name) {
          return theMapList[i].num;
        }
      }
      return "";
    },
    mapNavigation(e) {
      console.log(e);
      // 后续改
      var name = e.target.dataset.index.trim();
      this.currentMap = this.getTheMapCurrent(name);
      // const query = JSON.parse(JSON.stringify(this.$route.query));
      // query.mapkey = this.currentMap;
      // this.$router.push({ path: this.$route.path, query });
      this.theMap = name;
      setTimeout(() => {
        this.onDevList();
        setTimeout(() => {
          var center = this.mapOption.center;
          var zoom = this.mapOption.zoom;

          if (this.theMap == "a-map") {
            center = gpsHelper.bd_encrypt(center.lat, center.lng);
            zoom = mapUtil.getGaodeZoomByBaidu(zoom);
          } else if (this.theMap == "baidu-map") {
            center = gpsHelper.bd_encrypt(center.lat, center.lng);
            zoom = mapUtil.getBaiduZoomByBing(zoom);
          } else if (this.theMap == "bing-map") {
            center = gpsHelper.bd_decrypt(center.lat, center.lng);
            zoom = mapUtil.getBingZoomByBaidu(zoom);
          } else if (this.theMap == "google-map") {
            center = gpsHelper.bd_decrypt(center.lat, center.lng);
            zoom = mapUtil.getBingZoomByBaidu(zoom);
          }

          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: center.lat,
            lng: center.lng
          });
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-zoom",
            zoom: zoom
          });
        }, 900);
      }, 1000);
    },
    saveMap(op) {
      // console.log(op);
      this.mapOption = op;
    },
    onMapZoom(center, zoom) {
      this.bigZoom = zoom > 13 ? zoom : 13;
    },
    drawingTrack() {
      // 觸發畫圍欄
      this.app.$emit("map-operation", {
        action: "draw-track-line",
        mapName: this.mapName
      });
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadDeviceList();
    },
    changeTab(idx) {
      // console.log(idx);
      this.currentTab = idx.name;
    },
    searchFenceList() {
      //搜索多边形围栏
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
        this.app.$emit("show-alert-msg", this.$t("fencePolygon.fenceNameTip"));
      }
    },
    showLinkDialog(idx, item) {
      //显示关联围栏对话框
      this.showFence(idx, item);
      this.isLinkShow = true;
    },
    onOverView() {
      //总览地图上设备
      var points = this.points;
      if (this.deviceInfo) {
        if (this.theMap == "baidu-map") {
          points.push(
            new BMap.Point(
              this.deviceInfo.location.bdlng,
              this.deviceInfo.location.bdlat
            )
          );
        } else {
          points.push({
            lng: this.deviceInfo.location.lng,
            lat: this.deviceInfo.location.lat
          });
        }
      }
      // console.log("points", points);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });
    },

    onSearchDevice() {
      //搜索设备
      if (this.searchKey && this.getStrLen1(this.searchKey) >= this.imeiLen) {
        this.isSearch = true;
        const data = {
          userId: this.userId ? this.userId : this.rootUser.userId,
          key: this.searchKey
        };
        searchDevInfo(data).then(res => {
          if (res.errCode == "200") {
            this.deviceList = res.data;
          }
        });
      }
    },
    showDevice(item) {
      // console.log(item);
      this.app.$emit("onselectDevice");
      //是否选中的设备
      // var that = this;
      var lat, lng;
      if (this.theMap == "baidu-map") {
        lat = item.bdlat;
        lng = item.bdlng;
      } else {
        lat = item.lat;
        lng = item.lng;
      }
      this.deviceImei = item.deviceImei;
      // if (item.bdlat && item.bdlng) {
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        lat: lat,
        lng: lng
      });
      // }
      if (!item.bdlng && !item.bdlat) {
        this.getNoLocation(item);
      }
      setTimeout(() => {
        this.app.$emit("refresh-infobox", item, this.mapName, this.theMap);
      }, 100);

      // 2021-1-13 start
      //end
      // 2020 - 11 - 12 - 09 - 44;
      loadFenceByImei({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == 200) {
          // 显示设备已关联的围栏
          var result = res.data;
          if (result) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].shapeParam) {
                var params = result[i].shapeParam.split(";");
                if (params) {
                  var points = [];
                  for (let j = 0; j < params.length; j++) {
                    let item = params[j].split(",");

                    points.push(
                      new BMap.Point(parseFloat(item[0]), parseFloat(item[1]))
                    );
                  }
                  this.points = points;
                }
              }
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "draw-polygon-track",
                points: this.points
              });
            }
          }
          if (res.data.length == 0) {
            this.app.$emit("map-operation", {
              action: "remove-polygon-track",
              mapName: this.mapName,
              points: this.points
            });
          }
        }
      });
    },
    getNoLocation(item) {
      //再次查询该设备的信息
      updateDevice({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == "200") {
          // console.log(res);
          this.deviceImeiByShow = res.data;
          if (this.deviceImeiByShow) {
            var bdlat = this.deviceImeiByShow.location.bdlat;
            var bdlng = this.deviceImeiByShow.location.bdlng;
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "add-marker",
              lat: bdlat,
              lng: bdlng,
              icon: mapUtil.getMarkerIcon(this.deviceImeiByShow.info),
              title: item.name,
              rotation: item.course,
              data: item
            });
            var points = [];

            if (this.theMap == "baidu-map") {
              points.push(new BMap.Point(bdlng, bdlat));
            } else {
              points.push(
                this.deviceImeiByShow.location.lon,
                this.deviceImeiByShow.location.lat
              );
            }
            // 2022-11-14
            // this.app.$emit("map-operation", {
            //   mapName: this.mapName,
            //   action: "set-view-port",
            //   points: points,
            // });
          }
        }
      });
    },
    onSaveFence() {
      //保存当前围栏信息
      this.app.$emit("load-more-ponits");
      var points = [];
      if (!this.fenceName) {
        this.app.$emit("show-alert-msg", this.$t("fencePolygon.fenceNameTip"));

        return;
      }
      if (this.inFenceTime % 5 != 0) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("fencePolygon.inFenceTimeTip")
        );
        return;
      }
      if (this.outFenceTime % 5 != 0) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("fencePolygon.outFenceTimeTip")
        );
        return;
      }
      if (this.points.length < 3) {
        this.app.$emit("show-alert-msg", this.$t("fencePolygon.pointTip"));
        return;
      }
      if (this.points.length > 30) {
        this.app.$emit("show-alert-msg", this.$t("fencePolygon.pointTip1"));
        return;
      }
      for (var i = 0; i < this.points.length; i++) {
        points.push(this.points[i].lng + "," + this.points[i].lat);
      }

      var data = {};
      if (this.fenceId) {
        //更新围栏信息
        var addDev = [];
        var delDev = [];
        var originLink = JSON.parse(this.originLink);
        if (originLink.length == 0) {
          for (let i = 0; i < this.linkList.length; i++) {
            addDev.push(this.linkList[i].deviceImei);
          }
          delDev = [];
        } else {
          for (let i = 0; i < this.linkList.length; i++) {
            let tag = true;
            for (var j = 0; j < originLink.length; j++) {
              if (this.linkList[i].deviceImei == originLink[j].deviceImei) {
                tag = false;
                break;
              }
            }
            if (tag) {
              addDev.push(this.linkList[i].deviceImei);
            }
          }

          for (let i = 0; i < originLink.length; i++) {
            let tag = true;
            for (let j = 0; j < this.linkList.length; j++) {
              if (this.linkList[j].deviceImei == originLink[i].deviceImei) {
                tag = false;
                break;
              }
            }
            if (tag) {
              delDev.push(originLink[i].deviceImei);
            }
          }
        }

        data = {
          defenseName: this.fenceName,
          shapeParam: points.join(";"),
          deviceImeiList: addDev.join(","),
          isEnterAlarm: this.isInFenceAlarm ? 1 : 0,
          enterAlarmTimes: this.inFenceTime,
          isLeaveAlarm: this.isOutFenceAlarm ? 1 : 0,
          leaveAlarmTimes: this.outFenceTime,
          rdId: this.fenceId,
          delDeviceImeiList: delDev.join(",")
        };
      } else {
        //添加围栏
        var dev = [];
        for (let i = 0; i < this.linkList.length; i++) {
          dev.push(this.linkList[i].deviceImei);
        }
        data = {
          defenseName: this.fenceName,
          isEnterAlarm: this.isInFenceAlarm ? 1 : 0,
          enterAlarmTimes: this.inFenceTime,
          isLeaveAlarm: this.isOutFenceAlarm ? 1 : 0,
          leaveAlarmTimes: this.outFenceTime,
          shapeParam: points.join(";"),
          deviceImeiList: dev.join(",")
        };
      }

      doBatchSaveFence(data).then(res => {
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("fencePolygon.saveOk"));
          this.onFenceAction("save");
          this.loadFenceList();
          this.loadLinkDevice();
          this.isDrawBox = false;
        } else {
          this.app.$emit("show-alert-msg", this.$t("fencePolygon.saveFail"));
        }
      });
    },
    onDelFence(idx, item) {
      //删除围栏
      var str = this.$t("fencePolygon.delTip").replace(
        "_fence_",
        item.defenseName
      );
      var that = this;
      this.app.$emit("show-confirm-msg", str, function() {
        doDeleteFence({ rdId: item.rdId }).then(res => {
          if (res.errCode == "200") {
            that.app.$emit("show-alert-msg", that.$t("fencePolygon.delOk"));
            that.fenceList.splice(idx, 1);
            that.onFenceAction("clear");
          } else {
            that.app.$emit("show-alert-msg", that.$t("fencePolygon.delFail"));
          }
        });
      });
    },
    showFence(idx, item) {
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "remove-polygon-track"
      });
      //显示围栏
      this.isDrawBox = true;
      // document.querySelector("#baidu_map_" + this.mapName + ">div").classList.remove("draw");
      // document.querySelector("#baidu_map_" + this.mapName + ">div").classList.remove("move");
      console.log(item);
      this.isDraw = true;
      this.fenceId = item.rdId;
      this.fenceName = item.defenseName;
      this.isInFenceAlarm = item.isEnterAlarm == 1;
      this.isOutFenceAlarm = item.isLeaveAlarm == 1;
      this.inFenceTime = item.enterAlarmTimes;
      this.outFenceTime = item.leaveAlarmTimes;
      var params = item.shapeParam.split(";");
      var points = [];
      for (let i = 0; i < params.length; i++) {
        let item = params[i].split(",");

        points.push(new BMap.Point(parseFloat(item[0]), parseFloat(item[1])));
      }
      this.points = points;

      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "draw-polygon-track",
        points: points
      });
      // 2022-11-14
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });

      this.loadLinkDevice();
    },
    loadLinkDevice() {
      //加载围栏关联的设备
      loadLinkFenceDevice({ rdId: this.fenceId }).then(res => {
        if (res.errCode == "200") {
          this.linkList = res.data;
          this.originLink = JSON.stringify(res.data);
        }
      });
    },
    onFenceAction(tag) {
      //画图操作
      switch (tag) {
        case "draw": //开始画图
          this.isEdit = false;
          this.app.$emit("map-operation", {
            action: "draw-track-line",
            mapName: this.mapName
          });
          break;
        case "add": //添加新围栏
          this.isDrawBox = true;
          this.fenceId = 0;
          this.fenceName = "";
          this.points = [];
          this.isOutFenceAlarm = false;
          this.isInFenceAlarm = false;
          this.inFenceTime = 0;
          this.outFenceTime = 0;
          this.linkList = [];
          this.isDraw = true;
          this.isEdit = false;
          this.app.$emit("map-operation", {
            action: "remove-polygon-track",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "draw-track-line",
            mapName: this.mapName
          });
          break;

        case "clear": //清空地图围栏
          this.points = [];
          this.isEdit = false;
          this.app.$emit("map-operation", {
            action: "remove-polygon-track",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "draw-track-line",
            mapName: this.mapName
          });
          break;
        case "quit":
          this.isEdit = false;
          // this.app.$emit("map-operation", {
          //   action: "quit-polygon-track",
          //   mapName: this.mapName,
          // });
          this.app.$emit("map-operation", {
            action: "remove-polygon-track",
            mapName: this.mapName
          });
          break;
        case "edit":
          this.isEdit = true;
          this.app.$emit("map-operation", {
            action: "quit-polygon-track",
            mapName: this.mapName
          });
          break;
        case "save": //保存围栏
          this.isDraw = false;
          this.app.$emit("map-operation", {
            action: "remove-polygon-track",
            mapName: this.mapName
          });
          break;
      }
    },
    onSelectUser(userId) {
      //修改当前选中用户加载设备列表
      this.page.current = 1;
      this.userId = userId;
      this.loadDeviceList();
    },
    loadDeviceList() {
      //加载设备列表
      this.isSearch = false;
      const data = {
        userId: this.userId ? this.userId : this.rootUser.userId,
        page: this.page.current,
        pageSize: this.page.limit,
        actionType: "all"
      };
      loadDeviceImeiList(data).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.devList.length; i++) {
            res.data.devList[i].address = "";
          }
          this.originList = JSON.stringify(res.data.devList);
          this.deviceList = res.data.devList;
          this.page.num = Math.ceil(res.data.allCount / this.page.limit);
          this.page.total = res.data.allCount;
          setTimeout(() => {
            this.onDevList();
          }, 1000);
        }
      });
    },
    loadFenceList() {
      //加载登录用户围栏列表
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
    onDevList() {
      // console.log("zhixing");
      //加载设备到地图上
      // this.app.$emit("map-operation", {
      //   mapName: this.mapName,
      //   action: "clear-map",
      // });
      var points = [];
      for (var i = 0; i < this.deviceList.length; i++) {
        var item = this.deviceList[i];
        // console.log("item", item);
        // mapUtil.disposeDeviceIcon(item, false);
        var lat, lng;
        if (this.theMap == "baidu-map") {
          lat = item.bdlat;
          lng = item.bdlng;
        } else {
          lat = item.lat;
          lng = item.lng;
        }
        // console.log("dadaddsasda");
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-marker",
          lat: lat,
          lng: lng,
          icon: mapUtil.getMarkerIcon(item),
          // icon: item.iconPath,
          title: item.name,
          rotation: item.course,
          data: item
        });
        if (this.theMap == "baidu-map") {
          points.push(new BMap.Point(item.bdlng, item.bdlat));
        } else {
          // console.log("zhixing", item);
          points.push({
            lng: item.lng,
            lat: item.lat
          });
        }
      }
      this.showDevice(this.deviceList[0]);
      // 2022-11-14
      // this.app.$emit("map-operation", {
      //   mapName: this.mapName,
      //   action: "set-view-port",
      //   points: points,
      // });
    },
    onMapOver(op) {
      //最后的点随着鼠标移动
      if (op.mapName == this.mapName && this.isDraw && !this.isEdit) {
        if (this.points.length >= 3) {
          this.points[this.points.length - 1] = op.point;

          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "draw-polygon",
            points: this.points
          });
        }
      }
    },
    onInfoBox(op, mapName) {
      //更新地图设备信息
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
    loadTrackPoints(op) {
      console.log("op", op);
      this.points = op;
    },
    listenEvent() {
      this.app.$on("map-select-marker", this.showDevice);
      this.app.$on("infobox-data", this.onInfoBox);
      // this.app.$on("map-over", this.onMapOver);
      this.app.$on("load-track-points", this.loadTrackPoints);
      this.app.$on("agin-load-device", this.loadDeviceList);
    },
    offEvent() {
      this.app.$off("map-select-marker", this.showDevice);
      this.app.$off("infobox-data", this.onInfoBox);
      // this.app.$off("map-over", this.onMapOver);
      this.app.$off("load-track-points", this.loadTrackPoints);
      this.app.$off("agin-load-device", this.loadDeviceList);
    }
  },
  mounted() {
    this.listenEvent();
    this.moveVertical();
    this.moveHoriztion();
    var that = this;
    if (this.deviceImeiByShow) {
      // this.getNoLocation();
      // console.log(this.deviceImeiByShow);
    }
    this.$nextTick(function() {
      that.loadFenceList();
      that.loadDeviceList();
    });
  },
  beforeDestroy() {
    this.offEvent();
  },
  updated() {}
};
</script>

<style lang="scss" scoped>
.map-type-choose {
  display: inline-block;
  position: fixed;
  right: 20px;
  z-index: 9;
  top: 30%;
}
.fence-polygon {
  display: flex;
  flex-direction: row;
}
.btn-save-fence {
  position: absolute;
  right: 10px;
  top: 5px;
}
.body-content-right-fence {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
}
.fence-polygon {
  ::v-deep .el-pagination {
    text-align: center;
  }
}
.s-link-device {
  ::v-deep .el-pagination {
    text-align: center;
  }
}
.left-right-box .right-box {
  display: flex;
  align-items: center;
  flex: unset;
}
</style>
