import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 查询当前用户相关账户信息
export function loadAccountMain() {
  return request({
    url: api.accountMain,
    method: "get",
  });
}

// 快速销售
export function quickSale(data) {
  return request({
    url: api.quickSale,
    method: "post",
    data: data,
  });
}

// 销售和转移的搜索设备
export function searchSellDev(data) {
  return request({
    url: api.searchSellDev,
    method: "post",
    data: data,
  });
}

// 充值卡搜索设备
export function searchRechargeDev(data) {
  return request({
    url: api.searchRechargeDev,
    method: "post",
    data: data,
  });
}

// 搜索保单号对应设备
export function searchInsuranceDevice(data) {
  return request({
    url: api.searchInsurance,
    method: "post",
    data: data,
  });
}

// 搜索设备
export function searchDevice(data) {
  return request({
    url: api.searchDevice,
    method: "post",
    data: data,
  });
}

// 批量销售
export function postBatchSale(data) {
  return request({
    url: api.batchSale,
    method: "post",
    data: data,
  });
}

// 搜索用户信息
export function loadUserListInfo(data) {
  return request({
    url: api.searchUser,
    method: "post",
    data: data,
  });
}

// 加载设备统计设备信息表格
export function loadStatisticDevices(data) {
  return request({
    url: api.statisticDevices,
    method: "post",
    data: data,
  });
}

// 加载设备统计数量
export function loadDevStatistic(data) {
  return request({
    url: api.devStatistics,
    method: "post",
    data: data,
  });
}

// 获取设备类型
export function loadDevModel() {
  return request({
    url: api.devModel,
    method: "get",
  });
}

// 加载处理过的报警信息
export function loadDealAlarmList(data) {
  return request({
    url: api.getDealMsgs,
    method: "post",
    data: data,
  });
}

// 保存处理报警信息
export function doSaveAlarmDeal(data) {
  return request({
    url: api.readDealMsg,
    method: "post",
    data: data,
  });
}

// 获取消息列表
export function loadMsgList(data) {
  return request({
    url: api.getInnerMsgIn7Days,
    method: "post",
    data: data,
  });
}

// 获取报警列表
export function loadAlarmDeviceList(data) {
  return request({
    url: api.getMsgs,
    method: "post",
    data: data,
  });
}

// 一键已读
export function doReadAllAlarmList(data) {
  return request({
    url: api.readAllMsgs,
    method: "post",
    data: data,
  });
}

//已读报警列表信息项
export function doReadMsg(data) {
  return request({
    url: api.readMsg,
    method: "post",
    data: data,
  });
}

// 加载企业的标题icon
export function loadQiyeIcon(data) {
  return request({
    url: api.queryBusinessIco,
    method: "post",
    data: data,
  });
}

// 加载企业logo
export function loadQiyeLogo(data) {
  return request({
    url: api.queryBusinessLogo,
    method: "post",
    data: data,
  });
}

// 修改更新企业的icon
export function updateQiyeIcon(data) {
  return request({
    url: api.renewBusinessIco,
    method: "post",
    data: data,
  });
}

// 修改更新企业的icon
export function updateQiyeLogo(data) {
  return request({
    url: api.updateBusinessLogo,
    method: "post",
    data: data,
  });
}

// 发送信息到下级
export function doSendMessages(data) {
  return request({
    url: api.sendMessages,
    method: "post",
    data: data,
  });
}

// 加载预约列表
export function loadAppointListInfo() {
  return request({
    url: api.appoint,
    method: "get",
  });
}

// 加载报警总数
export function loadAlarmNum(data) {
  return request({
    url: api.loadUserAlarmNum,
    method: "post",
    data: data,
  });
}
