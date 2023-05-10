<template>
  <section class="recharge-record form-card1 layout-container">
    <div
      class="card-header"
      style="display: flex; justify-content: space-between"
    >
      <div class="left">
        {{ $t("withdraw.withdrawRecord") }}
      </div>
    </div>
    <!-- 右边的记录表格 -->
    <div class="card-body">
      <table class="form-table">
        <tr>
          <td>{{ $t("common.startTime") }}:</td>
          <td>
            <el-date-picker
              v-model="startTime"
              type="date"
              format="yyyy-MM-dd"
              style="width: 150px"
            ></el-date-picker>
          </td>

          <td>{{ $t("common.endTime") }}:</td>
          <td>
            <el-date-picker
              v-model="endTime"
              type="date"
              format="yyyy-MM-dd"
              style="width: 150px"
            ></el-date-picker>
          </td>
          <td>{{ $t("common.status") }}</td>
          <td>
            <!--  -->
            <el-select v-model="selectStatus" style="width: 100px">
              <el-option :value="-1" :label="$t('common.all')"></el-option>
              <el-option :value="0" :label="$t('card.unAudit')"></el-option>
              <el-option :value="1" :label="$t('card.audited')"></el-option>
            </el-select>
          </td>
          <td>
            <el-button type="primary" @click="loadWithdrawList">
              {{ $t("common.search1") }}
            </el-button>
            <el-button type="primary" @click="exportWithdrawRecord">
              {{ $t("common.export") }}
            </el-button>
          </td>
        </tr>
      </table>

      <!--  -->
      <div class="record-table">
        <data-table
          :data="recordList"
          :show-selection="true"
          @getTableData="loadWithdrawList"
          :page="page"
          @selection-change="handleSelectionChange"
        >
          <!--  -->
          <el-table-column :label="$t('common.createTime')" width="160">
            <template slot-scope="props">
              {{ props.row.createDate | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('withdraw.idCard')"
            width="200"
            prop="idCard"
          ></el-table-column>
          <el-table-column :label="$t('withdraw.withdrawMoney')" width="100">
            <template slot-scope="props">
              {{ props.row.price / 100 }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('withdraw.phone')"
            width="140"
            prop="phone"
          ></el-table-column>
          <el-table-column :label="$t('withdraw.withdrawType')" width="140">
            <template slot-scope="props">
              {{
                props.row.type == 1
                  ? $t("withdraw.bankCard")
                  : $t("recharge.alipay1")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" style="flex: 1">
            <template slot-scope="props">
              <el-button
                class="btn-primary-button"
                v-show="props.row.status == 0"
                size="small"
                @click="doExamine(props.row)"
                >{{ $t("recharge.audit") }}</el-button
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
  </section>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import { auditWithdrawOrder, queryWithdrawList } from "@/api/withdraw.js";
export default {
  name: "RechargeExamine",
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    //查询开始日期
    startTime: new Date().format("yyyy-MM-01"),
    //查询结束日期
    endTime: new Date().format("yyyy-MM-dd"),
    recordList: [],
    originList: [],
    selectStatus: -1,
    page: {
      current: 1,
      pageSize: 30,
      num: 0,
      total: 0,
      name: "examine"
    },
    selectList: []
  }),
  watch: {
    searchDevKey() {
      if (!this.searchDevKey) {
        this.searchDev();
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.selectList = val;
    },
    getSelectList() {
      var list = [];
      for (var i = 0; i < this.selectList.length; i++) {
        list.push(this.recordList[this.selectList[i]]);
      }
      return list;
    },
    doExamine(item) {
      console.log(item);
      auditWithdrawOrder({ pkId: item.pkId }).then(res => {
        if (res.errCode == 200) {
          this.loadWithdrawList();
          this.app.$emit(
            "show-alert-msg",
            this.$t("withdraw.auditWithdrawTip")
          );
        } else {
          this.app.$emit("show-alert-msg", res.errMsg);
        }
      });
    },
    getFlowType(num) {
      switch (num) {
        case 1:
          return this.$t("withdraw.orderFlow");
        case 2:
          return this.$t("withdraw.payCard");
        case 3:
          return this.$t("withdraw.withdraw1");
      }
    },
    loadWithdrawList() {
      // 查询审核的记录
      let data = {
        userId: this.userId,
        page: this.page.current,
        pageSize: this.page.pageSize,
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime(),
        status: this.selectStatus == -1 ? "" : this.selectStatus
      };
      queryWithdrawList(data).then(res => {
        if (res.errCode == 200) {
          this.recordList = res.data.list;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    },
    createTableFile(list) {
      // console.log(list);
      let theTitle = [
        this.$t("common.createTime"),
        this.$t("withdraw.idCard"),
        this.$t("withdraw.withdrawMoney"),
        this.$t("withdraw.phone"),
        this.$t("withdraw.withdrawType")
      ];
      let theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          item.createDate
            ? new Date(item.createDate).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.idCard,
          item.price / 100,
          item.phone,
          item.status ? this.getFlowType(item.status) : "--"
        ]);
      }
      ExportUtil.exportTable(
        theTitle,
        theList,
        this.userName + this.$t("withdraw.withdrawRecord")
      );
    },
    exportWithdrawRecord() {
      // 导出提现记录
      if (this.selectList.length == 0) {
        this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
        return;
      }
      this.createTableFile(this.selectList);
    }
  },
  mounted() {
    this.loadWithdrawList();
  }
};
</script>

<style lang="scss" scoped>
.recharge-record {
  .record-table {
    // overflow-y: hidden;
    // overflow-x: auto;
    height: calc(100% - 36px);
  }
}
.flow-record {
  display: flex;
  flex-direction: row;
  height: 600px;
  width: 100%;
}
.left-content-title {
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 36px;
}
</style>
