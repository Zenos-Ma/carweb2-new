<template>
  <div
    class="result-box"
    v-show="isShowBox"
    style="overflow-y:hidden;overflow-x:auto;width:350px;height:400px"
  >
    <div style="height:100%;overflow-x:auto;overflow-y:auto;">
      <div class="device-show-box">
        <el-table
          ref="table"
          :data="deviceList"
          @selection-change="handleSelection"
          height="340"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            :label="$t('common.deviceImei')"
            prop="deviceImei"
          ></el-table-column>
          <el-table-column
            :label="$t('common.deviceName')"
            prop="name"
            width="160"
          ></el-table-column>
        </el-table>
        <el-pagination
          center
          :pager-count="5"
          :page-size="page.pageSize"
          :total="page.total"
          background
          layout="prev,pager,next"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <div style="position:absolute;right:0;bottom:0;">
      <el-button type="success" size="small" @click="postDeviceList">{{
        $t("common.ok")
      }}</el-button>
      <el-button type="primary" size="small" @click="closeBox">{{
        $t("common.close")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { getAbleDeviceList } from "@/api/pathPlanning";
export default {
  name: "DeviceAddBox",
  data: () => ({
    deviceList: [],
    selectList: [],
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    page: {
      pageSize: 50,
      num: 1,
      current: 1,
      total: 0
    }
  }),
  props: {
    isShowBox: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  methods: {
    postDeviceList() {
      if (this.selectList.length == 0) {
        this.$message.warning(this.$t("common.xuanzeliebiaozhongdevice"));
        return;
      }
      this.$emit("select-result", this.selectList);
      this.closeBox();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadDeviceList();
    },
    handleSelection(val) {
      this.selectList = val;
    },
    closeBox() {
      // console.log("dadada");
      this.$emit("update:isShowBox", false);
    },
    loadDeviceList(op) {
      console.log(op);
      const data = {
        roadId: op.roadId,
        page: 0,
        pageSize: this.page.pageSize
      };
      getAbleDeviceList(data).then(res => {
        if (res.errCode == 200) {
          this.deviceList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
        }
      });
    },
    listenEvent() {
      this.app.$on("load-plan-add-device", this.loadDeviceList);
    },
    offEvent() {
      this.app.$off("load-plan-add-device", this.loadDeviceList);
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

<style scoped lang="scss">
.device-show-box {
  ::v-deep .el-table .cell {
    white-space: nowrap;
  }
}
</style>
