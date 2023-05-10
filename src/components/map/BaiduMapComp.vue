<template>
  <div style="height: 100%; width: 100%" :id="'baidu_map_' + mapName"></div>
</template>

<script>
// 地图上聚合物
import MarkerClusterer from "bmaplib.markerclusterer";
// 地图上设置路况
// import TrafficControl from "bmaplib.trafficcontrol";
import gpsHelper from "@/utils/gpsHelper.js";
//import dotIcon from '@/assets/img/dot.svg';
import mapUtil from "@/utils/mapUtil.js";
import "@/utils/drawingManager.js";
export default {
  name: "BaiduMap",
  props: {
    mapName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    map: null,
    infoBox: null,
    infoBoxData: null,
    selectMarker: null,
    selectMarkerData: null,
    trafficCtrl: null,
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
    pointCollect: null,
    markerClusterer: null,
    areaBoundary: null,
    areaLabel: null,
    polygonArea: null,
    editPoints: [],
    markerLabels: {},
    selectLabel: null,
    boundaryArea: [],
    runLine: null,
    oprotation: "",
    targetImei: "",

    // 2022-11-5
    styleOptions: {
      strokeColor: "#5E87DB", // 边线颜色
      fillColor: "#5E87DB", // 填充颜色。当参数为空时，圆形没有填充颜色
      strokeWeight: 2, // 边线宽度，以像素为单位
      strokeOpacity: 1, // 边线透明度，取值范围0-1
      fillOpacity: 0.2 // 填充透明度，取值范围0-1
    },
    labelOptions: {
      borderRadius: "2px",
      background: "#FFFBCC",
      border: "1px solid #E1E1E1",
      color: "#703A04",
      fontSize: "12px",
      letterSpacing: "0",
      padding: "5px"
    },
    drawingManager: null, // 鼠标绘制工具
    drawingType: "",
    drawingnewPly: null,
    drawingOrigin: null,
    drawingFirstNewPly: null
  }),
  methods: {
    drawMeasureLine() {
      //画测量线
      var that = this;
      if (that.measureLine.length >= 2) {
        if (!that.distanceLine) {
          that.distanceLine = new BMap.Polyline(that.measureLine, {
            strokeColor: "red",
            strokeWeight: 3,
            strokeStyle: "solid",
            strokeOpacity: 1
          });
          that.map.addOverlay(that.distanceLine);
        } else {
          that.distanceLine.setPath(that.measureLine);
        }
        //移除之前的距离标记
        for (var i = 0; i < that.lineLabel.length; i++) {
          that.map.removeOverlay(that.lineLabel[i]);
        }
        that.lineLabel = [];
        //计算距离并添加标记
        for (let i = 1; i < that.measureLine.length; i++) {
          var lat = (that.measureLine[i - 1].lat + that.measureLine[i].lat) / 2;
          var lng = (that.measureLine[i - 1].lng + that.measureLine[i].lng) / 2;
          var opts = {
            position: new BMap.Point(lng, lat), //指定文本标注所在的地理位置
            offset: new BMap.Size(10, 10) //设置文本偏移量
          };
          var label = new BMap.Label(
            Math.round(
              gpsHelper.distance(
                that.measureLine[i - 1].lat,
                that.measureLine[i - 1].lng,
                that.measureLine[i].lat,
                that.measureLine[i].lng
              )
            ) + "m",
            opts
          ); //创建文本标注距离的对象
          label.setStyle({
            color: "red",
            fontSize: "1.2rem",
            fontWeight: "normal",
            background: "transparent",
            fontFamily: "微软雅黑",
            border: "none"
          });
          that.map.addOverlay(label);
          that.lineLabel.push(label);
        } //for (var i = 1; i < that.measureLine.length; i++)
      }
    },

    clickListener(e) {
      // console.log(e);
      //点击增加测量点
      if (this.measureLine.length == 0) {
        this.measureLine.push(e.point);
        this.measureLine.push(e.point);
      } else {
        this.measureLine[this.measureLine.length - 1] = e.point;
        this.measureLine.push(e.point);
      }

      this.drawMeasureLine();
    },
    moveListener(e) {
      //测量点的最后一点跟随移动
      this.measureLine[this.measureLine.length - 1] = e.point;
      this.drawMeasureLine();
    }, //测量距离
    measureDistance() {
      var that = this;
      //左点击开始测量,有点击结束测量
      document
        .querySelector(`#baidu_map_${this.mapName}>div`)
        .classList.add("draw");

      this.map.addEventListener("click", this.clickListener);
      this.map.addEventListener("mousemove", this.moveListener);

      this.map.addEventListener("rightclick", function() {
        // console.log("youjile");
        that.offMeasureLine();
      });
    },
    offMeasureLine() {
      //结束测量则清除动作，测量线与标注
      var that = this;
      this.map.removeEventListener("click", this.clickListener);
      this.map.removeEventListener("mousemove", this.moveListener);
      that.map.removeOverlay(that.distanceLine);
      that.distanceLine = null;
      that.measureLine = [];
      for (var i = 0; i < that.lineLabel.length; i++) {
        that.map.removeOverlay(that.lineLabel[i]);
      }
      that.lineLabel = [];
      document
        .querySelector(`#baidu_map_${that.mapName}>div`)
        .classList.remove("draw");
      that.app.$emit("off-measure-line");
    },
    playPath(op) {
      //回放时运行点坐标位置和方向
      // 2021-1-11
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setPosition(new BMap.Point(op.lng, op.lat));
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          this.selectMarker.setRotation(op.rotation - 90);
        }
      }
    },
    addPoint(data) {
      //添加轨迹点标记
      // console.log(data);
      var that = this;
      if (data.tag == "run") {
        var op = {
          // 2020-1-9
          // position: this.parseAmpBd2Pt(data),
          //
          // icon: new BMap.Icon(data.icon, new BMap.Size(28, 28)),
          icon: new BMap.Icon(data.icon, new BMap.Size(27, 27)),
          rotation: data.rotation,
          zIndex: 999,
          title: data.title
        };
      } else {
        op = {
          icon: new BMap.Icon(data.icon, new BMap.Size(27, 42)),
          rotation: data.rotation,
          zIndex: 999,
          title: data.title
        };
      }
      // data = this.parseAmpBd2Pt(data);
      var marker = new BMap.Marker(new BMap.Point(data.lng, data.lat), op);
      marker.setOffset(new BMap.Size(data.offsetX, data.offsetY));
      this.map.addOverlay(marker);
      if (data.tag == "run") {
        this.selectMarker = marker;
      }
      marker.addEventListener("click", function() {
        // console.log("add-point");
        that.app.$emit("playback-point", data);
        that.setCenter(data);
      });
      this.map.setZoom(16);
      this.pointMarker.push(marker);
      this.pointMarkerData.push(data);
    },
    delPoint(op) {
      //删除指定的轨迹点标记
      var tag = op.tag;
      var i = 0;
      while (i < this.pointMarkerData.length) {
        if (this.pointMarkerData[i].tag == tag) {
          this.map.removeOverlay(this.pointMarker[i]);
          this.pointMarker.splice(i, 1);
          this.pointMarkerData.splice(i, 1);
        } else {
          i++;
        }
      }
    },
    parseAmpBd2Pt(op) {
      // console.log(op);
      // 将高德经纬度转为百度经纬度(先转成高德，再转为百度)
      // console.log(op);
      // var pt = gpsHelper.gcj_encrypt(op.lat, op.lng);

      return gpsHelper.wgs84tobd09(op.lng, op.lat);
      // return new BMap.LngLat
    },
    parseAmpArray2BdArray(list) {
      // 转成数组
      var result = [];
      for (var i = 0; i < list.length; i++) {
        result.push(this.parseAmpBd2Pt(list[i]));
      }
      // console.log(result);
      return result;
    },
    addLine(op) {
      //画轨迹
      // console.log("op", op);
      var line = op.line,
        color = op.color;
      // line = this.parseAmpArray2BdArray(op.line);
      // console.log(line);
      // var pointList = [];
      // for (var i = 0; i < line.length; i++) {
      //   pointList.push(new BMap.Point(line[i][1], line[i][0]));
      // }
      // console.log(pointList);
      var theLine = new BMap.Polyline(line, {
        strokeColor: color,
        strokeWeight: 4,
        strokeStyle: "solid",
        strokeOpacity: 1
      });
      this.map.addOverlay(theLine);
    },

    addMarkerCluster() {
      //聚簇点
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers();
        this.markerClusterer.addMarkers(this.markers);
      } else {
        this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
          markers: this.markers,
          isAverangeCenter: true,
          minClusterSize: 2,
          gridSize: 200
        });
      }
    },
    addMarker(op) {
      //添加设备坐标 36， 45
      // console.log(op);
      // imageSize: new BMap.Size(32, 32),
      var that = this;
      let height;
      if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
        var theIcon = new BMap.Icon(op.icon, new BMap.Size(32, 32), {
          imageSize: new BMap.Size(32, 32)
        });
        var marker = new BMap.Marker(new BMap.Point(op.lng, op.lat), {
          icon: theIcon,
          title: op.title,
          rotation: op.rotation,
          // rotation: 0
        });
        var label = new BMap.Label(
          `<div class='device-label'>${op.data.name}</div>`,
          {
            offset: new BMap.Size(0, 0),
            position: new BMap.Point(op.lng, op.lat)
          }
        );
        label.setTitle(op.data.deviceImei);
        label.setStyle({
          border: "none",
          background: "transparent",
          display: "none"
        });

        marker.addEventListener("click", function() {
          // console.log("add-marker");
          that.app.$emit("map-select-marker", op.data);
          that.app.$emit("show-device-position", op.data);
          that.selectMarker = marker;
          that.selectLabel = label;
          that.selectMarkerData = op.data;
          // that.setCenter(op);
          that.map.setCenter(op.data.bdlng, op.data.bdlat);
          that.updateInfoBox(that.infoBoxData);
        });
        // 2021-12-17
        marker.addEventListener("dblclick", function() {
          that.app.$emit("map-select-marker", op.data);
          that.map.setCenter(op.data.bdlng, op.data.bdlat);
          // console.log("shuangji");
          let zooms = that.map.getZoom();
          zooms = zooms + 1;
          that.map.setZoom(zooms);
        });

        this.map.addOverlay(marker);
        this.markers[op.data.deviceImei] = marker;
        this.markersData[op.data.deviceImei] = op.data;
        //this.markers.push(marker);
        //this.markersData.push(op.data);

        label.addEventListener("click", function() {
          that.app.$emit("map-select-marker", op.data);
          that.selectMarker = marker;
          that.selectLabel = label;
          that.selectMarkerData = op.data;
          that.map.setCenter(op.data.bdlng, op.data.bdlat);
          let zooms = that.map.getZoom();
          zooms = zooms + 1;
          that.map.setZoom(zooms);
        });
        this.map.addOverlay(label);
        this.markerLabels[op.data.deviceImei] = label;
        //this.markerLabels.push(label);

        return marker;
      }
    },
    moveMarker(op) {
      //更新选中的设备信息
      // console.log("da", op);
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setPosition(new BMap.Point(op.lng, op.lat));
        }
        if (op.icon) {
          // this.selectMarker.setIcon(new BMap.Icon(op.icon, new BMap.Size(36, 36)));
          let icon = new BMap.Icon(op.icon, new BMap.Size(32, 32));
          icon.setImageSize(new BMap.Size(32, 32));
          this.selectMarker.setIcon(icon);
        }
        if (op.title) {
          this.selectMarker.setTitle(op.title);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          this.selectMarker.setRotation(op.rotation);
          // this.selectMarker.setRotation(0);
          //
          this.oprotation = op.rotation;
          this.targetImei = op.deviceImei;
        }
      }
      if (this.selectLabel) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectLabel.setPosition(new BMap.Point(op.lng, op.lat));
        }
      }
    },
    moveTheMarker(op) {
      // console.log(op);
      //更新指定设备号的设备坐标
      var marker, label;

      if (
        this.markers[op.title] &&
        this.markerLabels[op.title] &&
        this.markersData[op.title]
      ) {
        marker = this.markers[op.title];
        label = this.markerLabels[op.title];
      }

      if (marker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          marker.setPosition(new BMap.Point(op.lng, op.lat));
        }
        if (op.icon) {
          // marker.setIcon(new BMap.Icon(op.icon, new BMap.Size(36, 36)));
          let icon = new BMap.Icon(op.icon, new BMap.Size(32, 32));
          icon.setImageSize(new BMap.Size(32, 32));
          marker.setIcon(icon);
        }
        if (op.title) {
          marker.setTitle(op.title);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          marker.setRotation(0);
          if (op.title == this.targetImei) {
            // console.log("chufa");
            marker.setRotation(op.rotation);
            // marker.setRotation(0);
          }
        }
      }
      if (label) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          label.setPosition(new BMap.Point(op.lng, op.lat));
        }
      }
    },
    updateInfoBox(op) {
      // console.log(op);
      //更新信息框
      this.infoBoxData = {
        infoContent: op.infoContent,
        lat: op.lat,
        lng: op.lng,
        offsetX: op.offsetX,
        offsetY: op.offsetY,
        style: op.style
      };

      if (this.infoBox) {
        this.infoBox.setContent(op.infoContent);
        this.infoBox.setPosition(new BMap.Point(op.lng, op.lat));
        this.infoBox.setOffset(new BMap.Size(op.offsetX, op.offsetY));
      } else {
        var label = new BMap.Label(op.infoContent, {
          offset: new BMap.Size(op.offsetX, op.offsetY),
          position: new BMap.Point(op.lng, op.lat)
        });
        label.setStyle(op.style);
        this.map.addOverlay(label);
        this.infoBox = label;
      }
      this.viewInfoBox();
    },
    hideInfoBox() {
      //隐藏信息框

      if (this.infoBox) {
        this.infoBox.setStyle({
          display: "none"
        });
      }
    },
    viewInfoBox() {
      //显示信息框
      if (this.infoBox) {
        this.infoBox.setStyle({
          display: "inline-block"
        });
      }
    },
    collectPoint(op) {
      //
      var that = this;
      if (this.pointCollect) {
        this.pointCollect.setPoints(op.points);
      } else {
        this.pointCollect = new BMap.PointCollection(op.points, {
          shape: BMAP_POINT_SHAPE_WATERDROP
        });
        this.map.addOverlay(this.pointCollect);
        this.pointCollect.addEventListener("click", function(e) {
          // console.log("collect-point");
          for (var i = 0; i < op.points.length; i++) {
            if (op.points[i] == e.point) {
              that.$emit("point-collect", i);
              break;
            }
          }
        });
      }
    },
    removeCircle() {
      //移除布防圆
      if (this.circleArea) {
        this.map.removeOverlay(this.circleArea);
        this.circleArea = null;
      }
    },
    drawCircle(op) {
      // console.log(op);
      //画布防圆
      this.circleAreaData = {
        lat: op.lat,
        lng: op.lng,
        radius: op.radius
      };
      if (this.circleArea) {
        this.circleArea.setCenter(new BMap.Point(op.lng, op.lat));
        this.circleArea.setRadius(op.radius);
      } else {
        this.circleArea = new BMap.Circle(
          new BMap.Point(op.lng, op.lat),
          op.radius,
          op.isDraw
            ? {
                strokeColor: "blue",
                strokeWeight: 2,
                strokeOpacity: 0.5
              }
            : {
                strokeColor: "#32cd32", //边线颜色。
                fillColor: "#00ff00", //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 2, //边线的宽度，以像素为单位。
                strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
                fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
                strokeStyle: "solid" //边线的样式，solid或dashed。
              }
        );
        this.map.addOverlay(this.circleArea);
      }
    },
    setCenter(op) {
      //设置地图中心
      // console.log(op);
      this.map.setCenter(
        op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180
          ? new BMap.Point(op.lng, op.lat)
          : this.map.getCenter()
      );
    },
    setZoom(op) {
      //设置地图缩放大小
      // console.log("op", op);
      this.map.setZoom(op.zoom ? op.zoom : this.map.getZoom());
    }, //地图中心和放大缩小改变
    centerZoom(op) {
      //设置地图中心与缩放大小
      // this.map.centerAndZoom(lat >= -90 && lat <= 90 && lng >= 0 && lng <= 180 ? new BMap.Point(lng, lat) : this.map.getCenter(), zoom ? zoom : this.map.getZoom());
      this.map.centerAndZoom(
        op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180
          ? new BMap.Point(op.lng, op.lat)
          : this.map.getCenter(),
        op.zoom ? op.zoom : this.map.getZoom()
      );
    },
    setSelectMarker(op) {
      //选中设备坐标
      var data = op.data;
      var prop = op.prop;
      var marker = op.marker;
      if (marker) {
        this.selectMarker = marker;
        this.selectMarkerData = data;
      } else {
        var val = data[prop];
        if (
          this.markersData[val] &&
          this.markers[val] &&
          this.markerLabels[val]
        ) {
          this.selectMarker = this.markers[val];
          this.selectMarkerData = this.markersData[val];
          this.selectLabel = this.markerLabels[val];
        }
      }
    },
    clearMap() {
      //清空地图与对应的数据
      this.selectMarker = null;
      this.selectMarkerData = null;
      this.infoBox = null;
      this.infoBoxData = null;
      this.circleArea = null;
      this.circleAreaData = null;
      this.markers = [];
      this.markersData = [];
      this.drawLinePt = [];
      this.drawPoint = [];
      this.drawLine = null;
      this.markerLabels = [];
      this.selectLabel = null;
      this.areaBoundary = null;

      this.areaLabel = null;
      this.polygonArea = null;
      this.editPoints = [];
      this.map.clearOverlays();
    },
    setViewPort(op) {
      // console.log(op);
      //地图缩放自适应
      // this.map.setViewport(op.points);
      // 2021-1-9
      if (op.points.length != 0) {
        var pts = op.points;
        var start = pts[Math.floor(pts.length * 0.25)];
        var end = pts[Math.floor(pts.length * 0.75)];
        // console.log("start", start);
        if (op.mapName == "playback") {
          this.setZoom({
            zoom:
              mapUtil.getBaiduZoomByMeter(
                mapUtil.getDistance(
                  start.baiduPt.lat,
                  start.baiduPt.lng,
                  end.baiduPt.lat,
                  end.baiduPt.lng
                )
              ) + 1
          });
          this.setCenter({
            lat: (start.baiduPt.lat + end.baiduPt.lat) / 2,
            lng: (start.baiduPt.lng + end.baiduPt.lng) / 2
          });
        } else {
          this.setZoom({
            zoom:
              mapUtil.getBaiduZoomByMeter(
                mapUtil.getDistance(start.lat, start.lng, end.lat, end.lng)
              ) + 1
          });
          this.setCenter({
            lat: (start.lat + end.lat) / 2,
            lng: (start.lng + end.lng) / 2
          });
        }
      }

      // 2021-1-9 end
    },
    hideOtherMarkers(op) {
      //隐藏除选中设备外的设备坐标

      if (this.selectMarkerData) {
        for (var key in this.markers) {
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.map.removeOverlay(this.markers[key]);
          }
        }
      }
    },
    showOtherMarkers(op) {
      //显示所有所设备
      //if (this.selectMarkerData){
      //  for (var i = 0; i < this.markersData.length; i++){
      //    if (this.markersData[i][op.prop] != this.selectMarkerData[op.prop]){
      //      this.map.addOverlay(this.markers[i]);
      //    }
      //  }
      //}

      if (this.selectMarkerData) {
        for (var key in this.markersData) {
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.map.addOverlay(this.markers[key]);
          }
        }
      }
    },
    doMapClick(e) {
      //监控地图点击事件
      this.app.$emit("map-click", { mapName: this.mapName, point: e.point });
    },
    doMapOver(e) {
      //监控地图鼠标移动事件
      this.app.$emit("map-over", { mapName: this.mapName, point: e.point });
    },
    doMapDBClick(e) {
      //监控地图双击事件
      this.app.$emit("map-dbclick", { mapName: this.mapName, point: e.point });
    },
    doMapRight(e) {
      //监控地图右击事件
      this.app.$emit("map-rightclick", {
        mapName: this.mapName,
        point: e.point
      });
    },
    onMapClick() {
      //地图动作启动
      this.map.addEventListener("click", this.doMapClick);
      this.map.addEventListener("mousemove", this.doMapOver);
      //this.map.addEventListener("dblclick", this.doMapDBClick);
      this.map.addEventListener("rightclick", this.doMapRight);
    },
    offMapClick() {
      //地图动作取消
      this.map.removeEventListener("click", this.doMapClick);
      this.map.removeEventListener("mousemove", this.doMapOver);
      //this.map.removeEventListener("dblclick", this.doMapDBClick);
      this.map.removeEventListener("rightclick", this.doMapRight);
    },
    addAreaBoundary(op) {
      console.log(op);
      //画行政区边界
      var that = this;
      var bdary = new BMap.Boundary();
      bdary.get(op.address, function(rs) {
        //获取行政区域
        if (that.boundaryArea.length > 0) {
          for (var i = 0; i < that.boundaryArea.length; i++) {
            that.map.removeOverlay(that.boundaryArea[i]);
          }
        }

        var count = rs.boundaries.length; //行政区域的点有多少个
        if (count === 0) {
          that.app.$emit("show-alert-msg", this.$t("common.boundaryTip"));

          that.app.$emit("map-boundary", []);
          return;
        }
        var boundaryArea = [];
        var pointArray = [];
        for (let i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: "#ff0000"
          }); //建立多边形覆盖物
          that.map.addOverlay(ply); //添加覆盖物
          pointArray = pointArray.concat(ply.getPath());
          boundaryArea.push(ply);
        }
        that.boundaryArea = boundaryArea;
        that.app.$emit("map-boundary", pointArray);
        that.map.setViewport(pointArray); //调整视野
      });
    },
    addEditPoint(op) {
      //添加可移动点
      var that = this;
      var option = {
        icon: new BMap.Icon(op.icon, new BMap.Size(16, 16)),
        enableDragging: true
      };
      var marker = new BMap.Marker(new BMap.Point(op.lng, op.lat), option);
      marker.addEventListener("dragend", function(e) {
        marker.setPosition(e.point);

        that.app.$emit("map-eidt-point", {
          mapName: that.mapName,
          idx: op.idx,
          point: e.point,
          tag: op.tag
        });
      });
      if (op.tag == "point") {
        marker.addEventListener("rightclick", function(e) {
          that.app.$emit("map-eidt-point-right", {
            mapName: that.mapName,
            idx: op.idx,
            point: e.point
          });
        });
      }
      this.map.addOverlay(marker);
      this.editPoints.push(marker);
    },
    clearEditPoint() {
      //清空可移动点
      if (this.editPoints.length > 0) {
        for (var i = 0; i < this.editPoints.length; i++) {
          this.map.removeOverlay(this.editPoints[i]);
        }
        this.editPoints = [];
      }
    },
    drawPolygon(op) {
      //画围栏多边形
      if (this.polygonArea) {
        this.polygonArea.setPath(op.points);
      } else {
        var polygon = new BMap.Polygon(op.points, {
          strokeColor: "blue",
          strokeWeight: 2,
          strokeOpacity: 0.5
        });
        this.map.addOverlay(polygon);
        this.polygonArea = polygon;
      }
    },
    removePolygon() {
      //删除围栏多边形
      if (this.polygonArea) {
        this.map.removeOverlay(this.polygonArea);
        this.polygonArea = null;
      }
    },
    showMarkerLabels() {
      //显示设备坐标名字标签
      //for (var i = 0; i < this.markerLabels.length; i++){
      //  if (this.selectLabel == this.markerLabels[i]){
      //    this.selectLabel.setStyle({
      //      display: "none"
      //    });
      //  } else{
      //    this.markerLabels[i].setStyle({
      //      display: "inline-block"
      //    });
      //  }
      //}
      for (var key in this.markerLabels) {
        if (this.selectLabel == this.markerLabels[key]) {
          this.selectLabel.setStyle({
            display: "none"
          });
        } else {
          this.markerLabels[key].setStyle({
            display: "inline-block"
          });
        }
      }
    },
    hideMarkerLabels() {
      //隐藏设备坐标名字标签
      //for (var i = 0; i < this.markerLabels.length; i++){
      //  this.markerLabels[i].setStyle({
      //    display: "none"
      //  });
      //}
      for (var key in this.markerLabels) {
        this.markerLabels[key].setStyle({
          display: "none"
        });
      }
    },
    drawRunLine(op) {
      //画跟踪轨迹线
      if (this.runLine) {
        var path = this.runLine.getPath();
        path.push(new BMap.Point(op.lng, op.lat));
        this.runLine.setPath(path);
        this.runLine.setStrokeColor("green");
      } else {
        var line = [];
        if (this.selectMarker) {
          line.push(this.selectMarker.getPosition());
        }
        line.push(new BMap.Point(op.lng, op.lat));

        this.runLine = new BMap.Polyline(line, {
          strokeColor: "green",
          strokeWeight: 4,
          strokeStyle: "solid",
          strokeOpacity: 1
        });
        this.map.addOverlay(this.runLine);
      }
    },
    clearRunLine() {
      //清除跟踪轨迹线
      if (this.runLine) {
        this.map.removeOverlay(this.runLine);
        this.runLine = null;
      }
    },
    addLastMaker(data) {
      // console.log("data", data);
      // 回放時顯示最後的點
      let op = {
        icon: new BMap.Icon(data.icon, new BMap.Size(27, 42)),
        rotation: data.rotation,
        zIndex: 999,
        title: data.title
      };
      const marker = new BMap.Marker(new BMap.Point(data.lng, data.lat), op);
      marker.setOffset(new BMap.Size(data.offsetX, data.offsetY));
      this.map.addOverlay(marker);
      this.pointMarker.push(marker);
    },
    onMapOperation(op) {
      // console.log(op);
      //地图操作
      if (op.mapName == this.mapName) {
        var actions = {
          "del-point": this.delPoint,
          "show-other-markers": this.showOtherMarkers,
          "hide-other-markers": this.hideOtherMarkers,
          "hide-infobox": this.hideInfoBox,
          "measure-line": this.measureDistance,
          "off-measure-line": this.offMeasureLine,
          "show-infobox": this.updateInfoBox,
          "add-marker": this.addMarker,
          "add-marker-cluster": this.addMarkerCluster,
          "move-marker": this.moveMarker,
          "set-center": this.setCenter,
          "set-zoom": this.setZoom,
          "select-marker": this.setSelectMarker,
          "clear-map": this.clearMap,
          "set-view-port": this.setViewPort,
          "add-line": this.addLine,
          "add-point": this.addPoint,
          "play-path": this.playPath,
          "draw-circle": this.drawCircle,
          "remove-circle": this.removeCircle,
          "draw-polygon": this.drawPolygon,
          "remove-polygon": this.removePolygon,
          "point-collection": this.collectPoint,
          "add-area-boundary": this.addAreaBoundary,
          "on-map-click": this.onMapClick,
          "off-map-click": this.offMapClick,
          "add-edit-point": this.addEditPoint,
          "clear-edit-point": this.clearEditPoint,
          "move-the-marker": this.moveTheMarker,
          "show-marker-labels": this.showMarkerLabels,
          "hide-marker-labels": this.hideMarkerLabels,
          "draw-run-line": this.drawRunLine,
          "clear-run-line": this.clearRunLine,
          "center-zoom": this.centerZoom,
          // "set-path-point": this.setPathPoint,
          "add-last-marker": this.addLastMaker,
          "draw-track-line": this.drawingTrack,
          "draw-polygon-track": this.drawPolygonFence,
          "remove-polygon-track": this.removePolygonFence
        };
        actions[op.action] && actions[op.action](op);
      }
    },
    listenEvent() {
      this.app.$on("map-operation", this.onMapOperation);
    },
    offEvent() {
      this.app.$off("map-operation", this.onMapOperation);
    },
    saveMap() {
      if (this.map) {
        var data = {
          selectMarkerData: this.selectMarkerData,
          markersData: this.markersData,
          circleAreaData: this.circleAreaData,
          infoBoxData: this.infoBoxData,
          zoom: this.map.getZoom(),
          center: {
            lat: this.map.getCenter().lat,
            lng: this.map.getCenter().lng
          }
        };
        // console.log(data);
        this.$emit("save-map", data);
      }
    }, //初始化地图
    initBaiduMap() {
      // if(TextIconOverlay){
      //   BMapLib.TextIconOverlay=TextIconOverlay;
      //}
      if (MarkerClusterer) {
        BMapLib.MarkerClusterer = MarkerClusterer;
      }

      // if (TrafficControl) {
      //   BMapLib.TrafficControl = TrafficControl;
      // }
      var that = this;
      var map = new BMap.Map("baidu_map_" + this.mapName);
      map.setMinZoom(3);
      map.setMaxZoom(19);
      //添加控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP]
        })
      );
      map.addControl(new BMap.ScaleControl());
      map.enableScrollWheelZoom(true);
      if (this.mapName == "location") {
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 3);
      } else {
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
      }
      map.addEventListener("zoomend", function() {
        that.$emit("map-zoom", map.getCenter(), map.getZoom());
      });

      //添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        enableGeolocation: true
      });
      map.addControl(navigationControl);

      //是否显示交通状况功能

      // if (BMapLib.TrafficControl && this.mapName == "location") {
      //   // var trafficCtrl = new BMapLib.TrafficControl();
      //   trafficCtrl.setOffset(new BMap.Size(10, 40));
      //   map.addControl(trafficCtrl);
      //   this.trafficCtrl = trafficCtrl;
      // }

      this.map = map;
      if (this.isEmptyObject(this.markers)) {
        console.log("zhixing");
        this.app.$emit("agin-load-device");
      }
    },
    // 2022-11-5 start
    removePolygonFence() {
      // console.log("zhixing");

      if (this.drawingOrigin) {
        this.map.removeOverlay(this.drawingOrigin);
        this.drawingOrigin = null;
      }
      if (this.drawingnewPly) {
        this.map.removeOverlay(this.drawingnewPly);
        this.drawingnewPly = null;
      }
      if (this.drawingFirstNewPly) {
        this.map.removeOverlay(this.drawingFirstNewPly);
        this.drawingFirstNewPly = null;
      }
      this.drawingManager.close();
    },
    drawPolygonFence(op) {
      console.log("op", op);
      // 還有點問題this.app.$on('load-more-ponits', this.saveHurdle)
      this.drawingnewPly = new BMap.Polygon(op.points, this.styleOptions);
      this.map.removeOverlay(this.drawingManager);
      this.map.addOverlay(this.drawingnewPly);
      this.drawingnewPly.enableEditing();
      let pathArr = [];
      pathArr = pathArr.concat(this.drawingnewPly.getPath());
      // this.map.addEventListener('rightclick', (e)=> {
      //   this.saveHurdle();
      // })
      // 围栏那边点击保存会再次调用
      this.app.$on("load-more-ponits", this.saveHurdle);
    },

    polygonComplete(ply) {
      // 直接使用了绘制工具画好的多边形对象
      // ply.enableEditing();
      this.drawingOrigin = ply;
      this.drawingTrack();
      this.drawingFirstNewPly = new BMap.Polygon(
        this.drawingOrigin.getPath(),
        this.styleOptions
      );
      this.map.removeOverlay(this.drawingOrigin);
      this.map.addOverlay(this.drawingFirstNewPly);
      this.drawingFirstNewPly.enableEditing();
      this.map.addEventListener("rightclick", () => {
        this.drawingFirstNewPly.disableEditing();
        this.saveHurdle();
      });
      // this.saveHurdle();
    },
    drawingTrack() {
      this.drawingType = BMAP_DRAWING_POLYGON;
      // 进行绘制
      if (
        this.drawingManager._isOpen &&
        this.drawingManager.getDrawingMode() === this.drawingType
      ) {
        this.drawingManager.close();
      } else {
        this.drawingManager.setDrawingMode(this.drawingType);
        this.drawingManager.open();
      }
    },
    // 保存围栏数据
    saveHurdle() {
      var overlays = this.map.getOverlays();
      // console.log(overlays)
      var pointsStrArr = [];
      overlays.forEach(item => {
        if (item.getPath) {
          pointsStrArr = this.pointsToStr(item.getPath());
          // pointsStr && pointsStrArr.push(pointsStr);
        }
      });
      if (pointsStrArr.length == 0) {
        this.$message({
          message: "操作失败，您没用绘制任何有效区域",
          type: "error"
        });
        return;
      }

      // 后台保存需要的路径坐标数据
      this.app.$emit("load-track-points", pointsStrArr);
      const data = JSON.stringify(pointsStrArr);
      console.log(data);
    },
    // 坐标点数组转字符串
    pointsToStr(points) {
      if (!points) return "";
      var str = "";
      // points.forEach((item) => {
      //   str += item.lng + "," + item.lat + ";";
      // });
      points = points.map(item => {
        return {
          lat: item.lat,
          lng: item.lng
        };
      });
      // console.log(points);
      return points;
    }
    // 2022-11-5 end
  },

  mounted() {
    var that = this;
    setTimeout(() => {
      that.initBaiduMap();
      that.listenEvent();
      // 创建鼠标绘制工具
      this.drawingManager = new BMapLib.DrawingManager(this.map, {
        // isOpen: true, //是否开启绘制模式
        enableCalculate: false, // 绘制是否进行测距(画线时候)、测面(画圆、多边形、矩形)
        drawingToolOptions: {
          enableTips: true,
          customContainer: "selectbox_Drawing",
          hasCustomStyle: true,
          offset: new BMap.Size(5, 5), // 偏离值
          scale: 0.8, // 工具栏缩放比例
          drawingModes: [
            BMAP_DRAWING_RECTANGLE,
            BMAP_DRAWING_POLYGON,
            BMAP_DRAWING_CIRCLE
          ]
        },
        enableSorption: true, // 是否开启边界吸附功能
        sorptionDistance: 20, // 边界吸附距离
        enableGpc: true, // 是否开启延边裁剪功能
        enbaleLimit: true, // 是否开启超限提示
        // limitOptions: {
        //     area: 50000000 // 面积超限值
        // },
        // circleOptions: this.styleOptions, // 圆的样式
        // polylineOptions: this.styleOptions, // 线的样式
        polygonOptions: this.styleOptions, // 多边形的样式
        rectangleOptions: this.styleOptions, // 矩形的样式
        labelOptions: this.labelOptions // label的样式
      });
      // 多边形画完之后的事件
      this.drawingManager.addEventListener(
        "polygoncomplete",
        this.polygonComplete
      );
    }, 900);
  },
  beforeDestroy() {
    this.offEvent();
    this.saveMap();
  }
};
</script>

<style></style>
