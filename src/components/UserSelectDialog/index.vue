<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('common.selectUser')"
    :dialog-width="400"
  >
    <div style="height:400px">
      <user-tree :user-id="userId" @usertree-select="dealUserItem"></user-tree>
    </div>
    <div style="text-align:center">
      <button class="btn-orange" @click="selectUser" style="width:80px;">
        {{ $t("common.ok") }}
      </button>
    </div>
  </dialog-comp>
</template>

<script>
import UserTree from "@/components/UserTree/UserTree";
export default {
  name: "UserSelectDialog",
  props: {},
  components: {
    "user-tree": UserTree
  },
  data: () => ({
    isShow: false,

    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName
  }),
  methods: {
    selectUser() {
      //选择用户
      this.isShow = false;
      this.$emit("select-user-result", {
        userId: this.userId,
        userName: this.userName
      });
    },
    dealUserItem(userId, userName) {
      //选中搜索用户box
      this.userId = userId;
      this.userName = userName;
    },
    showDialog(op) {
      //添加用户对话框
      this.isShow = true;
      this.userId = op.userId;
      this.userName = op.userName;
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-select-user-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-select-user-dialog", this.showDialog);
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
