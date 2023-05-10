import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 验证手机号码
export function getUserPhoneCode(data) {
  return request({
    url: api.getUserPhoneCode,
    method: "post",
    data: data,
  });
}

// 添加审核提现的信息
export function addWithdrawInfo(data) {
  return request({
    url: api.addWithdraw,
    method: "post",
    data: data,
  });
}

// 获取当前用户的提现金额的信息
export function getUserBalance(data) {
  return request({
    url: api.getUserBalance,
    method: "post",
    data: data,
  });
}

// 审核提现订单
export function auditWithdrawOrder(data) {
  return request({
    url: api.auditWithdrawOrder,
    method: "post",
    data: data,
  });
}

// 查询审核的记录
export function queryWithdrawList(data) {
  return request({
    url: api.queryWithdrawList,
    method: "post",
    data: data,
  });
}

// 查询用户的流水的记录
export function queryFlowList(data) {
  return request({
    url: api.queryFlowList,
    method: "post",
    data: data,
  });
}
