import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 设备充值
export function doRechargeCard(data) {
  return request({
    url: api.rechargeCard,
    method: "post",
    data: data,
  });
}

// 查询设备充值的情况
export function doSearchRechargeDevice(data) {
  return request({
    url: api.searchRechargeDev,
    method: "post",
    data: data,
  });
}



// 查询剩余的充值卡
export function loadCardNumber(data) {
  return request({
    url: api.getCardNum,
    method: "post",
    data: data,
  });
}

// 获取充值卡的原始价格
export function loadOriginCardPrice() {
  return request({
    url: api.getOriginCardPrice,
    method: "get",
  });
}

// 检查批量充值的设备号
export function batchRechargeDeviceInfo(data) {
  return request({
    url: api.rechargeBatchDevice,
    method: "post",
    data: data,
  });
}

// 加载充值列表
export function loadRechargeCardStorge(data) {
  return request({
    url: api.getRechargeCardStorage,
    method: "post",
    data: data,
  });
}

// 加载设备转移记录
export function loadDeviceTransferList(data) {
  return request({
    url: api.transferCardRecord,
    method: "post",
    data: data,
  });
}

// 转移充值卡
export function doTransferCard(data) {
  return request({
    url: api.transferRechargeCard,
    method: "post",
    data: data,
  });
}

// 批量充值
export function doBatchRechargeCard(data) {
  return request({
    url: api.batchRechargeCard,
    method: "post",
    data: data,
  });
}

// rechargePurchase
// 取消订单
export function doCancelBill(data) {
  return request({
    url: api.giveUpWXBill,
    method: "post",
    data: data,
  });
}

// 加载订单列表
export function loadRechargeCardBill(data) {
  return request({
    url: api.getRechargeCardBill,
    method: "post",
    data: data,
  });
}

// 制卡
export function doMakeRechargeCard(data) {
  return request({
    url: api.makeRechargeCard,
    method: "post",
    data: data,
  });
}

// 检查是否已经付款
export function isGetWxBillState(data) {
  return request({
    url: api.getWxBillState,
    method: "post",
    data: data,
  });
}

// 提交订单，生成预订单
export function doOrderBill(data) {
  return request({
    url: api.orderWxBill,
    method: "post",
    data: data,
  });
}

// 获取用户的折扣
export function getUserCardDiscountInfo(data) {
  return request({
    url: api.getUserCardDiscount,
    method: "post",
    data: data,
  });
}

//添加充值卡
export function addRechargeCard(data) {
  return request({
    url: api.addRechargeCardKind,
    method: "post",
    data: data,
  });
}

// 发送手机验证码
export function sendPhoneCode(data) {
  return request({
    url: api.sendCode,
    method: "post",
    data: data,
  });
}

// 验证手机的验证码
export function checkPhoneCode(data) {
  return request({
    url: api.checkCode,
    method: "post",
    data: data,
  });
}

// 保存原始的价格设置
export function saveOriginCardPrice(data) {
  return request({
    url: api.saveOriginCardPrice,
    method: "post",
    data: data,
  });
}

// 保存用户修改的折扣信息
export function saveUserCardDiscountInfo(data) {
  return request({
    url: api.saveUserCardDiscount,
    method: "post",
    data: data,
  });
}

// 强制审核订单
export function doForceFlowAudit(data) {
  return request({
    url: api.forceFlowAudit,
    method: "post",
    data: data,
  });
}

// 导出流量审核记录
export function doExportRecord() {
  return request({
    url: api.exportFlowDevice,
    method: "get",
  });
}

// 强制审核流量
export function doForceCardFlow(data) {
  return request({
    url: api.forceCardFlow,
    method: "post",
    data: data,
  });
}

// 审核流量
export function doAuditCardFlow(data) {
  return request({
    url: api.auditCardFlow,
    method: "post",
    data: data,
  });
}

// 加载订单的充值流量的设备
export function loadCardFlowDevice(data) {
  return request({
    url: api.getCardFlowDevice,
    method: "post",
    data: data,
  });
}

// 获取待处理的清单
export function loadWaitListInfo(data) {
  return request({
    url: api.getCardFlowAudit,
    method: "post",
    data: data,
  });
}
