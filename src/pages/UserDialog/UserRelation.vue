<template>
  <div style="padding: 8px; overflow-x: hidden; overflow-y: hidden; max-height: 500px; height: 300px">
    <!--用户关系表格-->
    <div class="content-header">{{ $t("common.owner") }}</div>

    <div style="height: 400px">
      <data-table :data="relationTable" :show-index="false" :show-page="false">
        <!--  -->
        <el-table-column :label="$t('common.num')" type="index" width="50"> </el-table-column>
        <el-table-column :label="$t('common.userName')" prop="userName" min-width="110"></el-table-column>
        <el-table-column :label="$t('userDetail.loginNo')" prop="loginNo" min-width="110"></el-table-column>
        <el-table-column :label="$t('common.linkman')" prop="linkman" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.phone')" prop="tel" min-width="100"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="props">
            <a @click="dealTableOption(props.$index, props.row, 'userRelateMonitor')">{{ $t("common.monitor") }}</a>
            <a @click="dealTableOption(props.$index, props.row, 'userRelateResetPwd')">{{ $t("customer.resetPwd") }}</a>
          </template>
        </el-table-column>
      </data-table>
    </div>
  </div>
</template>

<script>
  import { loadUserRelation, resetPwd } from "@/api/common.js";
  export default {
    name: "UserRelation",
    props: {},
    components: {},
    data: () => ({
      userId: "",
      relationTable: [], //用户关系表格数据
    }),
    methods: {
      loadUserRelation() {
        //获取客户关系数据
        loadUserRelation({ userId: this.userId }).then((res) => {
          if (res.errCode == 200) {
            this.relationTable = res.data;
          }
        });
      },
      dealTableOption(index, item, name) {
        //处理表格操作
        var that = this;
        if (name == "userRelateMonitor") {
          window.open(window.location.origin + window.location.pathname + "#/monitor/location?userId=" + item.userId);
        } else if (name == "userRelateResetPwd") {
          var tip = this.$t("customer.resetPwdTip");
          this.app.$emit("show-confirm-msg", tip.replace("_userName_", item.userName), function () {
            resetPwd({ uesrId: this.userId }).then((res) => {
              this.app.$emit("show-alert-msg", res.errMsg);
            });
          });
        }
      },
      dealUserDialog(uid, uname) {
        //处理用户详情对话框发过来userid
        this.userId = uid;
        this.userName = uname;
        if (this.userId) {
          this.loadUserRelation();
        }
      },
      listenEvent() {
        this.app.$on("user-dialog", this.dealUserDialog);
      },
      offEvent() {
        this.app.$off("user-dialog", this.dealUserDialog);
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

<style lang="scss" scoped>
  .content-header {
    line-height: 40px;
    font-weight: bold;
    padding-left: 10px;
    font-size: 14px;
  }
</style>
