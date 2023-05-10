import { checkDevicePwd, sendDeviceCmd, getDeviceDetail } from "@/api/common.js";
import { updateDevice } from "@/api/monitor.js";
export default {
  name: "DeviceCommand",
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isOnline: false, //是否在线
    signalTime: "", //信号时间
    isSet: false, //是否设置命令
    currentCmd: {}, //当前设置命令
    intervalTime: 10, //心跳包等命令间隔时间
    workModeList: [
      //工作模式时间点设置
      {
        hour: 0,
        minute: 0,
        enable: false,
      },
      {
        hour: 0,
        minute: 0,
        enable: false,
      },
      {
        hour: 0,
        minute: 0,
        enable: false,
      },
      {
        hour: 0,
        minute: 0,
        enable: false,
      },
      {
        hour: 0,
        minute: 0,
        enable: false,
      },
    ],
    cmdList: [], //操作命令
    logList: [], //返回日志信息
    currentLoca: 0, //设备定位方式
    imei: "", //设备号
    sendable: true, //命令是否可发送
    circleUp: {
      //上传周期设置
      hour: 0,
      minute: 5,
    }, //部分指令验证密码
    cmdPwd: "", //自定义指令
    customCmd: "",
    realtimeMode: 10,
    daytime: 1,
    isDevicePwd: false, //判断设备的密码
    onlineTimeMode: 1, //在线定时上报
    postForm: {
      ParameterDataList: [""],
    },
    activeName: "first",
    isbtnSOS: false,
    staticTime: 30,
  }),
  computed: {
    workModeList1() {
      var list = JSON.parse(JSON.stringify(this.workModeList));
      return list.slice(0, 3);
    },
  },
  watch: {
    "circleUp.minute"() {
      if (this.circleUp.minute > 60) {
        this.circleUp.hour = Math.floor(this.circleUp.minute / 60);
        this.circleUp.minute = this.circleUp.minute % 60;
      }
    },
    "circleUp.hour"() {
      if (this.circleUp.hour * 60 + this.circleUp.minute > 360) {
        this.circleUp.hour = 6;
        this.circleUp.minute = 0;
      }
    },
    workModeList: {
      deep: true,
      handler() {
        for (var i = 0; i < this.workModeList.length; i++) {
          if (this.workModeList[i].minute > 60) {
            this.workModeList[i].hour = Math.floor(this.workModeList[i].minute / 60);
            this.workModeList[i].minute = this.workModeList[i].minute % 60;
          }
          if (this.workModeList[i].hour * 60 + this.workModeList[i].minute > 60 * 24) {
            this.workModeList[i].hour = 23;
            this.workModeList[i].minute = 59;
          }
        }
      },
    },
  },
  methods: {
    changeTabs(idx) {
      // console.log(idx);
      this.postForm.ParameterDataList = [""];
      this.isbtnSOS = false;
    },
    addItem() {
      this.isbtnSOS = false;
      this.postForm.ParameterDataList.push("");
      if (this.postForm.ParameterDataList.length > 2) {
        this.isbtnSOS = true;
      } else {
        this.isbtnSOS = false;
      }
    },
    deleteItem(item, index) {
      this.postForm.ParameterDataList.splice(index, 1);
      this.isbtnSOS = false;
    },
    checkDevPwd() {
      // console.log("1");
      // 检查设备的密码是否正确 改成同步请求
      const data = {
        deviceImei: this.imei,
        password: this.cmdPwd,
      };
      return checkDevicePwd(data);
    },
    doCommand() {
      console.log(this.workModeList1);
      //获取要执行指令
      if (!this.sendable) {
        return;
      }
      var cmd = "";
      switch (this.currentCmd.panelId) {
        case "position-type": //位置类型
          cmd = "POITYPE," + this.currentLoca;
          break;
        case "find-car-by-time": //	定点查车
          var t = [];
          for (let i = 0; i < this.workModeList.length; i++) {
            if (this.workModeList[i].enable) {
              var h = this.workModeList[i].hour,
                m = this.workModeList[i].minute;
              t.push((h <= 9 ? "0" + h : "" + h) + (m <= 9 ? "0" + m : "" + m));
            }
          }
          if (t.length > 0) {
            cmd = "MODE,1," + t.join(",");
          } else {
            cmd = "MODE,1";
          }
          break;
        case "find-car-by-period": //跟踪查车
          // 更新2021-1-26 间隔时间的设置
          if (this.intervalTime < 10) {
            this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip1"));
            this.intervalTime = 10;
            return;
          }
          if (this.intervalTime > 999) {
            this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip2"));
            this.intervalTime = 999;
            return;
          }
          cmd = "MODE,2," + this.intervalTime;
          break;
        case "exit": //退出跟踪查车
          cmd = "QUIT";
          break;
        case "circle-update": //省电定时上报
          {
            let h = this.circleUp.hour;
            let m = this.circleUp.minute;
            if (m < 5 && h === 0) m = 5;
            if (m > 59) m = 59;
            if (h >= 24) {
              h = 24;
              m = 0;
            }
            cmd = "MODE,3," + (h * 60 + m) + "M";
          }
          break;
        // 新增指令2021-5-13
        case "play-report": //省电运动上报
          // mode23是以时间点的形式传过去
          if (this.staticTime < 30 || this.staticTime > 1439) {
            this.app.$emit("show-alert-msg", "Out of the range");
            return;
          }
          cmd = "MODE,23," + this.staticTime;
          break;
        case "realtime-mode": //在线运动上报
          {
            if (this.realtimeMode < 10) {
              this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip1"));
              this.realtimeMode = 10;
              return;
            }
            if (this.realtimeMode > 999) {
              this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip2"));
              this.realtimeMode = 999;
              return;
            }
            cmd = "MODE,2," + this.realtimeMode;
          }
          break;
        case "timing-mode": //省电闹铃上报
          var t1 = [];
          for (let i = 0; i < this.workModeList.length; i++) {
            if (this.workModeList[i].enable) {
              var h1 = this.workModeList[i].hour,
                m1 = this.workModeList[i].minute,
                d = this.daytime;
              t1.push((h1 <= 9 ? "0" + h1 : "" + h1) + (m1 <= 9 ? "0" + m1 : "" + m1));
            }
          }
          if (t1.length > 0) {
            cmd = "MODE,1," + t1.join(",") + "," + d;
          } else {
            cmd = "MODE,1";
          }
          break;
        case "timing-online": //在线定时上报 2021-12-23
          {
            if (this.onlineTimeMode < 1) {
              this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip1"));
              this.onlineTimeMode = 1;
              return;
            }
            if (this.onlineTimeMode > 999) {
              this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip2"));
              this.onlineTimeMode = 999;
              return;
            }
            cmd = "MODE,2,0," + this.onlineTimeMode;
          }
          break;
        case "circle-update1": //省电定时上报
          {
            let h = this.circleUp.hour;
            let m = this.circleUp.minute;
            if (m < 5 && h === 0) m = 5;
            if (m > 59) m = 59;
            if (h >= 24) {
              h = 24;
              m = 0;
            }
            cmd = "MODE,3," + (h * 60 + m) + "M";
          }
          break;
        // 新增 end
        case "hb": //心跳包指令
          if (this.intervalTime < 10) {
            this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip1"));
            this.intervalTime = 10;
            return;
          }
          if (this.intervalTime > 999) {
            this.app.$emit("show-alert-msg", this.$t("deviceCommand.intervarTimeTip2"));
            this.intervalTime = 999;
            return;
          }
          cmd = "HBT," + this.intervalTime;
          break;
        case "default": //普通指令
          cmd = this.currentCmd.cmdContent;
          break;
        case "defaultpw": //需要密码验证的指令
          cmd = this.currentCmd.cmdContent;
          break;
        case "manual": //自定义指令
          cmd = this.customCmd;
          break;
        case "sos-send": {
          //SOS上报
          let numarr = this.postForm.ParameterDataList.join(",");
          if (this.activeName == "first") {
            if (!numarr) {
              this.app.$emit("show-alert-msg", this.$t("deviceCommand.deviceCommandTip"));
              return;
            }
            cmd = "SOS,A," + numarr;
          } else if (this.activeName == "second") {
            cmd = "SOS,D," + numarr;
          }
        }
      }
      // console.log(cmd);
      if (cmd) {
        this.sendCommand(cmd);
      } else {
        this.app.$emit("show-alert-msg", this.$t("deviceCommand.deviceCommandTip"));
      }
    },
    async sendCommand(cmd) {
      //发送指令
      var that = this;
      var data = {
        deviceImei: this.imei,
        cmdContent: cmd,
      };
      if (this.currentCmd.panelId == "defaultpw") {
        if (!this.cmdPwd) {
          this.app.$emit("show-alert-msg", this.$t("deviceCommand.confirmDevicePwd"));
          return;
        }
        let flag = await this.checkDevPwd();
          if (flag.errCode == 200) {
            this.isDevicePwd = true;
          } else {
            this.isDevicePwd = false;
          }
        if (this.isDevicePwd) {
          data.password = this.cmdPwd;
        } else {
          this.app.$emit("show-alert-msg", this.$t("deviceCommand.isDevicePwd"));
          return;
        }
      } else if (this.currentCmd.panelId == "manual") {
        data.isOfflineCmd = false;
      }
      that.logList.unshift({
        isSend: true,
        cmdContent: data.cmdContent,
        utcTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
      });
      that.sendable = false;
      sendDeviceCmd(data).then(res=> {
        that.sendable = true;
        if (res.errCode == "200") {
          that.logList.unshift({
            isSend: false,
            cmdContent: res.data,
            utcTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
          });
        } else {
          that.logList.unshift({
            isSend: false,
            cmdContent: "Fail:" + that.$t("deviceCommand.errTip"),
            utcTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
          });
        }
      })
      
    },
    changeCurrentCommand(op) {
      //改变当前指令设置界面
      this.currentCmd = op;
      this.isSet = true;
    },
    dealDevDialog(imei) {
      //处理设备详情对话框操作
      var that = this;
      this.imei = imei;
      if (this.imei) {
        that.initCmdType();
        updateDevice({ deviceImei: this.imei}).then(res=> {
          if (res.errCode == "200") {
            let data = res.data;
            that.isOnline = data.info.stsNum == 1 || data.info.stsNum == 2;
            that.signalTime = new Date(data.info.signalTime).format("yyyy-MM-dd hh:mm:ss");
          }
        })
      }
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDialog);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDialog);
    },
    in_array(stringToSearch, arrayToSearch) {
      // 判断某个字符串是否存在数组中
      for (var s = 0; s < arrayToSearch.length; s++) {
        var thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
          return true;
        }
      }
      return false;
    },
    initCmdType() {
      //初始化设备指令类型
      getDeviceDetail({ deviceImei: this.imei}).then(res=> {
        if (res.errCode == "200") {
          var data = res.data;
          //该设备是否支持离线指令
          var commandList = JSON.parse(JSON.stringify(this.$t("deviceCommand.cmdList")));
          const lxcommand = JSON.parse(JSON.stringify(this.$t("LXdeivce"))); //以前的离线指令
          const lxcommand1 = JSON.parse(JSON.stringify(this.$t("LXdeivce1")));
          const lxcommand2 = JSON.parse(JSON.stringify(this.$t("LXdeivce2")));
          let lxcommand6 = JSON.parse(JSON.stringify(this.$t("LXdeivce4"))); //普通设备指令

          // const commandCtrl = ["ZT19W", "E09W", "DM09W", "ZT09W", "E19W", "DM19W", "A7W", "K8", "ZT02W", "_ZT19W", "_E09W", "_DM09W", "_ZT09W", "_E19W", "_DM19W", "_A7W", "_K8", "_ZT02W"];
          const commandCtrl = [/ZT19W/, /E09W/, /DM09W/, /ZT09W/, /E19W/, /DM19W/, /A7W/, /K8/, /ZT02W/];
          var tag = false;
          for (var i = 0; i < commandCtrl.length; i++) {
            // if (data.model.toUpperCase().indexOf(commandCtrl[i]) != -1) {
            //   tag = true;
            // }
            // 2021-11-18
            let model = new RegExp(data.model);
            // console.log(model);
            if (commandCtrl[i].test(model)) {
              console.log("chufa");
              tag = true;
            }
          }
          // console.log(tag);
          if (tag) {
            if (data.baseType == "0") {
              // 如果是有线
              commandList.unshift(lxcommand2);
            } else {
              commandList.unshift(lxcommand1);
            }
          } else if (data.model == "FN202") {
            // commandList.unshift(lxcommand2);
            commandList.unshift(lxcommand6);
          } else if (data.baseType == "0") {
            // 普通设备的离线指令有线的
            commandList.unshift(lxcommand2);
          } else if (data.baseType == "1") {
            // 普通设备的离线指令无线的
            commandList.unshift(lxcommand1);
          }
          this.cmdList = commandList;
        }
      })
    },
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  },
};
