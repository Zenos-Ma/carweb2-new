import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 解綁当前设备与路线的关系
export function removeDevicePlan(data) {
  return request({
    url: api.removeDevicePlanTrack,
    method: "post",
    data: data
  });
}

// 获取已经绑定的设备列表
export function loadBondedDevice(data) {
  return request({
    url: api.getBondedDeviceList,
    method: "post",
    data: data
  });
}

// 绑定设备和线路
export function bondDevicePlan(data) {
  return request({
    url: api.bondDevicePlanTrack,
    method: "post",
    data: data
  });
}

// 删除路线规划
export function removePlanTrack(data) {
  return request({
    url: api.delPlanTrack,
    method: "post",
    data: data
  });
}

// 添加路线规划的路线
export function addPlanTrack(data) {
  return request({
    url: api.addPlanTrack,
    method: "post",
    data: data
  });
}

// 获取路线规划的列表
export function getPlanTrack(data) {
  return request({
    url: api.getPlanTrack,
    method: "post",
    data: data
  });
}

// 获取可绑定的设备列表
export function getAbleDeviceList(data) {
  return request({
    url: api.getAddList,
    method: "post",
    data: data
  });
}
