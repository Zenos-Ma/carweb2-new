<template>
  <div class="form-card1 layout-container box-content-background">
    <!--预约表格 -->
    <div class="card-header">{{ $t("accountAppoint.appointList") }}</div>
    <div class="card-body">
      <data-table :data="appointList" :show-index="true" :show-page="false">
        <!--  -->
        <el-table-column
          :label="$t('common.deviceImei')"
          prop="devImei"
          width="140"
        ></el-table-column>
        <el-table-column
          :label="$t('common.linkman')"
          prop="linkman"
          width="140"
        ></el-table-column>
        <el-table-column
          :label="$t('accountAppoint.carType')"
          prop="carType"
          width="130"
        ></el-table-column>
        <el-table-column
          :label="$t('accountAppoint.email')"
          prop="email"
          width="140"
        ></el-table-column>
        <el-table-column
          :label="$t('common.phone')"
          prop="phone"
          width="130"
        ></el-table-column>
        <el-table-column :label="$t('common.createTime')" min-width="150">
          <template slot-scope="props">
            {{ props.row.createTime | fdatetime }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.updateTime')" min-width="150">
          <template slot-scope="props">
            {{ props.row.updateTime | fdatetime }}
          </template>
        </el-table-column>
      </data-table>
    </div>
  </div>
</template>

<script>
import { loadAppointListInfo } from "@/api/account.js";
export default {
  name: "AccountAppoint",
  props: {},
  components: {},
  data: () => ({
    appointList: [] //预约表格数据
  }),
  methods: {
    //加载预约列表
    loadAppontList() {
      loadAppointListInfo().then(res => {
        if (res.errCode == "200") {
          this.appointList = res.data;
          this.dosort();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("accountAppoint.appointListTip")
          );
        }
      });
    }, //loadAppontList
    dosort() {
      this.appointList = this.appointList.sort(function(a, b) {
        return b.createTime - a.createTime;
      });
    }
  },
  mounted() {
    this.loadAppontList();
  }
};
</script>

<style lang="scss" scoped>
.account-appoint {
  width: 100%;
}
</style>
