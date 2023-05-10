<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('userDetail.userDetail')"
    :dialog-width="800"
    :dialog-height="650"
    dialog-unit="px"
  >
    <!--搜索用户 start-->
    <div class="search-device">
      <!-- <span>{{$t(label.searchTip)}}：</span> -->

      <el-input
        style="width:23rem"
        v-model="userName"
        @keyup.enter.native="searchUser"
        :placeholder="$t('common.searchUserTip')"
      />
      <el-button type="primary" @click="searchUser">
        {{ $t("common.search") }}
      </el-button>
      <user-box
        bname="UserDialog"
        :is-show.sync="isUserBox"
        :search-key="userName"
        @select-result="dealUserItem"
        style="position: absolute; left: 11rem"
      ></user-box>
    </div>
    <!--搜索用户 end-->
    <div
      style="border-radius: 0.4rem;border: solid 0.1rem #c0d7e7;height: calc(100% - 5rem); width: 100%;overflow: hidden"
    >
      <!--用户详情tab root下的 start-->
      <ul class="dialog-tabs" v-if="rootUser.userId == 1">
        <li
          v-for="(item, idx) in $t('userDetail.dialogTabs')"
          :class="['dialog-tab', currentTab == idx ? 'active' : '']"
          @click="changeDialogTab(idx)"
          :key="'dialogTabs' + idx"
        >
          {{ item.text }}
        </li>
        <li class="dialog-tab" style="flex: 1"></li>
      </ul>
      <ul class="dialog-tabs" v-if="rootUser.userId != 1">
        <li
          v-for="(item, idx) in $t('userDetail.dialogTabs1')"
          :class="['dialog-tab', currentTab == idx ? 'active' : '']"
          @click="changeDialogTab(idx)"
          :key="'dialogTabs' + idx"
        >
          {{ item.text }}
        </li>
        <li class="dialog-tab" style="flex: 1"></li>
      </ul>
      <!--用户详情tab end-->

      <!--用户详情内容 start-->
      <div class="dialog-content">
        <component
          :is="currentPart"
          style="padding: 0.8rem; width: calc(100% - 1.6rem);height: calc(100% - 1.6rem);"
          dname="user"
        ></component>
      </div>
      <!--用户详情内容 end-->
    </div>
  </dialog-comp>
</template>

<script>
import UserRelation from "@/pages/UserDialog/UserRelation";
import UserDetail from "@/pages/UserDialog/UserDetail";
import BatchTransfer from "@/components/BatchTransfer/BatchTransfer";
import BatchSale from "@/components/BatchSale";
import UserAdd from "@/components/UserAdd/UserAdd";
import UserBox from "@/components/UserBox";
import UserPermission from "@/pages/UserDialog/UserPermission";
export default {
  name: "UserDialog",
  props: {},
  components: {
    "user-box": UserBox,
    "user-detail": UserDetail, //用户详情
    "user-relation": UserRelation, //客户关系
    "batch-transfer": BatchTransfer, //批量转移
    "batch-sale": BatchSale, //批量销售
    "user-add": UserAdd, //添加用户
    "user-permission": UserPermission //权限
  },
  data: () => ({
    isShow: false,
    currentTab: 1, //用户详情当前tab
    userId: "", //对话框用户id
    userName: "", //对话框用户名
    currentPart: "user-detail", //用户详情当前内容
    isUserBox: false, //搜索用户对话框
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user"))
  }),
  watch: {
    userName: function() {
      if (!this.userName) {
        this.userId = "";
      }
    }
  },
  methods: {
    searchUser() {
      //搜索用户
      this.app.$emit("close-user-box");
      this.isUserBox = true;
    },
    changeDialogTab(idx) {
      //切换用户详情对话框tab和内容
      this.currentTab = idx;
      if (this.rootUser.userId == 1) {
        this.currentPart = this.$t("userDetail.dialogTabs[" + idx + "].name");
      } else {
        this.currentPart = this.$t("userDetail.dialogTabs1[" + idx + "].name");
      }
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("user-dialog", that.userId, that.userName);
      });
    },
    showDialog(op) {
      //显示对话框
      this.isShow = true;
      this.userId = op.userId;
      this.userName = op.userName;
      this.changeDialogTab(1);
    },
    closeDialog() {
      //关闭对话框
      this.isShow = false;
    },
    dealUserItem(op) {
      //选中搜索用户box
      this.showDialog(op);
    },
    listenEvent() {
      this.app.$on("show-user-dialog", this.showDialog);
      this.app.$on("close-user-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-user-dialog", this.showDialog);
      this.app.$off("close-user-dialog", this.closeDialog);
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

<style lang="scss" scoped>
.search-device {
  border-radius: 0.4rem;
  border: solid 0.1rem #c0d7e7;
  line-height: 3rem;
  margin-bottom: 0.8rem;
  padding: 0 0.8rem;
  font-size: 1.2rem;
}

.search-device > span {
  color: gray;
}

.dialog-content {
  height: calc(100% - 30px);
  border-radius: 0 0 0.4rem 0.4rem;
  .batch-sale {
    overflow: scroll;
  }
}

.dialog-content > .content-header {
  line-height: 3rem;
  font-weight: bold;
  font-size: 1.4rem;
}
</style>
