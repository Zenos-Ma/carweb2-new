import DeviceRelation from "@/pages/DeviceDialog/DeviceRelation.vue";
import DeviceDetail from "@/pages/DeviceDialog/DeviceDetail.vue";
import DeviceTrack from "@/pages/DeviceDialog/DeviceTrack.vue";
import DeviceTransfer from "@/components/BatchTransfer/BatchTransfer.vue";
import DeviceCommand from "@/pages/DeviceDialog/DeviceCommand.vue";
import DeviceRecord from "@/pages/DeviceDialog/DeviceRecord.vue";
import DeviceInsurance from "@/pages/DeviceDialog/DeviceInsurance.vue";
import DeviceBox from "@/components/DeviceBox";
import CardTab from "@/pages/DeviceDialog/CardTab.vue";
import DeviceAlarmSetting from "@/pages/DeviceDialog/DeviceAlarmSetting.vue";
import PhoneNotifyAlertSetting from "@/pages/DeviceDialog/PhoneNotifyAlertSetting.vue";
import { isKangqi } from "@/api/common.js"
export default {
  name: "DeviceDialog",
  components: {
    "device-box": DeviceBox,
    "device-detail": DeviceDetail, //设备详情
    "device-relation": DeviceRelation, //客户关系
    "device-track": DeviceTrack, //跟踪
    "device-transfer": DeviceTransfer, //转移
    "device-command": DeviceCommand, //指令
    "device-record": DeviceRecord, //指令记录
    "device-insurance": DeviceInsurance, //保单
    "card-tab": CardTab,
    "device-alarm": DeviceAlarmSetting,
    "device-phone": PhoneNotifyAlertSetting,
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isShow: false,
    dialogTabs: [], //当前设备详情tab
    currentTab: 1, //当前设备详情tab 内容
    currentPart: "device-detail", //当前设备imei
    imei: "", //搜索设备关键词
    searchKey: "", //搜索设备类型
    searchType: "device", //搜索设备类型提示
    isDeviceBox: false,
    isKangqi: false,
    langType: window.localStorage.getItem("langType"),
    dWidth: 790,
    dHeight: 600,
  }),
  watch: {
    searchKey() {
      if (!this.searchKey) {
        this.isDeviceBox = false;
      }
    }, //更改设备搜索类型
    searchType() {
      this.isDeviceBox = false;
    },
  },
  methods: {
    jumpIdentity() {
      window.open("https://plat.basegps.com/ocrImg.html");
    }, //搜索设备
    searchDevice() {
      if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
        this.isDeviceBox = true;
      } else {
        this.isDeviceBox = false;
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
      }
    }, //清空设备搜索关键词
    clearSearch() {
      this.searchKey = "";
      this.isDeviceBox = false;
    }, //改变tab
    changeDialogTab(idx, name) {
      if (name) {
        for (var i = 0; i < this.dialogTabs.length; i++) {
          if (this.dialogTabs[i].name == name) {
            this.currentTab = i;
            this.currentPart = this.dialogTabs[i].name;
          }
        }
      } else {
        this.currentTab = idx;
        this.currentPart = this.dialogTabs[idx].name;
      }
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("device-dialog", that.imei, "DeviceDialog");
      });
    }, //关闭对话框
    closeDialog() {
      this.isShow = false;
    }, //显示对话框
    showDialog(op, name) {
      // console.log(op);
      // 打开设备详情再执行判断
      this.getRelation(); //2021-8-19
      this.isShow = true;
      this.imei = op.imei;
      this.searchKey = op.imei;
      this.searchType = "device";
      this.initDevTab(name);

      if (op.tab == "insurance") {
        this.changeDialogTab(6, "device-insurance");
      } else if (op.tab == "device") {
        this.changeDialogTab(1, "device-detail");
      } else {
        this.changeDialogTab(1);
      }
    }, //处理选中搜索对话框box
    dealDevItem(op) {
      console.log(op);
      this.showDialog({
        imei: op.deviceImei,
      });
    },
    listenEvent() {
      this.app.$on("chang-lang-type", this.initDevTab);
      this.app.$on("close-dialog", this.closeDialog);
      this.app.$on("close-device-dialog", this.closeDialog);
      this.app.$on("show-device-dialog", this.showDialog);
      this.app.$on("show-device-dialog1", this.showDialog);
    },
    offEvent() {
      this.app.$off("chang-lang-type", this.initDevTab);
      // this.app.$off("close-dialog", this.closeDialog);
      this.app.$off("close-device-dialog", this.closeDialog);
      this.app.$off("show-device-dialog", this.showDialog);
      this.app.$off("show-device-dialog1", this.showDialog);
    }, //初始化设备详情tab
    initDevTab() {
      // var tabs = JSON.parse(JSON.stringify(this.$t("deviceDialog.dialogTabs")));

      this.langType = window.localStorage.getItem("langType");
      var tabs = JSON.parse(JSON.stringify(this.$t("deviceDialog.dialogTabs")));
      // console.log("切掉的", tabs);
      if (!this.rootUser.isRefillCard && !this.rootUser.isRechargCard) {
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].name == "card-tab") {
            tabs.splice(i, 1);
            break;
          }
        }
      }
      if (this.rootUser.userTypeV2 != 2) {
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].name == "device-insurance") {
            tabs.splice(i, 1);
            break;
          }
        }
      }
      if (!this.rootUser.hasPolicy) {
        // 如果是外海的话可以直接删除保单这一栏
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].name == "device-insurance") {
            tabs.splice(i, 1);
            break;
          }
        }
      }

      this.dialogTabs = tabs;
    },
    getRelation() {
      var that = this;
      if (this.rootUser.userId == 1 || this.rootUser.userId == 238 || this.rootUser.userId == 15530 || this.rootUser.userId == 14337) {
        that.isKangqi = true;
      } else {
        // 换成新的接口判断是否是康骑的
        isKangqi().then(res=> {
          if (res.errCode == 200) {
            if (res.data.typeId == 2) {
              this.isKangqi = true;
            } else {
              this.isKangqi = false;
            }
          }
        })
      }
    },
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  },
};
