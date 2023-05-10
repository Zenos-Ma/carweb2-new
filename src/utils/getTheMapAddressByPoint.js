import Vue from "vue";
import gpsHelper from "@/utils/gpsHelper.js";
// 必应地图地址转换
Vue.prototype.getBingPoiLocation = function(lon, lat, callback_function) {
  const key =
    "AisjCHWRd2ahuXBg61CeXfHV9vk1quAhnnn_lxQucGfCViu85UqqUR4zXOpqC-np";
  let lang = window.localStorage.getItem("langType");
  let failAddr = lang == "en" ? "Fail to parse address" : "地址解析失败";
  let distance = lang == "en" ? "from" : "距离";
  let metre = lang == "en" ? "metre" : "米";
  let mapLang = "";
  if (lang == "zh") {
    mapLang = "zh-cn";
  } else if (lang == "en") {
    mapLang = "en-us";
  }
  // console.log(lat, lon);
  $.ajax({
    type: "get",
    async: true,
    cache: true,
    processData: false,
    contentType: false,
    timeout: 15000,
    url: `http://dev.virtualearth.net/REST/v1/Locations/${lat},${lon}?includeEntityTypes=Address&includeNeighborhood=1&include=ciso2&key=${key}&output=json&mkt=${mapLang}`,
    success: res => {
      // console.log(res);
      if (res.statusCode == 200) {
        var address = "";
        var theAdd = res.resourceSets[0].resources[0].address.formattedAddress;
        address = theAdd;
        callback_function(address);
      } else {
        callback_function(failAddr);
      }
    }
  });
};

Vue.prototype.getPoiLocation = function(lon, lat, callback_function) {
  // console.log(lon, lat);
  //获取含POI兴趣点的地址 百度地图的地址解析
  var key = "";

  if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
    //邓总的地址解析key
    key = "0AgpZMKch1Qp3OhCjpDkBVvMfkyBGGyB";
  } else {
    key = "EyqLUW841v6hI9NtcjEbrwkVi77xuakF";
  }
  var lang = window.localStorage.getItem("langType");
  var failAddr = lang == "en" ? "Fail to parse address" : "地址解析失败";
  var startTime = new Date().getTime();
  var distance1 = lang == "en" ? "from" : "距离";
  var metter = lang == "en" ? "metre" : "米";
  var that = this;
  //医疗|教育|交通设施|房地产|自然地物|行政区划|旅游景点|门址|道路|交通线
  // var poiSet = ["医院", "高等院校", "中学", "小学", "图书馆", "交通设施", "写字楼", "教学楼", "宿舍", "旅游景点", "展览馆", "自然地物", "小区"];
  //jsonp跨区请求，超时时间为1500，若超时则去获取简单地址
  // console.log("lat", lat);
  // console.log("lng", lon);
  $.ajax({
    type: "get",
    dataType: "jsonp",
    crossDomain: true,
    timeout: 15000, //人保地址转换 ed45731968f87e2ebd5a627a791e1c0b	  校园公交 e5dcb8d3d98152a3acfc360c2fbb6fd3 高德地图的逆地址转换
    // url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&radius=5000&extensions_poi=1&poi_types=${poiSet.join("|")}&output=json&location=${lat},${lon}`,
    url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&radius=5000&extensions_poi=1&output=json&location=${lat},${lon}&language=${lang}`,
    // url: `https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=${lon},${lat}&key=ed45731968f87e2ebd5a627a791e1c0b&radius=1000&extensions=all&language=${lang}`,
    success: function(res) {
      // console.log(res);
      if (res.status === 0) {
        var address = "";
        var theAdd = res.result.formatted_address;
        var pois = res.result.pois;
        var detail = "";
        if (pois.length > 0) {
          var minDis = Number.POSITIVE_INFINITY;
          for (var i = 0; i < pois.length; i++) {
            var item = pois[i];
            // 以下是高德地图的地址转换
            // var location1 = item.location.split(",");
            // var distance = gpsHelper.distance(lon, lat, location1[0], location1[1]);
            var distance = gpsHelper.distance(
              lat,
              lon,
              item.point.y,
              item.point.x
            );
            if (minDis > distance) {
              minDis = distance;
              detail = distance1 + item.name + parseInt(distance) + metter;
            }
          }
          address = theAdd + "," + detail;
        } else {
          address = res.result.formatted_address;
        }
        callback_function(address);
        // console.log(new Date().getTime() - startTime + "ms", address);
      } else {
        callback_function(failAddr);
      }
    },
    error: function() {
      that.getSimpleLocation(lon, lat, callback_function);
    }
  });
};

Vue.prototype.getSimpleLocation = function(lon, lat, callback_function) {
  //获取简单的地址
  var key = "";
  if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
    //邓总的地址解析key
    key = "0AgpZMKch1Qp3OhCjpDkBVvMfkyBGGyB";
  } else {
    key = "EyqLUW841v6hI9NtcjEbrwkVi77xuakF";
  }
  var startTime = new Date().getTime();
  var lang = this.langType;
  var failAddr = lang == "en" ? "Fail to parse address" : "地址解析失败";
  $.ajax({
    type: "get",
    dataType: "jsonp",
    crossDomain: true,
    timeout: 15000,
    url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${key}&output=json&location=${lat},${lon}`,
    success: function(res) {
      if (res.status === 0) {
        var address = res.result.formatted_address;
        callback_function(address);
        console.log(new Date().getTime() - startTime + "ms", address);
      } else {
        callback_function(failAddr);
      }
    },
    error() {
      callback_function(failAddr);
    }
  });
};

