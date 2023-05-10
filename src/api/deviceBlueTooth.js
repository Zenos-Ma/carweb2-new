import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 获取风控设备的蓝牙设备绑定记录
export function queryHistBtStatusList(data) {
  return request({
    url: api.queryHistBtStatusList,
    method: "post",
    data: data,
  });
}

// 获取当前风控设备的绑定情况
export function queryBlueToothStatus(data) {
  return request({
    url: api.queryBlueToothStatus,
    method: 'post',
    data: data
  })
}

