<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('withdraw.title')"
    :dialog-width="700"
    icon-window="icon-SQLshenhe"
  >
    <div class="recharge-account">
      <h3>{{ $t("withdraw.titleManage") }}</h3>
      <div class="recharge-title">
        <el-tabs v-model="activeName" @tab-click="changeTab">
          <el-tab-pane :label="$t('withdraw.bank')" name="first">
            <el-form
              :model="bankMode"
              :rules="rules"
              ref="bankMode"
              label-width="120px"
            >
              <el-form-item :label="$t('withdraw.bankName')" prop="name">
                <el-input v-model="bankMode.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.bankNo')" prop="cardNo">
                <el-input v-model="bankMode.cardNo"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.holder')" prop="holder">
                <el-input v-model="bankMode.holder"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.idCard')" prop="idCard">
                <el-input v-model="bankMode.idCard"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.withdrawMoney')">
                <el-input v-model="price"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.phone')" prop="phone">
                <el-input v-model="bankMode.phone"></el-input>
              </el-form-item>
              <el-form-item :label="$t('card.vertifyCode')" prop="code">
                <el-input v-model="phoneCode" style="width: 75%"></el-input>
                <el-button
                  style="padding: 10px 20px"
                  @click="getPhoneCode"
                  :disabled="!isSendAble"
                  >{{
                    isSendAble
                      ? $t("card.vertifyCode")
                      : refreshTime + $t("card.resendCode")
                  }}</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('withdraw.alipay')" name="second">
            <el-form
              :model="alipayMode"
              :rules="rules1"
              ref="alipayMode"
              label-width="100px"
            >
              <el-form-item
                :label="$t('withdraw.alipayAccount')"
                prop="account"
              >
                <el-input v-model="alipayMode.account"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.alipayName')" prop="name">
                <el-input v-model="alipayMode.name"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.idCard')" prop="idCard">
                <el-input v-model="alipayMode.idCard"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.withdrawMoney')">
                <el-input v-model="price"></el-input>
              </el-form-item>
              <el-form-item :label="$t('withdraw.phone')" prop="phone">
                <el-input v-model="alipayMode.phone"></el-input>
              </el-form-item>
              <el-form-item :label="$t('card.vertifyCode')" prop="code">
                <el-input v-model="phoneCode" style="width: 75%"></el-input>
                <el-button
                  style="padding: 10px 20px"
                  @click="getPhoneCode"
                  :disabled="!isSendAble"
                  >{{
                    isSendAble
                      ? $t("card.vertifyCode")
                      : refreshTime + $t("card.resendCode")
                  }}</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div
          class="btn-content"
          v-if="activeName == 'first' || activeName == 'second'"
        >
          <el-button type="primary" size="small" @click="doWithdraw">{{
            $t("withdraw.examine")
          }}</el-button>
          <el-button type="info" size="small" @click="isShow = false">{{
            $t("common.cancel")
          }}</el-button>
        </div>
      </div>
    </div>
  </dialog-comp>
</template>

