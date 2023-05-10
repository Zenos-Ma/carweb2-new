<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('deviceDialog.deviceDetail')"
    :dialog-width="800"
    :icon-window="'icon-qichedingwei'"
  >
    <device-detail dname="DevDetailDialog"></device-detail>
  </dialog-comp>
</template>

<script>
import DeviceDetail from "@/pages/DeviceDialog/DeviceDetail.vue";
export default {
  name: "DevDetailDialog",
  props: {},
  components: {
    "device-detail": DeviceDetail
  },
  data: () => ({
    isShow: false,
    imei: ""
  }),
  methods: {
    //显示设备详情对话框
    showDialog(op) {
      this.isShow = true;
      this.imei = op.imei;
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("dev-detail-dialog", that.imei, "DevDetailDialog");
      });
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-dev-detail-dialog", this.showDialog);
      this.app.$on("close-dev-detail-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-dev-detail-dialog", this.showDialog);
      this.app.$off("close-dev-detail-dialog", this.closeDialog);
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

<style scoped="scoped"></style>
