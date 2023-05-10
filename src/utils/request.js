import axios from "axios";
import qs from "qs";
import LoginHelper from "@/utils/loginHelper.js";
//计算登录有效时间 不包括请求是否登录，获取报警信息
function addLoginTime(url) {
  if (
    url.indexOf("isLogin") == -1 &&
    url.indexOf("getMsgs") == -1 &&
    url.indexOf("logout1") == -1
  ) {
    window.localStorage.setItem(
      "carweb_time",
      new Date().getTime() + 1 * 60 * 60 * 1000
    );
  }
}

console.log("request");
const service = axios.create({
  // 联调
  baseURL: process.env.NODE_ENV === "production" ? `/carweb2` : "/carweb2",
  headers: {
    get: {
      "Content-Type": "application/json;charset=utf-8"
    },
    post: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  timeout: 30000,
  transformRequest: [
    data => {
      // console.log('data', data)
      data = qs.stringify(data, { indices: false });
      return data;
    }
  ],
  validateStatus() {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true;
  },
  transformResponse: [
    data => {
      if (typeof data === "string" && data.startsWith("{")) {
        data = JSON.parse(data);
      }
      return data;
    }
  ]
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log(config);
    addLoginTime(config.url);
    return config;
  },
  error => {
    // 错误抛到业务代码
    // console.log('error', error)
    error.data = {};
    error.data.msg = "Server exception, please contact the administrator!";
    // console.log("cacaaac");
    return Promise.resolve(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const status = response.status;
    // console.log('response', response);
    let msg = "";
    if (status < 200 || status >= 300) {
      // 处理http错误，抛到业务代码
      msg = response.msg;
      if (typeof response.data === "string") {
        response.data = { msg };
      } else {
        response.data.msg = msg;
      }
    }
    // console.log("response.data.msg", response);
    // console.log('status', status, status == 404, response.data.msg == 'undefined')
    // if(status == '404' && response.data.msg == 'undefined') {
    //   console.log('zhixingdasd')
    //   window.location.href = LoginHelper.redirectLocation();
    // }
    return response.data;
  },
  error => {
    // 错误抛到业务代码
    // console.log("error", error);
    error.data = {};
    error.data.msg = "请求超时或服务器异常，请检查网络或联系管理员！";
    return Promise.resolve(error);
  }
);

export default service;