<script>
import { getUserPhoneCode, addWithdrawInfo } from "@/api/withdraw.js";
export default {
  name: "WithdrwalDialog",
  data: () => ({
    isShow: false,
    activeName: "first",
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    bankMode: {
      name: "",
      cardNo: "",
      holder: "",
      idCard: "",
      phone: ""
    },
    alipayMode: {
      account: "",
      name: "",
      idCard: "",
      phone: ""
    },
    rules: {},
    rules1: {},
    phoneCode: "",
    price: "",
    refreshTime: 59,
    isSendAble: true
  }),
  created() {
    this.rules = {
      name: [
        {
          required: true,
          message: this.$t("withdraw.bankNameTip"),
          trigger: "blur"
        },
        {
          min: 3,
          max: 5,
          message: this.$t("withdraw.bankNameTip1"),
          trigger: "blur"
        }
      ],
      cardNo: [
        {
          type: "number",
          required: true,
          message: this.$t("withdraw.cardNoTip"),
          trigger: "change"
        }
      ],
      idCard: [
        { required: true, trigger: "blur" },
        {
          pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          message: this.$t("withdraw.idCardRightTip")
        }
      ],
      phone: [
        {
          required: true,
          message: this.$t("withdraw.phoneTip"),
          trigger: "blur"
        },
        {
          min: 11,
          max: 11,
          message: this.$t("withdraw.phoneNumTip"),
          trigger: "blur"
        },
        {
          pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          message: this.$t("withdraw.phoneRightTip")
        }
      ]
    };
    this.rules1 = {
      name: [
        {
          required: true,
          message: this.$t("withdraw.alipayNameTip"),
          trigger: "blur"
        }
      ],
      idCard: [
        { required: true, trigger: "blur" },
        {
          pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          message: this.$t("withdraw.idCardRightTip")
        }
      ],
      phone: [
        {
          required: true,
          message: this.$t("withdraw.phoneTip"),
          trigger: "blur"
        },
        {
          min: 11,
          max: 11,
          message: this.$t("withdraw.phoneNumTip"),
          trigger: "blur"
        },
        {
          pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          message: this.$t("withdraw.phoneRightTip")
        }
      ]
    };
  },
  methods: {
    changeTab(val) {
      console.log(val);
      // this.refreshTime = 0;
    },
    showDialog() {
      // console.log(data);
      this.isShow = true;
    },
    getPhoneCode() {
      let data = {};
      console.log(this.bankMode.phone);
      if (this.activeName == "first") {
        data.phone = this.bankMode.phone;
      } else if (this.activeName == "second") {
        data.phone = this.alipayMode.phone;
      }
      if (!data.phone) {
        this.app.$emit("show-alert-msg", this.$t("withdraw.phoneTip"));
        return;
      }
      getUserPhoneCode(data).then(res => {
        if (res.errCode == 200) {
          console.log(res);
          this.app.$emit("show-alert-msg", this.$t("withdraw.sendSuccessTip"));
        }
      });
      let timer = null;
      if (timer) {
        timer = clearInterval(timer);
      }
      this.isSendAble = false;
      this.refreshTime = 59;
      timer = setInterval(() => {
        if (this.refreshTime <= 0) {
          this.isSendAble = true;
          timer = clearInterval(timer);
        } else {
          this.refreshTime--;
        }
      }, 1000);
    },
    doWithdraw() {
      // 加上时间段判断，限制不能在凌晨提交
      let currentTime = new Date();
      // console.log(currentTime.getHours());
      let hours = currentTime.getHours();
      if (hours <= 7 && hours >= 0) {
        // console.log("123");
        this.app.$emit("show-alert-msg", "请在明天早上7点后再操作");
        return;
      }
      console.log("chufa");
      //
      let data = {
        userId: this.userId,
        code: this.phoneCode,
        price: this.price * 100
      };
      if (!this.price) {
        this.app.$emit("show-alert-msg", "请输入需要提现的金额");
        return;
      }
      if (!this.phoneCode) {
        this.app.$emit("show-alert-msg", "请输入正确的手机验证码");
        return;
      }

      if (this.activeName == "first") {
        // 银行卡
        data.phone = this.bankMode.phone;
        data.bankName = this.bankMode.name;
        data.bankCard = this.bankMode.cardNo;
        data.phone = this.bankMode.phone;
        data.idCard = this.bankMode.idCard;
        data.type = 1;
      } else if (this.activeName == "second") {
        // 支付宝
        data.phone = this.alipayMode.phone;
        data.alipayAccount = this.alipayMode.account;
        data.idCard = this.alipayMode.idCard;
        data.alipayName = this.alipayMode.name;
        data.type = 2;
      }
      console.log(data);
      addWithdrawInfo(data).then(res => {
        if (res.errCode == 200) {
          console.log(res);
          this.app.$emit(
            "show-alert-msg",
            "提现审核提交成功，稍后客服人员会处理"
          );
        } else {
          this.app.$emit("show-alert-msg", res.errMsg);
        }
      });
    },
    listEvent() {
      this.app.$on("show-withdrawal-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-withdrawal-dialog", this.showDialog);
    }
  },
  mounted() {
    this.listEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped lang="scss">
.recharge-account {
  // padding: 10px;
}
</style>
