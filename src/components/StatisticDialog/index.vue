<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('statisticDialog.statistic')"
    :dialog-width="800"
  >
    <div class="device-statistic-dialog">
      <div class="form-table1">
        <div v-show="selectTab == 1">
          <span>{{ $t("common.type") }}:</span>
          <span>
            <el-select
              v-model="currentTab"
              v-show="selectTab == 1"
              style="width: 130px"
              size="medium"
            >
              <el-option
                :value="idx"
                v-for="(item, idx) in statisticTabs"
                :key="idx"
                :label="item.text"
              ></el-option>
            </el-select>
          </span>
        </div>
        <div>
          <span>{{ $t("warnList.model") }}:</span>
          <span>
            <el-select
              v-model="selectModel"
              :placeholder="$t('rechargePurchase.pleaseChoose')"
              style="width: 130px"
              size="medium"
            >
              <el-option :label="$t('common.all')" value></el-option>
              <el-option
                :value="item"
                v-for="(item, idx) in modelList"
                :key="idx"
                :label="item"
              ></el-option>
            </el-select>
          </span>
          <span>{{ $t("statisticDialog.timeRange") }}:</span>
          <span
            ><el-date-picker
              v-model="tFrom"
              type="date"
              :placeholder="$t('common.chooseTime')"
              style="width: 150px"
              size="medium"
            ></el-date-picker></span
          >-
          <span
            ><el-date-picker
              v-model="tTo"
              type="date"
              :placeholder="$t('common.chooseTime')"
              style="width: 150px"
              size="medium"
            ></el-date-picker
          ></span>
        </div>
      </div>

      <ul class="select-tabs1">
        <li :class="[selectTab == 0 ? 'active' : '']" @click="selectTab = 0">
          {{ $t("statisticDialog.statistic") }}
        </li>
        <li :class="[selectTab == 1 ? 'active' : '']" @click="selectTab = 1">
          {{ $t("statisticDialog.table") }}
        </li>
        <li style="flex: 1; text-align: right">
          <el-checkbox v-model="isChild">{{
            $t("common.containChild")
          }}</el-checkbox>
          <el-button
            type="primary"
            size="small"
            @click="selectTab == 1 ? loadStatistic() : loadDevices()"
            style="margin: 0 8px"
            >{{ $t("common.search") }}</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="exportTable"
            v-if="tableList.length > 0"
            >{{ $t("common.export") }}</el-button
          >
        </li>
      </ul>
      <div v-show="selectTab == 0">
        <table style="margin: 0 auto; font-size: 20px" class="form-table">
          <tr
            v-for="(item, idx) in statisticTabs"
            :key="item.val"
            style="line-height: 30px; cursor: pointer"
            @click="showDevices(idx)"
          >
            <td>{{ item.text }}:</td>
            <td>
              <span style="color: red; padding: 0 8px; font-weight: bold">{{
                item.num
              }}</span>
              {{ $t("statisticDialog.tai") }}
            </td>
          </tr>
        </table>
      </div>
      <div v-show="selectTab == 1" style="padding-top: 8px">
        <div class="table-content-list" style="height: 425px">
          <data-table
            :data="tableList"
            :page="page"
            @getTableData="loadStatistic"
            :show-page="true"
            :show-index="false"
            :showSelection="false"
            id="statistics_table"
          >
            <!--  -->
            <el-table-column
              :label="$t('common.deviceImei')"
              prop="deviceImei"
              min-width="140"
            ></el-table-column>
            <el-table-column
              :label="$t('common.deviceName')"
              prop="deviceName"
              min-width="130"
            ></el-table-column>
            <el-table-column
              :label="$t('warnList.model')"
              prop="model"
              min-width="110"
            ></el-table-column>
            <el-table-column
              :label="$t('common.carNo')"
              prop="plateNumber"
              min-width="110"
            ></el-table-column>
            <el-table-column :label="$t('common.simNo')" min-width="120">
              <template slot-scope="props">
                {{
                  props.row.msisdn && props.row.msisdn != "undefined"
                    ? props.row.msisdn
                    : "--"
                }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('deviceDetail.importTime')"
              min-width="110"
            >
              <template slot-scope="props">
                {{ props.row.importTime | fdate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('customer.openTime')" min-width="110">
              <template slot-scope="props">
                {{ props.row.enableDate | fdate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('customer.expireTime')" min-width="110">
              <template slot-scope="props">
                {{ props.row.expireDate | fdate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('customer.signalTime')" min-width="150">
              <template slot-scope="props">
                {{ props.row.signalTime | fdatetime }}
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>
  </dialog-comp>
</template>
<script>
import ExportUtil from "@/utils/exportUtil.js";
import {
  loadStatisticDevices,
  loadDevStatistic,
  loadDevModel
} from "@/api/account.js";
export default {
  name: "StatisticDialog",
  props: {},
  components: {},
  data: () => ({
    isShow: false,
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    selectTab: 0,
    currentTab: 0,
    statisticTabs: [],
    tableList: [],
    selectModel: "",
    modelList: [],
    isChild: false,
    tFrom: "2000-01-01",
    tTo: new Date().format("yyyy-MM-dd"),
    page: {
      pageSize: 15,
      current: 1,
      num: 1,
      total: 0
    }
  }),
  methods: {
    showDevices(idx) {
      this.currentTab = idx;
      if (this.statisticTabs[idx].num > 0) {
        this.page.current = 1;
        this.selectModel = "";
        this.selectTime = "";
        this.isChild = false;
        //this.tFrom = 0;
        //this.tTo = 0;

        this.loadStatistic();
      } else {
        this.selectTab = 1;
        this.tableList = [];
      }
    },
    loadStatistic() {
      //加载设备统计设备信息表格
      const data = {
        userId: this.userId,
        isContainSub: this.isChild,
        model: this.selectModel,
        startImportTime: parseInt(new Date(this.tFrom).getTime() / 1000),
        endImportTime: parseInt(new Date(this.tTo).getTime() / 1000),
        pageSize: this.page.pageSize,
        page: this.page.current,
        statisticsType: this.statisticTabs[this.currentTab].val
      };
      loadStatisticDevices(data).then(res => {
        if (res.errCode == "200") {
          this.selectTab = 1;
          this.tableList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
        } else {
          this.app.$emit("show-alert-msg", this.$t("statisticDialog.loadFail"));
        }
      });
    },
    loadDevices() {
      //加载设备统计数量
      const data = {
        userId: this.userId,
        isContainSub: this.isChild,
        model: this.selectModel,
        startImportTime: parseInt(new Date(this.tFrom).getTime() / 1000),
        endImportTime: parseInt(new Date(this.tTo).getTime() / 1000)
      };
      loadDevStatistic(data).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          this.statisticTabs[0].num = data.monitorDeviceTotal;
          this.statisticTabs[1].num = data.onlineTotal;
          this.statisticTabs[2].num = data.sevendayOfflineTotal;
          this.statisticTabs[3].num = data.offlineTotal;
          this.statisticTabs[4].num = data.useMonitorDeviceTotal;
          this.statisticTabs[5].num = data.arrearsTotal;
          this.statisticTabs[6].num = data.notEnabledTotal;
        } else {
          this.app.$emit("show-alert-msg", this.$t("statisticDialog.loadFail"));
        }
      });
    },
    createTable(tableList) {
      //表格数据
      var title = [
        this.$t("common.deviceImei"),
        this.$t("common.deviceName"),
        this.$t("warnList.model"),
        this.$t("common.carNo"),
        this.$t("common.simNo"),
        this.$t("deviceDetail.importTime"),
        this.$t("customer.openTime"),
        this.$t("customer.expireTime"),
        this.$t("customer.signalTime")
      ];
      var list = [];
      for (var i = 0; i < tableList.length; i++) {
        var item = tableList[i];
        list.push([
          item.deviceImei,
          item.deviceName,
          item.model,
          item.plateNumber,
          item.msisdn,
          item.importTime
            ? new Date(item.importTime).format("yyyy-MM-dd")
            : "--",
          item.enableDate
            ? new Date(item.enableDate).format("yyyy-MM-dd")
            : "--",
          item.expireDate
            ? new Date(item.expireDate).format("yyyy-MM-dd")
            : "--",
          item.signalTime
            ? new Date(item.signalTime).format("yyyy-MM-dd hh:mm:ss")
            : "--"
        ]);
      }

      ExportUtil.exportTable(title, list);
    },
    exportTable() {
      //导出设备表格
      const data = {
        userId: this.userId,
        isContainSub: this.isChild,
        model: this.selectModel,
        startImportTime: parseInt(new Date(this.tFrom).getTime() / 1000),
        endImportTime: parseInt(new Date(this.tTo).getTime() / 1000),
        pageSize: 1000000,
        page: this.page.current,
        statisticsType: this.statisticTabs[this.currentTab].val
      };
      loadStatisticDevices(data).then(res => {
        if (res.errCode == "200") {
          this.createTable(res.data.list);
        } else {
          this.app.$emit("show-alert-msg", this.$t("statisticDialog.loadFail"));
        }
      });
    },
    loadModel() {
      //获取设备类型
      loadDevModel().then(res => {
        if (res.errCode == "200") {
          this.modelList = res.data.modelList;
        }
      });
    },
    showDialog() {
      //添加用户对话框
      this.isShow = true;
      this.selectTab = 0;
      this.statisticTabs = JSON.parse(
        JSON.stringify(this.$t("statisticDialog.statisticTabs"))
      );
      this.loadModel();
      this.loadDevices();
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-statistic-dialog", this.showDialog);
      this.app.$on("close-statistic-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-statistic-dialog", this.showDialog);
      this.app.$off("close-statistic-dialog", this.closeDialog);
    }
  },
  mounted() {
    // this.loadModel();

    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.device-statistic-dialog {
  height: 500px;
  ::v-deep .el-input__icon {
    line-height: 36px !important;
  }
}
table.form-table {
  select.text-input,
  input[type="date"].text-input {
    width: 80px !important;
  }
}
.form-table1 {
  display: flex;
  align-items: center;
  margin: 2px 0;
  div {
    display: flex;
    align-items: center;
    span {
      padding: 0 5px;
    }
  }
}
</style>
