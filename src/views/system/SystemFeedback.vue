<template>
  <div class="form-card layout-container">
    <!--用户反馈表格 -->
    <div class="card-header">{{ $t("systemFeedback.msgList") }}</div>
    <div class="card-body">
      <div style="line-height: 4rem">
        <el-button type="primary" @click="loadFeedbackList">{{
          $t("common.refresh")
        }}</el-button>
      </div>
      <div class="back-list">
        <data-table
          :data="feedbackList"
          :page="page"
          @getTableData="loadFeedbackList"
          :page-count="page.num"
        >
          <!--  -->
          <el-table-column
            :label="$t('systemFeedback.sender')"
            prop="loginNo"
            width="150"
          ></el-table-column>
          <el-table-column
            :label="$t('systemFeedback.sendTime')"
            prop="stsTimeStr"
            width="150"
          ></el-table-column>
          <el-table-column :label="$t('systemFeedback.iphone')" width="150">
            <template slot-scope="props">
              {{ props.row.iphone ? props.row.iphone : "--" }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('systemFeedback.content')"
            prop="opContent"
            style="flex: 1"
          ></el-table-column>
        </data-table>
      </div>
    </div>
  </div>
</template>

<script>
import { loadFeedbackList } from "@/api/system.js";
export default {
  name: "SystemFeedback",
  components: {},
  props: {},
  data: () => ({
    //反馈表格数据
    feedbackList: [],
    page: {
      name: "feedbackList",
      current: 1,
      num: 1,
      pageSize: 30,
      total: 0
    }
  }),
  methods: {
    loadFeedbackList() {
      //加载反馈表格
      var data = {
        page: this.page.current,
        pageSize: this.page.pageSize
      };
      loadFeedbackList(data).then(res => {
        if (res.errCode == "200") {
          this.feedbackList = res.data.ops;
          this.page.num = res.data.pageCount;
          this.page.total = res.data.total;
        }
      });
    },
    listenEvent() {},
    offEvent() {}
  },
  mounted() {
    this.listenEvent();
    this.loadFeedbackList();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.back-list {
  height: calc(100% - 50px);
}
</style>
