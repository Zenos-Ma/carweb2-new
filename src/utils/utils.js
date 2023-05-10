import Vue from "vue";
import gpsHelper from "@/utils/gpsHelper";

Vue.prototype.judgmentTheTime = function(expireTime) {
  // 判断时间的大于30就会提醒
  if (expireTime != 0) {
    let nowTime = new Date().getTime();
    let flowTime = new Date(expireTime).getTime();
    let dates = Math.floor(
      Math.floor(flowTime - nowTime) / (1000 * 60 * 60 * 24)
    );
    return dates;
  }
};
// 判断是否存在中文
Vue.prototype.isChinese = function(str) {
  let patter = new RegExp("[\u4E00-\u9FA5]+");
  var flag = false;
  if (patter.test(str)) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
};

Vue.prototype.signFigures = function(num, rank = 12) {
  // 防止数值出现精度差的问题
  if (!num) return 0;
  const sign = num / Math.abs(num);
  const number = num * sign;
  const temp = rank - 1 - Math.floor(Math.log10(number));
  let ans;
  if (temp > 0) {
    ans = parseFloat(number.toFixed(temp));
  } else if (temp < 0) {
    ans = Math.round(number / Math.pow(10, temp)) * temp;
  } else {
    ans = Math.round(number);
  }
  return Math.abs(ans * sign);
};
// undefined和null转为空白字符串
Vue.prototype.$praseStrEmpty = function(str) {
  if (typeof str === "undefined" || str === null) {
    return "--";
  }
  return str;
};

Vue.prototype.disposeDeviceIcon = function(marker, isPick) {
  let stsIcon = "";
  let stsSelectIcon = "";
  if (marker.stsIcon && marker.stsIcon != "null") {
    stsIcon = this.API.staticResource + marker.stsIcon;
    stsSelectIcon = this.API.staticResource + marker.stsSelectIcon;
  } else {
    stsIcon = mapUtil.getMarkerIcon(marker, false);
    stsSelectIcon = mapUtil.getMarkerIcon(marker, true);
  }
  // if (isPick) {
  //   marker.iconPath = stsSelectIcon;
  //   marker.selectTag = true;
  // } else {
  marker.iconPath = stsIcon;
  marker.selectTag = false;
  // }
};
// 拿到script连接渲染地图
Vue.prototype.getTheMapScriptToBody = function(url) {
  const scriptUrl = url;
  const jsapi = document.createElement("script");
  jsapi.type = "text/javascript";
  jsapi.src = scriptUrl;
  document.head.appendChild(jsapi);
};

Vue.filter("fdate", function(val) {
  return val > 0
    ? new Date(parseInt(val)).format("yyyy-MM-dd")
    : val && /[0-9]+/.test(val)
    ? new Date(val).format("yyyy-MM-dd")
    : "--";
});
Vue.filter("fdatetime", function(val) {
  return val > 0
    ? new Date(parseInt(val)).format("yyyy-MM-dd hh:mm:ss")
    : val && /[0-9]+/.test(val)
    ? new Date(val).format("yyyy-MM-dd hh:mm:ss")
    : "--";
});
Vue.filter("fmoney", function(val) {
  return val && /[0-9]+/.test(val) ? parseFloat(val).toFixed(2) : "0";
});
Vue.filter("flatlng", function(val) {
  return val && /[0-9]+/.test(val) ? parseFloat(val).toFixed(6) : "0";
});

// 节流:触发函数事件后，短时间间隔内无法连续调用，
// 只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。
Vue.prototype.throttle = function(func, interval) {
  var timer = null;
  var last;
  var inter = interval || 200;
  return function() {
    var context = this;
    var now = +new Date();
    if (last && now - last < inter) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        func.apply(context, ...arguments);
      }, inter);
    } else {
      last = now;
      func.apply(context, ...arguments);
    }
  };
};
// 防抖:多次触发事件后，事件处理函数只执行一次，
// 并且是在触发操作结束时执行。
Vue.prototype.debounce = function(fn, delay) {
  let interval = delay || 200;
  let timer = null;
  return function() {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn.apply(context, ...arguments);
    }, interval);
  };
};

