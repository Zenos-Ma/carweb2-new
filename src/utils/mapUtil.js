import API from "@/utils/api.js";

function getLangText(item) {
  //获取当前语言类型label
  var langType = window.localStorage.getItem("langType");
  if (item) {
    if (langType == "en") {
      return item.en ? item.en : "--";
    } else {
      return item.zh ? item.zh : "--";
    }
  } else {
    return "--";
  }
}
var label = {
  chaoguo: {
    zh: "超过999天",
    en: "More than 999 days"
  },
  driving: {
    zh: "行驶",
    en: "Driving"
  },
  stay: {
    zh: "静止",
    en: "Static"
  },
  offline: {
    zh: "离线",
    en: "Offline"
  },
  unused: {
    zh: "未启用",
    en: "Unused"
  },
  expired: {
    zh: "过期",
    en: "Expired"
  },
  nodataUpload: {
    zh: "未上传数据",
    en: "No data upload"
  },
  noUpload: {
    zh: "未上传",
    en: "No upload"
  },
  day: {
    zh: "天",
    en: "d "
  },
  hour: {
    zh: "时",
    en: "h "
  },
  minute: {
    zh: "分",
    en: "m "
  },
  second: {
    zh: "秒",
    en: "s"
  },
  north: {
    zh: "正北",
    en: "north"
  },
  nne: {
    zh: "东北偏北",
    en: "north-northeast"
  },
  northeast: {
    zh: "东北",
    en: "northeast"
  },
  ene: {
    zh: "东北偏东",
    en: "east-northeast"
  },
  east: {
    zh: "正东",
    en: "east"
  },
  ese: {
    zh: "东南偏东",
    en: "east-southeast"
  },
  southeast: {
    zh: "东南",
    en: "southeast"
  },
  sse: {
    zh: "东南偏南",
    en: "south-southeast"
  },
  south: {
    zh: "正南",
    en: "south"
  },
  ssw: {
    zh: "西南偏南",
    en: "south-southwest"
  },
  southwest: {
    zh: "西南",
    en: "southwest"
  },
  wsw: {
    zh: "西南偏西",
    en: "west-southwest"
  },
  west: {
    zh: "正西",
    en: "west"
  },
  wnw: {
    zh: "西北偏西",
    en: "west-northwest"
  },
  northwest: {
    zh: "西北",
    en: "northwest"
  },
  nnw: {
    zh: "西北偏北",
    en: "north-northwest"
  },
  lowerMinute: {
    zh: "小于1分钟",
    en: "within 1 minute"
  }
};
//设备状态信息
function devStatus(sts, time) {
  let limitTime = 999 * (24 * 60 * 60 * 1000);
  switch (sts) {
    case 1:
      return getLangText(label.driving);
    case 2:
      return getLangText(label.stay);
    case 3:
      var t_gap =
        new Date(time).getTime() > 946684800000
          ? new Date().getTime() - new Date(time).getTime()
          : -1;
      if (t_gap > limitTime) {
        return getLangText(label.chaoguo);
      } else {
        return getLangText(label.offline) + cnTime(t_gap);
      }
    // 2022-6-24 start 改成了只有3中状态了， 行驶，静止，离线
    case 4:
    case 5:
      var t_gap1 =
        new Date(time).getTime() > 946684800000
          ? new Date().getTime() - new Date(time).getTime()
          : -1;
      if (t_gap1 > limitTime) {
        return getLangText(label.chaoguo);
      } else {
        return getLangText(label.offline) + cnTime(t_gap1);
      }
    // case 4:
    //   return getLangText(label.unused);
    // case 5:
    //   return getLangText(label.expired);
    // default:
    //   return getLangText(label.nodataUpload);
  }
}
//信息框设备状态
function cnStatus(data) {
  var str = [];
  var t_gap = 0;
  let limitTime = 999 * (24 * 60 * 60 * 1000);
  switch (data.info.stsNum) {
    case 1:
      str.push(getLangText(label.driving));
      str.push(cnCourse(data.info.course));
      str.push(data.info.speed + "km/h");
      break;
    case 2:
      str.push(getLangText(label.stay));
      t_gap =
        data.info.locateTime > 946684800000
          ? new Date().getTime() - data.info.locateTime
          : -1;
      str.push(cnTime(t_gap));
      break;
    case 3:
      t_gap =
        data.info.signalTime > 946684800000
          ? new Date().getTime() - data.info.signalTime
          : -1;
      if (t_gap > limitTime) {
        str.push(getLangText(label.chaoguo));
      } else {
        str.push(getLangText(label.offline));
        str.push(cnTime(t_gap));
      }
      break;
    // case 4:
    //   str.push(getLangText(label.unused));
    //   break;
    // case 5:
    //   str.push(getLangText(label.expired));
    //   break;
    case 4:
    case 5:
      t_gap =
        data.info.signalTime > 946684800000
          ? new Date().getTime() - data.info.signalTime
          : -1;
      if (t_gap > limitTime) {
        str.push(getLangText(label.chaoguo));
      } else {
        str.push(getLangText(label.offline));
        str.push(cnTime(t_gap));
      }
      break;
    default:
      str.push(getLangText(label.nodataUpload));
  }
  return str.join("，");
}

