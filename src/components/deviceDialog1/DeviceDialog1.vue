<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('deviceDialog.myDevice')"
    :dialog-width="750"
    icon-window="icon-qichedingwei"
  >
    <div
      style="border-radius: 5px; border: solid 1px #c0d7e7; height: 100%; width: 100%"
    >
      <!--设备详情tab start-->
      <ul class="dialog-tabs">
        <li
          v-for="(item, idx) in $t('deviceDialog.dialogTabs1')"
          :class="['dialog-tab', currentTab == idx ? 'active' : '']"
          @click="changeDialogTab(idx)"
          :key="'dialogTabs' + idx"
        >
          {{ item.text }}
        </li>
        <li class="dialog-tab" style="flex: 1"></li>
      </ul>
      <!--设备详情tab end-->

      <!--设备详情内容 start-->
      <div class="dialog-content">
        <component :is="currentPart" dname="location1"></component>
      </div>
      <!--设备详情内容 end-->
    </div>
  </dialog-comp>
</template>

<script>
import DeviceDetail from "@/pages/DeviceDialog/DeviceDetail.vue";
import UserPwd from "@/components/UserPwd";
import ServiceDetail from "@/components/ServiceDetail";

export default {
  name: "DeviceDialog1",
  props: {},
  components: {
    "device-detail": DeviceDetail, //设备详情
    "user-pwd": UserPwd,
    agent: ServiceDetail
  },
  data: () => ({
    isShow: false,
    currentTab: 0, //当前设备详情tab
    currentPart: "device-detail", //当前设备详情内容
    imei: JSON.parse(window.localStorage.getItem("carweb_user")).deviceImei
  }),
  methods: {
    //改变tab
    changeDialogTab(idx) {
      this.currentTab = idx;
      this.currentPart = this.$t("deviceDialog.dialogTabs1[" + idx + "].name");
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("device-dialog", that.imei, "location1");
      });
    },
    closeDialog() {
      this.isShow = false;
    },
    showDialog() {
      this.isShow = true;
      this.changeDialogTab(0);
    },
    listenEvent() {
      this.app.$on("close-device-dialog1", this.closeDialog);
      this.app.$on("show-device-dialog1", this.showDialog);
    },
    offEvent() {
      this.app.$off("close-device-dialog1", this.closeDialog);
      this.app.$off("show-device-dialog1", this.showDialog);
    }
  },
  mounted() {
    this.listenEvent();
  },

  beforeDestroy() {
    this.offEvent();
  }
};
</script>
<style lang="scss" scoped>
.dialog-content {
  height: calc(100% - 30px);
  border-radius: 0 0 4px 4px;
}
</style>
