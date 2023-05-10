<template>
  <div style="display: block; text-align: center; padding: 8px">
    <!--添加新用户表单 start-->
    <table class="form-table" style="margin: 0 auto">
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userDetail.superLoginNo") }}:
        </td>
        <td>
          <el-input
            style="width: 180px"
            v-model="parentName"
            @keyup.enter="searchUser"
            :placeholder="$t('common.searchUserTip')"
          />
          <el-button type="primary" @click="searchUser">{{
            $t("common.search")
          }}</el-button>
          <user-box
            bname="UserAdd"
            :is-show.sync="isUserBox"
            :search-key="parentName"
            @select-result="dealUserItem"
          ></user-box>
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.type") }}:</td>
        <td>
          <!--  -->
          <el-select v-model="userType" style="width: 180px">
            <el-option
              v-for="(item, idx) in $t('common.userTypeList')"
              :value="idx"
              :key="idx"
              :label="item.text"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("common.userName") }}:
        </td>
        <td>
          <el-input style="width: 180px" v-model="userName" />
        </td>
      </tr>
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userDetail.loginNo") }}:
        </td>
        <td>
          <el-input style="width: 180px" v-model="loginNo" />
        </td>
      </tr>

      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userAdd.loginPwd") }}:
        </td>
        <td>
          <el-input style="width: 180px" show-password v-model="pwd" />
        </td>
      </tr>
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userAdd.confirmPwd") }}:
        </td>
        <td>
          <el-input style="width: 180px" show-password v-model="pwd1" />
        </td>
      </tr>
      <tr>
        <td></td>
        <td style="color: red">{{ $t("userAdd.loginPwdTip") }}</td>
      </tr>
      <tr v-if="pwd != pwd1">
        <td></td>
        <td style="color: red">{{ $t("userAdd.loginPwdWarn") }}</td>
      </tr>
      <tr>
        <td>{{ $t("common.linkman") }}:</td>
        <td>
          <el-input style="width: 180px" v-model="linkman" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.phone") }}:</td>
        <td>
          <el-input style="width: 180px" v-model="tel" />
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.address") }}:</td>
        <td>
          <el-input style="width: 180px" v-model="address" />
        </td>
      </tr>
    </table>

    <div style="text-align: center">
      <el-button type="primary" style="width: 80px" @click="doAddUser">{{
        $t("common.submit")
      }}</el-button>
    </div>
    <!--添加新用户表单 end-->
  </div>
</template>

<script>
import { addUserInfo } from "@/api/common.js";
import UserBox from "@/components/UserBox";
import { encrypt } from "@/utils/crypto.js";
export default {
  name: "UserAdd",
  props: {},
  components: {
    "user-box": UserBox
  },
  data: () => ({
    parentName: JSON.parse(window.localStorage.getItem("carweb_user")).userName, //上级用户
    parentId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userType: 1, //选中用户类型
    userName: "", //用户名
    linkman: "", //联系人
    pwd: "123456", //默认密码
    pwd1: "123456", //确认密码
    address: "", //地址
    tel: "", //联系方式
    loginNo: "", //登录账号

    isUserBox: false
  }),
  watch: {
    parentName() {
      if (!this.parentName) {
        this.parentId = "";
      }
    }
  },
  methods: {
    searchUser() {
      //搜索用户
      this.app.$emit("close-user-box");
      this.isUserBox = true;
    },
    dealUserItem(op) {
      //选中搜索用户box
      this.parentId = op.userId;
      this.parentName = op.userName;
    },
    resetUserInfo() {
      //置空信息
      this.userName = "";
      this.loginNo = "";
      this.userType = 1;
      this.pwd = "123456";
      this.pwd1 = "123456";
      this.tel = "";
      this.linkman = "";
      this.address = "";
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    doAddUser() {
      //添加用户
      if (this.pwd != this.pwd1) {
        return;
      }
      // 新增2021-4-27为了区分设备登录
      if (this.isNumber(this.userName)) {
        // console.log("21");
        if (this.userName.length > 12) {
          this.app.$emit("show-alert-msg", this.$t("userAdd.lousTip2"));
          return;
        }
      }
      if (this.isNumber(this.loginNo)) {
        // console.log("3224");
        if (this.loginNo.length > 12) {
          this.app.$emit("show-alert-msg", this.$t("userAdd.lousTip1"));
          return;
        }
      }
      //
      if (!this.userName) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("userAdd.inputTip") + this.$t("common.userName")
        );

        return;
      }
      if (!this.loginNo) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("userAdd.inputTip") + this.$t("userAdd.loginNo")
        );

        return;
      }
      if (!/^[\d|a-zA-Z]+$/.test(this.loginNo)) {
        this.app.$emit("show-alert-msg", this.$t("userAdd.loginNoTip"));
        return;
      }
      if (this.userName.indexOf("\\") >= 0 || this.userName.indexOf("%") >= 0) {
        this.app.$emit("show-alert-msg", this.$t("userAdd.userNameTip"));
        return;
      }
      //

      var data = {
        parentId: this.parentId,
        userName: this.userName,
        loginNo: this.loginNo,
        passwords: encrypt(this.pwd),
        userType: this.userType,
        linkman: this.linkman,
        tel: this.tel,
        address: this.address
        // createTime: new Date(),
      };
      //
      addUserInfo(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", this.$t("userAdd.addUserSuccess"));
          this.app.$emit("usertree-refresh");
          this.app.$emit("close-add-user-dialog", "AddUserDialog");
          this.resetUserInfo();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("userAdd.addUserFail") + ":" + res.errMsg
          );
        }
      });
    },
    dealDialog(uid, uname) {
      //弹出对话框
      var rootUser = JSON.parse(window.localStorage.getItem("carweb_user"));
      this.parentId = uid ? uid : rootUser.userId;
      this.parentName = uname ? uname : rootUser.userName;
    },
    listenEvent() {
      this.app.$on("add-user-dialog", this.dealDialog);
      this.app.$on("user-dialog", this.dealDialog);
    },
    offEvent() {
      this.app.$off("add-user-dialog", this.dealDialog);
      this.app.$off("user-dialog", this.dealDialog);
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

<style lang="scss" scoped="scoped"></style>
