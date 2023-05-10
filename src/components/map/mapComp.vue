<template>
  <div :id="'open_street_' + mapName" style="height: 100%; width: 100%">
    <div class="celiang-box">
      <a
        :class="['button-btn-m', currentMeasure == 0 ? 'cur' : '']"
        data-index="0"
        @click="domesureLong"
      >
        <i class="iconfont icon-chizi_o"></i>
      </a>
      <a
        :class="['button-btn-m', currentMeasure == 1 ? 'cur' : '']"
        data-index="0"
        @click="domesureMain"
      >
        <i class="iconfont icon-mianji"></i>
      </a>
    </div>
  </div>
</template>

<script>
import mapUtil from "@/utils/mapUtil.js";
import gpsHelper from "@/utils/gpsHelper.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dingweitubiao from "@/assets/img/dingweitubiao.png";
import "@/utils/openStreetMapRotate";
let myLayerGroup = new L.LayerGroup();
let myPolyline = new L.LayerGroup();
let myMarkerMeasure = new L.LayerGroup();
let newMeasureValue = new L.LayerGroup();
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import dotIcon from "@/assets/img/dot.svg";

import "leaflet.chinatmsproviders";
export default {
  name: "OpenStreetMapComp",
  props: {
    mapName: {
      type: String,
      default: ""
    },
    mapUrl: {
      type: String,
      default: "Geoq.Normal.Map"
    }
  },
  data: () => ({
    map: null,
    option: {
      //leaflet.pm配置项
      position: "topleft",
      drawPolygon: true, // 添加绘制多边形
      drawMarker: false, //添加按钮以绘制标记
      drawCircleMarker: true, //添加按钮以绘制圆形标记
      drawPolyline: true, //添加按钮绘制线条
      drawRectangle: true, //添加按钮绘制矩形
      drawCircle: true, //  添加按钮绘制圆圈
      editMode: true, //  添加按钮编辑多边形
      dragMode: true, //   添加按钮拖动多边形
      cutPolygon: true, // 添加一个按钮以删除图层里面的部分内容
      removalMode: true // 清除图层
    },
    layers: null,
    pointMarker: [],
    pointMarkerData: [],
    selectMarker: null,
    infoBox: null,
    satelliteLayer: null,
    selectMarkerData: null,
    markersData: {},
    circleArea: null,
    circleAreaData: null, //画区域圆
    infoBoxData: null,
    runLine: null,
    measureLine: [], //测量线点data
    lineLabel: [], //测量线距离标记Overlay
    distanceLine: null, //测量线Overlay
    rulerLine: null,
    selectLabel: null,
    lat: "",
    lng: "",
    markers: {},
    oprotation: "",
    targetImei: "",
    mouseTools: null, //测量工具
    polylineList: null,
    isDrawing: false, //是否正在绘制
    measureresult: 0, //侧量的结果
    drawPolylinePoints: [],
    measureValue: null,
    measureObj: null,
    drawControl: null,
    drawItems: null,
    currentMeasure: -1,
    mapType: "a-map"
  }),
  watch: {
    mapUrl() {
      this.saveMap();
      this.map.removeLayer(this.layers);
      this.$nextTick(() => {
        this.layers = this.chinaLayers(this.map, this.mapUrl);
      });
      // console.log('this.mapUrl', this.mapUrl)
      switch (this.mapUrl) {
        case "Geoq.Normal.Map":
          this.mapType = "zhineng-map";
          break;
        case "TianDiTu.Satellite.Map":
        case "TianDiTu.Normal.Map":
          this.mapType = "tiandi-map";
          break;
        case "GaoDe.Satellite.Map":
        case "GaoDe.Normal.Map":
        case "GaoDe.Satellite.Annotion":
          this.mapType = "a-map";
          break;
        case "OSM.Normal.Map":
          this.mapType = "open-street-map";
          break;
        case "Tencent.Normal.Map":
          this.mapType = "tencent-map";
          break;
        case "Google.Normal.Map":
        case "Google.Satellite.Map":
          this.mapType = "google-map";
          break;
        case "Baidu.Normal.Map":
        case "Baidu.Satellite.Annotion":
          this.mapType = "baidu-map";
          break;
      }
    }
  },
  methods: {
    parseBd2AmapPt(op) {
      // 转换坐标
      switch (this.mapType) {
        case "a-map":
        case "zhineng-map":
          var pt = gpsHelper.gcj_encrypt(op.lat, op.lng);
          return { lat: pt.lat, lng: pt.lng };
        case "google-map":
          var pt1 = gpsHelper.gcj_encrypt(op.lat, op.lng);
          return { lat: pt1.lat, lng: pt1.lng };
        case "google-map1":
          return { lat: op.lat, lng: op.lng };
        case "baidu-map":
          var pt2 = gpsHelper.wgs_gcj02_bdpt(op.lat, op.lng);
          return { at: pt2.lat, lng: pt2.lng };
        default:
          return { lat: op.lat, lng: op.lng };
      }
    },
    addMarker(op) {
      // console.log(op);
      let iconArr = [32, 32];
      // if (this.mapName == "homepage") {
      //   iconArr = [36, 36];
      // } else {
      //   iconArr = [36, 45];
      // }
      const theIcon = L.icon({
        iconUrl: op.icon,
        iconSize: iconArr
        // iconAnchor: [22, 94],
        // popupAnchor: [-3, -76],
      });
      var pt = this.parseBd2AmapPt(op);
      const marker = L.marker([pt.lat, pt.lng], {
        icon: theIcon,
        title: op.data.deviceImei,
        // rotationAngle: op.rotation,
        rotationAngle: 0
      });
      marker.on("click", () => {
        // console.log("dianji", op.data);
        this.app.$emit("map-select-marker", op.data);
        this.selectMarker = marker;
        this.selectMarkerData = op.data;
        this.setCenter(op);
        this.updateInfoBox(this.infoBoxData);
      });
      this.markers[op.data.deviceImei] = marker;
      this.markersData[op.data.deviceImei] = op.data;
      this.selectMarker = marker;
      // marker.addTo(this.map);
      myLayerGroup.addLayer(marker);
      this.map.addLayer(myLayerGroup);
      return marker;
    },
    moveMarker(op) {
      // 更新单台运动中的设备
      // console.log(op);
      // console.log("selectMarker", this.selectMarker);
      var pt = this.parseBd2AmapPt(op);
      let iconArr = [32, 32];
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setLatLng([pt.lat, pt.lng]);
        }
        if (op.icon) {
          const theIcon = L.icon({
            iconUrl: op.icon,
            iconSize: iconArr
          });
          this.selectMarker.setIcon(theIcon);
        }
        if (op.title) {
          this.selectMarker.title(op.title);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          // this.selectMarker.setRotationAngle(op.rotation);
          this.selectMarker.setRotationAngle(0);
          // this.oprotation = op.rotation;
          this.oprotation = 0;
          this.targetImei = op.deviceImei;
        }
      }
    },
    moveTheMarker(op) {
      // 更新整体的设备的更新
      // console.log(op);
      var pt = this.parseBd2AmapPt(op);
      let iconArr = [32, 32];
      let marker;
      if (this.markers[op.title] && this.markersData[op.title]) {
        marker = this.markers[op.title];
      }
      if (marker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          marker.setLatLng([pt.lat, pt.lng]);
        }
        if (op.icon) {
          const theIcon = L.icon({
            iconUrl: op.icon,
            iconSize: iconArr
          });
          marker.setIcon(theIcon);
        }
        if (op.title) {
          // marker.title(op.title);
        }
        // console.log("marker", marker);
        if (op.rotation < 360 && op.rotation >= 0) {
          // marker.setRotationAngle(op.rotation);
          marker.setRotationAngle(0);
          if (op.title == this.targetImei) {
            // marker.setRotationAngle(op.rotation);
            marker.setRotationAngle(0);
          }
        }
      }
    },
    setSelectMarker(op) {
      // 选中设备坐标
      var data = op.data;
      var prop = op.prop;
      var marker = op.marker;
      if (marker) {
        this.selectMarker = marker;
        this.selectMarkerData = marker;
      } else {
        var val = data[prop];
        if (this.markersData[val]) {
          this.selectMarkerData = this.markersData[val];
        }
      }
    },
    updateInfoBox(op) {
      // console.log("info", op);
      if (!op) {
        return;
      }
      // 更新信息框；
      var pt = this.parseBd2AmapPt(op);
      if (this.infoBox) {
        this.infoBox.setContent(op.infoContent);
        this.infoBox.setLatLng([pt.lat, pt.lng]);
        this.infoBox.openOn(this.map);
        // this.infoBox.setOffset(op.offsetX, op.offsetY);
      } else {
        var popup = L.popup({
          maxWidth: 200,
          minWidth: 100,
          className: "sample-popup",
          autoClose: true,
          closeOnClick: false,
          autoPan: false
        })
          .setContent(op.infoContent)
          .setLatLng([pt.lat, pt.lng])
          .openOn(this.map);
        // popup.setStyle(op.style);
        this.infoBox = popup;
      }
      this.viewInfoBox();
    },
    hideInfoBox() {
      //隐藏信息框
      if (this.infoBox) {
        this.infoBox.close();
      }
    },
    viewInfoBox() {
      //显示信息框
      if (this.infoBox) {
        this.infoBox.openOn(this.map);
      }
    },
    drawCircle(op) {
      // 画不方圆
      var pt = this.parseBd2AmapPt(op);
      this.circleAreaData = {
        lat: op.lat,
        lng: op.lng,
        radius: op.radius
      };
      if (this.circleArea) {
        this.circleArea.setLatLng([pt.lat, pt.lng]);
        this.circleArea.setRadius(op.radius);
      } else {
        this.circleArea = L.circle([pt.lat, pt.lng], {
          radius: op.radius,
          opacity: 0.8,
          color: "#32cd32",
          stroke: true,
          weight: 3,
          fillColor: "#00ff00",
          fillOpacity: 0.5
        });
        this.circleArea.addTo(this.map);
      }
    },
    removeCircle() {
      // 删除布防圆
      if (this.circleArea) {
        this.circleArea.remove();
        this.circleArea = null;
      }
    },
    setCenter(op) {
      // console.log(op);
      //设置地图中心
      var pt = this.parseBd2AmapPt(op);
      this.map.panTo(
        op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180
          ? L.latLng(pt.lat, pt.lng)
          : this.map.getCenter()
      );
    },
    setZoom(op) {
      // console.log("zoom", op);
      //设置地图缩放大小
      if (!op.mapName == "location") {
        this.map.setZoom(op.zoom ? op.zoom : this.map.getZoom());
      }
    },
    setViewPort(op) {
      // console.log("setViewPort", op);
      //调整地图缩放大小
      if (op.points.length != 0) {
        var pts = op.points;
        var start = pts[Math.floor(pts.length * 0.25)];
        var end = pts[Math.floor(pts.length * 0.75)];
        let lat, lng;
        if (op.mapName == "playback") {
          lat = (start.realPt.lat + end.realPt.lat) / 2;
          lng = (start.realPt.lng + end.realPt.lng) / 2;
          this.map.setView([lat, lng], 12);
        } else {
          lat = (start.lat + end.lat) / 2;
          lng = (start.lng + end.lng) / 2;
          this.map.setView([lat, lng], 12);
        }
      }
    },
    clearRunLine() {
      // 清除跟踪轨迹线
      if (this.runLine) {
        this.runLine.remove();
        this.runLine = null;
      }
    },
    drawRunLine(op) {
      // 画跟踪轨迹线
      var pt = this.parseBd2AmapPt(op);
      if (this.runLine) {
        // console.log("runline", this.runLine);
        this.runLine.addLatLng([pt.lat, pt.lng]);
        this.runLine.setStyle({ color: "#008000" });
      } else {
        let line = [];
        if (this.selectMarker) {
          line.push(this.selectMarker.getLatLng());
        }
        console.log("line", line);
        line.push([pt.lat, pt.lng]);
        this.runLine = L.polyline(line, {
          color: "#008000",
          weight: 4,
          opacity: 1
        });
        this.runLine.addTo(this.map);
        this.map.fitBounds(this.runLine.getBounds());
      }
    },
    addLine(op) {
      // 画轨迹线
      // console.log("op", op);
      this.polylineList = L.polyline(op.line, {
        color: op.color,
        weight: 4,
        opacity: 1
      });
      // this.polylineList.addTo(this.map);
      // this.map.addLayer(this.polylineList);
      myPolyline.addLayer(this.polylineList);
      this.map.addLayer(myPolyline);
    },
    playPath(op) {
      // 回放时箭头的运动
      var pt = this.parseBd2AmapPt(op);
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setLatLng([pt.lat, pt.lng]);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          this.selectMarker.setRotationAngle(op.rotation - 90);
        }
      }
    },
    addPoint(data) {
      // console.log("data", data);
      // 添加回放的标记点：起点，终点，停留点，超速点，运行点
      var theIcon = null;

      if (data.tag == "run") {
        theIcon = L.icon({
          iconUrl: data.icon,
          iconAnchor: [19, 16]
          // popupAnchor: [38, 38],
        });
      } else {
        theIcon = L.icon({
          iconUrl: data.icon,
          iconAnchor: [16, 44]
          // iconSize: [27, 42],
        });
      }
      var pt = this.parseBd2AmapPt(data);
      var marker = L.marker([pt.lat, pt.lng], {
        icon: theIcon,
        title: data.title,
        rotationAngle: data.rotation
      });
      if (data.tag == "run") {
        this.selectMarker = marker;
      } else {
        marker.on("click", () => {
          this.app.$emit("playback-point", data);
          this.setCenter(data);
        });
      }
      myLayerGroup.addLayer(marker);
      this.map.addLayer(myLayerGroup);
      this.pointMarker.push(marker);
      this.pointMarkerData.push(data);
    },
    delPoint(op) {
      // 删除指点类型的点
      let tag = op.tag;
      let i = 0;
      while (i < this.pointMarkerData.length) {
        if (this.pointMarkerData[i].tag == tag) {
          this.pointMarker[i].remove();
          this.pointMarker.splice(i, 1);
          this.pointMarkerData.splice(i, 1);
        } else {
          i++;
        }
      }
    },
    clickListener(e) {
      // console.log("chufa", e);
      this.isDrawing = true; //是否正在绘制
      this.drawPolylinePoints.push(e.latlng); //绘制的折线的节点集
      //测量结果加上距离上个点的距离
      if (this.drawPolylinePoints.length > 1) {
        this.measureresult += e.latlng.distanceTo(
          this.drawPolylinePoints[this.drawPolylinePoints.length - 2]
        );
      }

      //绘制的折线添加进集合
      this.distanceLine.addLatLng(e.latlng);
      var distance =
        this.measureresult +
        e.latlng.distanceTo(
          this.drawPolylinePoints[this.drawPolylinePoints.length - 1]
        );
      const theIcon = L.icon({
        iconUrl: dingweitubiao,
        iconAnchor: [14, 41],
        iconSize: [28, 41]
      });
      var marker = L.marker(e.latlng, {
        draggable: false,
        icon: theIcon
      });
      //标记绑定弹窗显示
      marker.bindPopup((distance / 1000).toFixed(2) + "km").openPopup();
      //地图上添加标记
      myMarkerMeasure.addLayer(marker);
      this.map.addLayer(myMarkerMeasure);

      //地图添加鼠标移动事件
      this.map.on("mousemove", this.moveListener);
    },
    moveListener(e) {
      //测量点的最后一点跟随移动
      if (this.isDrawing) {
        //是否正在绘制
        //将上次的移除
        if (this.measureLine != undefined && this.measureLine != null) {
          //绘制过程中的折线
          this.map.removeLayer(this.measureLine);
        }
        //获取上个点坐标
        var prevPoint = this.drawPolylinePoints[
          this.drawPolylinePoints.length - 1
        ];
        var shapeOptions = {
          color: "#F54124",
          weight: 3,
          opacity: 0.8,
          fill: false,
          clickable: true
        };
        //绘制最后一次的折线
        this.measureLine = new L.Polyline([prevPoint, e.latlng], shapeOptions);
        //添加到地图
        this.map.addLayer(this.measureLine);
        //累加距离
      }
    },
    measureDistance() {
      this.isDrawing = false; //是否正在绘制
      this.drawPolylinePoints = []; //绘制的折线的节点集
      this.measureresult = 0; //测量结果
      this.map.getContainer().style.cursor = "crosshair";
      var shapeOptions = {
        color: "#F54124",
        weight: 3,
        opacity: 0.8,
        fill: false,
        clickable: true
      };
      //绘制的折线
      this.distanceLine = new L.Polyline([], shapeOptions);
      //地图上添加折线
      this.map.addLayer(this.distanceLine);
      //设置地图的鼠标按下事件
      this.map.on("mousedown", this.clickListener);
      //设置地图的双击事件
      this.map.on("dblclick", onDoubleClick);
      var that = this;
      //鼠标双击事件
      function onDoubleClick(e) {
        that.map.getContainer().style.cursor = "";
        if (that.isDrawing) {
          //清除上次的
          if (that.measureLine != undefined && that.measureLine != null) {
            that.map.removeLayer(that.measureLine);
            that.measureLine = null;
          }
          that.drawPolylinePoints = [];
          that.isDrawing = false;
          //移除事件
          that.map.off("mousedown", that.clickListener);
          that.map.off("mousemove", that.moveListener);
          that.map.off("dblclick");
        }
      }
    },
    offMeasureLine() {
      // 关闭清除测量工具的画线和图标
      // console.log("chufaaaaaaaaa");
      // 关闭测量线
      this.map.off("click", this.clickListener);
      this.map.off("mousemove", this.moveListener);
      //清除上次的
      if (this.distanceLine != undefined && this.distanceLine != null) {
        this.map.removeLayer(this.distanceLine);
        this.measureLine = [];
        this.distanceLine = null;
        this.drawPolylinePoints = [];
        this.isDrawing = false;
      }
      myMarkerMeasure.clearLayers();
    },
    clearMap() {
      // console.log("chufa");
      // 清空地图
      this.pointMarker = [];
      this.pointMarkerData = [];
      this.markers = [];
      this.markersData = [];
      if (this.runLine) {
        this.runLine.remove();
      }

      if (this.polylineList) {
        myPolyline.clearLayers();
        this.polylineList = null;
      }
      // 隐藏信息框
      if (this.infoBox) {
        this.infoBox.close();
        this.infoBox.remove();
        this.infoBox = null;
      }
      //
      if (this.selectMarker) {
        this.selectMarker.remove();
        this.selectMarker = null;
      }
      this.removeCircle();
      myLayerGroup.clearLayers();
    },
    initMap() {
      console.log(`open_street_${this.mapName}`);
      let map = L.map(`open_street_${this.mapName}`, {
        center: [23.061977, 113.392585], // 地图中心
        minZoom: 0,
        maxZoom: 20,
        zoom: 10,
        zoomControl: true, //禁用 + - 按钮
        doubleClickZoom: true, // 禁用双击放大
        attributionControl: true, // 移除右下角leaflet标识
        dragging: true, //禁止鼠标拖动滚动
        boxZoom: true, //决定地图是否可被缩放到鼠标拖拽出的矩形的视图，鼠标拖拽时需要同时按住shift键.
        scrollWheelZoom: true, //禁止鼠标滚动缩放
        zoomSnap: 0.5, //地图能放缩的zoom的最小刻度尺度，默认值1
        fullscreenControl: true //全屏控件，不显示
      });
      L.control.scale().addTo(map);
      this.map = map;
      // this.map.pm.setLang("zh"); //设置语言  en, de, it, ru, ro, es, fr, pt_br, zh , nl
      // this.map.pm.addControls(this.option); //添加工具
      // let name = L.tileLayer("http://mt0.google.cn/vt/lyrs=y@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga").addTo(this.map);

      // 2023-2-24
      // 判断是哪个地图
      let optionsKey;
      switch (this.mapType) {
        case "a-map":
          return (optionsKey = "b8dca57bcd955bef13a12fb3ec87cfda");
        case "google-map":
          return (optionsKey = "AIzaSyC_3-YZ6lTspWX8j_cLI7IcL9OUu_lDnkQ");
        case "baidu-map":
          return (optionsKey = "EyqLUW841v6hI9NtcjEbrwkVi77xuakF");
        case "tiandi-map":
          return (optionsKey = "e0766baa6d0e1af290ec170ca842ae86");
      }
      // 加载各种地图
      this.layers = this.chinaLayers(this.map, this.mapUrl, {
        key: optionsKey
      });
      // end
      //添加创建地图的函数 2023-2-24注释，为了渲染多个地图
      // const createTileLayer = (map, url, options) => {
      //   let tileLayer = L.tileLayer(url, options);
      //   tileLayer.addTo(map);
      //   return tileLayer;
      // };
      // createTileLayer(
      //   this.map,
      //   "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      //   {
      //     attribution:
      //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      //   }
      // );
      this.addMeasureTools();
      this.map.on("zoomend", () => {
        // console.log("dads");
        this.$emit("map-zoom", this.map.getCenter(), this.map.getZoom());
      });
    },
    chinaLayers(map, url, option) {
      let chinaLayers = L.tileLayer.chinaProvider(url, option);
      chinaLayers.addTo(map);
      return chinaLayers;
    },
    removeDrawItem() {
      // 清除地图上的画线标识
      if (this.measureObj) {
        this.map.removeLayer(this.measureValue);
        newMeasureValue.clearLayers();
        this.drawItems.clearLayers();
      }
    },
    domeasureDraw() {
      //画图创建事件
      var lastLatLng;
      var allLatLng;
      var that = this;
      this.map.on(L.Draw.Event.CREATED, event => {
        console.log("event", event);
        const { layer, layerType } = event;

        allLatLng = layer.getLatLngs();
        var allLatLngList = JSON.parse(JSON.stringify(allLatLng))[0];
        var start = allLatLngList[Math.floor(allLatLngList.length * 0.25)];
        var end = allLatLngList[Math.floor(allLatLngList.length * 0.75)];
        lastLatLng = layer.getLatLngs()[layer.getLatLngs().length - 1];
        if (layerType === "polygon") {
          //layer.getLatLngs()得到的多边形的经纬度集合，多边形得到的是一个二维数组，这里要取里面的数组，一定要注意
          let lat, lng;
          lat = (start.lat + end.lat) / 2;
          lng = (start.lng + end.lng) / 2;
          //一个自定义的计算面积的函数

          let area = that.formatArea(allLatLng[0]);
          console.log("area", area);
          that.addMeasureMarker(area, [lat, lng]); //把画图之后计算的结果添加到地图上
        } else if (layerType === "polyline") {
          //polyline得到的是一个一维数组，直接使用
          //一个自定义的计算长度的函数
          let distance = that.formatLength(allLatLng);
          that.addMeasureMarker(distance, [lastLatLng.lat, lastLatLng.lng]);
        }
        // drawGroup,groupLayer,把画图的图层添加到图层组方便管理
        that.drawItems.addLayer(layer);
        this.map.addLayer(layer);
      });
    },
    domesureLong() {
      // 开始测距
      if (this.currentMeasure == 0) {
        this.currentMeasure = -1;
        this.measureObj.disable();
        this.removeDrawItem();
      } else {
        this.currentMeasure = 0;
        this.removeDrawItem();
        this.$nextTick(() => {
          this.measureObj = new L.Draw.Polyline(
            this.map,
            this.drawControl.options.draw.polyline
          );
          this.measureObj.enable();
          this.domeasureDraw();
        });
      }
    },
    domesureMain() {
      // 开始侧面
      if (this.currentMeasure == 1) {
        this.currentMeasure = -1;
        this.measureObj.disable();
        this.removeDrawItem();
      } else {
        this.currentMeasure = 1;
        this.removeDrawItem();
        this.$nextTick(() => {
          this.measureObj = new L.Draw.Polygon(
            this.map,
            this.drawControl.options.draw.polygon
          );
          this.measureObj.enable();
          this.domeasureDraw();
        });
      }
    },
    addMeasureTools() {
      // 添加上测量的工具
      // 添加绘制层
      this.drawItems = new L.FeatureGroup();
      this.map.addLayer(this.drawItems);
      this.drawControl = new L.Control.Draw({
        draw: {
          //绘制线
          polyline: true,
          //绘制多边形
          polygon: true,
          //绘制矩形
          rectangle: false,
          //绘制圆
          circle: false,
          //绘制标注
          marker: false,
          //绘制圆形标注
          circlemarker: false
        },
        edit: {
          //绘制图层
          featureGroup: this.drawItems,
          //图形编辑控件
          edit: true,
          //图形删除控件
          remove: true
        }
      });
      // L.drawLocal.draw.handlers.polyline = {
      //   tooltip: {
      //     start: "点击地图开始画线",
      //     cont: "继续选择",
      //     end: "双击完成绘制",
      //   },
      // };
      // L.drawLocal.draw.handlers.polygon = {
      //   tooltip: {
      //     start: "点击地图开始绘制多边形",
      //     cont: "继续选择",
      //     end: "点击第一个顶点完成绘制",
      //   },
      // };
      // 添加上绘制控件
      this.map.addControl(this.drawControl);
      //
    },
    addMeasureMarker(value, latlng) {
      // console.log("value", value);
      // var popup = L.popup().setLatLng(latlng).setContent(value).openOn(this.map);
      const theIcon = L.icon({
        iconUrl: dotIcon,
        iconSize: [10, 10]
      });
      this.measureValue = L.marker(latlng, {
        icon: theIcon,
        draggable: true
      })
        .addTo(this.map)
        .bindTooltip(value, {
          direction: "right",
          permanent: true,
          className: "show-tooltip",
          offset: [10, -5]
        });
      newMeasureValue.addLayer(this.measureValue);
      this.map.addLayer(newMeasureValue);
    },
    // 获取面积
    /**
     * polygon [{lat:30,lng:104},{lat:30,lng:104},{lat:30,lng:104}]
     */
    formatArea(polygon) {
      // console.log("polygon", L.GeometryUtil.geodesicArea(polygon));
      //L.GeometryUtil.geodesicArea(),返回number类型的数据，单位是平方米，这里做了一下转化
      var seeArea = L.GeometryUtil.geodesicArea(polygon);
      let area = (seeArea / 10e5).toFixed(2) + "k㎡";
      return area;
    },
    // 获取长度
    /**
     * line[{lat:30,lng:104},{lat:30,lng:104},{lat:30,lng:104}]
     */
    formatLength(line) {
      let dis = 0;
      for (let i = 0; i < line.length - 1; i++) {
        let start = line[i];
        let end = line[i + 1];
        dis += L.latLng([start.lat, start.lng]).distanceTo([end.lat, end.lng]); //计算两个点之间的距离，并累加
      }
      //结果得到的也是number类型，单位是 米
      return (dis / 10e2).toFixed(2) + "km";
    },

    saveMap() {
      if (this.map) {
        let data = {
          markersData: this.markersData,
          circleAreaData: this.circleAreaData,
          infoBoxData: this.infoBoxData,
          zoom: this.map.getZoom(),
          center: {
            lat: this.map.getCenter().lat,
            lng: this.map.getCenter().lng
          }
        };
        // console.log("data", data);
        this.$emit("save-map", data);
      }
    },
    onMapOperation(op) {
      // console.log(op);
      if (op.mapName == this.mapName) {
        const actions = {
          "add-marker": this.addMarker,
          "move-marker": this.moveMarker,
          "set-center": this.setCenter,
          "set-zoom": this.setZoom,
          "move-the-marker": this.moveTheMarker,
          "select-marker": this.setSelectMarker,
          "show-infobox": this.updateInfoBox,
          "hide-infobox": this.hideInfoBox,
          "draw-circle": this.drawCircle,
          "remove-circle": this.removeCircle,
          "set-view-port": this.setViewPort,
          "clear-run-line": this.clearRunLine,
          "draw-run-line": this.drawRunLine,
          "add-line": this.addLine,
          "clear-map": this.clearMap,
          "add-point": this.addPoint,
          "del-point": this.delPoint,
          "play-path": this.playPath,
          "measure-line": this.measureDistance,
          "off-measure-line": this.offMeasureLine
        };
        actions[op.action] && actions[op.action](op);
      }
    },
    listenEvent() {
      this.app.$on("map-operation", this.onMapOperation);
    },
    offEvent() {
      this.app.$off("map-operation", this.onMapOperation);
    }
  },
  mounted() {
    setTimeout(() => {
      this.initMap();
      this.listenEvent();
    }, 1000);
  },
  beforeDestroy() {
    this.offEvent();
    this.saveMap();
  }
};
</script>

