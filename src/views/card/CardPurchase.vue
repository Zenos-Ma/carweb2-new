<template>
  <div class="recharge-purchase layout-container" style="flex-direction: row;">
    <div class="form-card body-content-left">
      <div class="card-header">{{ $t("rechargePurchase.order") }}</div>
      <div class="card-body">
        <!-- 购买充值卡 -->
        <table class="form-table">
          <tr>
            <td>{{ $t("userDetail.loginNo") }}:</td>
            <td>{{ rootUser.loginNo }}</td>
          </tr>
          <tr>
            <td>{{ $t("common.userName") }}:</td>
            <td
              style="overflow: hidden; white-space: normal; word-break: break-word; line-height: 20px; font-size: 13px"
            >
              {{ rootUser.userName }}
            </td>
          </tr>

          <tr>
            <td>{{ $t("card.card") }}</td>
            <td>
              <el-select style="width: 180px" v-model="selectPackage">
                <el-option
                  v-for="(item, idx) in packageList"
                  :key="'transferCard' + idx"
                  :value="idx"
                  v-show="item.enable"
                  :label="item.text"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td>{{ $t("rechargePurchase.buyNum") }}</td>
            <td>
              <el-input v-model="packageNum" style="width: 70px" />
              {{ $t("rechargePurchase.zhang") }}
            </td>
          </tr>

          <tr>
            <td>{{ $t("rechargePurchase.shouldPay") }}:</td>
            <td>￥{{ (billInfo.shouldPay * 0.01) | fmoney }}</td>
          </tr>
          <tr>
            <td>{{ $t("rechargePurchase.discount") }}:</td>
            <td>￥{{ (billInfo.discount * 0.01) | fmoney }}</td>
          </tr>

          <tr>
            <td>{{ $t("common.note") }}:</td>
            <td>
              <el-input v-model="billInfo.note" />
            </td>
          </tr>

          <tr>
            <td>{{ $t("recharge.payWay") }}:</td>
            <td>
              <input
                type="radio"
                class="text-input"
                :value="2"
                v-model="billInfo.payWay"
              />
              {{ $t("recharge.wechat1") }}
              <input
                type="radio"
                class="text-input"
                :value="1"
                v-model="billInfo.payWay"
              />
              {{ $t("recharge.alipay1") }}
            </td>
          </tr>

          <tr>
            <td colspan="2" class="center">
              <el-button type="primary" size="small" @click="onSaveBill()">
                {{ $t("common.ok") }}
              </el-button>
              <el-button size="small" @click="onCancelBill()">
                {{ $t("common.cancel") }}
              </el-button>
            </td>
          </tr>
        </table>

        <!-- 2022-4-14 -->
        <div class="orange-box">
          <div v-show="getPackageEnable(1)">
            {{ $t("rechargePurchase.seriesCard") }}
          </div>
          <div v-show="getPackageEnable(2)">
            {{ $t("rechargePurchase.platformCard") }}
          </div>
          <div v-show="getPackageEnable(3)">
            {{ $t("rechargePurchase.flowCard") }}
          </div>
          <div v-show="getPackageEnable(4)">
            {{ $t("rechargePurchase.lifelongCard") }}
          </div>
        </div>
      </div>
    </div>
    <div class="form-card body-content-right">
      <div class="card-header">
        {{ $t("rechargePurchase.orderList") }}
      </div>
      <div class="card-body">
        <!-- 订单列表查询条件 -->
        <table class="form-table" style="width: 100%">
          <tr>
            <td>{{ $t("rechargeBill.timeRangeTip") }}:</td>
            <td
              colspan="5"
              style="font-size: 14px; text-align: left; width: 170px; display: inline-block"
            >
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
                v-model="timeFrom"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 192px"
                :disabled="!isTime"
              ></el-date-picker>
            </td>
            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <!-- <datetime-picker :input-width="142" unit="px" :datetime.sync="timeTo" :disabled="!isTime"></datetime-picker> -->
              <el-date-picker
                v-model="timeTo"
                type="datetime"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 192px"
                :disabled="!isTime"
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>{{ $t("rechargePurchase.orderNo") }}:</td>
            <td>
              <el-input style="width: 160px" v-model="searchBillKey" />
            </td>
            <td>{{ $t("common.status") }}:</td>
            <td>
              <!--  -->
              <el-select
                v-model="selectStatus"
                style="width: 192px"
                :placeholder="$t('rechargePurchase.pleaseChoose')"
              >
                <el-option value :label="$t('common.all')"></el-option>
                <el-option
                  v-for="(item, idx) in $t('rechargePurchase.billState')"
                  :value="idx"
                  :key="'billState' + idx"
                  :label="item.text"
                ></el-option>
              </el-select>
            </td>
            <td>{{ $t("recharge.payWay") }}:</td>
            <td>
              <el-select v-model.number="selectPay" style="width: 192px">
                <el-option :value="0" :label="$t('common.all')"></el-option>
                <el-option
                  :value="2"
                  :label="$t('recharge.wechat')"
                ></el-option>
                <el-option
                  :value="1"
                  :label="$t('recharge.alipay')"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr v-show="rootUser.userId == 1">
            <td>{{ $t("common.userName") }}:</td>
            <td colspan="2" style="text-align: left; white-sapce: nowrap">
              <el-input
                style="width: 160px"
                v-model="userName"
                @keyup.enter.native="searchUser"
                :placeholder="$t('common.searchUserTip')"
              />
              <user-box
                bname="RechargePurcharge"
                :is-show.sync="isUserBox"
                :search-key="userName"
                @select-result="dealUserItem"
              ></user-box>
              <el-button type="primary" @click="searchUser">
                {{ $t("common.search") }}
              </el-button>
            </td>
            <td colspan="3" style="text-align: right">
              <el-button
                type="primary"
                style="width: 95px"
                @click="loadRecharge()"
              >
                {{ $t("common.search1") }}
              </el-button>
              <el-button
                type="primary"
                style="width: 95px"
                @click="onExportBill('export')"
                >{{ $t("common.export") }}</el-button
              >
            </td>
          </tr>
          <tr v-show="rootUser.userId != 1">
            <td colspan="6" style="text-align: right">
              <el-button
                type="primary"
                style="width: 95px"
                @click="loadRecharge()"
              >
                {{ $t("common.search1") }}
              </el-button>
              <el-button
                type="primary"
                style="width: 95px"
                @click="onExportBill('export')"
                >{{ $t("common.export") }}</el-button
              >
            </td>
          </tr>
        </table>

        <!-- 订单列表 -->
        <div style="height: calc(100% - 120px)">
          <data-table
            :data="rechargeList"
            :show-index="true"
            @getTableData="loadRecharge"
            :page="page"
            :page-count="page.num"
          >
            <!--  -->
            <el-table-column
              :label="$t('rechargePurchase.orderNo')"
              width="130"
              prop="ordersId"
            ></el-table-column>
            <el-table-column :label="$t('card.card')" width="140">
              <template slot-scope="props">
                {{ props.row.cards.cards[0] }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('rechargePurchase.buyNum')" width="100">
              <template slot-scope="props">
                {{ props.row.cards.num[0] }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('rechargePurchase.payWay')" width="80">
              <template slot-scope="props">
                {{
                  props.row.payWay == 1
                    ? $t("recharge.alipay1")
                    : $t("recharge.wechat1")
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePurchase.shouldPay')"
              width="90"
            >
              <template slot-scope="props"
                >￥{{ (props.row.payableMoney * 0.01) | fmoney }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePurchase.received')"
              width="90"
            >
              <template slot-scope="props"
                >￥{{ (props.row.payAmount * 0.01) | fmoney }}</template
              >
            </el-table-column>
            <el-table-column :label="$t('common.status')" width="100">
              <template slot-scope="props">
                {{
                  $t(
                    "rechargePurchase.billState[" +
                      props.row.orderStatus +
                      "].text"
                  )
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePurchase.orderTime')"
              width="150"
            >
              <template slot-scope="props">
                {{ props.row.createTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePurchase.payTime')"
              width="150"
            >
              <template slot-scope="props">
                {{
                  props.row.orderStatus >= 1 && props.row.orderStatus < 3
                    ? props.row.payTime
                    : "--" | fdatetime
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePurchase.finishTime')"
              width="150"
            >
              <template slot-scope="props">
                {{
                  props.row.orderStatus >= 2
                    ? props.row.finishTime
                    : "--" | fdatetime
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.note')" width="140">
              <template slot-scope="props">
                {{ props.row.remark ? props.row.remark : "--" }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.operation')"
              width="200"
              fixed="right"
            >
              <template slot-scope="props">
                <el-button
                  type="warning"
                  size="small"
                  @click="onCancelBill(props.row)"
                  v-show="
                    props.row.orderStatus == 0 &&
                      getPayBillState(props.row) &&
                      props.row.terminalType == 1
                  "
                >
                  {{ $t("rechargePurchase.cancelBill") }}
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="onContinueBill(props.row)"
                  v-show="
                    props.row.orderStatus == 0 &&
                      getPayBillState(props.row) &&
                      props.row.terminalType == 1
                  "
                >
                  {{ $t("rechargePurchase.continuePay") }}
                </el-button>
                <span v-show="props.row.terminalType == 2">{{
                  $t("rechargePurchase.payTip2")
                }}</span>
                <el-button
                  type="success"
                  size="small"
                  @click="onMakeCard(props.row)"
                  v-show="props.row.orderStatus == 1"
                >
                  {{ $t("rechargePurchase.makeCard") }}
                </el-button>
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>
    <dialog-comp
      :visible.sync="isBillDialog"
      :dialog-title="$t('rechargePurchase.order')"
      :dialog-width="800"
    >
      <!-- 微信支付 -->
      <div v-show="billInfo.payWay == 2">
        <div style="line-height: 30px; padding-left: 20px">
          <i
            class="iconfont icon-wechatpay"
            style="color: green; font-size: 20px; margin-left: 1rem"
          ></i>
          <span style="font-size: 20px">{{
            $t("rechargePurchase.wechatPay")
          }}</span>
        </div>
        <div
          style="height: calc(100% - 30px); display: flex; flex-direction: row; align-items: center; justify-content: center"
        >
          <div style="flex: 1; display: inline-block; text-align: center">
            <table class="form-table" style="width: 100%; height: 320px">
              <tr>
                <td>{{ $t("rechargePurchase.payId") }}:</td>
                <td>{{ billInfo.ordersId }}</td>

                <td style="text-align: center; font-weight: normal"></td>
              </tr>
              <tr>
                <td>{{ $t("card.card") }}:</td>
                <td style="white-space: pre-wrap">
                  {{ getCardStr(billInfo.cardTypeStr).str }}
                </td>
              </tr>

              <tr>
                <td>{{ $t("rechargePurchase.payMoney") }}:</td>
                <td style="font-size: 30px">
                  ￥{{ (billInfo.discount * 0.01) | fmoney }}
                </td>
              </tr>

              <tr>
                <td>{{ $t("common.note") }}:</td>
                <td>{{ billInfo.note }}</td>
              </tr>
              <tr>
                <td colspan="2">
                  <button
                    style="width: 100px; color: white; background: green; border: none; height: 30px; outline: none"
                    @click="onCheckPay()"
                  >
                    {{ $t("rechargePurchase.payed") }}
                  </button>
                  <button
                    style="width: 100px; color: white; background: green; border: none; height: 30px; outline: none"
                    @click="onCancelBill()"
                  >
                    {{ $t("rechargePurchase.cancelBill") }}
                  </button>
                </td>
              </tr>
            </table>
          </div>
          <div
            style="flex: 1; border-left: dashed 1px #efefef; display: inline-block; text-align: center; line-height: 3rem"
          >
            <div v-html="timeoutTip"></div>

            <img
              style="height: 200px; width: 200px; padding: 5px; box-shadow: 0 0 10px gray"
              :src="payCode"
            />

            <div style="color: gray">{{ $t("rechargePurchase.payTip1") }}</div>
            <table class="form-table" style="margin: 0 auto">
              <tr>
                <td>{{ $t("rechargePurchase.receiver") }}:</td>
                <td>多米智联</td>
              </tr>
              <tr>
                <td>{{ $t("rechargePurchase.orderTime") }}:</td>
                <td>{{ billInfo.orderTime | fdatetime }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!-- 支付宝支付 -->
      <div v-show="billInfo.payWay == 1">
        <div style="line-height: 30px; padding-left: 20px">
          <i
            class="iconfont icon-alipay"
            style="color: #108ee9; font-size: 20px; margin-left: 10px"
          ></i>
          <span style="font-size: 20px">{{
            $t("rechargePurchase.alipayPay")
          }}</span>
        </div>
        <div v-html="billInfo.aliHtml"></div>

        <table class="form-table" style="margin: 10px auto">
          <tr>
            <td>{{ $t("rechargePurchase.payId") }}:</td>
            <td>{{ billInfo.ordersId }}</td>

            <td style="text-align: center; font-weight: normal"></td>
          </tr>
          <tr>
            <td>{{ $t("card.card") }}:</td>
            <td style="white-space: pre-wrap">
              {{ getCardStr(billInfo.cardTypeStr).str }}
            </td>
          </tr>

          <tr>
            <td>{{ $t("rechargePurchase.payMoney") }}:</td>
            <td style="font-size: 30px">
              ￥{{ (billInfo.discount * 0.01) | fmoney }}
            </td>
          </tr>

          <tr>
            <td>{{ $t("common.note") }}:</td>
            <td>{{ billInfo.note }}</td>
          </tr>
          <tr>
            <td>{{ $t("rechargePurchase.receiver") }}:</td>
            <td>北京基准位置信息科技有限公司</td>
          </tr>
          <tr>
            <td>{{ $t("rechargePurchase.orderTime") }}:</td>
            <td>{{ billInfo.orderTime | fdatetime }}</td>
          </tr>
        </table>

        <div style="text-align: center">
          <div v-html="timeoutTip"></div>
          <button
            style="width: 100px; color: white; background: #108ee9; border: none; height: 30px; margin-top: 10px; outline: none"
            @click="onSubmitForm()"
          >
            {{ $t("rechargePurchase.alipayPay") }}
          </button>
        </div>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import QRCode from "jr-qrcode";
import mapUtil from "@/utils/mapUtil.js";
import UserBox from "@/components/UserBox";
import ExportUtil from "@/utils/exportUtil.js";
import {
  doCancelBill,
  loadRechargeCardBill,
  doMakeRechargeCard,
  isGetWxBillState,
  doOrderBill,
  getUserCardDiscountInfo,
  loadOriginCardPrice
} from "@/api/card.js";
export default {
  name: "RechargePurchase",
  components: {
    "user-box": UserBox
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),

    rechargeList: [], //订单列表
    page: {
      name: "cards",
      current: 1,
      num: 1,
      pageSize: 30,
      total: 0
    },

    isBillDialog: false,
    payCode: "",
    billInfo: {
      ordersId: "",
      cardTypeStr: "",
      shouldPay: 0,
      discount: 0,
      payWay: 2,
      note: "",
      orderTime: "",
      aliHtml: ""
    },
    isTime: false,
    timeInterval: null,
    timeoutTip: "",
    searchBillKey: "",
    timeFrom: "2000-01-01 00:00",
    timeTo: new Date().format("yyyy-MM-dd hh:00"),
    selectStatus: "",

    isUserBox: false,
    userName: "",
    userId: "",
    selectPay: 0,
    packageList: [],
    isLoading: false,
    selectPackage: 0,
    packageNum: 0,
    isExport: false
  }),
  watch: {
    packageNum() {
      if (!this.isLoading) {
        this.getPrice();
      }
    },
    selectPackage() {
      if (!this.isLoading) {
        this.getPrice();
      }
    },

    userName() {
      if (!this.userName) {
        this.userId = "";
      }
    }
  },

  methods: {
    payWay_cn(item) {
      //获取付款类型

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
    // 导出订单列表
    onExportBill(tag) {
      console.log("124");
      if (tag == "export") {
        this.isExport = true;
      } else {
        this.isExport = false;
      }
    },
    // 导出订单表格
    exportBill(list) {
      var title = [
        "订单号",
        "充值卡类型",
        "购买数量",
        "支付方式",
        "应付",
        "实收",
        "状态",
        "下单时间",
        "支付时间",
        "完成时间",
        "备注"
      ];
      var content = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        content.push([
          item.ordersId,
          item.cards.cards[0],
          item.cards.num[0],
          item.payWay == 1
            ? this.$t("recharge.alipay")
            : this.$t("recharge.wechat"),
          item.payableMoney * 0.01,
          item.payAmount * 0.01,
          this.$t("rechargePurchase.billState[" + item.orderStatus + "].text"),
          new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss"),
          item.orderStatus >= 1 && item.orderStatus < 3
            ? new Date(item.payTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.orderStatus >= 2
            ? new Date(item.finishTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.remark ? item.remark : "--"
        ]);
      }
      ExportUtil.exportTable(
        title,
        content,
        "订单列表" + new Date().format("yyyyMMddhhmmss")
      );
    },

    getPrice() {
      // 计算付款价格
      var item = this.packageList[this.selectPackage];
      this.billInfo.shouldPay = item.price * this.packageNum;
      this.billInfo.discount =
        item.price * this.packageNum * item.discount * 0.01;
    },

    getPackageEnable(packageId) {
      // 充值卡可用类型
      for (let i = 0; i < this.packageList.length; i++) {
        if (
          packageId == this.packageList[i].packageId &&
          this.packageList[i].enable
        ) {
          return true;
        }
      }
      return false;
    },
    onSubmitForm() {
      document.punchout_form.submit();
    },
    searchUser() {
      this.isUserBox = true;
    },
    dealUserItem(item) {
      this.userId = item.userId;
      this.userName = item.userName;
    },
    onCloseDialog() {
      this.isBillDialog = false;
      this.loadRecharge();
    },
    getPayBillState(item) {
      var tag = false;
      var time = new Date().getTime() - item.createTime;
      if (time < 30 * 60 * 1000) {
        tag = true;
      }
      return tag;
    },

    onCancelBill(item, isError) {
      //取消订单
      var data = {
        ordersId: item && item.ordersId ? item.ordersId : this.billInfo.ordersId
      };
      //
      doCancelBill(data).then(res => {
        if (res.errCode == "200") {
          if (isError) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePurchase.billError")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePurchase.cancelBillOk")
            );
          }
          this.isBillDialog = false;
          this.loadRecharge();
        } else {
          if (isError) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePurchase.billError")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePurchase.cancelBillFail")
            );
          }
        }
      });
    },
    loadRecharge(tag) {
      console.log("tag", tag);
      //加载订单列表
      if (this.timeInterval)
        this.timeInterval = clearInterval(this.timeInterval);
      var data = {
        userId: this.rootUser.userId,
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        payWay: this.selectPay
      };
      if (this.isTime) {
        data.timeFrom = new Date(this.timeFrom).getTime();
        data.timeTo = new Date(this.timeTo).getTime();
      } else {
        data.timeFrom = 0;
        data.timeTo = new Date().getTime() + 60000;
      }
      if (
        this.selectStatus !== "" &&
        this.selectStatus !== undefined &&
        this.selectStatus !== null
      ) {
        data.status = this.selectStatus;
      }
      if (this.searchBillKey) {
        data.ordersId = this.searchBillKey;
      }
      if (this.userId) {
        data.userId = this.userId;
      }
      if (this.isExport) {
        data.pageSize = 100000000;
      }

      loadRechargeCardBill(data).then(res => {
        if (res.errCode == "200") {
          for (let i = 0; i < res.data.queue.length; i++) {
            res.data.queue[i].cards = this.getCardStr(
              res.data.queue[i].cardTypeStr
            );
          }
          if (this.isExport) {
            this.exportBill(res.data.queue);
          } else {
            this.isExport = false;
            this.rechargeList = res.data.queue;
            this.page.num = res.data.pageCount;
            this.page.total = res.data.total;
          }
        }
      });
    },
    getCardStr(cardTypeStr) {
      //解析充值卡类型
      if (cardTypeStr) {
        var list = cardTypeStr.split(";");
        // console.log(list);
        var theList = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i]) {
            let item = list[i].split(",");
            theList.push({
              packageId: parseInt(item[0]),
              num: parseInt(item[1])
            });
          }
        }
        // console.log(theList);
        var resultList = JSON.parse(JSON.stringify(this.packageList));
        var cards = [],
          buys = [];
        var str = [];
        for (let i = 0; i < resultList.length; i++) {
          var enable = false,
            num = 0;
          for (let j = 0; j < theList.length; j++) {
            if (theList[j].packageId == resultList[i].packageId) {
              enable = true;
              num = theList[j].num;

              break;
            }
          }
          if (enable && num > 0) {
            cards.push(resultList[i].text);
            buys.push(num);
            str.push(
              resultList[i].text +
                ":  " +
                num +
                "  " +
                this.$t("rechargePurchase.zhang")
            );
          }
        }
        return { str: str.join("\n"), cards: cards, num: buys };
      } else {
        return { str: "", cards: [], num: [] };
      }
    },
    onMakeCard(item) {
      //制卡
      document.getElementById("loading_page").style.display = "flex";
      var data = {
        ordersId: item.ordersId
      };
      //
      doMakeRechargeCard(data).then(res => {
        document.getElementById("loading_page").style.display = "none";
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePurchase.makeCardOk")
          );
          this.loadRecharge();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePurchase.makeCardFail")
          );
        }
      });
    },
    onContinueBill(item) {
      //继续订单
      var that = this;
      var m30 = 30 * 60 * 1000;
      var minute = item.orderTime
        ? m30
        : new Date().getTime() - item.createTime < m30
        ? m30 - (new Date().getTime() - item.createTime)
        : 0;
      if (minute > 0) {
        this.timeInterval = setInterval(() => {
          if (that.isBillDialog) {
            minute = minute - 1000;
            that.timeoutTip = that
              .$t("rechargePurchase.payTip")
              .replace(
                "_time_",
                `<span style="font-size:16px;color:red;font-weight:bold;">${mapUtil.cnTime(
                  minute
                )}</span>`
              );
            if (minute == 0) {
              that.onCancelBill();
            }
          } else {
            if (that.timeInterval)
              that.timeInterval = clearInterval(that.timeInterval);
          }
        }, 1000);

        this.billInfo = {
          ordersId: item.ordersId,
          cardTypeStr: item.cardTypeStr,
          shouldPay: item.payableMoney,
          discount: item.payAmount,
          payWay: item.payWay,
          note: item.remark,
          orderTime: item.orderTime ? item.orderTime : item.createTime
        };

        if (item.payWay == 2 && item.codeUrl) {
          //微信支付
          this.payCode = QRCode.getQrBase64(item.codeUrl);

          this.isBillDialog = true;
        } else if (item.payWay == 1 && item.aliHtml) {
          //支付宝支付
          this.billInfo.aliHtml = item.aliHtml;
          this.isBillDialog = true;
        } else {
          this.onCancelBill(item, true);
        }
      } else {
        this.onCancelBill(item, true);
      }
    },
    onCheckPay() {
      //检查是否已付款
      document.getElementById("loading_page").style.display = "flex";
      var data = {
        ordersId: this.billInfo.ordersId
      };
      //
      isGetWxBillState(data).then(res => {
        document.getElementById("loading_page").style.display = "none";
        if (
          res.errCode == "200" &&
          res.data.orderStatus >= 1 &&
          res.data.orderStatus < 3
        ) {
          this.app.$emit("show-alert-msg", this.$t("rechargePurchase.payOk"));
          this.isBillDialog = false;
          this.loadRecharge();
        } else {
          this.app.$emit("show-alert-msg", this.$t("rechargePurchase.payFail"));
        }
      });
    },

    onSaveBill() {
      //提交订单，生成预订单
      // console.log(this.packageList);
      var list = [];
      var tag = true,
        isOver = false;
      for (let i = 0; i < this.packageList.length; i++) {
        let { packageId, enable, num } = this.packageList[i];
        if (enable && num > 0) {
          list.push(packageId + "," + num);
          tag = false;
          if (num > 1000) {
            isOver = true;
          }
        }
      }
      // console.log(list);
      if (this.packageNum < 100) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("rechargePurchase.cardNumTip")
        );
        return;
      }
      if (isOver) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("rechargePurchase.cardNumTip1")
        );
        return;
      }
      // this.billInfo.shouldPay = 0;
      if (this.billInfo.shouldPay == 0) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("rechargePurchase.shouldPayTip")
        );
        return;
      }
      var data = {
        cardTypeStr:
          this.packageList[this.selectPackage].packageId +
          "," +
          this.packageNum,
        payableMoney: Math.round(this.billInfo.shouldPay),
        payAmount: Math.round(this.billInfo.discount),
        remark: this.billInfo.note,
        payWay: this.billInfo.payWay
      };

      data.orderTime = new Date().getTime();
      // console.log(data);

      doOrderBill(data).then(res => {
        data.orderTime = new Date().getTime();
        if (res.errCode == "200") {
          // console.log(res);
          if (this.billInfo.payWay == 2) {
            //微信支付
            data.ordersId = res.data.ordersId;
            data.codeUrl = res.data.codeUrl;
            this.onContinueBill(data);
          } else {
            //支付宝支付
            data.ordersId = res.data.ordersId;
            data.aliHtml = res.data.aliHtml;
            this.onContinueBill(data);
          }
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePurchase.orderBillFail")
          );
        }
      });
    },
    getUserCardDiscount() {
      //获取用户折扣
      //
      getUserCardDiscountInfo({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == "200") {
          // console.log(res);
          if (res.data.cardTypeStr) {
            var list = res.data.cardTypeStr.split(";");
            var theList = [];
            for (let i = 0; i < list.length; i++) {
              if (list[i]) {
                let item = list[i].split(",");
                theList.push({
                  packageId: parseInt(item[0]),
                  discount: parseInt(item[1])
                });
              }
            }
            var resultList = JSON.parse(JSON.stringify(this.packageList));
            for (let i = 0; i < resultList.length; i++) {
              var enable = false,
                discount = 100;
              for (let j = 0; j < theList.length; j++) {
                if (theList[j].packageId == resultList[i].packageId) {
                  enable = true;
                  discount = theList[j].discount;
                  break;
                }
              }
              resultList[i].discount = discount;
              resultList[i].enable = enable;
            }
            this.packageList = resultList;
            this.loadRecharge();
            this.isLoading = false;
          }
        }
      });
    },
    getPriceAndDiscount() {
      //获取已有的充值卡类型
      this.isLoading = true;
      //
      loadOriginCardPrice().then(res => {
        if (res.errCode == "200") {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            let { cardId, cardName, mainPrice } = res.data[i];
            list.push({
              packageId: cardId,
              text: cardName,
              price: mainPrice,
              enable: false,
              discount: 100,
              num: 0
            });
          }

          this.packageList = list;
          this.getUserCardDiscount();
        }
      });
    },
    listenEvent() {
      this.app.$on("close-dialog-box", this.onCloseDialog);
    },
    offEvent() {
      this.app.$off("close-dialog-box", this.onCloseDialog);
    }
  },
  mounted() {
    this.listenEvent();
    this.getPriceAndDiscount();
    if (this.$route.query.alipayCode) {
      if (this.$route.query.alipayCode == 200) {
        this.app.$emit("show-alert-msg", this.$t("rechargePurchase.payOk"));
      } else {
        this.app.$emit("show-alert-msg", this.$t("rechargePurchase.payFail"));
      }
      window.location.hash = "#/home/card";
    }
  },

  deactivated() {
    if (this.timeInterval) {
      this.timeInterval = clearInterval(this.timeInterval);
    }
  },
  beforeDestroy() {
    this.offEvent();
    if (this.timeInterval) this.timeInterval = clearInterval(this.timeInterval);
  }
};
</script>

<style lang="scss" scoped>
.body-content-right {
  width: calc(100% - 298px);
  height: 100%;
  margin-left: 10px;
}
.body-content-left {
  width: 290px;
  height: 100%;
}
</style>
