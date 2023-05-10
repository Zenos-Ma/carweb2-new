import TrackTable from "@/components/TrackTable";
import AMapComp from "@/components/map/AMapComp";
import RecordLib from "@/utils/recordLib.js";
import mapUtil from "@/utils/mapUtil.js";
import gpsHelper from "@/utils/gpsHelper.js";
import ExportUtil from "@/utils/exportUtil.js";
import LoginHelper from "@/utils/loginHelper.js";
import InfoBox from "@/components/map/InfoBoxComp";
import bingMapComp from "@/components/map/BingMapComp";
// 百度
import baiduMapComp from "@/components/map/BaiduMapComp";
//
import googleMapComp from "@/components/map/GoogleMapComp";
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
import {
  loadDeviceTrackRecord,
  loadUpdateDevice,
  downloadTrack
} from "@/api/playback";
import { loadQiyeLogo } from "@/api/account.js";
//

var trackList = [];
var trackData = null;
var originRecord = [];
export default {
  name: "Playback",
  components: {
    "track-table": TrackTable,
    "a-map": AMapComp,
    "info-box": InfoBox,
    "bing-map": bingMapComp,
    "baidu-map": baiduMapComp,
    "google-map": googleMapComp,
    "open-street-map": OpenStreetMapComp
  },
  data: () => ({
    theMapLists: "",
    // theMap: "baidu-map", //百度地图
    theMap: "a-map",
    deviceImei: "", //当前设备号
    deviceName: "",
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
    locTime: new Date().getTime(), //定位时间开始
    locTime1: new Date().getTime(), //定位时间
    mapOption: {}, //地图数据
    lat: 0, //运行点的纬度
    lng: 0, //运行点的经度
    isMonthOver: false, //是否时间范围超过一个月
    isTimeBefore: false, //是否开始时间大于结束时间
    isYearOver: false, //是否时间范围大于半年
    mapName: "playback", //地图名称
    // isLocaType: window.localStorage.getItem("carweb_customer") == "shanghai_deng", //是否可选定位方式
    isLocaType: true,
    selectLocaType: [], //选中的定位方式
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //当前登录用户
    trackInfo: {
      //轨迹信息
      playbackTime: 0,
      runTime: 0,
      mileage: "0km"
    },
    isTrackTable: false, //是否显示轨迹详情表格
    isSatellite: false, //高德地图是否显示卫星地图
    points: [], //轨迹点，用于总览轨迹路径
    isLoadTrack: false, //是否处于加载轨迹的状态
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
    isLocation: false
  }),
  watch: {
    selectStay1() {
      //查看行程的停留时间改变重新加载表格数据
      this.loadStayList();
      this.loadRouteList();
    },
    selectLocaType() {
      //只显示选中定位方式的点
      if (trackList.length > 0) this.filterRecord(originRecord, false);
    },
    deviceImei() {
      this.getDeviceLocation();
    }, //是否开启超速点
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
    },

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
    // startTime() {
    //   // this.getZoneData(this.startTime);
    //   if (this.$route.query.from && this.$route.query.to) {
    //     return;
    //   } else {
    //     this.checkTimeRange();
    //   }
    // },
    // endTime() {
    //   // this.checkTimeRange();
    //   if (this.$route.query.from && this.$route.query.to) {
    //     return;
    //   } else {
    //     this.checkTimeRange();
    //   }
    // },
  },
  methods: {
    // 2022-5-8 start
    handleChange() {
      console.log("chufa");
    },
    // end
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
    showTrackTable() {
      //显示轨迹详情表格
      this.app.$emit("track-table-stay");
      this.isTrackTable = true;
    },
    showDownloadTrack() {
      // 显示下载轨迹的方式
      this.app.$emit("track-table-stay");
      this.isShowDownload = true;
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
    changetask(name) {
      console.log(name);
      // 2021-5-10新改成下拉框改变地图
      // var idx = e.target.options.selectedIndex;
      // console.log(e.target.options.selectedIndex);
      this.currentMap = this.getTheMapCurrent(name);
      // 2021-6-9start
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query.mapkey = this.currentMap;
      this.$router.push({ path: this.$route.path, query });

      // var theMapList = this.$t("playback.theMapList");
      this.theMap = name;
      // end
      var that = this;
      this.isStart = false;
      setTimeout(() => {
        var center = that.mapOption.center;
        // console.log(center);
        var zoom = that.mapOption.zoom;
        if (this.theMap == "a-map") {
          center = gpsHelper.bd_encrypt(center.lat, center.lng);
          zoom = mapUtil.getGaodeZoomByBaidu(zoom);
        } else if (this.theMap == "baidu-map") {
          center = gpsHelper.bd_encrypt(center.lat, center.lng);
          zoom = mapUtil.getBaiduZoomByBing(zoom);
        } else if (this.theMap == "bing-map") {
          center = gpsHelper.bd_decrypt(center.lat, center.lng);
          zoom = mapUtil.getBingZoomByBaidu(zoom);
          // console.log(center);
          // console.log(zoom);
        } else if (this.theMap == "google-map") {
          center = gpsHelper.bd_decrypt(center.lat, center.lng);
          zoom = mapUtil.getBingZoomByBaidu(zoom);
          // console.log(center);
          // console.log(zoom);
        }

        // console.log(center);
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
        if (originRecord.length > 0) {
          setTimeout(() => {
            that.filterRecord(originRecord, true);
          }, originRecord.length);
        }
      }, 900);
    },
    mapNavigation(e) {
      console.log(e);
      // 后续改
      var name = e.target.dataset.index.trim();
      this.currentMap = this.getTheMapCurrent(name);
      // 2021-6-9start
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query.mapkey = this.currentMap;
      this.$router.push({ path: this.$route.path, query });

      // var theMapList = this.$t("playback.theMapList");
      this.theMap = name;
      // end
      var that = this;
      this.isStart = false;
      setTimeout(() => {
        var center = that.mapOption.center;
        // console.log(center);
        var zoom = that.mapOption.zoom;
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
        if (originRecord.length > 0) {
          setTimeout(() => {
            that.filterRecord(originRecord, true);
            // }, originRecord.length);
          }, 1000);
        }
      }, 900);
    },
    saveMap(op) {
      // console.log(op);
      this.mapOption = op;
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
    exportMileageDates() {
      //导出轨迹里程统计
      var start = new Date(
        new Date(this.startTime).format("yyyy-MM-dd 00:00:00")
      ).getTime();
      var end = new Date(
        new Date(this.endTime).format("yyyy-MM-dd 23:59:59")
      ).getTime();
      var num = Math.ceil(end + 1000 - start) / (24 * 3600000);
      var result = [];
      this.getMileageByDate(start, 0, num, result);
    },
    getMileageByDate(startTime, num, len, result) {
      //按日期统计轨迹里程 获取需要导出的轨迹列表
      var that = this;
      if (num <= len) {
        var data = {
          deviceImei: this.deviceImei,
          from: startTime + num * 24 * 3600000,
          to: startTime + (num + 1) * 24 * 3600000
        };
        loadDeviceTrackRecord(data).then(res => {
          if (res.errCode == "200") {
            // console.log(res);
            var mileage = that.filterRecord1(
              res.data.sort(function(a, b) {
                return a.realTime - b.realTime;
              }),
              startTime + num * 24 * 3600000,
              startTime + (num + 1) * 24 * 3600000
            );
            result.push({
              date: new Date(startTime + num * 24 * 3600000).format(
                "yyyy-MM-dd"
              ),
              mileage: mileage
            });
            that.getMileageByDate(startTime, num + 1, len, result);
          }
        });
      } else {
        var name = ["日期", "里程"];
        var value = [];
        for (var i = 0; i < result.length; i++) {
          value.push([result[i].date, result[i].mileage]);
        }
        ExportUtil.exportTable(name, value);
      }
    },
    filterRecord1(origin_data, startTime, endTime) {
      //过滤出卫星定位的轨迹点
      var record = [],
        count = 0;
      for (var i = 0; i < origin_data.length; i++) {
        if (origin_data[i].locateSts == "0") {
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
            idx: count
          });
          count++;
        }
      }
      trackData = new RecordLib(record, {
        no_smooth: false,
        startTime: startTime,
        stopTime: endTime
      });
      var track = trackData.getFiltedTrack();

      if (track.length > 0) {
        var mileage =
          (track[track.length - 1].totalDist * 0.001).toFixed(2) + "km";
        return mileage;
      } else {
        return 0;
      }
    }, //播放轨迹点
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
    addToPath(record, isNoColor) {
      // console.log("触发了");
      // console.log(record);
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
          let c = this.getSpeedColor(record[i].speed);
          if (line.length >= 2 && (c != color || i == record.length - 1)) {
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "add-line",
              line: line,
              color: color
            });
            color = c;
            line = [];
            origin = pt;
            line.push(origin);
          }
        } //record.length
      } else {
        for (let i = 1; i < record.length; i++) {
          this.theMap == "baidu-map"
            ? line.push(record[i].baiduPt)
            : line.push(record[i].realPt);
          // line.push(record[i].realPt);
        }
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-line",
          line: line,
          color: "#0000FF"
        });
      }
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "add-line",
        line: line,
        color: "#0000FF"
      });
    },
    addPathPoint(record) {
      // console.log("guijidian");
      //添加路径点
      switch (this.theMap) {
        case "a-map":
          this.offsetX1 = -15;
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
      console.log("加载完成", new Date().format("yyyy-MM-dd hh:mm:ss"));
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
    drawPath(record) {
      //添加轨迹路径
      if (record.length >= 6000) {
        //this.addToPath(record,true);
        //this.addPathPoint(record);
        this.addPathByIndex(record, 0);
      } else {
        this.addToPath(record);
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
    getTheCurrentZoneTime(timezone) {
      timezone = 8; //北京的时区东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间个格林威治的时间差
      var nowdata = new Date().getTime(); //当地的时间
      var targetDate = new Date(
        nowdata + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
      );
      return targetDate;
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
    getDeviceLocation() {
      //获取设备最近的定位信息
      var that = this;
      if (this.deviceImei) {
        loadUpdateDevice({ deviceImei: this.deviceImei }).then(res => {
          if (res.errCode == "200") {
            that.deviceName = res.data.info.name;
            that.locTime = res.data.info.locateTime;
            that.startTime = new Date(that.locTime - 3600 * 1000).format(
              "yyyy-MM-dd hh:mm"
            );
            that.endTime = new Date().format("yyyy-MM-dd hh:mm");
            let lat, lng;
            if (that.theMap == "baidu-map") {
              lat = res.data.location.bdlat;
              lng = res.data.location.bdlng;
            } else {
              lat = res.data.location.lat;
              lng = res.data.location.lon;
            }
            setTimeout(() => {
              if (that.isLocation) {
                // 2022-7-30 最后一个点的标识
                setTimeout(() => {
                  that.app.$emit("map-operation", {
                    mapName: that.mapName,
                    action: "set-center",
                    lat: lat,
                    lng: lng
                  });
                  that.app.$emit("map-operation", {
                    mapName: that.mapName,
                    action: "add-last-marker",
                    lat: lat,
                    lng: lng,
                    icon: that.API.trackIcon + "record_stay_pt.png",
                    offsetX: that.theMap == "baidu-map" ? -3 : -16,
                    offsetY: that.theMap == "baidu-map" ? -18 : -44,
                    rotation: 0,
                    tag: "endTag",
                    title: "最后的点"
                  });
                }, 1000);
                // console.log("zhixing");
              }
              that.app.$emit("refresh-login-time");
            }, 900);
          }
        });
      }
    },
    downloadTrack() {
      //下载轨迹
      this.app.$emit("track-table-stay");
      var that = this;
      setTimeout(function() {
        that.exportTrack();
      }, 1000);
    },
    // 2021-3-27新增下载kml格式的坐标 start
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
        // from: new Date(this.startTime).getTime(),
        // to: new Date(this.endTime).getTime(),
        from: startTimeStr,
        to: endTimeStr
      };
      downloadTrack(data).then(res => {
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
    // 2021-3-27 end
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
    exportTable() {
      //导出行程或停留表格
      var origin_data = [];
      if (this.currentTab == 0) {
        origin_data = this.routeList;
      } else {
        origin_data = this.stayList;
      }
      var list = [];
      var title = [];
      var filename = "";
      if (this.currentTab == 0) {
        filename = "行程";
        title = [
          this.$t("playbackRouteDialog.mileage"),
          this.$t("playbackRouteDialog.driveTime"),
          this.$t("playbackRouteDialog.startEndTime"),
          this.$t("playbackRouteDialog.startEndLatLng"),
          this.$t("playbackRouteDialog.startAddress"),
          this.$t("playbackRouteDialog.endAddress")
        ];
        for (let i = 0; i < origin_data.length; i++) {
          var item = origin_data[i];
          list.push([
            item.mileage,
            item.driveTime,
            item.startEndTime,
            item.startEndLatLng,
            item.startAddress,
            item.endAddress
          ]);
        }
      } else {
        filename = "停留";
        title = [
          this.$t("playbackRouteDialog.stayTime"),
          this.$t("playbackRouteDialog.startEndTime"),
          this.$t("playbackRouteDialog.location"),
          this.$t("common.address")
        ];
        for (let i = 0; i < origin_data.length; i++) {
          let item = origin_data[i];
          list.push([
            item.stayTime,
            item.startEndTime,
            item.location,
            item.address
          ]);
        }
      }
      // ExportUtil.exportTable(title, list, this.deviceImei + filename + "(" + this.startTime + "-" + this.endTime + ")");
      import("@/utils/Export2Excel").then(excel => {
        excel.export_json_to_excel({
          header: title,
          data: list,
          filename:
            this.deviceImei +
            filename +
            "(" +
            this.startTime +
            "-" +
            this.endTime +
            ")",
          bookType: "xlsx"
        });
      });
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
    showChartPage() {
      //跳转到轨迹回放驾驶舱
      if (trackList.length > 0) {
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/track-chart?deviceImei=" +
            this.deviceImei +
            "&from=" +
            new Date(this.startTime).getTime() +
            "&to=" +
            new Date(this.endTime).getTime()
        );
      }
    },
    updateTrackAddress(idx, address) {
      //更新数据中的停留点地址
      var staticPoint = trackData.getStaticPoints();
      trackList[idx].position = address;
      for (var i = 0; i < staticPoint.length; i++) {
        if (idx == staticPoint[i].idx) {
          staticPoint[i].position = address;
        }
      }
      this.staticPoint = staticPoint;
    },
    onTrackItem(idx) {
      //选中轨迹详情表格中的项，运行点移动到该点
      this.currentTrack = Number(idx);
    },
    onMapZoom(center, zoom) {
      this.bigZoom = zoom > 13 ? zoom : 13;
      //  this.app.$emit('set-center',this.lat, this.lng);
    },
    onPlaybackPoint(data) {
      //选中地图上的标记点，信息框提示
      //this.currentTrack = data.index;
      // console.log(trackList[data.index]);
      this.theMap == "a-map"
        ? this.$set(trackList[data.index], "theMap", this.theMap)
        : this.$set(trackList[data.index], "theMap", this.theMap);
      // console.log(trackList[data.index]);
      this.app.$emit("playback-infobox", trackList[data.index], data.title);
    },
    getDefaultMap() {
      var localLanguage = (
        navigator.language || navigator.browserLanguage
      ).toLowerCase();
      // console.log(localLanguage);
      if (localLanguage == "zh-cn") {
        this.theMap = "a-map";
        this.currentMap = 0;
      } else {
        this.theMap = "google-map";
        this.currentMap = 3;
      }
    },
    listenEvent() {
      this.app.$on("load-account-icon", this.loadLogo);
      this.app.$on("track-table-item", this.onTrackItem);
      this.app.$on("track-table-address", this.updateTrackAddress);
      this.app.$on("playback-download", this.downloadTrack);
      this.app.$on("playback-point", this.onPlaybackPoint);
      this.app.$on("load-playback-line", this.loadRecord);
    },
    offEvent() {
      this.app.$off("load-account-icon", this.loadLogo);
      this.app.$off("track-table-item", this.onTrackItem);
      this.app.$off("track-table-address", this.updateTrackAddress);
      this.app.$off("playback-download", this.downloadTrack);
      this.app.$off("playback-point", this.onPlaybackPoint);
      this.app.$off("load-playback-line", this.loadRecord);
    },
    getTheTimeFromRunning() {
      setTimeout(() => {
        if (this.$route.query.from) {
          let startStr = this.$route.query.from;
          this.startTime = new Date(Number(startStr)).format(
            "yyyy-MM-dd hh:mm"
          );
        }
        if (this.$route.query.to) {
          let endStr = this.$route.query.to;
          this.endTime = new Date(Number(endStr)).format("yyyy-MM-dd hh:mm");
        }
        if (this.$route.query.from && this.$route.query.to) {
          this.isLocation = false;
          this.loadRecord();
        } else {
          this.isLocation = true;
        }
      }, 1000);
    },
    loadLogo() {
      if (JSON.parse(window.localStorage.getItem("carweb_user")).userId) {
        var userId = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userId;
      } else {
        return;
      }

      loadQiyeLogo({ userId: userId }).then(res => {
        if (res.errCode == 200) {
          let iconLink = document.querySelector('link[rel="icon"]');
          iconLink.href = this.API.staticResource + res.data.icon;
          let logo = this.API.staticResource + res.data.logo;
          window.localStorage.setItem("carweb_logo", logo);
        }
      });
    }
  },
  mounted() {
    // console.log(this.getTheCurrentZoneTime());
    this.loadLogo();
    this.theMapLists = this.$t("playback.theMapList");
    var that = this;
    LoginHelper.getLogo();
    // 2022-6-7
    let iconLink = document.querySelector('link[rel="icon"]');
    if (window.localStorage.getItem("carweb_icon")) {
      // console.log("cacaca");
      iconLink.href = window.localStorage.getItem("carweb_icon");
    }

    this.listenEvent();
    if (this.$route.query.deviceImei) {
      this.deviceImei = this.$route.query.deviceImei;
      this.$nextTick(function() {
        document.title = `${that.deviceImei.substring(
          that.deviceImei.length - 6
        )}-${that.$t("playback.title")}`;
      });
      if (this.deviceImei) {
        this.getDeviceLocation();
      }
    }
    this.theMap = this.$t("playback.theMapList")[0].name;
    if (this.$route.query.mapkey) {
      this.currentMap = this.$route.query.mapkey;
      this.theMap = this.$t("playback.theMapList")[this.currentMap].name;
    } else {
      // 判断当前浏览器使用的语言，国外的就默认显示谷歌地图
      this.getDefaultMap();
    }
    this.getTheTimeFromRunning();
  },
  beforeDestroy() {
    // console.log(trackList);
    this.offEvent();
    if (this.refreshInterval) {
      this.refreshInterval = clearInterval(this.refreshInterval);
    }
  }
};
