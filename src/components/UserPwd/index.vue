<template>
  <div style="text-align:center;width:100%;height:100%;" class="user-pwd">
    <!--修改当前用户密码-->
    <table style="margin:0.8rem auto;" class="form-table">
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userPwd.oldPwd") }}:
        </td>
        <td>
          <el-input
            style="width:180px"
            id="login_pwd1"
            show-password
            v-model="oldPwd"
            autocomplete="off"
          />
        </td>
      </tr>
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userPwd.newPwd") }}:
        </td>
        <td>
          <el-input
            style="width:180px"
            id="login_pwd2"
            show-password
            v-model="newPwd"
            @change="checkPwd"
            autocomplete="off"
          />
        </td>
      </tr>
      <tr>
        <td>
          <font class="require-icon">*</font>
          {{ $t("userPwd.confirmPwd") }}:
        </td>
        <td>
          <el-input
            style="width:180px"
            id="login_pwd3"
            show-password
            v-model="newPwd1"
            @change="checkPwd"
            autocomplete="off"
          />
        </td>
      </tr>
      <tr v-if="pwdWarn">
        <td></td>
        <td style="font-size:1.2rem;color:red;">{{ $t("userPwd.pwdTip") }}</td>
      </tr>
    </table>

    <div style="text-align:center;line-height:4rem;">
      <el-button type="primary" @click="changePwd">{{
        $t("common.submit")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import LoginHelper from "@/utils/loginHelper.js";
export default {
  name: "UserPwd",
  props: {},
  data() {
    return {
      isShow: false,
      oldPwd: "", //旧密码
      newPwd: "", //新密码
      newPwd1: "", //确认密码
      pwdWarn: false, //提示错误
      loginType: JSON.parse(window.localStorage.getItem("carweb_user"))
        .loginType, //登录类型
      deviceImei: JSON.parse(window.localStorage.getItem("carweb_user"))
        .deviceImei //登录设备号
    };
  },
  methods: {
    //更改密码
    changePwd() {
      var that = this;
      if (!this.pwdWarn && this.oldPwd && this.newPwd1 && this.newPwd) {
        var data = {
          oldPwd: this.oldPwd,
          newPwd: this.newPwd1
        };
        if (this.loginType == 4) {
          data.deviceImei = this.deviceImei;
        }
        var url =
          this.loginType == 4 ? this.API.changePwdDev : this.API.changePwd;
        // console.log(data);
        // console.log(url);
        this.post(url, data, function(res) {
          if (res.errCode == "200") {
            // that.app.$emit("show-alert-msg", that.$t("userPwd.changePwdSuccess"));
            that.isShow = false;
            that.oldPwd = "";
            that.newPwd = "";
            that.newPwd1 = "";
            that.app.$emit(
              "show-confirm-msg",
              that.$t("common.passwordChangeTip"),
              () => {
                that.doLogout();
              }
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("userPwd.changePwdFail") + ":" + res.errMsg
            );
          }
        });
      }
    },
    doLogout() {
      // 登出
      this.get(this.API.logout, res => {
        if (res.errCode == 200) {
          window.localStorage.removeItem("carweb_user");
          window.localStorage.removeItem("carweb_time");
          window.localStorage.removeItem("carweb_tag");
          window.localStorage.removeItem("carweb_logo");
          window.localStorage.removeItem("carweb_icon");
          window.location.href = LoginHelper.redirectLocation();
          this.app.$emit("load-account-logo");
        }
      });
    },
    checkPwd() {
      //检查密码输入是否一致
      if (
        this.newPwd != this.newPwd1 &&
        this.oldPwd &&
        this.newPwd1 &&
        this.newPwd
      ) {
        this.pwdWarn = true;
      } else {
        this.pwdWarn = false;
      }
    },
    showDev(op) {
      // console.log(op);
      this.loginType = op.loginType;
      this.deviceImei = op.deviceImei;
    },
    listEvent() {
      this.app.$on("show-edit-dev", this.showDev);
    },
    offEvent() {
      this.app.$off("show-edit-dev", this.showDev);
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

<style scoped="scoped" lang="scss"></style>
