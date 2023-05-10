<template>
  <div style="height: 100%; width: 100%" class="fence-list">
    <el-table :data="fenceList" highlight-current-row :height="dHeight">
      <!--  -->
      <el-table-column :label="$t('fence.fenceName')" width="110">
        <template slot-scope="props">
          <a
            @click="showFence(props.$index, props.row)"
            v-show="props.row.shapeType != '2'"
            >{{ props.row.defenseName }}</a
          >
          <a
            @click="showArea(props.$index, props.row)"
            v-show="props.row.shapeType == '2'"
            >{{ props.row.address }}</a
          >
          <div style="color: gray" v-if="isTip">
            ({{
              $t(
                props.row.shapeType == "2"
                  ? "fenceDevice.district"
                  : "fenceDevice.polygon"
              )
            }})
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.createTime')" width="140">
        <template slot-scope="props">
          {{ props.row.createTime | fdatetime }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" style="flex: 1">
        <template slot-scope="props">
          <a
            @click="onUnLinkFence(props.$index, props.row)"
            v-show="getLinkState(props.row)"
            v-if="isOperate"
            >{{ $t("fence.unlink") }}</a
          >
          <a
            @click="onLinkFence(props.$index, props.row)"
            v-show="!getLinkState(props.row)"
            v-if="isOperate"
            >{{ $t("fence.link") }}</a
          >
          <a @click="onDelFence(props.$index, props.row)" v-if="isDel">{{
            $t("common.delete")
          }}</a>
          <a @click="onLinkFence(props.$index, props.row)" v-if="!isOperate">{{
            $t("fence.link")
          }}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "FenceList",
  props: {
    // dHeight: {
    //   type: String,
    //   default: "237"
    // },
    isOperate: {
      type: Boolean,
      default: true
    },
    linkList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fenceList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fenceId: {
      type: Number,
      default: 0
    },
    isTip: {
      type: Boolean,
      default: false
    },
    isDel: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    name: "",
    dHeight: "100%"
  }),
  methods: {
    getLinkState(item) {
      for (var i = 0; i < this.linkList.length; i++) {
        if (item.rdId == this.linkList[i].rdId) {
          return true;
        }
      }
      return false;
    },
    onUnLinkFence(idx, item) {
      this.$emit("unlink-fence", idx, item);
    },
    onLinkFence(idx, item) {
      this.$emit("link-fence", idx, item);
    },
    onDelFence(idx, item) {
      this.$emit("del-fence", idx, item);
    },
    showArea(idx, item) {
      this.$emit("select-area", idx, item);
    },
    showFence(idx, item) {
      this.$emit("select-fence", idx, item);
    },
    showRowTable(item, idx) {
      // console.log(item);
      this.$emit("show-link-table", item, idx);
    }
  },
  mounted() {
    // console.log(this.getLinkState());
  }
};
</script>

<style lang="scss" scoped>
.fence-list {
  ::v-deep .el-table .el-table__cell {
    font-size: 12px !important;
  }
  ::v-deep .el-table__body tr.current-row > td.el-table__cell {
    background-color: #c3daf4;
  }
}
</style>
