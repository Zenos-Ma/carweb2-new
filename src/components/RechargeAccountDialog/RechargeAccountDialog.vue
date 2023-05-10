<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('rechargeBill.withdrawTitle')"
    :dialog-width="500"
    icon-window="icon-zanwuchongzhijilu"
  >
    <div class="card-header">
      <span>{{ $t("rechargeBill.rechargeManage") }}</span>
    </div>
    <div class="recharge-account">
      <div class="recharge-title">
        <div class="account-price">
          <div class="balance">
            <span>{{ $t("withdraw.totalAccount") }}:</span>
            <span
              >{{ balanceInfo.balance ? balanceInfo.balance / 100 : 0
              }}{{ $t("common.yuan") }}</span
            >
          </div>
          <div class="valid-balance">
            <span
              >{{ $t("withdraw.effectiveMoney")
              }}<i
                class="iconfont icon-wenhao"
                :title="$t('withdraw.availableMoney')"
              ></i
              >:</span
            >
            <span
              >{{ balanceInfo.validBalance ? balanceInfo.validBalance / 100 : 0
              }}{{ $t("common.yuan") }}</span
            >
          </div>
          <div class="lock-balance">
            <span
              >{{ $t("withdraw.lockMoney")
              }}<i
                class="iconfont icon-wenhao"
                :title="$t('withdraw.withdrawTip')"
              ></i
              >:</span
            >
            <span
              >{{ balanceInfo.lockBalance ? balanceInfo.lockBalance / 100 : 0
              }}{{ $t("common.yuan") }}</span
            >
          </div>
        </div>
      </div>
      <div class="btn-cont">
        <span>
          <!-- <el-button type="primary" size="small">{{ $t("rechargeMy.recharge") }}</el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="showWithdrawalDialog"
            >{{ $t("rechargeBill.withdraw") }}</el-button
          >
        </span>
      </div>
    </div>
  </dialog-comp>
</template>

<script>
import { getUserBalance } from "@/api/withdraw.js";
export default {
  name: "RechagerAccountDialog",
  data: () => ({
    isShow: false,
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    balanceInfo: {}
  }),
  methods: {
    showDialog() {
      // console.log(data);
      this.isShow = true;
      this.loadUserBalance();
    },
    showWithdrawalDialog() {
      this.app.$emit("show-withdrawal-dialog");
    },
    loadUserBalance() {
      getUserBalance({ userId: this.userId }).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          this.balanceInfo = res.data;
        }
      });
    },
    listEvent() {
      this.app.$on("show-recharge-account-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-recharge-account-dialog", this.showDialog);
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
.recharge-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
  width: 180px;
  .account-price {
    width: 100%;
    div {
      line-height: 36px;
      display: flex;
      justify-content: space-between;
    }
    span:nth-of-type(2) {
      color: red;
    }
  }
}
.recharge-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.btn-cont {
  margin-top: 10px;
}
</style>
