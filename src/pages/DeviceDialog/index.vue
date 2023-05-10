<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('deviceDialog.deviceDetail')"
    :dialog-width="dWidth"
    :dialog-height="dHeight"
    dialog-unit="px"
    :icon-window="'icon-qichedingwei'"
  >
    <!--搜索设备 start-->
    <div class="search-device">
      <span>{{ $t("common.deviceImei") }}：{{ imei }}</span>
      <span style="margin-left: 20px"
        >{{ $t("deviceDialog.searchDevice") }}:</span
      >

      <el-select v-model="searchType" size="small" style="width:80px">
        <el-option
          v-for="(item, idx) in $t('deviceDialog.searchTypeList')"
          :key="'searchTypeList' + idx"
          :value="item.val"
          :label="item.text"
        ></el-option>
      </el-select>
      <el-input
        class="input-device-search"
        prefix-icon="el-icon-search"
        size="small"
        v-model="searchKey"
        @keyup.native.enter="searchDevice"
        style="width:180px;"
        clearable
      ></el-input>

      <el-button type="primary" size="small" @click="searchDevice">
        {{ $t("common.search") }}
      </el-button>
      <el-button type="warning" size="small" @click="clearSearch">
        {{ $t("deviceDialog.clean") }}
      </el-button>
      <device-box
        :box-type="searchType"
        :is-show.sync="isDeviceBox"
        :search-key="searchKey"
        @select-result="dealDevItem"
        style="position: absolute; margin-left: 24rem"
      ></device-box>
    </div>
    <!--搜索设备 end-->
    <div class="device-tab-nav">
      <!--设备详情tab start-->
      <ul class="dialog-tabs">
        <li
          v-for="(item, idx) in dialogTabs"
          :class="['dialog-tab', currentTab == idx ? 'active' : '']"
          @click="changeDialogTab(idx)"
          :key="'dialog-tab' + idx"
        >
          {{ item.text }}
        </li>
        <li
          class="dialog-tab"
          @click="jumpIdentity"
          v-show="isKangqi && langType == 'zh'"
        >
          {{ $t("deviceDialog.identity") }}
        </li>
        <li class="dialog-tab" style="flex: 1"></li>
      </ul>
      <!--设备详情tab end-->
      <!--设备详情内容 start-->
      <div class="dialog-content device-content-detail">
        <component
          :is="currentPart"
          dname="DeviceDialog"
          :is-card="true"
          :is-show="isShow"
        ></component>
      </div>
      <!--设备详情内容 end-->
    </div>
  </dialog-comp>
</template>

<script src="./index.js"></script>

<style lang="scss">
.search-device {
  border-radius: 4px;
  border: solid 1px #c0d7e7;
  line-height: 30px;
  margin-bottom: 8px;
  padding: 0 8px;
  font-size: 12px;
  > span {
    color: gray;
  }
}
.input-device-search {
  .el-input__inner {
    padding-left: 30px !important;
  }
}
.device-tab-nav {
  .dialog-content {
    // 2022-1-20隐藏
    height: calc(100% - 35px);
    border-radius: 0 0 4px 4px;
    // overflow: scroll;
  }

  .dialog-content > .content-header {
    line-height: 30px;
    font-weight: bold;
    font-size: 14px;
  }
}
</style>
