import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 设备快速转移
export function quickTransferDev(data) {
  return request({
    url: api.quickTransfer,
    method: "post",
    data: data,
  });
}

// 设备批量下发命令
export function sendDeviceCmd(data) {
  return request({
    url: api.sendCmd,
    method: "post",
    data: data,
  });
}

//检查导入的表格中的设备呢能否执行初始化
export function checkDeviceListInfo(data) {
  return request({
    url: api.checkDeviceInitialized,
    method: "post",
    data: data,
  });
}

// 执行设备初始化
export function doDeviceInit(data) {
  return request({
    url: api.deviceInitialized,
    method: "post",
    data: data,
  });
}

// 获取设备的所有设备
export function loadDeviceInfo(data) {
  return request({
    url: api.getDevs,
    method: "post",
    data: data,
  });
}

// 登出
export function doLogout() {
  return request({
    url: api.logout,
    method: "get",
  });
}

// 搜索设备表格设备
export function searchCustomerDevs(data) {
  return request({
    url: api.searchInUser,
    method: "post",
    data: data,
  });
}

// 获取用户树选中的用户
export function getUserTreeInfo(data) {
  return request({
    url: api.userInfo,
    method: "post",
    data: data,
  });
}

// 加载子账号表格list
export function loadChildrenUserInfo(data) {
  return request({
    url: api.getChildUsers,
    method: "post",
    data: data,
  });
}

// 删除用户
export function doDeleteUserInfo(data) {
  return request({
    url: api.deleteUser,
    method: "post",
    data: data,
  });
}

// 转移用户
export function moveUser(data) {
  return request({
    url: api.moveUser,
    method: "post",
    data: data,
  });
}

// 查询用户统计的利润
export function summaryProfit(data) {
  return request({
    url: api.summaryProfit,
    method: "post",
    data: data,
  });
}

// 查询用户包含下级统计的利润
export function summarySubUserProfit(data) {
  return request({
    url: api.summarySubUserProfit,
    method: "post",
    data: data,
  });
}

// 查询三一起重用户下设备安装记录
export function exportSanYiInstallLogAll(data) {
  return request({
    url: api.selectInstallInfoLogAll,
    method: "post",
    data: data
  })
}
