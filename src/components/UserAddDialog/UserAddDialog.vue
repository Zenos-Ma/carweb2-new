<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('userAdd.dialogTitle')"
    :dialog-width="455"
    icon-window="icon-tianjiarenyuan"
  >
    <div style="text-align: center">
      <add-user></add-user>
    </div>
  </dialog-comp>
</template>

<script>
import AddUser from "@/components/UserAdd/UserAdd";
export default {
  name: "UserAddDialog",
  props: {},
  components: {
    "add-user": AddUser
  },
  data: () => ({
    isShow: false,
    userId: "",
    userName: ""
  }),
  methods: {
    showDialog(op) {
      //添加用户对话框
      this.isShow = true;
      this.userId = op.userId;
      this.userName = op.userName;
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("add-user-dialog", that.userId, that.userName);
      });
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-add-user-dialog", this.showDialog);
      this.app.$on("close-add-user-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-add-user-dialog", this.showDialog);
      this.app.$off("close-add-user-dialog", this.closeDialog);
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