function sortDevList(list) {
  if (list.length > 0) {
    list.sort(function(a, b) {
      return b.locateTime - a.locateTime;
    });
  }
  return list;
}
//设备列表设备状态
function cnStatus1(data) {
  var str = [];
  var t_gap;
  let limitTime = 999 * (24 * 60 * 60 * 1000);
  switch (data.stsNum) {
    case 1:
      str.push(getLangText(label.driving));
      break;
    case 2:
      str.push(getLangText(label.stay) + ">");
      t_gap =
        data.locateTime > 946684800000
          ? new Date().getTime() - data.locateTime
          : -1;
      str.push(cnTime1(t_gap));
      break;
    case 3:
      t_gap =
        data.signalTime > 946684800000
          ? new Date().getTime() - data.signalTime
          : -1;
      if (t_gap > limitTime) {
        str.push(getLangText(label.chaoguo));
      } else {
        str.push(getLangText(label.offline) + ">");
        str.push(cnTime1(t_gap));
      }

      break;
    // 2022-6-24 start 只有3种状态， 行驶，静止，离线
    case 4:
    case 5:
      t_gap =
        data.signalTime > 946684800000
          ? new Date().getTime() - data.signalTime
          : -1;
      if (t_gap > limitTime) {
        str.push(getLangText(label.chaoguo));
      } else {
        str.push(getLangText(label.offline) + ">");
        str.push(cnTime1(t_gap));
      }
      break;
    // case 4:
    //   str.push(getLangText(label.unused));
    //   break;
    // case 5:
    //   str.push(getLangText(label.expired));
    //   break;
    // default:
    //   str.push(getLangText(label.nodataUpload));
  }
  return str.join(" ");
}
//规格化时间
function cnTime1(time) {
  if (time < 0) {
    return "";
  } else if (time < 59000) {
    return getLangText(label.lowerMinute);
  }
  time = Math.floor(time / 1000);
  var d = Math.floor(time / (60 * 60 * 24));
  time = time % (60 * 60 * 24);
  var h = Math.floor(time / (60 * 60));
  time = time % (60 * 60);
  var m = Math.floor(time / 60);
  var str = [];
  if (d > 0) str.push(d + getLangText(label.day));
  if (d > 0 || h > 0) str.push(h + getLangText(label.hour));
  if (d > 0 || h > 0 || m > 0) str.push(m + getLangText(label.minute));
  return str.join("");
}
//规格化时间
function cnTime(time) {
  if (time < 0) {
    return "";
  }
  time = Math.floor(time / 1000);
  var d = Math.floor(time / (60 * 60 * 24));
  time = time % (60 * 60 * 24);
  var h = Math.floor(time / (60 * 60));
  time = time % (60 * 60);
  var m = Math.floor(time / 60);
  var s = time % 60;
  var str = [];
  if (d > 0) str.push(d + getLangText(label.day));
  if (d > 0 || h > 0) str.push(h + getLangText(label.hour));
  if (d > 0 || h > 0 || m > 0) str.push(m + getLangText(label.minute));
  if (d > 0 || h > 0 || m > 0 || s > 0) str.push(s + getLangText(label.second));
  return str.join("");
}
//获取两经纬度距离
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;

  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );

  s = s * 6378.137; // 地球半径，千米;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = Math.round(s * 1000) / 1; //单位修改为米,取整
  //s=s.toFixed(4);
  return s;
}
var bingZooms = [
    {
      num: 3,
      meter: 1000000
    },
    {
      num: 4,
      meter: 500000
    },
    {
      num: 5,
      meter: 250000
    },
    {
      num: 6,
      meter: 200000
    },
    {
      num: 7,
      meter: 100000
    },
    {
      num: 8,
      meter: 50000
    },
    {
      num: 9,
      meter: 25000
    },
    {
      num: 10,
      meter: 10000
    },
    {
      num: 11,
      meter: 5000
    },
    {
      num: 12,
      meter: 2000
    },
    {
      num: 13,
      meter: 1000
    },
    {
      num: 14,
      meter: 500
    },
    {
      num: 15,
      meter: 250
    },
    {
      num: 16,
      meter: 200
    },
    {
      num: 17,
      meter: 100
    },
    {
      num: 18,
      meter: 50
    },
    {
      num: 19,
      meter: 25
    },
    {
      num: 20,
      meter: 10
    }
  ],
  baiduZooms = [
    {
      num: 3,
      meter: 2000000
    },
    {
      num: 4,
      meter: 1000000
    },
    {
      num: 5,
      meter: 500000
    },
    {
      num: 6,
      meter: 200000
    },
    {
      num: 7,
      meter: 100000
    },
    {
      num: 8,
      meter: 50000
    },
    {
      num: 9,
      meter: 25000
    },
    {
      num: 10,
      meter: 20000
    },
    {
      num: 11,
      meter: 10000
    },
    {
      num: 12,
      meter: 5000
    },
    {
      num: 13,
      meter: 2000
    },
    {
      num: 14,
      meter: 1000
    },
    {
      num: 15,
      meter: 500
    },
    {
      num: 16,
      meter: 200
    },
    {
      num: 17,
      meter: 100
    },
    {
      num: 18,
      meter: 50
    },
    {
      num: 19,
      meter: 20
    }
  ];
