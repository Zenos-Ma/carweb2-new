<template>
  <div class="quick-sale">
    <!--快速销售表单 start-->

    <!-- 使用element -->
    <el-form label-width="120px">
      <!-- 1 -->
      <el-form-item :label="$t('batchSale.saleTo')">
        <el-input
          v-model="userName"
          @keyup.enter="showHideBox('user')"
          :placeholder="$t('common.searchUserTip')"
        ></el-input>
        <el-button type="primary" @click="showHideBox('user')">{{
          $t("common.search")
        }}</el-button>
        <user-box
          bname="QuickSale"
          :is-show.sync="isUserBox"
          :search-key="userName"
          @select-result="dealUserItem"
        ></user-box>
      </el-form-item>
      <!-- 2 -->
      <el-form-item :label="$t('common.deviceImei')">
        <!--搜索设备 start-->
        <el-input
          v-model="deviceImei"
          @keyup.enter="showHideBox('device')"
          :placeholder="$t('common.searchDevTip')"
        />
        <el-button type="primary" @click="showHideBox('device')">
          {{ $t("common.search") }}
        </el-button>
        <device-box
          box-type="sell"
          :is-show.sync="isDeviceBox"
          :search-key="deviceImei"
          @select-result="dealDevItem"
        ></device-box>
        <!--搜索设备 end-->
      </el-form-item>
      <!-- 3 -->
      <el-form-item label="ICCID">
        <el-input v-model="iccid" />
      </el-form-item>
      <!-- 4 -->
      <el-form-item :label="$t('common.simNo')">
        <el-input type="text" class="text-input small" v-model="deviceSim" />
      </el-form-item>
      <!-- 5 -->
      <el-form-item :label="$t('batchSale.simProvider')" v-show="isShowYear">
        <el-select
          v-model="supplier"
          :placeholder="$t('rechargePurchase.pleaseChoose')"
          style="width: 100%"
        >
          <el-option value="S001SW" :label="$t('simInfo.swd')"></el-option>
          <el-option value="S002GM" :label="$t('simInfo.gm')"></el-option>
          <el-option
            value="S003ST"
            :label="$t('systemDevice.shangtong')"
          ></el-option>
          <el-option
            value="S004YD"
            :label="$t('systemDevice.cnyd')"
          ></el-option>
          <el-option
            value="S005LT"
            :label="$t('systemDevice.cnlt')"
          ></el-option>
          <el-option
            value="S006XY"
            :label="$t('systemDevice.xuyu')"
          ></el-option>
          <el-option value="other" :label="$t('simInfo.other')"></el-option>
        </el-select>
      </el-form-item>
      <!-- 6 -->
      <el-form-item :label="$t('batchSale.platformExpired')">
        <!-- <date-picker :date.sync="platformExpire"></date-picker> -->
        <el-date-picker
          type="date"
          v-model="platformExpire"
          :placeholder="$t('common.chooseTime')"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 7 -->
      <el-form-item :label="$t('batchSale.validYear')" v-show="isShowYear">
        <el-input v-model="validYear" />
      </el-form-item>
      <!-- 8 -->
      <el-form-item :label="$t('batchTransfer.note')">
        <el-input v-model="note" />
      </el-form-item>
      <!-- 9 -->
      <el-form-item>
        <el-button
          type="primary"
          style="width: 120px; margin-left: 0"
          @click="doSell"
        >
          {{ $t("batchSale.sale") }}
        </el-button>
        <el-button type="primary" style="width: 120px" @click="doReset">
          {{ $t("common.reset") }}
        </el-button>
      </el-form-item>
    </el-form>

    <!--快速销售表单 end-->
  </div>
</template>

<script>
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import { quickSale } from "@/api/account.js";
export default {
  name: "QuickSale",
  props: {},
  components: {
    "user-box": UserBox,
    "device-box": DeviceBox
  },
  data: () => ({
    deviceImei: "",
    userId: 1,
    userName: "",
    note: "",
    deviceSim: "",
    platformExpire: new Date(
      new Date().getTime() + 2 * 365 * 24 * 3600 * 1000
    ).format("yyyy-MM-dd"),
    iccid: "",
    supplier: "",
    validYear: "",
    isShowYear:
      JSON.parse(window.localStorage.getItem("carweb_user")).userId == 1,
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
        this.deviceSim = "";
        this.platformExpire = new Date().format("yyyy-MM-dd");
        this.iccid = "";
        this.supplier = "";
        this.validYear = "";
        this.note = "";
        this.isDeviceBox = false;
      }
    }
  },
  methods: {
    showHideBox(tag) {
      if (tag == "device") {
        if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
          this.isDeviceBox = true;
          this.isUserBox = false;
        } else {
          this.isDeviceBox = false;
          this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
        }
      } else {
        this.app.$emit("close-user-box");
        this.isUserBox = true;
        this.isDeviceBox = false;
      }
    }, //执行销售
    doSell() {
      if (!this.userId) {
        this.app.$emit("show-alert-msg", this.$t("batchSale.saleTip"));
        return;
      }

      if (!this.deviceImei) {
        this.app.$emit("show-alert-msg", this.$t("batchSale.saleTip1"));
        return;
      }

      if (this.isShowYear) {
        if (!this.supplier) {
          this.app.$emit("show-alert-msg", this.$t("batchSale.saleTip2"));
          return;
        }
      }

      if (this.validYear == "") {
        this.validYear = 1;
      }
      var data = {
        toUserId: this.userId,
        remark: this.note,
        deviceImei: this.deviceImei,
        deviceSim: this.deviceSim,
        platformExpire: new Date(this.platformExpire).getTime(),
        iccid: this.iccid,
        supplier: this.supplier,
        validYear: this.validYear
      };
      var that = this;
      // console.log(data);
      quickSale(data).then(res => {
        if (res.errCode == "200") {
          that.app.$emit("show-alert-msg", that.$t("batchSale.saleSuccess"));
          that.doReset();
          that.app.$emit("close-quick-sale-dialog", null);
          that.app.$emit("customer-refresh", null);
        } else {
          that.app.$emit(
            "show-alert-msg",
            that.$t("batchSale.saleFail") + ":" + res.errMsg
          );
        }
      });
    },
    doReset() {
      this.userId = "";
      this.userName = "";
      this.deviceImei = "";
      this.deviceSim = "";
      this.platformExpire = new Date().format("yyyy-MM-dd");
      this.iccid = "";
      this.supplier = "";
      this.validYear = "";
      this.note = "";
    },
    dealUserItem(op) {
      this.userId = op.userId;
      this.userName = op.userName;
    },
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
      this.deviceSim = op.item.sim_no;
      this.iccid = op.item.iccid_no;
      // this.supplier = op.item.userName;
      this.username = op.item.username;
      this.platformExpire = op.item.platformExpire;
      this.validYear = op.item.validYear;
      this.note = op.item.remark;
    },
    dealDialog(item) {
      if (item && item.deviceImei) {
        this.deviceImei = item.deviceImei;
        this.platformExpire = item.expireTime;
        this.iccid = item.iccid;
        this.deviceSim = item.msisdn;
      } else if (item && item.userId) {
        this.userId = item.userId;
        this.userName = item.userName;
      } else {
        this.doReset();
      }
    },
    listenEvent() {
      this.app.$on("quick-sale-dialog", this.dealDialog);
    },
    offEvent() {
      this.app.$off("quick-sale-dialog", this.dealDialog);
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
