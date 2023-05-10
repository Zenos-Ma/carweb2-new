<template>
  <div class="recharge-porfit layout-container">
    <!-- <div class="card-header">
      {{ $t("rechargeBill.profitSearch") }}
      <i class="iconfont icon-chart" style="color: #0095ec" @click="jumpRechargeChart"></i>
    </div> -->
    <div class="form-card1 body-content-left">
      <div class="card-header">{{ $t("common.myCustomer") }}</div>
      <div class="card-body2">
        <user-tree
          tree-name="profit"
          :user-id.sync="userId"
          @usertree-select="onSelectUser"
        ></user-tree>
      </div>
    </div>

    <div class="form-card1 body-content-right">
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <div class="left">
          {{ $t("rechargeBill.profitSearch") }}
          <i
            class="iconfont icon-jiankong"
            style="color: #0095ec"
            @click="jumpRechargeChart"
          ></i>
          <span style="color: red">{{ userName }}</span>
        </div>
        <div class="right">
          <el-button
            class="btn-primary-button"
            size="small"
            v-show="userId == userId1"
            @click="showRechargeAccountDialog"
            >{{ $t("rechargeBill.rechargeManage") }}</el-button
          >
          <el-button
            class="btn-primary-button"
            size="small"
            @click="showFlowRecord"
            >{{ $t("withdraw.flowRecord") }}</el-button
          >
        </div>
      </div>
      <!-- 查询用户统计的利润表格 start -->
      <div class="card-body" style="overflow: scroll">
        <table class="form-table" style="width: 100%">
          <tr>
            <td>{{ $t("alarm.timeSetting") }}:</td>
            <td colspan="4" style="text-align: left; white-space: nowrap">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 5px"
                v-for="(item, idx) in $t('alarm.range')"
                :key="'timerange' + idx"
                @click="setTimeRange(item.name)"
                >{{ item.text }}</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="isTimeRangeBox = true"
                >{{ $t("datePicker.selectTimeRange") }}</el-button
              >
              <time-range
                :is-show.sync="isTimeRangeBox"
                @select-range="onTimeRange"
              ></time-range>
            </td>
          </tr>
          <tr>
            <td>{{ $t("common.startTime") }}:</td>
            <td>
              <el-date-picker
                v-model="startDate"
                @change="changeTime"
                type="date"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </td>
            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <el-date-picker
                v-model="endDate"
                @change="changeTime"
                type="date"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </td>
            <td>{{ $t("rechargePrice.rechargeType") }}:</td>
            <td>
              <el-select
                v-model="goodsType"
                style="width: 120px"
                @change="rechargeGoodsTypeChange($event)"
              >
                <el-option
                  v-for="(item, idx) in rechargeGoodsTypeList"
                  :key="idx"
                  :value="item.num"
                  :label="item.name"
                ></el-option>
              </el-select>
            </td>
          </tr>
          <tr>
            <td colspan="6" style="text-align: right; font-size: 12px">
              <el-checkbox v-model="isChild">{{
                $t("common.containChild")
              }}</el-checkbox>
              <el-button type="primary" @click="loadSearch">{{
                $t("common.search")
              }}</el-button>
            </td>
          </tr>
        </table>

        <div class="summary-profit-content">
          <data-table
            :data="summaryProfitList"
            :page="page1"
            :page-count="page1.num"
          >
            <el-table-column
              v-if="isChild && isShowChild"
              width="140"
              :label="$t('common.userName')"
              prop="userName"
            ></el-table-column>
            <el-table-column
              v-if="!isChild && !isShowChild"
              width="140"
              :label="$t('deviceList.time')"
              prop="summaryDate"
            ></el-table-column>
            <el-table-column width="120" :label="$t('recharge.costPrice')">
              <template slot-scope="props">
                {{
                  props.row.costPrice
                    ? (props.row.costPrice * 0.01).toFixed(2)
                    : 0
                }}
              </template>
            </el-table-column>
            <el-table-column width="130" :label="$t('recharge.price') + '(￥)'">
              <template slot-scope="props">
                {{
                  props.row.sellPrice
                    ? (props.row.sellPrice * 0.01).toFixed(2)
                    : 0
                }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              :label="$t('rechargeBill.profit') + '(￥)'"
            >
              <template slot-scope="props">
                {{
                  props.row.profit ? (props.row.profit * 0.01).toFixed(2) : 0
                }}
              </template>
            </el-table-column>
            <el-table-column style="flex: 1" :label="$t('common.operation')">
              <template slot-scope="props">
                <el-button
                  size="small"
                  class="primary-btn-table-shadow"
                  @click="showLoadDetailProfit(props.row)"
                  >{{ $t("common.detail") }}</el-button
                >
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>

    <!-- end -->
    <!-- 查订单详情表格 start -->
    <dialog-comp
      :visible.sync="showDetailProfit"
      :dialog-title="$t('rechargeBill.withdrawTitle')"
      :dialog-width="980"
      icon-window="icon-zanwuchongzhijilu"
    >
      <div class="table-content-list">
        <table class="form-table" style="width: 100%">
          <tr>
            <td>{{ $t("common.startTime") }}:</td>
            <td>
              <el-date-picker
                v-model="timeFrom"
                type="date"
                style="width: 150px"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </td>

            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <el-date-picker
                v-model="timeTo"
                type="date"
                style="width: 150px"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
            <td>
              <el-button type="primary" @click="exportTable">{{
                $t("common.export")
              }}</el-button>
            </td>
            <td>
              <el-button type="primary" @click="exportTable('all')">{{
                $t("common.exportAll")
              }}</el-button>
            </td>
          </tr>
          <tr style="white-space: nowrap">
            <td>
              {{ $t("rechargeBill.searchWay") }}:{{
                $t("recharge.externalId")
              }}:
            </td>
            <td>
              <el-input style="width: 150px" v-model="externalId" />
            </td>
            <td>{{ $t("common.userName") }}:</td>
            <td>
              <el-input
                style="width: 150px"
                v-model="userName"
                @keyup.enter.native="searchUser"
                :placeholder="$t('common.searchUserTip')"
              />
              <el-button type="primary" @click="searchUser">{{
                $t("common.search")
              }}</el-button>
              <user-box
                bname="RechargeProfit"
                :is-show.sync="isUserBox"
                :search-key="userName"
                @select-result="dealUserItem"
              ></user-box>
            </td>
            <td>{{ $t("common.deviceImei") }}:</td>
            <td>
              <el-input
                style="width: 150px"
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
              <el-checkbox v-model="errOnly">{{
                $t("rechargeBill.searchTip")
              }}</el-checkbox>
              <el-button type="primary" @click="searchProfitList">{{
                $t("common.search")
              }}</el-button>
            </td>
          </tr>
        </table>

        <!--订单表格-->
        <data-table
          style="height: calc(100% - 115px)"
          :data="profitList"
          :page="page"
          @getTableData="loadProfitList"
          :page-count="page.num"
          :show-selection="true"
          @selection-change="handleSelectionChange"
        >
          <!--  -->
          <el-table-column
            :label="$t('recharge.externalId')"
            prop="externalId"
            width="140"
          ></el-table-column>
          <el-table-column :label="$t('common.deviceImei')" width="150">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.row, props.$index, 'profitDevice')"
                >{{ props.row.deviceImei }}</a
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.dealer')" width="140">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.row, props.$index, 'profitSeller')"
                >{{ props.row.userName ? props.row.userName : "--" }}</a
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.series')" width="160">
            <template slot-scope="props">
              {{ props.row.goodsName ? props.row.goodsName : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.costPrice')" width="100">
            <template slot-scope="props">
              {{
                props.row.costPrice
                  ? (props.row.costPrice * 0.01).toFixed(2)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.price')" width="100">
            <template slot-scope="props">
              {{
                props.row.sellPrice
                  ? (props.row.sellPrice * 0.01).toFixed(2)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('rechargeBill.profit')" width="100">
            <template slot-scope="props">
              {{
                props.row.sellPrice &&
                props.row.costPrice &&
                props.row.sellPrice - props.row.costPrice > 0
                  ? (
                      (props.row.sellPrice - props.row.costPrice) *
                      0.01
                    ).toFixed(2)
                  : 0
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.payWay')" width="100">
            <template slot-scope="props">
              {{ payWay_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column width="160" :label="$t('recharge.orderTime')">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
        </data-table>
      </div>
    </dialog-comp>

    <relation-dialog></relation-dialog>
    <dev-detail-dialog></dev-detail-dialog>
    <recharge-account-dialog></recharge-account-dialog>
    <withdrawal-dialog></withdrawal-dialog>
    <flow-record></flow-record>
  </div>
</template>

<script src="./js/rechargeProfit.js"></script>

<style scoped>
.recharge-porfit {
  /* height: calc(100% - 2px); */
  display: flex;
  flex-direction: row;
}
.summary-profit-content {
  height: calc(100% - 112px);
}
.table-content-list {
  height: 600px;
}
.user-name-style {
  margin-left: 5px;
  color: red;
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}
</style>
