<template>
  <div class="search-tabbar">
    <div class="d-flex-cont">
      <!-- <el-input
        placeholder="请输入内容"
        v-model="searchKey"
        class="input-with-select"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
        <el-select
          class="select-cont"
          v-model="select"
          slot="prepend"
          placeholder="请选择"
        >
          <el-option label="用户" value="user"></el-option>
          <el-option label="设备" value="device"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="showDialog"
        ></el-button>
      </el-input> -->
      <el-input
        :placeholder="$t('home.searchTip')"
        v-model="searchKey"
        class="input-with-select fl"
        style="width:250px"
      >
        <i slot="prefix" class="iconfont icon-sousuo"></i>
      </el-input>
      <el-button size="medium" class="fl" @click="showDialog('device')">
        <i class="iconfont icon-qichedingwei"></i>
        设备
      </el-button>
      <el-button size="medium" class="fl" @click="showDialog('user')">
        <i class="iconfont icon-lujingbeifen2"></i>
        用户
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeviceUserSearch",
  data: () => ({
    select: "user",
    searchKey: ""
  }),
  methods: {
    showDialog(tag) {
      if (tag == "device") {
        if (this.getStrLen(this.searchKey) >= this.imeiLen) {
          this.app.$emit("show-search-result-dialog", {
            name: "SearchResultDialog",
            key: this.searchKey,
            searchType: "device"
          });
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
        }
      } else if (tag == "user") {
        if (this.searchKey) {
          this.app.$emit("show-search-result-dialog", {
            name: "SearchResultDialog",
            key: this.searchKey,
            searchType: "user"
          });
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.searchUserTip1"));
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.d-flex-cont {
  // display: flex;
}
.search-tabbar {
  // line-height: 50px;
  margin-left: 25%;
  display: flex;
  align-items: center;
  // margin-left: 10px;
  ::v-deep .el-input__prefix {
    line-height: 36px;
  }
  ::v-deep .el-button {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: 400;
    // padding: 10px 20px !important;
    margin-left: -1px !important;
  }
}
.select-cont {
  width: 80px;
}
.input-with-select {
  display: inline-block;
  ::v-deep .el-input__inner {
    padding-left: 30px !important;
  }
}
</style>