var gaodeZooms = [
  {
    num: 3,
    meter: 1000000
  },
  {
    num: 4,
    meter: 500000
  },
  {
    num: 5,
    meter: 200000
  },
  {
    num: 6,
    meter: 100000
  },
  {
    num: 7,
    meter: 50000
  },
  {
    num: 8,
    meter: 30000
  },
  {
    num: 9,
    meter: 20000
  },
  {
    num: 10,
    meter: 10000
  },
  {
    num: 11,
    meter: 5000
  },
  {
    num: 12,
    meter: 2000
  },
  {
    num: 13,
    meter: 1000
  },
  {
    num: 14,
    meter: 500
  },
  {
    num: 15,
    meter: 200
  },
  {
    num: 16,
    meter: 100
  },
  {
    num: 17,
    meter: 50
  },
  {
    num: 18,
    meter: 25
  },
  {
    num: 19,
    meter: 10
  },
  {
    num: 20,
    meter: 10
  }
];

// 通过高德 zoom获取bing zoom
function getBingZoomByGaode(num) {
  var meter = gaodeZooms[num].meter;
  for (var i = 0; i < bingZooms.length; i++) {
    if (meter >= bingZooms[i].meter) {
      return bingZooms[i].num;
    }
  }
}

// 通过bing zoom获取高德 zoom
function getGaodeZoomByBing(num) {
  var meter = bingZooms[num - 3].meter;
  for (var i = 0; i < gaodeZooms; i++) {
    if (meter >= gaodeZooms[i].meter) {
      return gaodeZooms[i].num;
    }
  }
}

