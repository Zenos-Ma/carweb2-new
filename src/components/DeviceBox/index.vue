<template>
  <div
    class="result-box"
    v-show="isShow"
    style="overflow-y: hidden; overflow-x: auto"
  >
    <div style="height: 100%; overflow-x: auto; overflow-y: auto">
      <!---搜索设备结果列表 start-->
      <ul class="result-list" v-if="devList.length > 0 && !isLoad">
        <li v-for="(item, idx) in devList" @click="chooseItem(idx)" :key="idx">
          <div class="result-list-icon iconfont icon-setting"></div>
          <div class="result-list-text">
            {{ item.deviceImei }}
            <br />
            <span
              v-if="item.deviceImei != item.name && item.name"
              style="color: gray"
              :title="item.name"
              >({{ item.name }})</span
            >
            <span v-if="item.policyId" style="color: gray"
              >({{ item.policyId }})</span
            >
          </div>
        </li>
      </ul>
      <!---搜索设备结果列表 end-->
      <!---搜索设备结果提示 start-->
      <div
        v-if="devList.length == 0 && !isLoad"
        class="result-box-nodata"
        @click="isShow = false"
      >
        {{ $t("common.noresult") }}
      </div>
      <div v-if="isLoad" class="result-box-nodata" style="color: red">
        {{ $t("common.loading") }}
      </div>
      <!---搜索设备结果提示 end-->
    </div>
    <div style="position: absolute; right: 0; bottom: 0">
      <el-button type="primary" size="small" @click="closeBox">{{
        $t("common.close")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  searchSellDev,
  searchRechargeDev,
  searchInsuranceDevice,
  searchDevice
} from "@/api/account.js";
export default {
  name: "DeviceBox",
  props: {
    boxType: {
      type: String,
      default: ""
    },
    searchKey: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isLoad: false,
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    devList: [], //搜索结果列表
    originKey: ""
  }),
  watch: {
    isShow() {
      if (this.isShow) {
        this.loadDevList();
      }
    },
    searchKey() {
      if (this.isShow) {
        this.loadDevList();
      }
    }
  },
  methods: {
    //选中搜索结果
    chooseItem(idx) {
      this.$emit("select-result", {
        deviceImei: this.devList[idx].deviceImei,
        deviceName: this.devList[idx].name,
        item: this.devList[idx]
      });
      this.$emit("update:search-key", this.devList[idx].deviceImei);
      this.closeBox();
    }, //搜索设备
    loadDevList() {
      var that = this;
      console.log(this.getStrLen(this.searchKey));
      if (this.searchKey && this.getStrLen(this.searchKey) >= this.imeiLen) {
        if (this.boxType == "sell") {
          //销售和转移的搜索设备
          if (this.originKey == this.searchKey) {
            this.$emit("update:isShow", true);
          } else {
            this.isLoad = true;
            searchSellDev({ key: this.searchKey }).then(res => {
              if (res.errCode == "200") {
                that.originKey = that.searchKey + "";
                that.devList = res.data;
              }
              that.isLoad = false;
            });
          }
        } else if (this.boxType == "recharge") {
          //searchRechargeDev
          //充值卡搜索设备
          this.isLoad = true;
          searchRechargeDev({ key: this.searchKey }).then(res => {
            if (res.errCode == "200") {
              that.originKey = that.searchKey + "";
              that.devList = res.data;
            }
            that.isLoad = false;
          });
        } else if (this.boxType == "policyId") {
          //搜索保单号对应设备
          if (this.originKey == this.searchKey) {
            this.$emit("update:isShow", true);
          } else {
            this.isLoad = true;
            searchInsuranceDevice({ key: this.searchKey }).then(res => {
              that.isLoad = false;
              that.devList = res.data;
            });
          }
        } else {
          //搜索设备
          if (this.originKey == this.searchKey) {
            this.$emit("update:isShow", true);
          } else {
            this.isLoad = true;
            const data = {
              baseUserId: this.rootUser.userId,
              key: this.searchKey,
              overflow: 20
            };
            searchDevice(data).then(res => {
              if (res.errCode == "200") {
                that.originKey = that.searchKey + "";
                that.devList = res.data;
              }
              that.isLoad = false;
            });
          }
        }
      } else {
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
        this.closeBox();
      }
    }, //关闭搜索结果box
    closeBox() {
      this.$emit("update:isShow", false);
    }
  },
  mounted() {},
  beforeDestroy() {}
};
</script>
