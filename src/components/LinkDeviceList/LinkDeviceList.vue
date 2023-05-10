<template>
  <div style="height: 100%; width: 100%" class="link-device-list">
    <el-table :data="devList" highlight-current-row :height="dHeight">
      <!--  -->
      <el-table-column :label="$t('common.deviceImei')" width="140">
        <template slot-scope="props">
          <a @click="showDevice(props.row)">{{ props.row.deviceImei }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.deviceName')" width="130">
        <template slot-scope="props">
          <a @click="showDevice(props.row)">{{
            props.row.deviceName ? props.row.deviceName : props.row.name
          }}</a>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('common.deviceName')"
        style="flex: 1"
        v-show="isOperate"
      >
        <template slot-scope="props">
          <a
            @click="onLink(props.$index, props.row)"
            v-show="!getLinkState(props.row)"
            >{{ $t("fence.link") }}</a
          >
          <a
            @click="onUnLink(props.$index, props.row)"
            v-show="getLinkState(props.row)"
            >{{ $t("fence.unlink") }}</a
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "LinkDeviceList",
  props: {
    dHeight: {
      type: String,
      default: "505"
    },
    isOperate: {
      type: Boolean,
      default: false
    },
    isLink: {
      type: Boolean,
      default: false
    },
    isUnlink: {
      type: Boolean,
      default: false
    },
    linkList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    devList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    deviceImei: {
      type: String,
      default: ""
    }
  },
  methods: {
    getLinkState(item) {
      // console.log(item);
      for (var i = 0; i < this.linkList.length; i++) {
        if (this.linkList[i].deviceImei == item.deviceImei) {
          return true;
        }
      }
      return false;
    },
    showDevice(item) {
      // console.log(item);
      this.$emit("update:deviceImei", item.deviceImei);
      this.$emit("select-dev", item);
    },
    onLink(idx, item) {
      // console.log(item);
      var list = JSON.parse(JSON.stringify(this.linkList));
      list.push(item);
      this.$emit("update:linkList", list);
      this.$emit("link-dev", item);
    },
    onUnLink(idx, item) {
      var list = JSON.parse(JSON.stringify(this.linkList));
      for (var i = 0; i < list.length; i++) {
        if (item.deviceImei == list[i].deviceImei) {
          list.splice(i, 1);
          break;
        }
      }
      console.log(item);
      this.$emit("update:linkList", list);
      this.$emit("unlink-dev", item);
    },
    onLinkAll() {
      var list = JSON.parse(JSON.stringify(this.devList));
      var link = [];
      for (var i = 0; i < list.length; i++) {
        if (!this.getLinkState(list[i])) {
          link.push(list[i]);
        }
      }
      console.log(list);
      // this.devList = list;
      this.$emit("update:linkList", list);
    },
    onUnLinkAll() {
      this.$emit("update:linkList", []);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.link-device-list {
  ::v-deep .el-table .el-table__cell {
    font-size: 12px !important;
  }
  ::v-deep .el-table__body tr.current-row > td.el-table__cell {
    background-color: #c3daf4;
  }
}
</style>
