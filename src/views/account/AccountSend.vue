<template>
  <section class="accound-send layout-container">
    <!--用户树 start-->
    <div class="form-card1 body-content-left" style="height: 100%;width: 300px">
      <div class="card-header">{{ $t("accountSend.chooseUser") }}</div>
      <div
        class="card-body2"
        style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; padding-right: 0px"
      >
        <user-tree
          :is-check="true"
          @usertree-check="dealUserTree"
          :user-id="rootUser.userId"
        ></user-tree>
      </div>
    </div>
    <!--用户树 end-->
    <!--消息内容编辑 start-->
    <div
      class="form-card1 body-content-right"
      style="padding-left: 10px; height: 100%;width: calc(100% - 300px);"
    >
      <div class="card-header">{{ $t("accountSend.editMsg") }}</div>
      <div class="card-body">
        <div class="msg-input-title">{{ $t("accountSend.msgTitle") }}</div>
        <input
          class="msg-input"
          :placeholder="$t('accountSend.titleTip')"
          style="white-space: nowrap"
          v-model="msgTitle"
        />
        <div class="msg-input-title">{{ $t("accountSend.msgContent") }}</div>
        <textarea
          class="msg-input"
          :placeholder="$t('accountSend.contentTip')"
          style="height: calc(100% - 160px); overflow-x: auto; overflow-y: auto"
          v-model="msgContent"
        ></textarea>
        <div class="msg-submit">
          <el-checkbox v-model="recursion">{{
            $t("accountSend.msgSendTip")
          }}</el-checkbox>
          <el-button type="primary" @click="doSend">{{
            $t("accountSend.msgSend")
          }}</el-button>
        </div>
      </div>
    </div>
    <!--消息内容编辑 end-->
  </section>
</template>

<script>
import userTreeComp from "@/components/UserTree/UserTree";
import { doSendMessages } from "@/api/account.js";
import axios from "axios";
import qs from "qs";
export default {
  name: "AccountSend",
  components: {
    "user-tree": userTreeComp
  },
  props: {},
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    msgTitle: "", //发送消息title
    msgContent: "", //发送消息内容
    recursion: false, //是否发送给下级用户
    userId: [] //用户树勾选的用户
  }),
  methods: {
    dealUserTree(userId) {
      //用户树勾选用户
      var list = [];
      for (var i = 0; i < userId.length; i++) {
        list.push(userId[i].userId);
      }
      this.userId = list;
    },
    doSend() {
      //进行发送消息
      if (this.userId.length == 0) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("accountSend.msgSendFailCheck1")
        );

        return;
      }
      if (this.msgTitle == "" || this.msgContent == "") {
        this.app.$emit(
          "show-alert-msg",
          this.$t("accountSend.msgSendFailCheck")
        );
        return;
      }
      var data = {
        "userId[]": this.userId,
        title: this.msgTitle,
        content: this.msgContent,
        recursion: this.recursion
      };
      console.log(data);
      //
      doSendMessages(data, { indices: false }).then(res => {
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("accountSend.msgSendOK"));
          this.msgTitle = "";
          this.msgContent = "";
          this.recursion = false;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("accountSend.msgSendFail") + ":" + res.errMsg
          );
        }
      });

      //
      // const data = {
      //   "userId[]": this.userId,
      //   title: this.msgTitle,
      //   content: this.msgContent,
      //   recursion: this.recursion,
      // };
      // const contextPath = window.location.origin + "/carweb2/";
      // const url = contextPath + this.API.sendMessages;
      // axios.post(url, qs.stringify(data, { indices: false })).then((res) => {
      //   if (res.errCode == "200") {
      //     this.app.$emit("show-alert-msg", this.$t("accountSend.msgSendOK"));
      //     this.msgTitle = "";
      //     this.msgContent = "";
      //     this.recursion = false;
      //   } else {
      //     this.app.$emit("show-alert-msg", this.$t("accountSend.msgSendFail") + ":" + res.errMsg);
      //   }
      // });
    },
    listenEvent() {},
    offEvent() {}
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
.accound-send {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.msg-input {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  display: block;
  border: none;
  font-family: "微软雅黑";
  background: transparent;
  line-height: 30px;
  font-size: 14px;
  width: 100%;
}
.msg-input::-moz-placeholder,
.msg-input::-ms-input-placeholder,
.msg-input::-webkit-input-placeholder {
  color: gray;
}
.msg-input:hover,
.msg-input:active,
.msg-input:focus {
  border: none;
  box-shadow: none;
  outline: none;
  border-bottom: solid 1px deepskyblue;
}

.msg-submit {
  display: block;
  width: 100%;
  line-height: 30px;
  padding-top: 8px;
  text-align: right;

  button {
    width: 100px;
  }
}
.msg-input-title {
  color: black;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
}
</style>
