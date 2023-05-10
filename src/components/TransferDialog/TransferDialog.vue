<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('batchTransfer.quickTransfer')"
    :dialog-width="420"
    icon-window="icon-jiaohuan"
  >
    <div style="text-align: center">
      <!--转移设备表单 start-->
      <table style="margin: 0 auto" class="form-table">
        <tr>
          <td>
            <font class="require-icon">*</font>
            {{ $t("batchTransfer.transferTo") }}:
          </td>
          <td>
            <el-input
              style="width: 180px"
              v-model="userName"
              @keyup.enter="searchUser"
              :placeholder="$t('common.searchUserTip')"
            />
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="TransferDialog"
              :is-show.sync="isUserBox"
              :search-key="userName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td>
            <el-input
              style="width: 180px"
              v-model="deviceImei"
              :placeholder="$t('common.searchDevTip')"
            />
            <el-button type="primary" @click="searchDev">{{
              $t("common.search")
            }}</el-button>
            <device-box
              box-type="sell"
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.simNo") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="deviceSim" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.note") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="note" />
          </td>
        </tr>
      </table>

      <el-button type="primary" @click="doTransfer" style="width: 80px">{{
        $t("common.submit")
      }}</el-button>
      <!--转移设备表单 end-->
    </div>
  </dialog-comp>
</template>

<script>
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import { quickTransferDev } from "@/api/customer.js";
export default {
  name: "TransferDialog",
  props: {},
  components: {
    "user-box": UserBox,
    "device-box": DeviceBox
  },
  data: () => ({
    isShow: false,
    deviceImei: "", //设备号
    deviceSim: "", //sim卡号
    note: "", //备注
    userId: "", //转移用户
    userName: "", //
    isUserBox: false,
    isDeviceBox: false
  }),
  watch: {
    userName() {
      if (!this.userName) {
        this.userId = "";
      }
    },
    deviceImei() {
      if (!this.deviceImei) {
        this.deviceImei = "";
        this.deviceSim = "";
        this.note = "";
        this.isDeviceBox = false;
      }
    }
  },
  methods: {
    doTransfer() {
      //开始转移设备
      if (!this.userId) {
        this.app.$emit("show-alert-msg", this.$t("batchTransfer.transferTip"));
        return;
      }

      if (!this.deviceImei) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("batchTransfer.transferDevTip")
        );
        return;
      }
      var data = {
        toUserId: this.userId,
        remark: this.note,
        deviceImei: this.deviceImei,
        deviceSim: this.deviceSim
      };
      quickTransferDev(data).then(res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchTransfer.transferSuccess")
          );
          this.resetTran();
          this.isShow = false;
          this.app.$emit("customer-refresh", null);
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchTransfer.transferFail") + ":" + res.errMsg
          );
        }
      });
    },
    searchUser() {
      //搜索用户
      if (this.userName) {
        this.app.$emit("close-user-box");
        this.isUserBox = true;
        this.isDeviceBox = false;
      }
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
    dealUserItem(op) {
      //选中用户搜索box
      this.userId = op.userId;
      this.userName = op.userName;
    },
    resetTran() {
      //置空表单信息
      this.deviceImei = "";
      this.deviceSim = "";
      this.userId = "";
      this.userName = "";
      this.note = "";
    },
    dealDevItem(op) {
      //选中设备搜索box
      this.deviceImei = op.deviceImei;
      this.deviceSim = op.item.sim_no;
      this.note = op.item.remark;
    },
    showDialog(op) {
      //弹出对话框
      this.isShow = true;
      if (op.item && op.item.deviceImei) {
        this.deviceImei = op.item.deviceImei;
        this.deviceSim = op.item.msisdn;
      } else if (op.item && op.item.userId) {
        this.userId = op.item.userId;
        this.userName = op.item.userName;
      } else {
        this.resetTran();
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-transfer-dialog", this.showDialog);
      this.app.$on("close-transfer-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-transfer-dialog", this.showDialog);
      this.app.$off("close-transfer-dialog", this.closeDialog);
    }
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped="scoped" lang="scss"></style>
