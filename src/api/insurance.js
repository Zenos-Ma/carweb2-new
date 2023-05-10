import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 保存保单的信息
export function doSavePolicy(data) {
  return request({
    url: api.savePolicy,
    method: "post",
    data: data,
  });
}

// 加载保单信息
export function loadInsuranceInfo(data) {
  return request({
    url: api.getPolicy,
    method: "post",
    data: data,
  });
}

// 获取保单的类型
export function loadPolicyType() {
  return request({
    url: api.getPolicyType,
    method: "get",
  });
}

// 获取所有的保单
export function loadAllInsurance(data) {
  return request({
    url: api.allInsurance,
    method: "post",
    data: data
  })
}

// 获取当前用户的保单
export function loadInsuranceList(data) {
  return request({
    url: api.insuranceList,
    method: 'post',
    data: data
  })
}

// 获取当前的设备的保单的详情
export function loadDeviceInsurance(data) {
  return request({
    url: api.insuranceRecord1,
    method: "post",
    data: data
  })
}
