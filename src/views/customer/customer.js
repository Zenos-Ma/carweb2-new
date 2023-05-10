import UserAddDialog from "@/components/UserAddDialog/UserAddDialog";
// import UserPwdDialog from "@/components/UserPwdDialog";
import QuickSaleDialog from "@/components/QuickSaleDialog/QuickSaleDialog";
import TransferDialog from "@/components/TransferDialog/TransferDialog";
import BatchSaleDialog from "@/components/BatchSaleDialog/BatchSaleDialog";
import BatchTransferDialog from "@/components/BatchTransferDialog/BatchTransferDialog";
import BatchCommandDialog from "@/components/BatchCommandDialog/BatchCommandDialog";
import mapUtil from "@/utils/mapUtil.js";
import ExportUtil from "@/utils/exportUtil.js";
import UserTree from "@/components/UserTree/UserTree";
import BatchDeviceDialog from "@/components/BatchDeviceDialog/BatchDeviceDialog";
import UserTransferDialog from "@/components/UserTransferDialog/UserTransferDialog";
import LoginHelper from "@/utils/loginHelper.js";
import BatchAlarmDialog from "@/components/BatchAlarmDialog";
import BatchSendLxCommand from "@/components/BatchSendLxCommand";
//
import { export_json_to_excel } from "@/utils/Export2Excel";
import {
  loadDeviceInfo,
  doLogout,
  searchCustomerDevs,
  getUserTreeInfo,
  loadChildrenUserInfo,
  doDeleteUserInfo,
  exportSanYiInstallLogAll
} from "@/api/customer.js";
import { doDeviceActive, resetPwd, resetDevPwd } from "@/api/common.js";

