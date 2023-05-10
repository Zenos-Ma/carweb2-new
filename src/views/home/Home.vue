<template>
  <section class="body-content home-page layout-container">
    <div class="home-top">
      <div class="more-user">
        <i
          class="iconfont icon-gengduo"
          @click="showUserBox"
          :title="$t('common.selectUser')"
        ></i>
        <user-box
          bname="home"
          :is-show.sync="isUserBox"
          :search-key="userName"
          @select-result="dealUserItem"
          style="z-index: 9999"
        ></user-box>
        <span>{{ userName }}</span>
        <!-- <i class="iconfont icon-vertical_line"></i> -->
      </div>
      <!-- <div class="search-device"> -->
      <!-- <span><img src="@/views/home/img/search.png" alt="" /></span>
        <el-input :placeholder="$t('common.searchDevTip')" v-model="searchKey" @keyup.enter.native="searchDevice"></el-input> -->
      <!-- </div> -->
    </div>
    <div class="home-page-content">
      <div class="data-header">
        <el-row :gutter="20">
          <el-col
            :lg="{ span: '4-8' }"
            v-for="(item, idx) in accountNum"
            :key="idx"
          >
            <el-card shadow="hover" :style="{ background: item.color }" v-waves>
              <div class="box-card" @click="dealOpTable(idx, item)">
                <div class="card-left">
                  <img
                    :src="require('@/views/home/img/' + item.img + '.png')"
                    alt=""
                  />
                </div>
                <div class="card-right">
                  <div class="state-text">
                    {{ item.text }}
                  </div>
                  <div class="bottom-content">
                    <span class="num-text" v-show="idx == 0">{{
                      deviceStatistics.monitorDeviceTotal
                    }}</span>
                    <span class="num-text" v-show="idx == 1">{{
                      deviceStatistics.onlineTotal
                    }}</span>
                    <span class="num-text" v-show="idx == 2">{{
                      page.total
                    }}</span>
                    <span class="num-text" v-show="idx == 3">{{
                      page1.total
                    }}</span>
                    <!-- <span class="num-text" v-show="idx == 4">{{ outFenceTotal }}</span>  -->

                    <span class="state-text" v-show="idx != 4">{{
                      item.text2
                    }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="main-content">
        <div class="content-left" :style="{ width: widthLeft + '%' }">
          <div class="circle-btn1">
            <span>{{ refreshTime }}</span>
            <span @click="resetTheTime" style="padding-left: 5px">{{
              $t("common.refresh")
            }}</span>
          </div>
          <div class="btn-amap-satellite" v-show="theMap == 'a-map'">
            <el-button
              style="padding: 7px 18px !important"
              @click="isSatellite = isSatellite ? false : true"
            >
              {{ $t(isSatellite ? "playback.normal" : "playback.satellite") }}
            </el-button>
          </div>
          <div class="device-address" v-show="currentAddres">
            {{ currentAddres }}
          </div>
          <!-- <open-street-map :map-name="mapName" @map-zoom="onMapZoom"></open-street-map> -->
          <a-map
            :map-name="mapName"
            @map-zoom="onMapZoom"
            :is-satellite="isSatellite"
          ></a-map>
          <!-- <div class="btn-show-right" @click="showTheRightContent">
            <i class="iconfont icon-gengduo"></i>
          </div> -->
        </div>
        <div class="content-right" :style="{ width: widthRight + '%' }">
          <div class="btn-show-right" @click="showTheRightContent">
            <i
              :class="[
                'iconfont',
                !isShowRight ? 'icon-shouqi' : 'icon-zhankai'
              ]"
            ></i>
          </div>
          <div class="main-content-right" v-show="!isShowRight">
            <div class="alarm-content-message content-message warn-list-table">
              <div class="message-top">
                <img src="@/views/home/img/baojingxinxi.png" alt="" />
                <span v-show="currentMessageTab == 2">{{
                  $t("accountMsg.alarmList")
                }}</span>
                <span v-show="currentMessageTab == 3">{{
                  $t("accountMsg.msgDo")
                }}</span>
              </div>
              <div
                class="table-content"
                v-show="currentMessageTab == 2"
                style="height: calc(100% - 45px)"
              >
                <data-table
                  :data="alarmList"
                  @getTableData="loadALarmList"
                  :page="page"
                  :page-count="page.num"
                  :pageLayout="pageLayout"
                >
                  <!--  -->
                  <el-table-column
                    :label="$t('common.deviceImei')"
                    min-width="120"
                  >
                    <template slot-scope="props">
                      <a
                        @click="
                          dealTableOp(props.row, props.$index, 'alarmDevice')
                        "
                        >{{ props.row.deviceImei }}</a
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('accountMsg.msgTime')"
                    width="135"
                  >
                    <template slot-scope="props">
                      {{ props.row.createTime | fdatetime }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('common.alarmType')"
                    prop="title"
                    width="120"
                  >
                    <template slot-scope="props">
                      {{
                        props.row.num
                          ? changOrderName(props.row.num)
                          : props.row.title
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('common.address')"
                    style="flex: 1"
                  >
                    <template slot-scope="props">
                      <span
                        v-if="props.row.address"
                        @click="props.row.address = ''"
                        >{{ props.row.address }}</span
                      >
                      <a
                        @click="
                          dealTableOp(props.row, props.$index, 'alarmAddress')
                        "
                        v-if="!props.row.address"
                        >{{ props.row.lat | flatlng }},{{
                          props.row.lon | flatlng
                        }}</a
                      >
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common.status')" width="100">
                    <template slot-scope="props">
                      <span v-if="parseInt(props.row.sts) > 0">{{
                        $t("accountMsg.read")
                      }}</span>
                      <a
                        @click="
                          dealTableOp(props.row, props.$index, 'alarmUnread')
                        "
                        v-if="parseInt(props.row.sts) == 0"
                        >{{ $t("accountMsg.unread") }}</a
                      >
                      <a @click="onDealAlarm(props.row, props.$index)">{{
                        $t("accountMsg.deal")
                      }}</a>
                    </template>
                  </el-table-column>
                </data-table>
              </div>
              <div
                class="table-content"
                v-show="currentMessageTab == 3"
                style="height: calc(100% - 45px)"
              >
                <data-table
                  :data="handlerList"
                  @getTableData="loadALarmList1"
                  :page="page1"
                  :page-count="page1.num"
                  :pageLayout="pageLayout"
                >
                  <!--  -->
                  <el-table-column :label="$t('common.deviceImei')">
                    <template slot-scope="props">
                      <a
                        @click="
                          dealTableOp(props.row, props.$index, 'alarmDevice')
                        "
                        >{{ props.row.deviceImei }}</a
                      >
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('accountMsg.handlerTime')">
                    <template slot-scope="props">
                      {{ props.row.createTime | fdatetime }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common.alarmType')">
                    <template slot-scope="props">
                      <!-- {{ props.row.title }} -->
                      {{
                        props.row.num
                          ? changOrderName(props.row.num)
                          : props.row.title
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common.address')">
                    <template slot-scope="props">
                      <span
                        v-if="props.row.address"
                        @click="props.row.address = ''"
                        >{{ props.row.address }}</span
                      >
                      <a
                        @click="
                          dealTableOp(props.row, props.$index, 'handlerAddress')
                        "
                        v-if="!props.row.address"
                        >{{ props.row.lat | flatlng }},{{
                          props.row.lon | flatlng
                        }}</a
                      >
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('accountMsg.handlers')">
                    <template slot-scope="props">
                      {{ props.row.conductor ? props.row.conductor : "--" }}
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('accountMsg.processingRecord')">
                    <template slot-scope="props">
                      {{ props.row.remark ? props.row.remark : "--" }}
                    </template>
                  </el-table-column>
                </data-table>
              </div>
            </div>
            <div class="device-content-massage content-message warn-list-table">
              <device-list
                :user-id.sync="userId"
                :btn-type="currentTab"
                @devlist="onDevList"
                @do-dev-op="dealDevOp"
                @select-dev="onSelectDev"
                :device-imei.sync="deviceImei"
              ></device-list>
            </div>
          </div>
        </div>
      </div>
    </div>
    <info-box1
      map-name="home"
      :device-imei="deviceImei"
      :is-track.sync="isTrack"
    ></info-box1>
    <!-- 报警处理对话框 start-->
    <dialog-comp
      :visible.sync="isDealDialog"
      :dialog-title="$t('accountMsg.dealAlarm')"
      :dialog-width="500"
    >
      <div class="deal-content-box">
        <el-form label-width="120px">
          <el-form-item :label="$t('common.deviceImei')">
            {{ selectAlarmItem.deviceImei }}
          </el-form-item>
          <el-form-item :label="$t('accountMsg.msgTime')">
            {{ selectAlarmItem.createTime | fdatetime }}
          </el-form-item>
          <el-form-item :label="$t('common.alarmType')">
            {{ selectAlarmItem.title }}
          </el-form-item>
          <el-form-item :label="$t('alarm.latitude')">
            {{ selectAlarmItem.lat }}
          </el-form-item>
          <el-form-item :label="$t('alarm.longitude')">
            {{ selectAlarmItem.lon }}
          </el-form-item>
          <el-form-item
            :label="$t('common.address')"
            style="white-space: normal"
          >
            {{ selectAlarmItem.address }}
          </el-form-item>
          <el-form-item :label="$t('accountMsg.dealUser')">
            <el-input v-model="dealUser" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('accountMsg.dealNote')">
            <el-input type="textarea" v-model="dealNote"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSaveAlarmDeal">{{
              $t("common.save")
            }}</el-button>
            <el-button
              type="warning"
              size="small"
              @click="isDealDialog = false"
              >{{ $t("common.cancel") }}</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
    <!-- 报警处理对话框 end-->
  </section>
</template>

<script>
import OpenStreetMapComp from "@/components/map/OpenStreetMapComp";
import AMapComp from "@/components/map/AMapComp";
import { changeAlertAudio, readMsgList } from "@/api/common.js";
import {
  searchDevInfo,
  loadDeviceImeiList,
  updateDevice
} from "@/api/monitor.js";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import mapUtil from "@/utils/mapUtil.js";
import UserBox from "@/components/UserBox";
import { loadDevStatistic, loadAlarmNum } from "@/api/account.js";
import DeviceList from "@/components/deviceList1/DeviceList.vue";
import {
  loadDealAlarmList,
  doSaveAlarmDeal,
  loadMsgList,
  loadAlarmDeviceList,
  doReadAllAlarmList,
  doReadMsg
} from "@/api/account.js";
import LangZh from "@/i18/i18_zh.js";
export default {
  name: "Home",
  components: {
    "open-street-map": OpenStreetMapComp,
    "info-box1": InfoBox1,
    "user-box": UserBox,
    "a-map": AMapComp,
    "device-list": DeviceList
  },
  data: () => ({
    isShowRight: false,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    accountNum: [],
    mapName: "home",
    refreshInterval1: null, //刷新interval
    bigZoom: 14,
    warnTable: [],
    originTable: [], //初始的报警表格数据
    isLoad: false,
    isLoad1: false,
    isChild: false,
    selectItem: -1, //选中表格项
    selectItem1: -1,
    deviceList: [],
    devList: [], //设备列表
    originList: "[]", //设备列表
    isFirst: true, //是否第一次加载,isRefresh: false,mapName: ""
    isRefresh: true,
    currentDev: 0, //当前设备index
    page: {
      //分页器参数
      name: "alarm",
      limit: 10,
      num: 1,
      current: 1,
      total: 0
    },
    page1: {
      //分页器参数
      name: "alarmDo",
      limit: 5,
      num: 1,
      current: 1,
      total: 0
    },
    devKinds: {
      //设备分类统计
      all: 0,
      online: 0,
      offline: 0
    },
    deviceImei: "",
    isTrack: false,
    // theMap: "open-street-map",
    theMap: "a-map",
    refreshInterval: null, //刷新间隔计时器
    refreshTime: 9, //刷新时间
    deviceStatistics: {
      //设备统计
      monitorDeviceTotal: 0,
      onlineTotal: 0
    },
    searchKey: "",
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    isUserBox: false,
    isSatellite: false, //控制高德地图的类型
    alarmTotal: 0,
    sosTotal: 0,
    outFenceTotal: 0,
    currentTab: 0, //当前导航
    isAdd: false, //是否处于递归添加设备的状态
    currentAddres: "",
    currentMessageTab: 2,
    msgList: [],
    handlerList: [],
    alarmList: [],
    isDealDialog: false, //是否显示处理报警信息对话框
    selectAlarmItem: {
      //选择要处理的报警信息
      deviceImei: "",
      msgId: "",
      createTime: "",
      title: "",
      lon: "",
      lat: "",
      address: ""
    },
    dealUser: "", //处理人
    dealNote: "", //处理备注
    startTime: new Date("2023,01,01"), //报警信息时间范围
    endTime: new Date(),
    isAll: false, //是否加载全部设备
    widthLeft: 60,
    widthRight: 40,
    screenWidth: document.body.clientWidth,
    lat: 0, //当前设备的纬度
    lng: 0, //当前设备的经度
    pageLayout: "total, sizes, prev, pager, next",
    instruction: []
  }),
  watch: {
    searchKey() {
      if (!this.searchKey) {
        //搜索框为空切换回设备列表
        this.isSearch = false;
        this.devList = JSON.parse(this.originList);
        this.onDevList();
      }
    },
    screenWidth() {
      if (this.screenWidth) {
        if (this.screenWidth < 1400) {
          this.widthLeft = 50;
          this.widthRight = 50;
        } else {
          this.widthLeft = 60;
          this.widthRight = 40;
        }
      }
    }
  },
  created() {
    this.accountNum = this.$t("homepage.accountNum");
    this.instruction = LangZh.deviceRecord.instruction;
  },
  updated() {
    this.accountNum = this.$t("homepage.accountNum");
  },
  methods: {
    getOrderNumber(name) {
      // 给指令类型加上数字
      var list = this.instruction;
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (name == list[i].text) {
          return str + list[i].num;
        }
      }
      return "";
    },
    changOrderName(num) {
      // 指令类型匹配到国际化文字
      var list = this.$t("deviceRecord.instruction");
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (num == list[i].num) {
          return str + list[i].text;
        }
      }
      return "";
    },
    showTheRightContent() {
      // console.log("zhixing ");
      this.isShowRight = !this.isShowRight;
      if (this.isShowRight) {
        this.widthLeft = 100;
        this.widthRight = 0;
      } else {
        this.widthLeft = 60;
        this.widthRight = 40;
      }
    },
    trackDevice() {
      //设备跟踪线开关
      this.isTrack = this.isTrack ? false : true;
      if (!this.isTrack) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "clear-run-line"
        });
      }
    },
    loadMsgList() {
      //消息列表
      loadMsgList({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == "200") {
          this.msgList = res.data;
        }
      });
    },
    loadALarmList() {
      //报警列表
      var data = {
        page: this.page.current,
        pageSize: 5, //默认只显示头30条
        nrOnly: false,
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59"
        ).getTime()
        // isAll: false, //不分页
      };
      loadAlarmDeviceList(data).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.msgs.length; i++) {
            res.data.msgs[i].address = "";
            res.data.msgs[i].num = this.getOrderNumber(res.data.msgs[i].title);
          }
          this.alarmList = res.data.msgs;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    },
    loadALarmList1() {
      // 加载已经处理过的报警信息
      var that = this;
      var data = {
        page: this.page1.current,
        pageSize: this.page1.limit, //默认只显示头20条
        nrOnly: false,
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59"
        ).getTime(),
        containChild: this.isChild,
        isAll: true //不分页
      };
      // console.log("data", data);
      loadDealAlarmList(data).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.msgs.length; i++) {
            res.data.msgs[i].address = "";
            res.data.msgs[i].num = this.getOrderNumber(res.data.msgs[i].title);
          }
          res.data.msgs = res.data.msgs.filter(item => {
            return item.sts == 1;
          });
          that.handlerList = res.data.msgs;
          that.page1.num = res.data.pageCount;
          that.page1.total = res.data.total;
        }
      });
    },
    onSaveAlarmDeal() {
      //保存处理报警信息--
      const data = {
        msgId: this.selectAlarmItem.msgId,
        conductor: this.dealUser,
        remark: this.dealNote,
        deviceImei: this.selectAlarmItem.deviceImei
      };
      // console.log(data);
      doSaveAlarmDeal(data).then(res => {
        if (res.errCode == "200") {
          this.loadALarmList1();
          this.loadALarmList();
          this.app.$emit("show-alert-msg", this.$t("accountMsg.handlerOk"));
          this.isDealDialog = false;
        } else {
          this.app.$emit("show-alert-msg", this.$t("accountMsg.handlerFail"));
        }
      });
    },
    onDealAlarm(item, idx) {
      //处理报警信息
      this.dealTableOp(item, idx, "alarmAddress");
      this.selectAlarmItem = item;
      this.dealNote = "";
      this.isDealDialog = true;
    },

    dealTableOp(item1, idx, name) {
      console.log("item", item);
      var that = this;
      if (name == "alarmUnread") {
        //已读报警列表
        var item = item1;
        if (item.sts == "0") {
          this.readMsg(item.msgId, idx);
        }
      } else if (name == "alarmDevice") {
        //查看报警列表设备详情
        that.app.$emit("show-device-dialog", {
          name: "AccountMsg",
          imei: item.deviceImei
        });
      } else if (name == "alarmUser") {
        //查看报警列表设备详情
        that.app.$emit("show-user-dialog", {
          name: "AccountMsg",
          userId: item.userId,
          userName: item.userName
        });
      } else if (name == "alarmAddress") {
        //查看报警地址
        console.log("ad", item, idx, name);
        var lat = that.alarmList[idx].baiduLat,
          lng = that.alarmList[idx].baiduLon;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          that.getPoiLocation(lng, lat, function(address) {
            that.alarmList[idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        } else {
          that.alarmList[idx].address = that.$t("common.addressFail");
        }
      } else if (name == "handlerAddress") {
        // 查看处理后的地址
        var lat1 = that.handlerList[idx].baiduLat,
          lng1 = that.handlerList[idx].baiduLon;
        if (
          lng1 &&
          lat1 &&
          lat1 != 0 &&
          lng1 > -180 &&
          lng1 <= 180 &&
          lat1 <= 90 &&
          lat1 >= -90
        ) {
          that.getPoiLocation(lng1, lat1, function(address) {
            that.handlerList[idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        } else {
          that.handlerList[idx].address = that.$t("common.addressFail");
        }
      }
    },
    dealOpTable(idx, item) {
      console.log(item);
      // 点击跳转到不同的信息类型
      if (item.idx == 2) {
        this.currentMessageTab = 2;
        this.loadALarmList();
      } else if (item.idx == 3) {
        this.currentMessageTab = 3;
        this.loadALarmList1();
      } else if (item.idx == 4) {
        //监控平台
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?userId=" +
            this.userId
        );
      }
    },
    // loadAlarmNum() {
    //   loadAlarmNum({ userId: this.userId }).then((res) => {
    //     if (res.errCode == 200) {
    //       this.alarmTotal = res.data.numTotal;
    //       this.sosTotal = res.data.num5;
    //       this.outFenceTotal = res.data.num7;
    //     }
    //   });
    // },
    loadDevices() {
      //加载设备统计数量
      const data = {
        userId: this.userId,
        isContainSub: this.isChild,
        model: "",
        startImportTime: parseInt(new Date("2000, 01,01").getTime() / 1000),
        endImportTime: parseInt(new Date().getTime() / 1000)
      };
      loadDevStatistic(data).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          this.deviceStatistics.monitorDeviceTotal = data.monitorDeviceTotal;
          this.deviceStatistics.onlineTotal = data.onlineTotal;
        } else {
          this.app.$emit("show-alert-msg", this.$t("statisticDialog.loadFail"));
        }
      });
    },
    goPlayBack(item) {
      // 跳轉到回放軌跡
      window.open(
        window.location.origin +
          window.location.pathname +
          `#/playback?deviceImei=${item.deviceImei}`
      );
    },
    showUserBox() {
      this.isUserBox = true;
    },
    dealUserItem(op) {
      //选择用户搜索box
      this.userId = op.userId;
      this.userName = op.userName;
      this.isRefresh = true;
      this.app.$emit("usertree-userid", this.userId, this.userName);
      this.loadDevices();
    },
    searchDevice() {
      // console.log("dadsdad");
      //搜索设备
      var that = this;
      if (this.searchKey) {
        if (this.getStrLen1(this.searchKey) >= this.imeiLen) {
          this.isSearch = true;
          this.isLoadMore = false;
          this.isLoad1 = true;
          const data = {
            userId: this.userId ? this.userId : this.rootUser.userId,
            key: this.searchKey
          };
          searchDevInfo(data).then(res => {
            if (res.errCode == "200" && res.data.length > 0) {
              that.devList = res.data;
              //加载搜索设备到地图上
              that.onDevList();
            } else {
              that.devList = [];
            }
            that.isLoad1 = false;
          });
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip"));
        }
      } else {
        //取消搜索，回到原来的设备列表
        this.isSearch = false;
        this.devList = JSON.parse(this.originList);
        //将原来的设备列表加载到地图上
        this.onDevList();
      }
    },
    resetTheTime() {
      this.refreshTime = 9;
      this.isRefresh = true;
      this.app.$emit("usertree-userid", this.userId, this.userName);
    },
    addDeviceMarker(operation) {
      console.log("this.deviceIme", this.deviceImei);
      //添加设备列表中不存在的设备到设备列表中
      var that = this;
      if (!this.deviceImei) {
        return;
      }
      updateDevice({ deviceImei: this.deviceImei }).then(res => {
        if (res.errCode == "200") {
          var op = res.data;
          var device = {
            bdlat: op.location.bdlat,
            bdlng: op.location.bdlng,
            course: op.info.course,
            deviceImei: op.deviceImei,
            icon: op.info.icon,
            lat: op.location.lat,
            lng: op.location.lon,
            locateTime: op.info.locateTime,
            name: op.info.name,
            signalTime: op.info.signalTime,
            sts: op.info.sts,
            stsNum: op.info.stsNum
          };
          that.devList.push(device);
          mapUtil.disposeDeviceIcon(device, false);
          var lat, lng;
          if (that.theMap == "baidu-map") {
            lat = device.bdlat;
            lng = device.bdlat;
          } else {
            lat = device.lat;
            lng = device.lng;
          }
          that.app.$emit("map-operation", {
            mapName: that.mapName,
            action: "add-marker",
            lat: lat,
            lng: lng,
            icon: mapUtil.getMarkerIcon(device),
            // icon: item.iconPath,
            title: "",
            // rotation: device.course,
            rotation: 0,
            data: device
          });
          if (operation == "select" && !that.isLoading) {
            that.app.$emit("map-operation", {
              mapName: that.mapName,
              action: "set-center",
              lat: lat,
              lng: lng
            });
            that.app.$emit("map-operation", {
              mapName: that.mapName,
              action: "set-zoom",
              zoom: that.bigZoom > 14 ? that.bigZoom : 14
            });
          }
        }
      });
    },
    onSelectDev(device) {
      // console.log(device);
      if (device && device.deviceImei && device.deviceImei == this.deviceImei) {
        return;
      }

      this.showAddress1(device);
      // console.log(device);
      this.app.$emit("onselectDevice");
      var tag = true;
      for (var i = 0; i < this.devList.length; i++) {
        //选中设备列表设备
        if (this.devList[i].deviceImei == device.deviceImei) {
          this.onDev(device, i);
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "select-marker",
            data: this.devList[i],
            prop: "deviceImei"
          });
          var lat, lng;
          if (this.theMap == "baidu-map") {
            lat = this.devList[i].bdlat;
            lng = this.devList[i].bdlng;
          } else {
            lat = this.devList[i].lat;
            lng = this.devList[i].lng;
          }
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: lat,
            lng: lng
          });
          if (!this.isLoading && !this.isAll) {
            if (this.theMap == "baidu-map") {
              // 百度地图 点击单个居中放大
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "center-zoom",
                lat: lat,
                lng: lng,
                zoom: this.bigZoom > 16 ? this.bigZoom : 16
              });
            } else {
              //2021-12-27 加上了居中 百度地图不知道啥情况，首次居中不了所以加上了上段
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "set-center",
                lat: lat,
                lng: lng
              });
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "set-zoom",
                zoom: this.bigZoom > 16 ? this.bigZoom : 16
              });
            }
          }
          // }
          tag = false;
          break;
        }
      }
      if (tag) {
        //如果不在设备列中则添加到设备列表
        if (this.isAll) {
          this.onDev(device);
          this.refreshInfoBox();
        } else {
          this.addDeviceMarker("select");
        }
      }
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-run-line"
      });
      this.refreshInfoBox();
    },
    onDev(device) {
      this.deviceImei = device.deviceImei;

      if (this.isShowName) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "show-marker-labels"
        });
      }
    },
    dealInfoxBoxData(op, mapName) {
      // console.log(op, mapName);
      //更新选中设备的信息
      if (this.theMap == "baidu-map") {
        this.lat = op.location.bdlat;
        this.lng = op.location.bdlng;
      } else {
        this.lat = Number(op.location.lat.toFixed(6));
        this.lng = Number(op.location.lon.toFixed(6));
      }
      if (mapName == this.mapName) {
        var device = {
          bdlat: op.location.bdlat,
          bdlng: op.location.bdlng,
          course: op.info.course,
          deviceImei: op.deviceImei,
          icon: op.info.icon,
          lat: op.location.lat,
          lng: op.location.lon,
          locateTime: op.info.locateTime,
          name: op.info.name,
          signalTime: op.info.signalTime,
          sts: op.info.sts,
          stsNum: op.info.stsNum,
          flowExpire: op.info.flowExpire,
          platExpire: op.info.platExpire,
          flowFlag: op.info.flowFlag,
          enableSts: op.info.enableSts,
          enableDate: op.info.enableDate,
          voltage: op.info.voltage,
          electricity: op.info.electricity,
          iconPath: op.info.iconPath
        };
        // this.lat = op.location.bdlat;
        // this.lng = op.location.bdlng;
        // console.log(device);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "move-marker",
          lat: this.lat,
          lng: this.lng,
          icon: mapUtil.getMarkerIcon(device),
          // icon: device.iconPath,
          title: "",
          // rotation: op.info.course,
          rotation: 0,
          deviceImei: op.deviceImei
        });
        if (this.isTrack) {
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: this.lat,
            lng: this.lng
          });
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "draw-run-line",
            lat: this.lat,
            lng: this.lng
          });
        }
        for (var i = 0; i < this.devList.length; i++) {
          if (this.devList[i].deviceImei == device.deviceImei) {
            this.devList.splice(i, 1, device);
            break;
          }
        }
        // console.log("op", op);
        if (op.info.stsNum == "1") {
          this.showAddress1(device);
        }
      }
    },
    doSort() {
      //设备列表数据排序
      if (
        this.devList.length > 0 &&
        this.selectOrder == "time" &&
        this.currentOrder == "down"
      ) {
        //按时间从大到小排序 最近更新的设备在前 默认
        this.devList = this.devList.sort(function(a, b) {
          if (a.stsNum == 2 && a.stsNum == b.stsNum) {
            //静止 对比定位时间
            return b.locateTime - a.locateTime;
          } else if (a.stsNum == b.stsNum) {
            //相同状态 对比信号时间
            return b.signalTime - a.signalTime;
          } else {
            //非相同状态 对比状态
            return a.stsNum - b.stsNum;
          }
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "name" &&
        this.currentOrder == "down"
      ) {
        //按名称从小到大 0-9a-Z中文
        this.devList = this.devList.sort(function(a, b) {
          // return CalcUtil.sortStr(a.name, b.name);
          let item1 = a.name;
          let item2 = b.name;
          return item1.localeCompare(item2);
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "time" &&
        this.currentOrder == "up"
      ) {
        //按时间从小到大排序
        this.devList = this.devList.sort(function(a, b) {
          if (a.stsNum == 2 && a.stsNum == b.stsNum) {
            //静止 对比定位时间
            return a.locateTime - b.locateTime;
          } else if (a.stsNum == b.stsNum) {
            //相同状态 对比信号时间
            return a.signalTime - b.signalTime;
          } else {
            //非相同状态 对比状态
            return a.stsNum - b.stsNum;
          }
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "name" &&
        this.currentOrder == "up"
      ) {
        //按名称从大到小 中文Z-a9-0
        this.devList = this.devList.sort(function(a, b) {
          // return CalcUtil.sortStr(b.name, a.name);
          let item1 = a.name;
          let item2 = b.name;
          return item2.localeCompare(item1);
        });
      }
      this.originList = JSON.stringify(this.devList);
    },
    dealDevOp(op) {
      // console.log("op", op);
      //设备列表的操作
      var idx = op.idx;
      var imei = op.imei;
      if (op.btnType == 0) {
        //监控平台设备列表操作
        if (idx == 0) {
          //跳转跟踪界面 currentMap
          this.trackDevice();
          // window.open(window.location.origin + window.location.pathname + `#/track?deviceImei=${imei}`);
        } else if (idx == 1) {
          //跳转回放界面 "#/playback?deviceImei=" + imei
          window.open(
            window.location.origin +
              window.location.pathname +
              `#/playback?deviceImei=${imei}`
          );
        } else if (idx == 2) {
          //更多 查看设备详情对话框
          this.app.$emit(
            "show-device-dialog",
            {
              name: "DeviceDialog",
              imei: op.imei
            },
            "location"
          );
        }
      }
    },
    onDevList(op) {
      // console.log("op", op);
      if (op) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "clear-map"
        });
        this.devList = op.devList;
        // this.page = op.pager;
        this.isLoading = true;
        this.isAdd = false;
        this.points = [];
        setTimeout(() => {
          this.isAdd = true;
          this.addDevToMap(0, op.devList);
        }, 900);
      }
    },
    addDevToMap(idx, list) {
      // 判断切换子账号时当前的设备号是否存在传过来的列表中，不存在就直接把当前的设备
      // 号赋值为空
      for (let i = 0; i < list.length; i++) {
        if (this.deviceImei != list[i].deviceImei) {
          this.deviceImei = "";
        }
      }
      //设备列表中设备递归添加到地图
      var that = this;
      if (idx < list.length && this.isAdd) {
        var item = list[idx];
        // console.log(item);
        var lat, lng;
        if (this.theMap == "baidu-map") {
          lat = item.bdlat;
          lng = item.bdlng;
        } else {
          lat = item.lat;
          lng = item.lng;
        }
        console.log("this.deviceImei", this.deviceImei);
        mapUtil.disposeDeviceIcon(item, false);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-marker",
          lat: lat,
          lng: lng,
          icon: mapUtil.getMarkerIcon(item),
          // icon: item.iconPath,
          title: "",
          // rotation: item.course,
          rotation: 0,
          data: item
        });
        this.points.push(new BMap.Point(item.bdlng, item.bdlat));
        this.$nextTick(function() {
          that.addDevToMap(idx + 1, list);
        });
      } else {
        this.isAdd = false;
        if (this.deviceImei) {
          //判断选中设备是否在列表中
          var tag = true;
          for (let i = 0; i < this.devList.length; i++) {
            if (this.devList[i].deviceImei == this.deviceImei) {
              mapUtil.disposeDeviceIcon(this.devList[i], false);
              this.onSelectDev(this.devList[i]);

              this.app.$emit("monitor-change-device", this.devList[i]);
              tag = false;
              break;
            }
          }
          if (tag) {
            this.addDeviceMarker();
          }
        } else {
          if (this.devList[0]) {
            mapUtil.disposeDeviceIcon(this.devList[0], false);
            this.onSelectDev(this.devList[0]);
            this.app.$emit("monitor-change-device", this.devList[0]);
            // console.log(this.devList[0]);
            // 首次加载也要让设备居中
            var lat, lng;
            if (this.theMap == "baidu-map") {
              lat = this.devList[0].bdlat;
              lng = this.devList[0].bdlng;
            } else {
              lat = this.devList[0].lat;
              lng = this.devList[0].lng;
            }
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "set-center",
              lat: this.devList[0].lat,
              lng: this.devList[0].lng
            });
          }
        }
        if (!this.isAll) {
          this.isLoading = false;
        }

        this.refreshInfoBox();
      }
    },
    refreshInfoBox() {
      //10s刷新地图上设备信息
      // console.log("12345");
      var that = this;
      // this.isRefresh = true;
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }

      this.$nextTick(function() {
        that.app.$emit(
          "refresh-infobox",
          {
            deviceImei: that.deviceImei
          },
          that.mapName,
          that.theMap
        );
      });

      that.refreshTime = 9;
      this.refreshInterval = setInterval(function() {
        if (that.refreshTime <= 0) {
          that.refreshTime = 9;
          if (!that.isAll) {
            that.app.$emit("refresh-dev-list", {
              mapName: this.mapName
            });
          }
          // 先加载列表，再移动
          // setTimeout(() => {
          that.app.$emit(
            "refresh-infobox",
            {
              deviceImei: that.deviceImei
            },
            that.mapName,
            that.theMap
          );
          // }, 500);
        } else {
          that.refreshTime--;
        }
      }, 1000);
    },

    selectWarnItem(idx, tag) {
      if (tag == "alarm") {
        this.highlight = idx;
        this.selectItem = idx;
      }
      // console.log("12314");
    },
    onMapZoom(center, zoom) {
      // console.log("zoom", typeof zoom);
      this.bigZoom = zoom > 13 ? zoom : 13;
    },
    //显示报警地址
    showAddress(idx, item) {
      console.log(item);
      var lat, lng;
      if (window.localStorage.getItem("langType") == "zh") {
        lng = item.baiduLon;
        lat = item.baiduLat;
      } else {
        lng = item.lon;
        lat = item.lat;
      }
      if (
        lng &&
        lat &&
        lat != 0 &&
        lng > -180 &&
        lng <= 180 &&
        lat <= 90 &&
        lat >= -90
      ) {
        this.getPoiLocation(lng, lat, address => {
          console.log("address", address);
          this.warnTable[idx].location = address
            ? address
            : this.$t("common.addressFail");
        });
      }
    },
    showAddress1(item) {
      // console.log(item);
      var lat, lng;
      if (window.localStorage.getItem("langType") == "zh") {
        lng = item.bdlng;
        lat = item.bdlat;
      } else {
        lng = item.lng;
        lat = item.lat;
      }
      if (
        lng &&
        lat &&
        lat != 0 &&
        lng > -180 &&
        lng <= 180 &&
        lat <= 90 &&
        lat >= -90
      ) {
        this.getPoiLocation(lng, lat, address => {
          // console.log("address", address);
          // this.devList[idx].location = address ? address : this.$t("common.addressFail");
          this.currentAddres = address;
        });
      } else {
        // this.devList[idx].location = this.$t("common.addressFail");
        this.currentAddres = this.$t("common.addressFail");
      }
    },
    readMsg(msgId, idx) {
      readMsgList({ msgId: msgId }).then(res => {
        if (res.errCode == "200") {
          // this.warnTable.splice(idx, 1);
          this.alarmList[idx].sts = "1";
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
    resetTheDevice() {
      this.deviceImei = "";
      this.devList = [];
      if (this.refreshInterval)
        this.refreshInterval = clearInterval(this.refreshInterval);
      this.refreshTime = 9;
    },
    listenEvent() {
      this.app.$on("reset-the-device", this.resetTheDevice);
      this.app.$on("map-select-marker", this.onSelectDev);
      this.app.$on("infobox-data", this.dealInfoxBoxData);
    },
    offEvent() {
      this.app.$off("reset-the-device", this.resetTheDevice);
      this.app.$off("map-select-marker", this.onSelectDev);
      this.app.$off("infobox-data", this.dealInfoxBoxData);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadALarmList();
      this.loadALarmList1();
      this.loadDevices();
    });
    this.listenEvent();
    //监听窗口的大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  beforeDestroy() {
    if (this.refreshInterval1)
      this.refreshInterval1 = clearInterval(this.refreshInterval1);
    if (this.refreshInterval)
      this.refreshInterval = clearInterval(this.refreshInterval);
    this.offEvent();
  }
};
</script>

<style scoped lang="scss">
.btn-show-right {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 99;
  .iconfont {
    font-size: 20px;
    font-weight: bold;
  }
}
.deal-content-box {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
.device-address {
  left: 50%;
  transform: translateX(-50%);
  color: #0a0a0a;
  // font-weight: bold;
  background: #fff;
  min-height: 25px;
  line-height: 25px;
  width: 450px;
  position: absolute;
  top: -25px;
  z-index: 10;
  background-color: #fff;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2), -1px -1px 4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #ccc;
  text-align: center;
  padding-bottom: 5px;
  padding-top: 30px;
  border-radius: 50px;
  font-size: 12px;
}
.more-user {
  span {
    color: #606266;
    padding-left: 10px;
    font-size: 18px;
  }
}
.btn-amap-satellite {
  top: 35px !important;
}
.dianliang-text {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  img {
    height: 20px;
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140px;
}
.alarm-table {
  // height: calc(100% - 40px);
  // overflow: scroll;
  width: 100%;
  // display: inline-block;
}
.more-user {
  .iconfont {
    font-size: 20px;
  }
}
.search-device {
  position: relative;
  span {
    position: absolute;
    z-index: 99;
    left: 4px;
    top: 9px;
  }
  img {
    height: 20px;
  }
  ::v-deep .el-input__inner {
    padding: 0 30px !important;
    border: none;
  }
}
.circle-btn1 {
  position: absolute;
  left: 60px;
  top: 35px;
  z-index: 999;
  background-color: hsla(0, 0%, 96%, 0.85);
  width: auto;
  padding: 0 5px;
  text-align: center;
  height: 25px;
  z-index: 999;
  line-height: 25px;
  font-size: 14px;
  color: #686868;
  border: 1px solid #c3c3c3;
  cursor: pointer;
}
.alarm-content-message {
  height: 44%;
  background: #fff;
}
.device-content-massage {
  .table-content {
    overflow: scroll;
    height: calc(100% - 85px);
    min-width: 466px;
  }
}
.home-page {
  .table-content {
    background: #fff;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    table thead > tr {
      cursor: pointer;
      border-bottom: solid 1px deepskyblue;
      line-height: 24px;
      background-image: linear-gradient(#cbe4f6, white);
    }

    table > tr > th,
    table thead > tr > th {
      font-weight: normal;
    }

    table tbody tr {
      line-height: 25px;
    }

    table tbody tr.active,
    table tbody tr:hover {
      background: #00ff80 !important;
    }
    table tr.active {
      background: #00ff80 !important;
    }
    tbody > tr:nth-child(even) {
      // background-color: #cbebf4;
      background-color: #f9f9f9;
    }
    tbody > tr > td {
      text-align: center !important;
    }
    ::v-deep .el-table .cell {
      font-size: 12px !important;
    }
  }
}
.device-content-massage {
  margin-top: 10px;
  height: 55%;
  background: #fff;
  padding: 10px;
}
.main-content-right {
  // width: 100%;
  // height: 100%;
  height: 100%;
  // flex: 43%;
  padding-left: 15px;
  position: relative;
}
.home-page-content {
  height: calc(100% - 40px);
  .content-message {
    border-radius: 15px;
  }
  .main-content {
    height: calc(100% - 110px);
    display: flex;
    flex-direction: row;
    .content-left {
      height: 100%;
      width: 60%;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
    }
    .content-right {
      width: 40%;
      // height: 100%;
      // flex: 4;
      // padding-left: 15px;
      position: relative;
      .message-top {
        display: flex;
        align-items: center;
        height: 30px;
        background: #c0eaff;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        padding: 6px 20px;
        img {
          padding-right: 5px;
        }
      }
    }
  }
}
.home-top {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding-left: 10px;
  height: 30px;
  .search-device {
    // width: 100%;
  }
}
.data-header {
  margin: 5px 0;
  ::v-deep .el-col-lg-4-8 {
    width: 20%;
  }
  ::v-deep .el-card {
    border-radius: 15px;
  }
}
.box-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  height: 50px;
  img {
    height: 40px;
  }
  .card-right {
    color: #fff;
  }
  .state-text {
    font-size: 16px;
    // white-space: nowrap;
  }
  span.state-text {
    padding-left: 3px;
  }
  .num-text {
    font-size: 20px;
    font-weight: bold;
  }
  .bottom-content {
    margin-top: 10px;
  }
}
</style>
