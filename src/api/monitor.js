import request from "@/utils/request.js";

import api from "@/utils/api.js";
import axios from "axios";

let contextPath = window.location.origin + "/carweb2/";

// 设备执行布防和撤防
export function doDefenseAction(data) {
  return request({
    url: api.defense,
    method: "post",
    data: data,
  });
}

// 获取当前设备的信息
export function updateDevice(data) {
  return request({
    url: api.updateDev,
    method: "post",
    data: data,
  });
}

// 记载设备指令记录
export function loadDeviceRecordInfo(data) {
  return request({
    url: api.commandRecord,
    method: "post",
    data: data,
  });
}

// 搜索设备信息
export function searchDevInfo(data) {
  return request({
    url: api.searchDevList,
    method: "post",
    data: data,
  });
}

// 加载设备列表
export function loadDeviceImeiList(data) {
  return request({
    url: api.deviceList,
    method: "post",
    data: data,
  });
}

// 根据设备号获取用户关系列表，为用户树展开
export function deviceRelationInfo(data) {
  return request({
    url: api.deviceRelation,
    method: "post",
    data: data,
  });
}

// 修改设备的密码
export function changeDevPwd(data) {
  return request({
    url: api.changePwdDev,
    method: "post",
    data: data,
  });
}

// 加载里程统计表格
export function loadDeviceMileage(data) {
  return request({
    url: api.runMileage,
    method: "post",
    data: data,
  });
}

// 加载设备超速统计
export function loadDeviceOverSpeed(data) {
  return request({
    url: api.runOverspeed,
    method: "post",
    data: data,
  });
}

// 加载设备停留统计
export function loadDeviceStay(data) {
  return request({
    url: api.runStay,
    method: "post",
    data: data,
  });
}

// 加载设备acc统计
export function loadDeviceACC(data) {
  return request({
    url: api.runACC,
    method: "post",
    data: data,
  });
}

// 加载设备运行总览
export function loadDeviceRunning(data) {
  return request({
    url: api.runAll,
    method: "post",
    data: data,
  });
}

// 加载统计表格
export function loadDeviceStatistics(data) {
  return request({
    url: api.alarmAll,
    method: "post",
    data: data,
  });
}

// 加载详单中的表格哦
export function loadDeviceDetail(data) {
  return request({
    url: api.alarmDevice,
    method: "post",
    data: data,
  });
}

// 导出设备的全部报警信息
export function exportDeviceAllAlarm(data) {
  return request({
    url: api.alarmExportByUser,
    method: "post",
    data: data,
  });
}

// 获取用户设备行程
export function loadTraveling(data) {
  return request({
    url: api.tripInfo,
    method: "post",
    data: data,
  });
}

// 查找行车总信息
export function loadAllTravelDetailInfomation(data) {
  return request({
    url: api.selectCarRunInfo,
    method: "post",
    data: data,
  });
}

// 获取语音列表
export function loadVoiceListInfo(data) {
  return request({
    url: api.devVoiceList,
    method: "post",
    data: data,
  });
}

// 上传语音
export function uploadRecording(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.sendVoice, data, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

// 删除语音
export function delDevAudio(data) {
  return request({
    url: api.delVoice,
    method: "post",
    data: data,
  });
}
