<template>
  <section class="body-content bluetooth-status layout-container">
    <div class="form-card1">
      <div class="card-header">
        风控蓝牙设备管理
      </div>
    </div>
    <div class="blue-content">
      <div class="top">
        设备
        <el-input
          class="input-device-search"
          prefix-icon="el-icon-search"
          size="small"
          v-model="deviceImei"
          @keyup.native.enter="searchDev"
          style="width:180px;"
          clearable
        ></el-input>
        <el-button
          type="primary"
          size="small"
          style="padding:8px 12px !important;"
          @click="searchDev"
        >
          {{ $t("common.search") }}
        </el-button>

        <device-box
          :is-show.sync="isDeviceBox"
          :search-key="deviceImei"
          @select-result="dealDevItem"
        ></device-box>
        <el-button
          type="primary"
          size="small"
          style="padding:8px 12px !important;"
          @click="exportTable"
        >
          导出
        </el-button>
        <div style="margin-top:5px">
          {{ $t("common.startTime") }}:
          <el-date-picker
            v-model="startTime"
            type="datetime"
            style="width:190px"
            :placeholder="$t('common.chooseTime')"
            ref="fromtime"
          >
          </el-date-picker>
          {{ $t("common.endTime") }}:
          <el-date-picker
            v-model="endTime"
            type="datetime"
            style="width:190px"
            :placeholder="$t('common.chooseTime')"
            ref="fromtime"
          >
          </el-date-picker>
          <el-button
            type="primary"
            size="small"
            style="padding: 11px 12px !important;vertical-align: bottom;"
            @click="loadBluetoothStatus"
          >
            获取
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="padding: 11px 12px !important;vertical-align: bottom;"
            @click="loadBluetoothStatus1"
          >
            一键获取
          </el-button>
        </div>
      </div>
      <div class="main-blue">
        <!--  -->
        <data-table
          :data="deviceBluetoothStatusList"
          :show-index="true"
          :page="page"
          @getTableData="loadBluetoothStatus1"
          :show-page="isShowPage"
        >
          <el-table-column label="时间" width="130px">
            <template slot-scope="props">
              {{ props.row.statusTime.time | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="130px">
            <template slot-scope="props">
              {{ getSts(props.row.statusTime.time) }}
            </template>
          </el-table-column>
          <el-table-column label="Mac地址" width="130px">
            <template slot-scope="props">
              {{ splitArr(props.row.btAddress) }}
            </template>
          </el-table-column>
          <el-table-column label="蓝牙类型" width="130px">
            <template slot-scope="props">
              {{ getBlueType(props.row) }}
            </template>
          </el-table-column>
          <el-table-column label="信号值" width="130px">
            <template slot-scope="props">
              {{ props.row.signals }}
            </template>
          </el-table-column>
          <el-table-column label="电量" width="130px">
            <template slot-scope="props">
              {{ props.row.battery > 0 ? props.row.battery : "--" }}%
            </template>
          </el-table-column>
          <el-table-column label="安装位置" style="flex:1">
            <template slot-scope="props">
              {{ props.row.position }}
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
  </section>
</template>

<script>
import DeviceBox from "@/components/DeviceBox";
import mapUtil from "@/utils/mapUtil.js";
import ExportUtil from "@/utils/exportUtil.js";
import {
  queryHistBtStatusList,
  queryBlueToothStatus
} from "@/api/deviceBlueTooth";
export default {
  name: "DeviceBluetoothStatus",
  components: {
    "device-box": DeviceBox
  },
  data: () => ({
    deviceImei: "",
    isDeviceBox: false,
    searchType: "device", //搜索设备类型提示
    searchKey: "", //搜索设备类型
    deviceBluetoothStatusList: [],
    selectList: [],
    refreshInterval: null, //定时刷新表格
    isfresh: false,
    page: {
      name: "DeviceBluetoothStatus",
      current: 1,
      limit: 30,
      num: 1
    },
    startTime: new Date().format("yyyy-MM-dd 00:00:00"),
    endTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
    isShowPage: false
  }),
  watch: {
    isfresh() {
      if (this.isfresh) {
        this.refreshDevice();
      }
    },
    deviceImei() {
      if (!this.deviceImei) {
        this.isfresh = false;
        if (this.refreshInterval) {
          this.refreshInterval = clearInterval(this.refreshInterval);
        }
        this.deviceBluetoothStatusList = [];
      }
    }
  },
  methods: {
    exportTable() {
      // 导出一天的数据
      const data = {
        deviceImei: this.deviceImei,
        page: this.page.current,
        pageSize: 100000,
        startTime: new Date(this.startTime).getTime(),
        endTime: new Date(this.endTime).getTime()
      };
      queryHistBtStatusList(data).then(res => {
        if (res.errCode == 200) {
          this.exportEcall(res.data.data);
        }
      });
    },
    exportEcall(list) {
      if (list == 0) {
        this.app.$emit("show-alert-msg", "暂无数据");
        return;
      }
      const theTitle = [
        "序号",
        "时间",
        "状态",
        "Mac地址",
        "蓝牙类型",
        "信号值",
        "电量",
        "安装位置"
      ];
      const theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.statusTime.time
            ? new Date(item.statusTime.time).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          this.getSts(item.statusTime.time),
          this.splitArr(item.btAddress),
          this.getBlueType(item.type),
          item.signals,
          item.battery > 0 ? item.battery : "--" + "%",
          item.position
        ]);
      }
      ExportUtil.exportTable(
        theTitle,
        theList,
        this.deviceImei + "的蓝牙绑定表格"
      );
    },
    getSts() {
      return mapUtil.cnStatus2;
    },
    splitArr(str) {
      var formatStr = [];
      for (var i = 0; i < str.length; i++) {
        if (i % 2 === 0) formatStr.push(":");

        formatStr.push(str[i]);
      }
      return formatStr
        .join("")
        .slice(1)
        .toUpperCase();
    },
    getBlueType(item) {
      switch (item.type) {
        case 0:
          return "蓝牙主机";
        case 1:
          return "螺帽";
        case 2:
          return "物流锁";
      }
    },
    searchDev() {
      //搜索设备
      if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
        this.isDeviceBox = true;
      } else {
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
        this.isDeviceBox = false;
      }
    },
    loadBluetoothStatus() {
      if (!this.deviceImei) {
        this.app.$emit("show-alert-msg", "请输入设备号");
        return;
      }
      let data = {
        deviceImei: this.deviceImei
      };
      this.isfresh = false;
      queryBlueToothStatus(data).then(res => {
        if (res.errCode == 200) {
          this.isShowPage = false;
          this.isfresh = true;
          this.deviceBluetoothStatusList = res.data.list;
          this.deviceBluetoothStatusList = this.deviceBluetoothStatusList.filter(
            item => {
              // console.log(item);
              return item.type != 0;
            }
          );
        } else {
          this.app.$emit("show-alert-msg", res.errMsg);
        }
      });
    },
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
    },
    loadBluetoothStatus1() {
      if (!this.deviceImei) {
        this.app.$emit("show-alert-msg", "请输入设备号");
        return;
      }
      const data = {
        deviceImei: this.deviceImei,
        page: this.page.current,
        pageSize: this.page.limit,
        startTime: new Date(this.startTime).getTime(),
        endTime: new Date(this.endTime).getTime()
      };
      this.isShowPage = false;
      queryHistBtStatusList(data).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          this.isShowPage = true;
          this.page.num = Math.ceil(res.data.totalCount / this.page.limit);
          this.deviceBluetoothStatusList = res.data.data;
          this.deviceBluetoothStatusList = this.deviceBluetoothStatusList.filter(
            item => {
              // console.log(item);
              return item.type != 0;
            }
          );
        }
      });
    },
    refreshDevice() {
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }
      let timeDemo = 3;
      this.refreshInterval = setInterval(() => {
        if (timeDemo <= 0) {
          timeDemo = 3;
          // this.loadBluetoothStatus();
        } else {
          timeDemo--;
        }
      }, 1000);
    }
  },
  mounted() {},
  beforeDestroy() {
    if (this.refreshInterval)
      this.refreshInterval = clearInterval(this.refreshInterval);
    clearInterval(this.refreshInterval);
  }
};
</script>

<style lang="scss" scoped>
.blue-content {
  height: calc(100% - 30px);
  .top {
    padding: 10px 0;
  }
  .main-blue {
    height: calc(100% - 90px);
  }
}
</style>
