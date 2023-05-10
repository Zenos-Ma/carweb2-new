<template>
  <div style="padding: 8px; overflow-x: hidden; overflow-y: hidden; text-align: center">
    <!--用户详情表单-->
    <table class="form-table" style="margin: 0 auto">
      <tr>
        <td>{{ $t("common.userName") }}:</td>
        <td>
          <el-input style="width: 200px" v-model="userDetail.targetUser.userName" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("userDetail.loginNo") }}:</td>
        <td>{{ userDetail.targetUser.loginNo }}</td>
      </tr>
      <tr v-if="userDetail.hasParent">
        <td>{{ $t("userDetail.superLoginNo") }}:</td>
        <td>
          <span v-if="!userDetail.parentEditable">{{ userDetail.loginUser.loginNo }}</span>
          <span v-else>
            <el-input style="width: 200px" v-model="userDetail.parentUser.userName" @keyup.enter="searchUser" :placeholder="$t('common.searchUserTip')" />
            <el-button type="primary" @click="searchUser" style="margin-left: 8px">{{ $t("common.search") }}</el-button>
            <user-box bname="UserDetail" :is-show.sync="isUserBox" :search-key="userDetail.parentUser.userName" @select-result="dealUserItem"></user-box>
          </span>
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.type") }}:</td>
        <td>
          <el-select v-model="userDetail.targetUser.userType" v-if="userDetail.loginUser.userType == 2 || userDetail.loginUser.userId == 1" :disabled="isableShow" style="width: 200px">
            <el-option :value="idx" v-for="(item, idx) in $t('common.userTypeList')" :key="'usertypelist' + idx" :label="item.text"></el-option>
          </el-select>
          <span v-if="userDetail.loginUser.userType != 2 && userDetail.loginUser.userId != 1">
            {{ $t("common.userTypeList[" + (userDetail.targetUser.userType ? userDetail.targetUser.userType : 0) + "].text") }}
          </span>
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.linkman") }}:</td>
        <td>
          <el-input style="width: 200px" v-model="userDetail.targetUser.linkman" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.phone") }}:</td>
        <td>
          <el-input style="width: 200px" v-model="userDetail.targetUser.tel" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.address") }}:</td>
        <td>
          <el-input style="width: 200px" v-model="userDetail.targetUser.addr" />
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <el-checkbox v-model="lowerAlert">{{ $t("userDetail.subAlarm") }}</el-checkbox>
          <span class="hover-box">
            [?]
            <div class="orange-box">{{ $t("userDetail.subAlarmTip") }}</div>
          </span>
        </td>
      </tr>
    </table>

    <div style="text-align: center">
      <el-button type="primary" size="small" @click="saveUser">{{ $t("common.save") }}</el-button>
      <el-button type="warning" size="small" @click="loadUserDetail">{{ $t("common.reset") }}</el-button>
    </div>
  </div>
</template>

<script>
  import UserBox from "@/components/UserBox";
  import { loadUserInfo, saveUserInfo, getUserInfo } from "@/api/common.js";
  export default {
    name: "UserDetail",
    components: {
      "user-box": UserBox,
    },
    data: () => ({
      rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
      userId: "",
      showAlarmTip: false, //是否显示报警提示
      userDetail: {
        //用户信息
        parentUser: {
          userName: "",
        },
        targetUser: {
          userName: "",
        },
        loginUser: {
          userType: 0,
        },
      },
      lowerAlert: false, //是否接受下级报警
      isUserBox: false,
      isLoad: false,
      isCard: false,
      isInitType: 0, //是否开通设备初始化
      isFenceType: 0, //是否开通围栏功能
      isFrcType: 0, //是否开通风控功能
      isableShow: false,
    }),
    watch: {
      "userDetail.parentUser.userName": function () {
        if (!this.userDetail.parentUser.userName) {
          this.userDetail.parentUser.userId = "";
        }
      },
      userId() {
        if (this.rootUser.userId == this.userId) {
          this.isableShow = true;
        } else {
          this.isableShow = false;
        }
      },
    },

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
        loadUserInfo({ userId: this.userId }).then((res) => {
          if (res.errCode == "200") {
            this.lowerAlert = res.data.targetUser.lowerAlert == "1";
            this.isCard = res.data.isRefillCard;
            this.isInitType = res.data.isInitType;
            this.isFenceType = res.data.isRailType;
            this.isFrcType = res.data.isFrcType;
            this.userDetail = res.data;
            this.$nextTick(function () {
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

      dealUserItem(op) {
        //选中搜索用户box
        this.userDetail.parentUser.userName = op.userName;
        this.userDetail.parentUser.userId = op.userId;
      },
      listenEvent() {
        this.app.$on("user-dialog", this.dealUserDetail);
        this.app.$on("user-detail", this.dealUserDetail);
      },
      offEvent() {
        this.app.$off("user-dialog", this.dealUserDetail);
        this.app.$off("user-detail", this.dealUserDetail);
      },
      saveUser() {
        //保存用户信息
        var data = {
          userId: this.userDetail.targetUser.userId,
          userName: this.userDetail.targetUser.userName,
          parentId: this.userDetail.parentUser.userId,
          loginNo: this.userDetail.targetUser.loginNo,
          userType: this.userDetail.targetUser.userType,
          linkman: this.userDetail.targetUser.linkman,
          tel: this.userDetail.targetUser.tel,
          addr: this.userDetail.targetUser.addr,
          lowerAlert: this.lowerAlert ? 1 : 0,
          isRefillCardStr: this.isCard ? 1 : 0,
          deviceInitType: this.isInitType ? 1 : 0,
          railType: this.isFenceType ? 1 : 0,
          frcType: this.isFrcType ? 1 : 0,
          // createTime: new Date(),
        };
        // 2021-1-21 更新修改用户开通的功能权限
        saveUserInfo(data).then((res) => {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("userDetail.saveTip"));
            this.getUserInfo();
            // this.app.$emit("home1-refresh", null);
            this.app.$emit("customer-refresh", null);
          } else {
            this.app.$emit("show-alert-msg", this.$t("userDetail.saveFail") + ":" + res.errMsg);
          }
        });
      }, //saveUser
      getUserInfo() {
        //获取登录用户的信息
        getUserInfo().then((res) => {
          if (res.errCode == "200") {
            res.data.loginUser.initFlag = res.data.initFlag;
            // console.log(res.data.loginUser);
            window.localStorage.setItem("init_flag", res.data.initFlag);
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