<style lang="scss">
.leaflet-pane > svg path.leaflet-interactive,
svg.leaflet-image-layer.leaflet-interactive path {
  stroke: rgb(51, 136, 255);
  stroke-opacity: 1;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  // fill: rgb(51, 136, 255);
  // fill-opacity: 0.2;
  // fill-rule: evenodd;
}
.button-btn-m.cur {
  background: #3038e3;
  color: #fff;
}
.leaflet-draw {
  display: none !important;
}
.celiang-box {
  position: absolute;
  left: 10px;
  top: 90px;
  z-index: 999;
  border: 2px solid rgba(0, 0, 0, 0.2);
  a {
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    width: 30px;
    height: 30px;
    line-height: 30px;
    display: block;
    text-align: center;
    text-decoration: none;
    color: black;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    // font: bold 18px "Lucida Console", Monaco, monospace;
    // text-indent: 1px;
  }
}
.sr-only {
  display: none;
}
.leaflet-div-icon {
  background: #fff;
  border: 1px solid #666;
  height: 10px !important;
  width: 10px !important;
  margin-left: -6px !important;
}
.sample-popup {
  .leaflet-popup-close-button {
    display: none !important;
  }
  .device-label.active {
    // bottom: unset;
    bottom: 14px;
    left: unset;
    margin-left: unset;
    &::before {
      content: unset;
    }
    &::after {
      content: unset;
    }
  }
  .leaflet-popup-content {
    position: relative;
    margin: 5px 5px 5px 8px;
  }
}
.leaflet-bottom {
  position: absolute;
  z-index: 998 !important;
  pointer-events: none;
}
.home-page-content {
  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: unset !important;
    box-shadow: unset !important;
  }
  .device-label.active {
    // bottom: unset;
    // left: unset;
    // margin-left: unset;
    &::before {
      content: unset;
    }
    &::after {
      // content: "";
      // left: calc(50% - 12px);
    }
  }
}
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: unset !important;
  box-shadow: unset !important;
}
</style>
