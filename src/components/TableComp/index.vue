<template id="table_content">
  <div class="system-table-box">
    <el-table
      class="system-table"
      :border="border"
      :height="tableHeight"
      :data="data"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        type="selection"
        align="center"
        width="50"
        v-if="showSelection"
      />
      <el-table-column
        :label="$t('common.num')"
        width="60"
        align="center"
        v-if="showIndex"
      >
        <template slot-scope="props">
          {{ (page.current - 1) * page.pageSize + props.$index + 1 }}
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination
      v-if="showPage"
      :current-page="page.current"
      class="system-page"
      background
      :layout="pageLayout"
      :total="page.total"
      :page-size="page.pageSize"
      :page-sizes="pageSizes"
      :page-count="pageCount"
      :pager-count="pagerCount"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableHeight: {
      type: String,
      default: "100%"
    },
    border: {
      type: Boolean,
      default: true
    },
    data: { type: Array, default: () => [] }, // 数据源
    select: { type: Array, default: () => [] }, // 已选择的数据，与selection结合使用
    showIndex: { type: Boolean, default: false }, // 是否展示index选择，默认否
    showSelection: { type: Boolean, default: false }, // 是否展示选择框，默认否
    showPage: { type: Boolean, default: true }, // 是否展示页级组件，默认是
    pageCount: { type: Number, default: 0 },
    page: {
      // 分页参数
      type: Object,
      default: () => {
        return { current: 1, pageSize: 20, total: 0, num: 0 };
      }
    },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    }, // 分页需要显示的东西，默认全部
    pageSizes: {
      tyep: Array,
      default: () => [15, 20, 30, 50]
    },
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  data: function() {
    return {
      timer: null
    };
  },
  methods: {
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
      // 分页相关：监听页码切换事件
      if (this.timer) {
        this.page.current = 1;
      } else {
        this.page.current = val;
        this.$emit("getTableData");
      }
    },
    handleSizeChange(val) {
      console.log(val);
      this.timer = "work";
      setTimeout(() => {
        this.timer = null;
      }, 100);
      this.page.pageSize = val;
      this.$emit("getTableData", true);
    },
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.system-table-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}
.system-table-box .system-table {
  flex: 1;
  height: 100%;
}
.system-table-box .system-page {
  margin-top: 10px;
}
::v-deep .el-table--scrollable-y .el-table__body-wrapper {
  // height: unset !important;
}
</style>
