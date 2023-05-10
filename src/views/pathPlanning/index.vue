<template>
  <section class="body-content layout-container circuit-content">
    <div class="form-card1">
      <div class="card-header" style="display: flex;align-items: center;">
        路线规划
      </div>
    </div>

    <div class="gaode-map-content">
      <div
        class="xianluguihua"
        :style="{ width: ishowLuXianBox ? '400' + 'px' : '0' + 'px' }"
      >
        <div class="xianlu-content">
          <div
            class="left-tabar-control"
            @click="ishowLuXianBox = !ishowLuXianBox"
          >
            <img src="@/assets/img/infobox/playback.png" alt="" />
          </div>
          <el-tabs
            type="border-card"
            v-model="activeName"
            @tab-click="handleClick"
            v-if="ishowLuXianBox"
          >
            <el-tab-pane label="轨迹点" name="first" stretch="true">
              <el-form label-width="100">
                <el-form-item label="名称">
                  <el-input v-model="roadName" style="width: 100px"></el-input>
                  <div class="orange-box">
                    请在地图上画点，右击结束，取消
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="drawingTrack"
                    :class="['draw-track', isDrawing ? 'active' : '']"
                    >画点</el-button
                  >
                  <el-button type="primary" size="mini" @click="savePlanTrack"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="起始取点" name="second">
              <el-form label-width="100">
                <el-form-item label="名称">
                  <el-input v-model="roadName" style="width: 100px"></el-input>
                </el-form-item>
                <el-form-item label="开始">
                  <!-- <el-input v-model="sLnglat" style="width: 150px" size="mini"></el-input> -->
                  <el-checkbox v-model="startCheck"></el-checkbox>
                  <span v-show="sLnglat"
                    >{{ sLnglat.lng }}, {{ sLnglat.lat }}</span
                  >
                </el-form-item>
                <el-form-item label="结束">
                  <!-- <el-input v-model="lLnglat" style="width: 150px" size="mini"></el-input> -->
                  <el-checkbox v-model="lastCheck"></el-checkbox>
                  <span v-show="lLnglat"
                    >{{ lLnglat.lng }}, {{ lLnglat.lat }}</span
                  >
                </el-form-item>
                <el-form-item>
                  <div class="orange-box">
                    请在地图上取开始和结束点，请选择再点击地图取点
                  </div>
                </el-form-item>
                <el-form-item>
                  <!-- <el-button type="primary" size="mini" @click="drivingTrack"
                    >起始取点</el-button
                  > -->
                  <el-button type="primary" size="mini" @click="savePlanTrack"
                    >保存</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="线路列表" name="third">
              <div class="xianlu-liebiao">
                <!--  -->
                <data-table
                  :data="circuitList"
                  height="100%"
                  :show-page="false"
                >
                  <el-table-column label="名称">
                    <template slot-scope="props">
                      <a @click="showPlan(props.row)">{{
                        props.row.roadName
                      }}</a>
                    </template>
                  </el-table-column>
                  <el-table-column label="创建时间" width="135">
                    <template slot-scope="props">
                      {{ props.row.createTime | fdatetime }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" style="flex:1">
                    <template slot-scope="props">
                      <a @click="ShowBangDingDevice(props.row)">绑定</a>
                      <a @click="removePlan(props.row)">删除</a>
                    </template>
                  </el-table-column>
                </data-table>
              </div>
              <div class="bonded-device-list">
                <div class="crearfix">
                  已绑定的设备列表
                </div>
                <div
                  style="height: 280px;overflow-x: auto; overflow-y: hidden;"
                >
                  <!--  -->
                  <data-table :data="bondDeviceList" :show-page="false">
                    <el-table-column
                      :label="$t('batchTransfer.device')"
                      width="130"
                    >
                      <template slot-scope="props">
                        <a @click="showDevice(props.row)">{{
                          props.row.deviceImei
                        }}</a>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('common.deviceName')"
                      style="flex:1"
                      prop="name"
                    ></el-table-column>
                    <el-table-column :label="$t('common.operation')" width="80">
                      <template slot-scope="props">
                        <a @click="unbindDevice(props.$index)">解绑</a>
                        <a @click="doPlayback(props.row)">回放</a>
                      </template>
                    </el-table-column>
                  </data-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="btn-change-maptype">
        <el-button size="mini" @click="changeMapType">普通</el-button>
      </div>
      <div id="amap_circuit" style="height: 100%;width: 100%;">
        <a-map :is-satellite="isSatellite" :map-name="mapName"></a-map>
      </div>
    </div>
    <dialog-comp
      :visible.sync="isShowBangding"
      :dialog-title="'路线绑定设备'"
      :dialog-width="500"
      icon-window="icon-zanwuchongzhijilu"
    >
      <el-tabs v-model="activeName1" @tab-click="handleClick1">
        <el-tab-pane name="addDevice" label="绑定设备">
          <div class="bond-device">
            <el-form label-width="120px">
              <el-form-item label="线路名称">
                <el-input
                  size="small"
                  v-model="currentPlan.roadName"
                  style="width: 200px"
                ></el-input>
                <el-button
                  class="btn-primary-button"
                  @click="showAddDeviceBox"
                  style="vertical-align: middle;"
                  >选择设备</el-button
                >
                <device-choose
                  :is-show-box.sync="isShowBox"
                  @select-result="dealUserItem"
                ></device-choose>
              </el-form-item>
            </el-form>
            <!--  -->
            <div class="btn-content" style="text-align: right;">
              <el-button
                size="small"
                type="danger"
                @click="doResetDeviceList"
                >{{ $t("common.reset") }}</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="doBatchBondDevice"
                >{{ $t("phoneNotify.bangding") }}</el-button
              >
            </div>
            <div style="height: 280px;overflow-x: auto; overflow-y: hidden;">
              <!--  -->
              <data-table :data="deviceList" :show-page="false">
                <el-table-column
                  :label="$t('batchTransfer.device')"
                  width="140"
                  prop="deviceImei"
                ></el-table-column>
                <el-table-column
                  :label="$t('common.deviceName')"
                  style="flex:1"
                  prop="name"
                ></el-table-column>
                <el-table-column :label="$t('common.operation')" width="80">
                  <template slot-scope="props">
                    <a @click="delSingalDev(props.$index)">{{
                      $t("common.delete")
                    }}</a>
                  </template>
                </el-table-column>
              </data-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="queryDevice" label="已绑定设备">
          <div class="bond-device">
            <el-form label-width="120px">
              <el-form-item label="线路名称">
                <el-input
                  size="small"
                  v-model="currentPlan.roadName"
                  style="width: 200px"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="btn-content" style="text-align: right;">
              <!-- <el-button size="small" type="primary" @click="doBatchUnBondDevice">批量解绑</el-button> -->
            </div>
            <div style="height: 280px;overflow-x: auto; overflow-y: hidden;">
              <!--  -->
              <data-table :data="bondDeviceList" :show-page="false">
                <el-table-column
                  :label="$t('batchTransfer.device')"
                  width="140"
                  prop="deviceImei"
                ></el-table-column>
                <el-table-column
                  :label="$t('common.deviceName')"
                  style="flex:1"
                  prop="name"
                ></el-table-column>
                <el-table-column :label="$t('common.operation')" width="80">
                  <template slot-scope="props">
                    <a @click="unbindDevice(props.$index)">解绑</a>
                  </template>
                </el-table-column>
              </data-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </dialog-comp>
    <div class="device-playback" v-show="isShowPlayback">
      <div
        style="width: 100%;box-shadow: 0 0 1rem 0 rgba(0,0,0,0.3);z-index: 9;background: white;position: relative;text-align:center;line-height:3rem;padding-top:5px"
      >
        <div style="margin:0 auto;white-space:nowrap;font-size:14px">
          <el-input
            v-model="deviceImei"
            style="width:130px"
            size="small"
          ></el-input>
          <!-- 快速选择时间 -->
          {{ $t("playback.start") }}:
          <el-date-picker
            v-model="startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          ></el-date-picker>
          {{ $t("playback.end") }}:
          <el-date-picker
            v-model="endTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
          ></el-date-picker>
          <!-- 快速选择项 -->
          <div class="choosequick" style="display:inline-block;margin:0 5px">
            <!--  :title="$t('common.options')" -->
            <el-popover
              placement="bottom"
              trigger="hover"
              popper-class="option"
            >
              <div style="padding:2px 20px">
                <div class="option-item">
                  <span class="but-bar" @click="changeTimeRange('hour')">{{
                    $t("playback.lastHour")
                  }}</span
                  ><span class="bar">|</span>
                  <span class="but-bar" @click="changeTimeRange('today')">{{
                    $t("playback.today")
                  }}</span
                  ><span class="bar">|</span>
                  <span class="but-bar" @click="changeTimeRange('yesterday')">{{
                    $t("playback.yesterday")
                  }}</span
                  ><span class="bar">|</span>
                  <span class="but-bar" @click="changeTimeRange('7days')">{{
                    $t("playback.day7")
                  }}</span>
                </div>
                <div class="option-item ml-20">
                  <el-checkbox v-model="isFilter">{{
                    $t("playback.filter")
                  }}</el-checkbox>
                </div>
                <div class="option-item ml-20">
                  {{ $t("playback.stayMarker") }}:
                  <el-select
                    class="text-input small"
                    v-model="selectStay"
                    style="width:10rem"
                    size="small"
                  >
                    <el-option
                      v-for="(item, idx) in $t('playback.stayTime')"
                      :value="item.val"
                      :key="'stayTime' + idx"
                      :label="item.text"
                    ></el-option>
                  </el-select>
                </div>
                <!-- 超速 -->
                <div class="option-item ml-20">
                  <!-- 超速显示设置 -->
                  <el-checkbox v-model="isSpeed">{{
                    $t("playback.showSpeed")
                  }}</el-checkbox>
                  <el-input
                    style="width: 5rem;text-align:center;"
                    size="small"
                    v-model="speed"
                  />
                  km/h
                </div>
                <div class="option-item local-type-span ml-20">
                  <span v-show="isLocaType">
                    <el-checkbox-group
                      v-model="selectLocaType"
                      v-for="(item, idx) in $t('playback.locaTypes')"
                      :key="'locaTypes' + idx"
                      style="display:inline-block;margin-right:10px"
                    >
                      <el-checkbox :label="item.val">{{
                        item.text
                      }}</el-checkbox>
                    </el-checkbox-group>
                  </span>
                </div>
              </div>
              <!-- 点击 -->
              <span slot="reference" style="font-size:18px">
                <i class="el-icon-s-operation" slot="reference"></i>
                <span style="font-size: 14px;">{{ $t("common.options") }}</span>
              </span>
            </el-popover>
          </div>
          <!-- 查询轨迹点击 -->
          <div class="btn-search-track" style="display:inline-block">
            <el-button type="primary" @click="loadRecord">
              <i class="el-icon-video-play"></i>
              {{ $t("common.search") }}
            </el-button>
          </div>
          <el-button
            type="success"
            @click="showDownloadTrack"
            :disabled="!isLoadTrack"
            style="margin-left:5px"
          >
            <i class="el-icon-download"></i>
            {{ $t("common.download") }}
          </el-button>
          <el-button @click="isShowPlayback = false">
            隐藏
          </el-button>
        </div>
        <!-- {{ $t(isStart ? "playback.stop" : "playback.start") }} -->
        <div
          style="margin:0px auto;white-space:nowrap;padding:5px 0;font-size:14px"
        >
          <el-button
            :type="isStart ? 'info' : 'warning'"
            @click="
              trackListlength > 0
                ? isStart
                  ? stopTrack()
                  : startTrack()
                : (isStart = false)
            "
          >
            {{ isStart ? $t("playback.stop") : $t("playback.start") }}
          </el-button>
          <el-button type="info" @click="resetTrack">{{
            $t("common.reset")
          }}</el-button>
          <input
            type="range"
            class="text-input"
            :style="{
              width: '400px',
              backgroundImage:
                'linear-gradient(to right,#f5a403 ' +
                (currentTrack / (trackListlength - 1)) * 100 +
                '%, gray ' +
                (currentTrack / (trackListlength - 1)) * 100 +
                '%)'
            }"
            v-model.number="currentTrack"
            :max="isLoadTrack ? trackListlength - 1 : 100"
            min="0"
          />
          {{ $t("playback.playSpeed") }}:
          <el-select v-model="playSpeed" style="width:8rem">
            <el-option value="50" label="X50"></el-option>
            <el-option value="100" label="X100"></el-option>
            <el-option value="200" label="X200"></el-option>
            <el-option value="500" label="X500"></el-option>
          </el-select>
          <!-- <el-button type="info" @click="showTrackRoute" v-show="isLoadTrack">
            <i class="el-icon-view"></i>
            {{ $t("playback.trackRoute") }}
          </el-button> -->
          <el-button
            type="warning"
            @click="isTrackTable = true"
            v-show="isLoadTrack"
          >
            <i class="el-icon-view"></i>
            轨迹点详情
          </el-button>
        </div>
      </div>
    </div>
    <dialog-comp
      :visible.sync="isShowDownload"
      :dialog-title="$t('trackTable.download')"
      :dialog-width="300"
      dialog-unit="px"
    >
      <div class="down-content" style="text-align:center">
        <div class="title">
          <span class="title-co">
            <i class="iconfont icon-warn"></i>
            {{ $t("playback.limit") }}
          </span>
        </div>
        <table class="form-table" style="margin:0.8rem auto;">
          <tr>
            <td>{{ $t("common.deviceImei") }}：</td>
            <td>{{ deviceImei }}</td>
          </tr>
          <tr>
            <td>{{ $t("playback.start") }}:</td>
            <td>
              <el-date-picker
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 185px"
                disabled
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>{{ $t("playback.end") }}:</td>
            <td>
              <el-date-picker
                v-model="endTime"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 185px"
                disabled
              ></el-date-picker>
            </td>
          </tr>
        </table>

        <div class="down-load mt10">
          <div class="mb5">
            <button class="btn-download" @click="exportTrack">
              <i class="iconfont icon-biaoge"></i>
              {{ $t("playback.download") }}
            </button>
          </div>
          <span class="pt10">{{ $t("playback.downloadXls") }}</span>
        </div>
        <div class="down-load mt10">
          <div class="mb5">
            <button class="btn-download" @click="downloadTrackKml">
              <i class="iconfont icon-daoruGoogleKML"></i>
              {{ $t("playback.download1") }}
            </button>
          </div>
          <span class="pt10">{{ $t("playback.downloadKml") }}</span>
          <a
            target="_blank"
            href="https://www.google.com/earth/download/gep/agree.html"
            class="download-earth"
            >»{{ $t("playback.downloadEarth") }}</a
          >
        </div>
      </div>
    </dialog-comp>
    <info-box
      :map-name="mapName"
      :device-name="deviceName"
      :device-imei="deviceImei"
    ></info-box>
    <track-table :is-show.sync="isTrackTable"></track-table>
  </section>
