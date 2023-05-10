<template>
  <div class="form-card1 sim-info layout-container">
    <!--Sim表格 -->
    <div class="card-header">{{ $t("simInfo.simList") }}</div>
    <div class="card-body">
      <div class="left-right-box" style="line-height: 30px">
        <span class="left-box">
          <el-button type="primary" @click="refreshSim">{{
            $t("common.refresh")
          }}</el-button>
          <el-button type="primary" @click="exportSim">{{
            $t("common.export")
          }}</el-button>
          <el-button type="primary" @click="exportSim('all')">{{
            $t("common.exportAll")
          }}</el-button>
          <el-button type="primary" @click="showBatchSearchSim">{{
            $t("simInfo.batchSearch")
          }}</el-button>
        </span>
        <span class="right-box">
          <el-input
            style="width: 160px"
            :placeholder="$t('simInfo.searchTip')"
            @keyup.enter.native="searchSim"
            v-model="searchKey"
          />
          <el-button type="primary" @click="searchSim">{{
            $t("common.search")
          }}</el-button>
        </span>
      </div>
      <data-table
        style="height: calc(100% - 35px)"
        :data="simList"
        :show-index="true"
        :page="page"
        @getTableData="dealPager"
      >
        <!--  -->
        <el-table-column
          label="ICCID"
          prop="iccid"
          min-width="170"
        ></el-table-column>
        <el-table-column
          :label="$t('common.simNo')"
          prop="msisdn"
          min-width="130"
        ></el-table-column>
        <el-table-column
          :label="$t('simInfo.supplierName')"
          prop="supplierName"
          min-width="130"
        ></el-table-column>
        <el-table-column :label="$t('simInfo.flowExpiry')" min-width="140">
          <template slot-scope="props">
            {{ props.row.flowExpiry | fdate }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.type')"
          prop="type"
          min-width="100"
        ></el-table-column>
        <el-table-column
          :label="$t('common.operation')"
          width="120"
          fixed="right"
        >
          <template slot-scope="props">
            <el-button
              class="primary-btn-table-shadow"
              size="small"
              @click="dealTableOp(props.row, props.$index, 'simUpdateFlow')"
              v-if="!props.row.flowExpiry"
              >{{ $t("simInfo.queryFlow") }}</el-button
            >
            <el-button
              class="primary-btn-table-shadow-green"
              size="small"
              @click="dealTableOp(props.row, props.$index, 'simUpdateFlow')"
              v-if="props.row.flowExpiry"
              :disabled="props.row.supplierName == '中国移动'"
              >{{ $t("simInfo.updateFlow") }}</el-button
            >
          </template>
        </el-table-column>
      </data-table>
    </div>
    <dialog-comp
      :visible.sync="isShow"
      :dialogTitle="$t('simInfo.batchSearch')"
      :dialogWidth="500"
    >
      <div class="batch-search-sim">
        <el-form label-width="160px">
          <el-form-item label="iccid">
            <el-input
              type="textarea"
              :rows="4"
              :placeholder="$t('simInfo.rowOne')"
              style="width:200px"
              v-model="deviceImeis"
              clearable
            ></el-input
            ><br />
            <span style="font-size: 14px;color: #606266;">{{
              $t("simInfo.moreThan50")
            }}</span>
          </el-form-item>
        </el-form>
        <div class="btn-cont">
          <el-button @click="batchSearchSim">{{
            $t("common.search")
          }}</el-button>
        </div>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import {
  loadSimList,
  updateSimInfo,
  searchSimInfo,
  batchSearchSimList
} from "@/api/system.js";
export default {
  name: "SimInfo",
  props: {},
  components: {},
  data: () => ({
    simList: [], //sim表格数据
    page: {
      //sim显示表分页器
      name: "simList",
      current: 1,
      pageSize: 30,
      num: 1,
      total: 0
    },
    originList: "[]",
    searchKey: "",
    isSearch: false,
    firstSearch: false,
    isShow: false,
    deviceImeis: "",
    isBatch: false
  }),
  watch: {
    searchKey() {
      if (!this.searchKey) {
        this.isSearch = false;
        this.page.current = 1;
        this.loadsimList();
      }
      this.firstSearch = true;
    }
  },
  methods: {
    showBatchSearchSim() {
      this.isShow = true;
      this.deviceImeis = "";
    },
    batchSearchSim() {
      // 批量查询
      this.isBatch = true;
      let list = this.deviceImeis.replace(/\n|\r\n/g, ",");
      // console.log(list);
      let arrList = list.split(",");
      let stsList = [];
      stsList = arrList.map(el => el.replace(/\s*/g, ""));
      // console.log("stsList", stsList);
      // return;
      if (!arrList) {
        this.app.$emit("show-alert-msg", this.$t("simInfo.inputDeviceTip"));
        return;
      }
      const data = {
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        iccids: stsList.join(",")
      };
      batchSearchSimList(data).then(res => {
        if (res.errCode == 200) {
          this.simList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
          this.isShow = false;
        } else {
          this.app.$emit("show-alert-msg", this.$t("simInfo.simListTip"));
        }
      });
    },
    refreshSim() {
      //刷新当前表格
      this.isBatch = false;
      if (this.isSearch) {
        this.searchSim();
      } else {
        this.loadsimList();
      }
    },
    loadsimList() {
      //加载sim列表
      this.isBatch = false;
      const data = {
        pageNo: this.page.current,
        pageSize: this.page.pageSize
      };
      loadSimList(data).then(res => {
        if (res.errCode == "200") {
          this.simList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
        } else {
          this.app.$emit("show-alert-msg", this.$t("simInfo.simListTip"));
        }
      });
    },
    exportSim(tag) {
      //导出sim卡号
      if (tag == "all") {
        const data = {
          pageNo: 1,
          pageSize: 10000000
        };
        loadSimList(data).then(res => {
          if (res.errCode == "200") {
            this.exportTable(
              res.data.list,
              "全部SIM卡信息_" + new Date().format("yyyyMMddhhmmss")
            );
          } else {
            this.app.$emit("show-alert-msg", this.$t("simInfo.simListTip"));
          }
        });
      } else {
        this.exportTable(
          this.simList,
          `第${this.page.current}页SIM卡信息_${new Date().format(
            "yyyyMMddhhmmss"
          )}`
        );
      }
    },
    exportTable(data, name) {
      //导出xls
      var title = [
        "序号",
        "ICCID",
        "sim号",
        "供应商",
        "流量到期时间",
        "是否到期",
        "类型"
      ];
      var list = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        list.push([
          i + 1,
          item.iccid,
          item.msisdn,
          item.supplierName,
          new Date(item.flowExpiry).getTime() > 0 ? item.flowExpiry : "--",
          this.$t(
            new Date(item.flowExpiry).getTime() < new Date().getTime()
              ? "deviceDetail.yes"
              : "deviceDetail.no"
          ),
          item.type
        ]);
      }
      ExportUtil.exportTable(title, list, name);
    },
    updateSIM(iccid, idx) {
      //更新流量到期时间
      const data = {
        iccid: iccid,
        forceUpdate: 1
      };
      updateSimInfo(data).then(res => {
        if (res.errCode == "200") {
          this.simList[idx].flowExpiry = res.data.flowExpiry;
          this.app.$emit("show-alert-msg", this.$t("simInfo.updateSuccess"));
        } else {
          this.app.$emit("show-alert-msg", this.$t("simInfo.updateFail"));
        }
      });
    },
    searchSim() {
      //搜索sim卡
      var that = this;
      if (this.searchKey) {
        if (this.getStrLen(this.searchKey) >= this.imeiLen) {
          this.isSearch = true;

          if (this.firstSearch) {
            this.page.current = 1;
            this.firstSearch = false;
          }
          //
          const data = {
            pageNo: this.page.current,
            pageSize: this.page.pageSize,
            key: this.searchKey
          };
          searchSimInfo(data).then(res => {
            if (res.errCode == "200") {
              that.simList = res.data.list;
              that.page.num = Math.ceil(res.data.total / that.page.limit);
            } else {
              that.app.$emit("show-alert-msg", that.$t("simInfo.simListTip"));
            }
          });
        } else {
          this.isSearch = false;
          this.app.$emit("show-alert-msg", this.$t("simInfo.searchTip2"));
        }
      } else {
        this.isSearch = false;
        this.app.$emit("show-alert-msg", this.$t("simInfo.searchTip1"));
      }
    },
    dealTableOp(item, idx, name) {
      //处理表格操作
      if (name == "simUpdateFlow") {
        this.updateSIM(item.iccid, idx);
      }
    },
    dealPager() {
      //处理分页器
      if (this.isSearch) {
        this.searchSim();
      } else {
        if (this.isBatch) {
          this.batchSearchSim();
        } else {
          this.loadsimList();
        }
      }
    },
    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    this.loadsimList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.btn-cont {
  text-align: center;
}
</style>
