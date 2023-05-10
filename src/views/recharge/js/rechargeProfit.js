import RelationDialog from "@/components/relationDialog/RelationDialog";
import DevDetailDialog from "@/components/devDetailDialog/DevDetailDialog";
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import {
  loadProfitListInfo,
  summaryProfit,
  summarySubUserProfit
} from "@/api/recharge.js";
import RechargeAccountDialog from "@/components/RechargeAccountDialog/RechargeAccountDialog.vue";
import WithdrawalDialog from "@/components/withdrawalDialog/WithdrawalDialog.vue";
import FlowRecord from "@/components/FlowRecord/FlowRecord";
import TimeRange from "@/components/TimeRangeComp/TimeRangeComp";
import UserTree from "@/components/UserTree/UserTree";
import ExportUtil from "@/utils/exportUtil.js";
import { showFullScreenLoading, hideFullScreenLoading } from "@/utils/loading";
export default {
  name: "RechargeProfit",
  components: {
    "relation-dialog": RelationDialog,
    "dev-detail-dialog": DevDetailDialog,
    "user-box": UserBox,
    "device-box": DeviceBox,
    "recharge-account-dialog": RechargeAccountDialog,
    "withdrawal-dialog": WithdrawalDialog,
    "flow-record": FlowRecord,
    "user-tree": UserTree,
    "time-range": TimeRange
  },
  data: () => ({
    profitList: [],
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId, //查询客户id
    userId1: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName, //查询客户名
    page: {
      //订单分页器
      name: "profitList",
      pageSize: 30,
      current: 1,
      num: 1,
      total: 0
    },
    page1: {
      //订单分页器
      name: "profit",
      pageSize: 50,
      current: 1,
      num: 1
    },
    //查询开始日期
    timeFrom: new Date().format("yyyy-MM-01"),
    //查询结束日期
    timeTo: new Date().format("yyyy-MM-dd"),
    externalId: "", //查询订单号
    deviceImei: "", //查询设备号
    errOnly: false, //是否仅列举异常订单
    isUserBox: false, //是否显示用户搜索框
    isDeviceBox: false, //是否显示设备搜索框
    statisticsType: 2, //查询方式是按月还是按天，默认是按月的
    isShowRecord: false,
    isTimeRangeBox: false, //控制时间段的显示
    searchType: "day", //运行总览搜索类型
    //查询开始日期
    startDate: new Date().format("yyyy-MM-01"),
    //查询结束日期
    endDate: new Date().format("yyyy-MM-dd"),
    goodsType: -1,
    summaryProfitList: [],
    rechargeGoodsTypeList: [], //充值类型
    showDetailProfit: false,
    isChild: false,
    isShowChild: false,
    selectList: [] //详情中订单的选中
  }),
  watch: {
    userName() {
      if (!this.userName) {
        this.userId = null;
      }
    },
    deviceImei() {
      if (!this.deviceImei) {
        this.isDeviceBox = false;
      }
    },
    isChild() {
      if (this.isChild) {
        this.summarySubUserProfit();
      } else {
        this.loadSummaryProfit();
      }
    }
  },
  created() {
    this.rechargeGoodsTypeList = this.$t("rechargePrice.rechargeGoodsType");
  },
  methods: {
    changeTime() {
      console.log("chufa");
      if (
        new Date(this.startDate).getTime() + 30 * 24 * 60 * 60 * 1000 <=
        new Date(this.endDate).getTime()
      ) {
        this.statisticsType = 2;
      } else {
        this.statisticsType = 1;
      }
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    exportEcall(list) {
      // 构建表格导出的模板
      let theTitle = [
        this.$t("common.num"),
        this.$t("recharge.externalId"),
        this.$t("common.deviceImei"),
        this.$t("recharge.dealer"),
        this.$t("recharge.series"),
        this.$t("recharge.costPrice"),
        this.$t("recharge.price"),
        this.$t("rechargeBill.profit"),
        this.$t("recharge.payWay"),
        this.$t("recharge.orderTime")
      ];
      let theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.externalId,
          item.deviceImei,
          item.userName,
          item.goodsName,
          item.costPrice ? (item.costPrice * 0.01).toFixed(2) : 0,
          item.sellPrice ? (item.sellPrice * 0.01).toFixed(2) : 0,
          (item.profit * 0.01).toFixed(2),
          item.createTime
            ? new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss")
            : "--"
        ]);
      }
      ExportUtil.exportTable(
        theTitle,
        theList,
        this.userName + this.$t("rechargeBill.profitSearch")
      );
    },
    exportTable(tag) {
      // 导出表格
      if (tag == "all") {
        var data = {
          page: 1,
          pageSize: 10000,
          errOnly: this.errOnly
        };
        // if (this.timeFrom && this.timeTo) {
        //   data.from = new Date(this.timeFrom).getTime();
        //   data.to = new Date(this.timeTo).getTime();
        // }
        data.from = new Date("2000, 01, 01").getTime();
        data.to = new Date(this.timeTo).getTime();
        if (this.externalId) {
          data.externalId = this.externalId;
        }
        if (this.deviceImei) {
          data.deviceImei = this.deviceImei;
        }
        if (this.userId && this.userName) {
          data.userId = this.userId;
        }
        // console.log(data);
        loadProfitListInfo(data).then(res => {
          if (res.errCode == "200") {
            this.exportEcall(res.data.list);
          }
        });
      } else {
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        this.exportEcall(this.selectList);
      }
    },
    getCurrentMonthLast(monthdata) {
      // 获取当前月的最后一天
      var date = new Date(monthdata);
      var currentMonth = date.getMonth();
      var nextMonth = ++currentMonth;
      var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
      var oneDay = 1000 * 60 * 60 * 24;
      var lastTime = new Date(nextMonthFirstDay - oneDay);
      var month = parseInt(lastTime.getMonth() + 1);
      var day = lastTime.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      return date.getFullYear() + "-" + month + "-" + day;
    },
    showLoadDetailProfit(item) {
      // 点击查看详情
      // console.log(item);
      // 点击查看详情
      this.showDetailProfit = true;
      if (this.isChild) {
        this.userId = item.userId;
        this.userName = item.userName;
        this.timeFrom = new Date(
          new Date(this.startDate).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime();
        this.timeTo = new Date(
          new Date(this.endDate).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime();
      } else {
        if (this.statisticsType == 1) {
          this.timeFrom = new Date(
            new Date(item.summaryDate).format("yyyy-MM-dd") + " 00:00:00"
          ).getTime();
          this.timeTo = new Date(
            new Date(item.summaryDate).format("yyyy-MM-dd") + " 23:59:59"
          ).getTime();
        } else if (this.statisticsType == 2) {
          this.timeFrom = new Date(
            new Date(item.summaryDate).format("yyyy-MM-01") + " 00:00:00"
          ).getTime();

          let lastDay = this.getCurrentMonthLast(item.summaryDate);
          this.timeTo = new Date(
            new Date(lastDay).format("yyyy-MM-dd") + " 23:59:59"
          ).getTime();
        }
      }
      this.loadProfitList();
    },
    loadSearch() {
      if (this.isChild) {
        this.summarySubUserProfit();
      } else {
        this.isChild = false;
        this.loadSummaryProfit();
      }
    },
    loadSummaryProfit() {
      // 加载用户个人的利润
      let data = {
        userId: this.userId,
        page: this.page1.current,
        pageSize: this.page1.pageSize
      };
      if (this.statisticsType > -1) {
        data.type = this.statisticsType;
      }
      if (this.startDate && this.endDate) {
        data.startTime = new Date(
          new Date(this.startDate).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime();
        data.endTime = new Date(
          new Date(this.endDate).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime();
      }
      if (this.goodsType > -1) {
        data.goodsType = this.goodsType;
      }
      summaryProfit(data).then(res => {
        if (res.errCode == 200) {
          this.isShowChild = false;
          this.summaryProfitList = res.data.list;
          this.page1.num = res.data.pageCount;
        } else {
          this.app.$emit("show-alart-msg", this.$t("common.queryError"));
        }
      });
    },
    summarySubUserProfit() {
      // 加载用户及下级用户的利润
      let data = {
        userId: this.userId,
        page: this.page1.current,
        pageSize: this.page1.pageSize
      };
      if (this.statisticsType > -1) {
        data.type = this.statisticsType;
      }
      if (this.startDate && this.endDate) {
        data.startTime = new Date(
          new Date(this.startDate).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime();
        data.endTime = new Date(
          new Date(this.endDate).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime();
      }
      if (this.goodsType > -1) {
        data.goodsType = this.goodsType;
      }
      // this.app.$emit("show-progress-page", 0);
      showFullScreenLoading(".recharge-porfit");
      summarySubUserProfit(data).then(res => {
        if (res.errCode == 200) {
          hideFullScreenLoading();
          // this.app.$emit("show-progress-page", 100);
          this.isShowChild = true;
          this.summaryProfitList = res.data.list;
          this.page1.num = res.data.pageCount;
        } else {
          this.app.$emit("show-alart-msg", this.$t("common.queryError"));
          this.app.$emit("show-progress-page", 100);
        }
      });
    },
    rechargeGoodsTypeChange(e) {
      this.goodsType = e;
    },
    onTimeRange(op) {
      // 时间范围框结果
      this.startDate = op.startTimeFormat;
      this.endDate = op.endTimeFormat;
      this.searchType = op.range;
      if (op.range == "week") {
        this.statisticsType = 1;
      } else if (op.range == "month") {
        this.statisticsType = 2;
      }
    },
    setTimeRange(tag) {
      //设置时间范围
      var from = new Date().getTime();
      switch (tag) {
        case "today":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            8 * 60 * 60 * 1000;
          this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.endDate = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.statisticsType = 1;
          break;
        case "yesterday":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.endDate = new Date(from + 24 * 3600 * 1000 - 1000).format(
            "yyyy-MM-dd hh:mm:ss"
          );
          this.statisticsType = 1;
          break;
        case "thisWeek":
          var day = new Date().getDay() - 1;
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            (day > 0 ? day : day + 7) * 24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.endDate = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.statisticsType = 1;
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
            this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.endDate = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.statisticsType = 1;
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
          this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.endDate = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.statisticsType = 2;
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
            this.startDate = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.endDate = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.statisticsType = 2;
          }
          break;
      }
    },
    onSelectUser(userId, userName) {
      // console.log(typeof userId);
      this.userId = userId;
      this.userName = userName;
      this.page.current = 1;
    },
    showFlowRecord() {
      this.app.$emit("show-flow-record-dialog");
    },
    showRechargeAccountDialog() {
      // console.log("chufa");
      this.app.$emit("show-recharge-account-dialog", {
        data: "abc"
      });
    },
    payWay_cn(item) {
      //获取付款类型
      // 2021-1-11
      switch (item.payWay) {
        case 1:
          return this.$t("recharge.appPay");

        case 2:
          return this.$t("recharge.applets");

        case 3:
          return this.$t("recharge.alipay");

        case 4:
          return this.$t("recharge.wechat");

        default:
          return this.$t("recharge.other");
      }
    },

    billStatus_cn(item) {
      //获取订单状态
      switch (item.status) {
        case 0:
          return this.$t("recharge.unpay");
        case 1:
          return this.$t("recharge.waitAudit");
        case 2:
          return this.$t("recharge.dealing");
        case 3:
          return this.$t("recharge.dealed");
        case 4:
          return this.$t("recharge.refunded");
        case -1:
          return this.$t("recharge.notSupportSim");
        case -2:
          return this.$t("recharge.simError");
        case -3:
          return this.$t("recharge.inStoreFail");
        default:
          return this.$t("recharge.error");
      }
    },
    jumpRechargeChart() {
      //跳转到充值驾驶舱
      window.open(
        window.location.origin + window.location.pathname + "#/recharge-chart"
      );
    },
    searchUser() {
      //搜索用户
      this.app.$emit("close-user-box");
      this.isUserBox = true;
      this.isDeviceBox = false;
    },
    searchDev() {
      //搜索设备
      if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
        this.isDeviceBox = true;
        this.isUserBox = false;
      } else {
        this.isDeviceBox = false;
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
      }
    },

    dealTableOp(item, idx, name) {
      // 处理表格操作
      if (name == "profitSeller") {
        //查看客户关系
        this.app.$emit("show-relation-dialog", {
          name: "RelationDialog",
          imei: item.deviceImei
        });
      } else if (name == "profitDevice") {
        //查看设备详情
        this.app.$emit("show-dev-detail-dialog", {
          name: "DevDetailDialog",
          imei: item.deviceImei
        });
      }
    },
    searchProfitList() {
      //搜索订单
      this.page.current = 1;
      this.loadProfitList();
    },
    loadProfitList() {
      //加载订单
      var data = {
        page: this.page.current,
        pageSize: this.page.pageSize,
        errOnly: this.errOnly
      };
      if (this.timeFrom && this.timeTo) {
        data.from = new Date(this.timeFrom).getTime();
        data.to = new Date(this.timeTo).getTime();
      }
      if (this.externalId) {
        data.externalId = this.externalId;
      }
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      if (this.userId && this.userName) {
        data.userId = this.userId;
      }
      loadProfitListInfo(data).then(res => {
        if (res.errCode == "200") {
          this.profitList = res.data.list;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    },
    dealUserItem(op) {
      //选择用户搜索box
      this.userId = op.userId;
      this.userName = op.userName;
    },
    dealDevItem(op) {
      //选择设备搜索box
      this.deviceImei = op.deviceImei;
    },
    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    // this.loadProfitList();
    this.loadSummaryProfit();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
