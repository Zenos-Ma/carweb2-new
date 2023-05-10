<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('customer.changePwd')"
    :dialog-width="40"
    dialog-unit="rem"
    :icon-window="'icon-xiugai'"
  >
    <div style="text-align:center">
      <user-pwd></user-pwd>
    </div>
  </dialog-comp>
</template>

<script>
import UserPwd from "@/components/UserPwd";
export default {
  name: "UserPwdDialog",
  props: {},
  components: {
    "user-pwd": UserPwd
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    showDialog(op) {
      // console.log(op);
      this.isShow = true;
      this.app.$emit("show-edit-dev", op);
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-user-pwd-dialog", this.showDialog);
      this.app.$on("close-user-pwd-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-user-pwd-dialog", this.showDialog);
      this.app.$off("close-user-pwd-dialog", this.closeDialog);
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

<style scoped="scoped">
table {
  display: inline-block;
  line-height: 3rem;
}
table > tr > td:first-child {
  font-weight: bold;
  text-align: right;
}
table > tr > td:last-child {
  font-weight: normal;
  text-align: left;
}
</style>
