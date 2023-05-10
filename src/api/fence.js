import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 通过设备号查询围栏信息
export function loadFenceByImei(data) {
  return request({
    url: api.getFenceByImei,
    method: "post",
    data: data,
  });
}

// 保存更新围栏信息
export function doBatchSaveFence(data) {
  return request({
    url: api.batchSaveFense,
    method: "post",
    data: data,
  });
}

// 删除当前的围栏信息
export function doDeleteFence(data) {
  return request({
    url: api.deleteFence,
    method: "post",
    data: data,
  });
}

// 加载围栏关联的设备
export function loadLinkFenceDevice(data) {
  return request({
    url: api.getLinkDeviceByFenceId,
    method: "post",
    data: data,
  });
}

// 加载登录用户围栏列表
export function loadUserFenceList(data) {
  return request({
    url: api.getFenceByUserId,
    method: "post",
    data: data,
  });
}

// 取消围栏设备的关联
export function doUnLinkFence(data) {
  return request({
    url: api.unlinkFence,
    method: "post",
    data: data,
  });
}

// 设备与围栏一起关联
export function doLinkFence(data) {
  return request({
    url: api.linkFence,
    method: "post",
    data: data,
  });
}
