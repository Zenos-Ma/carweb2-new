import userTreeComp from "@/components/UserTree/UserTree";
import deviceList from "@/components/DeviceList/DeviceList.vue";
import mapUtil from "@/utils/mapUtil.js";
import ExportUtil from "@/utils/exportUtil.js";
import TimeRange from "@/components/TimeRangeComp/TimeRangeComp";
import {
  loadDeviceRunning,
  loadDeviceACC,
  loadDeviceStay,
  loadDeviceOverSpeed,
  loadDeviceMileage
} from "@/api/monitor.js";
export default {
  name: "Running",
  components: {
    "user-tree": userTreeComp,
    "device-list": deviceList,
    "time-range": TimeRange
  },
  props: {},
  data: () => ({
    runningList: [], //运行总览数据
    mileageList: [], //里程统计数据
    overspeedList: [], //超速统计数据
    stayList: [], //停留统计数据
    accList: [], //ACC统计数据
    currentTable: 0, //0 运行总览 1里程统计 2超速 3停留 4ACC
    imei: "", //当前选择的imei
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId, //当前选中的用户
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    timeFrom: new Date(new Date().getTime() - 3600 * 1000).format(
      "yyyy-MM-dd hh:00:00"
    ), //查询开始时间
    timeTo: new Date().format("yyyy-MM-dd hh:00:00"),
    page: {
      //数据表格分页器
      name: "runningList",
      pageSize: 30,
      num: 1,
      current: 1,
      total: 0
    },
    isLoading: false, //数据表格是否正在加载
    searchType: "day", //运行总览搜索类型
    isDateOver: false,
    isDateBefore: false,
    isDateLast: false,
    isTimeRangeBox: false //时间范围框
  }),
  watch: {
    timeFrom() {
      this.checkTimeRange();
    },
    timeTo() {
      this.checkTimeRange();
    }
  },
  methods: {
    onTimeRange(op) {
      //时间范围框结果
      this.timeFrom = op.startTimeFormat;
      this.timeTo = op.endTimeFormat;
      this.searchType = op.range;
    },
    checkTimeRange() {
      //检查时间范围
      var halfYear = new Date().getTime() - 186 * 24 * 3600000;
      if (
        new Date(this.timeTo).getTime() < halfYear ||
        new Date(this.timeFrom).getTime() < halfYear
      ) {
        this.isDateLast = true;
      } else {
        this.isDateLast = false;
      }
      if (
        new Date(this.timeTo).getTime() - new Date(this.timeFrom) >
        31 * 24 * 3600000
      ) {
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

    showDevice() {
      //搜索设备
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: this.imei
      });
    },
    setTimeRange(tag) {
      //设置时间范围
      var from = new Date().getTime();
      switch (tag) {
        case "today":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "day";
          break;
        case "yesterday":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date(from + 24 * 3600 * 1000 - 1000).format(
            "yyyy-MM-dd hh:mm:ss"
          );
          this.searchType = "day";
          break;
        case "thisWeek":
          var day = new Date().getDay() - 1;
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            (day > 0 ? day : day + 7) * 24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "week";
          break;
        case "lastWeek":
          {
            let day = new Date().getDay() - 1;
            day = day > 0 ? day : day + 7;

            from =
              new Date(new Date().format("yyyy-MM-dd")).getTime() -
              (day + 7) * 24 * 3600 * 1000 -
              8 * 60 * 60 * 1000;
            var to =
              new Date(new Date().format("yyyy-MM-dd")).getTime() -
              day * 24 * 3600 * 1000 -
              8 * 60 * 60 * 1000 -
              1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.searchType = "week";
          }

          break;
        case "thisMonth":
          var month = new Date().getMonth() + 1;
          from =
            new Date(
              new Date().getFullYear() +
                "-" +
                (month > 9 ? month : "0" + month) +
                "-01"
            ).getTime() -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "month";
          break;
        case "lastMonth":
          {
            var m = new Date(new Date().getTime() - 30 * 24 * 3600000);
            from =
              new Date(
                m.getFullYear() + "-" + (m.getMonth() + 1) + "-01"
              ).getTime() -
              8 * 60 * 60 * 1000;
            let to =
              new Date(
                new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-01"
              ) -
              8 * 60 * 60 * 1000 -
              1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.searchType = "month";
          }
          break;
      }
    },

    dealDataTable(item, idx, name) {
      // console.log("item", item);
      // console.log("idx", idx);
      // console.log("name", name);
      //处理表格操作
      var that = this;
      if (name == "runDetail") {
        //显示设备详情对话框
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei
        });
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: item.deviceImei
        });
      } else if (name == "runPlayback") {
        //回放界面
        this.imei = item.deviceImei;
        let timeFromStr = new Date(this.timeFrom).getTime();
        let timeToStr = new Date(this.timeTo).getTime();
        window.open(
          window.location.origin +
            window.location.pathname +
            `#/playback?deviceImei=${
              item.deviceImei
            }&from=${timeFromStr}&to=${timeToStr}`
        );
      }
      //currentTable:0,//0 运行总览 1里程统计 2超速 3停留
      else if (name == "runSpeed") {
        //超速统计表格
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei
        });
        this.currentTable = 2;
        this.page.current = 1;
        this.loadSpeed();
      } else if (name == "runStay") {
        //停留统计表格
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei
        });
        this.currentTable = 3;
        this.page.current = 1;
        this.loadStay();
      } else if (name == "runACC") {
        //ACC统计表格
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei
        });
        this.currentTable = 4;
        this.page.current = 1;
        this.loadACC();
      } else if (name == "runMileage") {
        //里程统计表格
        this.imei = item.deviceImei;
        this.app.$emit("monitor-change-device", {
          deviceImei: this.imei
        });
        this.currentTable = 1;
        this.page.current = 1;
        this.loadMileage();
      } else if (item.name == "back") {
        //返回运行总览表格
        this.currentTable = 0;
        this.page.current = 1;
        this.loadRunning();
      } else if (name == "overSpeedAddress") {
        //超速统计地址显示
        var lng = item.baidu_lon,
          lat = item.baidu_lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.overspeedList[idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        }
      } else if (op.name == "stayAddress") {
        let lng = item.baidu_lon,
          lat = item.baidu_lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.stayList[idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        }
      }
    },
    searchTable() {
      //查询表格
      this.page.current = 1;
      switch (this.currentTable) {
        case 0:
          this.loadRunning();
          break;
        case 1:
          this.loadMileage();
          break;
        case 2:
          this.loadSpeed();
          break;
        case 3:
          this.loadStay();
          break;
        case 4:
          this.loadACC();
          break;
      }
    },
    dealPager() {
      //改变分页器当前页
      switch (this.currentTable) {
        case 0:
          this.loadRunning();
          break;
        case 1:
          this.loadMileage();
          break;
        case 2:
          this.loadSpeed();
          break;
        case 3:
          this.loadStay();
          break;
        case 4:
          this.loadACC();
          break;
      }
    },
    dealDevOp(op) {
      //处理设备列表操作
      var idx = op.idx;
      this.imei = op.imei;
      if (this.isDateLast || this.isDateOver || this.isDateBefore) return;
      if (op.btnType == 1) {
        if (idx == 0) {
          //里程
          this.currentTable = 1;
          this.page.current = 1;
          this.loadMileage();
        } else if (idx == 1) {
          //停留
          this.currentTable = 3;
          this.page.current = 1;
          this.loadStay();
        } else if (idx == 2) {
          //超速
          this.currentTable = 2;
          this.page.current = 1;
          this.loadSpeed();
        } else if (idx == 3) {
          //ACC
          this.currentTable = 4;
          this.page.current = 1;
          this.loadACC();
        }
      }
    },
    exportTable() {
      //导出当前表格数据
      //currentTable:0,//0 运行总览 1里程统计 2超速 3停留
      var title = [],
        list = [],
        origin_data = [];
      var fileName = "";
      switch (this.currentTable) {
        case 0:
          fileName = this.userName + "-运行总览第" + this.page.current + "页";
          origin_data = this.runningList;
          title = [
            this.$t("common.deviceImei"),
            this.$t("common.deviceName"),
            this.$t("running.mileage"),
            this.$t("running.overspeed"),
            this.$t("running.stay"),
            this.$t("running.acc")
          ];

          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.deviceImei,
              item.name,
              item.mileage,
              item.overspeed,
              item.stay,
              item.accRecordCount
            ]);
          }
          break;
        case 1: //里程
          fileName =
            this.userName +
            "-里程统计(" +
            this.deviceImei +
            ")第" +
            this.page.current +
            "页";
          origin_data = this.mileageList;
          title = [
            this.$t("alarm.date"),
            this.$t("running.mileage"),
            this.$t("running.overspeed"),
            this.$t("running.stay")
          ];

          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.date ? new Date(item.date).format("yyyy-MM-dd") : "--",
              item.mileage,
              item.overspeed,
              item.stay
            ]);
          }
          break;
        case 2: //超速
          fileName =
            this.userName +
            "-超速统计(" +
            this.deviceImei +
            ")第" +
            this.page.current +
            "页";
          origin_data = this.overspeedList;
          title = [
            this.$t("alarm.locationTime"),
            this.$t("alarm.speed"),
            this.$t("alarm.longitude"),
            this.$t("alarm.latitude"),
            this.$t("common.address")
          ];

          for (let i = 0; i < origin_data.length; i++) {
            var item = origin_data[i];
            list.push([
              item.ts ? new Date(item.ts).format("yyyy-MM-dd hh:mm:ss") : "--",
              item.speed,
              item.longitude,
              item.latitude,
              item.address
            ]);
          }
          break;
        case 3: //停留
          fileName =
            this.userName +
            "-停留统计(" +
            this.deviceImei +
            ")第" +
            this.page.current +
            "页";
          origin_data = this.stayList;
          title = [
            this.$t("common.startTime"),
            this.$t("common.endTime"),
            this.$t("common.stayTime"),
            this.$t("alarm.longitude"),
            this.$t("alarm.latitude"),
            this.$t("common.address")
          ];

          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.startTs
                ? new Date(item.startTs).format("yyyy-MM-dd hh:mm:ss")
                : "--",
              item.stopTs
                ? new Date(item.stopTs).format("yyyy-MM-dd hh:mm:ss")
                : "--",
              item.stayTime,
              item.longitude,
              item.latitude,
              item.address
            ]);
          }
          break;
        case 4: //acc
          fileName =
            this.userName +
            "-ACC统计(" +
            this.deviceImei +
            ")第" +
            this.page.current +
            "页";
          origin_data = this.accList;
          title = [
            this.$t("running.openDate"),
            this.$t("running.closeDate"),
            this.$t("running.durationTime")
          ];

          for (let i = 0; i < origin_data.length; i++) {
            let item = origin_data[i];
            list.push([
              item.openDate
                ? new Date(item.openDate).format("yyyy-MM-dd hh:mm:ss")
                : "--",
              item.closeDate
                ? new Date(item.closeDate).format("yyyy-MM-dd hh:mm:ss")
                : "--",
              item.durationTime
            ]);
          }
          break;
      }
      ExportUtil.exportTable(
        title,
        list,
        fileName + "(" + this.timeFrom + "-" + this.timeTo + ")"
      );
    },
    //规格化时间
    cnTime: mapUtil.cnTime,
    onSelectUser(userId, userName) {
      //选中用户树中用户
      if (userName) {
        this.userName = userName;
      }
      this.userId = userId;
      this.dealDataTable({
        name: "back"
      });
    },
    onSelectDev(device) {
      //选中设备列表设备
      this.imei = device.deviceImei;
    },
    loadMileage() {
      //加载里程统计
      this.isLoading = true;
      const data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        userId: this.userId ? this.userId : this.rootUser.userId
      };
      loadDeviceMileage(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.mileageList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadSpeed() {
      //加载超速统计
      this.isLoading = true;
      const data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        userId: this.userId ? this.userId : this.rootUser.userId
      };
      loadDeviceOverSpeed(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.childs.length; i++) {
            res.data.childs[i].address = "";
          }
          this.overspeedList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadStay() {
      //加载停留统计
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        userId: this.userId ? this.userId : this.rootUser.userId
      };
      loadDeviceStay(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.childs.length; i++) {
            var item = res.data.childs[i];
            res.data.childs[i].address = "";
            res.data.childs[i].stayTime = mapUtil.cnTime(
              item.stopTs - item.startTs
            );
          }
          this.stayList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadACC() {
      //加载ACC统计
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        userId: this.userId ? this.userId : this.rootUser.userId
      };
      loadDeviceACC(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.accList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadRunning() {
      //加载运行总览
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        userId: this.userId ? this.userId : this.rootUser.userId,
        mode: this.searchType
      };
      loadDeviceRunning(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.runningList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
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
    }
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