function getBingZoomByMeter(meter) {
  // console.log(meter);
  for (var i = 0; i < bingZooms.length; i++) {
    if (meter >= bingZooms[i].meter) {
      return bingZooms[i].num;
    }
  }
}
//通过百度 zoom获取Bing zoom
function getBingZoomByBaidu(num) {
  var meter = baiduZooms[num - 3].meter;
  for (var i = 0; i < bingZooms.length; i++) {
    if (meter >= bingZooms[i].meter) {
      return bingZooms[i].num;
    }
  }
}

function getBaiduZoomByMeter(meter) {
  // console.log(meter);
  for (var i = 0; i < baiduZooms.length; i++) {
    if (meter >= baiduZooms[i].meter) {
      return baiduZooms[i].num;
    }
  }
}
//通过Bing zoom获取百度zoom
function getBaiduZoomByBing(num) {
  var meter = bingZooms[num - 3].meter;
  for (var i = 0; i < baiduZooms.length; i++) {
    if (meter >= baiduZooms[i].meter) {
      return baiduZooms[i].num;
    }
  }
}

// 通过高德gao zoom获取百度zoom
function getBaiduZoomByGaode(num) {
  var meter = gaodeZooms[num - 3].meter;
  for (var i = 0; i < baiduZooms.length; i++) {
    if (meter >= baiduZooms[i].meter) {
      return baiduZooms[i].num;
    }
  }
}

