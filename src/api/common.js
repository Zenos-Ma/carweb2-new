import request from "@/utils/request.js";

import api from "@/utils/api.js";
import axios from "axios";
import qs from "qs";

// 报警音效
export function changeAlertAudio(data) {
  return request({
    url: api.getMsgs,
    method: "post",
    data: data
  });
}

// 点击报警信息已读
export function readMsgList(data) {
  return request({
    url: api.readMsg,
    method: "post",
    data: data
  });
}

// 通过设备获取客户关系数据
export function loadDeviceRelation(data) {
  return request({
    url: api.deviceRelation,
    method: "post",
    data: data
  });
}

// 重置用户密码
export function resetPwd(data) {
  return request({
    url: api.resetPwd,
    method: "post",
    data: data
  });
}

// 重置设备密码
export function resetDevPwd(data) {
  return request({
    url: api.resetPwdDev,
    method: "post",
    data: data
  });
}

// 获取客户的关系的数据
export function loadUserRelation(data) {
  return request({
    url: api.userRelation,
    method: "post",
    data: data
  });
}

// 获取用户具体信息
export function loadUserInfo(data) {
  return request({
    url: api.userDetail,
    method: "post",
    data: data
  });
}

// 保存用户信息
export function saveUserInfo(data) {
  return request({
    url: api.saveUser,
    method: "post",
    data: data
  });
}

// 获取登录用户的信息
export function getUserInfo() {
  return request({
    url: api.main1,
    method: "get"
  });
}

// 获取用户的权限信息
export function loadUserPermission(data) {
  return request({
    url: api.getUserPermission,
    method: "post",
    data: data
  });
}

// 更新用户的权限信息
export function updateUserPermission(data) {
  return request({
    url: api.updateUserPermission,
    method: "post",
    data: data
  });
}

// 批量转移设备
export function batchTransferDev(data) {
  return request({
    url: api.batchTransfer,
    method: "post",
    data: data
  });
}

// 查询设备的详情信息
export function getDeviceDetail(data) {
  return request({
    url: api.deviceDetail,
    method: "post",
    data: data
  });
}

// 新增新的用户
export function addUserInfo(data) {
  return request({
    url: api.addUser,
    method: "post",
    data: data
  });
}

// 获取iccid流量到期时间
export function loadFlowExpireInfo(data) {
  return request({
    url: api.devFlowExpire,
    method: "post",
    data: data
  });
}

// 获取设备车辆关联关系信息
export function loadDeviceCarRelationInfo(data) {
  return request({
    url: api.queryCarDeviceInfo,
    method: "post",
    data: data
  });
}

// 编辑设备车辆的信息
export function batchCarDeviceRelationInfo(data) {
  return request({
    url: api.editCarDevice,
    method: "post",
    data: data
  });
}

// 保存设备的基本信息
export function saveDeviceInfo(data) {
  return request({
    url: api.saveDevice,
    method: "post",
    data: data
  });
}

// 检查设备的密码是否正确
export function checkDevicePwd(data) {
  return request({
    url: api.checkDevicePwd,
    method: "post",
    data: data
  });
}

// 发送指令
export function sendDeviceCmd(data) {
  return request({
    url: api.sendCmd,
    method: "post",
    data: data
  });
}

// 查询设备的报警的开光
export function loadAlarmDevSwitch(data) {
  return request({
    url: api.queryAlertSwitch,
    method: "post",
    data: data
  });
}

// 保存设备的报警开光设置
export function updateAlarmDevSwitch(data) {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  };
  const url = "/carweb2/" + api.updateAlertSwitch;
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

