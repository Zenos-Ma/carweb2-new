<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('common.searchResult')"
    :dialog-width="800"
  >
    <div style="font-weight: bold; line-height: 30px">
      {{ $t("common.searchResultNum") }}:{{ resultData.length }}
    </div>
    <div class="search-dev">
      <data-table
        :data="resultData"
        v-show="searchType == 'device'"
        :show-page="false"
      >
        <el-table-column
          :label="$t('common.deviceImei')"
          prop="deviceImei"
          min-width="120"
        ></el-table-column>
        <el-table-column
          :label="$t('common.deviceName')"
          prop="name"
          min-width="120"
        ></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="props">
            <a @click="dealTableOp(props.$index, props.row, 'deviceMonitor')">{{
              $t("common.monitor")
            }}</a>
            <a @click="dealTableOp(props.$index, props.row, 'deviceDetail')">{{
              $t("common.detail")
            }}</a>
            <a
              @click="dealTableOp(props.$index, props.row, 'devicePlayback')"
              >{{ $t("common.playback") }}</a
            >
          </template>
        </el-table-column>
      </data-table>
      <data-table
        :data="resultData"
        v-show="searchType == 'user'"
        :show-page="false"
      >
        <el-table-column
          :label="$t('common.userName')"
          prop="userName"
          min-width="120"
        ></el-table-column>
        <el-table-column
          :label="$t('userDetail.loginNo')"
          prop="loginNo"
          min-width="120"
        ></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="props">
            <a @click="dealTableOp(props.$index, props.row, 'userMonitor')">{{
              $t("common.monitor")
            }}</a>
            <a @click="dealTableOp(props.$index, props.row, 'userDetail')">{{
              $t("common.detail")
            }}</a>
            <a @click="dealTableOp(props.$index, props.row, 'userShow')">{{
              $t("common.showUser")
            }}</a>
          </template>
        </el-table-column>
      </data-table>
    </div>
    <!--  -->
  </dialog-comp>
</template>

<script>
import { loadUserListInfo, searchDevice } from "@/api/account.js";
export default {
  name: "SearchResultDialog",
  components: {},
  props: {},
  data: () => ({
    isShow: false,
    searchType: "device", //搜索类型
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    resultTitle: [], //搜索表格title
    resultData: [], //搜索结果table
    searchKey: ""
  }),
  methods: {
    searchUser() {
      //搜索用户
      const data = {
        baseUserId: this.rootUser.userId,
        key: this.searchKey,
        overflow: 100
      };
      loadUserListInfo(data).then(res => {
        if (res.errCode == "200") {
          this.resultData = res.data;
        }
      });
    },
    searchDevice() {
      //搜索设备
      const data = {
        baseUserId: this.rootUser.userId,
        key: this.searchKey,
        overflow: 100
      };
      searchDevice(data).then(res => {
        if (res.errCode == "200") {
          this.resultData = res.data;
        }
      });
    },
    showDialog(op) {
      //显示搜索结果对话框
      this.isShow = true;
      this.searchKey = op.key;
      this.searchType = op.searchType;
      if (op.searchType == "user") {
        //搜索用户
        this.resultTitle = this.userTitle;
        this.searchUser();
      } else {
        //搜索设备
        this.resultTitle = this.deviceTitle;
        this.searchDevice();
      }
    },
    closeDialog() {
      //关闭对话框
      this.isShow = false;
    },
    dealTableOp(index, item, name) {
      console.log(index, item, name);
      //处理表格操作
      if (name == "userMonitor") {
        //该用户监控界面
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?userId=" +
            item.userId
        );
      } else if (name == "deviceMonitor") {
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/monitor/location?deviceImei=" +
            item.deviceImei
        );
      } else if (name == "userDetail") {
        //用户详情对话框
        this.app.$emit("show-user-dialog", {
          name: "UserDialog",
          userId: item.userId,
          userName: item.userName
        });
      } else if (name == "userShow") {
        //我的客户显示该用户信息
        this.isShow = false;
        this.app.$emit("customer-userid", item.userId);
        // 路由跳转的还有点问题 2023-2-24
        if (this.$route.path != "/customer/mycustomer") {
          this.$router.push("/customer/mycustomer");
        }
      } else if (name == "deviceDetail") {
        //设备详情对话框
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: item.deviceImei
        });
      } else if (name == "devicePlayback") {
        //回放界面
        window.open(
          window.location.origin +
            window.location.pathname +
            "#/playback?deviceImei=" +
            item.deviceImei
        );
      }
    },
    listenEvent() {
      this.app.$on("show-search-result-dialog", this.showDialog);
      this.app.$on("close-search-result-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-search-result-dialog", this.showDialog);
      this.app.$off("close-search-result-dialog", this.closeDialog);
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

<style lang="scss" scoped="scoped">
.search-dev {
  height: 450px;
}
</style>
