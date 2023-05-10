<template>
  <div :id="'google_' + mapName" style="height: 100%; width: 100%"></div>
</template>

<script>
import EditPointIcon from "@/assets/img/dot.svg";
import gpsHelper from "@/utils/gpsHelper.js";
import mapUtil from "@/utils/mapUtil.js";
// import MarkerWithLabel from "@/util/markerwithlabel.js";
let flightPath = null;
let markers = [];
export default {
  name: "GooleMapComp",
  props: {
    mapName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    map: null,
    pointMarker: [],
    pointMarkerData: [],
    selectMarker: null,
    infoBox: null,
    satelliteLayer: null,
    selectMarkerData: null,
    markersData: {},
    circleArea: null,
    circleAreaData: null,
    infoBoxData: null,
    googleMapType: "roadmap",
    mapLine: null,
    addMarkerData: "", //切换卫星时数据再次调用方法
    trackMarker: null, //切换卫星时可以再次实现marker的显示
    infoBoxWindowData: null,
    measureLine: [], //测量线点data
    lineLabel: [], //测量线距离标记Overlay
    distanceLine: null, //测量线Overlay
    runLine: null, //轨迹点
    scriptUrl: null,
    markers: {},
    polygonArea: null,
    polygon: null,
    shape: null,
    editPoints: [],
    playPathDate: null,
    addLineDate: []
  }),
  methods: {
    doremove() {
      if (this.mapLine) {
        console.log("chufa");
        this.mapLine.setMap(null);
        for (let i = 0; i < this.pointMarker.length; i++) {
          this.pointMarker[i].setMap(null);
        }
      }
    },
    removeCircle() {
      // 删除布防圆
      if (this.circleArea) {
        this.circleArea.setMap(null);
        this.circleArea = null;
      }
    },
    drawCircle(op) {
      this.circleAreaData = {
        lat: op.lat,
        lng: op.lng,
        radius: op.radius
      };
      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
      } else {
        pt = op;
      }
      if (this.circleArea) {
        this.circleArea.setCenter(pt);
        this.circleArea.setRadius(op.radius);
      } else {
        this.circleArea = new google.maps.Circle({
          center: { lat: pt.lat, lng: pt.lng },
          radius: op.radius,
          strokeColor: "#32cd32", //边线颜色。
          fillColor: "#00ff00", //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2, //边线的宽度，以像素为单位。
          strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        });
        this.circleArea.setMap(this.map);
      }
    },
    clearRunLine() {
      // 清除轨迹线
      if (this.runLine) {
        this.runLine.setMap(null);
        this.runLine = null;
      }
    },
    drawRunLine(op) {
      // 画轨迹线
      // console.log(op);
      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
      } else {
        pt = op;
      }
      if (this.runLine) {
        const path = this.runLine.getPath();
        path.push(new google.maps.LatLng(pt.lat, pt.lng));
        this.runLine.setOptions({
          visible: true,
          strokeColor: "#015313" //green
        });
        this.runLine.setPath(path);
      } else {
        var line = [];
        if (this.selectMarker) {
          line.push(this.selectMarker.getPosition());
        }
        line.push(new google.maps.LatLng(pt.lat, pt.lng));
        this.runLine = new google.maps.Polyline({
          path: line,
          strokeColor: "#015313",
          strokeWeight: 4,
          strokeStyle: "solid",
          strokeOpacity: 1
        });
        this.runLine.setMap(this.map);
      }
    },
    moveTheMarker(op) {
      // console.log(op);
      var marker, label;
      if (this.markers[op.title] && this.markersData[op.title]) {
        marker = this.markers[op.title];
      }
      if (marker) {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
        marker.setPosition(new google.maps.LatLng(pt.lat, pt.lng));
        const iconImage = {
          url: op.icon,
          anchor: new google.maps.Point(17, 17), //设置icon的样式的，别弄错了设置到marker中，导致不生效
          // rotation: op.rotation,
          rotation: 0,
          scaledSize: new google.maps.Size(32, 32)
        };
        marker.setOptions({ icon: iconImage, zIndex: 9999 });
      }
    },
    moveMarker(op) {
      // console.log(op);
      if (this.selectMarker) {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
        this.selectMarker.setPosition(new google.maps.LatLng(pt.lat, pt.lng));
        const iconImage = {
          url: op.icon,
          anchor: new google.maps.Point(17, 17), //设置icon的样式的，别弄错了设置到marker中，导致不生效
          // rotation: op.rotation,
          rotation: 0,
          scaledSize: new google.maps.Size(32, 32)
        };
        this.selectMarker.setOptions({ icon: iconImage, zIndex: 9999 });
      }
      // 更新设备的信息
    },

    setSelectMarker(op) {
      // console.log(op);
      // 选中的设备的坐标
      var data = op.data;
      var prop = op.prop;
      var marker = op.marker;
      if (marker) {
        this.selectMarker = marker;
        this.selectMarkerData = data;
      } else {
        var val = data[prop];
        if (this.markersData[val]) {
          this.selectMarkerData = this.markersData[val];
        }
      }
    },
    addMarker(op) {
      // console.log(op);
      this.addMarkerData = op;
      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
      } else {
        pt = op;
      }
      const iconType = {
        url: op.icon,
        anchor: new google.maps.Point(17, 17),
        size: new google.maps.Size(50, 50),
        // rotation: op.rotation,
        rotation: 0,
        scaledSize: new google.maps.Size(32, 32)
        // scaledSize: new google.maps.Size(36, 45),
      };
      this.selectMarker = new google.maps.Marker({
        position: new google.maps.LatLng(pt.lat, pt.lng),
        icon: iconType,
        zIndex: 999,
        map: this.map
      });
      // this.trackMarker 切换卫星时也是trackMarker
      this.selectMarker.addListener("click", () => {
        this.app.$emit("map-select-marker", op.data);
        this.app.$emit("show-device-position", op.data);
        this.selectMarkerData = op.data;
        this.setCenter(op);
      });
      this.markersData[op.data.deviceImei] = op.data;
      this.markers[op.data.deviceImei] = this.selectMarker;
      this.selectMarker.setMap(this.map);
    },
    updateInfoBox(op) {
      this.infoBoxWindowData = op;
      // console.log(op);
      // 更新信息框,
      var infoContent = op.infoContent,
        lat = op.lat,
        lng = op.lng;

      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(lat, lng);
        // console.log(pt);
      } else {
        pt = { lat: lat, lng: lng };
      }
      if (this.infoBox) {
        this.infoBox.setOptions({
          content: infoContent,
          position: new google.maps.LatLng(pt.lat, pt.lng),
          visible: true,
          zIndex: 9999
        });
      } else {
        const infobox = new google.maps.InfoWindow({
          content: infoContent,
          position: new google.maps.LatLng(pt.lat, pt.lng),
          zIndex: 9999
        });
        infobox.open(this.map);
        this.infoBox = infobox;
      }

      this.viewInfoBox(this.map);
    },
    viewInfoBox(map) {
      // 显示信息框
      if (this.infoBox) {
        this.infoBox.open(map);
      }
    },
    hideInfoBox() {
      // 隐藏信息框
      if (this.infoBox) {
        this.infoBox.close();
      }
    },
    getPointIcon(course) {
      var c = mapUtil.cnCourse1(course);
      return this.API.trackIcon + "arrow-" + c + ".png";
    },
    playPath(op) {
      this.playPathDate = op;
      // 回放箭头运动
      // console.log(this.googleMapType);
      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(op.lat, op.lng);
      } else {
        pt = { lat: op.lat, lng: op.lng };
      }
      if (this.selectMarker) {
        this.selectMarker.setPosition(new google.maps.LatLng(pt.lat, pt.lng));
        const iconImage = {
          url: this.getPointIcon(op.rotation),
          // size: new google.maps.Size(27, 27),
          // origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 17) //设置icon的样式的，别弄错了设置到marker中，导致不生效
        };
        this.selectMarker.setOptions({
          // 拿到图标的方向
          // icon: this.getPointIcon(op.rotation),
          icon: iconImage,
          // 纠正运动图标的偏移
          zIndex: 888999
        });
      }
    },
    addPoint(data) {
      // console.log(data);
      var data1 = JSON.parse(JSON.stringify(data));
      // 添加回放时标记点：起点，终点，停留点，超速点，运行点

      if (this.googleMapType == "roadmap") {
        var pt = this.parseBd2AmapPt(data.lat, data.lng);
      } else {
        pt = { lat: data.lat, lng: data.lng };
      }
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(pt.lat, pt.lng),
        icon: data.icon,
        title: data.title,
        zIndex: 110,
        rotation: data.rotation,
        tag: data.tag,
        map: this.map
        // anchor: new google.maps.Point(15, 30),
      });
      //
      // console.log(marker);
      // marker.setMap(this.map);
      //
      markers.push(marker);
      // this.setMapOnAll(this.map);
      if (data.tag == "run") {
        this.selectMarker = marker;
      } else {
        marker.addListener("click", () => {
          this.app.$emit("playback-point", data);
          this.setCenter(data);
        });
      }
      this.pointMarker.push(marker);
      this.pointMarkerData.push(data1);
    },
    setMapOnAll(map) {
      // 把所有的marker放到数组中
      this.map = map;
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(this.map);
      }
    },
    delPoint(op) {
      // console.log(op);
      // 删除指定类型的点
      var tag = op.tag;
      var i = 0;
      while (i < this.pointMarkerData.length) {
        if (this.pointMarkerData[i].tag == tag) {
          console.log("true");
          // this.map.removeOverlay(this.pointMarker[i]);
          this.pointMarker[i].setMap(null); //清除标记点
          this.pointMarker.splice(i, 1);
          this.pointMarkerData.splice(i, 1);
        } else {
          i++;
        }
      }
    },
    parseBd2AmapPt(lat, lng) {
      //将原始经纬度点转换为高德经纬度点（在国内使用）,在国外直接用原始坐标
      if (this.googleMapType == "roadmap") {
        // console.log("jiben");
        if (lat >= 4 && lat <= 53 && lng >= 90 && lng <= 135) {
          return gpsHelper.gcj_encrypt(lat, lng);
        } else {
          return { lat, lng };
        }
      } else {
        return { lat, lng };
      }
      // 直接的没考虑到国外是用另外一套api
      // return gpsHelper.gcj_encrypt(lat, lng);
    },
    parseBdArray2AmapArray(list) {
      var result = [];
      // console.log(this.googleMapType);
      for (var i = 0; i < list.length; i++) {
        var pt = this.parseBd2AmapPt(list[i].lat, list[i].lng);
        result.push(new google.maps.LatLng(pt.lat, pt.lng));
      }
      return result;
    },
    addLine(op) {
      this.addLineDate.push(op);
      // console.log("chufa", op);
      // 画轨迹线
      var line = op.line,
        color = op.color;
      var lines = this.parseBdArray2AmapArray(line);
      this.mapLine = new google.maps.Polyline({
        path: lines,
        geodesic: true, //测地线
        strokeColor: color,
        strokeWeight: 4,
        strokeStyle: "solid",
        strokeOpacity: 1
      });
      this.mapLine.setMap(this.map);
    },
    clearMap() {
      console.log("重新查询");
      // 清空地图

      if (this.selectMarker) {
        this.selectMarker.setMap(null);
      }
      if (this.infoBox) {
        this.infoBox.close(this.map);
      }
      if (this.mapLine) {
        this.mapLine.setMap(null);
      }
      for (let i = 0; i < this.pointMarker.length; i++) {
        this.pointMarker[i].setMap(null);
      }
      this.pointMarker = [];
      this.pointMarkerData = [];
    },
    setBounds(op) {
      // 设置边界
    },
    setViewPort(op) {
      // 调整地图缩放大小
      if (op.points.length != 0) {
        var pts = op.points;
        var start = pts[Math.floor(pts.length * 0.25)];
        var end = pts[Math.floor(pts.length * 0.75)];
        if (op.mapName == "playback") {
          // console.log("playback");
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
      }
    },
    setCenter(op) {
      // console.log(op);
      // 设置地图的中心经纬度
      var pt = this.parseBd2AmapPt(op.lat, op.lng);
      // this.map.setCenter(op.lat >= 90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180 ? new google.maps.LatLng(op.lat, op.lng) : this.map.getCenter());
      this.map.setCenter(new google.maps.LatLng(pt.lat, pt.lng));
    },
    setZoom(op) {
      // console.log(op);
      // 设置地图缩放大小
      this.map.setZoom(op.zoom ? op.zoom : this.map.getZoom());
    },
    //2021-7-31围栏start
    doMapClick(e) {
      // 监控地图上点击事件
      console.log(e);
      var latLanObj = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      this.app.$emit("map-click", { mapName: this.mapName, point: latLanObj });
    },
    doMapOver(e) {
      //监控地图鼠标移动事件
      var latLanObj = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      this.app.$emit("map-over", { mapName: this.mapName, point: latLanObj });
    },
    doMapRight(e) {
      console.log(e);
      var latLanObj = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      this.app.$emit("map-rightclick", {
        mapName: this.mapName,
        point: latLanObj
      });
    },
    onMapClick() {
      // 地图动作启动
      this.map.addListener("click", this.doMapClick);
      this.map.addListener("mousemove", this.doMapOver);
      this.map.addListener("rightclick", this.doMapRight);
    },
    offMapClick() {
      // 地图动作取消
      this.map.removeListener("click", this.doMapClick);
      this.map.removeListener("mousemove", this.doMapOver);
      this.map.removeListener("rightclick", this.doMapRight);
    },
    //
    addEditPoint(op) {
      // console.log(op);
      // 添加可移动点
      var that = this;
      var option = {
        url: op.icon,
        size: new google.maps.Size(16, 16),
        draggable: true
      };
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(op.lat, option.lng),
        icon: option,
        zIndex: 999,
        map: this.map
      });
      marker.addListener("dragend", function(e) {
        console.log(e.point);
        marker.setPosition(e.point);
        that.app.$emit("map-edit-point", {
          mapName: that.mapName,
          idx: op.idx,
          point: e.point,
          tag: op.tag
        });
      });
      if (op.tag == "point") {
        marker.addListener("rightclick", function(e) {
          that.map.$emit("map-edit-point-right", {
            mapName: that.mapName,
            idx: op.idx,
            point: e.point
          });
        });
      }
      marker.setMap(this.map);
      this.editPoints.push(marker);
    },
    clearEditPoint() {
      // 清除可移动点
      if (this.editPoints.length > 0) {
        for (var i = 0; i < this.editPoints.length; i++) {
          this.editPoints[i].setMap(null);
        }
        this.editPoints = [];
      }
    },
    drawPolygon(op) {
      // console.log(op);
      //画围栏多边形
      if (this.polygonArea) {
        this.polygonArea.setPath(op.points);
      } else {
        var pathList = [];
        this.polygon = new google.maps.Polygon({
          clickable: false,
          strokeColor: "blue",
          strokeWeight: 2,
          strokeOpacity: 0.5,
          visible: true,
          zIndex: 999
        });
        pathList.unshift(op.points);
        this.polygon.setPath(pathList);
        this.polygon.setMap(this.map);
        this.polygonArea = this.polygon;
      }
    },
    removePolygon() {
      //删除围栏多边形
      if (this.polygonArea) {
        this.map.removeOverlay(this.polygonArea);
        this.polygonArea = null;
      }
    },
    //2021-7-31围栏end
    initMap() {
      // 初始化地图
      var googleId = document.getElementById("google_" + this.mapName);
      // console.log(googleId);
      var myLatlng = new google.maps.LatLng(39.90923, 116.397428);
      var map = new google.maps.Map(googleId, {
        zoom: 11,
        center: myLatlng,
        mapTypeId: "roadmap",
        // 加卫星图
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false, //显示街景的小人头
        mapTypeControlOptions: {
          mapTypeIds: ["roadmap", "satellite"],
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
      });
      map.addListener("zoom_changed", () => {
        this.$emit("map-zoom", map.getCenter(), map.getZoom());
      });
      // 切换卫星时有点问题，坐标要取原始的，出现的了原先的清除不了。。。
      map.addListener("maptypeid_changed", () => {
        // 监听地图类型的变化
        this.googleMapType = map.mapTypeId;
        // console.log(this.googleMapType);
        // 地图类型切换时重新渲染，卫星使用的是原始的坐标
        if (this.mapName == "location") {
          if (this.selectMarker) {
            this.selectMarker.setMap(null);
            this.addMarker(this.addMarkerData);
            if (this.infoBoxWindowData) {
              this.updateInfoBox(this.infoBoxWindowData);
            }
            if (this.circleArea) {
              this.drawCircle(this.circleAreaData);
            }
            this.app.$emit("refresh-dev-list", {
              mapName: "location"
            });
          }
        }
        if (this.mapName == "playback") {
          if (this.playPathDate) {
            this.playPath(this.playPathDate);
          }
          if (this.infoBoxWindowData) {
            this.updateInfoBox(this.infoBoxWindowData);
          }
          if (this.mapLine) {
            this.mapLine.setMap(null);
          }
          if (this.pointMarker) {
            for (let i = 0; i < this.pointMarkerData.length; i++) {
              var item = this.pointMarkerData[i];
              for (let j = 0; j < this.pointMarker.length; j++) {
                var marker = this.pointMarker[j];
                if (item.title == marker.title) {
                  if (map.mapTypeId == "roadMap") {
                    var pt = this.parseBd2AmapPt(marker.lat, marker.lng);
                    marker.setPosition(new google.maps.LatLng(pt.lat, pt.lng));
                  } else {
                    marker.setPosition(
                      new google.maps.LatLng(marker.lat, marker.lng)
                    );
                  }
                }
              }
            }
          }
          // this.clearMap();
          this.doremove();
          setTimeout(() => {
            this.app.$emit("load-playback-line");
          }, 100);
        }
      });
      this.map = map;
    },
    showWeixing() {
      if (this.googleMapType == "roadmap") {
        this.map.setMapTypeId("satellite");
      } else {
        this.map.setMapTypeId("roadmap");
      }
    },
    saveMap() {
      if (this.map) {
        var data = {
          markersData: this.markersData,
          circleAreaData: this.circleAreaData,
          infoBoxData: this.infoBoxData,
          zoom: this.map.getZoom(),
          center: {
            lat: this.map.getCenter().lat(),
            lng: this.map.getCenter().lng()
          }
        };
        this.$emit("save-map", data);
      }
    },

    onMapOperation(op) {
      // console.log(op);
      // 地图操作选择器
      if (op.mapName == this.mapName) {
        var actions = {
          "do-remove": this.doremove,
          "add-point": this.addPoint, //添加点
          "hide-infobox": this.hideInfoBox,
          "show-infobox": this.updateInfoBox, //地图上显示信息框
          "del-point": this.delPoint,
          "set-center": this.setCenter,
          "set-zoom": this.setZoom,
          "add-line": this.addLine,
          "set-view-port": this.setViewPort,
          "clear-map": this.clearMap, //清除地图上的元素
          "play-path": this.playPath, //轨迹点运动
          "set-bounds": this.setBounds,
          "show-weixing": this.showWeixing, //显示卫星地图的切换
          "add-marker": this.addMarker, //设备添加到地图上
          "measure-line": this.measureDistance, //地图上自定义的测量工具
          "draw-run-line": this.drawRunLine, //画轨迹点
          "move-marker": this.moveMarker, //实时更新指定设备的位置
          "remove-circle": this.removeCircle, //移除布防圆
          "clear-run-line": this.clearRunLine, //清除轨迹点
          "draw-circle": this.drawCircle, //画布防圆
          "select-marker": this.setSelectMarker,
          "move-the-marker": this.moveTheMarker, //实时更新所有设备的位置信息
          "on-map-click": this.onMapClick,
          "off-map-click": this.offMapClick,
          "draw-polygon": this.drawPolygon,
          "add-edit-point": this.addEditPoint,
          "clear-edit-point": this.clearEditPoint
        };
      }
      actions[op.action] && actions[op.action](op);
    },
    listenEvent() {
      this.app.$on("map-operation", this.onMapOperation);
    },
    offEvent() {
      this.app.$off("map-operation", this.onMapOperation);
    },
    removeTags(tagName, tag) {
      // console.log("tagName", tagName);
      // console.log("tag", tag);
      let tagElements = document.getElementsByTagName(tagName);
      for (var m = 0; m < tagElements.length; m++) {
        if (tagElements[m].src == tag) {
          // console.log("a");
          tagElements[m].parentNode.removeChild(tagElements[m]);
        }
      }
    }
  },
  beforeCreate() {
    //1.AIzaSyC_3-YZ6lTspWX8j_cLI7IcL9OUu_lDnkQ 2.AIzaSyBhnBVTRF-i2BNqJOxzKwzdH-4zMQ2bgCY
    this.scriptUrl =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhnBVTRF-i2BNqJOxzKwzdH-4zMQ2bgCY&sensor=false&libraries=places&language=en-us"; //ztinfo
    // this.scriptUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyChOVmNjJx1yEFPCAOHqbyXf2VTj_uxw8Y&sensor=false&libraries=places&language=en-us";//测试
    var jsapi = document.createElement("script");
    // jsapi.charset = "utf-8";
    jsapi.defer = true;
    jsapi.async = true;
    jsapi.src = this.scriptUrl;
    document.head.appendChild(jsapi);
  },
  mounted() {
    setTimeout(() => {
      this.initMap();
      this.listenEvent();
      const google = new google.maps.Geocoder();
      // console.log(google);
    }, 500);
  },

  beforeDestroy() {
    // const scriptUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC_3-YZ6lTspWX8j_cLI7IcL9OUu_lDnkQ&sensor=false&libraries=places&language=en-us";
    // this.removeTags("script", scriptUrl);
    this.offEvent();
    this.saveMap();
  }
};
</script>

<style lang="scss">
.gm-style-mtc {
  // 把卫星控件隐藏
  // display: none !important;
}
.gm-style .gm-style-iw-c {
  background: transparent;
  box-shadow: none;
  top: 0px;
  left: -5px;
}
.gm-style .gm-style-iw-t::after {
  content: "";
  display: none !important;
}
.gm-ui-hover-effect {
  display: none !important;
}
.gm-style .gm-style-iw-d {
  overflow: hidden !important;
  padding: 15px;
}

.gm-style .gm-style-mtc {
  left: unset !important;
  right: 45px !important;
  width: 90px !important;
  button {
    width: 100%;
    padding: 4px 10px !important;
    font-size: 14px !important;
  }
  ul {
    width: 100%;
  }
  ul > li {
    font-size: 14px !important;
  }
}

:focus {
  // outline: -webkit-focus-ring-color auto 5px;
  // 删除谷歌地图中点击出现的蓝色边框
  outline: none !important;
}
.gm-style .gm-style-iw-tc::after {
  background: transparent !important;
}
</style>
