import InsuRecordDialog from "./InsuRecordDialog";
import ExportUtil from "@/utils/exportUtil.js";
import UserBox from "@/components/UserBox";
import { loadAllInsurance, loadInsuranceList } from "@/api/insurance";
export default {
  name: "Insurance",
  components: {
    "insu-record-dialog": InsuRecordDialog,
    "user-box": UserBox
  },
  data: () => ({
    //保单表格title
    insuranceTitle: [
      {
        type: "checkbox"
      }
    ], //保单表格数据
    insuranceList: [], //经销商
    userId: "",
    userName: "", //第一受益人
    custName: "", //车架号
    frameId: "", //保单合同号
    policyId: "", //车主姓名
    drivLicName: "", //车主身份证号
    drivLicIdNum: "", //安装时间
    installFrom: "2000-01-01",
    installTo: new Date().format("yyyy-MM-dd"), //保单表格分页器
    page: {
      name: "insuranceList",
      current: 1,
      num: 1,
      total: 0,
      limit: 30
    }, //勾选表格项
    selectList: [], //多选表格选中项idx
    isUserBox: false, //是否显示搜索用户框
    isEcall: false //是否只导出Ecall保单
  }),
  watch: {
    userName() {
      if (!this.userName) {
        this.userId = null;
      }
    }
  },
  methods: {
    selectionChange(val) {
      this.selectList = val;
    },
    getInsuranceType(item) {
      //根据保额与有效年限判断保单类型
      var money;
      if (item.coverage <= 30000) {
        money = 0;
      } else if (item.coverage > 30000 && item.coverage <= 100000) {
        money = 1;
      } else if (item.coverage > 100000 && item.coverage <= 200000) {
        money = 2;
      } else if (item.coverage > 200000 && item.coverage <= 300000) {
        money = 3;
      } else if (item.coverage > 300000 && item.coverage <= 400000) {
        money = 4;
      } else if (item.coverage > 400000 && item.coverage <= 500000) {
        money = 5;
      } else {
        money = 6;
      }
      var year =
        Math.ceil((item.tTo - item.tFrom) / (365 * 24 * 3600 * 1000)) + 1;
      return `${year}类-${money}`;
    },
    exportEcall(list) {
      //导出Ecall保单
      var title = [
        "序号",
        "姓名",
        "手机号",
        "证件类型",
        "证件号码（身份证号码）",
        "车牌号",
        "车架号（17位数）",
        "终端ID（同身份证号码）",
        "服务生效日期",
        "服务截止日期",
        "车辆品牌",
        "车辆型号",
        "紧急联系人姓名1",
        "紧急联系人手机号1",
        "会员ID（同车架号17位数）",
        "车辆类型",
        "套餐编号",
        "渠道代码"
      ];
      var theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.policyType == "kangqi4") {
          theList.push([
            i + 1,
            item.drivLicName,
            item.custPhone,
            "身份证",
            item.drivLicIdNum,
            item.carPlateNum,
            item.frameId,
            item.drivLicIdNum,
            item.tFrom ? new Date(item.tFrom).format("yyyy-MM-dd") : "",
            item.tTo ? new Date(item.tTo).format("yyyy-MM-dd") : item.tTo,
            item.carBrand,
            item.carType,
            item.emergencyContact,
            item.emergencyContactNumber,
            item.frameId,
            "08",
            "KQ-PC-BJS202001Q028-PRODUCT",
            "CB1000040"
          ]);
        }
      }
      ExportUtil.exportTable(title, theList);
    },

    exportTable(tag) {
      //导出保单表格
      var that = this;
      if (tag == "all") {
        //导出全部
        var data = {
          page: 1,
          pageSize: 1000000000
        };
        if (this.userId) {
          data.userId = this.userId;
        }
        if (this.custName) {
          data.custName = this.custName;
        }
        if (this.frameId) {
          data.frameId = this.frameId;
        }
        if (this.policyId) {
          data.policyId = this.policyId;
        }
        if (this.drivLicName) {
          data.drivLicName = this.drivLicName;
        }
        if (this.drivLicIdNum) {
          data.drivLicIdNum = this.drivLicIdNum;
        }
        if (this.installFrom && this.installTo) {
          data.tInstallFrom = new Date(this.installFrom).getTime();
          data.tInstallTo = new Date(this.installTo).getTime();
        }
        loadAllInsurance(data).then(res => {
          if (res.errCode == 200) {
            if (this.isEcall) {
              this.exportEcall(res.data.items);
            } else {
              this.createXls(res.data.items);
            }
          }
        });
      } else {
        //导出已选中的当前表格的数据项
        var origin_data = [];
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        for (var i = 0; i < this.selectList.length; i++) {
          origin_data.push(this.insuranceList[this.selectList[i]]);
        }
        if (that.isEcall) {
          that.exportEcall(origin_data);
        } else {
          that.createXls(origin_data);
        }
      }
    },
    createXls(origin_data) {
      //导出xls表格
      var title = [
        "序号",
        "姓名",
        "投保类型",
        "联系方式",
        "身份证号码",
        "地址",
        "车辆厂牌",
        "车辆型号",
        "车牌号",
        "车架号VIN码",
        "发动机号",
        "防盗系统型号",
        "产品序列号",
        "安装日期",
        "安装地点",
        "安装城市",
        "生效日期",
        "截止日期",
        "保单号",
        "车辆购置价/赔偿限额",
        "保费",
        "受益人",
        "型号",
        "客户姓名",
        "备注"
      ];
      var list = [];
      for (let i = 0; i < origin_data.length; i++) {
        var item = origin_data[i];
        list.push([
          i + 1,
          item.drivLicName,
          this.getInsuranceType(item),
          item.custPhone,
          item.drivLicIdNum,
          item.custAddr,
          item.carBrand,
          item.carType,
          item.carPlateNum,
          item.frameId,
          item.engineId,
          "爱车易VPS智能车载终端",
          item.deviceImei,
          item.installTime
            ? new Date(item.installTime).format("yyyy-MM-dd")
            : "",
          item.installAddr,
          item.installAddr,
          item.tFrom ? new Date(item.tFrom).format("yyyy-MM-dd") : "",
          item.tTo ? new Date(item.tTo).format("yyyy-MM-dd") : "",
          item.policyId,
          item.carOrigPrice,
          item.coverage,
          item.custName,
          "爱车易VPS智能车载终端",
          item.drivLicName,
          "815152020110106000008"
        ]);
      }
      ExportUtil.exportTable(title, list);
    },
    searchUser() {
      //搜索用户
      this.app.$emit("close-user-box");
      this.isUserBox = true;
    },
    loadInsurance() {
      //根据条件加载保单表格
      this.selectList = [];
      var data = {};
      data.page = this.page.current;
      data.pageSize = this.page.limit;
      if (this.userId) {
        data.userId = this.userId;
      }
      if (this.custName) {
        data.custName = this.custName;
      }
      if (this.frameId) {
        data.frameId = this.frameId;
      }
      if (this.policyId) {
        data.policyId = this.policyId;
      }
      if (this.drivLicName) {
        data.drivLicName = this.drivLicName;
      }
      if (this.drivLicIdNum) {
        data.drivLicIdNum = this.drivLicIdNum;
      }
      if (this.installFrom && this.installTo) {
        data.tInstallFrom = new Date(this.installFrom).getTime();
        data.tInstallTo = new Date(this.installTo).getTime();
      }
      loadInsuranceList(data).then(res => {
        if (res.errCode == "200") {
          this.page.num = res.data.pageCount;
          this.selectList = [];
          this.insuranceList = res.data.items;
          this.page.total = res.data.itemsCount;
        }
      });
    },

    /**
     * 处理表格操作
     * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
     */
    dealTableOp(index, item, name) {
      console.log(index, item, name);
      if (name == "insuranceDevice") {
        //设备详情对话框
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: item.deviceImei
        });
      } else if (name == "insuranceDetail") {
        //保单详情
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: item.deviceImei,
          tab: "insurance"
        });
      } else if (name == "insurancePrint") {
        //打印保单
        this.exprPolicy(item.deviceImei, item.policyType);
      } else if (name == "insuranceChange") {
        //保单修改历史
        this.app.$emit("show-insu-record-dialog", {
          name: "InsuRecordDialog",
          imei: item.deviceImei,
          policyId: item.policyId
        });
      }
    },
    exprPolicy(deviceImei, policyType) {
      //导出保单文件word
      let form = $(`<form action="${this.API.exportPolicyFile}">
      <input type="hidden" name="deviceImei" value="${deviceImei}">
      <input type="hidden" name="policyType" value="${policyType}"></form>`);
      form
        .appendTo("body")
        .submit()
        .remove();
    },
    dealUserItem(op) {
      //用户框中选中用户
      this.userId = op.userId;
      this.userName = op.userName;
    },
    listenEvent() {
      this.app.$on("data-table-select", this.dealTableSelect);
    },
    offEvent() {
      this.app.$off("data-table-select", this.dealTableSelect);
    }
  },
  mounted() {
    this.listenEvent();
    this.loadInsurance();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