// 通过百度Zoom 获取高德Zoom
function getGaodeZoomByBaidu(num) {
  var meter = baiduZooms[num - 3].meter;
  for (var i = 0; i < gaodeZooms.length; i++) {
    if (meter >= gaodeZooms[i].meter) {
      return gaodeZooms[i].num;
    }
  }
}
//
const contextPath1 = "https://plat.basegps.com/wxmini/plat/img/mapIcon";
//获取坐标图标
function getMarkerIcon(options, isPick = false) {
  // console.log(options);
  var contextPath = API.staticIcon;
  if (
    options.icon === undefined ||
    options.icon === null ||
    options.icon === ""
  )
    options.icon = "22";
  var iconUrl;
  if (options.icon == "01") {
    iconUrl = contextPath + "device-icon/green_west_01.gif";
  } else {
    var color = ["gray", "green", "blue", "gray", "gray", "gray"];
    // iconUrl = contextPath + 'v2/location/device-icon/' + color[options.stsNum] + '/' + options.icon + '.gif';
    if (color[options.stsNum]) {
      iconUrl = `${contextPath}device-icon/${color[options.stsNum]}/${
        options.icon
      }.gif`;
    } else {
      iconUrl = `${contextPath}device-icon/gray/${options.icon}.gif`;
    }
  }
  return iconUrl;
  // var contextPath = API.staticIcon + "new-icon/";
  // let deviceType = options.deviceType < 5 ? options.deviceType : 0;
  // // console.log("deviceType", deviceType);
  // let arr = ["", "move", "static", "off", "off"];
  // let str = isPick ? "-select" : "";
  // return `${contextPath}/${deviceType}-${
  //   arr[options.stsNum == 5 ? 3 : options.stsNum]
  // }${str}.png`;
}
// 获取原始的图标
function getListDeviceIcon(deviceType) {
  var contextPath = API.staticIcon + "/new-icon/";
  return `${contextPath}/${deviceType}-origin.png`;
}
// 获取设备的图标
function disposeDeviceIcon(marker, isPick) {
  // console.log("marker", marker);
  let stsIcon = "";
  let stsSelectIcon = "";
  if (marker.stsIcon && marker.stsIcon != "null") {
    stsIcon = API.staticResource + marker.stsIcon;
    stsSelectIcon = API.staticResource + marker.stsSelectIcon;
  } else {
    stsIcon = getMarkerIcon(marker, false);
    stsSelectIcon = getMarkerIcon(marker, true);
  }
  if (isPick) {
    marker.iconPath = stsSelectIcon;
    marker.selectTag = true;
  } else {
    marker.iconPath = stsIcon;
    marker.selectTag = false;
  }
}
//获取当前方向
function cnCourse(course) {
  if (course < 0) {
    course = 360 + course;
  }
  var d = 11.25;
  if (course < d || course >= d * 31) {
    return getLangText(label.north);
  } else if (course > d && course <= d * 3) {
    return getLangText(label.nne);
  } else if (course > d * 3 && course <= d * 5) {
    return getLangText(label.northeast);
  } else if (course > d * 5 && course <= d * 7) {
    return getLangText(label.ene);
  } else if (course > d * 7 && course <= d * 9) {
    return getLangText(label.east);
  } else if (course > d * 9 && course <= d * 11) {
    return getLangText(label.ese);
  } else if (course > d * 11 && course <= d * 13) {
    return getLangText(label.southeast);
  } else if (course > d * 13 && course <= d * 15) {
    return getLangText(label.sse);
  } else if (course > d * 15 && course <= d * 17) {
    return getLangText(label.south);
  } else if (course > d * 17 && course <= d * 19) {
    return getLangText(label.ssw);
  } else if (course > d * 19 && course <= d * 21) {
    return getLangText(label.southwest);
  } else if (course > d * 21 && course <= d * 23) {
    return getLangText(label.wsw);
  } else if (course > d * 23 && course <= d * 25) {
    return getLangText(label.west);
  } else if (course > d * 25 && course <= d * 27) {
    return getLangText(label.wnw);
  } else if (course > d * 27 && course <= d * 29) {
    return getLangText(label.northwest);
  } else if (course > d * 29 && course <= d * 31) {
    return getLangText(label.nnw);
  }
}
//Bing地图设备坐标方向
function cnCourse1(course) {
  var d = 22.5;
  if (course < 0) {
    course = 360 + course;
  }
  if (course < d || course >= d * 15) {
    return 0;
  } else if (course > d && course <= d * 3) {
    return 45;
  } else if (course > d * 3 && course <= d * 5) {
    return 90;
  } else if (course > d * 5 && course <= d * 7) {
    return 135;
  } else if (course > d * 7 && course <= d * 9) {
    return 180;
  } else if (course > d * 9 && course <= d * 11) {
    return 225;
  } else if (course > d * 11 && course <= d * 13) {
    return 270;
  } else if (course > d * 13 && course <= d * 15) {
    return 315;
  }
  return 0;
}
//Bing地图设备图标
function getMarkerIcon1(options) {
  var contextPath = API.staticIcon;
  var course = cnCourse1(options.course);
  if (
    options.icon === undefined ||
    options.icon === null ||
    options.icon === ""
  )
    options.icon = "22";
  var iconUrl;
  if (options.icon == "01") {
    iconUrl = contextPath + "device-icon/green_west_01.gif";
  } else {
    var color = ["gray", "green", "blue", "gray", "yellow", "red"];
    // iconUrl = contextPath + 'v2/location/device-icon/' + color[options.stsNum] + '/' + options.icon + '.gif';
    if (color[options.stsNum]) {
      iconUrl = `${contextPath}device-icon1/${color[options.stsNum]}/${
        options.icon
      }-${course}.gif`;
    } else {
      iconUrl = `${contextPath}device-icon1/gray/${options.icon}-${course}.gif`;
    }
  }
  return iconUrl;
}

export default {
  getGaodeZoomByBaidu,
  getBaiduZoomByGaode,
  getGaodeZoomByBing,
  getBingZoomByGaode,
  getBaiduZoomByBing,
  getBingZoomByBaidu,
  getBaiduZoomByMeter,
  getBingZoomByMeter,
  getDistance,
  cnStatus,
  cnStatus1,
  cnTime,
  cnTime1,
  getMarkerIcon,
  getMarkerIcon1,
  cnCourse,
  cnCourse1,
  devStatus,
  sortDevList,
  getListDeviceIcon,
  disposeDeviceIcon
};
