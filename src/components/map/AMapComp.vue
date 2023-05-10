<template>
  <!-- <div style="height: 100%;width: 100%;"> -->
  <div :id="'amap_' + mapName" style="height: 100%;width: 100%;"></div>
  <!-- <div id="panel"></div> -->
  <!-- </div> -->
</template>

<script>
import gpsHelper from "@/utils/gpsHelper.js";
import mapUtil from "@/utils/mapUtil.js";
import MapLoader from "@/utils/loadMap.js";
export default {
  name: "AMapComp",
  props: {
    mapName: {
      type: String,
      default: ""
    },
    isSatellite: {
      type: Boolean,
      default: false
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
    circleAreaData: null, //画区域圆
    infoBoxData: null,
    runLine: null,
    measureLine: [], //测量线点data
    lineLabel: [], //测量线距离标记Overlay
    distanceLine: null, //测量线Overlay
    rulerLine: null,
    markerLabels: {},
    selectLabel: null,
    lat: "",
    lng: "",
    markers: {},
    oprotation: "",
    targetImei: "",
    mouseTools: null, //测量工具
    polygonArea: null, //多边形
    editPoints: [],
    trackLine: [], //取点
    trackLineOverLay: null,
    startPointMarker: null,
    lastPointMarker: null,
    driving: null,
    planPolyline: null,
    circuitInfoBox: null,
    polyline: null
  }),
  watch: {
    //显示或隐藏卫星地图
    isSatellite() {
      if (this.isSatellite) {
        this.satelliteLayer.show();
      } else {
        this.satelliteLayer.hide();
      }
    }
  },
  methods: {
    // 2022-6-20 start
    drawPolygon(op) {
      // console.log(op);
      // 画多边形 points
      if (this.polygonArea) {
        // console.log("polygonArea", this.polygonArea);
        let pathLine = [];
        for (let i = 0; i < op.points.length; i++) {
          pathLine.push(new AMap.LngLat(op.points[i].lng, op.points[i].lat));
        }
        // console.log("pathLine", pathLine);
        // return;
        this.polygonArea.setPath(pathLine);
      } else {
        // console.log("op", op);
        let pathLine1 = [];
        for (let i = 0; i < op.points.length; i++) {
          pathLine1.push(new AMap.LngLat(op.points[i].lng, op.points[i].lat));
        }
        var polygon = new AMap.Polygon({
          path: pathLine1,
          strokeColor: "#00ff00",
          strokeWeight: 3,
          strokeOpacity: 0.5,
          fillOpacity: 0.4,
          zIndex: 50,
          bubble: true
        });
        this.map.add(polygon);
        this.polygonArea = polygon;
      }
    },
    removePolygon() {
      // 删除多边形
      if (this.polygonArea) {
        this.map.remove(this.polygonArea);
        this.polygonArea = null;
      }
    },
    doMapClick(e) {
      // console.log(e);
      this.app.$emit("map-click", { mapName: this.mapName, point: e.lnglat });
    },
    doMapOver(e) {
      // 监控地图鼠标移动事件
      // console.log(e.lnglat);
      this.app.$emit("map-over", { mapName: this.mapName, point: e.lnglat });
    },
    doMapRight(e) {
      // 监控地图上的右击事件
      this.app.$emit("map-rightclick", {
        mapName: this.mapName,
        point: e.lnglat
      });
    },
    onMapClick() {
      // 地图动作启动
      this.map.on("click", this.doMapClick);
      this.map.on("mousemove", this.doMapOver);
      this.map.on("rightclick", this.doMapRight);
    },
    offMapClick() {
      // 地图上的动作的取消
      this.map.off("click", this.doMapClick);
      this.map.off("mousemove", this.doMapOver);
      this.map.off("rightclick", this.doMapRight);
    },
    addEditPoint(op) {
      // console.log(op);
      // 添加可移动点
      let option = {
        icon: new AMap.Icon(op.icon, new AMap.Size(16, 16)),
        draggable: true
      };
      const marker = new AMap.Marker({
        position: [op.lng, op.lat],
        icon: op.icon,
        draggable: true,
        size: new AMap.Size(16, 16),
        offset: new AMap.Pixel(-8, -8),
        title: "鼠标左击删除点"
      });
      marker.on("dragend", e => {
        // console.log(e);
        marker.setPosition([e.lnglat.lng, e.lnglat.lat]);
        this.app.$emit("map-eidt-point", {
          mapName: this.mapName,
          idx: op.idx,
          point: e.lnglat
        });
      });
      if (op.tag == "point") {
        marker.on("rightclick", e => {
          this.app.$emit("map-eidt-point-right", {
            mapName: this.mapName,
            idx: op.idx,
            point: e.point
          });
        });
      }
      this.map.add(marker);
      this.editPoints.push(marker);
    },
    clearEditPoint() {
      // 清空可移动点
      if (this.editPoints.length > 0) {
        for (let i = 0; i < this.editPoints.length; i++) {
          this.map.remove(this.editPoints);
        }
        this.editPoints = [];
      }
    },
    // 2022-6-20 ----------------- end
    removeCircle() {
      // 删除布防圆
      if (this.circleArea) {
        this.map.remove(this.circleArea);
        this.circleArea = null;
      }
    },
    drawCircle(op) {
      // console.log(op);
      // 画布防圆
      this.circleAreaData = {
        lat: op.lat,
        lng: op.lng,
        radius: op.radius
      };
      const pt = this.parseBd2AmapPt(op);
      if (this.circleArea) {
        this.circleArea.setCenter(pt);
        this.circleArea.setRadius(op.radius);
      } else {
        this.circleArea = new AMap.Circle({
          center: new AMap.LngLat(pt.lng, pt.lat),
          radius: op.radius,
          strokeColor: "#32cd32", //边线颜色。
          fillColor: "#00ff00", //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 2, //边线的宽度，以像素为单位。
          strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        });
        this.map.add(this.circleArea);
      }
    },
    drawRunLine(op) {
      // console.log(op);
      // 画跟踪轨迹线
      const pt = this.parseBd2AmapPt(op);
      if (this.runLine) {
        var path = this.runLine.getPath();
        path.push(new AMap.LngLat(pt.lng, pt.lat));
        this.runLine.setPath(path);
        this.runLine.setOptions({ strokeColor: "green" });
      } else {
        var line = [];
        if (this.selectMarker) {
          line.push(this.selectMarker.getPosition());
        }
        line.push(new AMap.LngLat(pt.lng, pt.lat));
        this.runLine = new AMap.Polyline(line, {
          strokeColor: "green",
          strokeWeight: 4,
          strokeStyle: "solid",
          strokeOpacity: 1
        });
        this.map.add(this.runLine);
      }
    },
    clearRunLine() {
      // 清除跟踪轨迹线
      if (this.runLine) {
        this.map.remove(this.runLine);
        this.runLine = null;
      }
    },
    // 2021-5-31 start
    drawMeasureLine() {
      if (this.measureLine.length >= 2) {
        if (!this.distanceLine) {
          this.distanceLine = new AMap.Polyline({
            path: this.measureLine,
            strokeColor: "red",
            strokeWeight: 3,
            strokeStyle: "solid",
            strokeOpacity: 1
          });
          this.map.add(this.distanceLine);
        } else {
          // console.log("增加路径");
          if (this.measureLine.length > 0) {
            this.distanceLine.setPath(this.measureLine);
          }
        }
        //移除之前的距离标记
        for (let i = 0; i < this.lineLabel.length; i++) {
          this.map.remove(this.lineLabel[i]);
        }
        this.lineLabel = [];
        //计算距离并添加标记
        for (let i = 0; i < this.measureLine.length; i++) {
          var lat = (this.measureLine[i - 1].lat + this.measureLine[i].lat) / 2;
          var lng = (this.measureLine[i - 1].lng + this.measureLine[i].lng) / 2;
          var label = new AMap.Marker({
            position: [lng, lat],
            icon: "http://webapi.amap.com/images/3.png"
          }); //创建文本标注距离的对象
          // console.log("dadad", gpsHelper.distance(this.measureLine[i - 1].lat, this.measureLine[i - 1].lng, this.measureLine[i].lat, this.measureLine[i].lng).toFixed(2));
          // var title = Math.round(gpsHelper.distance(this.measureLine[i - 1].lat, this.measureLine[i - 1].lng, this.measureLine[i].lat, this.measureLine[i].lng)) + "m";
          var title = gpsHelper
            .distance(
              this.measureLine[i - 1].lat,
              this.measureLine[i - 1].lng,
              this.measureLine[i].lat,
              this.measureLine[i].lng
            )
            .toFixed(2);
          title = this.signFigures(title * 100);
          label.setLabel({
            // content: title,
            content: '<div class="title-color">' + title + "cm" + "</div>",
            offset: new AMap.Pixel(20, -20),
            color: "red",
            fontSize: "1.2rem"
            // direction: "right", //设置文本标注方位
          });
          this.map.add(label);
          this.lineLabel.push(label);
        }
      }
    },
    clickListener(e) {
      // console.log(e);
      if (this.measureLine.length == 0) {
        this.measureLine.push(e.lnglat);
        this.measureLine.push(e.lnglat);
      } else {
        this.measureLine[this.measureLine.length - 1] = e.lnglat;
        this.measureLine.push(e.lnglat);
      }
      // this.drawMeasureLine();
      this.mouseTools = new AMap.MouseTool(this.map);
      this.mouseTools.polyline({
        strokeColor: "transparent"
        // strokeWeight: 3,
        // strokeStyle: "solid",
        // strokeOpacity: 1,
      });
      this.map.add(this.mouseTools);
    },
    moveListener(e) {
      // console.log(e);
      this.measureLine[this.measureLine.length - 1] = e.lnglat;
      this.drawMeasureLine();
    },
    measureDistance() {
      // document.querySelector(`#amap_${this.mapName}>div`).classList.add("draw");
      this.map.on("click", this.clickListener);
      this.map.on("mousemove", this.moveListener);
      this.map.on("dblclick", () => {
        // console.log("双击了");
        this.offMeasureLine();
      });
      this.map.on("rightclick", () => {
        // console.log("右击了");
        this.offMeasureLine();
      });
    },
    offMeasureLine() {
      this.map.off("click", this.clickListener);
      this.map.off("mousemove", this.moveListener);
      if (this.distanceLine) {
        this.map.remove(this.distanceLine);
      }
      this.distanceLine = null;
      this.measureLine = [];
      for (let i = 0; i < this.lineLabel.length; i++) {
        this.map.remove(this.lineLabel[i]);
      }
      if (this.mouseTools) {
        this.mouseTools.close(true);
        this.map.remove(this.mouseTools);
        this.mouseTools = null;
      }
      // document.querySelector(`#amap_${this.mapName}>div`).classList.remove("draw");
      this.lineLabel = [];
      this.app.$emit("off-measure-line");
    },
    // end
    moveTheMarker(op) {
      // console.log(op);
      // 更新指定设备号的设备坐标
      var marker, label;
      // console.log(this.markers);
      // console.log(this.markers[op.title]);
      if (this.markers[op.title] && this.markerLabels[op.title]) {
        marker = this.markers[op.title];
        label = this.markerLabels[op.title];
        // console.log(marker);
      }
      if (marker) {
        // console.log("marker", marker);
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          // console.log("this.parseBd2AmapPt(op)", this.parseBd2AmapPt(op));
          marker.setPosition(this.parseBd2AmapPt(op));
        }
        if (op.icon) {
          // marker.setIcon(op.icon, new AMap.Size(36, 36));
          // 以下是新的图标的设置
          const theIcon = new AMap.Icon({
            size: new AMap.Size(32, 32),
            image: op.icon,
            imageSize: new AMap.Size(32, 32)
          });
          marker.setIcon(theIcon);
        }
        if (op.title) {
          marker.setTitle(op.title);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          // 2022-1-8换图标隐藏角度
          marker.setAngle(op.rotation);
          if (op.title == this.targetImei) {
            // console.log("chufa");
            marker.setAngle(op.rotation);
          }
        }
      }
      if (label) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          label.setPosition(this.parseBd2AmapPt(op));
        }
      }
    },
    moveMarker(op) {
      // 跟踪移动的图标设置
      // console.log(op);
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setPosition(this.parseBd2AmapPt(op));
        }
        if (op.icon) {
          // this.selectMarker.setIcon(op.icon, new AMap.Size(36, 36));
          // 以下是新的图标的设置
          const theIcon = new AMap.Icon({
            size: new AMap.Size(32, 32),
            image: op.icon,
            imageSize: new AMap.Size(32, 32)
          });
          this.selectMarker.setIcon(theIcon);
        }
        if (op.title) {
          this.selectMarker.setTitle(op.title);
        }
        if (op.rotation < 360 && op.rotation >= 0) {
          // 2022-1-8换图标隐藏角度
          this.selectMarker.setAngle(op.rotation);
          this.oprotation = op.rotation;
          this.targetImei = op.deviceImei;
        }
        if (this.selectLabel) {
          if (
            op.lat >= -90 &&
            op.lat <= 90 &&
            op.lng >= -180 &&
            op.lng <= 180
          ) {
            this.selectLabel.setPosition(this.parseBd2AmapPt(op));
          }
        }
      }
    },
    setSelectMarker(op) {
      // 选中设备坐标
      // console.log(op);
      var data = op.data;
      var prop = op.prop;
      var marker = op.marker;
      if (marker) {
        this.selectMarker = marker;
        this.selectMarkerDate = data;
      } else {
        var val = data[prop];
        if (this.markersData[val]) {
          this.selectMarkerData = this.markersData[val];
          this.selectMarker = this.markers[val];
          this.selectLabel = this.markerLabels[val];
        }
      }
    },
    addMarker(op) {
      // console.log("jieshoutrack");
      // console.log(op);
      if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
        // const theIcon = new AMap.Icon(op.icon, new AMap.Size(36, 36));
        // 以下是新的图标的设置
        const theIcon = new AMap.Icon({
          size: new AMap.Size(32, 32),
          image: op.icon,
          imageSize: new AMap.Size(32, 32)
        });
        const marker = new AMap.Marker({
          position: this.parseBd2AmapPt(op),
          icon: theIcon,
          angle: op.rotation,
          offset: new AMap.Pixel(-16, -16)
        });
        // 2022-12-8 加上了可以全部显示设备名的功能
        var label = new AMap.Marker({
          content: `<div class='device-label'>${op.data.name}</div>`,
          zIndex: 999,
          offset: new AMap.Pixel(4, 0),
          position: this.parseBd2AmapPt(op.data)
        });
        label.setTitle(op.data.deviceImei);
        label.hide();
        label.on("click", () => {
          this.app.$emit("map-select-marker", op.data);
          this.selectMarker = marker;
          this.selectLabel = label;
          this.selectMarkerData = op.data;
        });
        this.map.add(label);
        this.markerLabels[op.data.deviceImei] = label;
        // 2022-12-8 end
        marker.on("click", () => {
          // console.log("dianji");
          this.app.$emit("map-select-marker", op.data);
          this.app.$emit("show-device-position", op.data);
          this.selectMarker = marker;
          this.selectLabel = label;
          this.selectMarkerData = op.data;
          // this.setCenter(op);
          // marker.setLabel({
          //   content: `<div class='device-label nomore'>${op.data.name}</div>`,
          // });
          if (this.mapName != "circuit") {
            this.updateInfoBox(this.infoBoxData);
          }
          if (this.mapName == "circuit") {
            // console.log("zhixing");
            this.updateCircuitInfoBox(op);
          }
        });
        this.markers[op.data.deviceImei] = marker;
        this.markersData[op.data.deviceImei] = op.data;
        this.selectMarker = marker;
        this.map.add(marker);
        return marker;
      }
    },
    updateCircuitInfoBox(op) {
      // console.log(op);
      var infoContent = `<div class='device-label device-label-left-47 active' >${
        op.data.name
      }</div>`;
      if (this.circuitInfoBox) {
        this.circuitInfoBox.setContent(infoContent);
        this.circuitInfoBox.setPosition(this.parseBd2AmapPt(op.data));
        this.circuitInfoBox.setOffset(new AMap.Pixel(0, 0));
      } else {
        var label = new AMap.Marker({
          content: infoContent,
          zIndex: 999,
          offset: new AMap.Pixel(0, 0),
          position: this.parseBd2AmapPt(op.data)
        });
        // console.log("zhixing");
        this.map.add(label);
        this.circuitInfoBox = label;
      }
      this.circuitInfoBox.show();
    },
    updateInfoBox(op) {
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
        this.infoBox.setPosition(this.parseBd2AmapPt(op));
        this.infoBox.setOffset(new AMap.Pixel(op.offsetX, op.offsetY));
      } else {
        var label = new AMap.Marker({
          content: op.infoContent,
          zIndex: 999,
          offset: new AMap.Pixel(op.offsetX, op.offsetY),
          position: this.parseBd2AmapPt(op)
        });

        this.map.add(label);
        this.infoBox = label;
      }
      this.viewInfoBox();
    },
    hideInfoBox() {
      //隐藏信息框
      if (this.infoBox) {
        this.infoBox.hide();
      }
    },
    viewInfoBox() {
      //显示信息框
      if (this.infoBox) {
        this.infoBox.show();
      }
    },
    playPath(op) {
      // console.log(op);
      //回访时箭头运动
      if (this.selectMarker) {
        if (op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180) {
          this.selectMarker.setPosition(this.parseBd2AmapPt(op));
        }

        if (op.rotation < 360 && op.rotation >= 0) {
          this.selectMarker.setAngle(op.rotation - 90);
        }
      }
    },
    addPoint(data) {
      // console.log(data);
      //添加回放标记点：起点，终点，停留点，超速点，运行点
      var that = this;
      var marker = new AMap.Marker({
        position: this.parseBd2AmapPt(data),
        icon: data.icon,
        title: data.title,
        zIndex: 110,
        angle: data.rotation,
        autoRotation: data.tag == "run",
        offset: new AMap.Pixel(data.offsetX, data.offsetY)
      });

      if (data.tag == "run") {
        this.selectMarker = marker;
      } else {
        marker.on("click", function() {
          that.app.$emit("playback-point", data);
          that.setCenter(data);
        });
      }
      this.map.add(marker);
      this.pointMarker.push(marker);
      this.pointMarkerData.push(data);
    },
    delPoint(op) {
      // console.log(op);
      //删除指定类型的点
      var tag = op.tag;
      var i = 0;
      while (i < this.pointMarkerData.length) {
        if (this.pointMarkerData[i].tag == tag) {
          this.map.remove(this.pointMarker[i]);
          this.pointMarker.splice(i, 1);
          this.pointMarkerData.splice(i, 1);
        } else {
          i++;
        }
      }
    },
    parseBd2AmapPt(op) {
      // console.log(op);
      // let op1 = {
      //   lat: 22.550823438523445,
      //   lng: 113.94154226327866,
      // };
      // let pt1 = gpsHelper.gcj_encrypt(op1.lat, op1.lng);
      // console.log(new AMap.LngLat(pt1.lng, pt1.lat));
      //将百度经纬度点转换为高德经纬度点
      var pt = gpsHelper.gcj_encrypt(op.lat, op.lng);
      return new AMap.LngLat(pt.lng, pt.lat);
    },
    parseBdArray2AmapArray(list) {
      //将百度经纬度点数组转换为高德经纬度点数组
      var result = [];
      for (var i = 0; i < list.length; i++) {
        result.push(this.parseBd2AmapPt(list[i]));
      }
      return result;
    },
    addLine(op) {
      // console.log(op);
      //画轨迹线
      var polylinePath = this.parseBdArray2AmapArray(op.line);
      // console.log(polylinePath);
      // var polylinePath = op.line;
      // console.log(polylinePath);
      var polyline = new AMap.Polyline({
        path: polylinePath,
        strokeColor: op.color,
        strokeWeight: 4,
        strokeStyle: "solid",
        strokeOpacity: 1,
        outlineColor: "#FFF"
      });
      this.map.add(polyline);
    },
    addLine1(op) {
      // console.log(op);
      //画轨迹线
      var polylinePath = this.parseBdArray2AmapArray(op.line);

      this.polyline = new AMap.Polyline({
        path: polylinePath,
        strokeColor: op.color,
        strokeWeight: 4,
        strokeStyle: "solid",
        strokeOpacity: 1,
        outlineColor: "#FFF"
      });
      this.map.add(this.polyline);
    },
    clearMap() {
      // console.log("chufa.qingchu");
      //清空地图
      if (this.pointMarker) {
        this.map.remove(this.pointMarker);
        this.pointMarker = [];
      }
      this.pointMarkerData = [];

      this.polygonArea = null;
      this.editPoints = [];
      this.infoBoxData = null;

      //隐藏信息框
      if (this.infoBox) {
        this.infoBox.hide();
        this.infoBox = null;
      }
      if (this.circuitInfoBox) {
        this.circuitInfoBox.hide();
        this.circuitInfoBox = null;
      }

      // if (this.selectMarker) {
      //   this.map.remove(this.selectMarker);
      //   this.selectMarker = null;
      // }
      if (this.markerLabels) {
        this.markerLabels = {};
      }
      if (this.markersData) {
        this.markersData = {};
      }
      if (this.polyline) {
        this.map.remove(this.polyline);
        this.polyline = null;
      }
      if (this.selectMarkerData) {
        this.selectMarkerData = {};
      }
      if (this.mapName != "circuit") {
        // console.log("zhixing");
        this.map.clearMap();
      }
    },
    clearAllMap() {
      this.map.clearMap();
    },
    clearAllMarkers() {
      if (this.circuitInfoBox) {
        this.circuitInfoBox.hide();
        this.circuitInfoBox = null;
      }
      if (this.markers) {
        for (let val in this.markers) {
          // console.log(this.markers[val]);
          this.map.remove(this.markers[val]);
        }
        this.markers = {};
      }
    },
    showMarkerLabels() {
      // 显示设备坐标名称标签
      for (var key in this.markerLabels) {
        if (this.selectLabel == this.markerLabels[key]) {
          this.selectLabel.hide();
        } else {
          this.markerLabels[key].show();
        }
      }
    },
    hideMarkerLabels() {
      // 隐藏设备坐标名称标签
      for (var key in this.markerLabels) {
        this.markerLabels[key].hide();
      }
    },
    setBounds(op) {
      // console.log(op);
      //设置边界
      var start = this.parseBd2AmapPt(op.pt1);
      var end = this.parseBd2AmapPt(op.pt2);
      this.map.setBounds(new AMap.Bounds(start, end));
    },
    setViewPort(op) {
      // console.log(op);
      //调整地图缩放大小
      // this.map.setFitView();
      // 2021-6-8新增判断
      if (op.points.length != 0) {
        var pts = op.points;
        var start = pts[Math.floor(pts.length * 0.25)];
        var end = pts[Math.floor(pts.length * 0.75)];
        if (op.mapName == "playback" || op.mapName == "circuit") {
          this.setZoom({
            zoom:
              mapUtil.getBaiduZoomByMeter(
                mapUtil.getDistance(
                  start.realPt.lat,
                  start.realPt.lng,
                  end.realPt.lat,
                  end.realPt.lng
                )
              ) + 1
          });
          this.setCenter({
            lat: (start.realPt.lat + end.realPt.lat) / 2,
            lng: (start.realPt.lng + end.realPt.lng) / 2
          });
          // console.log("(start.realPt.lat) / 2", (start.realPt.lat + end.realPt.lat) / 2 + (start.realPt.lng + end.realPt.lng) / 2);
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
          // console.log("(start.lat + end.lat) / 2", (start.lat + end.lat) / 2 + (start.lng + end.lng) / 2);
        }
      }
    },
    setPlanLinePort(op) {
      if (op.points.length > 0) {
        var pts = op.points;
        var start = pts[Math.floor(pts.length * 0.25)];
        var end = pts[Math.floor(pts.length * 0.75)];
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
    },
    initMap() {
      // //初始化地图
      var that = this;
      // var map = new AMap.Map("amap_" + this.mapName, {
      //   resizeEnable: true,
      //   // center: [116.397428, 39.90923],
      //   center: [113.392585, 23.061977],
      //   zoom: 11,
      //   zooms: [1, 20],
      // });
      // // 控件：位置定位
      // AMap.plugin(["AMap.Scale", "AMap.Geolocation"], function() {
      //   map.addControl(new AMap.Scale());
      //   // map.addControl(new AMap.Geolocation());
      // });
      // // 地图上的中英文显示
      // var langType = window.localStorage.getItem("langType");
      // if (langType == "en") {
      //   map.setLang("zh_en");
      // }
      // // 设置地图的上的zoom级别
      // map.on("zoomend", function() {
      //   that.$emit("map-zoom", map.getCenter(), map.getZoom());
      // });
      // //卫星图
      // var satelliteLayer = new AMap.TileLayer.Satellite();
      // satelliteLayer.setMap(map);
      // satelliteLayer.hide();
      // this.satelliteLayer = satelliteLayer;
      // this.map = map;
      // 2022-7-5 -------------------------------------
      // console.log("dasssssssss");
      // console.log("22222222222222");
      MapLoader().then(AMap => {
        //初始化地图
        // console.log("Amap", AMap);
        var map = new AMap.Map("amap_" + this.mapName, {
          resizeEnable: true,
          // center: [116.397428, 39.90923],
          center: [113.392585, 23.061977],
          zoom: 11,
          zooms: [1, 20]
        });
        // 控件：位置定位
        AMap.plugin(["AMap.Scale", "AMap.Geolocation"], function() {
          map.addControl(new AMap.Scale());
          // map.addControl(new AMap.Geolocation());
        });
        // 地图上的中英文显示
        var langType = window.localStorage.getItem("langType");
        if (langType == "en") {
          map.setLang("zh_en");
        }
        // 设置地图的上的zoom级别
        map.on("zoomend", function() {
          that.$emit("map-zoom", map.getCenter(), map.getZoom());
        });
        //卫星图
        var satelliteLayer = new AMap.TileLayer.Satellite();
        satelliteLayer.setMap(map);
        satelliteLayer.hide();
        this.satelliteLayer = satelliteLayer;
        this.map = map;
        setTimeout(() => {
          // console.log("dada");
          this.listenEvent();
          if (this.isEmptyObject(this.markers)) {
            // console.log("zhixing");
            this.app.$emit("agin-load-device");
          }
        }, 50);
      });
    },
    setCenter(op) {
      // console.log(op);
      //设置地图的中心经纬度
      var pt = this.parseBd2AmapPt(op);
      this.lat = pt.lat;
      this.lng = pt.lng;
      this.map.setCenter(
        op.lat >= -90 && op.lat <= 90 && op.lng >= -180 && op.lng <= 180
          ? this.parseBd2AmapPt(op)
          : this.map.getCenter()
      );
    },
    setZoom(op) {
      //设置地图缩放大小
      // console.log(op);
      this.map.setZoom(op.zoom ? op.zoom : this.map.getZoom());
    },
    addLastMaker(data) {
      var marker = new AMap.Marker({
        position: this.parseBd2AmapPt(data),
        icon: data.icon,
        title: data.title,
        zIndex: 110,
        angle: data.rotation,
        autoRotation: data.tag == "run",
        offset: new AMap.Pixel(data.offsetX, data.offsetY)
      });
      this.map.add(marker);
      this.pointMarker.push(marker);
    },
    // 画轨迹点传给服务器 2022-11-3
    drawMeasureLineTrack() {
      if (this.trackLine.length >= 2) {
        if (!this.trackLineOverLay) {
          this.trackLineOverLay = new AMap.Polyline({
            path: this.measureLine,
            strokeColor: "red",
            strokeWeight: 3,
            strokeStyle: "solid",
            strokeOpacity: 1
          });
          this.map.add(this.trackLineOverLay);
        } else {
          if (this.trackLine.length > 0) {
            this.trackLineOverLay.setPath(this.trackLine);
          }
        }
      }
    },
    clickListenerTrack(e) {
      // console.log(e);
      this.app.$emit("load-gaode-location", e.lnglat);
      if (this.trackLine.length == 0) {
        this.trackLine.push(e.lnglat);
        this.trackLine.push(e.lnglat);
      } else {
        this.trackLine[this.trackLine.length - 1] = e.lnglat;
        this.trackLine.push(e.lnglat);
      }
      this.mouseTrackTools = new AMap.MouseTool(this.map);
      this.mouseTrackTools.polyline({
        strokeColor: "transparent",
        strokeWeight: 3,
        strokeStyle: "solid",
        strokeOpacity: 1
      });
      this.map.add(this.mouseTrackTools);
    },
    moveListenerTrack(e) {
      this.trackLine[this.trackLine.length - 1] = e.lnglat;
      this.drawMeasureLineTrack();
    },
    drawTrack() {
      // 取点画轨迹
      this.map.on("click", this.clickListenerTrack);
      this.map.on("mousemove", this.moveListenerTrack);
      this.map.on("rightclick", () => {
        this.offMeasureLineTrack();
      });
    },
    offMeasureLineTrack() {
      this.map.off("click", this.clickListenerTrack);
      this.map.off("mousemove", this.moveListenerTrack);
      if (this.mouseTrackTools) {
        this.mouseTrackTools.close(true);
        this.map.remove(this.mouseTrackTools);
        this.mouseTrackTools = null;
      }
      if (this.trackLine.length > 1) {
        let startPoint = this.trackLine[0];
        let lastPoint = this.trackLine[this.trackLine.length - 1];
        // 终点： https://a.amap.com/jsapi/static/image/plugin/marker/end.png
        // 起点： https://a.amap.com/jsapi/static/image/plugin/marker/start.png
        const theIcon = new AMap.Icon({
          size: new AMap.Size(25, 30),
          image:
            "https://a.amap.com/jsapi/static/image/plugin/marker/start.png",
          imageSize: new AMap.Size(25, 30)
        });
        this.startPointMarker = new AMap.Marker({
          position: startPoint,
          icon: theIcon,
          offset: new AMap.Pixel(-16, -16)
        });
        this.map.add(this.startPointMarker);
        const theIcon1 = new AMap.Icon({
          size: new AMap.Size(25, 30),
          image: "https://a.amap.com/jsapi/static/image/plugin/marker/end.png",
          imageSize: new AMap.Size(25, 30)
        });
        this.lastPointMarker = new AMap.Marker({
          position: lastPoint,
          icon: theIcon1,
          offset: new AMap.Pixel(-16, -16)
        });
        this.map.add(this.lastPointMarker);
      }
    },
    clearTrack() {
      if (this.trackLineOverLay) {
        this.map.remove(this.trackLineOverLay);
      }
      if (this.trackLine) {
        this.trackLine = [];
      }
      this.trackLineOverLay = null;
      if (this.mouseTrackTools) {
        this.mouseTrackTools.close(true);
        this.map.remove(this.mouseTrackTools);
        this.mouseTrackTools = null;
      }
      if (this.lastPointMarker) {
        this.map.remove(this.lastPointMarker);
        this.map.remove(this.startPointMarker);
      }
      if (this.planPolyline) {
        this.map.remove(this.planPolyline);
        this.planPolyline = null;
      }
    },
    clearDriving() {
      // 清除规划的轨迹点
      if (this.driving) {
        this.driving.clear();
        this.map.remove(this.driving);
        this.driving = null;
      }
      if (this.planPolyline) {
        this.map.remove(this.planPolyline);
        this.planPolyline = null;
      }
      if (this.lastPointMarker) {
        this.map.remove(this.lastPointMarker);
        this.map.remove(this.startPointMarker);
      }
    },
    drivingTrack(op) {
      console.log(op);
      var drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME,
        ferry: 1, // 是否可以使用轮渡
        province: "京", // 车牌省份的汉字缩写
        map: this.map
        // panel: "panel",
      };

      // 根据起终点经纬度规划驾车导航路线
      this.clearDriving();
      // console.log("zhixing");
      // 构造路线导航类
      var that = this;
      this.driving = new AMap.Driving(drivingOption);
      this.driving.search(
        new AMap.LngLat(op.data.lng, op.data.lat),
        new AMap.LngLat(op.data.llng, op.data.llat),
        function(status, result) {
          if (status === "complete") {
            // console.log("result", result);
            that.getTrackArrList(result.routes[0].steps);
          } else {
            console.log("获取驾车数据失败：" + result);
          }
        }
      );
    },
    getTrackArrList(list) {
      // console.log(list);
      let arrList = [];
      let newArrList = [];
      arrList = list.map(item => {
        return item.path;
      });
      // console.log("arrList", arrList);
      newArrList = this.arrOfOneDimension(arrList);
      // console.log("newArrList", newArrList);
      this.app.$emit("load-track-list", newArrList);
    },
    arrOfOneDimension(list) {
      // 多维数组变成一位数组
      // console.log("list", list);
      let newArr = [];
      for (var i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) {
          newArr = newArr.concat(this.arrOfOneDimension(list[i]));
        } else {
          newArr.push(list[i]);
        }
      }
      return newArr;
    },
    // 开始点
    doSPointClick(e) {
      this.app.$emit("map-s-click", { mapName: this.mapName, point: e.lnglat });
      setTimeout(() => {
        this.app.$emit("do-trigger");
      }, 100);
    },
    doSMapClick(op) {
      // console.log(op);
      this.map.on("click", this.doSPointClick);
    },
    offSTrackMap() {
      this.map.off("click", this.doSPointClick);
    },
    // 结束点
    doLPointClick(e) {
      this.app.$emit("map-l-click", { mapName: this.mapName, point: e.lnglat });
      setTimeout(() => {
        this.app.$emit("do-trigger1");
      }, 100);
    },
    doLMapClick(op) {
      // console.log(op);
      this.map.on("click", this.doLPointClick);
    },
    offLTrackMap() {
      this.map.off("click", this.doLPointClick);
    },
    // 画轨迹点end
    // 轨迹点展示 start
    addPlanLine(op) {
      // console.log(op);
      //画轨迹线
      // var polylinePath = this.parseBdArray2AmapArray(op.line);
      if (this.planPolyline) {
        this.clearDriving();
      }
      let polylinePath = [];
      for (var i = 0; i < op.line.length; i++) {
        // console.log(op.line.length);
        // console.log(i);
        polylinePath.push(new AMap.LngLat(op.line[i].lng, op.line[i].lat));
      }
      // console.log("polylinePath", polylinePath);
      this.planPolyline = new AMap.Polyline({
        path: polylinePath,
        strokeColor: op.color,
        strokeWeight: 4,
        strokeStyle: "solid",
        strokeOpacity: 1,
        outlineColor: "#FFF"
      });
      this.map.add(this.planPolyline);
      // 终点： https://a.amap.com/jsapi/static/image/plugin/marker/end.png
      // 起点： https://a.amap.com/jsapi/static/image/plugin/marker/start.png
      let startPoint = op.line[0];
      let lastPoint = op.line[op.line.length - 1];
      const theIcon = new AMap.Icon({
        size: new AMap.Size(25, 30),
        image: "https://a.amap.com/jsapi/static/image/plugin/marker/start.png",
        imageSize: new AMap.Size(25, 30)
      });
      this.startPointMarker = new AMap.Marker({
        position: new AMap.LngLat(startPoint.lng, startPoint.lat),
        icon: theIcon,
        offset: new AMap.Pixel(-16, -16)
      });
      this.map.add(this.startPointMarker);
      const theIcon1 = new AMap.Icon({
        size: new AMap.Size(25, 30),
        image: "https://a.amap.com/jsapi/static/image/plugin/marker/end.png",
        imageSize: new AMap.Size(25, 30)
      });
      this.lastPointMarker = new AMap.Marker({
        position: new AMap.LngLat(lastPoint.lng, lastPoint.lat),
        icon: theIcon1,
        offset: new AMap.Pixel(-16, -16)
      });
      this.map.add(this.lastPointMarker);
    },
    showOtherMarkers(op) {
      // 显示所有的设备
      // console.log("op", op);
      if (this.selectMarkerData) {
        for (var key in this.markersData) {
          // console.log("key", key);
          // console.log("this.markersData[key][op.prop]", this.markersData[key][op.prop]);
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.map.add(this.markers[key]);
          }
        }
      }
    },
    hideOtherMarkers(op) {
      if (this.selectMarkerData) {
        for (var key in this.markers) {
          if (
            key != this.selectMarkerData[op.prop] &&
            this.markersData[key][op.prop]
          ) {
            this.map.remove(this.markers[key]);
          }
        }
      }
    },
    // 轨迹点展示 end
    onMapOperation(op) {
      // console.log("opssssssssssssssssssss", op);
      //地图操作选择器
      if (op.mapName == this.mapName) {
        var actions = {
          "add-point": this.addPoint,
          "hide-infobox": this.hideInfoBox,
          "show-infobox": this.updateInfoBox,
          "move-marker": this.moveMarker,
          "del-point": this.delPoint,
          "set-center": this.setCenter,
          "set-zoom": this.setZoom,
          "add-line": this.addLine,
          "add-line1": this.addLine1,
          "set-view-port": this.setViewPort,
          "clear-map": this.clearMap,
          "play-path": this.playPath,
          "set-bounds": this.setBounds,
          "add-marker": this.addMarker,
          "draw-run-line": this.drawRunLine,
          "measure-line": this.measureDistance,
          "off-measure-line": this.offMeasureLine,
          "clear-run-line": this.clearRunLine,
          "draw-circle": this.drawCircle,
          "remove-circle": this.removeCircle,
          "select-marker": this.setSelectMarker,
          "move-the-marker": this.moveTheMarker,
          "draw-polygon": this.drawPolygon,
          "remove-polygon": this.removePolygon,
          "on-map-click": this.onMapClick,
          "off-map-click": this.offMapClick,
          "add-edit-point": this.addEditPoint,
          "clear-edit-point": this.clearEditPoint,
          "add-last-marker": this.addLastMaker,
          // "set-path-point": this.setPathPoint,//边运动边画线
          // "save-map": this.saveMap,
          "draw-track": this.drawTrack,
          "clear-track": this.clearTrack,
          "driving-track": this.drivingTrack,
          "do-s-map-click": this.doSMapClick,
          "off-s-track-click": this.offSTrackMap,
          "do-l-map-click": this.doLMapClick,
          "off-l-track-click": this.offLTrackMap,
          "clear-driving": this.clearDriving,
          "add-plan-line": this.addPlanLine,
          "show-circuit-info-box": this.updateCircuitInfoBox,
          "clear-all-map": this.clearAllMap,
          "clear-all-markers": this.clearAllMarkers,
          "set-plan-line-port": this.setPlanLinePort,
          "show-marker-labels": this.showMarkerLabels,
          "hide-marker-labels": this.hideMarkerLabels,
          "show-other-markers": this.showOtherMarkers,
          "hide-other-markers": this.hideOtherMarkers
        };
        actions[op.action] && actions[op.action](op);
      }
    },
    saveMap() {
      if (this.map) {
        // console.log(this.map.getZoom());
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
    listenEvent() {
      this.app.$on("map-operation", this.onMapOperation);
    },
    offEvent() {
      this.app.$off("map-operation", this.onMapOperation);
    }
  },
  beforeCreate() {
    // const url = "https://webapi.amap.com/maps?v=1.4.15&key=ed45731968f87e2ebd5a627a791e1c0b&plugin=AMap.MouseTool"; //人保地址转换
    // // const url = "https://webapi.amap.com/maps?v=1.4.15&key=0b8b96719f2a96755a545a7dcff429b5&plugin=AMap.MouseTool";//车辆网海外-移动端web
    // this.getTheMapScriptToBody(url);
    if (window.localStorage.getItem("langType") == "en") {
      const scriptUrl = "https://cache.amap.com/lbs/static/es5.min.js";
      const scriptApi = document.createElement("script");
      scriptApi.src = scriptUrl;
      document.head.appendChild(scriptApi);
    }
  },
  mounted() {
    if (this.mapName == "playback") {
      // setTimeout(() => {
      this.initMap();
      // this.listenEvent();
      // }, 1000);
    } else {
      // setTimeout(() => {
      this.initMap();
      // this.listenEvent();
      // }, 1000);
    }
  },
  beforeDestroy() {
    this.offEvent();
    this.saveMap();
  }
};
</script>

<style lang="scss">
.title-color {
  font-weight: bold;
  color: red;
}
.nomore {
  display: none;
}
.amap-marker-label {
  border: 0;
  background-color: transparent;
  padding: 19px;
}
.amap-ranging-label {
  border-radius: 5px;
}
#amap_track {
  .amap-marker-label {
    position: absolute;
    z-index: 2;
    border: none !important;
    white-space: nowrap;
    cursor: pointer;
    padding: 5px;
    font-size: 12px;
    line-height: 14px;
    background: transparent !important;
    color: red !important;
  }
}
.amap-geolocation-con {
  left: unset !important;
  bottom: 36px !important;
  right: 10px;
}

#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
