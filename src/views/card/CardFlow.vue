<template>
  <div class="form-card1 card-flow layout-container">
    <div class="card-header">{{ $t("rechargeDo.todoList") }}</div>
    <div class="card-body">
      <!--待执行清单操作 start-->
      <table>
        <tr>
          <td>{{ $t("common.startTime") }}:</td>
          <td>
            <el-date-picker
              v-model="startTime"
              type="date"
              format="yyyy-MM-dd"
              style="width: 150px"
            ></el-date-picker>
          </td>
          <td>{{ $t("common.endTime") }}:</td>
          <td>
            <el-date-picker
              v-model="endTime"
              type="date"
              format="yyyy-MM-dd"
              style="width: 150px"
            ></el-date-picker>
          </td>
          <td>{{ $t("common.status") }}</td>
          <td>
            <!--  -->
            <el-select v-model="selectStatus" style="width: 100px">
              <el-option value="-1" :label="$t('common.all')"></el-option>
              <el-option value="0" :label="$t('card.unAudit')"></el-option>
              <el-option value="1" :label="$t('card.audited')"></el-option>
            </el-select>
          </td>
          <td>
            <el-button type="primary" @click="loadWaitList">
              {{ $t("common.search1") }}
            </el-button>
            <el-button type="primary" @click="exportFlowRecord">
              {{ $t("common.exportAll") }}
            </el-button>
          </td>
        </tr>
      </table>

      <!--待执行清单操作 end-->
      <!--待执行清单表格-->
      <div style="height: calc(100% - 36px)">
        <data-table
          :data="rechargeList"
          :page="page"
          @getTableData="loadWaitList"
        >
          <!--  -->
          <el-table-column
            :label="$t('recharge.externalId')"
            prop="ordersId"
            width="130"
          ></el-table-column>
          <el-table-column :label="$t('card.deviceNum')" width="120">
            <template slot-scope="props">
              {{
                props.row.type == 1 ? $t("card.oneCard") : $t("card.batchCard")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.dealer')" width="100">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.row, props.$index, 'chargeDealer')"
                >{{ props.row.userName ? props.row.userName : "--" }}</a
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('rechargeMy.rechargeType')" width="140">
            <template slot-scope="props">
              {{ getCardType(props.row.cardType) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.orderTime')" width="150">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('rechargePurchase.finishTime')"
            width="150"
          >
            <template slot-scope="props">
              {{
                props.row.orderStatus == 3
                  ? props.row.finishTime
                  : "" | fdatetime
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="100">
            <template slot-scope="props">
              {{
                $t(props.row.orderStatus == 0 ? "card.unAudit" : "card.audited")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" style="flex: 1">
            <template slot-scope="props">
              <el-button
                class="primary-btn-table-shadow"
                size="small"
                @click="onShowBillDevice(props.row)"
              >
                {{ $t("common.detail") }}
              </el-button>
              <el-button
                class="primary-btn-table-shadow-green"
                size="small"
                @click="onForceAudit(props.row)"
                v-show="props.row.orderStatus == 0"
              >
                {{ $t("rechargeDo.forceOrder") }}
              </el-button>
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
    <relation-dialog></relation-dialog>
    <dev-detail-dialog></dev-detail-dialog>
    <dialog-comp
      :visible.sync="isDeviceDialog"
      :dialog-title="$t('card.flowAudit')"
      :dialog-width="800"
      icon-window="icon-SQLshenhe"
    >
      <div style="text-align: right; margin-bottom: 5px">
        <el-button type="primary" size="small" @click="auditCharge(0)">
          {{ $t("rechargeDo.auditPage") }}
        </el-button>
      </div>
      <div style="height: 500px">
        <data-table
          :data="deviceList"
          :page="page1"
          @getTableData="loadWaitList"
        >
          <!--  -->
          <el-table-column :label="$t('common.deviceImei')" width="150">
            <template slot-scope="props">
              <a @click="showDevice(props.row)">{{ props.row.deviceImei }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('card.isFlow')" width="80">
            <template slot-scope="props">
              {{
                props.row.isData == 1
                  ? $t("deviceDetail.yes")
                  : $t("deviceDetail.no")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('card.isPlat')" width="80">
            <template slot-scope="props">
              {{
                props.row.isPlat == 1
                  ? $t("deviceDetail.yes")
                  : $t("deviceDetail.no")
              }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('rechargeMy.cardNo')"
            width="200"
            prop="rechargeCardNum"
          ></el-table-column>
          <el-table-column :label="$t('rechargeMy.beforeRecharge')" width="100">
            <template slot-scope="props">
              {{ props.row.dataOrigin | fdate }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('rechargeMy.afterRecharge')" width="100">
            <template slot-scope="props">
              {{
                props.row.dataOrigin && props.row.dataTarget
                  ? props.row.dataTarget
                  : getDataAfter(props.row) | fdate
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" width="100">
            <template slot-scope="props">
              {{ billStatus_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            width="180"
            fixed="right"
          >
            <template slot-scope="props">
              <el-button
                type="primary"
                size="small"
                @click="onDeviceAudit(props.row)"
                v-show="props.row.orderStatus == 1"
              >
                {{ $t("recharge.audit") }}
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="onDeviceForce(props.row)"
                v-show="props.row.orderStatus == 1"
              >
                {{ $t("rechargeDo.forceOrder") }}
              </el-button>
            </template>
          </el-table-column>
        </data-table>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import RelationDialog from "@/components/relationDialog/RelationDialog";
import DevDetailDialog from "@/components/devDetailDialog/DevDetailDialog";
import ExportUtil from "@/utils/exportUtil.js";
import {
  doForceFlowAudit,
  doExportRecord,
  doForceCardFlow,
  doAuditCardFlow,
  loadCardFlowDevice,
  loadOriginCardPrice,
  loadWaitListInfo
} from "@/api/card.js";
export default {
  name: "CardFlow",
  components: {
    "relation-dialog": RelationDialog,
    "dev-detail-dialog": DevDetailDialog
  },
  data: () => ({
    rechargeList: [], //表格数据
    page: {
      //分页器
      name: "rechargeList",
      current: 1,
      pageSize: 30,
      num: 1,
      total: 0
    },
    isDeviceDialog: false,
    page1: {
      name: "rechargeList1",
      current: 1,
      pageSize: 20,
      num: 1,
      total: 0
    },
    deviceList: [],
    startTime: "2000-01-01",
    endTime: new Date(),
    selectStatus: "-1",
    selectBill: {},
    packageList: []
  }),
  methods: {
    dealTableOp(item, idx, name) {
      //console.log(op);
      this.app.$emit("show-user-dialog", {
        name: "UserDialog",
        userId: item.userId,
        userName: item.userName
      });
    },
    onForceAudit(item) {
      //强制审核订单
      doForceFlowAudit({ ordersId: item.ordersId }).then(res => {
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("rechargeDo.forceAuditOk"));
          this.loadWaitList();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("recharge.auditFail") + (res.errMsg ? ":" + res.errMsg : "")
          );
        }
      });
    },
    exportFlowRecord() {
      //导出流量审核记录
      doExportRecord().then(res => {
        if (res.errCode == "200") {
          var title = [
            this.$t("rechargePurchase.orderNo"),
            this.$t("common.deviceImei"),
            this.$t("card.isFlow"),
            this.$t("card.isPlat"),
            this.$t("rechargeMy.cardNo"),
            this.$t("rechargeMy.beforeRecharge"),
            this.$t("rechargeMy.afterRecharge"),
            this.$t("common.status")
          ];
          var list = [];
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i];
            list.push([
              item.ordersId,
              item.deviceImei,
              item.isData == 1
                ? this.$t("deviceDetail.yes")
                : this.$t("deviceDetail.no"),
              item.isPlat == 1
                ? this.$t("deviceDetail.yes")
                : this.$t("deviceDetail.no"),
              item.rechargeCardNum,
              item.dataOrigin
                ? new Date(item.dataOrigin).format("yyyy-MM-dd")
                : "--",
              item.dataOrigin && item.dataTarget
                ? new Date(item.dataTarget).format("yyyy-MM-dd")
                : this.getDataAfter(item),
              this.billStatus_cn(item)
              // item.orderStatus == 0 ? this.$t("card.unAudit") : this.$t("card.audited"),
            ]);
          }
          ExportUtil.exportTable(title, list, "流量充值审核记录");
        }
      });
    },
    getCardType(packageId) {
      //充值卡类型
      for (let i = 0; i < this.packageList.length; i++) {
        if (packageId == this.packageList[i].packageId) {
          return this.packageList[i].text;
        }
      }
      return "";
    },
    getDataAfter(item) {
      return item.dataOrigin &&
        new Date(item.dataOrigin).getTime() > new Date().getTime()
        ? new Date(
            new Date(item.dataOrigin).getTime() + 365 * 24 * 3600000
          ).format("yyyy-MM-dd")
        : "--";
    },
    onDeviceForce(item) {
      //强制审核流量
      const data = {
        orderId: item.ordersId,
        deviceImei: item.deviceImei
      };
      doForceCardFlow(data).then(res => {
        if (res.errCode == "200") {
          this.loadWaitList();
          this.loadBillDevice();
          this.app.$emit("show-alert-msg", this.$t("rechargeDo.forceAuditOk"));
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("recharge.auditFail") + (res.errMsg ? ":" + res.errMsg : "")
          );
        }
      });
    },
    onDeviceAudit(item) {
      //审核流量
      const data = {
        orderId: item.ordersId,
        deviceImei: item.deviceImei
      };
      doAuditCardFlow(data).then(res => {
        if (res.errCode == "200") {
          this.loadWaitList();
          this.loadBillDevice();
          this.app.$emit("show-alert-msg", this.$t("recharge.auditSuccess"));
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("recharge.auditFail") + (res.errMsg ? ":" + res.errMsg : "")
          );
        }
      });
    },
    onShowBillDevice(item) {
      //显示订单详情对话框
      this.page1.current = 1;
      this.selectBill = item;
      this.loadBillDevice(item);
      this.isDeviceDialog = true;
    },
    loadBillDevice() {
      //加载订单的充值流量的设备
      const data = {
        orderId: this.selectBill.ordersId,
        pageNum: this.page1.current,
        pageSize: this.page1.pageSize
      };
      loadCardFlowDevice(data).then(res => {
        if (res.errCode == "200") {
          this.page1.num = Math.ceil(res.data.total / this.page1.pageSize);
          this.deviceList = res.data.list;
          this.page1.total = res.data.total;
        }
      });
    },

    billStatus_cn(item) {
      console.log(item);
      //获取订单状态
      for (var i = 0; i < this.$t("card.orderStatus").length; i++) {
        var ii = this.$t("card.orderStatus[" + i + "]");
        if (ii.val == item.orderStatus) {
          return ii.text;
        }
      }
    },

    auditCharge(idx) {
      //迭代处理当前页的订单
      if (idx >= this.deviceList.length) {
        this.app.$emit("show-alert-msg", this.$t("recharge.auditSuccess"));
        this.page.current = 1;
        this.loadWaitList();
        this.loadBillDevice();
        return;
      }
      var item = this.deviceList[idx];
      if (item.orderStatus == 1) {
        const data = {
          orderId: item.ordersId,
          deviceImei: item.deviceImei
        };
        doAuditCardFlow(data).then(res => {
          if (res.errCode == "200") {
            this.auditCharge(idx + 1);
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("recharge.auditFail") +
                "【" +
                idx +
                "】" +
                (res.errMsg ? ":" + res.errMsg : "")
            );
          }
        });
      } else {
        this.auditCharge(idx + 1);
      }
    },
    loadWaitList() {
      //获取待处理清单
      var data = {
        pageSize: this.page.pageSize,
        pageNum: this.page.current,
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime(),
        orderStatus: this.selectStatus
      };
      loadWaitListInfo(data).then(res => {
        if (res.errCode == "200") {
          this.rechargeList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
        }
      });
    },
    showDevice(item) {
      this.app.$emit("show-device-dialog", {
        imei: item.deviceImei
      });
    },
    onCardFlow() {
      this.selectStatus = "0";
      this.loadWaitList();
    },
    listenEvent() {
      this.app.$on("card-flow", this.onCardFlow);
    },
    offEvent() {
      this.app.$off("card-flow", this.onCardFlow);
    },
    getOriginPrice() {
      loadOriginCardPrice().then(res => {
        if (res.errCode == "200") {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            let { cardId, cardName } = res.data[i];
            list.push({
              packageId: cardId,
              text: cardName
            });
          }
          this.packageList = list;
        }
      });
    }
  },
  mounted() {
    this.getOriginPrice();
    this.listenEvent();
    this.loadWaitList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style></style>
