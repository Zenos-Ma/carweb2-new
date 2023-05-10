<template>
  <div style="height: 100%; width: 100%">
    <div
      :class="['circle-btn', isTraffic ? 'active' : '']"
      style="position: absolute; margin-left: 10px; margin-top: 10px"
      @click="roadTraffic"
    >
      <i class="iconfont icon-traffic-status2"></i>
    </div>
    <div style="height: 100%; width: 100%" :id="'bing_map_' + mapName"></div>
  </div>
</template>

<script>
import gpsHelper from "@/utils/gpsHelper.js";
import mapUtil from "@/utils/mapUtil.js";
import MapLoader from "@/utils/loadBingMap.js";
export default {
  name: "BingMap",
  props: {
    mapName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    label: {},
    map: null,
    isTraffic: false,
    infoBox: null,
    infoBoxData: null,
    selectMarker: null,
    selectMarkerData: null,
    markers: {},
    markersData: {},
    circleArea: null,
    circleAreaData: null,
    measureLine: [], //测量线点data
    lineLabel: [], //测量线距离标记Overlay
    distanceLine: null, //测量线Overlay
    pointMarker: [],
    pointMarkerData: [],
    drawLine: null,
    drawLinePt: [],
    drawPoint: [],
    mapClick: null,
    runLine: null
  }),
  methods: {
    drawRunLine(op) {
      // 添加画跟踪轨迹线  polyline拿到位置是getLocations() marker拿到位置是getLocation()
      const pt = this.baiduPtToBing(op.lat, op.lng);
      if (this.runLine) {
        const path = this.runLine.getLocations();
        path.push(new Microsoft.Maps.Location(pt.lat, pt.lng));
        this.runLine.setOptions({
          visible: true,
          StrokerColor: "green"
        });
        this.runLine.setLocations(path);
        // this.runLine.setStrokerColor("green");
      } else {
        var line = [];
        if (this.selectMarker) {
          line.push(this.selectMarker.getLocation());
        }
        line.push(new Microsoft.Maps.Location(pt.lat, pt.lng));
        this.runLine = new Microsoft.Maps.Polyline(line, {
          strokeColor: "green",
          strokeStyle: "solid",
          strokeThickness: 4,
          visible: true
        });
        this.map.entities.push(this.runLine);
      }
    },
    clearRunLine() {
      // 清除跟踪轨迹线
      if (this.runLine) {
        this.map.entities.remove(this.runLine);
        this.runLine = null;
      }
    },
    //添加测量距离
    drawMeasureLine() {
      var that = this;
      if (that.measureLine.length >= 2) {
        //添加测量线
        if (!that.distanceLine) {
          that.distanceLine = new Microsoft.Maps.Polyline(that.measureLine, {
            strokeColor: "red",
            strokeThickness: 3,
            visible: true
          });
          that.map.entities.push(that.distanceLine);
        } else {
          that.distanceLine.setOptions({
            visible: true
          });
          that.distanceLine.setLocations(that.measureLine);
        }
        //移除之前的距离标记
        for (let i = 0; i < that.lineLabel.length; i++) {
          that.map.entities.remove(that.lineLabel[i]);
        }

        that.lineLabel = [];
        //计算距离并添加标记
        for (let i = 1; i < that.measureLine.length; i++) {
          var lat =
            (that.measureLine[i - 1].latitude + that.measureLine[i].latitude) /
            2;
          var lng =
            (that.measureLine[i - 1].longitude +
              that.measureLine[i].longitude) /
            2;
          var label = new Microsoft.Maps.Pushpin(
            new Microsoft.Maps.Location(lat, lng),
            {
              title:
                Math.round(
                  gpsHelper.distance(
                    that.measureLine[i - 1].latitude,
                    that.measureLine[i - 1].longitude,
                    that.measureLine[i].latitude,
                    that.measureLine[i].longitude
                  )
                ) + "m"
            }
          );
          that.map.entities.push(label);
          that.lineLabel.push(label);
        }
      }
    },
    measureDistance() {
      var that = this;
      var clickListener = function(e) {
        if (that.measureLine.length == 0) {
          that.measureLine.push(e.location);
          that.measureLine.push(e.location);
        } else {
          that.measureLine[that.measureLine.length - 1] = e.location;
          that.measureLine.push(e.location);
        }

        that.drawMeasureLine();
      };
      var moveListener = function(e) {
        that.measureLine[that.measureLine.length - 1] = e.location;
        that.drawMeasureLine();
      };

      var mapClick = Microsoft.Maps.Events.addHandler(
        that.map,
        "click",
        clickListener
      );
      var mapMove = Microsoft.Maps.Events.addHandler(
        that.map,
        "mousemove",
        moveListener
      );
      Microsoft.Maps.Events.addHandler(that.map, "rightclick", function() {
        //右击移除测量线和距离标记
        that.distanceLine.setOptions({
          visible: false
        });
        that.measureLine = [];
        for (var i = 0; i < that.lineLabel.length; i++) {
          that.map.entities.remove(that.lineLabel[i]);
        }
        that.lineLabel = [];
        Microsoft.Maps.Events.removeHandler(mapClick);
        Microsoft.Maps.Events.removeHandler(mapMove);
      });
    }, //移除布防圈
    removeCircle() {
      if (this.circleArea) {
        this.circleArea.setOptions({
          visible: false
        });
      }
    }, //画布防圈
    drawCircle(op) {
      // console.log(op);
      var lat1 = op.lat,
        lng1 = op.lng,
        radius = op.radius;
      var pt = this.baiduPtToBing(lat1, lng1);
      var EARTH_RADIUS = 6378140;
      //圆心纬度
      var lat = (pt.lat * Math.PI) / 180;
      //圆心经度
      var lon = (pt.lng * Math.PI) / 180;
      var d = parseFloat(radius) / EARTH_RADIUS;
      var locs = new Array();
      for (var i = 0; i <= 360; i++) {
        var loc = new Microsoft.Maps.Location(0, 0);
        var bearing = (i * Math.PI) / 180;
        loc.latitude = Math.asin(
          Math.sin(lat) * Math.cos(d) +
            Math.cos(lat) * Math.sin(d) * Math.cos(bearing)
        );
        loc.longitude =
          ((lon +
            Math.atan2(
              Math.sin(bearing) * Math.sin(d) * Math.cos(lat),
              Math.cos(d) - Math.sin(lat) * Math.sin(loc.latitude)
            )) *
            180) /
          Math.PI;
        loc.latitude = (loc.latitude * 180) / Math.PI;
        locs.push(loc);
      }
      var options = {
        fillColor: new Microsoft.Maps.Color(0.5, 0, 255, 0),
        strokeColor: new Microsoft.Maps.Color(1, 50, 205, 50),
        visible: true
      };
      if (this.circleArea) {
        this.circleArea.setRings(locs);
        this.circleArea.setOptions(options);
      } else {
        this.circleArea = new Microsoft.Maps.Polygon(locs, options);
        this.map.entities.push(this.circleArea);
      }
    }, //回放时坐标方向图片
    getPointIcon1(course) {
      var c = mapUtil.cnCourse1(course);
      return this.API.trackIcon + "arrow-" + c + ".png";
    }, //运行轨迹点位置和方向
    playPath(op) {
      // console.log(op);
      var p = this.baiduPtToBing(op.lat, op.lng);
      if (this.selectMarker) {
        this.selectMarker.setLocation(
          new Microsoft.Maps.Location(p.lat, p.lng)
        );
        // this.selectMarker.setOptions({
        //   icon: this.getPointIcon1(op.rotation),
        //   anchor: new Microsoft.Maps.Point(36, 36),
        // });
        // 2021-1-14
        this.selectMarker.setOptions({
          // 拿到图标的方向
          icon: this.getPointIcon1(op.rotation),
          // 纠正运动图标的偏移
          anchor: new Microsoft.Maps.Point(17, 17),
          zIndex: 888999,
          visible: true
        });
      }
    }, //添加标记点
    addPoint(data) {
      //lat, lng, icon, rotation, tag, title,offsetX,offsetY
      // console.log(data);
      var that = this;
      var pt = this.baiduPtToBing(data.lat, data.lng);
      var op = {
        icon: data.icon,
        // anchor: new Microsoft.Maps.Point(15, 40),
        title: data.title,
        zIndex: 888888,
        visible: true,
        autoRotation: data.tag == "run",
        offset: new Microsoft.Maps.Point(data.offsetX, data.offsetY)
      };
      var pushpin = new Microsoft.Maps.Pushpin(
        new Microsoft.Maps.Location(pt.lat, pt.lng),
        op
      );
      // console.log(pushpin);
      this.map.entities.push(pushpin);
      if (data.tag == "run") {
        this.selectMarker = pushpin;
      }
      Microsoft.Maps.Events.addHandler(pushpin, "click", function() {
        that.app.$emit("playback-point", data);
        that.setCenter(data);
      });

      this.pointMarker.push(pushpin);
      this.pointMarkerData.push(data);
    },
    delPoint(op) {
      var i = 0;
      while (i < this.pointMarkerData.length) {
        if (this.pointMarkerData[i].tag == op.tag) {
          this.map.entities.remove(this.pointMarker[i]);
          this.pointMarker.splice(i, 1);
          this.pointMarkerData.splice(i, 1);
        } else {
          i++;
        }
      }
    },
    baiduPtToBing(lat, lng) {
      // console.log(lat, lng);
      return gpsHelper.gcj_encrypt(lat, lng);
      // return { lat: lat, lng: lng };
    },
    baiduPtToBingArray(line) {
      // console.log(line);
      var list = [];
      for (var i = 0; i < line.length; i++) {
        var pt = this.baiduPtToBing(line[i].lat, line[i].lng);
        // var pt = this.baiduPtToBing(parseFloat(line[i].lat) + parseFloat(0.01), line[i].lng);
        list.push(new Microsoft.Maps.Location(pt.lat, pt.lng));
      }
      return list;
    }, //添加轨迹线
    addLine(op) {
      // console.log(op);
      var line = op.line,
        color = op.color;
      var lines = this.baiduPtToBingArray(line);
      var polyline = new Microsoft.Maps.Polyline(lines, {
        strokeColor: color,
        strokeThickness: 4,
        strokeStyle: "solid",
        strokeOpacity: 1,
        outlineColor: "#FFF",
        zIndex: 888
      });
      this.map.entities.push(polyline);
    },

    //路况信息
    roadTraffic() {
      this.isTraffic = this.isTraffic ? false : true;
      var that = this;
      Microsoft.Maps.loadModule("Microsoft.Maps.Traffic", function() {
        var manager = new Microsoft.Maps.Traffic.TrafficManager(that.map);
        if (that.isTraffic) {
          manager.show();
        } else {
          manager.hide();
        }
      });
    }, //设置地图中心和缩放
    centerZoom(lat, lng, zoom) {
      // console.log(lat, lng, zoom);
      var pt = this.baiduPtToBing(lat, lng);
      this.map.setView({
        center:
          lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
            ? new Microsoft.Maps.Location(pt.lat, pt.lng)
            : this.map.getCenter(),
        zoom: zoom ? zoom : this.map.getZoom()
      });
    }, //添加坐标
    addMarker(op) {
      // console.log(op);
      var that = this;
      if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
        var pt = this.baiduPtToBing(op.lat, op.lng);
        var point = new Microsoft.Maps.Location(pt.lat, pt.lng);
        var pushpin = new Microsoft.Maps.Pushpin(point, {
          icon: op.icon,
          // anchor: new Microsoft.Maps.Point(36, 36),
          // 设置必应地图上的图标的偏移量
          anchor: new Microsoft.Maps.Point(32, 46),
          subTitle: op.title,
          zIndex: 888888,
          rotation: op.rotation,
          iconSize: { width: 32, height: 32 }
          // iconSize: { width: 36, height: 45 },
        });

        Microsoft.Maps.Events.addHandler(pushpin, "click", function() {
          //点击选中设备
          that.selectMarker = pushpin;
          that.selectMarkerData = op.data;
          that.app.$emit("map-select-marker", op.data);
          that.app.$emit("show-device-position", op.data);
          that.setCenter(op);
        });
        this.markers[op.data.deviceImei] = pushpin;
        this.markersData[op.data.deviceImei] = op.data;
        this.map.entities.push(pushpin);
        return pushpin;
      }
    },
    moveMarker(op) {
      // 跟踪更新设备位置
      // console.log(op);
      if (this.selectMarker) {
        var pt = this.baiduPtToBing(op.lat, op.lng);
        this.selectMarker.setLocation(
          new Microsoft.Maps.Location(pt.lat, pt.lng)
        );
        this.selectMarker.setOptions({
          icon: op.icon,
          rotation: op.rotation,
          anchor: new Microsoft.Maps.Point(32, 46),
          zIndex: 888999,
          iconSize: { width: 32, height: 32 },
          visible: true
        });
      }
    },
    moveTheMarker(op) {
      // 实时更新所有设备的位置
      // console.log(op);
      var marker;
      if (this.markers[op.title] && this.markersData[op.title]) {
        marker = this.markers[op.title];
      }
      if (marker) {
        var pt = this.baiduPtToBing(op.lat, op.lng);
        marker.setLocation(new Microsoft.Maps.Location(pt.lat, pt.lng));
        marker.setOptions({
          icon: op.icon,
          anchor: new Microsoft.Maps.Point(32, 46),
          iconSize: { width: 32, height: 32 },
          zIndex: 888999,
          visible: true
        });
      }
    },
    hideInfoBox() {
      if (this.infoBox) {
        this.infoBox.setOptions({
          visible: false
        });
      }
    },
    viewInfoBox() {
      if (this.infoBox) {
        this.infoBox.setOptions({
          visible: true
        });
      }
    },
    updateInfoBox(op) {
      // console.log(op);
      // 回放轨迹上方的提示内容
      var infoContent = op.infoContent,
        lat = op.lat,
        lng = op.lng;
      //更新信息框
      var pt = this.baiduPtToBing(lat, lng);

      var offsetO =
        op.mapName == "location"
          ? new Microsoft.Maps.Point(-12, 10)
          : new Microsoft.Maps.Point(0, 8);
      if (this.infoBox) {
        this.infoBox.setOptions({
          htmlContent: infoContent,
          visible: true,
          location: new Microsoft.Maps.Location(pt.lat, pt.lng),
          // offset: new Microsoft.Maps.Point(0, 8), //图标的偏移量
          offset: offsetO
        });
      } else {
        var infobox = new Microsoft.Maps.Infobox(
          new Microsoft.Maps.Location(pt.lat, pt.lng),
          {
            htmlContent: infoContent
          }
        );
        infobox.setMap(this.map);
        this.infoBox = infobox;
      }
      this.viewInfoBox();
    },
    setSelectMarker(op) {
      var data = op.data;
      var prop = op.prop;
      var marker = op.marker;
      if (marker) {
        this.selectMarker = marker;
        this.selectMarkerData = data;
      } else {
        var val = data[prop];
        if (this.markersData[val] && this.markers[val]) {
          this.selectMarker = this.markers[val];
          this.selectMarkerData = this.markersData[val];
        }
      }
    },
    setCenter(op) {
      // console.log(op);
      var pt = this.baiduPtToBing(op.lat, op.lng);
      this.map.setView({ center: new Microsoft.Maps.Location(pt.lat, pt.lng) });
    },
    setZoom(op) {
      // console.log(op);
      this.map.setView({ zoom: op.zoom });
    },
    clearMap() {
      // console.log("chufa");
      if (this.infoBox) {
        this.infoBox.setMap(null);
      }
      this.selectMarker = null;
      this.selectMarkerData = null;
      this.infoBox = null;
      this.infoBoxData = null;
      this.circleArea = null;
      this.circleAreaData = null;
      this.markers = {};
      this.markersData = {};
      this.drawLinePt = [];
      this.drawPoint = [];
      this.drawLine = null;
      this.map.entities.clear();
    },
    saveMap() {
      // console.log(this.map.getZoom());
      if (this.map) {
        var data = {
          selectMarkerData: this.selectMarkerData,
          markersData: this.markersData,
          circleAreaData: this.circleAreaData,
          infoBoxData: this.infoBoxData,
          zoom: this.map.getZoom(),
          center: {
            lat: this.map.getCenter().latitude,
            lng: this.map.getCenter().longitude
          }
        };
        this.$emit("save-map", data);
      }
    },
    hideOtherMarkers(op) {
      if (this.selectMarkerData) {
        for (var key in this.markers) {
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.markers[key].setOptions({
              visible: false
            });
          }
        }
      }
    },
    showOtherMarkers(op) {
      if (this.selectMarkerData) {
        for (var key in this.markersData) {
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.markers[key].setOptions({
              visible: true
            });
          }
        }
      }
    },
    addDragPoint(data, isLine) {
      var pt = this.baiduPtToBing(data.lat, data.lng);
      var op = {
        draggable: true,
        anchor: new Microsoft.Maps.Point(32, 32)
      };
      var pushpin = new Microsoft.Maps.Pushpin(
        new Microsoft.Maps.Location(pt.lat, pt.lng),
        op
      );
      var that = this;
      Microsoft.Maps.Events.addHandler(pushpin, "dragend", function(e) {
        pushpin.setLocation(e.location);
        var list = [];
        if (isLine) {
          for (let i = 0; i < that.drawLinePt.length; i++) {
            list.push(that.drawLinePt[i].getLocation());
          }
        } else {
          for (let i = 0; i < that.drawPoint.length; i++) {
            list.push(that.drawPoint[i].getLocation());
          }
        }
        that.app.$emit("map-drag-point", list, isLine);
      });
      this.map.entities.push(pushpin);
      if (isLine) {
        this.drawLinePt.push(pushpin);
      } else {
        this.drawPoint.push(pushpin);
      }
    },
    addLabel() {},
    doMapClick(e) {
      this.app.$emit("map-click", e.location);
    },
    onMapClick() {
      this.mapClick = Microsoft.Maps.Events.addHandler(
        this.map,
        "click",
        this.doMapClick
      );
    },
    offMapClick() {
      Microsoft.Maps.Events.removeHandler(this.mapClick);
    },
    onDrawLine(line, color) {
      var op = { strokeColor: color, strokeThickness: 4 };
      var lines = this.baiduPtToBingArray(line);
      if (this.drawLine) {
        this.drawLine.setLocations(lines);
        this.drawLine.setOptions(op);
      } else {
        this.drawLine = new Microsoft.Maps.Polyline(lines, op);
        this.map.entities.push(this.drawLine);
      }
    },
    removeDrawLine() {
      for (var i = 0; i < this.drawLinePt.length; i++) {
        this.map.entities.remove(this.drawLinePt[i]);
      }
      this.drawLinePt = [];
    },
    setViewPort(op) {
      var pts = op.points;
      var start = pts[Math.floor(pts.length * 0.25)];
      var end = pts[Math.floor(pts.length * 0.75)];
      // 2021-1-7 start
      if (op.mapName == "playback") {
        this.setZoom({
          zoom: mapUtil.getBingZoomByMeter(
            mapUtil.getDistance(
              start.realPt.lat,
              start.realPt.lng,
              end.realPt.lat,
              end.realPt.lng
            )
          )
        });
        this.setCenter({
          lat: (start.realPt.lat + end.realPt.lat) / 2,
          lng: (start.realPt.lng + end.realPt.lng) / 2
        });
        // end
      } else {
        this.setZoom({
          zoom:
            mapUtil.getBingZoomByMeter(
              mapUtil.getDistance(start.lat, start.lng, end.lat, end.lng)
            ) + 1
        });
        this.setCenter({
          lat: (start.lat + end.lat) / 2,
          lng: (start.lng + end.lng) / 2
        });
      }
    },

    onMapOperation(op) {
      // console.log(op);
      if (op.mapName == this.mapName) {
        switch (op.action) {
          case "del-point":
            this.delPoint(op);
            break;
          case "show-other-markers":
            this.showOtherMarkers(op);
            break;
          case "hide-other-markers":
            this.hideOtherMarkers(op);
            break;
          case "hide-infobox":
            this.hideInfoBox(op);
            break;
          case "measure-line":
            this.measureDistance(op);
            break;
          case "show-infobox":
            this.updateInfoBox(op);
            break;
          case "add-marker":
            this.addMarker(op);
            break;
          case "move-marker":
            this.moveMarker(op);
            break;
          case "move-the-marker":
            this.moveTheMarker(op);
            break;
          case "set-center":
            this.setCenter(op);
            break;
          case "set-zoom":
            this.setZoom(op);
            break;
          case "select-marker":
            this.setSelectMarker(op);
            break;
          case "clear-map":
            this.clearMap(op);
            break;
          case "set-view-port":
            this.setViewPort(op);
            break;
          case "add-line":
            this.addLine(op);
            break;
          case "add-point":
            this.addPoint(op);
            break;
          case "play-path":
            this.playPath(op);
            break;
          case "draw-circle":
            this.drawCircle(op);
            break;
          case "remove-circle":
            this.removeCircle(op);
            break;
          case "draw-run-line":
            this.drawRunLine(op);
            break;
          case "clear-run-line":
            this.clearRunLine();
            break;
          //case "add-drag-point":
          //this.addDragPoint(op);
          //break;
          //case "on-map-click":
          //this.onMapClick(op);
          //break;
          //case "off-map-click":
          //this.offMapClick(op);
          //break;
          //case "draw-line":
          //this.onDrawLine(op);
          //break;
          //case "remove-draw-line":
          //this.removeDrawLine(op);
          //break;
        }
      }
    },
    //初始化地图
    initBingMap() {
      MapLoader().then(Microsoft => {
        console.log("Microsoft", Microsoft);
        var zoom = 11;
        if (this.mapName == "location") {
          zoom = 3;
        }
        var map = new Microsoft.Maps.Map(
          document.getElementById("bing_map_" + this.mapName),
          {
            center: new Microsoft.Maps.Location(39.915, 116.404),
            zoom: zoom,
            showMapTypeSelector: false,
            showTrafficButton: true,
            showBreadcrumb: true,
            minZoom: 3,
            maxZoom: 20
          }
        );
        // 之前的是mapresize， 但是不起作用了
        Microsoft.Maps.Events.addHandler(map, "viewchangeend", () => {
          this.$emit("map-zoom", map.getCenter(), map.getZoom());
        });
        this.map = map;
        setTimeout(() => {
          this.listenEvent();
          if (this.isEmptyObject(this.markers)) {
            // console.log("zhixing");
            this.app.$emit("agin-load-device");
          }
        }, 1000);
      });
    },
    listenEvent() {
      this.app.$on("map-operation", this.onMapOperation);
    },
    offEvent() {
      this.app.$off("map-operation", this.onMapOperation);
    }
  },
  beforeCreate() {
    // const scriptUrl = "https://cn.bing.com/api/maps/mapcontrol?key= AisjCHWRd2ahuXBg61CeXfHV9vk1quAhnnn_lxQucGfCViu85UqqUR4zXOpqC-np&mkt=en-us";
    // this.getTheMapScriptToBody(scriptUrl);
  },
  mounted() {
    var that = this;
    // setTimeout(function () {
    that.initBingMap();
    //   that.listenEvent();
    // }, 1000);
  },
  beforeDestroy() {
    this.offEvent();
    this.saveMap();
  }
};
</script>

<style lang="scss">
.ScaleBar {
  position: fixed !important;
  bottom: 40px !important;
  left: -5px !important;
}
</style>
