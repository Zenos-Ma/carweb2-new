import userTreeComp from "@/components/UserTree/UserTree";
import TimeRange from "@/components/TimeRangeComp/TimeRangeComp";
import deviceListComp from "@/components/DeviceList/DeviceList.vue";
import ExportUtil from "@/utils/exportUtil.js";
import { loadDeviceStatistics, loadDeviceDetail, exportDeviceAllAlarm } from "@/api/monitor.js";
export default {
  name: "Alarm",
  components: {
    "device-list": deviceListComp,
    "user-tree": userTreeComp,
    "time-range": TimeRange,
  },
  props: {},
  data: () => ({
    currentTable: 0, //当前表格
    alertTypeId: 1, //报警类型
    alarmList: [], //报警总览
    statisticsList: [], //统计数据
    detailList: [], //详单数据
    imei: "", //当前设备imei
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId, //当前用户
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //登录用户
    page: {
      //分页器
      name: "alarmList",
      pageSize: 30,
      num: 1,
      current: 1,
      total: 0,
    },
    timeFrom: new Date(new Date().getTime() - 3600 * 1000).format("yyyy-MM-dd hh:00"),
    timeTo: new Date().format("yyyy-MM-dd hh:00"),
    isLoading: false, //是否加载中
    isDateOver: false,
    isDateBefore: false,
    isDateLast: false,
    isChild: true, //报警总览是否包含下级用户
    isExportNotMsg: false,
    iDeng: false, //是否为邓总用户
    isColumnDialog: false, //是否显示选择列对话框
    exportTitle: [], //全部的列项
    exportColumns: [], //选中的列
    isTimeRangeBox: false, //是否显示时间范围框
  }),
  watch: {
    timeFrom() {
      this.checkTimeRange();
    },
    timeTo() {
      this.checkTimeRange();
    },
    isColumnDialog() {
      if (this.isColumnDialog) {
        this.exportTitle = [
          {
            name: this.$t("common.deviceImei"),
            code: "deviceImei",
          },
          {
            name: this.$t("common.deviceName"),
            code: "name",
          },
          {
            name: this.$t("alarm.shock"),
            code: "num2",
          },
          {
            name: this.$t("alarm.powerOff"),
            code: "num3",
          },
          {
            name: this.$t("alarm.lowPower"),
            code: "num4",
          },
          {
            name: this.$t("alarm.overSpeed"),
            code: "num6",
          },
          {
            name: this.$t("alarm.fenceOut"),
            code: "num7",
          },
          {
            name: this.$t("alarm.antennaShort"),
            code: "num9",
          },
          {
            name: this.$t("alarm.antennaOpen"),
            code: "num10",
          },
          {
            name: this.$t("alarm.lowVoltage"),
            code: "num13",
          },
          {
            name: this.$t("alarm.switchDoor"),
            code: "num16",
          },
          {
            name: this.$t("alarm.remove"),
            code: "num20",
          },
          {
            name: this.$t("alarm.lightSense"),
            code: "num21",
          },
          {
            name: this.$t("alarm.offline"),
            code: "num25",
          },
          {
            name: this.$t("alarm.acceleration"),
            code: "num31",
          },
          {
            name: this.$t("alarm.deceleration"),
            code: "num32",
          },
          {
            name: this.$t("alarm.turnleft"),
            code: "num33",
          },
          {
            name: this.$t("alarm.turnright"),
            code: "num34",
          },
          {
            name: this.$t("alarm.weakSignal"),
            code: "num28",
          },
          {
            name: this.$t("alarm.clockin"),
            code: "num44",
          },
          {
            name: this.$t("alarm.staticAlarm"),
            code: "num45",
          },
          //
          {
            name: this.$t("alarm.shielding"),
            code: "num46",
          },
          {
            name: this.$t("alarm.bluetoothBroken"),
            code: "num47",
          },
          {
            name: this.$t("alarm.recovery"),
            code: "num29",
          },
        ];
      }
    },
    exportColumns() {
      //邓总用户保存报警总览列
      if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
        window.localStorage.setItem("carweb_alarmall_columns", JSON.stringify(this.exportColumns));
      }
    },
  },
  methods: {
    onParseAddress1(h, { column, $index }, type) {
      let that = this;
      return h("div", [
        h("span", column.label),
        h(
          "el-button",
          {
            props: {
              type: "text",
              size: "small",
            },
            visible: this.isDeng,
            on: {
              click: function () {
                that.onParseAddress();
              },
            },
          },
          this.$t("alarm.parseAddress")
        ),
      ]);
    },
    onTimeRange(op) {
      //时间范围选择结果
      this.timeFrom = op.startTimeFormat;
      this.timeTo = op.endTimeFormat;
    },
    getColumnsState(idx) {
      //判断列是否显示
      if (this.exportColumns.length > 0) {
        for (var i = 0; i < this.exportColumns.length; i++) {
          if (idx == this.exportColumns[i]) {
            return true;
          }
        }
        return false;
      } else {
        return true;
      }
    },

    onSelectAllColumns() {
      //选中全部列
      var list = [];
      for (var i = 0; i < this.exportTitle.length; i++) {
        list.push(i);
      }
      this.exportColumns = list;
    },
    onUnselectAllColumns() {
      //取消选择全部列
      this.exportColumns = [];
    },

    checkTimeRange() {
      //检查时间范围
      var halfYear = new Date().getTime() - 186 * 24 * 3600000;
      if (new Date(this.timeTo).getTime() < halfYear || new Date(this.timeFrom).getTime() < halfYear) {
        this.isDateLast = true;
      } else {
        this.isDateLast = false;
      }
      if (new Date(this.timeTo).getTime() - new Date(this.timeFrom) > 31 * 24 * 3600000) {
        this.isDateOver = true;
      } else {
        this.isDateOver = false;
      }
      if (new Date(this.timeFrom).getTime() > new Date(this.timeTo).getTime()) {
        this.isDateBefore = true;
      } else {
        this.isDateBefore = false;
      }
    },
    onParseAddress(op) {
      //解析地址
      var that = this;
      for (var i = 0; i < this.detailList.length; i++) {
        var item = this.detailList[i];
        var lng = item.baidu_lon,
          lat = item.baidu_lat;
        if (lng && lat && lat != 0 && lng > -180 && lng <= 180 && lat <= 90 && lat >= -90) {
          this.getPoiLocation(lng, lat, function (address) {
            that.detailList[op.idx].address = address ? address : that.$t("common.addressFail");
          });
        }
      }
    },
    showChartPage() {
      //跳转到图表界面
      window.open(window.location.origin + window.location.pathname + "#/alarm-chart");
    },
    showDevice() {
      //显示设备详情对话框
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: this.imei,
      });
    },
    setTimeRange(tag) {
      //设置时间范围
      var from = new Date().getTime();
      var day = new Date().getDay() - 1;
      switch (tag) {
        case "today":
          from = new Date(new Date().format("yyyy-MM-dd")).getTime() - 8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
          break;
        case "yesterday":
          from = new Date(new Date().format("yyyy-MM-dd")).getTime() - 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
          this.timeTo = new Date(from + 24 * 3600 * 1000 - 1000).format("yyyy-MM-dd hh:mm");
          break;
        case "thisWeek":
          from = new Date(new Date().format("yyyy-MM-dd")).getTime() - (day > 0 ? day : day + 7) * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
          break;
        case "lastWeek":
          day = day > 0 ? day : day + 7;
          from = new Date(new Date().format("yyyy-MM-dd")).getTime() - (day + 7) * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
          var to = new Date(new Date().format("yyyy-MM-dd")).getTime() - day * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000 - 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
          this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm");
          break;
        case "thisMonth":
          var month = new Date().getMonth() + 1;
          from = new Date(new Date().getFullYear() + "-" + (month > 9 ? month : "0" + month) + "-01").getTime() - 8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
          break;
        case "lastMonth":
          {
            var m = new Date(new Date().getTime() - 30 * 24 * 3600000);
            from = new Date(m.getFullYear() + "-" + (m.getMonth() + 1) + "-01").getTime() - 8 * 60 * 60 * 1000;
            let to = new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-01") - 8 * 60 * 60 * 1000 - 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm");
          }
          break;
      }
    },
    loadStatistics() {
      //加载统计表格
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
      };
      loadDeviceStatistics(data).then((res) => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.statisticsList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    onAlarmTableAction(imei, alertId) {
      //查看设备报警详单
      this.imei = imei;
      this.app.$emit("monitor-change-device", {
        deviceImei: this.imei,
      });
      this.currentTable = 2;
      this.page.current = 1;
      this.alertTypeId = alertId;
      this.loadDetail();
    },
    loadDetail() {
      //加载详单表格
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        alertTypeId: this.alertTypeId,
      };
      loadDeviceDetail(data).then((res) => {
        this.isLoading = false;
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.childs.length; i++) {
            res.data.childs[i].address = "";
          }
          this.detailList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadAlarm() {
      //加载报警总览列表
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        userId: this.userId ? this.userId : this.rootUser.userId,
      };
      loadDeviceStatistics(data).then((res) => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.alarmList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    searchTable() {
      //查询表格
      this.page.current = 1;
      if (this.isDateLast || this.isDateOver || this.isDateBefore) return;
      switch (this.currentTable) {
        case 0:
          this.loadAlarm();
          break;
        case 1:
          this.loadStatistics();
          break;
        case 2:
          this.loadDetail();
          break;
      }
    },
    exportTableAll() {
      //导出全部报警
      document.getElementById("loading_page").style.display = "flex";
      var data = {
        userId: this.userId,
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        containChild: this.isChild,
        isExportNotMsg: this.isExportNotMsg,
      };
      exportDeviceAllAlarm(data).then((res) => {
        if (res.errCode == "200") {
          if (res.data.length > 0) {
            this.exportTable(res.data, true);
          } else {
            this.app.$emit(this.$t("alarm.exportAllTip"));
          }
        }
      });
    },
    exportAlarmAll() {
      //根据选择列导出全部报警
      var title = [];
      var code = [];
      this.exportColumns = this.exportColumns.sort(function (a, b) {
        return a - b;
      });
      for (var i = 0; i < this.exportColumns.length; i++) {
        var item = this.exportTitle[this.exportColumns[i]];
        title.push(item.name);
        code.push(item.code);
      }
      return {
        title,
        code,
      };
    },
    exportTable(dataList, tag) {
      //导出表格
      document.getElementById("loading_page").style.display = "flex";
      //currentTable:0,//0 总览 1统计 2详情
      var title = [],
        list = [],
        origin_data = [];
      var fileName = "";
      switch (this.currentTable) {
        case 0: //总览
          if (tag) {
            fileName = this.userName + "-报警总览-导出全部";
            origin_data = dataList;
          } else {
            fileName = this.userName + "-报警总览-导出第" + this.page.current + "页";
            origin_data = this.alarmList;
          }
          if (this.exportColumns.length > 0) {
            var op = this.exportAlarmAll();
            title = op.title;
            for (var i = 0; i < origin_data.length; i++) {
              var item = origin_data[i];
              var item1 = [];
              for (var j = 0; j < op.code.length; j++) {
                if (op.code[j] == "num16") {
                  item1.push(item.num16 + item.num17);
                } else {
                  item1.push(item[op.code[j]]);
                }
              }
              list.push(item1);
            }
          } else {
            title = [
              this.$t("common.deviceImei"),
              this.$t("common.deviceName"),
              this.$t("alarm.shock"),
              this.$t("alarm.powerOff"),
              this.$t("alarm.lowPower"),
              this.$t("alarm.overSpeed"),
              this.$t("alarm.fenceOut"),
              this.$t("alarm.antennaShort"),
              this.$t("alarm.antennaOpen"),
              this.$t("alarm.lowVoltage"),
              this.$t("alarm.switchDoor"),
              this.$t("alarm.remove"),
              this.$t("alarm.lightSense"),
              this.$t("alarm.offline"),
              this.$t("alarm.acceleration"),
              this.$t("alarm.deceleration"),
              this.$t("alarm.turnleft"),
              this.$t("alarm.turnright"),
              // 2021-4-12新增
              this.$t("alarm.weakSignal"),
              this.$t("alarm.clockin"),
              this.$t("alarm.staticAlarm"),
              this.$t("alarm.shielding"),
              this.$t("alarm.bluetoothBroken"),
              this.$t("alarm.recovery"),
            ];
            for (let i = 0; i < origin_data.length; i++) {
              let item = origin_data[i];
              console.log(item);
              list.push([
                item.deviceImei,
                item.name,
                item.num2,
                item.num3,
                item.num4,
                item.num6,
                item.num7,
                item.num9,
                item.num10,
                item.num13,
                item.num16 + item.num17,
                item.num20,
                item.num21,
                item.num25,
                item.num31,
                item.num32,
                item.num33,
                item.num34,
                //
                item.num28,
                item.num44,
                item.num45,
                item.num46,
                item.num47,
                item.num29,
              ]);
            }
          }
          break;
        case 1: //统计
          fileName = this.userName + "-报警统计(" + this.deviceImei + ")-导出第" + this.page.current + "页";
          origin_data = this.statisticsList;
          title = [
            this.$t("alarm.msgTime"),
            this.$t("alarm.shock"),
            this.$t("alarm.powerOff"),
            this.$t("alarm.lowPower"),
            this.$t("alarm.overSpeed"),
            this.$t("alarm.fenceOut"),
            this.$t("alarm.antennaShort"),
            this.$t("alarm.antennaOpen"),
            this.$t("alarm.lowVoltage"),
            this.$t("alarm.switchDoor"),
            this.$t("alarm.remove"),
            this.$t("alarm.lightSense"),
            this.$t("alarm.offline"),
            this.$t("alarm.acceleration"),
            this.$t("alarm.deceleration"),
            this.$t("alarm.turnleft"),
            this.$t("alarm.turnright"),
            // 2021-4-12新增
            this.$t("alarm.weakSignal"),
            this.$t("alarm.clockin"),
            this.$t("alarm.staticAlarm"),
            this.$t("alarm.shielding"),
            this.$t("alarm.bluetoothBroken"),
            this.$t("alarm.recovery"),
          ];
          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.msgTime ? new Date(item.msgTime).format("yyyy-MM-dd") : "--",
              item.num2,
              item.num3,
              item.num4,
              item.num6,
              item.num7,
              item.num9,
              item.num10,
              item.num13,
              item.num16 + item.num17,
              item.num20,
              item.num21,
              item.num25,
              item.num31,
              item.num32,
              item.num33,
              item.num34,
              //
              item.num28,
              item.num44,
              item.num45,
              item.num46,
              item.num47,
              item.num29,
            ]);
          }
          break;
        case 2: //详单
          fileName = this.userName + "-报警详单(" + this.deviceImei + ")-导出第" + this.page.current + "页";
          origin_data = this.detailList;
          title = [
            this.$t("alarm.alarmType"),
            this.$t("alarm.alarmTime"),
            this.$t("alarm.latitude"),
            this.$t("alarm.longitude"),
            this.$t("alarm.locationTime"),
            this.$t("alarm.speed"),
            this.$t("alarm.address"),
          ];
          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.warnName,
              item.msgTime ? new Date(item.msgTime).format("yyyy-MM-dd hh:mm") : "--",
              item.latitude,
              item.longitude,
              item.locTime ? new Date(item.locTime).format("yyyy-MM-dd hh:mm") : "--",
              item.speed,
              item.address,
            ]);
          }
          break;
      }
      ExportUtil.exportTable(title, list, fileName + "(" + this.timeFrom + "-" + this.timeTo + ")");
      document.getElementById("loading_page").style.display = "none";
      this.isColumnDialog = false;
    },
    dealDataTable(item, idx, name) {
      //处理表格操作
      var that = this;
      if (name == "alarmDevice") {
        //查看 设备详情
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei,
        });
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: item.deviceImei,
        });
      }
      //currentTable:0,//0 运行总览 1统计 2详情
      else if (name == "alarmStatistics") {
        //查看设备报警统计
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei,
        });
        this.currentTable = 1;
        this.page.current = 1;
        this.loadStatistics();
      } else if (name == "alarmDetail") {
        //查看设备报警详单
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei,
        });
        this.currentTable = 2;
        this.page.current = 1;
        this.loadDetail();
      } else if (item.name == "back") {
        //返回报警总览
        this.currentTable = 0;
        this.page.current = 1;
        this.loadAlarm();
      } else if (name == "alarmDetailAddress") {
        //加载设备报警箱单地址
        var lng = item.baidu_lon,
          lat = item.baidu_lat;
        if (lng && lat && lat != 0 && lng > -180 && lng <= 180 && lat <= 90 && lat >= -90) {
          this.getPoiLocation(lng, lat, function (address) {
            that.detailList[idx].address = address ? address : that.$t("common.addressFail");
          });
        }
      }
    },
    dealDevOp(op) {
      //处理设备列表操作
      if (op.btnType == 2) {
        var idx = op.idx;
        this.imei = op.imei;
        //this.app.$emit('monitor-change-device',{deviceImei:this.imei})
        if (idx == 0) {
          //统计
          this.currentTable = 1;
          this.page.current = 1;
          this.loadStatistics();
        } else if (idx == 1) {
          //详情
          this.currentTable = 2;
          this.page.current = 1;
          this.loadDetail();
        }
      }
    },
    dealPager() {
      //处理分页器操作
      console.log("chufa");
      switch (this.currentTable) {
        case 0:
          this.loadAlarm();
          break;
        case 1:
          this.loadStatistics();
          break;
        case 2:
          this.loadDetail();
          break;
      }
    },
    onSelectUser(userId, userName) {
      //选中用户树中用户
      if (userName) {
        this.userName = userName;
      }
      this.userId = userId;
      this.dealDataTable({
        name: "back",
      });
    },
    onSelectDev(device) {
      //选中设备
      this.imei = device.deviceImei;
    },
    listenEvent() {
      this.app.$on("monitor-select-user", this.onSelectUser);
      this.app.$on("monitor-select-dev", this.onSelectDev);
      this.app.$on("monitor-dev-op", this.dealDevOp);
    },
    offEvent() {
      this.app.$off("monitor-select-user", this.onSelectUser);
      this.app.$off("monitor-select-dev", this.onSelectDev);
      this.app.$off("monitor-dev-op", this.dealDevOp);
    },
    initPermission() {
      //初始化权限
      if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
        var users = [5186, 6549, 7850, 7037, 2475, 8167, 8168, 8169, 8170, 8171, 8172, 8173, 238];
        for (var i = 0; i < users.length; i++) {
          if (this.rootUser.userId == users[i]) {
            this.isDeng = true;
            break;
          }
        }
      } else {
        this.isDeng = false;
      }
    },
  },
  mounted() {
    this.listenEvent();
    this.initPermission();
    if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
      this.exportColumns = window.localStorage.getItem("carweb_alarmall_columns") ? JSON.parse(window.localStorage.getItem("carweb_alarmall_columns")) : [];
    }
  },
  beforeDestroy() {
    this.offEvent();
  },
};
