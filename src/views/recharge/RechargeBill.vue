<template>
  <div class="form-card1 recharge-bill layout-container">
    <div class="card-header">{{ $t("rechargeBill.billSearch") }}</div>
    <div class="card-body">
      <!--查询订单条件 start-->
      <table class="form-table" style="width: 100%">
        <tr>
          <td>
            <span class="require-icon">*</span>
            {{ $t("rechargeBill.timeRangeTip") }}:
          </td>
          <td>
            <el-radio v-model="isTime" :label="false">{{
              $t("common.all")
            }}</el-radio>
            <el-radio v-model="isTime" :label="true">{{
              $t("rechargeBill.custom")
            }}</el-radio>
          </td>
          <td>{{ $t("common.startTime") }}:</td>
          <td>
            <el-date-picker
              type="date"
              v-model="timeFrom"
              format="yyyy-MM-dd"
              :disabled="!isTime"
              style="width: 160px"
            ></el-date-picker>
          </td>

          <td>{{ $t("common.endTime") }}:</td>
          <td>
            <!-- <date-picker :date.sync="timeTo" :disabled="!isTime"></date-picker> -->
            <el-date-picker
              type="date"
              v-model="timeTo"
              format="yyyy-MM-dd"
              :disabled="!isTime"
              style="width: 160px"
            ></el-date-picker>
          </td>
        </tr>
        <tr style="white-space: nowrap">
          <td>
            {{ $t("rechargeBill.searchWay") }}:{{ $t("recharge.externalId") }}:
          </td>
          <td>
            <el-input v-model="externalId" style="width: 180px" />
          </td>
          <td>{{ $t("common.userName") }}:</td>
          <td>
            <el-input
              style="width: 160px"
              v-model="userName"
              @keyup.enter.native="searchUser"
              :placeholder="$t('common.searchUserTip')"
            />
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="RechargeBill"
              :is-show.sync="isUserBox"
              :search-key="userName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td>
            <el-input
              style="width: 160px"
              v-model="deviceImei"
              @keyup.enter.native="searchDev"
              :placeholder="$t('common.searchDevTip')"
            />
            <el-button type="primary" @click="searchDev">{{
              $t("common.search")
            }}</el-button>
            <device-box
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
        </tr>
        <tr>
          <td colspan="6" style="text-align: right; font-size: 12px">
            <el-checkbox v-model="isChild">{{
              $t("common.containChild")
            }}</el-checkbox>
            <el-checkbox v-model="errOnly">{{
              $t("rechargeBill.searchTip")
            }}</el-checkbox>
            <el-button type="primary" @click="searchBill">{{
              $t("common.search")
            }}</el-button>

            <!-- <el-button type="primary" @click="exportOrder">{{ $t("rechargeBill.exportOrder") }}</el-button> -->
            <el-button type="primary" @click="exportTable">{{
              $t("common.export")
            }}</el-button>
            <el-button type="primary" @click="exportTable('all')">{{
              $t("common.exportAll")
            }}</el-button>
          </td>
        </tr>
      </table>

      <!--查询订单条件 end-->

      <!--订单表格 -->
      <div style="height: calc(100% - 115px)">
        <data-table
          :data="billList"
          :page="page"
          @getTableData="loadBill"
          :page-count="page.num"
          :show-selection="true"
          @selection-change="handleSelectionChange"
        >
          <!--  -->
          <el-table-column
            :label="$t('recharge.externalId')"
            prop="externalId"
            width="120"
          ></el-table-column>
          <el-table-column :label="$t('common.deviceImei')" width="140">
            <template slot-scope="props">
              <a @click="dealTableOp(props.row, props.$index, 'billDevice')">{{
                props.row.deviceImei
              }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.dealer')" width="120">
            <template slot-scope="props">
              <a @click="dealTableOp(props.row, props.$index, 'billSeller')">{{
                props.row.userName ? props.row.userName : "--"
              }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.series')" style="flex: 1">
            <template slot-scope="props">
              {{ props.row.goodsName ? props.row.goodsName : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.price')" width="100">
            <template slot-scope="props">
              {{ props.row.price ? (props.row.price * 0.01).toFixed(2) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.payWay')" width="120">
            <template slot-scope="props">
              {{ payWay_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.orderTime')" width="150">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="140">
            <template slot-scope="props">
              {{ billStatus_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            width="160"
            fixed="right"
            v-show="userId1 == 1"
          >
            <template slot-scope="props">
              <el-button
                class="primary-btn-table-shadow"
                size="small"
                v-show="
                  (props.row.status >= 1 && props.row.status <= 3) ||
                    props.row.status < 0
                "
                @click="dealTableOp(props.row, props.$index, 'billRefund')"
                >{{ $t("rechargeBill.refund") }}</el-button
              >
              <el-button
                class="primary-btn-table-shadow-sgreen"
                size="small"
                v-show="props.row.status < 0"
                @click="dealTableOp(props.row, props.$index, 'billFinish')"
                >{{ $t("rechargeBill.finish") }}</el-button
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>

    <relation-dialog></relation-dialog>
    <dev-detail-dialog></dev-detail-dialog>
  </div>
</template>

<script>
import RelationDialog from "@/components/relationDialog/RelationDialog";
import DevDetailDialog from "@/components/devDetailDialog/DevDetailDialog";
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import { doForceFinish, loadDeviceBill, doRefundBill } from "@/api/recharge.js";
import ExportUtil from "@/utils/exportUtil.js";
export default {
  name: "RechargeBill",
  components: {
    "relation-dialog": RelationDialog,
    "dev-detail-dialog": DevDetailDialog,
    "user-box": UserBox,
    "device-box": DeviceBox
  },
  data: () => ({
    userId1: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    billList: [], //订单表格数据
    userId: "", //查询订单客户id
    userName: "", //查询订单客户名称
    page: {
      //订单分页器
      name: "billList",
      pageSize: 30,
      num: 1,
      current: 1,
      total: 0
    },
    //查询开始日期
    // timeFrom: new Date().format("yyyy-MM-01"),
    timeFrom: new Date("2001, 01, 01"),
    //查询结束日期
    timeTo: new Date().format("yyyy-MM-dd"),
    externalId: "", //查询单号
    deviceImei: "", //查询设备号
    errOnly: false, //是否列举异常订单
    isTime: false, //全部或自定义时间
    isUserBox: false,
    isDeviceBox: false,
    isChild: true, //是否包含下级用户
    selectList: []
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
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = val;
    },
    exportEcall(list) {
      // 创建导出模板
      let theTitle = [
        this.$t("common.num"),
        this.$t("rechargePurchase.orderNo"),
        this.$t("common.deviceImei"),
        this.$t("recharge.dealer"),
        this.$t("recharge.series"),
        this.$t("recharge.price") + "(￥)",
        this.$t("recharge.payWay"),
        this.$t("recharge.orderTime"),
        this.$t("common.status")
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
          item.price ? (item.price * 0.01).toFixed(2) : 0,
          this.payWay_cn(item),
          item.createTime
            ? new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          this.billStatus_cn(item)
        ]);
      }
      ExportUtil.exportTable(
        theTitle,
        theList,
        this.$t("rechargePrice.seriesList")
      );
    },
    exportTable(tag) {
      // 导出订单表格
      if (tag == "all") {
        var data = {
          page: 1,
          pageSize: 10000,
          errOnly: this.errOnly
        };
        if (this.timeFrom && this.timeTo && this.isTime) {
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
        data.containChild = this.isChild;
        loadDeviceBill(data).then(res => {
          if (res.errCode == "200") {
            this.exportEcall(res.data.orders);
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
    payWay_cn(item) {
      //获取付款类型

      // switch (item.payWay) {
      //   case 1:
      //     return this.$t('recharge.alipay');

      //   case 2:
      //     return this.$t('recharge.wechat');

      //   default:
      //     return this.$t('recharge.other');
      // }

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
      //解析订单状态
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
    exportOrder() {
      let contextPath = window.location.origin + "/carweb2/";
      //导出全部订单
      $(`<form action='${contextPath + this.API.exportOrders}'></form>`)
        .appendTo("body")
        .submit()
        .remove();
      return false;
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
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
        this.isDeviceBox = false;
      }
    },

    doRefund(idx, item) {
      //退款
      var externalId = item.externalId;
      doRefundBill({ externalId: externalId }).then(res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeBill.refundSuccess")
          );
          this.billList[idx].status = 4;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeBill.refundFail") + "：" + res.errMsg
          );
        }
      });
    },
    doFinish(idx, item) {
      //结单
      var externalId = item.externalId;
      doForceFinish({ externalId: externalId }).then(Res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeBill.finishSuccess")
          );
          this.billList[idx].status = 3;
          var op = this.status_cn(this.billList[idx]);
          //that.billList[idx].pay = op.pay;
          this.billList[idx].state = op.str;
          this.billList[idx].btn = op.btn;
          this.billList[idx].btn1 = op.btn1;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeBill.finishFail") + "：" + res.errMsg
          );
        }
      });
    },
    searchBill() {
      //搜索订单
      this.page.current = 1;
      this.loadBill();
    },
    loadBill() {
      //获取订单列表
      var data = {
        page: this.page.current,
        pageSize: this.page.pageSize,
        errOnly: this.errOnly
      };
      if (this.timeFrom && this.timeTo && this.isTime) {
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
      data.containChild = this.isChild;
      loadDeviceBill(data).then(res => {
        if (res.errCode == "200") {
          this.page.num = res.data.pageCount;
          this.billList = res.data.orders;
          this.page.total = res.data.total;
        }
      });
    },
    dealTableOp(item, idx, name) {
      //处理表格操作
      if (name == "billSeller") {
        this.app.$emit("show-relation-dialog", {
          name: "RelationDialog",
          imei: item.deviceImei
        });
      } else if (name == "billDevice") {
        this.app.$emit("show-dev-detail-dialog", {
          name: "DevDetailDialog",
          imei: item.deviceImei
        });
      } else if (name == "billRefund") {
        if (item.btn != "--") {
          this.doRefund(idx, item);
        }
      } else if (name == "billFinish") {
        if (item.btn1 != "--") {
          this.doFinish(idx, item);
        }
      }
    },
    dealUserItem(op) {
      //选择用户搜索box
      this.userId = op.userId;
      this.userName = op.userName;
    },
    dealDevItem(op) {
      //选中设备搜索box
      this.deviceImei = op.deviceImei;
    },
    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    this.loadBill();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>
