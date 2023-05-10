<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('customer.batchTransfer')"
    :dialog-width="800"
    :icon-window="'icon-jiaohuan'"
  >
    <batch-transfer dname="dialog"></batch-transfer>
  </dialog-comp>
</template>

<script>
import BatchTransfer from "@/components/BatchTransfer/BatchTransfer";
export default {
  name: "BatchTransferDialog",
  props: {},
  components: {
    "batch-transfer": BatchTransfer
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    //显示批量转移对话框
    showDialog(op) {
      this.isShow = true;
      // console.log('op', op)
      if (op.devList) {
        this.$nextTick(()=> {
          this.app.$emit(
          "batch-transfer-dialog",
          op.devList,
          op.userId,
          op.userName
        );
        })
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-batch-transfer-dialog", this.showDialog);
      this.app.$on("close-batch-transfer-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-batch-transfer-dialog", this.showDialog);
      this.app.$off("close-batch-transfer-dialog", this.closeDialog);
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

<style></style>
