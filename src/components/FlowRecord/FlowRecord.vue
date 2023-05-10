<template>
  <dialog-comp
    :visible.sync="isShowRecord"
    :dialog-title="$t('withdraw.flowRecord')"
    :dialog-width="1025"
  >
    <div class="flow-record">
      <div class="form-card" style="width: 30%">
        <div class="card-header" style="line-height: 36px">
          {{ $t("common.myCustomer") }}
        </div>
        <div class="card-body">
          <user-tree
            tree-name="Pledge"
            @usertree-select="dealUserTree"
            :user-id.sync="userId"
          ></user-tree>
        </div>
      </div>
      <!-- 右边的表格内容 -->
      <div class="form-card" style="flex: 1; margin-left: 5px">
        <div
          class="card-header"
          style="display: flex; justify-content: space-between; margin-bottom: 5px"
        >
          <div class="left-content-title">
            <span style="color: red">{{ userName }}</span>
          </div>
          <div class="right-content-time">
            <span>{{ $t("common.startTime") }}</span>
            <el-date-picker
              v-model="startTime"
              format="yyyy-MM-dd"
              type="date"
              style="width: 140px"
            ></el-date-picker>
            <span>{{ $t("common.endTime") }}</span>
            <el-date-picker
              v-model="endTime"
              format="yyyy-MM-dd"
              type="date"
              style="width: 140px"
            ></el-date-picker>
            <el-button
              class="btn-primary-button"
              style="padding: 10px 20px"
              @click="loadFlowRecord"
              >{{ $t("common.search1") }}</el-button
            >
          </div>
        </div>
        <div class="flow-record-content">
          <data-table
            :data="flowList"
            @getTabelData="loadFlowRecord"
            :page="page"
            :page-count="page.num"
          >
            <el-table-column :label="$t('withdraw.beforeBalance')" width="100">
              <template slot-scope="props">
                {{ props.row.beforeBalance / 100 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('withdraw.afterBalance')" width="100">
              <template slot-scope="props">
                {{ props.row.afterBalance / 100 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.startTime')" width="150">
              <template slot-scope="props">
                {{ props.row.startDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.endTime')" width="150">
              <template slot-scope="props">
                {{ props.row.endDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')" style="flex: 1">
              <template slot-scope="props">
                {{ getFlowType(props.row.changeType) }}
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
      <!-- end -->
    </div>
  </dialog-comp>
</template>

<script>
import UserTree from "@/components/UserTree/UserTree";
import { queryFlowList } from "@/api/withdraw.js";
export default {
  name: "FlowRecord",
  components: {
    "user-tree": UserTree
  },
  data: () => ({
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    isShowRecord: false,
    flowList: [],
    //查询开始日期
    startTime: new Date().format("yyyy-MM-01"),
    //查询结束日期
    endTime: new Date().format("yyyy-MM-dd"),
    page: {
      current: 1,
      pageSize: 30,
      num: 0,
      total: 0,
      name: "examine"
    }
  }),
  methods: {
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
    loadFlowRecord() {
      // 查询流水的记录
      const data = {
        userId: this.userId,
        page: this.page.current,
        pageSize: this.page.pageSize,
        startTime: new Date(
          new Date(this.startTime).format("yyyy-MM-dd") + " 00:00:00"
        ).getTime(),
        endTime: new Date(
          new Date(this.endTime).format("yyyy-MM-dd") + " 23:59:59"
        ).getTime()
      };

      queryFlowList(data).then(res => {
        if (res.errCode == 200) {
          this.flowList = res.data.list;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    },
    dealUserTree(userId, userName) {
      //改变用户树选中用户
      this.userId = userId;
      this.userName = userName;
      this.page.current = 1;
      this.loadFlowRecord();
    },
    showDialog() {
      // console.log("chufa");
      this.isShowRecord = true;
      this.loadFlowRecord();
    },
    listEvent() {
      this.app.$on("show-flow-record-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$on("show-flow-record-dialog", this.showDialog);
    }
  },
  mounted() {
    this.listEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped lang="scss">
.flow-record {
  display: flex;
  flex-direction: row;
  height: 600px;
  width: 100%;
}
.left-content-title {
  width: 180px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 36px;
}
.flow-record-content {
  height: calc(100% - 40px);
}
</style>
