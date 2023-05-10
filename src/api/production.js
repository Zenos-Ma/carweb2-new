import request from "@/utils/request.js";

import api from "@/utils/api.js";
import axios from "axios";
let contextPath = window.location.origin + "/carweb2/";
// 用户树选中用户
export function onSelectUserInfo(data) {
  return request({
    url: api.userInfo,
    method: "post",
    data: data
  });
}

// 查询设备的图片
export function loadDevicePhoto(data) {
  return request({
    url: api.queryDevPhoto,
    method: "post",
    data: data
  });
}

// 删除设备的图片
export function removePhoto(data) {
  return request({
    url: api.removeDevPhoto,
    method: "post",
    data: data
  });
}

// 查询设备的日志
export function loadDeviceLogInfo(data) {
  return request({
    url: api.queryDeviceLog,
    method: "post",
    data: data
  });
}

// 查询设备升级文件
export function queryFirmwareFile(data) {
  return request({
    url: api.queryFirmwareFile,
    method: "post",
    data: data
  });
}

// 修改升级文件
export function updateFirmwareFile(data) {
  return request({
    url: api.updateFirmwareFile,
    method: "post",
    data: data
  });
}

// 上传升级文件
export function addFirmwareFile(data) {
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(contextPath + api.sendVoice, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 删除型号版本号的关联
export function deleteModelGuangLianVersion(data) {
  return request({
    url: api.deleteModelGuangLianVersion,
    method: "post",
    data: data
  });
}

// 获取型号和版本号关联的列表
export function queryModelGuangLianVersion(data) {
  return request({
    url: api.queryModelGuangLianVersion,
    method: "post",
    data: data
  });
}

// 型号绑定版本号
// key为1， 型号
// key 为0， 版本号
export function addModelVersion(data) {
  return request({
    url: api.addModelVersion,
    method: "post",
    data: data
  });
}

// 通过型号去获取有效的版本号
export function queryValidAddList(data) {
  return request({
    url: api.queryValidAddList,
    method: "post",
    data: data
  });
}

// 获取所有的型号
export function queryValidModelList(data) {
  return request({
    url: api.queryValidModelList,
    method: "post",
    data: data
  });
}

// 获取可导入的设备型号信息或者版本号
// type 0： 设备型号
// type 1： 版本号
export function queryModelVersion(data) {
  return request({
    url: api.queryModelVersion,
    method: "post",
    data: data
  });
}

// 添加设备型号
export function addDeviceModel(data) {
  return request({
    url: api.addDeviceModel,
    method: "post",
    data: data
  });
}

// 获取设备升级列表
export function queryFirmwareUpdate(data) {
  return request({
    url: api.queryFirmwareUpdate,
    method: "post",
    data: data
  });
}

// 单个设备的升级
export function AddDeviceFirmware(data) {
  return request({
    url: api.AddDeviceFirmware,
    method: "post",
    data: data
  });
}

// 多个设备的升级
export function AddBatchDeviceFirmware(data) {
  return request({
    url: api.AddBatchDeviceFirmware,
    method: "post",
    data: data
  });
}

// 保存修改的升级配置
export function saveUpdateDeviceSetting(data) {
  return request({
    url: api.saveUpdateDeviceSetting,
    method: "post",
    data: data
  });
}

// 删除升级配置信息
export function deleteUpdateSetting(data) {
  return request({
    url: api.deleteUpdateSetting,
    method: "post",
    data: data
  });
}

// 查询设备升级记录
export function queryUpdateRecord(data) {
  return request({
    url: api.queryUpdateRecord,
    method: "post",
    data: data
  });
}

// 删除升级记录
export function deleteUpdateRecord(data) {
  return request({
    url: api.deleteUpdateRecord,
    method: "post",
    data: data
  });
}

// 查询设备版本号的信息
export function queryDeviceVersion(data) {
  return request({
    url: api.queryDeviceVersion,
    method: "post",
    data: data
  });
}
