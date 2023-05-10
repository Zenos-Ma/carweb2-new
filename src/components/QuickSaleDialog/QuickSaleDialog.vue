<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('batchSale.quickSale')"
    :dialog-width="500"
    icon-window="icon-kuguanfahuo"
  >
    <div style="text-align: center">
      <quick-sale style="margin: 8px auto"></quick-sale>
    </div>
  </dialog-comp>
</template>

<script>
import QuickSale from "@/components/QuickSale";
export default {
  name: "QuickSaleDialog",
  props: {},
  components: {
    "quick-sale": QuickSale
  },
  data: () => ({
    isShow: false
  }),
  methods: {
    showDialog(op) {
      this.isShow = true;
      // console.log("op", op);
      if (op.item) {
        this.app.$emit("quick-sale-dialog", op.item);
      }
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-quick-sale-dialog", this.showDialog);
      this.app.$on("close-quick-sale-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-quick-sale-dialog", this.showDialog);
      this.app.$off("close-quick-sale-dialog", this.closeDialog);
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
