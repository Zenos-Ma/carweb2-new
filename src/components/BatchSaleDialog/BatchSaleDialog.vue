<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('customer.batchSale')"
    :dialog-width="840"
    :icon-window="'icon-zcpt-xiaoshouguanli'"
  >
    <batch-sale style="margin: 8px auto" dname="dialog"></batch-sale>
  </dialog-comp>
</template>

<script>
import BatchSale from "@/components/BatchSale";
export default {
  name: "BatchSaleDialog",
  props: {},
  components: {
    "batch-sale": BatchSale
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    closeDialog() {
      this.isShow = false;
    }, //显示批量销售对话框
    showDialog(op) {
      this.isShow = true;
      if (op.devList) {
        this.$nextTick(()=> {
          this.app.$emit("batch-sale-dialog", op.devList, op.userId, op.userName);
        })
      }
    },
    listenEvent() {
      this.app.$on("show-batch-sale-dialog", this.showDialog);
      this.app.$on("close-batch-sale-dialog", this.closeDialog);
    }
  },
  mounted() {
    this.listenEvent();
  }
};
</script>

<style></style>
