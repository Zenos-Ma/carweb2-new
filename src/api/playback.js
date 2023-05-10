import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 查询设备的历史轨迹
export function loadDeviceTrackRecord(data) {
  return request({
    url: api.trackRecord,
    method: "post",
    data: data,
  });
}

// 获取设备最近的定位信息
export function loadUpdateDevice(data) {
  return request({
    url: api.updateDev,
    method: "post",
    data: data,
  });
}

// 下载kml格式的文件
export function downloadTrack(data) {
  return request({
    url: api.recordKml,
    method: "post",
    data: data,
  });
}
