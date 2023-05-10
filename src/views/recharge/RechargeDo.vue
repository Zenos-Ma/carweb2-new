<template>
  <div class="form-card1 layout-container">
    <div
      class="card-header"
      style="display: flex; justify-content: space-between; align-items: ceneter"
    >
      <div class="left-title">
        {{ $t("rechargeDo.todoList") }}
      </div>
      <!--待执行清单操作 start-->
      <div class="left-right-box" style="line-height: 30px">
        <el-button
          class="btn-primary-button"
          @click="loadWaitList"
          style="margin-right: 10px !important"
          >{{ $t("common.refresh") }}</el-button
        >
        <el-button class="btn-primary-button" @click="auditCharge(0)">{{
          $t("rechargeDo.auditPage")
        }}</el-button>
      </div>
      <!--待执行清单操作 end-->
    </div>

    <div class="card-body">
      <!--待执行清单表格-->
      <div style="height: 100%; overflow-x: auto; overflow-y: hidden">
        <data-table
          style="min-width: 900px"
          :data="rechargeList"
          :page="page"
          @getTableDate="loadWaitList"
        >
          <!--  -->
          <el-table-column
            :label="$t('recharge.externalId')"
            prop="externalId"
            min-width="120"
          ></el-table-column>
          <el-table-column :label="$t('common.deviceImei')" min-width="120">
            <template slot-scope="props">
              <a @click="showDevice(props.row)">{{ props.row.deviceImei }}</a>
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.dealer')" min-width="120">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.row, props.$index, 'chargeDealer')"
                >{{ props.row.userName ? props.row.userName : "--" }}</a
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.series')" min-width="100">
            <template slot-scope="props">
              {{ props.row.goodsName ? props.row.goodsName : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.price')" min-width="80">
            <template slot-scope="props">
              {{ props.row.price ? (props.row.price * 0.01).toFixed(2) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.payWay')" min-width="100">
            <template slot-scope="props">
              {{ payWay_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('recharge.orderTime')" min-width="130">
            <template slot-scope="props">
              {{ props.row.createTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.status')" min-width="80">
            <template slot-scope="props">
              {{ billStatus_cn(props.row) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.status')"
            min-width="180"
            fixed="right"
          >
            <template slot-scope="props">
              <el-button
                type="primary"
                size="small"
                @click="dealTableOp(props.row, props.$index, 'chargeAudit')"
                >{{ $t("recharge.audit") }}</el-button
              >
              <el-button
                type="success"
                size="small"
                @click="
                  dealTableOp(props.row, props.$index, 'chargeForceOrder')
                "
                >{{ $t("rechargeDo.forceOrder") }}</el-button
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
    <relation-dialog></relation-dialog>
    <!-- <dev-detail-dialog></dev-detail-dialog> -->
  </div>
</template>

<script>
import RelationDialog from "@/components/relationDialog/RelationDialog.vue";
// import DevDetailDialog from "@/components/page/DevDetailDialog";
import {
  dealAuditRecharge,
  loadWaitDeviceList,
  doForceFinish
} from "@/api/recharge.js";
export default {
  name: "RechargeDo",
  components: {
    "relation-dialog": RelationDialog
    // "dev-detail-dialog": DevDetailDialog,
  },
  data: () => ({
    //表格数据
    rechargeList: [], //分页器
    page: {
      name: "rechargeList",
      current: 1,
      pageSize: 30,
      num: 1,
      total: 0
    }
  }),
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
    billStatus_cn(item) {
      //获取订单状态
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

    auditCharge(idx) {
      //迭代处理当前页的订单
      var that = this;
      if (idx >= this.rechargeList.length) {
        this.app.$emit("show-alert-msg", this.$t("recharge.auditSuccess"));

        this.page.current = 1;
        this.loadWaitList();
        return;
      }
      var extId = this.rechargeList[idx].externalId;
      var imei = this.rechargeList[idx].deviceImei;
      const data = {
        extId: extId,
        deviceImei: imei
      };
      dealAuditRecharge(data).then(res => {
        if (res.errCode == "200") {
          this.auditCharge(idx + 1);
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("recharge.auditFail") + "：" + res.errMsg
          );
        }
      });
    },
    showDevice(item) {
      this.app.$emit("show-device-dialog", {
        imei: item.deviceImei
      });
    },
    loadWaitList() {
      //获取待处理清单
      const data = {
        page: this.page.current,
        pageSize: this.page.limit,
        status: 1
      };
      loadWaitDeviceList(data).then(res => {
        if (res.errCode == "200") {
          this.page.num = res.data.pageCount;
          this.rechargeList = res.data.queue;
        }
      });
    },
    dealTableOp(item, idx, name) {
      //处理表格操作
      var that = this;
      if (name == "chargeDev") {
        //设备号
        this.app.$emit("show-dev-detail-dialog", {
          name: "DevDetailDialog",
          imei: item.deviceImei
        });
      } else if (name == "chargeDealer") {
        //直接经销商
        this.app.$emit("show-relation-dialog", {
          name: "RelationDialog",
          imei: item.deviceImei
        });
      } else if (name == "chargeAudit") {
        //审核
        let data = {
          extId: item.externalId,
          deviceImei: item.deviceImei
        };
        dealAuditRecharge(data).then(res => {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("recharge.auditSuccess"));
            this.loadWaitList();
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("recharge.auditFail") + "：" + res.errMsg
            );
          }
        });
      } else if (name == "chargeForceOrder") {
        //强制结单
        const data = {
          extId: item.externalId,
          deviceImei: item.deviceImei
        };
        doForceFinish(data).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("rechargeDo.forceAuditOk")
            );

            that.loadWaitList();
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("recharge.auditFail") + "：" + res.errMsg
            );
          }
        });
      }
    },

    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    this.loadWaitList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style></style>
