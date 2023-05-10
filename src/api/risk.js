import request from "@/utils/request.js";

import api from "@/utils/api.js";

// 查询进出二押点统计
export function loadTurnoverAlarmInfo(data) {
  return request({
    url: api.queryTurnoverAlarmInfo,
    method: "post",
    data: data,
  });
}

// 二押点停留统计
export function loadPledgeStayInfo(data) {
  return request({
    url: api.queryStayAlarmInfo,
    method: "post",
    data: data,
  });
}

// 查询时长统计
export function loadDeviceStatusInfo(data) {
  return request({
    url: api.queryRealTimeAlarmInfo,
    method: "post",
    data: data,
  });
}

// 查询设备关联的围栏
export function loadDevicePledgeInfo(data) {
  return request({
    url: api.getRdListByImei1,
    method: "post",
    data: data,
  });
}

// 查询本地的json文件的数据
export function loadProvinceInfo(data) {
  return request({
    url: api.staticIcon + "json/" + data.name + ".json",
    method: "get",
  });
}

// 加载自定义二押点列表
export function loadCustPledgeList(data) {
  return request({
    url: api.getRdList,
    method: "post",
    data: data,
  });
}

// 加载围栏关联的设备
export function loadLinkDeviceInfo(data) {
  return request({
    url: api.getRdrList1,
    method: "post",
    data: data,
  });
}

// 保存二押点信息
export function batchSavePledgeInfo(data) {
  return request({
    url: api.batchSavePledge,
    method: "post",
    data: data,
  });
}

// 删除二押点
export function doDeletePledge(data) {
  return request({
    url: api.batchDelPledge,
    method: "post",
    data: data,
  });
}

// 直接取消关联二押点
export function unLinkPledge(data) {
  return request({
    url: api.delRdrByImeiAndRdId,
    method: "post",
    data: data,
  });
}

// 直接设备关联二押点
export function onLinkPledge(data) {
  return request({
    url: api.getRiskWithImeiRelation,
    method: "post",
    data: data,
  });
}

// 加载二押点列表
export function loadPledgeListInfo(data) {
  return request({
    url: api.getRdList,
    method: "post",
    data: data,
  });
}

// 通过设备查询二押点的信息
export function loadDevPledgeInfo(data) {
  return request({
    url: api.getFenceByImei,
    method: "post",
    data: data,
  });
}

// 获取车辆信息
export function loadVehicleList(data) {
  return request({
    url: api.getVehicleList,
    method: "post",
    data: data,
  });
}

// 删除车辆信息
export function deleteVehicleInfo(data) {
  return request({
    url: api.deleteVehicle,
    method: "post",
    data: data,
  });
}

// 删除设备车辆关联关系
export function deleteVehicleRelation(data) {
  return request({
    url: api.delVehicleRelation,
    method: "post",
    data: data,
  });
}

// 修改更新车辆设备关联关系信息
export function updateVehicleDevRelation(data) {
  return request({
    url: api.updVehicleRelation,
    method: "post",
    data: data,
  });
}

// 修改跟新车辆信息
export function updateVehicleInfo(data) {
  return request({
    url: api.updateVehicle,
    method: "post",
    data: data,
  });
}

// 上传安装的信息
export function uploadVehicleInstallInfo(data) {
  return request({
    url: api.addVehicleRelation,
    method: "post",
    data: data,
  });
}

// 查询设备车辆关联关系列表
export function queryVehicleRelationListInfo(data) {
  return request({
    url: api.queryVehicleRelationList,
    method: "post",
    data: data,
  });
}

// 新增车辆信息
export function uploadBatchSaveVehicle(data) {
  return request({
    url: api.batchSaveVehicle,
    method: "post",
    data: data,
  });
}
