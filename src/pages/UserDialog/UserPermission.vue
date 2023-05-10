<template>
  <div style="padding: 8px; text-align: center">
    <!--用户详情表单-->
    <table class="form-table" style="margin: 0 auto">
      <tr>
        <td>{{ $t("common.userName") }}:</td>
        <td>
          <el-input style="width: 200px" v-model="userDetail.userName" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("userDetail.loginNo") }}:</td>
        <td>
          {{ userDetail.loginNo }}<span class="rootTip" v-if="userDetail.loginNo == 'root'">{{ $t("userDetail.rootTips") }}</span>
        </td>
      </tr>
      <!-- 更新2021-1-22 是否开启充值卡功能 -->
      <tr v-if="rootUser.userId == 1" v-show="userDetail.userType != 1">
        <td></td>
        <td>
          <el-checkbox v-model="userDetail.isRefillCard">{{ $t("userDetail.isOpenCard") }}</el-checkbox>
        </td>
      </tr>
      <!-- 更新2021-1-20 是否开启设备初始化功能 start -->
      <tr v-show="rootUser.userId == 1">
        <td></td>
        <td>
          <el-checkbox v-model="userDetail.isInitType">{{ $t("userDetail.isInitType") }}</el-checkbox>
          <span class="hover-box">
            [?]
            <div class="orange-box">{{ $t("userDetail.isInitTypeTip") }}</div>
          </span>
        </td>
      </tr>
      <!-- 是否开启设备初始化功能 end -->
      <!-- 2021-1-21 root才有权限操作是否开通围栏功能 start -->
      <tr v-show="rootUser.userId == 1">
        <td></td>
        <td>
          <el-checkbox v-model="userDetail.isRailType">{{ $t("userDetail.isFenceType") }}</el-checkbox>
          <span class="hover-box">
            [?]
            <div class="orange-box">{{ $t("userDetail.isFenceTypeTip") }}</div>
          </span>
        </td>
      </tr>
      <!-- 2021-1-21 root才有权限操作是否开通围栏功能 end -->
      <!-- 2021-1-21 root才有权限操作是否开通围栏功能 start -->
      <tr v-show="rootUser.userId == 1">
        <td></td>
        <td>
          <el-checkbox v-model="userDetail.isFrcType">{{ $t("userDetail.isFrcType") }}</el-checkbox>
          <span class="hover-box">
            [?]
            <div class="orange-box">{{ $t("userDetail.isFrcTypeTip") }}</div>
          </span>
        </td>
      </tr>
      <!-- 2021-1-21 root才有权限操作是否开通围栏功能 end -->
    </table>

    <div style="text-align: center">
      <el-button type="primary" size="small" @click="saveUser">{{ $t("common.save") }}</el-button>
      <el-button type="warning" size="small" @click="loadUserDetail">{{ $t("common.reset") }}</el-button>
    </div>
  </div>
</template>

<script>
  import { loadUserPermission, updateUserPermission } from "@/api/common.js";
  export default {
    name: "UsrPermission",
    components: {},
    data: () => ({
      rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
      userId: "",
      showAlarmTip: false, //是否显示报警提示
      userDetail: {
        //用户信息
        isInitType: false, //是否开通设备初始化
        isRailType: false, //是否开通围栏功能isRailType
        isFrcType: false, //是否开通风控功能
        isRefillCard: false, //是否开通充值卡
      },
      lowerAlert: false, //是否接受下级报警
      isUserBox: false,
      isLoad: false,
    }),
    // watch: {
    //   "userDetail.parentUser.userName": function () {
    //     if (!this.userDetail.parentUser.userName) {
    //       this.userDetail.parentUser.userId = "";
    //     }
    //   },
    // },
    methods: {
      searchUser() {
        //搜索用户
        this.app.$emit("close-user-box");
        this.isUserBox = true;
      },
      showSubAlarmTip() {
        //是否显示报警提示
        this.showAlarmTip = true;
      },
      loadUserDetail() {
        //获取用户信息
        this.isLoad = true;
        loadUserPermission({ userId: this.userId }).then((res) => {
          if (res.errCode == "200") {
            console.log(res);
            this.userDetail = res.data;
            this.$nextTick(() => {
              this.isLoad = false;
            });
          }
        });
      },
      dealUserDetail(uid) {
        //处理对话框发过来用户id
        this.userId = uid;

        if (this.userId) {
          this.loadUserDetail();
        }
      },

      listenEvent() {
        this.app.$on("user-dialog", this.dealUserDetail);
        this.app.$on("user-detail", this.dealUserDetail);
      },
      offEvent() {
        this.app.$off("user-dialog", this.dealUserDetail);
        this.app.$off("user-detail", this.dealUserDetail);
      }, //保存用户信息
      saveUser() {
        var data = {
          userId: this.userId,
          isRefillCardStr: this.userDetail.isRefillCard ? 1 : 0,
          deviceInitType: this.userDetail.isInitType ? 1 : 0,
          railType: this.userDetail.isRailType ? 1 : 0,
          frcType: this.userDetail.isFrcType ? 1 : 0,
        };
        updateUserPermission(data).then((res) => {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("userDetail.saveTip"));

            // this.app.$emit("home1-refresh", null);
            this.app.$emit("customer-refresh", null);
          } else {
            this.app.$emit("show-alert-msg", this.$t("userDetail.saveFail") + ":" + res.errMsg);
          }
        });
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

<style scoped="scoped" lang="scss">
  .rootTip {
    border: 1px dashed #ccc;
    margin: 4px;
    font-size: 12px;
    border: #e2a814 1px dashed;
    background-color: #f6f0ca;
    line-height: 20px;
    color: black;
    padding: 0 8px;
    text-align: left;
  }
  .hover-box {
    cursor: pointer;
  }
  .hover-box .orange-box {
    display: none;
    position: absolute;
    width: 200px;
    border-radius: 5px;
    z-index: 2;
    right: 10px;
  }
  .hover-box:hover .orange-box {
    display: inline-block;
    margin-left: 50px;
    margin-top: -30px;
  }
</style>
