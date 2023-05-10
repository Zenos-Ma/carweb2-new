<template>
  <el-dialog
    :append-to-body="true"
    :title="dialogTitle"
    :width="dialogWidth + dialogUnit"
    :fullscreen="isFullscreen"
    :visible.sync="isShow"
    v-dialogDrag
    @click="DialogClose"
  >
    <div slot="title" class="header-title">
      <span class="title-name"><i :class="['iconfont', iconWindow]"></i></span>
      <span class="title-age">{{ dialogTitle }}</span>
    </div>
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogComp",
  props: {
    dialogTitle: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    isFullscreen: {
      type: Boolean,
      default: false
    },
    dialogWidth: {
      type: Number,
      default: 0
    },
    dialogUnit: {
      type: String,
      default: "px"
    },
    iconWindow: {
      type: String,
      default: "icon-tx-changfangxing"
    }
  },
  computed: {
    isShow: {
      get: function() {
        return this.visible;
      },
      set: function(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  methods: {
    DialogClose() {
      this.$emit("update:visible", false);
      this.app.$emit("close-dialog-box");
    }
  }
};
</script>

<style lang="scss" scoped>
.header-title {
  padding-left: 10px;
  .title-name {
    vertical-align: middle;
  }
  .title-age {
    padding-left: 5px;
  }
}
::v-deep .el-dialog__header {
  position: relative;
  height: 30px;
  line-height: 30px;
  margin: 0;
  padding: 0;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: #e5f0fd;
  // background: linear-gradient(#e5f0fd, #d3e6fe);
  // background: linear-gradient(#4a5467, #040404);
  background: #3038e3;
  font-size: 11px;
  color: #fff;
}

::v-deep .el-dialog__headerbtn {
  position: absolute;
  top: 8px;
  right: 10px;
}

::v-deep .el-dialog__title {
  color: #fff;
  padding-left: 10px;
}

::v-deep .el-dialog__body {
  padding: 20px;
}
::v-deep .el-dialog__headerbtn .el-dialog__close {
  display: inline-block;
  transition: All 0.3s linear;
  color: #fff;
}
::v-deep .el-dialog__close:hover {
  // color: red;
  transform: rotate(180deg);
  transition: All 0.3s linear;
}
</style>