// 高德地图地址转换
Vue.prototype.getGaoDeLocation = function(lon, lat, callback_function) {
  AMap.plugin("AMap.Geocoder", function() {
    var geocoder = new AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: "",
      extensions: "all"
    });

    var lnglat = [lon, lat];
    var address = "";
    geocoder.getAddress(lnglat, function(status, result) {
      if (status === "complete" && result.info === "OK") {
        console.log(result);
        callback_function(address);
        // result为对应的地理位置详细信息
      }
    });
  });
};
// 必应地图逆地址转换api （支持的语言的地址，默认是英文https://docs.microsoft.com/zh-cn/azure/azure-maps/supported-languages）
//https://dev.virtualearth.net/REST/v1/Locations/23.043678,20113.411274?includeEntityTypes=Address,Neighborhood,PopulatedPlace,Postcode1,AdminDivision1,AdminDivision2,CountryRegion&o=json&key=AisjCHWRd2ahuXBg61CeXfHV9vk1quAhnnn_lxQucGfCViu85UqqUR4zXOpqC-np&culture=zh-cn

// 谷歌地图地址编码 转换回来的都是英文的
Vue.prototype.getGoogleLocation = function(lat, lon, callback_function) {
  // console.log(lat, lon);
  var language = "en-us";
  // const key = "AIzaSyC_3-YZ6lTspWX8j_cLI7IcL9OUu_lDnkQ";
  const key = "AIzaSyBhnBVTRF-i2BNqJOxzKwzdH-4zMQ2bgCY";
  var lang = this.langType;
  const failAddr = lang == "en" ? "Fail to parse address" : "地址解析失败";
  $.ajax({
    type: "get",
    async: true,
    cache: true,
    processData: false,
    contentType: false,
    // dataType: "jsonp",
    // crossDomain: true,
    timeout: 15000,
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}&language=${language}`,
    success: function(data) {
      try {
        // console.log("google");
        // console.log(data);
        var address = "",
          city = "",
          state = "",
          state1 = "",
          zip = "",
          country = "",
          street_number = "",
          street = "",
          area = "",
          formattedAddress = "";
        for (var i = 0; i < data.results[0].address_components.length; i++) {
          var addr = data.results[0].address_components[i];
          // console.log(addr);
          if (addr.types[0] == "country") country = addr.long_name;
          else if (addr.types[0] == "street_address")
            // address 1
            address = address + addr.long_name;
          else if (addr.types[0] == "establishment")
            address = address + addr.long_name;
          else if (addr.types[0] == "route")
            // address 2
            address = address + addr.long_name;
          else if (addr.types[0] == "postal_code")
            // Zip 邮政
            zip = addr.short_name;
          else if (addr.types[0] == ["administrative_area_level_1"])
            // State
            state = addr.long_name;
          else if (addr.types[0] == ["administrative_area_level_2"])
            // State1
            state1 = addr.long_name;
          else if (addr.types[0] == ["locality"])
            // City
            city = addr.long_name;
          else if (addr.types[0] == ["political"])
            // area
            area = addr.long_name;
          else if (addr.types[0] == ["street_number"])
            // City
            street_number = addr.long_name;
          else if (addr.types[0] == ["premise"])
            // street
            street = addr.long_name;
        }
        if (data.results[0].formatted_address != null) {
          formattedAddress = data.results[0].formatted_address;
        }
        if (city == state1) {
          // console.log("dadada");
          data =
            street +
            street_number +
            "," +
            address +
            "," +
            area +
            "," +
            state +
            "," +
            state1 +
            "," +
            country;
        } else {
          data =
            street +
            street_number +
            "," +
            address +
            "," +
            area +
            "," +
            city +
            "," +
            state +
            "," +
            state1 +
            "," +
            country;
        }
        // data = formattedAddress;//地址
        callback_function(data);
      } catch (e) {
        console.log(e);
        callback_function(failAddr);
      }
    }
  });
};

//  天地图的逆地址解析
Vue.prototype.getTiandituPoiLocation = function(lng, lat, callback) {
  const key = "2ba31c8bc6886a815382e9458388aac3";
  let lang = window.localStorage.getItem("langType");
  let failAddr = lang == "en" ? "Fail to parse address" : "地址解析失败";
  var that = this;
  $.ajax({
    type: "get",
    async: true,
    cache: true,
    processData: false,
    contentType: false,
    timeout: 15000,
    url: `http://api.tianditu.gov.cn/geocoder?postStr={'lon':${lng},'lat':${lat},'ver':1}&type=geocode&tk=${key}`,
    success: res => {
      let data = JSON.parse(res);
      // console.log("data", data);
      if (data.msg == "ok") {
        var address = "";
        if (data.result) {
          address = data.result.formatted_address;
          callback(address);
        } else {
          callback(failAddr);
        }
      } else {
        that.getSimpleLocation(lng, lat, callback);
      }
    }
  });
};
