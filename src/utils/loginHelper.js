import API from "@/utils/api.js";
/** 登录重定向*/
function redirectLocation() {
  var www = window.location.origin;
  var search = window.location.search;

  var agent = window.navigator.userAgent.toLowerCase();
  // console.log(agent);
  // 判断是微信，手机浏览器还是pc端登录的 2021-8-2关掉
  if (/(micromessenger)/.test(agent)) {
    // //微信
    // if (/\.ndgps\./.test(www)) {
    //   return www + "/miniweb/";
    // }
    // 微信
    if (/\.ndgps\./.test(www)) {
      return "https://wxw.ndgps.com.cn/wxweb2/test/login/login.do?officialAccounts=ningd";
    } else {
      return "https://plat.basegps.com/wxweb2/test/login/login.do?officialAccounts=acy";
    }
  } else if (/(mobile)/.test(agent)) {
    // console.log("dada");
    // 移动端
    return API.mobilePath;
  }
  if (/\.qibogps\./.test(www)) {
    // 齐博
    return www + "/carweb2/v2/login/qibo/login.jsp";
  }
  if (/cargps\.cmlinker\.com/.test(www)) {
    // 移动
    return www + "/carweb2/v2/login/yidong/login.jsp";
  }
  if (/ndgps\./.test(www)) {
    // 宁达
    return www + "/carweb2/v2/login/ningd/login.jsp";
  }
  if (/z.zsmoto.cn\./.test(www)) {
    // 宙斯
    return www + "/carweb2/v2/login/zsmoto/login.jsp";
  }
  if (/yiyunzaixian\.com\./.test(www)) {
    // 易云在线
    return www + "/carweb2/v2/login/yiyunzaixian/login.jsp";
  }
  if (/domilink\.cn/.test(www)) {
    // 中信
    // return www + "/carweb2/v2/login/zhongxin/login.jsp";
    // return `${www}/carweb2/v4/index.html${search}#/`;//之前是想放在中性平台测试新ui的
  }
  if (/domilink\.com/.test(www)) {
    // 多米智联
    // return www + "/carweb2/v2/login/domilink/login.jsp";
    // return `${"https://domilink.com"}/carweb2/v3/index.html${search}#/`;
    // return "https://www.domilink.com#/";
    // return `${www}#/`;
    // return `${www}/carweb2/v3/index.html${search}#/`;
  }
  if (/finacy\.wiselink\.net\.cn/.test(www)) {
    return www + "/carweb2/v2/login/wiselink/login.jsp";
  }
  if (/gps\.neoway\.com/.test(www)) {
    console.log(/gps\.neoway\.com/.test(www));
    return `${www}/carweb/v3/index.html${search}#/`;
  }
  if (/\.basegps\./.test(www)) {
    return `${www}/carweb/v3/index.html${search}#/`;
  }
  // }
  //
  // console.log(`${window.location.origin}/${search}#/`);
  // return `${www}/carweb2/v3/index.html${search}#/`;
  return `${window.location.origin}/${search}#/`; // 香港
  // return `${www}/v4/index.html${search}#/`; //前端包海外测试
  // 2021-11-18
  // return `${www}/carweb2/v4/index.html${search}#/`;
}