export default {
  name: "Customer",
  components: {
    // "user-pwd-dialog": UserPwdDialog,
    "add-user-dialog": UserAddDialog,
    "quick-sale-dialog": QuickSaleDialog,
    "transfer-dialog": TransferDialog,
    "batch-sale-dialog": BatchSaleDialog,
    "batch-transfer-dialog": BatchTransferDialog,
    "batch-command-dialog": BatchCommandDialog,
    "batch-device-dialog": BatchDeviceDialog,
    "user-tree": UserTree,
    "user-transfer-dialog": UserTransferDialog,
    "batch-alarm-dialog": BatchAlarmDialog,
    "batch-send-command": BatchSendLxCommand
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    tableMenu: 0, //当前表格类型 0设备表格 1子账号表格
    //设备表格title
    //设备表格数据
    deviceList: [], //显示的设备表格数据
    originDevice: "[]",
    //子账号表格title
    //子账号表格数据
    userList: [], //子账号表格显示数据
    originUser: "[]",
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName, //当前客户信息
    userInfo: {
      loginNo: "",
      userType: "",
      address: "",
      linkman: "",
      summary_time: "",
      tel: "",
      userName: "",
      dev_cnt: 0,
      dev_import: 0
    }, //筛选设备状态类型
    devFilter: "all", //设备表格分页器
    page: {
      name: "devChildList",
      current: 1,
      pageSize: 30,
      total: 0,
      num: 1
    }, //搜索用户关键词
    searchUserKey: "", //搜索设备关键词
    searchDevKey: "", //选中的设备数据
    selectList: [], //是否显示设备表格正在加载中
    showDevLoad: false, //用户树右击操作框
    //用户数右击操作框参数
    treeBox: {
      left: 0,
      top: 0,
      isShow: false,
      selectUser: null
    }, //导出表格是否包含子账号数据
    isChild: false,
    tFrom: 0,
    tTo: 0,
    isFilter: false,
    selectOffline: 1,
    selectExpired: 1,
    selectExpired1: 3, //是否是管理员或经销商
    isManage:
      JSON.parse(window.localStorage.getItem("carweb_user")).userTypeV2 == 2,
    isInitType: JSON.parse(window.localStorage.getItem("carweb_user")).initFlag,
    ishasLower: false, //三一起重的安装记录导出是包含下级
    screenWidth: document.body.clientWidth,
    isCollapse: false,
    visible: false
  }),
  watch: {
    isFilter() {
      this.page.current = 1;
      this.loadDevice();
    },
    selectOffline() {
      if (this.isFilter) {
        this.page.current = 1;
        this.setTimeRange(this.selectOffline);
        this.loadDevice();
      }
    },
    selectExpired1() {
      if (this.isFilter) {
        this.page.current = 1;
        this.setTimeRange(this.selectExpired1);
        this.loadDevice();
      }
    },
    searchUserKey() {
      if (!this.searchUserKey) {
        this.searchUsers();
      }
    },
    searchDevKey() {
      if (!this.searchDevKey) {
        this.searchDevs();
      }
    },
    screenWidth() {
      // console.log(val);
      if (this.screenWidth < 1300) {
        this.isCollapse = true;
      } else {
        this.isCollapse = false;
      }
    }
  },
  methods: {
    selectionChange(val) {
      // console.log(val);
      this.selectList = val;
    },
    exportTableRecord(list) {
      // 导出三一起重的安装记录
      // console.log(list);
      let title = [
        this.$t("common.userName"),
        this.$t("common.deviceImei"),
        this.$t("common.carNo"),
        this.$t("deviceDetail.installPerson"),
        this.$t("deviceDetail.installSite"),
        this.$t("insurance.installTime"),
        this.$t("common.updateTime"),
        this.$t("common.note")
      ];
      let arr = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        arr.push([
          item.userName,
          item.deviceImei,
          item.platNumber,
          item.installPerson,
          item.installSite,
          item.installDate
            ? new Date(item.installDate).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.updateTime
            ? new Date(item.updateTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.remark
        ]);
      }
      ExportUtil.exportTable(title, arr, "三一起重所有子账号安装记录表");
    },
    exportRecord() {
      // 导出三一起重用户下的设备安装记录
      let data = {
        userId: this.userId == "13282" ? "" : this.userId,
        hasLower: this.ishasLower ? 1 : 0
      };
      exportSanYiInstallLogAll(data).then(res => {
        if (res.errCode == 200) {
          this.exportTableRecord(res.data);
        }
      });
    },
    setTimeRange(tag) {
      switch (tag) {
        case 1:
          this.tFrom = new Date().getTime() - 3600 * 1000;
          this.tTo = new Date().getTime();
          break;
        case 2:
          this.tFrom = new Date().getTime() - 24 * 3600 * 1000;
          this.tTo = new Date().getTime();
          break;
        case 3:
          this.tFrom = new Date().getTime() - 7 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime();
          break;
        case 4:
          this.tFrom = new Date().getTime() - 30 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime();
          break;
        case 5:
          this.tFrom = new Date().getTime() - 60 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime();
          break;
        case 6:
          this.tFrom = new Date().getTime() - 24 * 3600 * 1000;
          this.tTo = new Date().getTime() - 3600 * 1000;
          break;
        case 7:
          this.tFrom = new Date().getTime() - 7 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime() - 24 * 3600 * 1000;
          break;
        case 8:
          this.tFrom = new Date().getTime() - 30 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime() - 7 * 24 * 3600 * 1000;
          break;
        case 9:
          this.tFrom = new Date().getTime() - 60 * 24 * 3600 * 1000;
          this.tTo = new Date().getTime() - 30 * 24 * 3600 * 1000;
          break;
      }
    },
    showChartPage() {
      //跳转到图表界面
      window.open(
        window.location.origin +
          window.location.pathname +
          "#/device-chart?userId=" +
          this.userId
      );
    },
    exportTable(tag) {
      //导出表格数据
      if (tag == "all") {
        var op = {
          userId: this.userId ? this.userId : this.rootUser.userId,
          dispLv: "all",
          tFilt: false,
          tFrom: new Date().getTime() - 3600 * 1000,
          tTo: new Date().getTime(),
          pageSize: 10000000,
          page: 1,
          alreadyExpire: 0,
          hasLower: this.isChild ? 1 : 0
        };
        this.app.$emit("show-progress-page", 0);
        loadDeviceInfo(op).then(res => {
          if (res.errCode == "200") {
            this.app.$emit("show-progress-page", 100);
            for (var i = 0; i < res.data.devs.length; i++) {
              // console.log(res);
              var item = res.data.devs[i];
              res.data.devs[i].sts = mapUtil.devStatus(
                item.status,
                item.signalTime
              );
            }
            // console.log(res.data.devs);
            this.createXlsFile(
              res.data.devs,
              this.isChild ? "的全部设备(包含子用户)" : "的全部设备"
            );
          } else {
            this.app.$emit("show-alert-msg", this.$t("common.exportError"));
            this.app.$emit("show-progress-page", 100);
          }
        });
      } else {
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          this.app.$emit("show-progress-page", 100);
          return;
        }
        // let selectList = [];
        // selectList = this.getSelectList();
        for (var i = 0; i < this.selectList.length; i++) {
          // console.log(res);
          var item = this.selectList[i];
          // console.log("item", item);
          this.selectList[i].sts = mapUtil.devStatus(
            item.status,
            item.signalTime
          );
        }
        this.createXlsFile(this.selectList, "的设备");
      }
    },
    createXlsFile(origin_data, filename) {
      //创建xls文件
      var title = [
        this.$t("common.deviceImei"),
        this.$t("common.deviceName"),
        this.$t("common.deviceType"),
        this.$t("common.carNo"),
        this.$t("deviceDetail.carFrameNo"),
        this.$t("insurance.engineId"),
        this.$t("deviceDetail.installSite"),
        this.$t("common.simNo"),
        this.$t("common.linkman"),
        "ICCID",
        this.$t("customer.openTime"),
        this.$t("customer.expireTime"),
        this.$t("customer.signalTime"),
        this.$t("deviceDetail.flowExpiredTime"),
        this.$t("common.status"),
        this.$t("common.mode") + "1",
        this.$t("common.mode") + "2",
        this.$t("infobox.voltage"),
        this.$t("infobox.power"),
        this.$t("deviceDetail.remark")
      ];
      if (this.isChild) {
        title.unshift(this.$t("common.owner"), this.$t("userDetail.loginNo"));
      }
      var list = [];
      for (var i = 0; i < origin_data.length; i++) {
        var item = origin_data[i];
        if (this.isChild) {
          list.push([
            item.userName,
            item.loginNo,
            item.deviceImei,
            item.name,
            item.devType,
            item.plateNumber,
            item.vehicleNumber ? item.vehicleNumber : "--",
            item.engineNumber ? item.engineNumber : "--",
            item.installSite ? item.installSite : "--",
            item.msisdn,
            item.linkman,
            item.iccid,
            item.openTime,
            item.expireTime,
            item.signalTime,
            item.flowExpire
              ? new Date(item.flowExpire).format("yyyy-MM-dd")
              : "--",
            item.sts,
            item.model1 ? item.model1 : "--",
            item.model2 ? item.model2 : "--",
            item.voltage ? item.voltage + "V" : "--",
            item.electricity ? item.electricity + "%" : "0%",
            item.remark ? item.remark : "--"
          ]);
        } else {
          list.push([
            item.deviceImei,
            item.name,
            item.devType,
            item.plateNumber,
            item.vehicleNumber ? item.vehicleNumber : "--",
            item.engineNumber ? item.engineNumber : "--",
            item.installSite ? item.installSite : "--",
            item.msisdn,
            item.linkman,
            item.iccid,
            item.openTime,
            item.expireTime,
            item.signalTime,
            item.flowExpire
              ? new Date(item.flowExpire).format("yyyy-MM-dd")
              : "--",
            item.sts,
            item.model1 ? item.model1 : "--",
            item.model2 ? item.model2 : "--",
            item.voltage ? item.voltage + "V" : "--",
            item.electricity ? item.electricity + "%" : "0%",
            item.remark ? item.remark : "--"
          ]);
        }
      }
      // ExportUtil.exportTable(title, list, this.userName + filename);
      // 以下是通过file-saver + xlsx导出的
      // import("@/utils/Export2Excel").then(excel => {
      //   excel.export_json_to_excel({
      //     header: title,
      //     data: list,
      //     filename: this.userName + filename,
      //     autoWidth: true,
      //     bookType: "xlsx"
      //   });
      // });
      export_json_to_excel({
        header: title,
        data: list,
        filename: this.userName + filename,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    // formatJson(filterVal, jsonData) {
    //   // 处理导出的表格的数据
    //   return jsonData.map(v =>
    //     filterVal.map(j => {
    //       console.log(j);
    //       if (j === "timestamp") {
    //         return parseTime(v[j]);
    //       } else {
    //         return v[j];
    //       }
    //     })
    //   );
    // },
    //重置密码
    resetUserPwd() {
      var tip = this.$t("customer.resetPwdTip");

      this.app.$emit(
        "show-confirm-msg",
        tip.replace("_userName_", this.userInfo.userName),
        () => {
          //
          resetPwd({ userId: this.userId }).then(res => {
            if (res.errCode == "200") {
              // that.app.$emit("show-alert-msg", that.$t("customer.resetPwdSuccess"));
              if (
                this.userId ==
                JSON.parse(window.localStorage.getItem("carweb_user")).userId
              ) {
                // console.log("chufa");
                this.app.$emit(
                  "show-confirm-msg",
                  this.$t("customer.resetPwdSuccess1"),
                  () => {
                    this.doLogout();
                  }
                );
              } else {
                this.app.$emit(
                  "show-alert-msg",
                  this.$t("customer.resetPwdSuccess")
                );
              }
            } else {
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.resetPwdFail") + ":" + res.errMsg
              );
            }
          });
        }
      );
    },
    doLogout() {
      //退出登录
      doLogout().then(res => {
        if (res.errCode == "200") {
          window.localStorage.removeItem("carweb_user");
          window.localStorage.removeItem("carweb_time");
          window.localStorage.removeItem("carweb_tag");
          // window.localStorage.removeItem("isAlert");
          window.localStorage.removeItem("carweb_logo");
          window.localStorage.removeItem("carweb_icon");
          window.location.href = LoginHelper.redirectLocation();
          this.app.$emit("load-account-logo");
        }
      });
    },
    //搜索用户表格用户
    searchUsers() {
      if (!this.searchUserKey) {
        //返回用户列表
        this.userList = JSON.parse(this.originUser);
      } else {
        var list = [];
        for (var i = 0; i < this.userList.length; i++) {
          var item = this.userList[i];
          if (
            (item.userName && item.userName.indexOf(this.searchUserKey) >= 0) ||
            (item.loginNo && item.loginNo.indexOf(this.searchUserKey) >= 0) ||
            (item.linkman && item.linkman.indexOf(this.searchUserKey) >= 0) ||
            (item.tel && item.tel.indexOf(this.searchUserKey) >= 0)
          )
            list.push(item);
        }
        this.userList = list;
      }
    }, //搜索设备表格设备
    searchDevs() {
      if (!this.searchDevKey) {
        //返回设备列表
        this.deviceList = JSON.parse(this.originDevice);
      } else {
        var op = {
          userId: this.userId,
          key: this.searchDevKey,
          pageSize: this.page.pageSize,
          page: 1
        };
        searchCustomerDevs(op).then(res => {
          if (res.errCode == "200") {
            this.deviceList = res.data.devs;
            this.selectList = [];
            this.page.num = Math.ceil(res.data.itemsCount / this.page.pageSize);
            this.page.total = res.data.itemsCount;
          }
        });
      }
    }, //用户树选中用户
    changeUser(userId, userName) {
      userId = Number(userId);
      this.treeBox.isShow = false;
      this.page.current = 1;
      this.userId = userId ? userId : this.rootUser.userId;
      this.userName = userName ? userName : this.rootUser.userName;

      getUserTreeInfo({ userId: userId }).then(res => {
        if (res.errCode == "200") {
          this.userInfo = res.data;
        }
      });
      this.loadDevice();
      this.loadChildUsers();
      this.app.$emit("customer-userid1", userId);
    },

    getDevSts: mapUtil.devStatus,
    loadDevice() {
      this.showDevLoad = true;
      var that = this;
      var tFrom = this.tFrom,
        tTo = this.tTo,
        expire = this.selectExpired;
      if (!this.isFilter) {
        // console.log("1");
        tFrom = new Date().getTime() - 3600 * 1000;
        tTo = new Date().getTime();
        expire = 0;
      }
      var op = {
        userId: this.userId ? this.userId : this.rootUser.userId,
        dispLv: this.devFilter,
        tFilt: this.isFilter,
        tFrom: tFrom,
        tTo: tTo,
        pageSize: that.page.pageSize,
        page: that.page.current,
        alreadyExpire: expire
      };
      // console.log(op);
      loadDeviceInfo(op).then(res => {
        if (res.errCode == "200") {
          this.selectList = [];
          this.page.num = Math.ceil(res.data.itemsCount / this.page.pageSize);
          this.showDevLoad = false;
          this.deviceList = res.data.devs;
          this.page.total = res.data.itemsCount;
          this.originDevice = JSON.stringify(res.data.devs);
        }
      });
    }, //加载子账号表格
    loadChildUsers() {
      var op = {
        userId: this.userId,
        pageSize: 400,
        page: 1
      };
      loadChildrenUserInfo(op).then(res => {
        if (res.errCode == "200") {
          this.userList = res.data.childs;
          this.originUser = JSON.stringify(res.data.childs);
          //that.page.num = Math.ceil(data.itemsCount / that.page.pageSize);
        }
      });
    }, //显示对话框
    showDialog(tag) {
      // console.log(tag);
      if (tag == "AddUserDialog") {
        //新增用户
        this.app.$emit("show-add-user-dialog", {
          name: "AddUserDialog"
        });
      } else if (tag == "UserPwdDialog") {
        //重置当前用户密码
        this.app.$emit("show-user-pwd-dialog", {
          name: "UserPwdDialog",
          userId: this.userId
        });
      } else if (tag == "monitor") {
        //跳转到监控平台
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?userId=" +
            this.userId
        );
      } else if (tag == "user") {
        //显示选中用户详情对话框
        this.app.$emit("show-user-dialog", {
          name: "UserDialog",
          userId: this.userId,
          userName: this.userInfo.userName
        });
      } else if (tag == "batchSale") {
        //显示批量销售对话框
        this.app.$emit("show-batch-sale-dialog", {
          name: "BatchSaleDialog",
          devList: this.selectList,
          userId: this.userId,
          userName: this.userInfo.userName
        });
      } else if (tag == "batchTransfer") {
        //显示批量转移对话框
        this.app.$emit("show-batch-transfer-dialog", {
          name: "BatchTransferDialog",
          devList: this.selectList,
          userId: this.userId,
          userName: this.userInfo.userName
        });
      } else if (tag == "batchCommand") {
        //显示批量命令对话框
        this.visible = false;
        this.app.$emit("show-batch-command-dialog", {
          name: "BatchCommandDialog",
          devList: this.selectList
        });
      } else if (tag == "batchDevice") {
        // this.app.$emit("show-alert-msg", "此功能正在修复，稍后再试");
        // 2021-5-6
        this.visible = false;
        this.app.$emit("show-batch-device-dialog", {
          name: "BatchDeviceDialog",
          devList: this.selectList
        });
      } else if (tag == "batchAlarm") {
        this.visible = false;
        this.app.$emit("show-batch-alarm-dialog", {
          name: "BatchAlarmDialog",
          devList: this.selectList
        });
      } else if (tag == "batchSendCommand") {
        // 2022-8-5
        this.visible = false;
        this.app.$emit("show-batch-send-command", {
          name: "BatchSendLxCommand",
          devList: this.selectList
        });
        // this.app.$emit("show-alert-msg", "此功能正在修复，稍后再试");
      }
    },
    getSelectList() {
      var list = [];
      for (var i = 0; i < this.selectList.length; i++) {
        list.push(this.deviceList[this.selectList[i]]);
      }
      return list;
    },
    /**
     * 重置密码
     * @param{操作标识} tag =》dev 设备 user 用户
     * @param{表格数据项} item
     */
    resetDevUserPwd(tag, item) {
      var that = this;
      if (tag == "dev") {
        //重置设备密码
        var tip = this.$t("customer.resetPwdTip1");
        this.app.$emit(
          "show-confirm-msg",
          tip.replace("_deviceImei_", item.deviceImei),
          () => {
            resetDevPwd({ deviceImei: item.deviceImei }).then(res => {
              if (res.errCode == "200") {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("customer.resetPwdSuccess")
                );
              } else {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("customer.resetPwdFail") + ":" + res.errMsg
                );
              }
            });
          }
        );
      } else {
        //重置用户密码
        let tip = this.$t("customer.resetPwdTip");
        this.app.$emit(
          "show-confirm-msg",
          tip.replace("_userName_", item.userName),
          () => {
            resetPwd({ userId: item.userId }).then(res => {
              if (res.errCode == "200") {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("customer.resetPwdSuccess")
                );
              } else {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("customer.resetPwdFail") + ":" + res.errMsg
                );
              }
            });
          }
        );
      }
    }, //删除用户
    doDeleteUser(op) {
      var that = this;
      var tip = that.$t("customer.delUserTip");
      this.app.$emit(
        "show-confirm-msg",
        tip.replace("_userName_", op.item.userName),
        function() {
          doDeleteUserInfo({ userId: op.item.userId }).then(res => {
            if (res.errCode == "200") {
              that.app.$emit(
                "show-alert-msg",
                that.$t("customer.delUserSuccess")
              );
              that.app.$emit("usertree-refresh");
              if (op.idx) {
                that.userList.splice(op.idx, 1);
                for (var i = 0; i < that.userList.length; i++) {
                  if ((that.userList[i].userId = op.item.userId)) {
                    that.userList.splice(i, 1);
                    break;
                  }
                }
              }
            } else {
              that.app.$emit(
                "show-alert-msg",
                that.$t("customer.delUserFail") + ":" + res.errMsg
              );
            }
          });
        }
      );
    },
    /**
     * 处理表格操作
     * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
     */
    dealTableOp(item, index, name) {
      // var item = item;
      if (name == "subDevSale") {
        //设备销售
        this.app.$emit("show-quick-sale-dialog", {
          name: "QuickSaleDialog",
          item: item
        });
      } else if (name == "billDevice") {
        // 只有设备的详情信息，去掉了
        this.app.$emit("show-dev-detail-dialog", {
          name: "DevDetailDialog",
          imei: item.deviceImei
        });
      } else if (name == "subDevTransfer") {
        //设备转移
        this.app.$emit("show-transfer-dialog", {
          name: "TransferDialog",
          item: item
        });
      } else if (name == "subDevDetail") {
        //设备详情
        setTimeout(() => {
          this.app.$emit("show-device-dialog", {
            name: "DeviceDialog",
            imei: item.deviceImei
          });
        }, 50);
      } else if (name == "subDevResetPwd") {
        //重置设备密码
        this.resetDevUserPwd("dev", item);
      } else if (name == "customerDetail") {
        //用户详情
        this.app.$emit("show-user-dialog", {
          name: "UserDialog",
          userId: item.userId,
          userName: item.userName
        });
      } else if (name == "customerMonitor") {
        //用户监控
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?userId=" +
            item.userId
        );
      } else if (name == "customerResetPwd") {
        //重置用户密码
        this.resetDevUserPwd("user", item);
      } else if (name == "customerDelete") {
        //用户删除
        this.doDeleteUser(item);
      } else if (name == "deviceMonitor") {
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?deviceImei=" +
            item.deviceImei
        );
      } else if (name == "deviceTrack") {
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/track?deviceImei=" +
            item.deviceImei
        );
      } else if (name == "devicePlayback") {
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/playback?deviceImei=" +
            item.deviceImei
        );
      } else if (name == "deviceActive") {
        // 激活设备
        this.dealDeviceActive(item);
      } else if (name == "editPwd") {
        // 修改设备密码
        this.app.$emit("show-user-pwd-dialog", {
          name: "UserPwdDialog",
          deviceImei: item.deviceImei,
          loginType: 4
        });
      }
    },
    dealDeviceActive(op) {
      // 激活设备
      let str = this.$t("customer.deviceActive");
      this.app.$emit(
        "show-confirm-msg",
        str.replace("_device_", op.item.deviceImei),
        () => {
          // console.log("dad");
          doDeviceActive({ deviceImei: op.item.deviceImei }).then(res => {
            if (res.errCode == 200) {
              // console.log(res);
              this.loadDevice();
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceActiveTip")
              );
            } else {
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceImeiActiced")
              );
            }
          });
        }
      );
      //
    },
    //处理右击用户树box操作

    onUserTreeOp(name) {
      switch (name) {
        case "saleDev": //销售设备
          this.app.$emit("show-quick-sale-dialog", {
            name: "QuickSaleDialog",
            item: this.treeBox.selectUser
          });
          break;
        case "transferDev": //转移设备
          this.app.$emit("show-transfer-dialog", {
            name: "TransferDialog",
            item: this.treeBox.selectUser
          });
          break;
        case "addUser": //新增用户
          this.app.$emit("show-add-user-dialog", {
            name: "AddUserDialog",
            userId: this.treeBox.selectUser.userId,
            userName: this.treeBox.selectUser.userName
          });
          break;
        case "userDialog": //管理用户
          this.app.$emit("show-user-dialog", {
            name: "UserDialog",
            userId: this.treeBox.selectUser.userId,
            userName: this.treeBox.selectUser.userName
          });
          break;
        case "transferUser": //转移用户 show-user-transfer-dialog
          if (this.treeBox.selectUser.userId == this.rootUser.userId) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("customer.userTransferTip")
            );
            return;
          }
          this.app.$emit("show-user-transfer-dialog", {
            name: "UserTransferDialog",
            userId: this.treeBox.selectUser.userId,
            userName: this.treeBox.selectUser.userName
          });
          break;
        case "pwd": //充值用户密码
          this.resetDevUserPwd("user", {
            userId: this.treeBox.selectUser.userId,
            userName: this.treeBox.selectUser.userName
          });
          break;
        case "delete": //删除用户
          this.doDeleteUser({
            item: {
              userId: this.treeBox.selectUser.userId,
              userName: this.treeBox.selectUser.userName
            }
          });
          break;
      }
      this.treeBox.isShow = false;
    }, //获取表格中勾选设备idx
    dealTableSelect(selectList) {
      this.treeBox.isShow = false;
      var list = [];
      for (var i = 0; i < selectList.length; i++) {
        list.push(this.deviceList[selectList[i]]);
      }
      this.selectList = list;
    }, //处理右击用户树
    dealRightTree(op) {
      // console.log("op");
      this.treeBox.isShow = true;
      this.treeBox.selectUser = op.treeNode;
      if (op.tag == "rightClick") {
        // document
        //   .querySelector(".operation-box")
        //   .setAttribute(
        //     "style",
        //     `top:${op.event.clientY}px;left:${op.event.clientX}px;`
        //   );
        this.treeBox.top = op.event.clientY;
        this.treeBox.left = op.event.clientX;
      }
      document.addEventListener("click", this.closeTreeMenu);
      document.addEventListener("contextmenu", this.closeTreeMenu);
    },
    dealRightTree1(op) {
      // 点击处理树
      this.treeBox.isShow = true;
      this.treeBox.selectUser = op.treeNode;
      const treeList = document.querySelector(".el-tree-node__children");
      // console.log("treeList", treeList);
      const listItem = treeList.childNodes;
      for (let i = 0; i < listItem.length; i++) {
        let item = listItem[i];
        // console.log("op.treeNode.label", op.treeNode.label);
        // console.log("item", item.getElementsByClassName("name")[0].innerText);
        if (
          op.treeNode.userName ==
          item.getElementsByClassName("name")[0].innerText
        ) {
          let obj = item.getBoundingClientRect();
          // console.log("obj", obj);
          // document
          //   .querySelector(".operation-box")
          //   .setAttribute(
          //     "style",
          //     `top:${obj.top + 20}px;left:${obj.left * 2 + 30}px;`
          //   );
          this.treeBox.top = obj.top + 20;
          this.treeBox.left = obj.left * 2;
        }
      }
      document.addEventListener("click", this.closeTreeMenu);
    },
    closeTreeMenu() {
      this.treeBox.isShow = false; // 关闭菜单
      document.removeEventListener("click", this.closeTreeMenu);
      document.removeEventListener("contextmenu", this.closeTreeMenu);
    },
    listenEvent() {
      this.app.$on("select-user", this.changeUser);
      this.app.$on("customer-refresh", this.refreshCustomer);
      this.app.$on("customer-refresh-dev", this.loadDevice);
      this.app.$on("customer-userid", this.changeUser);
    },
    offEvent() {
      this.app.$off("select-user", this.changeUser);
      this.app.$off("customer-refresh", this.refreshCustomer);
      this.app.$off("customer-refresh-dev", this.loadDevice);
      this.app.$off("customer-userid", this.changeUser);
    }, //刷新用户树
    refreshCustomer() {
      this.app.$emit("usertree-refresh");
      this.changeUser(this.userId);
    }, //初始化管理员与非管理员操作
    initCustomerOption() {
      //if (!this.isManage){
      //  this.treeOp = JSON.parse(JSON.stringify(this.treeOp)).slice(1);
      //  this.deviceOp = JSON.parse(JSON.stringify(this.deviceOp)).slice(1);
      //}
    }
  },
  mounted() {
    this.moveHoriztion();
    this.initCustomerOption();
    this.listenEvent();

    var that = this;
    if (this.$route.query.userId) {
      var userId = parseInt(this.$route.query.userId);
      this.$nextTick(function() {
        that.changeUser(userId);
      });
      //window.location.hash = '#/home';
    } else if (this.$route.query.tag) {
      switch (this.$route.query.tag) {
        case "manage":
          this.devFilter = "all";
          break;
        case "expired":
          this.devFilter = "expired";
          break;
        case "offline":
          this.devFilter = "offline";
          break;
      }
      this.changeUser(this.rootUser.userId);
    } else {
      this.changeUser(this.rootUser.userId);
    }
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    if (this.screenWidth < 1400) {
      this.isCollapse = true;
    } else {
      this.isCollapse = false;
    }
  },
  beforeDestroy() {
    this.offEvent();
  }
};