</template>

<script>
import AMapComp from "@/components/map/AMapComp.vue";
import DeviceChooseBox from "@/views/pathPlanning/DeviceAddBox.vue";
import RecordLib from "@/utils/recordLib.js";
import mapUtil from "@/utils/mapUtil.js";
import gpsHelper from "@/utils/gpsHelper.js";
import InfoBox from "@/components/map/InfoBoxComp";
import TrackTable from "@/views/pathPlanning/trackTable.vue";
import { updateDevice } from "@/api/monitor.js";
import { loadDeviceTrackRecord } from "@/api/playback";
import {
  removeDevicePlan,
  loadBondedDevice,
  bondDevicePlan,
  removePlanTrack,
  addPlanTrack,
  getPlanTrack
} from "@/api/pathPlanning";
var trackList = [];
var trackData = null;
var originRecord = [];
export default {
  name: "Circuit",
  components: {
    "a-map": AMapComp,
    "device-choose": DeviceChooseBox,
    "info-box": InfoBox,
    "track-table": TrackTable
  },
  data: () => ({
    ishowLuXianBox: false,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    map: null,
    isSatellite: false,
    mapName: "circuit",
    isDrawing: false,
    locationLnglat: [],
    originLngLat: [],
    sLnglat: "",
    lLnglat: "",
    activeName: "first",
    startCheck: false,
    lastCheck: false,
    roadName: "",
    circuitList: [],
    page: {
      current: 0,
      pageSize: 30,
      total: 0,
      num: 0
    },
    page1: {
      current: 0,
      pageSize: 30,
      total: 0,
      num: 0
    },
    isShowBangding: false,
    currentPlan: [],
    deviceList: [],
    activeName1: "addDevice",
    isShowBox: false,
    bondDeviceList: [],
    // 轨迹回放
    isShowPlayback: false,
    startTime: new Date().format("yyyy-MM-dd hh:mm"), //开始时间
    endTime: new Date().format("yyyy-MM-dd hh:mm"), //结束时间
    isFilter: false, //是否开启过滤
    selectStay: 3, //选中停留时间
    selectStay1: 3, //查看行程中停留时间
    isSpeed: false, //是否开启超速标记
    speed: 50, //超速速度
    isStart: false, //是否开始播放
    playSpeed: 100, //播放速度
    currentTrack: 0, //回放运行点idx
    trackListlength: 100, //轨迹点数量
    staticPoint: [], //停留点
    lat: 0, //运行点的纬度
    lng: 0, //运行点的经度
    isMonthOver: false, //是否时间范围超过一个月
    isTimeBefore: false, //是否开始时间大于结束时间
    isYearOver: false, //是否时间范围大于半年
    deviceImei: "",
    isLoadTrack: false, //是否处于加载轨迹的状态
    isShowDownload: false,
    routeList: [], //查看行程的行程表格
    stayList: [], //查看行程的停留表格
    isLocaType: true,
    selectLocaType: [], //选中的定位方式
    trackInfo: {
      //轨迹信息
      playbackTime: 0,
      runTime: 0,
      mileage: "0km"
    },
    isTrackTable: false, //是否显示轨迹详情表格
    points: [], //轨迹点，用于总览轨迹路径
    isShowOver: false, //是否显示回放结束对话框
    isShowRoute: false, //是否显示行程对话框
    currentTab: 0, //当前查看行程对话框的tab
    routeList: [], //查看行程的行程表格
    stayList: [], //查看行程的停留表格
    offsetX1: "",
    offsetY1: "",
    currentMap: 0,
    isShowDownload: false, //查看下载轨迹方式
    timeRange: "Selection Time",
    isLocation: false,
    theMap: "a-map",
    deviceName: "zenos"
  }),
  computed: {
    tagDataLatLng() {
      let sLnglatStr = this.sLnglat;
      let lLnglatStr = this.lLnglat;
      return {
        sLnglatStr,
        lLnglatStr
      };
    }
  },
  watch: {
    tagDataLatLng(val) {
      // console.log('val', val)
      if (val.sLnglatStr && val.lLnglatStr) {
        this.drivingTrack();
      }
    },
    isDrawing() {
      if (!this.isDrawing) {
        this.locationLnglat = [];
      }
    },
    startCheck() {
      if (this.startCheck) {
        this.app.$emit("map-operation", {
          action: "do-s-map-click",
          mapName: this.mapName
        });
      } else {
        this.app.$emit("map-operation", {
          action: "off-s-track-click",
          mapName: this.mapName
        });
      }
    },
    lastCheck() {
      if (this.lastCheck) {
        this.app.$emit("map-operation", {
          action: "do-l-map-click",
          mapName: this.mapName,
          tag: "lastCheck"
        });
      } else {
        this.app.$emit("map-operation", {
          action: "off-l-track-click",
          mapName: this.mapName
        });
      }
    },
    // 轨迹播放
    selectLocaType() {
      //只显示选中定位方式的点
      if (trackList.length > 0) this.filterRecord(originRecord, false);
    },
    //是否开启超速点
    isSpeed() {
      //是否显示超速点
      if (trackList.length == 0) {
        this.isStart = false;
        this.currentTrack = 0;
        return;
      }
      if (this.isSpeed && trackList.length > 0) {
        this.app.$emit("show-progress-page", 0);
        var that = this;
        this.app.$emit("map-operation", {
          action: "del-point",
          tag: "overspeed",
          mapName: this.mapName
        });
        setTimeout(() => {
          that.showOverspeedPoint();
          that.app.$emit("show-progress-page", 100);
        }, trackList.length);
      } else {
        this.app.$emit("map-operation", {
          action: "del-point",
          tag: "overspeed",
          mapName: this.mapName
        });
      }
    },
    isFilter() {
      //是否开启智能过滤
      if (trackList.length > 0) this.filterRecord(originRecord, false);
    },
    currentTrack() {
      //改变运行轨迹idx
      if (trackList.length == 0) {
        this.isStart = false;
        this.currentTrack = 0;
        return;
      }
      this.doTrack();
    }, //currentTrack

    selectStay() {
      //改变轨迹停留时间
      if (trackList.length > 0) {
        this.app.$emit("show-progress-page", 0);
        var that = this;
        this.app.$emit("map-operation", {
          action: "del-point",
          tag: "stay",
          mapName: this.mapName
        });
        setTimeout(() => {
          that.showStaticPoint();
          that.app.$emit("show-progress-page", 100);
        }, trackList.length);
      }
    }, //selectStay

    speed() {
      //改变超速速度
      if (this.isSpeed && trackList.length > 0) {
        this.app.$emit("show-progress-page", 0);
        var that = this;
        this.app.$emit("map-operation", {
          action: "del-point",
          tag: "overspeed",
          mapName: this.mapName
        });
        setTimeout(() => {
          that.showOverspeedPoint();
          that.app.$emit("show-progress-page", 100);
        }, trackList.length);
      }
    }
  },
  methods: {
    // 设备轨迹回放 2022-11-15 start
    showTrackTable() {
      //显示轨迹详情表格
      this.app.$emit("track-table-stay");
      this.isTrackTable = true;
    },
    downloadTrackKml() {
      var device_title = this.deviceImei.slice(-5) + "kml";
      let startTimeStr = new Date(
        this.getZoneData(new Date(this.startTime).getTime())
      ).getTime();
      let endTimeStr = new Date(
        this.getZoneData(new Date(this.endTime).getTime())
      ).getTime();
      var data = {
        kmlName: device_title,
        deviceImei: this.deviceImei,
        from: startTimeStr,
        to: endTimeStr
      };
      this.postKml(this.API.recordKml, data, res => {
        // console.log("res", res);
        let kml = "application/x-www-form-urlencoded; charset=UTF-8";
        // let kml = "application/octet-stream;charset=UTF-8";
        // let kml = "application/vnd.openxmlformats-officedocument.spreadshe etml.sheet;encoding=UTF-8";
        let blob = new Blob([res], { type: kml });
        var downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = `${device_title}.kml`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      });
    },
    download(blobUrl) {
      console.log(blobUrl);
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = "<文件名>";
      a.href = blobUrl;
      a.click();
      document.body.removeChild(a);
    },
    getaCcuracyType(num) {
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
          return 0;
        case "2":
        case "4":
        case "5":
        case "6":
          return op.altitude;
        default:
          return 0;
      }
    },
    //播放轨迹点
    exportTrack() {
      //下载轨迹
      var origin_data = trackList;
      // console.log(trackData);
      var titles = [
        this.$t("trackTable.time"),
        this.$t("alarm.longitude"),
        this.$t("alarm.latitude"),
        this.$t("alarm.speed"),
        this.$t("trackTable.direction"),
        this.$t("trackTable.altitude") + "(米)",
        this.$t("trackTable.accuracyType"),
        this.$t("trackTable.temperature"),
        this.$t("trackTable.between") + "cm",
        this.$t("common.address")
      ];
      var list = [];
      for (let i = 0; i < origin_data.length; i++) {
        var item = origin_data[i];
        item.altitude = this.getAltitude(item, item.accuracyType);
        item.accuracyType = this.getaCcuracyType(item.accuracyType);
        let latlngDistance;
        if (i > 0) {
          latlngDistance = gpsHelper
            .distance(
              origin_data[i - 1].realPt.lat,
              origin_data[i - 1].realPt.lng,
              origin_data[i].realPt.lat,
              origin_data[i].realPt.lng
            )
            .toFixed(2);
          latlngDistance = this.signFigures(latlngDistance) * 100;
        }
        list.push([
          new Date(item.realTime).format("yyyy-MM-dd hh:mm:ss"),
          item.realPt.lng.toFixed(6),
          item.realPt.lat.toFixed(6),
          item.speed,
          item.course,
          item.altitude,
          item.accuracyType,
          item.temperature == "-1" ? "--" : item.temperature,
          latlngDistance ? latlngDistance : "0",
          item.position
        ]);
      }
      // ExportUtil.exportTable(titles, list, this.deviceImei + "回放轨迹(" + this.startTime + "-" + this.endTime + ")");
      import("@/utils/Export2Excel").then(excel => {
        excel.export_json_to_excel({
          header: titles,
          data: list,
          filename:
            this.deviceImei +
            "回放轨迹(" +
            this.startTime +
            "-" +
            this.endTime +
            ")",
          bookType: "xlsx"
        });
      });
    },
    doTrack() {
      if (trackList.length == 0) {
        this.isStart = false;
        this.currentTrack = 0;
        return;
      }
      var that = this;
      if (this.currentTrack == trackList.length - 1 && this.isStart) {
        this.isStart = false;
        this.isShowOver = true;
      } else {
        if (that.currentTrack < trackList.length) {
          var trackItem = trackList[that.currentTrack];
          this.theMap == "baidu-map"
            ? (that.lat = trackItem.baiduPt.lat)
            : (that.lat = trackItem.realPt.lat);
          this.theMap == "baidu-map"
            ? (that.lng = trackItem.baiduPt.lng)
            : (that.lng = trackItem.realPt.lng);
          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "play-path",
            lat:
              this.theMap == "baidu-map"
                ? trackItem.baiduPt.lat
                : trackItem.realPt.lat,
            lng:
              this.theMap == "baidu-map"
                ? trackItem.baiduPt.lng
                : trackItem.realPt.lng,
            // 更新2020-12-19
            rotation:
              that.theMap == "a-map" ? trackItem.course : trackItem.course
            // rotation: that.theMap == "baidu-map" ? trackItem.course : trackItem.course,
          });
          this.theMap == "a-map"
            ? this.$set(trackItem, "theMap", this.theMap)
            : this.$set(trackItem, "theMap", this.theMap);
          // console.log(trackItem);
          that.app.$emit("playback-infobox", trackItem);
        }
      }
    },
    addToPath(record, isNoColor) {
      // console.log("触发了");
      console.log(record);
      //递归添加轨迹路线到地图上
      var line = [];
      if (!isNoColor) {
        var color = this.getSpeedColor(record[0].speed);
        var origin;
        this.theMap == "baidu-map"
          ? (origin = record[0].baiduPt)
          : (origin = record[0].realPt);
        // var origin = record[0].realPt;
        line.push(origin);
        for (let i = 1; i < record.length; i++) {
          //根据不同的速度画轨迹
          let pt;
          this.theMap == "baidu-map"
            ? (pt = record[i].baiduPt)
            : (pt = record[i].realPt);
          // let pt = record[i].realPt;
          line.push(pt);
          // let c = this.getSpeedColor(record[i].speed);
          // if (line.length >= 2 && (c != color || i == record.length - 1)) {
          //   this.app.$emit("map-operation", {
          //     mapName: this.mapName,
          //     action: "add-line",
          //     line: line,
          //     color: color,
          //   });
          //   color = c;
          //   line = [];
          //   origin = pt;
          //   line.push(origin);
          // }
        } //record.length
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-line1",
          line: line,
          color: "#0000ff"
        });
      } else {
        for (let i = 1; i < record.length; i++) {
          this.theMap == "baidu-map"
            ? line.push(record[i].baiduPt)
            : line.push(record[i].realPt);
          // line.push(record[i].realPt);
        }
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-line1",
          line: line,
          color: "#0000FF"
        });
      }
      // this.app.$emit("map-operation", {
      //   mapName: this.mapName,
      //   action: "add-line",
      //   line: line,
      //   color: "#0000FF",
      // });
    },
    drawPath(record) {
      //添加轨迹路径
      if (record.length >= 6000) {
        this.addPathByIndex(record, 0);
      } else {
        this.addToPath(record);
        this.addPathPoint(record);
      }
    },
    addPathByIndex(record, index) {
      //当轨迹点太多时分批添加
      var that = this;
      var sliceLen = 500;
      this.app.$emit(
        "show-progress-page",
        ((index / Math.ceil(record.length / sliceLen)) * 100).toFixed(1)
      );
      if (index < Math.ceil(record.length / sliceLen)) {
        var start = index * sliceLen;
        var end = (index + 1) * sliceLen;
        this.addToPath(record.slice(index > 0 ? start - 1 : 0, end), true);
        setTimeout(() => {
          that.addPathByIndex(record, index + 1);
        }, 100);
      } else {
        this.addPathPoint(record);
      }
    },
    showStaticPoint() {
      //显示停留点
      if (trackData) {
        var list = JSON.parse(JSON.stringify(trackList));
        if (this.selectStay > 0) {
          var static_pts = trackData.getStaticPoints();
          // console.log(static_pts);
          for (var i = 0; i < static_pts.length; i++) {
            if (static_pts[i].t > this.selectStay * 60000) {
              var item = list[static_pts[i].idx];
              item.prevTime = static_pts[i].prevTime;
              item.realTime = static_pts[i].realTime;
              item.t = static_pts[i].t;
              item.stay = true;
              item.idx = static_pts[i].idx;
              //lat, lng, icon, rotation, tag,title,offsetX,offsetY
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "add-point",
                lat:
                  this.theMap == "baidu-map"
                    ? item.baiduPt.lat
                    : item.realPt.lat,
                lng:
                  this.theMap == "baidu-map"
                    ? item.baiduPt.lng
                    : item.realPt.lng,
                icon: this.API.trackIcon + "record_stay_pt.png",
                rotation: 0,
                title:
                  this.$t("playback.stay") +
                  " " +
                  mapUtil.cnTime(static_pts[i].t),
                offsetX: this.theMap == "baidu-map" ? -3 : -16,
                offsetY: this.theMap == "baidu-map" ? -18 : -44,
                tag: "stay",
                index: item.idx
              });
            }
          }
        }
      }
    },
    showOverspeedPoint() {
      //显示超速点
      if (trackData) {
        var list = trackList;
        if (this.speed > 0 && this.isSpeed) {
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.speed > this.speed) {
              item.idx = i;
              item.overSpeed = true;
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "add-point",
                lat:
                  this.theMap == "baidu-map"
                    ? item.baiduPt.lat
                    : item.realPt.lat,
                lng:
                  this.theMap == "baidu-map"
                    ? item.baiduPt.lng
                    : item.realPt.lng,
                icon: this.API.trackIcon + "record_overspeed_pt.png",
                rotation: 0,
                offsetX: this.theMap == "baidu-map" ? -3 : -16,
                offsetY: this.theMap == "baidu-map" ? -18 : -44,
                tag: "overspeed",
                title: this.$t("playback.speed") + " " + item.speed + " km/h",
                index: item.idx
              });
            }
          }
        }
      }
    },
    getSpeedColor(speed) {
      //获取速度颜色
      // 默认黄色
      var c = "rgb(255, 255, 0)";
      if (speed < 20) {
        // 红色
        c = "rgb(255, 0, 0)";
      } else if (speed < 60) {
        // 蓝色
        c = "rgb(0, 0, 255)";
      } else {
        // 绿色
        c = "rgb(0, 128, 0)";
      }
      return c;
    },
    addPathPoint(record) {
      // console.log("guijidian");
      //添加路径点
      switch (this.theMap) {
        case "a-map":
          this.offsetX1 = -25;
          this.offsetY1 = -15;
          break;
        case "baidu-map":
          this.offsetX1 = 0;
          this.offsetY1 = 0;
          break;
        case "bing-map":
          this.offsetX1 = 3;
          this.offsetY1 = 30;
          break;
      }
      var that = this;
      //起点
      var startP = record[0],
        endP = record[record.length - 1];

      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-point",
        lat:
          this.theMap == "baidu-map" ? startP.baiduPt.lat : startP.realPt.lat,
        lng:
          this.theMap == "baidu-map" ? startP.baiduPt.lng : startP.realPt.lng,
        icon: this.API.trackIcon + "record_start_pt.png",
        rotation: 0,
        offsetX: this.theMap == "baidu-map" ? -3 : -16,
        offsetY: this.theMap == "baidu-map" ? -18 : -44,
        tag: "start",
        title: "起点",
        index: 0
      });
      //终点
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-point",
        // lat: endP.baiduPt.lat,
        // lng: endP.baiduPt.lng,
        lat: this.theMap == "baidu-map" ? endP.baiduPt.lat : endP.realPt.lat,
        lng: this.theMap == "baidu-map" ? endP.baiduPt.lng : endP.realPt.lng,
        icon: this.API.trackIcon + "record_stop_pt.png",
        rotation: 0,
        offsetX: this.theMap == "baidu-map" ? -3 : -16,
        offsetY: this.theMap == "baidu-map" ? -18 : -44,
        tag: "stop",
        title: "终点",
        index: record.length - 1
      });
      //运行点
      var runPoint = JSON.parse(JSON.stringify(startP));
      runPoint.tag = "runPoint";
      // console.log(runPoint);

      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-point",
        lat:
          this.theMap == "baidu-map"
            ? runPoint.baiduPt.lat
            : runPoint.realPt.lat,
        lng:
          this.theMap == "baidu-map"
            ? runPoint.baiduPt.lng
            : runPoint.realPt.lng,
        icon: this.API.runIcon,
        rotation: runPoint.course,
        title: null,
        offsetX: this.offsetX1,
        offsetY: this.offsetY1,
        tag: "run",
        index: 0
      });

      this.$set(record[0], "theMap", this.theMap);
      // console.log(record[0]);
      this.app.$emit("playback-infobox", record[0]);
      this.app.$emit("show-progress-page", 100);
      this.showStaticPoint();
      if (this.isSpeed) {
        this.showOverspeedPoint();
      }
      that.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: trackList
      });
      setTimeout(function() {
        that.startTrack();

        that.app.$emit(
          "track-table-data",
          JSON.parse(JSON.stringify(trackList)),
          JSON.parse(JSON.stringify(trackData.getStaticPoints()))
        );
        that.isLoadTrack = true;
      }, 1000);
      // console.log("加载完成", new Date().format("yyyy-MM-dd hh:mm:ss"));
    },
    getDeviceLocation(deviceImei) {
      //获取设备最近的定位信息
      updateDevice({ deviceImei: deviceImei }).then(res => {
        if (res.errCode == "200") {
          this.deviceName = res.data.info.name;
          this.locTime = res.data.info.locateTime;
          this.startTime = new Date(this.locTime - 3600 * 1000).format(
            "yyyy-MM-dd hh:mm"
          );
          this.endTime = new Date().format("yyyy-MM-dd hh:mm");
          let lat, lng;
          if (this.theMap == "baidu-map") {
            lat = res.data.location.bdlat;
            lng = res.data.location.bdlng;
          } else {
            lat = res.data.location.lat;
            lng = res.data.location.lon;
          }
          // 2022-7-30 最后一个点的标识
          setTimeout(() => {
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "set-center",
              lat: lat,
              lng: lng
            });
          }, 500);
        }
      });
    },
    changeTimeRange(tag) {
      // console.log(tag);
      //改变开始结束时间按钮
      var start = new Date().getTime();
      if (tag == "hour") {
        // 设备最后获取的地位时间的上一个小时
        start = this.locTime - 60 * 60 * 1000;
        this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
        this.endTime = new Date(this.locTime).format("yyyy-MM-dd hh:mm");
        this.loadRecord();
      } else if (tag == "today") {
        start =
          new Date(new Date().format("yyyy-MM-dd")).getTime() -
          8 * 60 * 60 * 1000;
        this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
        this.endTime = new Date().format("yyyy-MM-dd hh:mm");
        this.loadRecord();
      } else if (tag == "yesterday") {
        start =
          new Date(new Date().format("yyyy-MM-dd")).getTime() -
          24 * 60 * 60 * 1000 -
          8 * 60 * 60 * 1000;
        this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
        this.endTime = new Date(start + 24 * 60 * 60 * 1000 - 1000).format(
          "yyyy-MM-dd hh:mm"
        );
        this.loadRecord();
      } else if (tag == "7days") {
        start = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
        this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
        this.endTime = new Date().format("yyyy-MM-dd hh:mm");
        this.loadRecord();
      }
    },
    checkTimeRange() {
      //检查查询轨迹的时间范围
      if (
        new Date(this.endTime).getTime() <
          new Date().getTime() - 186 * 24 * 60 * 60 * 1000 ||
        new Date(this.startTime).getTime() <
          new Date().getTime() - 186 * 24 * 60 * 60 * 1000
      ) {
        this.app.$emit("show-alert-msg", this.$t("playback.yearTip"));
        this.isYearOver = true;
        return false;
      } else {
        this.isYearOver = false;
      }
      //限制查询时间范围必须在一个月内
      if (
        new Date(this.startTime).getTime() <
        new Date(this.endTime).getTime() - 31 * 24 * 60 * 60 * 1000
      ) {
        //this.endTime=new Date(new Date().getTime()-30*24*60*60*1000).format("yyyy-MM-dd hh:mm:ss")
        this.app.$emit("show-alert-msg", this.$t("playback.monthTip"));
        this.isMonthOver = true;
        return false;
      } else {
        this.isMonthOver = false;
      }
      //判断开始时间是否在结束时间之前
      if (
        new Date(this.endTime).getTime() < new Date(this.startTime).getTime()
      ) {
        this.app.$emit("show-alert-msg", this.$t("playback.timeTip"));
        this.isTimeBefore = true;
        return false;
      } else {
        this.isTimeBefore = false;
      }
      return true;
    },
    filterRecord(origin_data) {
      // console.log(origin_data);
      //处理轨迹数据
      this.currentTrack = 0;
      this.isStart = false;
      originRecord = origin_data;
      var record = [],
        count = 0;
      if (this.isFilter) {
        //智能过滤，卫星定位的点
        for (var i = 0; i < origin_data.length; i++) {
          if (origin_data[i].locateSts == "0") {
            record.push({
              index: i,
              realTime: origin_data[i].realTime,
              realPt: new BMap.Point(origin_data[i].lng, origin_data[i].lat),
              baiduPt: new BMap.Point(
                origin_data[i].bdlng,
                origin_data[i].bdlat
              ),
              speed: origin_data[i].speed,
              course: origin_data[i].course,
              locateSts: origin_data[i].locateSts,
              position: "",
              stay: false,
              overSpeed: false,
              altitude: origin_data[i].altitude,
              accuracyType: origin_data[i].accuracyType,
              temperature:
                origin_data[i].temperature && origin_data[i].temperature != -1
                  ? origin_data[i].temperature
                  : "",
              idx: count
            });
            count++;
          }
        }
      } else if (this.isLocaType && this.selectLocaType.length > 0) {
        //只显示指定定位方式的点
        var locaSts = this.selectLocaType.join(",");
        console.log(locaSts);
        for (let i = 0; i < origin_data.length; i++) {
          if (locaSts.indexOf(origin_data[i].locateSts) >= 0) {
            record.push({
              index: i,
              realTime: origin_data[i].realTime,
              realPt: new BMap.Point(origin_data[i].lng, origin_data[i].lat),
              baiduPt: new BMap.Point(
                origin_data[i].bdlng,
                origin_data[i].bdlat
              ),
              speed: origin_data[i].speed,
              course: origin_data[i].course,
              locateSts: origin_data[i].locateSts,
              position: "",
              stay: false,
              overSpeed: false,
              altitude: origin_data[i].altitude,
              accuracyType: origin_data[i].accuracyType,
              temperature:
                origin_data[i].temperature && origin_data[i].temperature != -1
                  ? origin_data[i].temperature
                  : "",
              idx: count
            });
            count++;
          }
        }
        // console.log("record", record);
      } else {
        //默认全部点
        for (let i = 0; i < origin_data.length; i++) {
          record.push({
            index: i,
            realTime: origin_data[i].realTime,
            realPt: new BMap.Point(origin_data[i].lng, origin_data[i].lat),
            baiduPt: new BMap.Point(origin_data[i].bdlng, origin_data[i].bdlat),
            speed: origin_data[i].speed,
            course: origin_data[i].course,
            locateSts: origin_data[i].locateSts,
            position: "",
            stay: false,
            overSpeed: false,
            altitude: origin_data[i].altitude,
            accuracyType: origin_data[i].accuracyType,
            temperature:
              origin_data[i].temperature && origin_data[i].temperature != -1
                ? origin_data[i].temperature
                : "",
            idx: i
          });
        }
        // console.log(record);
      }
      if (record.length > 0) {
        trackData = new RecordLib(record, {
          no_smooth: !this.isFilter,
          startTime: this.startTime,
          stopTime: this.endTime
        });
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "clear-map"
        });
        trackList = trackData.getFiltedTrack();
        this.trackListlength = trackList.length;
        this.trackInfo = this.getTrackInfo();
        // console.log(trackList);
        if (trackList.length > 0) {
          // console.log(trackList);
          this.drawPath(trackList);
          // console.log(trackList);
          // this.app.$emit("show-progress-page", 100);
        } else {
          this.app.$emit("show-alert-msg", this.$t("playback.noHistory"));
          this.app.$emit("show-progress-page", 100);
        }
      } else {
        this.trackInfo = {
          playbackTime: 0,
          runTime: 0,
          mileage: "0km"
        };
        this.app.$emit("show-alert-msg", this.$t("playback.noHistory"));
        this.app.$emit("show-progress-page", 100);
      }
    },
    getTrackInfo() {
      //获取轨迹信息
      if (trackList && trackList.length > 0) {
        var track = trackList;
        return {
          playbackTime: mapUtil.cnTime(
            track[track.length - 1].realTime - track[0].realTime
          ),
          runTime: mapUtil.cnTime(track[track.length - 1].totalRunTime),
          mileage:
            (track[track.length - 1].totalDist * 0.001).toFixed(2) + "km",
          routeData: {
            trackList: trackList,
            staticPoint: this.staticPoint
          }
        };
      } else {
        return {
          playbackTime: 0,
          runTime: 0,
          mileage: "0km",
          routeData: {
            trackList: trackList,
            staticPoint: this.staticPoint
          }
        };
      }
    },
    loadRecord() {
      //获取轨迹数据
      this.checkTimeRange();
      var that = this;
      if (this.checkTimeRange()) {
        this.app.$emit("show-progress-page", 0);
        let startTimeStr = new Date(
          this.getZoneData(new Date(this.startTime).getTime())
        ).getTime();
        let endTimeStr = new Date(
          this.getZoneData(new Date(this.endTime).getTime())
        ).getTime();
        var data = {
          deviceImei: this.deviceImei,
          // from: new Date(this.startTime).getTime(),
          // to: new Date(this.endTime).getTime(),
          from: startTimeStr,
          to: endTimeStr
        };
        this.isLoadTrack = false;
        this.isTrackTable = false;
        loadDeviceTrackRecord(data).then(res => {
          if (res.errCode == "200" && res.data.length > 0) {
            // console.log("轨迹记录", list);
            that.app.$emit("remove-last-marker");
            if (res.data.length > 6000) {
              //轨迹点过多时提示
              that.app.$emit(
                "show-confirm-msg",
                that.$t("playback.listTip"),
                function() {
                  that.filterRecord(res.data);
                },
                function() {
                  that.app.$emit("show-progress-page", 100);
                }
              );
            } else {
              that.filterRecord(
                res.data.sort(function(a, b) {
                  return a.realTime - b.realTime;
                })
              );
            }
          } else {
            that.app.$emit("show-alert-msg", that.$t("playback.noHistory"));
            that.app.$emit("show-progress-page", 100);
            that.isStart = false;
            that.currentTrack = 0;
            trackList = [];
            trackData = null;
            originRecord = [];
            that.app.$emit("map-operation", {
              mapName: that.mapName,
              action: "clear-map"
            });
          }
        });
      }
    },
    loadRouteList() {
      //加载查看行程的停留表格
      var list = [];
      var pre = trackList[0];
      var startIndex = 0;
      if (this.staticPoint.length > 0) {
        startIndex = this.staticPoint[0].idx == 0 ? 1 : 0;
      }
      for (var i = startIndex; i < this.staticPoint.length; i++) {
        if (this.staticPoint[i].t >= this.selectStay1 * 60000) {
          var item = trackList[this.staticPoint[i].idx];
          // console.log(item.totalDist - pre.totalDist);
          // console.log(item);
          list.push({
            mileage:
              ((item.totalDist - pre.totalDist) * 0.001).toFixed(2) + "km",
            driveTime: mapUtil.cnTime(item.realTime - pre.realTime),
            startEndLatLng:
              pre.realPt.lat.toFixed(6) +
              "," +
              pre.realPt.lng.toFixed(6) +
              "~" +
              item.realPt.lat.toFixed(6) +
              "," +
              item.realPt.lng.toFixed(6),
            startEndTime:
              new Date(pre.realTime).format("yyyy-MM-dd hh:mm:ss") +
              "~" +
              new Date(item.realTime).format("yyyy-MM-dd hh:mm:ss"),
            startAddress: pre.position,
            endAddress: item.position
          });
          pre = item;
        }
      }
      var end = trackList[trackList.length - 1];
      if (pre.realTime != end.realTime) {
        let item = end;
        list.push({
          mileage: ((item.totalDist - pre.totalDist) * 0.001).toFixed(2) + "km",
          driveTime: mapUtil.cnTime(item.realTime - pre.realTime),
          startEndLatLng:
            pre.realPt.lat.toFixed(6) +
            "," +
            pre.realPt.lng.toFixed(6) +
            "-" +
            item.realPt.lat.toFixed(6) +
            "," +
            item.realPt.lng.toFixed(6),
          startEndTime:
            new Date(pre.realTime).format("yyyy-MM-dd hh:mm:ss") +
            "~" +
            new Date(item.realTime).format("yyyy-MM-dd hh:mm:ss"),
          startAddress: pre.position,
          endAddress: item.position
        });
      }
      this.routeList = list;
    },
    loadStayList() {
      //加载查看行程的停留表格
      var list = [];
      for (var i = 0; i < this.staticPoint.length; i++) {
        if (this.staticPoint[i].t >= this.selectStay1 * 60000) {
          var item = this.staticPoint[i];
          list.push({
            stayTime: mapUtil.cnTime(item.realTime - item.prevTime),
            startEndTime:
              new Date(item.prevTime).format("yyyy-MM-dd hh:mm:ss") +
              "~" +
              new Date(item.realTime).format("yyyy-MM-dd hh:mm:ss"),
            location: item.pt.lat.toFixed(6) + "," + item.pt.lng.toFixed(6),
            address: trackList[item.idx].position
          });
        }
      }
      this.stayList = list;
    },
    showTrackRoute() {
      //显示查看行程对话框
      this.app.$emit("track-table-stay");
      this.currentTab = 0;
      var that = this;
      setTimeout(() => {
        that.loadStayList();
        that.loadRouteList();
      }, 1000);
      this.isShowRoute = true;
    },
    showDownloadTrack() {
      // 显示下载轨迹的方式
      this.app.$emit("track-table-stay");
      this.isShowDownload = true;
    },
    doPlayback(item) {
      // 打开轨迹回放窗口设置
      this.deviceName = item.name;
      this.deviceImei = item.deviceImei;
      this.isShowPlayback = true;
      this.getDeviceLocation(item.deviceImei);
      this.showDevice(item);
    },
    resetTrack() {
      //重新播放，重置
      this.currentTrack = 0;
      this.isStart = false;
    },
    stopTrack() {
      //停止播放
      this.isStart = false;
    },
    startTrack() {
      //开始播放
      if (trackData) {
        if (this.currentTrack == trackList.length - 1) {
          this.currentTrack = 0;
        }
        this.isStart = true;
        this.runTrack();
      }
    },
    runTrack() {
      //运行轨迹点
      var that = this;
      if (that.isStart) {
        setTimeout(function() {
          if (that.isStart && that.currentTrack + 1 < trackList.length) {
            that.currentTrack = that.currentTrack + 1;
            that.runTrack();
          }
        }, 15000 / that.playSpeed); //播放速度控制
      }
    },
    onPlaybackPoint(data) {
      //选中地图上的标记点，信息框提示
      this.theMap == "a-map"
        ? this.$set(trackList[data.index], "theMap", this.theMap)
        : this.$set(trackList[data.index], "theMap", this.theMap);

      this.app.$emit("playback-infobox", trackList[data.index], data.title);
    },
    downloadTrack() {
      // 弹窗的详情中的触发的下载
      setTimeout(() => {
        this.exportTrack();
      }, 50);
    },
    onTrackItem(idx) {
      //选中轨迹详情表格中的项，运行点移动到该点
      this.currentTrack = Number(idx);
    },
    // 设备轨迹回放 ---------------------------------------------------end
    handleClick1(e) {
      console.log(e);
      if (e.name == "addDevice") {
        this.deviceList = [];
      } else if (e.name == "queryDevice") {
        this.loadBondedDeviceList();
      }
    },
    doBatchUnBondDevice() {
      // 批量解绑
    },
    unbindDevice(idx) {
      // 解绑设备
      const data = {
        roadId: this.currentPlan.roadId,
        imeis: this.bondDeviceList[idx].deviceImei
      };
      this.app.$emit(
        "show-confirm-msg",
        "是否需要解绑当前设备与路线的关系",
        () => {
          removeDevicePlan(data).then(res => {
            if (res.errCode == 200) {
              this.app.$emit("show-alert-msg", "设备解绑成功");
              this.loadBondedDeviceList();
            }
          });
        }
      );
    },
    loadBondedDeviceList(id) {
      // 获取已经绑定的设备列表
      const data = {
        roadId: id ? id : this.currentPlan.roadId,
        page: this.page1.current,
        pageSize: this.page1.pageSize
      };
      loadBondedDevice(data).then(res => {
        if (res.errCode == 200) {
          this.bondDeviceList = res.data.list;
          this.page1.total = res.data.total;
          setTimeout(() => {
            this.onDevList(this.bondDeviceList);
          }, 400);
        }
      });
    },
    onDevList(op) {
      // 把设备添加到地图上
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-all-markers"
      });
      let points = [];
      for (let i = 0; i < op.length; i++) {
        var item = op[i];
        var lat, lng;
        if (this.theMap == "baidu-map") {
          lat = item.bdlat;
          lng = item.bdlng;
        } else {
          lat = item.lat;
          lng = item.lng;
        }
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-marker",
          lat: lat,
          lng: lng,
          icon: mapUtil.getMarkerIcon(item),
          title: item.name,
          rotation: item.course,
          data: item,
          item: item
        });
        if (this.theMap == "baidu-map") {
          points.push(new BMap.point(item.bdlng, item.bdlat));
        } else {
          points.push({
            lng: item.lng,
            lat: item.lat
          });
        }
      }
      // this.showDevice(this.bondDeviceList[0]);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        aciton: "set-view-port",
        points: points
      });
    },
    showDevice(device) {
      // 显示选中的设备
      // console.log(device);
      if (!device) return;
      this.deviceImei = device.deviceImei;
      this.deviceName = device.name;
      var lat, lng;
      if (this.theMap == "baidu-map") {
        lat = device.bdlat;
        lng = device.bdlng;
      } else {
        lat = device.lat;
        lng = device.lng;
      }
      this.deviceImei = device.deviceImei;
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-center",
        lat: lat,
        lng: lng
      });
      setTimeout(() => {
        this.getDeviceInfo(device);
      }, 50);
    },
    getDeviceInfo(data) {
      //获取设备最新定位信息
      updateDevice({ deviceImei: data.deviceImei }).then(res => {
        if (res.errCode == "200") {
          let lat, lng;
          if (this.theMap == "baidu-map") {
            lat = res.data.location.bdlat;
            lng = res.data.location.bdlng;
          } else {
            lat = res.data.location.lat;
            lng = res.data.location.lon;
          }
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: lat,
            lng: lng
          });
          var device = {
            bdlat: res.data.location.bdlat,
            bdlng: res.data.location.bdlng,
            course: res.data.info.course,
            deviceImei: res.data.deviceImei,
            icon: res.data.info.icon,
            lat: res.data.location.lat,
            lng: res.data.location.lon,
            locateTime: res.data.info.locateTime,
            name: res.data.info.name,
            signalTime: res.data.info.signalTime,
            sts: res.data.info.sts,
            stsNum: res.data.info.stsNum,
            flowExpire: res.data.info.flowExpire,
            platExpire: res.data.info.platExpire,
            flowFlag: res.data.info.flowFlag,
            enableSts: res.data.info.enableSts,
            enableDate: res.data.info.enableDate,
            voltage: res.data.info.voltage,
            electricity: res.data.info.electricity
          };
          // setTimeout(() => {
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "show-circuit-info-box",
            data: device
          });
          // }, 50);
        }
      });
    },
    showAddDeviceBox() {
      this.isShowBox = true;
      this.app.$emit("load-plan-add-device", {
        roadId: this.currentPlan.roadId
      });
    },
    dealUserItem(val) {
      // 处理拿到的设备的列表
      let devlist = [];
      for (let i = 0; i < val.length; i++) {
        let item = val[i];
        devlist.push({
          deviceImei: item.deviceImei,
          name: item.name
        });
      }
      this.deviceList = this.deviceList.concat(devlist);
      this.deviceList = this.filterDate(this.deviceList);
    },
    filterDate(list) {
      // 过滤数据，防止重复的设备
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
    delSingalDev(idx) {
      // 删除单个
      this.deviceList.splice(idx, 1);
    },
    doResetDeviceList() {
      // 清空列表
      this.deviceList = [];
    },
    doBatchBondDevice() {
      // 进行绑定
      let list = [];
      for (var i = 0; i < this.deviceList.length; i++) {
        list.push(this.deviceList[i].deviceImei);
      }
      const data = {
        roadId: this.currentPlan.roadId,
        imeis: list.join(",")
      };
      bondDevicePlan(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", "路线与设备绑定成功");
          this.loadBondedDeviceList();
          this.deviceList = [];
        }
      });
    },
    ShowBangDingDevice(item) {
      this.currentPlan = item;
      this.isShowBangding = true;
    },
    handleClick(e) {
      // 切换
      // console.log(e);
      this.locationLnglat = [];
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-all-map"
      });
      if (e.name == "second") {
        this.isShowPlayback = false;
        this.app.$emit("map-operation", {
          action: "clear-track",
          mapName: this.mapName
        });
      } else if (e.name == "third") {
        this.bondDeviceList = [];
        this.loadPlanList();
      } else {
        this.isShowPlayback = false;
        this.app.$emit("map-operation", {
          action: "clear-driving",
          mapName: this.mapName
        });
      }
    },
    changeMapType() {
      this.isSatellite = !this.isSatellite;
    },
    showPlan(item) {
      // 在地图上显示
      console.log(item);
      this.currentPlan = item;
      this.loadBondedDeviceList(item.roadId);
      this.app.$emit("map-operation", {
        mapName: "circuit",
        action: "add-plan-line",
        line: this.getTheGaodeLatLng(item),
        // color: "red",
        color: "#46fa3a"
      });
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-plan-line-port",
        points: this.getTheGaodeLatLng(item)
      });
    },
    getTheGaodeLatLng(data) {
      let pointsArr = [];
      let amapArr = [];
      let amapLine = [];
      amapArr = data.amapTrack.split(";");
      amapArr.forEach(item => {
        // console.log(item);
        pointsArr.push(item.split(",").map(Number));
      });
      amapLine = pointsArr.map(item => {
        return {
          lng: item[0],
          lat: item[1]
        };
      });
      // console.log("amapLine", amapLine);
      return amapLine;
    },
    removePlan(item) {
      // 删除路线规划
      this.app.$emit("show-confirm-msg", "是否删除" + item.roadName, () => {
        removePlanTrack({ roadId: item.roadId }).then(res => {
          if (res.errCode == 200) {
            this.loadPlanList();
            this.app.$emit("show-alert-msg", "路线删除成功！");
          } else {
            this.app.$emit("show-alert-msg", "路线删除失败！");
          }
        });
      });
    },
    savePlanTrack() {
      // 保存在地图上画的轨迹点a
      let originLatLng = [];
      let amapLatLng = [];
      originLatLng = this.locationLnglat.map(item => {
        return [item.R.toFixed(8), item.Q.toFixed(8)];
      });
      // console.log("originLatLng", originLatLng);
      amapLatLng = this.locationLnglat.map(item => {
        return [item.lng, item.lat];
      });
      const data = {
        userId: this.rootUser.userId,
        roadName: this.roadName,
        originPosition: originLatLng.join(";"),
        amapPosition: amapLatLng.join(";")
      };
      addPlanTrack(data).then(res => {
        if (res.errCode == 200) {
          // console.log("zhixing");
          this.locationLnglat = [];
          this.roadName = "";
          this.app.$emit("show-alert-msg", "路线规划保存成功");
          this.loadPlanList();
          if (this.activeName == "second") {
            this.app.$emit("map-operation", {
              action: "clear-driving",
              mapName: this.mapName
            });
          } else {
            this.app.$emit("map-operation", {
              action: "clear-track",
              mapName: this.mapName
            });
          }
        }
      });
    },
    loadPlanList() {
      // 从后台获取轨迹列表
      const data = {
        page: this.page.current,
        pageSize: this.page.pageSize,
        userId: this.rootUser.userId
      };
      getPlanTrack(data).then(res => {
        if (res.errCode == 200) {
          this.circuitList = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    drawingTrack() {
      // console.log("zhixing");
      this.isDrawing = !this.isDrawing;
      if (this.isDrawing) {
        this.app.$emit("map-operation", {
          action: "draw-track",
          mapName: this.mapName
        });
      } else {
        this.app.$emit("map-operation", {
          action: "clear-track",
          mapName: this.mapName
        });
      }
    },
    drivingTrack() {
      // 通过点去获取路线
      let startLocation = {};
      let lastLocation = {};
      if (!this.sLnglat) {
        this.app.$emit("show-alert-msg", "请输入开始坐标点");
        return;
      }
      if (!this.lLnglat) {
        this.app.$emit("show-alert-msg", "请输入结束坐标点");
        return;
      }
      startLocation = {
        // lng: this.sLnglat.split(",")[0],
        // lat: this.sLnglat.split(",")[1],
        lng: this.sLnglat.lng,
        lat: this.sLnglat.lat
      };
      lastLocation = {
        // llng: this.lLnglat.split(",")[0],
        // llat: this.lLnglat.split(",")[1],
        llng: this.lLnglat.lng,
        llat: this.lLnglat.lat
      };
      let arrList = {};
      arrList = { ...startLocation, ...lastLocation };
      this.app.$emit("map-operation", {
        action: "driving-track",
        mapName: this.mapName,
        data: arrList
      });
    },
    loadGaodeLocation(op) {
      // console.log(op);
      this.locationLnglat.push(op);
    },
    getStartMapPoint(op) {
      this.sLnglat = op.point;
    },
    doTriggerCheck() {
      this.startCheck = false;
    },
    getLastMapPoint(op) {
      this.lLnglat = op.point;
    },
    doTriggerCheck1() {
      this.lastCheck = false;
    },
    loadTrackList(op) {
      this.locationLnglat = op;
    },

    listenEvent() {
      this.app.$on("load-gaode-location", this.loadGaodeLocation);
      this.app.$on("map-s-click", this.getStartMapPoint);
      this.app.$on("map-l-click", this.getLastMapPoint);
      this.app.$on("do-trigger", this.doTriggerCheck);
      this.app.$on("do-trigger1", this.doTriggerCheck1);
      this.app.$on("load-track-list", this.loadTrackList);
      this.app.$on("playback-point", this.onPlaybackPoint);
      this.app.$on("map-select-marker", this.showDevice);
      this.app.$on("playback-download", this.downloadTrack);
      this.app.$on("track-table-item", this.onTrackItem);
    },
    offEvent() {
      this.app.$off("load-gaode-location", this.loadGaodeLocation);
      this.app.$off("map-s-click", this.getStartMapPoint);
      this.app.$off("map-l-click", this.getLastMapPoint);
      this.app.$off("do-trigger", this.doTriggerCheck);
      this.app.$off("do-trigger1", this.doTriggerCheck1);
      this.app.$off("load-track-list", this.loadTrackList);
      this.app.$off("playback-point", this.onPlaybackPoint);
      this.app.$off("map-select-marker", this.showDevice);
      this.app.$off("playback-download", this.downloadTrack);
      this.app.$off("track-table-item", this.onTrackItem);
    }
  },
  mounted() {
    this.listenEvent();
    this.loadPlanList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.left-tabar-control {
  position: absolute;
  left: -40px;
  top: 1px;
  z-index: 999;
  background: #f5f7fa;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #ff9800;
  border-top-left-radius: 50%;
  // border-bottom-left-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  img {
    display: inline-block;
    width: 26px;
    height: 26px;
  }
}
.option-item {
  // padding-left: 50px;
  margin-bottom: 10px;
  .el-checkbox__label {
    padding-left: 5px;
  }
  .but-bar {
    color: #2cabe3;
    cursor: pointer;
  }
  .bar {
    padding: 0 10px;
  }
  ::v-deep .el-input--small .el-input__inner {
    border-radius: 0 !important;
  }
}
.xianlu-liebiao {
  height: 240px;
}
.crearfix {
  font-size: 14px;
  font-weight: 600;
  padding: 5px 0;
}
.xianluguihua {
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 9;
  width: 400px;
  background: #fff;
  // height: 300px;
  // padding: 10px;
  ::v-deep .el-tabs--border-card {
    height: 100%;
  }
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
}
.card-header {
  ::v-deep .el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
  }
}
.gaode-map-content {
  width: 100%;
  height: calc(100% - 30px);
  position: relative;
}
.btn-change-maptype {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 9;
}
.draw-track.active {
  color: red;
}
.gaode-map-lnglat {
  position: absolute;
  left: 0px;
  top: 0;
  z-index: 9;
  background: #fff;
  padding: 10px;
}
</style>