function getTitle() {
  var www = window.location.origin;
  if (/\.qibogps\./.test(www)) {
    return "万置网";
  }
  if (/cargps\.cmlinker\.com/.test(www)) {
    return "和位综合服务平台";
  }
  if (/ndgps\./.test(www)) {
    return "宁达";
  }
  if (/z\.zsmoto\.cn/.test(www)) {
    return "宙斯摩托";
  }
  if (/yiyunzaixian\.com/.test(www)) {
    return "易云在线";
  }
  if (/domilink\.cn/.test(www)) {
    if (window.localStorage.getItem("carweb_user")) {
      var title1;
      if (JSON.parse(window.localStorage.getItem("carweb_user")).userName) {
        title1 = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userName;
      } else {
        var deviceNameStr = JSON.parse(
          window.localStorage.getItem("carweb_user")
        ).deviceImei;
        title1 = deviceNameStr.substring(deviceNameStr.length - 6);
      }

      return title1;
    } else {
      return "账户登录";
    }
  }
  if (/domilink\.com/.test(www)) {
    if (window.localStorage.getItem("carweb_user")) {
      var title2 = JSON.parse(window.localStorage.getItem("carweb_user"))
        .userName;
      if (JSON.parse(window.localStorage.getItem("carweb_user")).deviceImei) {
        var deviceName = JSON.parse(window.localStorage.getItem("carweb_user"))
          .deviceImei;
        deviceName = deviceName.substring(deviceName.length - 6);
      }
      if (title2) {
        return title2;
      } else {
        return deviceName;
      }
    } else {
      return "Account Login";
    }
  }
  if (/finacy\.wiselink\.net\.cn/.test(www)) {
    // 智信通
    if (window.localStorage.getItem("carweb_user")) {
      // console.log("123");
      var title4;
      if (JSON.parse(window.localStorage.getItem("carweb_user")).userName) {
        title4 = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userName;
      } else {
        var deviceNameStr4 = JSON.parse(
          window.localStorage.getItem("carweb_user")
        ).deviceImei;
        title4 = deviceNameStr4.substring(deviceNameStr4.length - 6);
      }
      return title4;
    } else {
      return "账户登录";
    }
  }
  if (/gps\.neoway\.com/.test(www)) {
    // 有方
    if (window.localStorage.getItem("carweb_user")) {
      // console.log("123");
      var title5;
      if (JSON.parse(window.localStorage.getItem("carweb_user")).userName) {
        title5 = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userName;
      } else {
        var deviceNameStr5 = JSON.parse(
          window.localStorage.getItem("carweb_user")
        ).deviceImei;
        title5 = deviceNameStr4.substring(deviceNameStr5.length - 6);
      }
      return title5;
    } else {
      return "账户登录";
    }
  }
  if (/47\.106\.103\.171/.test(www)) {
    // 测试
    if (window.localStorage.getItem("carweb_user")) {
      // console.log("123");
      var title6;
      if (JSON.parse(window.localStorage.getItem("carweb_user")).userName) {
        title6 = JSON.parse(window.localStorage.getItem("carweb_user"))
          .userName;
      } else {
        var deviceNameStr6 = JSON.parse(
          window.localStorage.getItem("carweb_user")
        ).deviceImei;
        title6 = deviceNameStr4.substring(deviceNameStr6.length - 6);
      }
      return title6;
    } else {
      return "账户登录";
    }
  }
  // 国内主要是是爱车易，国外是多米智联
  // return "domilink";
  return "爱车易";
}

function getLogo() {
  var www = window.location.origin;
  var iconLink = document.querySelector('link[rel="icon"]');
  if (/\.qibogps\./.test(www)) {
    document.title = "万置网";
    iconLink.href = API.logoPath + "qibo.png";
    // 齐博
    return API.logoPath + "qibo_logo.png";
  }
  if (/cargps\.cmlinker\.com/.test(www)) {
    document.title = "和位综合服务平台";
    iconLink.href = API.logoPath + "yidong_small.png";
    // 移动
    return API.logoPath + "yidong_logo.png";
  }
  if (/ndgps\./.test(www)) {
    document.title = "宁达";
    iconLink.href = API.logoPath + "ningda-small.jpg";
    // 宁达
    return API.logoPath + "ningd_logo.png";
  }

  if (/z\.zsmoto\.cn/.test(www)) {
    document.title = "摩托";
    iconLink.href = API.logoPath + "zsmoto.jpg";
    return API.logoPath + "logos.png";
  }

  // 2021-2-19
  if (/yiyunzaixian\.com/.test(www)) {
    document.title = "易云在线";
    iconLink.href = API.logoPath + "yiyun-logo.png";
    return API.logoPath + "yiyun-logo-cont.png";
  }

  if (/domilink\.cn/.test(www)) {
    iconLink.href = API.logoPath + "zhongxin-small.png";
    return API.logoPath + "zhongxin.png";
  }

  if (/domilink\.com/.test(www)) {
    // document.title = "Domilink";
    iconLink.href = API.logoPath + "domilink-logo.png";
    // return API.logoPath + "domilink-logo.jpg";
    return;
  }

  // if (/http:\/\/47\.106\.103\.171/.test(www)) {
  //   document.title = "Domilink";
  //   iconLink.href = API.logoPath + "domilink-logo.png";
  //   return API.logoPath + "domilink-logo.jpg";
  // }

  if (/finacy\.wiselink\.net\.cn/.test(www)) {
    // document.title = "智信通";
    iconLink.href = API.logoPath + "wiselink_logo.png";
    return API.logoPath + "wiselink_icon.png";
  }

  if (/gps\.neoway\.com/.test(www)) {
    // 有方
    iconLink.href = API.logoPath + "small-youfang.png";
    return API.logoPath + "youfang.png";
  }
  if (/47\.106\.103\.171/.test(www)) {
    //
  }

  // 国内主要是是爱车易，国外是多米智联
  // document.title = "爱车易";
  // iconLink.href = API.logoPath + "logo-small.png";
  // return API.logoPath + "LOGO.png";
  // if (/basegps/.test(www)) {
  // console.log("www", www);//本地开发时要是没有没有获取到就不会显示logo了
  document.title = "爱车易";
  iconLink.href = API.logoPath + "logo-small.png";
  return API.logoPath + "LOGO.png";
  // }
}
export default {
  getLogo,
  redirectLocation,
  getTitle
};
