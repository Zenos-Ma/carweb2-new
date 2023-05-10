<template>
  <div class="device-record">
    <el-form size="samll">
      <el-form-item label="设备号:">
        <el-input
          v-model="deviceImei"
          style="width:140px"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="原版本:">
        <el-input
          v-model="oldVersion"
          style="width:140px"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="新版本:">
        <el-input
          v-model="newVersion"
          style="width:140px"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="开始时间:">
        <el-date-picker
          v-model="startTime"
          format="yyyy-MM-dd"
          type="date"
          size="small"
          style="width:140px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间:">
        <el-date-picker
          v-model="endTime"
          format="yyyy-MM-dd"
          type="date"
          size="small"
          style="width:140px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchUpdateRecord">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="device-upgrade-table layout-container-table height70">
      <el-table
        :data="deviceUpdateRecordList"
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
        <el-table-column
          label="原版本号"
          width="200"
          prop="oldVersion"
        ></el-table-column>
        <el-table-column
          label="升级版本号"
          width="200"
          prop="newVersion"
        ></el-table-column>
        <el-table-column label="升级状态" style="flex: 1">
          <template slot-scope="props">
            {{ getStatus(props.row.updateStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="150">
          <template slot-scope="props">
            {{ props.row.startTime.time | fdatetime }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="150">
          <template slot-scope="props">
            {{
              props.row.updateStatus == 1
                ? "--"
                : props.row.endTime.time | fdatetime
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              v-show="scope.row.updateStatus == 2"
              size="small"
              type="danger"
              @click="deleteUpdateRecord(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="page.limit"
        :total="page.total"
        layout="total, prev, pager, next,jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { queryUpdateRecord, deleteUpdateRecord } from "@/api/production";
export default {
  name: "deviceUpdateRecord",
  data: () => ({
    deviceImei: "",
    oldVersion: "",
    newVersion: "",
    page: {
      current: 0,
      pageSize: 30,
      total: 0,
      num: 1
    },
    height: 630,
    deviceUpdateRecordList: [],
    startTime: new Date("2022, 01, 01"),
    endTime: new Date()
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
    getStatus(num) {
      // 获取升级的状态
      switch (num) {
        case "1":
          return "升级中";
        case "2":
          return "升级成功";
      }
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
    searchUpdateRecord() {
      // 查询升级记录
      let data = {
        page: this.page.current,
        pageSize: this.page.pageSize
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      if (this.oldVersion) {
        data.oldVersion = this.oldVersion;
      }
      if (this.newVersion) {
        data.newVersion = this.newVersion;
      }
      if (this.startTime) {
        data.startTime = new Date(
          new Date(this.startTime).format("yyyy-MM-dd" + " 00:00:00")
        ).getTime();
      }
      if (this.endTime) {
        data.endTime = new Date(
          new Date(this.endTime).format("yyyy-MM-dd" + " 23:59:59")
        ).getTime();
      }
      queryUpdateRecord(data).then(res => {
        if (res.errCode == 200) {
          this.deviceUpdateRecordList = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    deleteUpdateRecord(item) {
      // 删除升级记录
      const data = {
        itemIds: Array.from([item.itemId])
      };
      this.app.$emit("show-confirm-msg", "是否要删除该条升级记录", () => {
        deleteUpdateRecord(data).then(res => {
          if (res.errCode == 200) {
            this.searchUpdateRecord();
            this.$message({
              message: "升级记录删除成功",
              type: "success"
            });
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.page.current = val;
    },
    getTableHeight() {
      let windowH = window.innerHeight;
      if (windowH <= 768) {
        this.height = 462;
      } else {
        this.height = 630;
      }
    },
    listEvent() {
      this.app.$on("load-update-record", this.searchUpdateRecord);
    },
    offEvent() {
      this.app.$off("load-update-record", this.searchUpdateRecord);
    }
  },
  created() {
    this.getTableHeight();
  },
  mounted() {
    this.listEvent();
    window.addEventListener("resize", this.debounce(this.getTableHeight, 200));
  },
  beforeDestroy() {
    this.offEvent();
    window.removeEventListener(
      "resize",
      this.debounce(this.getTableHeight, 200)
    );
  }
};
</script>

<style scoped lang="scss">
.device-record {
  height: 100%;
  ::v-deep .el-form-item__label {
    white-space: nowrap;
  }
}

.device-record,
.device-upgrade-file {
  ::v-deep .el-form {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
    display: flex;
    flex-direction: row;
    margin-right: 5px;
  }
  ::v-deep .el-button {
    padding: 8px 20px !important;
    // vertical-align: middle;
  }
}
</style>
