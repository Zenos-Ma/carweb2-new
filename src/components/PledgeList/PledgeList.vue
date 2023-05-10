<template>
  <div style="height: 100%; width: 100%">
    <!--  -->
    <el-table :data="linkPledgeList" highlight-current-row :height="dHeight">
      <!--  -->
      <el-table-column :label="$t('pledge.pledgeTip')" width="110">
        <template slot-scope="props">
          <a @click="showFence(props.$index, props.row)">{{
            props.row.defenseName
          }}</a>
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
  name: "pledgeList",
  data: () => ({}),
  props: {
    dHeight: {
      type: Number,
      default: 237
    },
    linkPledgeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    linkList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    pledgeId: {
      type: Number,
      default: 0
    },
    isOperate: {
      type: Boolean,
      default: true
    },
    isDel: {
      type: Boolean,
      default: false
    },
    isTip: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onLinkFence(idx, item) {
      this.$emit("link-pledge", idx, item);
    },
    onDelFence(idx, item) {
      this.$emit("del-fence", idx, item);
    },
    onUnlinkPledge(idx, item) {
      this.$emit("unlink-pledge", idx, item);
    },
    onLinkPledge(idx, item) {
      this.$emit("link-pledge", idx, item);
    },
    getLinkState(item) {
      // console.log(item.rdId);
      // console.log(this.linkList);
      if (item) {
        for (var i = 0; i < this.linkList.length; i++) {
          if (item.rdId == this.linkList[i].rdId || item.rdId == null) {
            return true;
          }
        }
        return false;
      }
    },
    showArea(idx, item) {
      this.$emit("select-pledge", idx, item);
    },
    showFence(idx, item) {
      this.$emit("select-pledge", idx, item);
    },
    onUnLinkFence(idx, item) {
      this.$emit("unlink-fence", idx, item);
    }
  },
  mounted() {}
};
</script>
