<template>
  <div class="device-version-message">
    <div class="version-message-top">
      <span
        >设备号：
        <el-input
          size="small"
          v-model="deviceImei"
          style="width:160px"
        ></el-input>
      </span>
      <span
        >版本号：
        <el-input size="small" v-model="version" style="width:160px"></el-input>
      </span>
      <span>
        <el-button type="primary" @click="loadDeviceMessageList"
          >查询</el-button
        >
      </span>
    </div>
    <div class="device-upgrade-table layout-container-table">
      <el-table
        :data="deviceVersionList"
        height="100%"
        border
        :row-class-name="tableRowClassName"
        :header-cell-style="{ background: '#f7f7f7' }"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="设备号" width="180">
          <template slot-scope="scope">
            <a @click="dealTableDevice(scope.row)">{{
              scope.row.deviceImei
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="props">
            {{ props.row.createDate.time | fdatetime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="props">
            {{ props.row.updateDate.time | fdatetime }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, prev, pager, next,jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { queryDeviceVersion } from "@/api/production";
export default {
  name: "deviceVersionMessage",
  data: () => ({
    deviceImei: "",
    version: "",
    deviceVersionList: [],
    page: {
      current: 0,
      pageSize: 30,
      total: 0,
      num: 1
    }
  }),
  methods: {
    dealTableDevice(item) {
      // console.log(item);
      // 点击设备打开设备详情的窗口
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: item.deviceImei,
        tab: "device"
      });
    },
    tableRowClassName({ row, rowIndex }) {
      // 表格中条纹的设置
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        // return "success-row";
      }
      return "";
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadDeviceMessageList();
    },
    loadDeviceMessageList() {
      // 查询设备版本号的信心
      let data = {
        page: this.page.current,
        pageSize: this.page.pageSize
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      if (this.version) {
        data.version = this.version;
      }
      queryDeviceVersion(data).then(res => {
        if (res.errCode == 200) {
          this.deviceVersionList = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    listenEvent() {
      this.app.$on("load-version-message", this.loadDeviceMessageList);
    },
    offEvent() {
      this.app.$off("load-version-message", this.loadDeviceMessageList);
    }
  },
  mounted() {
    // this.loadDeviceMessageList();
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped lang="scss">
.device-version-message {
  height: 100%;
}
.version-message-top {
  display: flex;
  align-items: center;
  ::v-deep .el-button {
    padding: 8px 20px !important;
    vertical-align: middle;
  }
  span {
    margin-right: 5px;
  }
}
.device-upgrade-table {
  // margin-top: 10px;
}
</style>
