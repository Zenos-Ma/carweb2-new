import request from "@/utils/request.js";

import api from "@/utils/api.js";
import axios from "axios";

let contextPath = window.location.origin + "/carweb2/";
// 导入保单
export function doInPolicy(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.policyImport, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//批量导入sim流量到期时间
export function doBatchUpdateSimInfo(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.batchUpdateSim, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//批量更新sim流量到期时间
export function doBatchUpdateSimNewInfo(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.batchUpdateSimNew, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//批量更新设备SIM信息
export function doUpdateDeviceSim(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.updateDevSim, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//批量导入设备信息
export function doBatchAddDevice(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.batchAdd, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//批量导入设备信息
export function doBatchModifyDevice(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.batchModify, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// doBatchSim批量导入sim卡
export function doBatchSimInfo(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.batchSim, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 加载SIM卡列表
export function loadSimList(data) {
  return request({
    url: api.getSimList,
    method: "post",
    data: data
  });
}

// 更新流量到期时间
export function updateSimInfo(data) {
  return request({
    url: api.devFlowExpire,
    method: "post",
    data: data
  });
}

// 查询SIM卡信息
export function searchSimInfo(data) {
  return request({
    url: api.searchSim,
    method: "post",
    data: data
  });
}

// 用户反馈
export function loadFeedbackList(data) {
  return request({
    url: api.feedbackList,
    method: "post",
    data: data
  });
}

// 批量查询sim卡信息
export function batchSearchSimList(data) {
  return request({
    url: api.batchSearchSimInfo,
    method: "post",
    data: data
  });
}
