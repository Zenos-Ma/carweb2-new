<template>
  <dialog-comp :visible.sync="isShow" :dialog-title="$t('insurance.insuRecordDialog')" :dialog-width="800" :dialog-height="540" dialog-unit="px">
    <!--修改记录表格-->
    <table class="form-table" style="width:100%;">
      <tr>
        <td>{{ $t("common.deviceImei") }}:</td>
        <td>{{ deviceImei }}</td>
        <td>{{ $t("insurance.policyId") }}:</td>
        <td>{{ policyId }}</td>
      </tr>
    </table>

    <div style="height:400px;width:100%;">
      <data-table :data="insuranceList">
        <!--  -->
        <el-table-column :label="$t('insurance.operator')" width="100px" prop="operator"></el-table-column>
        <el-table-column :label="$t('insurance.operateTime')" width="150px">
          <template slot-scope="props">
            {{ props.row.operateTime | fdatetime }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.policyId')" width="120px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'policyId')]">{{ props.row.policyId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.userName')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'dealerName')]">{{ props.row.dealerName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.seller')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'seller')]">{{ props.row.seller }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.carBrand')" width="80px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'carBrand')]">{{ props.row.seller }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.installTime')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'installTime')]">{{ props.row.installTime | fdate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.tFrom')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'tFrom')]">{{ props.row.tFrom | fdate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.tTo')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'tTo')]">{{ props.row.tTo | fdate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.custName')" width="140px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'custName')]">{{ props.row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.drivLicName')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'drivLicName')]">{{ props.row.drivLicName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.drivLicIdNum')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'drivLicIdNum')]">{{ props.row.drivLicIdNum }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.devModel')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'devModel')]">{{ props.row.devModel }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.deviceImei')" width="140px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'deviceImei')]">{{ props.row.deviceImei }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.carType')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'carType')]">{{ props.row.carType }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.carPlateNum')" width="100px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'carPlateNum')]">{{ props.row.carPlateNum }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.frameId')" width="120px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'frameId')]">{{ props.row.frameId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.engineId')" width="140px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'engineId')]">{{ props.row.engineId }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.carOrigPrice')" width="120px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'carOrigPrice')]">{{ props.row.carOrigPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('insurance.coverage')" width="120px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'coverage')]">{{ props.row.coverage }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.phone')" width="120px">
          <template slot-scope="props">
            <span :class="[getChange(props.$index, 'custPhone')]">{{ props.row.custPhone }}</span>
          </template>
        </el-table-column>
      </data-table>
    </div>
  </dialog-comp>
</template>

<script>
import { loadDeviceInsurance } from "@/api/insurance";
export default {
  name: "InsuRecordDialog",
  data: () => ({
    isShow: false,
    insuranceList: [], //保单修改记录数据
    deviceImei: "", //设备号
    policyId: "", //保单号
  }),
  methods: {
    getChange(i, code) {
      if (i > 0) {
        var item = this.insuranceList[i];
        var pre = this.insuranceList[i - 1];
        if (item[code] == pre[code]) {
          return "";
        } else {
          return "data-table-red";
        }
      } else {
        return "";
      }
    },
    //加载保单修改记录
    loadInsuranceRecord() {
      var data = {
        deviceImei: this.deviceImei,
        policyId: this.policyId,
      };
      loadDeviceInsurance(data).then(res=> {
        if (res.errCode == "200") {
          this.insuranceList = res.data;
        }
      });
    }, //显示对话框
    showDialog(op) {
      this.isShow = true;
      this.deviceImei = op.imei;
      this.policyId = op.policyId;
      this.loadInsuranceRecord();
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-insu-record-dialog", this.showDialog);
      this.app.$on("close-insu-record-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-insu-record-dialog", this.showDialog);
      this.app.$off("close-insu-record-dialog", this.showDialog);
    },
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {},
};
</script>
