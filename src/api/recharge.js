import request from "@/utils/request.js";

import api from "@/utils/api.js";
import axios from "axios";

// 审核订单
export function dealAuditRecharge(data) {
  return request({
    url: api.auditRecharge,
    method: "post",
    data: data,
  });
}

// 获取待处理清单
export function loadWaitDeviceList(data) {
  return request({
    url: api.getAuditQueue,
    method: "post",
    data: data,
  });
}

// 强制结单
export function doForceFinish(data) {
  return request({
    url: api.forceFinish,
    method: "post",
    data: data,
  });
}

// root管理下添加套餐
export function rooAddGoods(data) {
  return request({
    url: api.addGoods,
    method: "post",
    data: data,
  });
}

// 继承上级用户套餐
export function doExtendSuperGoods(data) {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
  const url = "/carweb2/" + api.extendSuperGoods;
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

// 获取上级用户套餐
export function loadSuperGoods(data) {
  return request({
    url: api.getSuperGoods,
    method: "post",
    data: data,
  });
}

// 保存价目表格
export function savePriceList(data) {
  let config = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  };
  const url = "/carweb2/" + api.setPrice;
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

// 产品上架
export function onGoodsActive(data) {
  return request({
    url: api.activeGoods,
    method: "post",
    data: data,
  });
}

// 加载价格目录数据
export function loadPriceListInfo(data) {
  return request({
    url: api.getPriceList,
    method: "post",
    data: data,
  });
}

// 订单退款
export function doRefundBill(data) {
  return request({
    url: api.refundBill,
    method: "post",
    data: data,
  });
}

// 获取订单列表
export function loadDeviceBill(data) {
  return request({
    url: api.billSearch,
    method: "post",
    data: data,
  });
}

// 获取利润订单列表
export function loadProfitListInfo(data) {
  return request({
    url: api.profitSearch,
    method: "post",
    data: data,
  });
}

// 上级添加套餐
export function rootAddGoods(data) {
  return request({
    url: api.addGoods,
    method: "post",
    data: data,
  });
}

// 删除套餐
export function delGoodsTypeInfo(data) {
  return request({
    url: api.delGoodsType,
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

// 查询用户及下级统计的利润
export function summarySubUserProfit(data) {
  return request({
    url: api.summarySubUserProfit,
    method: "post",
    data: data,
  });
}
