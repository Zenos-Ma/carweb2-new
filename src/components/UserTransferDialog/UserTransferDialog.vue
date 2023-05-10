<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('customer.userTransfer')"
    :dialog-width="400"
    icon-window="icon-jiaohuan"
  >
    <div class="transfer-user-dialog">
      <table style="margin: 0 auto" class="form-table">
        <tr>
          <td>{{ $t("common.accountName") }}:</td>
          <td>
            <el-input
              v-model="userName"
              style="width: 180px"
              disabled
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.originAccount") }}:</td>
          <td v-if="!isEmptyObject(userInfo)">
            <el-input
              v-model="userInfo.parentUser.userName"
              disabled
              style="width: 180px"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <font class="require-icon">*</font>
            {{ $t("batchTransfer.transferTo") }}:
          </td>
          <td>
            <el-input
              style="width: 180px"
              v-model="sourseUserName"
              @keyup.enter.native="searchUser"
              :placeholder="$t('common.searchUserTip')"
            />
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="TransferDialog"
              :is-show.sync="isUserBox"
              :search-key="sourseUserName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
        </tr>
      </table>

      <el-button
        type="primary"
        @click="doTransferUser"
        style="width: 80px; margin-top: 10px"
        >{{ $t("common.submit") }}</el-button
      >
    </div>
  </dialog-comp>
</template>

<script>
import UserBox from "@/components/UserBox";
import { moveUser } from "@/api/customer.js";
import { getUserInfoMation } from "@/api/common.js";
export default {
  name: "UserTransferDialog",
  components: {
    "user-box": UserBox
  },
  data: () => ({
    isShow: false,
    userName: "",
    userId: "",
    isUserBox: false,
    sourseUserId: "",
    sourseUserName: "",
    userInfo: {}
  }),
  methods: {
    doTransferUser() {
      // console.log("1234");
      const data = {
        userId: this.userId,
        parentId: this.sourseUserId
      };
      moveUser(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchTransfer.transferSuccess")
          );
          this.app.$emit("usertree-refresh-new");
          this.isShow = false;
        } else {
          this.$message.error(this.$t("common.transferUserFail"));
        }
      });
    },
    searchUser() {
      // 搜索用户
      if (this.userName) {
        this.app.$emit("close-user-box");
        this.isUserBox = true;
      }
    },
    dealUserItem(op) {
      this.sourseUserId = op.userId;
      this.sourseUserName = op.userName;
    },
    showDialog(op) {
      // console.log(op);
      this.isShow = true;
      this.userId = op.userId;
      this.userName = op.userName;
      this.getUserInfo();
      this.sourseUserId = "";
      this.sourseUserName = "";
    },
    getUserInfo() {
      // console.log("chufa");
      getUserInfoMation({ userId: this.userId }).then(res => {
        if (res.errCode == 200) {
          this.userInfo = res.data;
        }
      });
    },
    listenEvent() {
      this.app.$on("show-user-transfer-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-user-transfer-dialog", this.showDialog);
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

<style scoped lang="scss">
.transfer-user-dialog {
  text-align: center;
}
</style>
