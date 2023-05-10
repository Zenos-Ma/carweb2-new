<template>
  <div class="form-card1 recharge-my layout-container">
    <div class="top-card-show">
      <div
        class="card-show-item"
        v-for="(item, idx) in packageList"
        :key="'package' + idx"
        v-show="item.enable"
      >
        <div class="card-name">{{ item.text }}:</div>
        <div class="right">
          <span class="num-card">{{ item.num }}</span>
          <span class="zhang-card">{{ $t("rechargePurchase.zhang") }}</span>
        </div>
      </div>
    </div>
    <div class="card-header-my">
      <ul class="ul-tab-bar">
        <li
          v-for="(item, idx) in $t('rechargeMy.tabs')"
          :key="'tabs' + idx"
          :name="item.idx"
          :style="{ background: selectTab == idx ? '#fff' : '#c0eaff' }"
          @click="changeTab(idx)"
        >
          {{ item.text }}
        </li>
      </ul>
      <span v-show="selectTab < '3'" class="span-select">
        {{ $t("rechargeMy.order") }}:
        <el-select style="width: 160px" v-model="orderType">
          <el-option
            v-for="(item, idx) in $t('rechargeMy.orders')"
            :key="'order' + idx"
            :value="item.val"
            :label="item.text"
          >
          </el-option>
        </el-select>
      </span>
      <!--  -->
    </div>
    <div class="card-body">
      <table class="form-table1">
        <tbody v-show="selectTab == '0'">
          <tr>
            <td>{{ $t("rechargeMy.usage") }}:</td>
            <td>
              <el-select
                v-model="selectState"
                :placeholder="$t('rechargePurchase.pleaseChoose')"
              >
                <el-option
                  v-for="(item, idx) in $t('rechargeMy.usages')"
                  :key="'usage' + idx"
                  :value="item.val"
                  :label="item.text"
                >
                </el-option>
              </el-select>
            </td>
            <td>{{ $t("rechargeMy.value") }}:</td>
            <td>
              <el-select
                v-model="selectVal"
                :placeholder="$t('rechargePurchase.pleaseChoose')"
              >
                <el-option value>{{ $t("common.all") }}</el-option>
                <el-option
                  v-for="(item, idx) in packageList"
                  :key="'cards' + idx"
                  :value="item.packageId"
                  v-show="item.enable"
                  :label="item.text"
                >
                </el-option>
              </el-select>
            </td>
            <td>
              <el-button type="primary" @click="loadRecharge()">
                {{ $t("common.search1") }}
              </el-button>
              <el-button type="primary" @click="showTransferDialog">
                {{ $t("rechargeMy.transfer") }}
              </el-button>
              <el-button type="primary" @click="showBatchRecharge">
                {{ $t("rechargeMy.batchRecharge") }}
              </el-button>
              <el-button type="primary" @click="onExportRecharge('export')">
                {{ $t("common.export") }}
              </el-button>
            </td>
          </tr>
        </tbody>
        <tbody v-show="selectTab == '1'">
          <tr>
            <td>{{ $t("rechargeMy.rechargeTime") }}:</td>
            <td>
              <el-date-picker
                v-model="rechargeFrom"
                type="date"
                format="yyyy-MM-dd"
                style="width: 180px; margin-right: 10px"
              ></el-date-picker
              >-
              <el-date-picker
                v-model="rechargeTo"
                type="date"
                format="yyyy-MM-dd"
                style="width: 180px; margin-left: 10px"
              ></el-date-picker>
            </td>
            <td>
              <el-button
                type="primary"
                @click="loadRecharge()"
                style="margin-left: 20px"
              >
                {{ $t("common.search1") }}
              </el-button>
              <el-button type="primary" @click="onExportRecharge('export')">{{
                $t("common.export")
              }}</el-button>
            </td>
          </tr>
        </tbody>
        <tbody v-show="selectTab == '2'">
          <tr>
            <td>{{ $t("common.deviceImei") }}:</td>
            <td>
              <el-input
                style="width: 180px"
                v-model="deviceImei"
                :placeholder="$t('common.searchDevTip')"
                @keyup.enter.native="isDeviceBox = true"
              />
              <device-box
                :is-show.sync="isDeviceBox"
                :search-key.sync="deviceImei"
              ></device-box>
              <el-button type="primary" @click="isDeviceBox = true">
                {{ $t("common.search") }}
              </el-button>
            </td>
            <td style="padding-left: 30px">
              <el-button type="primary" @click="loadRecharge()">
                {{ $t("common.search1") }}
              </el-button>
              <el-button type="primary" @click="onExportRecharge('export')">
                {{ $t("common.export") }}
              </el-button>
            </td>
          </tr>
        </tbody>
        <tbody v-show="selectTab == '3'">
          <tr>
            <td>{{ $t("rechargeMy.transferTime") }}:</td>
            <td>
              <el-date-picker
                v-model="transferFrom"
                type="date"
                format="yyyy-MM-dd"
                style="width: 180px"
              ></el-date-picker>
            </td>
            <td>
              <el-date-picker
                v-model="transferTo"
                type="date"
                format="yyyy-MM-dd"
                style="width: 180px"
              ></el-date-picker>
            </td>
            <td>
              <el-button type="primary" @click="loadTransfer()">
                {{ $t("common.search1") }}
              </el-button>
            </td>
            <td>
              <el-button type="primary" @click="onExportTransfer()">
                {{ $t("common.export") }}
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="recharge-my-content">
        <!-- 默认，充值时间，充值设备 -->
        <data-table
          :data="rechargeList"
          @getTableData="loadRecharge"
          :page="page"
          :show-index="true"
          style="height: calc(100% - 100px)"
          v-show="selectTab < '3'"
        >
          <!--  -->
          <el-table-column
            :label="$t('rechargeMy.cardNo')"
            prop="rechargeCardNum"
            width="180"
          ></el-table-column>
          <el-table-column :label="$t('card.card')" width="140">
            <template slot-scope="props">
              {{ getCardType(props.row.packageId) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.createTime')" width="150">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="90">
            <template slot-scope="props">
              {{
                props.row.cardStatus == 1
                  ? $t("rechargePurchase.isUse")
                  : $t("rechargePurchase.unUse")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('rechargeMy.rechargeTime')" width="150">
            <template slot-scope="props">
              <span v-if="props.row.cardStatus == 1">{{
                props.row.rechargeTime | fdatetime
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.deviceImei')" width="160">
            <template slot-scope="props">
              <a @click="showDevice(props.row)" v-show="props.row.deviceImei">{{
                props.row.deviceImei
              }}</a>
              <span v-show="!props.row.deviceImei">--</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('rechargeMy.note')" style="flex: 1">
            <template slot-scope="props">
              {{ props.row.remark ? props.row.remark : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            width="100"
            fixed="right"
          >
            <template slot-scope="props">
              <el-button
                class="primary-btn-table-shadow"
                size="small"
                @click.native="showRecharge(props.row)"
                v-show="props.row.cardStatus == 0"
              >
                {{ $t("rechargeMy.recharge") }}
              </el-button>
            </template>
          </el-table-column>
        </data-table>
        <!-- 转移记录 -->
        <data-table
          :table-data="transferList"
          :is-num="true"
          style="height: calc(100% - 100px)"
          v-show="selectTab == '3'"
        >
          <!--  -->
          <el-table-column :label="$t('rechargeMy.transferTime')" width="140">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('rechargeMy.targetUser')"
            width="140"
            prop="targetUserName"
          ></el-table-column>
          <el-table-column :label="$t('card.card')" width="150">
            <template slot-scope="props">
              {{ getCardType(props.row.cardType) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('rechargeMy.transferNum')"
            width="120"
            prop="cardNum"
          ></el-table-column>
          <el-table-column :label="$t('rechargeMy.note')" style="flex: 1">
            <template slot-scope="props">
              {{ props.row.remark ? props.row.remark : "--" }}
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
    <!-- 转移对话框 -->
    <dialog-comp
      :visible.sync="isTransferShow"
      :dialog-title="$t('rechargeMy.transferCard')"
      :dialog-width="400"
      icon-window="icon-jiaohuan"
    >
      <table class="form-table" style="width: 100%">
        <tr>
          <td>{{ $t("rechargeMy.targetUser") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="transferInfo.userName" />
            <el-button type="primary" @click="isUserBox = true">
              {{ $t("common.search") }}
            </el-button>
            <user-box
              :is-show.sync="isUserBox"
              :search-key="transferInfo.userName"
              @select-result="onTransferUser"
            ></user-box>
            <div style="color: red; font-size: 12px" v-show="userType == 1">
              {{ $t("card.userCannotRecharge") }}
            </div>
          </td>
        </tr>
        <tr>
          <td>{{ $t("card.card") }}</td>
          <td>
            <!--  -->
            <el-select v-model="transferInfo.cardType" style="width: 180px">
              <el-option
                v-for="(item, idx) in packageList"
                :key="'transferCard' + idx"
                :value="item.packageId"
                v-show="item.enable"
                :label="item.text"
              >
              </el-option>
            </el-select>
          </td>
        </tr>

        <tr>
          <td>{{ $t("rechargeMy.leftNum") }}</td>
          <td>
            <!--  -->
            <el-select
              v-model="transferInfo.cardType"
              disabled
              style="width: 180px"
            >
              <el-option
                v-for="(item, idx) in packageList"
                :key="'transferCard' + idx"
                :value="item.packageId"
                :label="item.num"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargeMy.transferNum") }}</td>
          <td>
            <el-input
              style="width: 180px"
              v-model.number="transferInfo.cardNum"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargeMy.note") }}</td>
          <td>
            <el-input style="width: 180px" v-model="transferInfo.note" />
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <el-button
              type="primary"
              @click="onTransferCard"
              :disabled="userType == 1"
            >
              {{ $t("common.ok") }}
            </el-button>
            <el-button @click="isTransferShow = false">
              {{ $t("common.cancel") }}
            </el-button>
          </td>
        </tr>
      </table>
    </dialog-comp>
    <!-- 转移对话框 end-->
    <!-- 批量充值对话框 -->
    <dialog-comp
      :visible.sync="isBatchRecharge"
      :dialog-title="$t('rechargeMy.batchTransfer')"
      :dialog-width="800"
      icon-window="icon-chongzhi"
    >
      <table class="form-table">
        <tr>
          <td>{{ $t("rechargeMy.rechargeType") }}:</td>
          <td>
            <span
              v-for="(item, idx) in packageList"
              v-show="item.enable && item.num > 0"
              :key="'packager' + idx"
              style="margin-right: 5px"
            >
              <!-- <input type="radio" class="text-input" :value="item.packageId" v-model="batchRecharge.packageId" />
              {{ item.text }} -->
              <el-radio
                v-model="batchRecharge.packageId"
                :label="item.packageId"
                >{{ item.text }}</el-radio
              >
            </span>
          </td>
        </tr>
      </table>

      <ul class="select-tabs1">
        <li :class="[currentAdd == 0 ? 'active' : '']" @click="changeAdd(0)">
          {{ $t("batchTransfer.addOne") }}
        </li>
        <li :class="[currentAdd == 1 ? 'active' : '']" @click="changeAdd(1)">
          {{ $t("batchTransfer.addBatch") }}
        </li>
        <li>
          <el-button type="primary" size="small" @click="resetList">
            {{ $t("common.reset") }}
          </el-button>
        </li>
      </ul>
      <!-- 逐个添加，设备 -->
      <div v-show="currentAdd == 0" style="height: 90px">
        <table class="form-table">
          <tr>
            <td colspan="2">
              <el-input
                style="width: 180px"
                v-model="batchRecharge.deviceImei"
                :placeholder="$t('common.searchDevTip')"
              />
              <device-box
                :is-show.sync="isDeviceBox1"
                :search-key="batchRecharge.deviceImei"
                @select-result="addDevice"
                box-type="recharge"
              ></device-box>
              <el-button type="primary" @click="isDeviceBox1 = true">
                {{ $t("common.search") }}
              </el-button>
            </td>
          </tr>
        </table>
      </div>
      <div v-show="currentAdd == 1" style="height: 90px">
        <div class="orange-box">
          <div v-html="$t('batchTransfer.downloadTip')"></div>
          <div>
            <font style="color: red; font-weight: bold">{{
              $t("common.template")
            }}</font>
            <a
              class="btn-white"
              style="margin-left: 8px"
              :href="API.batchRechargeFile"
              >{{ $t("common.download") }}</a
            >
          </div>
        </div>

        <div>
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFile"
          ></file-upload>
        </div>
      </div>
      <data-table
        :data="batchRecharge.list"
        :show-index="true"
        :show-page="false"
      >
        <!--  -->
        <el-table-column :label="$t('common.deviceImei')" width="140">
          <template slot-scope="props">
            <a @click="showDevice(props.row)">{{ props.row.deviceImei }}</a>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.note')" style="flex: 1">
          <template slot-scope="props">
            <span style="color: red; text-align: left; white-space: pre-wrap">
              {{ props.row.note ? props.row.note : "" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="100">
          <template slot-scope="props">
            <a @click="delDevice(props.$index)">{{ $t("common.delete") }}</a>
          </template>
        </el-table-column>
      </data-table>
      <div class="orange-box" style="color: red">
        {{ $t("rechargeMy.flowTip") }}
      </div>
      <div style="text-align: center">
        <el-button
          type="primary"
          size="small"
          @click="onBatchRecharge"
          :disabled="!isBatch"
        >
          {{ $t("common.ok") }}
        </el-button>
        <el-button type="warning" size="small" @click="isBatchRecharge = false">
          {{ $t("common.cancel") }}
        </el-button>
      </div>
    </dialog-comp>
    <!-- 批量充值对话框 end-->
    <!-- 设备充值对话框 -->
    <dialog-comp
      :visible.sync="isRechargeDialog"
      :dialog-title="$t('rechargeMy.recharge')"
      :dialog-width="500"
      icon-window="icon-chongzhi"
    >
      <card-tab @close-card="colseRechargeCard"></card-tab>
    </dialog-comp>
  </div>
</template>

<script>
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import ExportUtil from "@/utils/exportUtil.js";
import FileUpload from "@/components/FileUpload";
import CardTab from "@/pages/DeviceDialog/CardTab";
import { getUserTreeInfo } from "@/api/customer.js";
import {
  batchRechargeDeviceInfo,
  loadRechargeCardStorge,
  loadDeviceTransferList,
  doTransferCard,
  doBatchRechargeCard,
  loadCardNumber,
  loadOriginCardPrice
} from "@/api/card.js";
export default {
  name: "RechargeMy",
  props: {},
  components: {
    "card-tab": CardTab,
    "user-box": UserBox,
    "device-box": DeviceBox,
    "file-upload": FileUpload
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    rechargeList: [], //默认，充值时间，充值设备
    transferList: [], //转移记录
    selectTab: "0", //当前tab
    page: {
      //数据表格分页器
      name: "RechargeMy",
      num: 1,
      pageSize: 30,
      current: 1,
      total: 0
    },
    currentAdd: 0, //添加设备的方式
    selectVal: "", //选中充值卡面值
    selectState: "", //选中充值卡状态
    deviceImei: "", //选中充值设备
    isDeviceBox: false, //充值设备搜索框
    rechargeFrom: new Date("2001, 01, 01"), //充值开始时间
    rechargeTo: new Date(), //充值结束时间
    transferFrom: new Date("2001, 01, 01"), //转移开始时间
    transferTo: new Date(), //转移结束时间
    isTransferShow: false, //转移对话框
    isBatchRecharge: false, //批量充值对话框
    isRechargeDialog: false, //充值对话框
    isUserBox: false, //转移用户搜索框

    isDeviceBox1: false, //批量充值对话框设备搜索框

    isDeviceBox2: false, //充值对话框设备搜索框

    transferInfo: {
      //转移充值卡信息
      userId: "",
      userName: "",
      cardType: 0,
      cardNum: 0,
      note: ""
    },
    batchRecharge: {
      //批量充值信息
      packageId: 1,
      deviceImei: "",
      list: [],
      type: 0
    },

    orderType: "create", //排序方式
    userType: 2,
    packageList: [],
    selectPackage: {
      isDataFee: 0,
      isPlatfromFee: 0
    },
    isBatch: true,
    deviceType: 0,
    isExport: false
  }),
  watch: {
    "batchRecharge.list": {
      deep: true,
      handler() {
        var tag = true;
        for (let i = 0; i < this.batchRecharge.list.length; i++) {
          console.log("i");
          if (
            this.batchRecharge.list[i].note ||
            this.batchRecharge.list[i].refillType != this.deviceType
          ) {
            tag = false;
            break;
          }
        }

        for (let j = 0; j < this.batchRecharge.list.length; j++) {
          if (
            this.batchRecharge.list[j].refillType == 4 &&
            (this.batchRecharge.packageId == 1 ||
              this.batchRecharge.packageId == 3)
          ) {
            tag = true;
            break;
          }
        }
        this.isBatch = tag;
      }
    },
    orderType() {
      this.onOrderType();
    },
    isRechargeDialog() {
      //关闭对话框清空数据
      if (!this.isRechargeDialog) {
        this.colseRechargeCard();
      }
    },
    isTransferShow() {
      //关闭对话框清空数据
      if (!this.isTransferShow) {
        this.closeTransferDialog();
      }
    },
    isBatchRecharge() {
      //关闭对话框清空数据
      if (!this.isBatchRecharge) {
        this.colseRechargeCard();
      }
    },
    "batchRecharge.packageId": {
      // 目前设备类型为标准和风控，1-4设置为标准充值类型，5为风控卡充值类型
      handler() {
        switch (this.batchRecharge.packageId) {
          case 1:
          case 2:
          case 3:
          case 4:
            this.deviceType = 0;
            break;
          case 5:
            this.deviceType = 1;
            break;
          case 6:
            this.deviceType = 2;
            break;
          case 7:
            this.deviceType = 3;
            break;
        }
        var tag = true;
        for (var i = 0; i < this.batchRecharge.list.length; i++) {
          if (
            this.batchRecharge.list[i].note ||
            this.batchRecharge.list[i].refillType != this.deviceType
          ) {
            tag = false;
            break;
          }
        }

        for (let i = 0; i < this.batchRecharge.list.length; i++) {
          if (
            this.batchRecharge.list[i].refillType == 4 &&
            (this.batchRecharge.packageId == 1 ||
              this.batchRecharge.packageId == 3)
          ) {
            tag = true;
            break;
          }
        }
        this.isBatch = tag;
      }
    }
  },
  methods: {
    resetList() {
      this.batchRecharge.list = [];
      this.app.$emit("reset-file-upload");
    },
    onExportTransfer() {
      this.loadTransfer(true);
    },
    onExportRecharge(tag) {
      if (tag == "export") {
        this.isExport = true;
      } else {
        this.isExport = false;
      }
    },
    exportRechargeTable(list) {
      var title = [
        "充值卡号",
        "充值卡类型",
        "创建时间",
        "状态",
        "充值时间",
        "设备号",
        "备注"
      ];
      var content = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        content.push([
          item.rechargeCardNum,
          this.getCardType(item.packageId),
          new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss"),
          item.cardStatus == 1
            ? this.$t("rechargePurchase.isUse")
            : this.$t("rechargePurchase.unUse"),
          item.cardStatus == 1
            ? new Date(item.rechargeTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.deviceImei ? item.deviceImei : "--",
          item.remark ? item.remark : "--"
        ]);
      }
      ExportUtil.exportTable(
        title,
        content,
        "我的充值卡" + new Date().format("yyyyMMddhhmmss")
      );
    },
    exportTransferTable(list) {
      var title = ["转移时间", "目标客户", "充值卡", "转移张数", "备注"];
      var content = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        content.push([
          new Date(item.createTime).format("yyyy-MM-dd hh:mm:ss"),
          item.targetUserName,
          this.getCardType(item.cardType),
          item.cardNum,
          item.remark ? item.remark : "--"
        ]);
      }
      ExportUtil.exportTable(
        title,
        content,
        "转移记录" + new Date().format("yyyyMMddhhmmss")
      );
    },

    getPackage(packageId) {
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.packageList[i].packageId == packageId) {
          return this.packageList[i];
        }
      }
      return {};
    },
    getLeftNum(packageId) {
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.packageList[i].packageId == packageId) {
          return this.packageList[i].num;
        }
      }
      return 0;
    },
    getCardType(packageId) {
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.packageList[i].packageId == packageId) {
          return this.packageList[i].text;
        }
      }
      return "";
    },
    getUserInfo() {
      getUserTreeInfo({ userId: this.transferInfo.userId }).then(res => {
        if (res.errCode == "200") {
          this.userType = res.data.userType;
        }
      });
    },
    changeAdd(idx) {
      // 改变添加方式
      // this.currentAdd = idx;
      if (this.batchRecharge.list.length == 0) {
        this.currentAdd = idx;
      } else {
        var that = this;
        this.app.$emit(
          "show-confirm-msg",
          this.$t("rechargeMy.changeAddTip"),
          function() {
            that.batchRecharge.list = [];
            that.currentAdd = idx;
          }
        );
      }
    },
    showDevice(item) {
      //搜索设备
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: item.deviceImei
      });
    },
    dealExcel(result) {
      // console.log(result);
      var list = [];
      for (var i = 0; i < result.length; i++) {
        list.push(result[i]["设备号(15位的IMEI号)"]);
      }
      // 过滤掉表格中的重复出现的设备
      list = list.filter((item, index, self) => {
        return self.indexOf(item) === index;
      });
      // 检查批量充值的设备号
      batchRechargeDeviceInfo({ deviceImeiStr: list.join(",") }).then(res => {
        if (res.errCode == "200") {
          for (let i = 0; i < res.data.length; i++) {
            let str = "";
            if (!res.data[i].iccid) {
              str = str + this.$t("rechargeMy.noICCIDTip");
            }
            if (
              new Date(res.data[i].platExpire).getTime() >=
              new Date("2037-01-01 00:00").getTime()
            ) {
              str = str + "\n" + this.$t("rechargeMy.deviceLifelong");
            }
            if (res.data[i].refillType == 4) {
              str = "";
            }
            res.data[i].deviceImei = list[i];
            res.data[i].note = str;
          }
          // 过滤掉设备充值类型与充值卡不匹配的设备
          res.data = res.data.filter(item => {
            return item.refillType == this.deviceType;
          });
          this.batchRecharge.list = res.data;
        }
      });
    },
    onUploadFile(files) {
      console.log(files);
      ExportUtil.parseExcel(files[0], this.dealExcel);
    },
    onOrderType() {
      //改变数据表排序方式
      if (this.orderType == "create") {
        this.rechargeList = this.rechargeList.sort(function(a, b) {
          return b.createTime - a.createTime;
        });
      } else {
        this.rechargeList = this.rechargeList.sort(function(a, b) {
          return b.rechargeTime - a.rechargeTime;
        });
      }
    },
    onTransferUser(item) {
      //选中转移客户

      this.transferInfo.userId = item.userId;
      this.transferInfo.userName = item.userName;
      this.getUserInfo();
    },
    showTransferDialog() {
      //显示转移对话框
      this.isTransferShow = true;
    },
    showBatchRecharge() {
      //显示批量充值对话框
      this.isBatchRecharge = true;
    },

    showRecharge(item) {
      // console.log("chafaf");
      //显示充值对话框
      this.isRechargeDialog = true;
      setTimeout(() => {
        this.app.$emit("show-card-tab", {
          card: item,
          package: this.getPackage(item.packageId),
          packageList: this.packageList
        });
      }, 50);
    },
    colseRechargeCard() {
      //关闭对话框清空数据
      this.isRechargeDialog = false;
    },
    closeTransferDialog() {
      //关闭对话框清空数据
      this.transferInfo = {
        userId: "",
        userName: "",
        cardType: 0,
        cardNum: 0,
        note: ""
      };
    },
    colseBatchRecharge() {
      //关闭对话框清空数据
      this.batchRecharge = {
        packageId: 1,
        deviceImei: "",
        list: []
      };
    },

    changeTab(e) {
      console.log(e);
      //改变tab对应的数据表格
      this.page.current = 1;
      this.selectTab = e;
      // this.selectTab = e.index
      if (this.selectTab < "3") {
        this.loadRecharge();
      } else {
        this.loadTransfer();
      }
    },
    loadRecharge() {
      //加载充值数据表
      var data = {
        userId: this.rootUser.userId,
        pageNum: this.page.current,
        pageSize: this.page.pageSize
      };
      switch (this.selectTab) {
        case "0":
          if (
            this.selectState !== "" &&
            this.selectState !== undefined &&
            this.selectState !== null
          ) {
            data.cardStatus = this.selectState;
          }
          if (this.selectVal) {
            data.packageId = this.selectVal;
          }

          break;
        case "2":
          data.cardStatus = 1;
          if (this.deviceImei) {
            data.deviceImei = this.deviceImei;
          }

          break;
        case "1":
          data.cardStatus = 1;
          // data.rechargeStartTime = new Date(this.rechargeFrom + " 00:00:00").getTime();
          // data.rechargeEndTime = new Date(this.rechargeTo + " 23:59:59").getTime();
          data.rechargeStartTime = new Date(
            new Date(this.rechargeFrom).format("yyyy-MM-dd") + " 00:00:00"
          ).getTime();
          data.rechargeEndTime = new Date(
            new Date(this.rechargeTo).format("yyyy-MM-dd") + " 23:59:59"
          ).getTime();
          break;
      }
      if (this.isExport) {
        data.pageSize = 100000000;
      }
      //
      loadRechargeCardStorge(data).then(res => {
        if (res.errCode == "200") {
          if (this.isExport) {
            this.exportRechargeTable(res.data.list);
          } else {
            this.isExport = false;
            this.rechargeList = res.data.list;
            for (var i = 0; i < this.rechargeList.length; i++) {
              if (this.rechargeList[i].remark) {
                if (
                  this.rechargeList[i].remark == "undefined" ||
                  this.rechargeList[i].remark == "null"
                ) {
                  this.rechargeList[i].remark = "";
                }
              }
            }
            // console.log(this.$praseStrEmpty(this.rechargeList.remark))
            this.page.num = Math.ceil(res.data.total / this.page.pageSize);
            this.page.total = res.data.total;
            this.onOrderType();
          }
        }
      });
    },
    loadTransfer(tag) {
      // console.log(tag);
      //加载转移记录
      var data = {
        userId: this.rootUser.userId,
        // shiftStartTime: new Date(this.transferFrom + " 00:00:00").getTime(),
        // shiftEndTime: new Date(this.transferTo + " 23:59:59").getTime(),
        shiftStartTime: new Date(
          new Date(this.transferFrom).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime(),
        shiftEndTime: new Date(
          new Date(this.transferTo).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime(),
        pageNum: this.page.current,
        pageSize: this.page.pageSize
      };
      if (tag) {
        data.pageSize = 100000000;
      }
      loadDeviceTransferList(data).then(res => {
        if (res.errCode == "200") {
          if (tag) {
            this.exportTransferTable(res.data.list);
          } else {
            this.transferList = res.data.list;
            this.page.num = Math.ceil(res.data.list.total / this.page.pageSize);
            this.page.total = res.data.total;
          }
        }
      });
    },

    addDevice(item) {
      // console.log(item);
      //添加批量充值设备
      // 2021-2-26 判断设备充值类型和充值卡类型是否匹配 start
      if (
        item.item.refillType == this.deviceType ||
        (item.item.refillType == 4 &&
          (this.batchRecharge.packageId == 1 ||
            this.batchRecharge.packageId == 3))
      ) {
        var str = "";
        if (!item.item.iccid_no) {
          str = str + this.$t("rechargeMy.noICCIDTip");
        }
        if (
          new Date(item.item.platformExpire).getTime() >=
          new Date("2037-01-01 00:00").getTime()
        ) {
          str = str
            ? str + "\n" + this.$t("rechargeMy.deviceLifelong")
            : this.$t("rechargeMy.deviceLifelong");
        }
        if (item.item.refillType == 4) {
          str = "";
        }
        // console.log("1");
      } else {
        // console.log("2");
        if (this.deviceType == 0 && item.item.refillType != 4) {
          var deviceTips = this.$t("rechargeMy.deviceTips");
        } else if (this.deviceType == 1 && item.item.refillType != 4) {
          deviceTips = this.$t("rechargeMy.deviceTips1");
        } else if (this.deviceType == 2 && item.item.refillType != 4) {
          deviceTips = this.$t("rechargeMy.deviceTips2");
        } else if (this.deviceType == 3 && item.item.refillType != 4) {
          deviceTips = this.$t("rechargeMy.deviceTips3");
        } else if (item.item.refillType == 4) {
          deviceTips = this.$t("rechargeMy.kEight");
        }
        this.app.$emit("show-confirm-msg", deviceTips, () => {
          this.isBatch = false;
        });
      }

      for (var i = 0; i < this.batchRecharge.list.length; i++) {
        //避免重复添加
        if (this.batchRecharge.list[i].deviceImei == item.deviceImei) {
          return;
        }
      }

      item.item.note = str;
      this.batchRecharge.list.push(item.item);
    },
    delDevice(idx) {
      //删除批量充值设备
      this.batchRecharge.list.splice(idx, 1);
    },
    dealDevItem(item) {
      //充值设备条件
      this.deviceImei = item.deviceImei;
    },
    onTransferCard() {
      //转移充值卡
      if (
        this.transferInfo.cardNum > this.getLeftNum(this.transferInfo.cardType)
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.transferNumOver"));
        return;
      }

      if (this.transferInfo.cardNum >= 1 && this.transferInfo.userId) {
        var data = {
          targetUserId: this.transferInfo.userId,
          cardType: this.transferInfo.cardType,
          cardNum: this.transferInfo.cardNum,
          remark: this.transferInfo.note
        };
        doTransferCard(data).then(res => {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("rechargeMy.transferOk"));

            this.refreshData();
            this.isTransferShow = false;
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargeMy.transferFail") +
                (res.errMsg ? ":" + res.errMsg : "")
            );
          }
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.transferInfoTip"));
      }
    },
    onBatchRecharge() {
      //批量充值
      if (
        this.batchRecharge.list.length >
        this.getLeftNum(this.batchRecharge.packageId)
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.rechargeNumOver"));
        return;
      }
      if (this.batchRecharge.list.length == 0) {
        return;
      }

      var list = [];
      for (var i = 0; i < this.batchRecharge.list.length; i++) {
        list.push(this.batchRecharge.list[i].deviceImei);
      }

      const data = {
        packageId: this.batchRecharge.packageId,
        deviceImeiArray: list.join(",")
      };
      // console.log(data);
      doBatchRechargeCard(data).then(res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeMy.batchRechargeOk")
          );
          this.refreshData();
          this.isBatchRecharge = false;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeMy.batchRechargeFail") +
              (res.errMsg ? ":" + res.errMsg : "")
          );
        }
      });
    },

    getCardNum() {
      //获取剩余充值卡
      loadCardNumber({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == "200") {
          console.log(res.data);
          if (this.isEmptyObject(res.data)) return;
          var list = res.data.cardNumStr.split(";");
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
            resultList[i].num = num;
            resultList[i].enable = enable;
          }
          this.packageList = resultList;
        }
      });
    },
    getOriginPrice() {
      // 拿到原始的充值卡类型
      loadOriginCardPrice().then(res => {
        if (res.errCode == "200") {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            let {
              cardId,
              cardName,
              mainPrice,
              isDataFee,
              isPlatfromFee,
              type
            } = res.data[i];
            list.push({
              packageId: cardId,
              text: cardName,
              price: parseInt(mainPrice) * 0.01,
              enable: false,
              isDataFee: isDataFee,
              isPlatfromFee: isPlatfromFee,
              num: 0,
              type: type
            });
          }

          this.packageList = list;
          this.getCardNum();
        }
      });
    },
    refreshData() {
      if (this.selectTab < "3") {
        this.loadRecharge();
      } else {
        this.loadTransfer();
      }
      this.getOriginPrice();
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>

<style lang="scss" scoped>
.recharge-my-content {
  height: calc(100% - -60px);
  // height: 100%;
}
.card-header-my {
  margin-top: 10px;
}
.zhang-card {
  font-weight: bold;
}
.num-card {
  margin: 0 10px;
  display: inline-block;
  font-size: 36px;
  color: #3f47f4;
}
.top-card-show {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  .card-show-item {
    font-weight: bold;
    width: 250px;
    padding: 6px 20px;
    display: flex;
    justify-content: space-between;
    background: #f8e4bb;
    white-space: nowrap;
    border-radius: 3px;
  }
  .card-name {
    display: flex;
    align-items: center;
  }
}
.ul-tab-bar {
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    background: #c0eaff;
    display: inline-block;
    cursor: pointer;
    width: 140px;
    text-align: center;
    padding: 8px;
    border-radius: 3px;
    margin-right: 10px;
  }
}
@media screen and (max-width: 1400px) {
  .top-card-show {
    .card-show-item {
      width: 238px;
    }
  }
}
</style>
