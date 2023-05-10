<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('deviceDialog.relation')"
    :dialog-width="800"
  >
    <device-relation
      dname="RelationDialog"
      style="padding: 0"
    ></device-relation>
  </dialog-comp>
</template>

<script>
import DevRelation from "@/pages/DeviceDialog/DeviceRelation.vue";
export default {
  name: "RelationDialog",
  components: {
    "device-relation": DevRelation
  },
  data: () => ({
    isShow: false,
    imei: ""
  }),
  methods: {
    showDialog(op) {
      //显示设备关系对话框
      this.isShow = true;
      this.imei = op.imei;
      var that = this;
      this.$nextTick(function() {
        that.app.$emit("relation-dialog", that.imei, "RelationDialog");
      });
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-relation-dialog", this.showDialog);
      this.app.$on("close-relation-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-relation-dialog", this.showDialog);
      this.app.$off("close-relation-dialog", this.closeDialog);
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
