<template>
  <div :class="['warn-list', isShow ? '' : 'hide']" id="warn_list">
    <!--报警信息右下角 start-->
    <div class="warn-list-bar">
      <span class="bar-title" @click="isShow = isShow ? false : true">
        <i class="iconfont icon-baojingshezhi"></i>
        {{ $t("warnList.alarmInfo") }}
      </span>
      <span class="iconfont icon-chart" style="color: white; padding-left: 5px" v-if="isShow" @click="showChartPage"></span>
      <span class="bar-checkbox">
        [
        <el-checkbox v-model="musicAlert" style="color: #fff">{{ $t("warnList.alarmSound") }}</el-checkbox>
        ]
      </span>
      <!-- <span class="bar-checkbox">[<input type="checkbox" class="text-input" v-model="isChild"><label>{{$t('warnList.alarmChild')}}</label>]</span> -->
      <span style="flex: 1; display: inline-block" @click="showAlarmPage"></span>
      <span :class="['bar-triangle', 'iconfont', isShow ? 'icon-icon-down1' : 'icon-icon-up1']" @click="showAlarmPage"></span>
      <audio loop id="audioControl" hidden></audio>
    </div>
    <!--报警信息右下角 end-->

    <div class="warn-list-table">
      <!--报警信息表格title start-->
      <table>
        <thead>
          <tr>
            <th style="width: 120px">{{ $t("common.deviceImei") }}</th>
            <th style="width: 120px">{{ $t("alarm.alarmTime") }}</th>
            <th style="width: 100px">{{ $t("alarm.alarmType") }}</th>
            <th style="flex: 1">{{ $t("common.address") }}</th>
            <th style="width: 140px">{{ $t("common.operation") }}</th>
            <th></th>
          </tr>
        </thead>
      </table>
      <!--报警信息表格title end-->

      <div class="table-content">
        <!--报警信息表格内容 start-->
        <table v-if="warnTable.length > 0 && !isLoad">
          <tbody>
            <tr v-for="(item, idx) in warnTable" @click="selectWarnItem(idx)" :class="[selectItem == idx ? 'active' : '']" :key="'warnTable' + idx">
              <td style="width: 120px">
                <a @click="dealTableOp({ item, idx, name: 'subDevDetail' })">{{ item.deviceImei }}</a>
              </td>
              <td style="width: 120px">{{ item.createTime | fdatetime }}</td>
              <td style="width: 100px">{{ item.num ? changOrderName(item.num): item.title }}</td>
              <td style="flex: 1">
                <a @click="showAddress(idx, item)" v-if="!item.location">{{ $t("warnList.viewAddress") }}</a>
                <span v-if="item.location">{{ item.location }}</span>
              </td>
              <td style="width: 140px">
                <a @click="onMonitor(item, idx)" style="margin-left: 5px">{{ $t("common.monitor") }}</a>
                <a @click="readMsg(item.msgId, idx)">{{ $t(item.sts == "0" ? "accountMsg.unread" : "accountMsg.read") }}</a>
              </td>
            </tr>
          </tbody>
        </table>
        <!--报警信息表格内容 end-->
        <!--报警信息表格提示 start-->
        <div v-if="warnTable.length == 0 && !isLoad" class="no-data">{{ $t("warnList.noAlarm") }}</div>
        <div v-if="isLoad" class="no-data">{{ $t("common.loading") }}</div>
        <!--报警信息表格提示 end-->
      </div>
    </div>

    <!--  -->
  </div>
</template>