// 获取当前的用户的子用户
export function getUserTreeExpand(data) {
  let config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  };
  return new Promise((resolve, reject) => {
    axios
      .post(api.userTreeExpand, qs.stringify(data, { indices: false }), config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// 搜索用户
export function searchUserInfo(data) {
  return request({
    url: api.searchUser,
    method: "post",
    data: data
  });
}

// 获取用户某用户id的用户信息并加载对应的用户树
export function getUserInfoMation(data) {
  return request({
    url: api.getUserInfo,
    method: "post",
    data: data
  });
}

// 获取用户的关系，并递归展开至该用户/
export function getUserRelation(data) {
  return request({
    url: api.userRelation,
    method: "post",
    data: data
  });
}

// 设备激活
export function doDeviceActive(data) {
  return request({
    url: api.enableDevice,
    method: "post",
    data: data
  });
}

// 通过设备拿到用户信息
export function loadAgent(data) {
  return request({
    url: api.agent,
    method: "post",
    data: data
  });
}

// 获取设备的图标
export function loadTheDeviceIcon(data) {
  return request({
    url: api.queryDevIcon,
    method: "post",
    data: data
  });
}

// 上传更新设备的图标
export function updateDevIcon(data) {
  // return request({
  //   url: api.updateDevIcon,
  //   method: "post",
  //   data: data,
  // });
  let config = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    dataType: "json"
  };
  const url = "/carweb2/" + api.updateDevIcon;
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify(data), config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

//修改设备定位信息
export function updateDeviceLocation(data) {
  return request({
    url: api.updateDeviceLocation,
    method: "post",
    data: data
  });
}

// 查询三一起重的安装记录
export function loadSanyiInstallLogImei(data) {
  return request({
    url: api.queryInstallLogImei,
    method: "post",
    data: data
  });
}

// 判断是否是三一起重的设备
export function isSanyiDevice(data) {
  return request({
    url: api.isTrinity,
    method: "post",
    data: data
  });
}

// 查询电话报警的详情
export function loadPhoneNotify(data) {
  return request({
    url: api.alertNotifyDetail,
    method: "post",
    data: data
  });
}

// 判断是否是康骑的
export function isKangqi() {
  return request({
    url: api.superParentUser,
    method: "get"
  });
}

// 修改电话报警设置
export function updateAlertNotifyInfo(data) {
  return request({
    url: api.updateAlertNotify,
    method: "post",
    data: data
  });
}

// 查询报警的详情的
export function queryDeviceAlertNotify(data) {
  return request({
    url: api.alertNotifyDetail,
    method: "post",
    data: data
  });
}

// 批量保存电话报警通知
export function batchSavePhoneAlertNotify(data) {
  return request({
    url: api.batchUpdateAlertNotify,
    method: "post",
    data: data
  });
}

// 手机号码绑定一个设备
export function singelTelBond(data) {
  return request({
    url: api.updateSingelTel,
    method: "post",
    data: data
  });
}

// 手机号码绑定多个设备
export function batchTelBond(data) {
  return request({
    url: api.batchBondTel,
    method: "post",
    data: data
  });
}

// 绑定手机号码发送验证码
export function sendPhoneCode(data) {
  return request({
    url: api.sendSmsCode,
    method: "post",
    data: data
  });
}

// 查询设备的电话报警的开关
export function queryPhoneAlertSwitch(data) {
  return request({
    url: api.queryPhoneAlertSwitch,
    method: "post",
    data: data
  });
}

// 更新修改设备的电话报警的开光
export function updatePhoneAlertSwitch(data) {
  return request({
    url: api.updatePhoneAlertSwitch,
    method: "post",
    data: data
  });
}

// 获取设备的数据
export function getDeviceDateInfo(data) {
  return request({
    url: api.getDeviceData,
    method: "post",
    data: data
  });
}

// 设备统计数据
export function loadDevStatistics(data) {
  return request({
    url: api.devStatistics,
    method: "post",
    data: data
  });
}

// 获取当前用户的所有的设备数据
export function loadDevDate(data) {
  return request({
    url: api.getDevs,
    method: "post",
    data: data
  });
}

// 获取当前用户的子用户的数据
export function loadChildUsers(data) {
  return request({
    url: api.getChildUsers,
    method: "post",
    data: data
  });
}

// 获取ip地址信息
export function getApiInfo() {
  return request({
    url: api.getApiInfo,
    method: "get"
  });
}
