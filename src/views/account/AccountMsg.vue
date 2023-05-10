<template>
  <div class="content-container form-card1 layout-container">
    <!--报警列表 、消息列表tab start-->
    <div class="card-header-tab">
      <el-tabs v-model="currentList">
        <el-tab-pane :label="$t('accountMsg.alarmList')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('accountMsg.msgDo')" name="2"></el-tab-pane>
        <el-tab-pane :label="$t('accountMsg.msgList')" name="0"></el-tab-pane>
      </el-tabs>
      <div class="right-box">
        <span
          class="iconfont icon-chart"
          style="font-weight: normal; color: #0095ec; font-size: 20px"
          @click="showChartPage"
        ></span>
      </div>
    </div>
    <!--报警列表 、消息列表tab end-->
    <div class="card-body">
      <!--报警列表表格 start-->
      <div
        style="display: flex; flex-direction: column; height: 100%"
        v-show="currentList == '0'"
      >
        <data-table :data="msgList" :show-page="false">
          <el-table-column
            :label="$t('accountMsg.sender')"
            prop="sender"
            min-width="150"
          ></el-table-column>
          <el-table-column
            :label="$t('accountMsg.msgTime')"
            prop="msgTime"
            min-width="120"
          ></el-table-column>
          <el-table-column
            :label="$t('accountMsg.title')"
            prop="title"
            min-width="120"
          ></el-table-column>
          <el-table-column
            :label="$t('accountMsg.content')"
            prop="content"
          ></el-table-column>
        </data-table>
      </div>
      <!--报警列表表格 end-->

      <!--报警列表 start-->
      <div style="height: 100%" v-show="currentList == '1'">
        <div class="left-right-box" style="line-height: 30px">
          <span class="left-box">
            <el-button
              type="primary"
              style="margin-left: 0 !important; margin-right: 5px"
              @click="loadALarmList"
              >{{ $t("common.refresh") }}</el-button
            >

            <el-checkbox v-model="isChild" style="margin-right: 10px">{{
              $t("common.containChild")
            }}</el-checkbox>

            {{ $t("common.startTime") }}:
            <span style="display: inline-block; width: 180px">
              <!-- <date-picker :date.sync="startTime"></date-picker> -->
              <el-date-picker
                type="date"
                v-model="startTime"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </span>
            {{ $t("common.endTime") }}:
            <span style="display: inline-block; width: 180px">
              <el-date-picker
                type="date"
                v-model="endTime"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </span>
          </span>
          <span class="right-box">
            <el-button class="btn-primary-button" @click="readAllAlarmList">{{
              $t("accountMsg.readAll")
            }}</el-button>
          </span>
        </div>
        <div style="height: calc(100% - 35px)">
          <data-table
            :data="alarmList"
            @getTableData="loadALarmList"
            :page="page"
            :page-count="page.num"
          >
            <!--  -->
            <el-table-column :label="$t('common.deviceImei')" min-width="120">
              <template slot-scope="props">
                <a
                  @click="dealTableOp(props.row, props.$index, 'alarmDevice')"
                  >{{ props.row.deviceImei }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('accountMsg.msgTime')" min-width="120">
              <template slot-scope="props">
                {{ props.row.createTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.alarmType')"
              prop="title"
            ></el-table-column>
            <el-table-column :label="$t('common.address')" min-width="250px">
              <template slot-scope="props">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <a
                  @click="dealTableOp(props.row, props.$index, 'alarmAddress')"
                  v-if="!props.row.address"
                  >{{ props.row.lat | flatlng }},{{
                    props.row.lon | flatlng
                  }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.status')">
              <template slot-scope="props">
                <span v-if="parseInt(props.row.sts) > 0">{{
                  $t("accountMsg.read")
                }}</span>
                <a
                  @click="dealTableOp(props.row, props.$index, 'alarmUnread')"
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
      </div>
      <!--报警列表 end-->
      <!-- 处理报警列表 start -->
      <div style="height: 100%" v-show="currentList == '2'">
        <div class="left-right-box" style="line-height: 30px">
          <span class="left-box">
            <el-button
              type="primary"
              style="margin-left: 0 !important; margin-right: 5px"
              @click="loadALarmList1"
              >{{ $t("common.refresh") }}</el-button
            >

            <el-checkbox v-model="isChild" style="margin-right: 10px">{{
              $t("common.containChild")
            }}</el-checkbox>
            {{ $t("common.startTime") }}:
            <span style="display: inline-block">
              <el-date-picker
                type="date"
                v-model="startTime"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </span>
            {{ $t("common.endTime") }}:
            <span style="display: inline-block">
              <el-date-picker
                type="date"
                v-model="endTime"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </span>
          </span>
          <span class="right-box">
            <el-button class="btn-primary-button" @click="exportTable">{{
              $t("common.export")
            }}</el-button>
            <el-button class="btn-primary-button" @click="exportTable('all')">{{
              $t("common.exportAll")
            }}</el-button>
          </span>
        </div>
        <data-table
          style="height: calc(100% - 35px)"
          :data="handlerList"
          @getTableData="loadALarmList1"
          :page="page1"
          :page-count="page1.num"
        >
          <!--  -->
          <el-table-column :label="$t('common.deviceImei')">
            <template slot-scope="props">
              <a @click="dealTableOp(props.row, props.$index, 'alarmDevice')">{{
                props.row.deviceImei
              }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('accountMsg.handlerTime')">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.alarmType')">
            <template slot-scope="props">
              {{ props.row.title }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.address')">
            <template slot-scope="props">
              <span v-if="props.row.address">{{ props.row.address }}</span>
              <a
                @click="dealTableOp(props.row, props.$index, 'handlerAddress')"
                v-if="!props.row.address"
                >{{ props.row.lat | flatlng }},{{ props.row.lon | flatlng }}</a
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
      <!-- 处理报警列表 end -->
    </div>

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
  </div>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import {
  loadDealAlarmList,
  doSaveAlarmDeal,
  loadMsgList,
  loadAlarmDeviceList,
  doReadAllAlarmList,
  doReadMsg
} from "@/api/account.js";
export default {
  template: "AccountMsg",
  props: {},
  components: {},
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    currentList: "1", //当前表格，1报警列表 0消息列表
    msgList: [], //消息表格数据
    alarmList: [], //报警表格数据
    page: {
      //报警列表分页器
      name: "alarmList",
      current: 1,
      pageSize: 30,
      num: 1,
      total: 0
    },
    page1: {
      //报警列表分页器
      name: "handlerList",
      current: 1,
      pageSize: 20,
      num: 1,
      total: 0
    },
    isChild: false, //报警信息时报包含下级
    startTime: "", //报警信息时间范围
    endTime: "",
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
    selectList: [], //选中的表格数据
    handlerList: [],
    handlerList1: [] //导出的信息
  }),
  created() {
    this.getCurrentMonthFirst();
    this.getCurrentMonthLast();
  },
  methods: {
    getCurrentMonthFirst() {
      let date = new Date();
      date.setDate(1);
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.startTime = date.getFullYear() + "-" + month + "-" + day;
    },
    getCurrentMonthLast() {
      var date = new Date();
      var month = parseInt(date.getMonth() + 1);
      var day = date.getDate();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      this.endTime = date.getFullYear() + "-" + month + "-" + day;
    },
    exportEcall(list) {
      // 导出xls表格
      // console.log(list);
      var title = [
        this.$t("common.num"),
        this.$t("common.deviceImei"),
        this.$t("accountMsg.handlerTime"),
        this.$t("alarm.alarmType"),
        this.$t("common.address"),
        this.$t("accountMsg.handlers"),
        this.$t("accountMsg.dealNote")
      ];
      var theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.deviceImei,
          item.updateTime ? new Date(item.updateTime).format("yyyy-MM-dd") : "",
          item.title,
          item.address ? item.address : item.lat + "," + item.lon,
          item.conductor ? item.conductor : "--",
          item.remark ? item.remark : "--"
        ]);
      }
      ExportUtil.exportTable(title, theList, this.$t("accountMsg.dealNoteXls"));
    },
    exportTable(tag) {
      // 报警信息的导出
      if (tag == "all") {
        var that = this;
        var data = {
          page: this.page.current,
          pageSize: this.page.pageSize, //默认只显示头20条
          nrOnly: false,
          // startTime: new Date(this.startTime + " 00:00").getTime(),
          // endTime: new Date(this.endTime + " 23:59").getTime(),
          startTime: new Date(
            new Date(this.startTime).format("yyyy-MM-dd") + " 00:00"
          ).getTime(),
          endTime: new Date(
            new Date(this.endTime).format("yyyy-MM-dd") + " 23:59"
          ).getTime(),
          containChild: this.isChild,
          isAll: false //不分页
        };
        this.app.$emit("show-progress-page", 0);
        loadDealAlarmList(data).then(res => {
          if (res.errCode == "200") {
            that.app.$emit("show-progress-page", 100);
            for (var i = 0; i < res.data.msgs.length; i++) {
              res.data.msgs[i].address = "";
            }
            // that.alarmList = data.msgs;
            res.data.msgs = res.data.msgs.filter(item => {
              return item.sts == 1;
            });
            that.handlerList1 = res.data.msgs;
            that.exportEcall(res.data.msgs);
          }
        });
        // this.exportEcall(this.handlerList1);
      } else {
        // 导出选中当前表格的数据项
        var origin_data = [];
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        for (var i = 0; i < this.selectList.length; i++) {
          origin_data.push(this.handlerList[this.selectList[i]]);
        }
        console.log(origin_data);
        this.exportEcall(origin_data);
      }
    },
    onDealAlarm(item, idx) {
      //处理报警信息
      this.dealTableOp(item, idx, "alarmAddress");
      this.selectAlarmItem = item;
      this.dealNote = "";
      this.isDealDialog = true;
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
    showChartPage() {
      //跳转到报警统计图表界面
      window.open(
        window.location.origin + window.location.pathname + "#/alarm-chart"
      );
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
        pageSize: this.page.pageSize, //默认只显示头30条
        nrOnly: false,
        // startTime: new Date(this.startTime + " 00:00").getTime(),
        // endTime: new Date(this.endTime + " 23:59").getTime(),
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
          }
          this.alarmList = res.data.msgs;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    }, //一键已读报警列表
    loadALarmList1() {
      // 加载已经处理过的报警信息
      var that = this;
      var data = {
        page: this.page1.current,
        pageSize: this.page1.pageSize, //默认只显示头20条
        nrOnly: false,
        // startTime: new Date(this.startTime + " 00:00").getTime(),
        // endTime: new Date(this.endTime + " 23:59").getTime(),
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59"
        ).getTime(),
        containChild: this.isChild,
        isAll: true //不分页
      };
      console.log("data", data);
      loadDealAlarmList(data).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.msgs.length; i++) {
            res.data.msgs[i].address = "";
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
    readAllAlarmList() {
      // 一键已读
      doReadAllAlarmList({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == "200") {
          this.loadALarmList();
          this.app.$emit(
            "show-alert-msg",
            this.$t("accountMsg.readAllSuccess")
          );
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("accountMsg.readAllFail") + ":" + res.errMsg
          );
        }
      });
    },
    readMsg(msgId, idx) {
      //已读报警列表信息项
      doReadMsg({ msgId: msgId }).then(res => {
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("accountMsg.readTip"));
          this.alarmList[idx].sts = "1";
        }
      });
    },
    /**
     * 处理表格操作
     * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
     */
    dealTableOp(item, idx, name) {
      var that = this;
      if (name == "alarmUnread") {
        //已读报警列表
        var item = item;
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
        console.log("ad");
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
    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    this.loadMsgList();
    this.loadALarmList();
    this.loadALarmList1();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.deal-content-box {
  ::v-deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
