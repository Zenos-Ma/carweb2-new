<template>
  <div
    style="padding: 8px; overflow-x: hidden; overflow-y: hidden; height: 400px; display: flex; flex-direction: row; align-items: center; justify-content: center"
  >
    <div class="admin-icon"></div>
    <table class="form-table" style="height: auto">
      <tr>
        <td>{{ $t("accountMain.provider") }}</td>
        <td>{{ superUser.userName ? superUser.userName : "--" }}</td>
      </tr>
      <tr>
        <td>{{ $t("common.linkman") }}</td>
        <td>{{ superUser.linkman ? superUser.linkman : "--" }}</td>
      </tr>
      <tr>
        <td>{{ $t("common.phone") }}</td>
        <td>{{ superUser.tel ? superUser.tel : "--" }}</td>
      </tr>
      <tr>
        <td>{{ $t("common.address") }}</td>
        <td>{{ superUser.addr ? superUser.addr : "--" }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { loadAgent } from "@/api/common.js";
export default {
  name: "ServiceDetail",
  props: {},
  data: () => ({
    imei: JSON.parse(window.localStorage.getItem("carweb_user")).deviceImei,

    superUser: {
      userName: "",
      linkman: "",
      tel: "",
      addr: ""
    } //服务商
  }),
  methods: {},
  mounted() {
    loadAgent({ deviceImei: this.imei }).then(res => {
      if (res.errCode == "200") {
        this.superUser = res.data;
      }
    });
  }
};
</script>