<script>
  import { changeAlertAudio, readMsgList } from "@/api/common.js";
  export default {
    name: "WarnList",
    props: {},
    data: () => ({
      rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
      musicAlert: false, //是否开启报警音效
      isLoad: false, //是否正在加载
      isAlert: false, //是否报警
      musicAlert1: false,
      isShow: false, //是否展开报警表格
      selectItem: -1, //选中表格项
      warnTable: [], //报警表格数据
      originTable: [], //初始的报警表格数据
      refreshInterval: null, //刷新interval
      isChild: false,
      isYiyunzaixian: false,
      isTypeAlarm: false, //显示报警类型筛选
      exportColumns: [], //选中的项
      arrList: [],
      isWatchList: false,
      originWarnTable: [], //原始的数据
      instruction: [
        { text: "重启设备", num: 100 },
        { text: "基本参数", num: 101 },
        { text: "实时状态", num: 102 },
        { text: "软件版本", num: 103 },
        { text: "实时定位", num: 104 },
        { text: "恢复出厂设置", num: 200 },
        { text: "修改服务器", num: 201 },
        { text: "修改时区", num: 202 },
        { text: "升级软件版本", num: 203 },
        { text: "修改心跳间隔", num: 204 },
        { text: "修改时间间隔", num: 205 },
        { text: "设置感光开关", num: 206 },
        { text: "添加防区", num: 207 },
        { text: "撤除防区", num: 208 },
        { text: "设置定位方式", num: 209 },
        { text: "设置工作模式", num: 210 },
        { text: "运动上报模式", num: 2123 },
        { text: "在线运动上报", num: 2102 },
        { text: "省电定时上报", num: 2103 },
        { text: "省电闹铃上报", num: 2104 },
        { text: "自动休眠", num: 211 },
        { text: "设置协议", num: 212 },
        { text: "断开/恢复油电", num: 213 },
        { text: "设置紧急联系号码", num: 214 },
        { text: "录音", num: 310 },
        { text: "绑定蓝牙设备", num: 311 },
        { text: "移除蓝牙设备", num: 312 },
        // 新增
        { text: "开启LED灯", num: 314 },
        { text: "设置APN", num: 315 },
        { text: "开启蓝牙功能", num: 316 },
        { text: "关闭蓝牙功能", num: 317 },
        { text: "设置低电报警阈值", num: 318 },
        { text: "保持GPS开启", num: 319 },
        { text: "设置GPS自动控制", num: 320 },
        { text: "蓝牙连接失败次数", num: 321 },
        { text: "设置间隔步数定位", num: 322 },
        { text: "开启麦克风", num: 323 },
        { text: "关闭麦克风", num: 324 },
        { text: "设置自动保护电压", num: 325 },
        { text: "围栏范围", num: 326 },
        { text: "线检测ACC状态", num: 327 },
        { text: "线加电压检测ACC状态", num: 328 },
        { text: "线加传感器检测ACC状态", num: 329 },
        { text: "作为断电检测", num: 330 },
        { text: "ACC线作为ACC检测", num: 331 },
        { text: "关闭SOS", num: 332 },
        { text: "开启SOS平台报警", num: 333 },
        { text: "开启平台短信报警", num: 334 },
        { text: "开启平台短信电话报警", num: 335 },
        { text: "设置中心号码", num: 336 },
        { text: "设置断油电速度", num: 337 },
        { text: "掉外电时断油电", num: 338 },
        { text: "掉外电时按油电速度断油电", num: 339 },
        { text: "设置acc开启电压临界值", num: 340 },
        { text: "开启循环录音", num: 341 },
        { text: "关闭循环录音", num: 342 },
        { text: "读取蓝牙开关参数", num: 343 },
        { text: "设置蓝牙开关参数", num: 344 },
        { text: "添加蓝牙终端绑定", num: 345 },
        { text: "设置蓝牙根密钥", num: 346 },
        { text: "锁定车辆", num: 347 },
        { text: "解锁车辆", num: 348 },
        { text: "开启后备箱", num: 349 },
        { text: "启动", num: 350 },
        { text: "熄火", num: 351 },
        { text: "升窗", num: 352 },
        { text: "降窗", num: 353 },
        { text: "寻车", num: 354 },
        { text: "开启GPS", num: 355 },
        { text: "关闭GPS", num: 356 },
        { text: "断开油电", num: 357 },
        { text: "恢复油电", num: 358 },
        { text: "预屏蔽预警", num: 359 },
        { text: "感光", num: 360 },
        { text: "蓝牙连接异常", num: 361 },
        { text: "断电报警", num: 362 },
        { text: "离线报警", num: 363}
      ],
    }),
    watch: {
      musicAlert() {
        this.changeAlert();
      },
      warnTable: {
        handler(newV, oldV) {
          if (this.isYiyunzaixian) {
            // console.log("21");
            if (this.warnTable.length > 0) {
              this.musicAlert = true;
              this.isAlert = true;
              this.exportColumns.find((value) => {
                if (value == 16 || value == 19) {
                  // console.log(value);
                  this.musicAlert = false;
                  this.isAlert = false;
                }
              });
            } else {
              this.musicAlert = false;
              this.isAlert = false;
            }
          }
          var warnLing = JSON.parse(JSON.stringify(this.warnTable));
          // console.log(warnLing);
          if (warnLing.length <= 0) {
            this.musicAlert = false;
            this.isAlert = false;
          }
        },
        deep: true,
        immediate: true,
      },
      arrList() {
        this.getWarningList();
      },
    },
    methods: {
      getOrderNumber(name) {
        // 给指令类型加上数字
        var list = this.instruction;
        var str = ""
        for(let i = 0; i < list.length; i ++) {
          if(name == list[i].text) {
            return str + list[i].num
          }
        }
        return ""
      },
      changOrderName(num) {
        // 指令类型匹配到国际化文字
        var list = this.$t('deviceRecord.instruction')
        var str = ""
        for(let i = 0; i < list.length; i++) {
          if(num == list[i].num) {
            return str + list[i].text;
          }
        }
        return ""
      },
      showAlarmPage() {
        this.isShow = !this.isShow;
        if (this.isShow) {
          // this.getMsgs();
        }
      },

      getArrSameValue(arr1, arr2) {
        // 筛选两个数组中相同项取相同项的全部数据
        var result = [];
        for (var i = 0; i < arr2.length; i++) {
          var obj = arr2[i];
          var title = obj.title;
          var isExist = false;
          for (var j = 0; j < arr1.length; j++) {
            var value1 = arr1[j];
            if (value1 == title) {
              isExist = true;
              break;
            }
          }
          if (isExist) {
            result.push(obj);
          }
        }
        return result;
      },
      getSelectAlarmList() {
        // console.log("hhhh");
        // 通过筛选出来的报警类型集合
        var list = this.exportTitle;
        var arr = [];
        for (let i = 0; i < this.exportColumns.length; i++) {
          for (let j = 0; j < list.length; j++) {
            if (this.exportColumns[i] == list[j].code) {
              arr.push(list[j].name);
            }
          }
        }
        return arr;
      },
      // 2021-4-8易云在线需要跟谷米的需求
      dealTableOp(op) {
        console.log(op);
        // var item = op.item;
        if (op.name == "subDevDetail") {
          // 弹出设备详情的窗口
          this.app.$emit("show-device-dialog", {
            name: "DeviceDialog",
            imei: op.item.deviceImei,
            tab: "device",
          });
        }
      },
      onMonitor(item) {
        var that = this;
        window.location.hash = "#/monitor/location?deviceImei=" + item.deviceImei;
        setTimeout(function () {
          that.app.$emit("monitor-change-device", item);
        }, 1000);
      }, //跳转到图表界面
      showChartPage() {
        window.open(window.location.origin + window.location.pathname + "#/alarm-chart");
      },
      doVoice() {
        //开启音效
        var audio = document.getElementById("audioControl");
        const musicUrl = require("@/assets/media/alert.mp3");
        audio.src = musicUrl;
        if (this.isAlert && audio.paused) {
          audio.play();
        } else if (!this.isAlert && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
        window.localStorage.setItem("isAlert", this.isAlert ? 1 : 0);
      },
      changeAlert() {
        //保存改变音效
        const data = {
          page: 1,
          pageSize: 40, //默认只显示头20条
          nrOnly: true, //是否只是未读报警信息
          hasVoice: this.musicAlert ? 1 : 0,
          containChild: this.rootUser.userId == "16327" ? true : this.isChild,
          // containChild: true,
        };
        changeAlertAudio(data).then((res) => {
          if (res.errCode == "200") {
            this.isAlert = res.data.hasVoice == 1 ? true : false;
            this.doVoice();
          }
        });
      },

      checkMsg(msgs) {
        //该报警信息是否已存在表格数据中
        var that = this;

        if (msgs.length == that.originTable.length) {
          var list = [];
          for (var i = 0; i < msgs.length; i++) {
            list.push(msgs[i].msgId + "");
          }
          var count = 0;
          for (let i = 0; i < that.originTable.length; i++) {
            var item = that.originTable[i];
            if (item in list) {
              count++;
            }
          }
          if (count == that.originTable.length - 1) {
            that.originTable = list;
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      getLocaByMsgId(msgId) {
        //获取已有报警数据的地址信息
        var tag = true,
          that = this;
        for (var i = 0; i < that.warnTable.length; i++) {
          var item = that.warnTable[i];
          if (msgId == item.msgId && item.location) {
            return item.location;
          }
        }
        if (tag) {
          return "";
        }
      },
      getMsgs() {
        //获取报警信息
        const data = {
          page: 1,
          pageSize: 40, //默认只显示头20条
          nrOnly: true,
          hasVoice: -1,
          containChild: this.rootUser.userId == "16327" ? true : this.isChild,
          // containChild: true,
        };
        changeAlertAudio(data).then((res) => {
          if (res.errCode == "200") {
            this.musicAlert = res.data.hasVoice == 1 ? true : false;
            if (res.data.msgs) {
              this.app.$emit("warn-list-num", res.data.pageCount, res.data.rechargeNum);
              if (this.checkMsg(res.data.msgs)) {
                for (var i = 0; i < res.data.msgs.length; i++) {
                  res.data.msgs[i].location = this.getLocaByMsgId(res.data.msgs[i].msgId);
                  res.data.msgs[i].num = this.getOrderNumber(res.data.msgs[i].title)
                }
                this.warnTable = res.data.msgs;
                this.originWarnTable = JSON.stringify(this.warnTable);
              }
            } else {
              this.warnTable = [];
            }
          }
        });
      }, //
      //显示报警地址
      showAddress(idx, item) {
        var lat, lng;
        if (window.localStorage.getItem("langType") == "zh") {
          lng = item.baiduLon;
          lat = item.baiduLat;
        } else {
          lng = item.lon;
          lat = item.lat;
        }
        if (lng && lat && lat != 0 && lng > -180 && lng <= 180 && lat <= 90 && lat >= -90) {
          this.getPoiLocation(lng, lat, (address) => {
            this.warnTable[idx].location = address ? address : this.$t("common.addressFail");
          });
        }
      }, //选中报警表格项
      selectWarnItem(idx) {
        var device = this.warnTable[idx];
        this.highlight = idx;
        this.selectItem = idx;
        this.app.$emit("select-warn", device);
        // console.log("12314");
      }, //已读报警信息
      readMsg(msgId, idx) {
        readMsgList({ msgId: msgId }).then((res) => {
          if (res.errCode == "200") {
            this.warnTable.splice(idx, 1); //移除已读
          }
        });
      },
    },
    mounted() {
      // 2021-3-31 易云在线的报警信息要有就一直响
      var www = window.location.origin;
      // console.log(www);
      if (/yiyunzaixian\.com/.test(www)) {
        // console.log(123);
        this.isYiyunzaixian = true;
      }
      //
      this.musicAlert = window.localStorage.getItem("isAlert") == 1 ? true : false;
      var that = this;
      // if (document.getElementById("warn_list"))
      if (document.getElementById("warn_list")) {
        that.$nextTick(() => {
          that.getMsgs();
        });
        this.refreshInterval = setInterval(function () {
          that.getMsgs();
        }, 60 * 1000);
      } else {
        if (this.refreshInterval) this.refreshInterval = clearInterval(this.refreshInterval);
      }
    },
    updated() {
      if (this.warnTable.length <= 0) {
        this.musicAlert = false;
        this.isAlert = false;
      }
    },
    beforeDestroy() {
      if (this.refreshInterval) this.refreshInterval = clearInterval(this.refreshInterval);
    },
  };
</script>

<style lang="scss">
  #warn_list {
    .bar-checkbox {
      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #2a76d0;
        border-color: #fff;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff;
      }
      .el-checkbox__label {
        font-size: 12px;
      }
    }
  }
</style>
