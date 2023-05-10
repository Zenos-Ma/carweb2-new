<template>
  <dialog-comp :visible.sync="isShow" :dialog-title="$t(isDefense ? 'infobox.undefense' : 'infobox.defense')" :dialog-width="300">
    <table class="form-table" style="margin: 0 auto">
      <tr>
        <td>{{ $t("common.deviceImei") }}:</td>
        <td>{{ imei }}</td>
      </tr>
      <tr v-if="!isDefense">
        <td>{{ $t("infobox.radius") }}:</td>
        <td>
          <input type="text" class="text-input" v-model.number="radius" />
        </td>
      </tr>
    </table>

    <div style="text-align: center">
      <el-button type="primary" size="small" @click="doDefense">{{ $t(isDefense ? "infobox.undefense" : "infobox.defense") }}</el-button>
    </div>
  </dialog-comp>
</template>

<script>
  import { doDefenseAction } from "@/api/monitor.js";
  export default {
    name: "DefenseDialog",
    props: {
      mapName: {
        type: String,
        default: "",
      },
    },
    data: () => ({
      isDefense: false,
      isShow: false,
      imei: "", //设备号
      radius: 200, //布防半径
    }),
    methods: {
      //执行布防和撤防
      doDefense() {
        var data = {};
        if (this.isDefense) {
          data = {
            deviceImei: this.imei,
            isDefense: false,
          };
        } else {
          if (this.radius >= 200) {
            data = {
              deviceImei: this.imei,
              radius: this.radius,
              isDefense: true,
            };
          } else {
            this.app.$emit("show-alert-msg", this.$t("infobox.radiusTip"));
            return;
          }
        }
        doDefenseAction(data).then((res) => {
          if (res.errCode == "200") {
            this.app.$emit("refresh-infobox", { deviceImei: this.imei }, this.mapName);
            this.app.$emit("show-alert-msg", this.$t(this.isDefense ? "infobox.undefenseSuccess" : "infobox.defenseSuccess"));
          } else {
            this.app.$emit("show-alert-msg", res.errMsg);
          }
          this.isShow = false;
        });
      }, //显示对话框
      showDialog(op, name) {
        if (name == this.mapName) {
          this.imei = op.imei;
          this.isDefense = op.isDefense;
          this.isShow = true;
        }
      },
      listenEvent() {
        this.app.$on("show-defense-dialog", this.showDialog);
      },
      offEvent() {
        this.app.$off("show-defense-dialog", this.showDialog);
      },
    },
    mounted() {
      this.listenEvent();
    },
    beforeDestroy() {
      this.offEvent();
    },
  };
</script>