//搜索IMEI号至少要多少个字符
Vue.prototype.imeiLen = 5;

// 流量到期和平台到期提醒时间
Vue.prototype.minExpireTime = 30;

//不同时区的时间  moment
Vue.prototype.getZoneData = function(data) {
  let nowdata = new Date() + "";
  // console.log(nowdata);
  let existKeyWord = nowdata.indexOf("GMT");
  let nowzone = nowdata.substring(existKeyWord + 3, existKeyWord + 8);
  // console.log("nowzone", nowzone);
  // console.log(moment(data).utcOffset(nowzone));
  let dataMoment = moment(data)
    .utcOffset(nowzone)
    .format("YYYY-MM-DD HH:mm:ss");
  // console.log(dataMoment);
  return dataMoment;
};

// 判断对象是否是空值
Vue.prototype.isEmptyObject = function(obj) {
  if (typeof obj == "undefined" || obj == null) {
    return true;
  }
  for (let key in obj) {
    return false;
  }
  return true;
};

Vue.prototype.isPhoneNumber = function(number) {
  // 判断是否是11位数字的电话号码
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(number)) {
    return false;
  } else {
    return true;
  }
};

Vue.prototype.isIdCardNumber = function(num) {
  // 判断是否是正确的身份证号码
  const myreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!myreg.test(num)) {
    return false;
  } else {
    return true;
  }
};

Vue.prototype.generateTitle = function(title) {
  const hasKey = this.$te("route." + title);

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t("route." + title);

    return translatedTitle;
  }
  return title;
};
Vue.prototype.getStrLen = function(str) {
  //获取字符串长度 非ASCII码算两个字符
  var len = 0;
  str = str + "";
  str = str.replace(/\s/g, "");
  len = str.length;
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 126) {
      len += 1;
    }
  }
  return len;
};
Vue.prototype.getStrLen1 = function(str) {
  // 获取关键字查询结果
  var len = 0;
  str = str + "";
  str = str.replace(/\s/g, "");
  len = str.length;
  for (var i = 0; i < str.length; i++) {
    var code = str.charCodeAt(i);
    if (code > 126) {
      len += 5;
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      len += 3;
    }
  }
  return len;
};
//move-bar-v上下移动 87
Vue.prototype.moveVertical = function() {
  //上下移动
  $(".move-bar-v").mousedown(function() {
    var upPart = $(this).prev();
    var downPart = $(this).next();
    var h = $("#moving_page2").height() - 50;
    $("#moving_page2").show();
    var y = 0;

    function m(e) {
      if ($("#moving_page2").is(":visible")) {
        y = e.pageY;
        var yy = y - 50;
        if (yy < h * 0.3) {
          yy = h * 0.3;
        } else if (yy > h * 0.7) {
          yy = h * 0.7;
        }
        $(upPart).css("height", yy + "px");
        $(downPart).css("height", h - yy - 8 + "px");
      }
    }

    function mm() {
      if ($("#moving_page2").is(":visible")) {
        $("#moving_page2").hide();
        $("#moving_page2").off({
          mousemove: m
        });
      }
    }
    $("#moving_page2").on({
      mousemove: m,
      mouseup: mm
    });
  });
};
//move-bar-h左右移动
Vue.prototype.moveHoriztion = function() {
  //左右移动
  $(".move-bar-h").mousedown(function() {
    var leftPart = $(this).prev();
    var rightPart = $(this).next();
    var w = $("#moving_page1").width();
    $("#moving_page1").show();
    var x = 0;

    function m(e) {
      if ($("#moving_page1").is(":visible")) {
        x = e.pageX;
        var xx = x;
        if (xx < 300) {
          xx = 300;
        } else if (xx > w / 2) {
          xx = w / 2;
        }
        $(leftPart).css("width", xx + "px");
        $(rightPart).css("width", w - xx - 8 + "px");
      }
    }

    function mm() {
      if ($("#moving_page1").is(":visible")) {
        $("#moving_page1").hide();
        $("#moving_page1").off({
          mousemove: m
        });
      }
    }
    $("#moving_page1").on({
      mousemove: m,
      mouseup: mm
    });
  });
};
