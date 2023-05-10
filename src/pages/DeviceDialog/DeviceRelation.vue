<template>
  <div style="padding: 0 8px; overflow-x: hidden; overflow-y: hidden; height: 100%">
    <!--设备信息-->
    <div class="content-header">{{ $t("deviceDetail.deviceInfo") }}</div>
    <!-- 2022-4-7 start -->
    <div>
      <data-table :data="deviceInfoTable" :show-page="false" :show-index="false">
        <el-table-column :label="$t('common.deviceName')" prop="name" min-width="120"></el-table-column>
        <el-table-column :label="$t('userDetail.loginNo')" prop="loginNo" min-width="120"></el-table-column>
        <el-table-column :label="$t('common.deviceImei')" prop="deviceImei" min-width="120"></el-table-column>
        <el-table-column :label="$t('common.carNo')" prop="plateNumber" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="props">
            <a @click="dealTableOption(props.row, props.$index, 'devMonitor')">{{ $t("common.monitor") }}</a>
            <a @click="dealTableOption(props.row, props.$index, 'devResetPwd')">{{ $t("customer.resetPwd") }}</a>
          </template>
        </el-table-column>
      </data-table>
    </div>
    <div class="content-header">{{ $t("common.owner") }}</div>
    <div style="height: 350px">
      <data-table :data="relationTable" :show-page="false" :show-index="false">
        <el-table-column :label="$t('common.userName')" prop="userName" min-width="120"></el-table-column>
        <el-table-column :label="$t('userDetail.loginNo')" prop="loginNo" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.linkman')" prop="linkman" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.phone')" prop="tel" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="props">
            <a @click="dealTableOption(props.row, props.$index, 'devRelateMonitor')">{{ $t("common.monitor") }}</a>
            <a @click="dealTableOption(props.row, props.$index, 'devRelateResetPwd')">{{ $t("customer.resetPwd") }}</a>
          </template>
        </el-table-column>
      </data-table>
    </div>
    <!-- 2022-4-7 end -->
    <!--设备所属用户关系-->
  </div>
</template>

<script>
  import { loadDeviceRelation, resetPwd, resetDevPwd } from "@/api/common.js";
  export default {
    name: "DeviceRelation",
    props: {
      dname: {
        type: String,
        default: "",
      },
    },
    components: {},
    data: () => ({
      imei: "", //客户关系表格数据
      relationTable: [], //设备关系表格数据
      deviceInfoTable: [],
    }),
    methods: {
      //获取设备  客户关系数据
      loadDeviceRelation() {
        loadDeviceRelation({ deviceImei: this.imei }).then((res) => {
          if (res.errCode == "200") {
            var dev = [];
            dev.push(res.data.d);
            this.deviceInfoTable = dev;
            this.relationTable = res.data.uList;
          }
        });
      },
      //重置密码
      resetDevUserPwd(tag, item) {
        var that = this;
        if (tag == "user") {
          //重置用户密码
          var tip = this.$t("customer.resetPwdTip");
          this.app.$emit("show-confirm-msg", tip.replace("_userName_", item.userName), function () {
            resetPwd({ userId: item.userId }).then((r) => {
              this.app.$emit("show-alert-msg", r.errMsg);
            });
          });
        } else {
          //重置设备密码
          let tip = this.$t("customer.resetPwdTip1");
          this.app.$emit("show-confirm-msg", tip.replace("_deviceImei_", item.deviceImei), function () {
            resetDevPwd({ deviceImei: item.deviceImei }).then((res) => {
              this.app.$emit("show-alert-msg", res.errMsg);
            });
          });
        }
      },
      /**
       * 处理表格操作
       * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
       */ dealTableOption(item, idx, name) {
        if (name == "devRelateMonitor") {
          //设备用户监控
          window.open(window.location.origin + window.location.pathname + "#/monitor/location?userId=" + item.userId);
        } else if (name == "devRelateResetPwd") {
          //用户重置密码
          this.resetDevUserPwd("user", item);
        } else if (name == "devMonitor") {
          //设备监控
          window.open(window.location.origin + window.location.pathname + "#/monitor/location?deviceImei=" + item.deviceImei);
          // console.log("devMonitor", op);
        } else if (name == "devResetPwd") {
          //设备重置密码
          this.resetDevUserPwd("dev", item);
        }
      }, //处理设备详情对话框
      dealDevDialog(imei, dname) {
        this.imei = imei;
        if (this.imei && dname == this.dname) {
          this.loadDeviceRelation();
        }
      },
      listenEvent() {
        this.app.$on("device-dialog", this.dealDevDialog);
        this.app.$on("relation-dialog", this.dealDevDialog);
      }, //listenEvent
      offEvent() {
        this.app.$off("device-dialog", this.dealDevDialog);
        this.app.$off("relation-dialog", this.dealDevDialog);
      },
    },
    mounted() {
      this.listenEvent();
    },
    beforeDestroy() {
      this.offEvent();
    },
  };
</script>
<style lang="scss" scoped>
  .content-header {
    line-height: 40px;
    font-weight: bold;
    padding-left: 10px;
    font-size: 14px;
  }
</style>
