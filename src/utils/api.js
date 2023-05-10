// 2021-12-02

var contextPath = window.location.origin + "/carweb2/";
var contextStatic = window.location.origin + "/carweb/";
export default {
  apkPath: "https://www.basegps.com/updateapk/domilinkV2.4.apk",
  // staticResource: "http://test.domilink.cn:8888/", //线上的前缀
  staticResource: "https://file.basegps.com/", //最新的线上静态资源的地址
  // staticResource: "https://file.domilink.com/", //海外的
  // staticResource: "http://task.domilink.cn:8088/", //本地服务器
  contextPath,
  staticIcon: contextStatic + "v3/static/",
  logoPath: contextStatic + "v3/static/logo/",
  loginPath: contextStatic + "v3/index.html#/",
  mobilePath: contextStatic + "mobile/index.html#/",
  isLogin: contextPath + "v2/login/isLogin.action",
  loginCheck: contextPath + "v2/login/loginCheck.action", //String loginType,UserAccount user, Devices dev, String checkPwd1, String checkPwd2
  getUserInfo: contextPath + "v2/user/getUserInfo.action", //int userId
  main1: contextPath + "v2/login/home1.action",
  agent: contextPath + "v2/device/agent1.action",
  accountMain: contextPath + "v2/customer/main1.action",
  logout: contextPath + "v2/login/logout1.action",
  searchDevice: contextPath + "v2/device/globalSearch.action", //Integer userId, String key,Integer overflow
  searchUser: contextPath + "v2/user/globalSearch.action", //Integer userId,String key, Integer overflow
  getAllChildUserId: contextPath + "v2/user/api/getChildrenByParentId.action",
  getMsgs: contextPath + "v2/alert/api/getMsgs.action", //int page, int pageSize, boolean nrOnly,Integer hasVoice
  readMsg: contextPath + "v2/alert/api/readMsg.action", //int msgId
  readAllMsgs: contextPath + "v2/alert/api/readAllMsgs.action", //int userId
  getInnerMsgIn7Days: contextPath + "v2/alert/api/getInnerMsgIn7Days.action", //Integer userId
  sendMessages: contextPath + "v2/alert/api/sendMessages.action", //Integer[] userId,boolean recursion,String title, String content
  quickSale: contextPath + "v2/sell/api/fastSell.action", //Integer toUserId,String deviceImei, Long platformExpire, String validYear, String remark,String deviceSim, String iccid, String supplier
  // checkDevice: contextPath + 'v2/sell/api/checkDevice.action', //String content,boolean simplify
  batchSale: contextPath + "v2/sell/api/packSell.action", //Integer toUserId, Long expireTime, String file
  batchSaleFile: contextPath + "v2/sell/api/batchSellXls.action", //int toUserId, MultipartFile file
  batchSaleXls: contextStatic + "v3/static/import_export/model/sell_model.xls",
  batchSaleXls1:
    contextStatic + "v3/static/import_export/model/sell_model_r.xls",
  batchModify: contextPath + "v2/import-export/batchModify.action",
  batchAdd: contextPath + "v2/import-export/batchAdd.action",
  batchAddXls: contextStatic + "v3/static/import_export/model/import_model.xls",
  batchAddXls1:
    contextStatic + "v3/static/import_export/model/import_model_update.xls",
  batchSimXls:
    contextStatic + "v3/static/import_export/model/import_simcard.xls",
  batchSim: contextPath + "v2/import-export/batchAddSimCard.action",
  batchCmd: contextPath + "v2/device/api/packageCommand.action",
  batchCmdFile: contextStatic + "v3/static/doc/device-command.xls",
  batchInitFile: contextStatic + "v3/static/doc/device-template.xls",
  batchRechargeFile: contextStatic + "v3/static/doc/device-recharge.xls",
  getSimList: contextPath + "v2/simcard/getAllSimCard.action",
  searchSim: contextPath + "v2/simcard/searchSimCard.action",
  quickTransfer: contextPath + "v2/sell/api/fastMove.action", //toUserId remark deviceImei deviceSim
  batchTransfer: contextPath + "v2/sell/api/packMove.action", //toUserId file
  batchTransferFile: contextPath + "v2/sell/api/batchMoveXls.action",
  batchTransferXls:
    contextStatic + "v3/static/import_export/model/move_model.xls",
  batchTransferXls1:
    contextStatic + "v3/static/import_export/model/move_model_r.xls",
  batchUpdateSim:
    contextPath + "v2/import-export/batchAddSimCardFlowExpiry.action",
  batchUpdateSimXls:
    contextStatic +
    "v3/static/import_export/model/add_simcard_flow_expiry_model.xls",
  updateDevSim:
    contextPath + "v3/importDevice-export/batchUpdateDeviceExpiry.action",
  updateDevSimXls:
    contextStatic +
    "v3/static/import_export/model/import_simcard_expiry_model.xls",
  policyXls:
    contextStatic + "v3/static/import_export/model/import_policy_model.xls",
  policyImport: contextPath + "import_policy/batch_policy.action",
  appoint: contextPath + "presell/all.action",
  userTreeExpand: contextPath + "v2/monitor/api/uexpand.action", //userId
  getChildUsers: contextPath + "v2/customer/api/getChildUsers.action", //userId pageSize page
  userInfo: contextPath + "v2/customer/api/userInfo.action", //userId
  getDevs: contextPath + "v2/customer/api/getDevs.action", //userId dispLv tFilt tFrom tTo pageSize page alreadyExpire
  searchInUser: contextPath + "v2/customer/api/searchInUser.action", //key userId page pageSize
  resetPwd: contextPath + "v2/user/api/resetPassword.action", //userId
  userDetail: contextPath + "v2/user/edit/userDetail.action", //userId
  saveUser: contextPath + "v2/user/api/saveDetail.action", //userId  userName loginNo userType linkman tel addr lowerAlert
  userRelation: contextPath + "v2/user/relation1.action", //userId
  deleteUser: contextPath + "v2/user/api/delete.action", //userId
  addUser: contextPath + "v2/user/api/create.action",
  changePwd: contextPath + "v2/user/api/changePassword.action", //oldPwd newPwd
  changePwdDev: contextPath + "v2/device/api/changePassword.action",
  deviceDetail: contextPath + "v2/device/api/getDetail.action", //String deviceImei
  deviceRelation: contextPath + "v2/device/relation1.action", //String deviceImei
  resetPwdDev: contextPath + "v2/device/api/resetPassword.action", //deviceImei
  devFlowExpire: contextPath + "v2/simcard/getFlowExpiry.action", //deviceImei
  saveDevice: contextPath + "v2/device/api/setDetail.action",
  savePolicy: contextPath + "v2/device/api/savePolicy.action",
  exportPolicy: contextPath + "v2/device/api/exprPolicy.action",
  getPolicy: contextPath + "v2/device/edit/api/policy.action",
  commandRecord: contextPath + "v2/device/api/cmdHist.action", //deviceImei page pageSize
  sendCmd: contextPath + "v2/device/api/sendCmd.action",
  auditRecharge: contextPath + "v2/pay/api/rechargePay.action", //extId deviceImei
  forceFinish: contextPath + "v2/charge/api/forceFinish.action", //externalId
  getAuditQueue: contextPath + "v2/pay/api/getAuditQueue.action", //pageSize page status
  getPolicyType: contextPath + "v2/device/edit/policy1.action",
  getInsurance: contextPath + "v2/device/edit/api/policy.action",
  exportInsurance: contextPath + "v2/device/api/exprPolicy.action",
  allInsurance: contextPath + "/v2/policy/api/globalSearch.action",
  searchInsurance: contextPath + "v2/device/api/searchPolicyId.action",
  //searchInDevice:contextPath + 'v2/device/globalSearch.action',
  searchSellDev: contextPath + "v2/sell/api/searchDevice.action",
  exportPolicyFile: contextPath + "v2/policy/api/exprFile.action",
  getPriceList: contextPath + "v2/pay/api/goods.action", //userId
  addGoods: contextPath + "v2/pay/api/addGoods.action",
  getSuperGoods: contextPath + "v2/pay/api/super_goods.action",
  extendSuperGoods: contextPath + "v2/pay/api/extends_goods.action",
  setPrice: contextPath + "v2/pay/api/setPrice.action",
  activeGoods: contextPath + "v2/pay/api/enableGoods.action",
  refundBill: contextPath + "v2/charge/api/forceRefund.action",
  exportOrders: contextPath + "v2/pay/api/exportOrders.action",
  // billListfitList: contextPath + 'v2/device/listAll.action',
  billSearch: contextPath + "v2/pay/api/rootSearch.action", //externalId deviceImei userId pageSize page  errOnly
  profitSearch: contextPath + "v2/charge/profit/list.action", //externalId deviceImei userId pageSize page  errOnly
  // profitList: contextPath + 'v2/device/listAll.action', //userId
  feedbackList: contextPath + "v2/opinion/api/getOpinions.action", //page pageSize
  // commandList: contextPath + 'v2/system/getSuperCmdBatch.action', //page pageSize
  // commandList1: contextPath + 'v2/system/api/getSuperCmdBatchDetail.action', //page pageSize batchId
  insuranceList: contextPath + "v2/policy/api/globalSearch.action", //
  insuranceRecord: contextPath + "v2/policy/api/initPolicyRecord.action", //
  insuranceRecord1: contextPath + "v2/policy/api/getModifyRecords.action", //deviceImei policyId
  deviceList: contextPath + "v2/monitor/api/updDevs.action", //userId
  searchDevList: contextPath + "v2/monitor/api/schDevs.action", //userId key
  updateDev: contextPath + "v2/monitor/api/updMapDev.action", //deviceImei
  defense: contextPath + "v2/device/api/defense.action", //isDefense deviceImei radius
  getDeviceData: contextPath + "v2/monitor/api/getDeviceData.action",
  runStay: contextPath + "v2/summary/runStay.action", //t_start t_end page pageSize deviceImei
  runAll: contextPath + "v2/summary/runAll.action", //t_start t_end page pageSize deviceImei
  runOverspeed: contextPath + "v2/summary/runOverspeed.action", //t_start t_end page pageSize deviceImei
  runMileage: contextPath + "v2/summary/runMileage.action", //t_start t_end page pageSize deviceImei
  runACC: contextPath + "v2/summary/accRecord.action",
  alarmAll: contextPath + "v2/summary/alarmAll.action", //t_start t_end page pageSize deviceImei
  alarmDevice: contextPath + "v2/summary/alarmDevice.action", //t_start t_end page pageSize deviceImei
  alarmExportByUser: contextPath + "v2/alert/api/exportMsg.action",
  trackRecord: contextPath + "v2/record/api/record.action",
  recordKml: contextPath + "v2/record/api/recordKml.action",
  trackIcon: contextStatic + "v3/static/playback/",
  runIcon: contextStatic + "v3/static/playback/arrow-90.png",
  saveFence: contextPath + "v3/device/defense.action",
  devModel: contextPath + "v2/monitor/all_dev/models.action",
  devStatistics: contextPath + "v2/monitor/monitor_device_statistics.action",
  statisticDevices:
    contextPath + "v2/monitor/export/monitor_device_statistics_message.action",
  // uploadBugImage: bugPath + 'bugIndex.php?event=uploadBugImage',
  // addBug: bugPath + 'bugIndex.php?event=addBug',
  // getBugList: bugPath + 'bugIndex.php?event=getBugList',
  // getBugDetail: bugPath + 'bugIndex.php?event=getBugDetail',
  // uploadPath: bugPath + 'upload/',
  // testPath: bugPath + 'myTest.php',
  // zentaoPath,
  // projectList: bugPath + 'bugIndex.php?event=getProjectList',
  // bugUserList: bugPath + 'bugIndex.php?event=getUserList',
  // doneBug: bugPath + 'bugIndex.php?event=doneBug',
  getFenceByUserId: contextPath + "v3/device/getRdList.action",
  batchSaveFense: contextPath + "v3/device/batchSaveFense.action",
  deleteFence: contextPath + "v3/device/batchDelFense.action",
  unlinkFence: contextPath + "v3/device/delRdrByImeiAndRdId.action",
  linkFence: contextPath + "v3/device/relationDefenseWithImei.action",
  getLinkDeviceByFenceId: contextPath + "v3/device/getRdrList.action",
  getFenceByImei: contextPath + "v3/device/getRdListByImei.action",
  saveAreaFence: contextPath + "v3/device/batchSaveRegionFense.action",
  getAreaList: contextPath + "v3/device/getRegionFenseList.action",
  // searchFenceList: contextPath + 'v3/device/getRdList.action',
  getRechargeCardBill:
    contextPath + "v3/platform/recharge_order/recharge_order_list.action",
  getRechargeCardStorage:
    contextPath + "v3/platform/recharge_card/rc_list.action",
  transferRechargeCard:
    contextPath + "v3/platform/recharge_card/rechargeCard_shif.action",
  transferCardRecord:
    contextPath + "v3/platform/recharge_card/shif_list.action",
  batchRechargeCard:
    contextPath + "v3/platform/recharge_card/batch_recharge.action",
  rechargeCard: contextPath + "v3/platform/recharge_card/singleRecharge.action",
  getCardNum:
    contextPath + "v3/platform/recharge_card/statistics_recharge.action",
  orderWxBill: contextPath + "v3/platform/recharge_order/place_order.action",
  getWxBillState:
    contextPath + "v3/platform/recharge_order/query_current_order.action",
  makeRechargeCard:
    contextPath + "v3/platform/recharge_order/product_recharge_card.action",
  giveUpWXBill:
    contextPath + "v3/platform/recharge_order/giv_up_payOrder.action",

  getOriginCardPrice:
    contextPath + "v3/platform/recharge_kind/getOriginCardPrice.action",
  saveOriginCardPrice:
    contextPath + "v3/platform/recharge_kind/saveOriginCardPrice.action",
  getUserCardDiscount:
    contextPath + "v3/platform/recharge_kind/getUserCardDiscount.action",
  saveUserCardDiscount:
    contextPath + "v3/platform/recharge_kind/saveUserCardDiscount.action",

  getCardFlowAudit:
    contextPath + "v3/platform/recharge_card/queryFlowAudit.action",
  getCardFlowDevice:
    contextPath + "v3/platform/recharge_card/queryFlowAuditDetail.action",
  exportFlowDevice:
    contextPath + "v3/platform/recharge_card/queryFlowAuditAll.action",
  auditCardFlow: contextPath + "v3/refill/api/refillPay.action",
  searchRechargeDev:
    contextPath + "v3/platform/recharge_card/api/searchDevice.action",
  forceCardFlow: contextPath + "v3/refill/forceFinish.action",
  rechargeBatchDevice:
    contextPath + "v3/platform/recharge_card/checkDeviceTime.action",
  forceFlowAudit:
    contextPath + "v3/platform/recharge_card/forceFlowAudit.action",
  sendCode:
    contextPath + "v3/platform/recharge_kind/getPhoneSmsCodeVerify.action",
  checkCode:
    contextPath + "v3/platform/recharge_kind/checkPhoneSmsCodeVerify.action",
  batchSavePledge: contextPath + "v3/risk/batchSaveFense.action", //新增二押点
  batchDelPledge: contextPath + "v3/risk/batchDelFense.action", //删除二押点
  getRdList: contextPath + "v3/risk/getRdList.action", //拿到二押点的列表
  getVehicleList: contextPath + "v3/vehicle/queryVehicleList.action", //查询用户车辆信息列表
  batchSaveVehicle: contextPath + "v3/vehicle/batchSaveVehicle.action", //新增车辆信息
  updateVehicle: contextPath + "v3/vehicle/updateVehicle.action", //修改更新车辆信息
  getVehicleRelationList:
    contextPath + "/v3/vehicleRelation/queryVehicleRelationList.action", //查询设备车辆关联关系列表
  delVehicleRelation:
    contextPath + "/v3/vehicleRelation/delVehicleRelation.action", //删除设备车辆关联关系（拆机）
  updVehicleRelation:
    contextPath + "/v3/vehicleRelation/updVehicleRelation.action", //修改更新设备车辆关联关系信息
  addVehicleRelation:
    contextPath + "/v3/vehicleRelation/addVehicleRelation.action", //新增设备车辆关联关系（安装）
  batchSaveCarFile: contextStatic + "v3/static/doc/demo.xls", //
  getRdrList1: contextPath + "v3/risk/getRdrList.action", //拿到二押点关联的设备号
  getRdListByImei1: contextPath + "v3/risk/getRdListByImei.action", //拿到设备关联的二押点
  deleteVehicle: contextPath + "v3/vehicle/delVehicle.action", //删除车辆信息
  delRdrByImeiAndRdId: contextPath + "v3/risk/delRdrByImeiAndRdId.action", //根据二押点id和设备删除二押点设备关联关系
  getRiskWithImeiRelation: contextPath + "v3/risk/riskWithImeiRelation.action", //通过二押点id和设备号新增二押点设备关联关系
  queryStayAlarmInfo: contextPath + "v3/alarm/queryStayAlarmInfo.action", //查询二押点久留报表
  queryTurnoverAlarmInfo:
    contextPath + "v3/alarm/queryTurnoverAlarmInfo.action", //查询进出二押点报表
  queryRealTimeAlarmInfo:
    contextPath + "v3/alarm/queryRealTimeAlarmInfo.action", //查询设备实时状态报表
  deviceInitialized1:
    contextPath + "v3/initialized/importDeviceInitialized.action", //设备初始化
  deviceInitialized: contextPath + "v3/initialized/deviceInitialized.action", //
  checkDeviceInitialized:
    contextPath + "v3/initialized/checkDeviceInitialized.action", //校验设备是否能初始化
  queryCarDeviceInfo: contextPath + "v3/carDevice/queryCarDeviceInfo.action", //查询设备车联关联关系信息
  editCarDevice: contextPath + "v3/carDevice/editCarDevice.action", //编辑新增设备车辆关联关系
  batchDeviceWarnPush: contextPath + "v2/device/api/batchDeviceWarnPush.action", //批量编辑报警设置
  readDealMsg: contextPath + "v2/alert/api/readDealMsg.action", //处理报警信息
  getDealMsgs: contextPath + "v2/alert/api/getDealMsgs.action", //获取处理报警信息
  addRechargeCardKind:
    contextPath + "v3/platform/recharge_kind/addRechargeCardKind.action", //添加充值卡类型
  superParentUser: contextPath + "v2/user/superParentUser.action", //判断是康骑，邓总。。
  queryAlertSwitch: contextPath + "v3/alertStatus/queryAlertSwitch.action", //报警的推送
  updateAlertSwitch: contextPath + "v3/alertStatus/updateAlertSwitch.action", //报警的推送
  enableDevice: contextPath + "v2/device/enableDevice.action", //激活设备
  checkDevicePwd: contextPath + "v2/device/checkPassword.action", //检查设备的密码
  sendVoice: contextPath + "v2/audio/api/sendVoice.action", //下发语音
  delVoice: contextPath + "v2/audio/api/delVoice.action", //删除语音
  devVoiceList: contextPath + "v2/audio/api/devVoiceList.action", //查询语音列表
  queryInstallLogImei: contextPath + "v3/carDevice/queryInstallLogImei.action", //查询设备安装的记录
  isTrinity: contextPath + "v2/login/isTrinity.action", //判断是否是三一重机的
  selectInstallInfoLogAll:
    contextPath + "v3/carDevice/selectInstallInfoLogAll.action", //导出三一起重的安装记录
  // word
  exportModulePolicy: contextStatic + "v3/static/export-module/", //拿到保单导出的word模板
  // batchUpdateSimXlsUpdate: contextStatic + "v3/static/import_export/model/update_simcard_flow_expiry_model.xls",
  batchUpdateSimXlsUpdate:
    contextStatic +
    "v3/static/import_export/model/add_simcard_flow_expiry_model.xls",

  batchUpdateSimNew: contextPath + "v2/simcard/batchUpdateFlowExpiry.action",
  tripInfo: contextPath + "v3/driveHabit/tripInfo.action", //查询设备的行程统计
  selectCarRunInfo: contextPath + "v3/driveHabit/selectCarRunInfo.action", //查询设备行程统计的总情况
  queryDevPhoto: contextPath + "produce/photo/queryPhoto.action", //查询设备的图片
  removeDevPhoto: contextPath + "produce/photo/removePhoto.action", //删除设备的图片
  queryDevIcon: contextPath + "deviceIcon/queryIcon.action", //查询设备图标
  updateDevIcon: contextPath + "deviceIcon/uptIcon.action ", //更新设备图标
  // 群组
  addDeviceGroup: contextPath + "group/device/manager/addDeviceGroup.action", //添加群组
  deviceGroupList: contextPath + "group/device/manager/deviceGroupList.action", //查询群组列表
  uptDeviceGroup: contextPath + "group/device/manager/uptDeviceGroup.action", //更新群组信息
  delDeviceGroup: contextPath + "group/device/manager/delDeviceGroup.action", //删除群组信息
  addDeviceImei: contextPath + "group/device/member/addDeviceImei.action",
  getAddDeviceImeiList:
    contextPath + "group/device/member/getAddDeviceImeiList.action", //查询群组添加的成员
  deleteDeviceMember:
    contextPath + "group/device/member/deleteDeviceMember.action", //删除群组成员
  sendVoiceMsg: contextPath + "group/device/message/sendVoiceMsg.action", //下发群组语音
  queryVoiceListMag: contextPath + "group/device/message/listMsg.action", //查询群组语音
  getGroupMemberList:
    contextPath + "group/device/member/getGroupMemberList.action", //查询群组中的成员列表
  queryDeviceLog: contextPath + "produce/log/protocol/queryDeviceLog.action",
  // 考勤管理
  addfenceArea: contextPath + "attendance/fence/addFenceArea.action", //新增考勤点
  delFenceArea: contextPath + "attendance/fence/delFenceArea.action", //删除考勤点
  uptFenceArea: contextPath + "attendance/fence/uptFenceArea.action", //修改考勤点
  fenceAreaList: contextPath + "attendance/fence/fenceAreaList.action", //查询考勤点列表
  fenceAddDevice: contextPath + "attendance/fence/member/addDevice.action", //考勤点关联设备
  fenceDelDevice: contextPath + "attendance/fence/member/delDevice.action", //考勤点删除设备
  querylistDevice: contextPath + "attendance/fence/member/listDevice.action", //查询当前考勤点关联的设备
  // 考勤时间点设置
  addAttendanceTime: contextPath + "attendance/date/addAttendanceTime.action", //添加考勤点时间
  delAttendanceTime: contextPath + "attendance/date/delAttendanceTime.action", //删除考勤点时间
  uptAttendanceTime: contextPath + "attendance/date/uptAttendanceTime.action", //更新考勤点时间
  attendanceTimeList: contextPath + "attendance/date/attendanceTimeList.action", //查询考勤点时间列表
  AttendanceAddTimeDevice:
    contextPath + "attendance/date/member/addDevice.action", //时间点关联设备
  AttendanceDelTimeDevice:
    contextPath + "attendance/date/member/delDevice.action", //时间点取消设备关联
  queryTimeDeviceList: contextPath + "attendance/date/member/deviceList.action", //查询关联的设备
  //
  delGoodsType: contextPath + "v2/pay/api/delGoods.action", //删除套餐
  getUserPermission: contextPath + "v2/user/permission/get.action", //获取用户的权限的关系
  updateUserPermission: contextPath + "v2/user/permission/update.action", //更新用户的权限的关系
  // 账务系统
  getUserBalance: contextPath + "user/asset/userBalance.action", //查询用户的余额
  getUserPhoneCode: contextPath + "user/asset/sendVerifyCode.action", //获取手机号码的验证码
  addWithdraw: contextPath + "user/asset/addWithdraw.action", //添加提现审核信息
  queryWithdrawList: contextPath + "user/asset/queryWithdrawList.action", //查询提现审核的信息
  auditWithdrawOrder: contextPath + "user/asset/auditWithdrawOrder.action", //审核提现订单
  queryFlowList: contextPath + "user/asset/queryFlowList.action", //查询用户资产流水
  //
  moveUser: contextPath + "v2/user/api/moveUser.action", //转移用户
  summaryProfit: contextPath + "/v2/charge/summaryProfit.action", //查询用户统计的利润
  summarySubUserProfit: contextPath + "v2/charge/summarySubUserProfit.action", //查询用户及下级用户的利润
  // 企业图标
  updateBusinessLogo:
    contextPath + "user/business/icon/updateBusinessLogo.action",
  queryBusinessLogo:
    contextPath + "user/business/icon/queryBusinessLogo.action",
  renewBusinessIco: contextPath + "user/business/icon/renewBusinessIco.action",
  queryBusinessIco: contextPath + "user/business/icon/queryBusinessIco.action",
  //蓝牙绑定的状态
  queryBlueToothStatus: contextPath + "btLock/queryBlueToothStatus.action", //查询蓝牙连接的情况
  queryHistBtStatusList: contextPath + "btLock/queryHistBtStatusList.action", //查询蓝牙历史状态
  // 电话报警
  alertNotifyDetail: contextPath + "notify/alert/alertNotifyDetail.action", //查询报警通知详情
  updateAlertNotify: contextPath + "notify/alert/updateAlertNotify.action", //修改报警通知详情
  sendSmsCode: contextPath + "notify/alert/sendSmsCode.action", //下发手机验证码
  updateSingelTel: contextPath + "notify/alert/updateTel.action", //当个绑定手机号码
  batchBondTel: contextPath + "notify/alert/batchBondTel.action", //手机号码绑定多个设备号
  batchUpdateAlertNotify:
    contextPath + "notify/alert/batchUpdateAlertNotify.action",
  // 电话报警开关
  queryPhoneAlertSwitch: contextPath + "notify/switch/queryAlertSwitch.action", //查询报警开关
  updatePhoneAlertSwitch:
    contextPath + "notify/switch/tel/updateAlertSwitch.action", //更新手机报警通知
  mobileNotifyList: contextPath + "notify/record/mobileNotifyList.action", //查询电话报警通知详情
  // 设备升级
  queryFirmwareFile: contextPath + "produce/firmware_file/search.action", //查询升级文件
  updateFirmwareFile: contextPath + "produce/firmware_file/update.action", //修改版本文件
  addFirmwareFile: contextPath + "produce/firmware_file/add.action", //上传版本文件
  queryUpdateRecord: contextPath + "produce/update_record/search.action", //查询设备升级记录
  deleteUpdateRecord: contextPath + "produce/update_record/delete.action", //删除设备升级的记录
  //
  queryValidModelList:
    contextPath + "produce/model_version/validModelList.action", //查询可导入的设备型号
  addDeviceModel: contextPath + "produce/model_version/addModel.action", //添加设备型号
  queryValidAddList: contextPath + "produce/model_version/validAddList.action", //获取可以导入有效的添加型号
  queryModelVersion: contextPath + "produce/model_version/listAll.action", //查询已经导入所有的型号或者版本号
  //
  queryFirmwareUpdate: contextPath + "produce/firmware_update/search.action", //查询设备升级配置
  deleteUpdateSetting: contextPath + "produce/firmware_update/delete.action", //删除设备的升级配置的信息
  saveUpdateDeviceSetting:
    contextPath + "produce/firmware_update/update.action", //修改升级配置
  addModelVersion: contextPath + "produce/model_version/add.action", //添加型号和版本的关联
  queryModelGuangLianVersion: contextPath + "produce/model_version/get.action", //查询型号版本信息
  deleteModelGuangLianVersion:
    contextPath + "produce/model_version/delete.action", //删除型号和版本号关联关系
  //
  AddDeviceFirmware: contextPath + "produce/firmware_update/add.action", //添加设备升级
  AddBatchDeviceFirmware:
    contextPath + "produce/firmware_update/batchAdd.action", //批量添加设备进行升级
  //
  queryDeviceVersion: contextPath + "produce/device_version/search.action", //查询版本号的信息
  //
  batchSendCmd: contextPath + "v2/device/api/batchSendCmd.action", //批量下发离线指令
  // 路线规划
  addPlanTrack: contextPath + "road/plan/add.action",
  updatePlanTrack: contextPath + "road/plan/update.action",
  delPlanTrack: contextPath + "road/plan/remove.action",
  getPlanTrack: contextPath + "road/plan/get.action",
  // 路线与设备绑定
  getAddList: contextPath + "road/bond/addList.action",
  bondDevicePlanTrack: contextPath + "road/bond/add.action",
  removeDevicePlanTrack: contextPath + "road/bond/remove.action",
  getBondedDeviceList: contextPath + "road/bond/get.action",
  // 设备详情处定位信息的修改
  updateDeviceLocation: contextPath + "v2/device/api/setLocation.action",
  // 批量查询sim卡
  batchSearchSimInfo: contextPath + "v2/simcard/listSimCard.action",
  // api密钥
  getApiInfo: contextPath + "api/get.action",
  updateApiInfo: contextPath + "api/update.action",
};
