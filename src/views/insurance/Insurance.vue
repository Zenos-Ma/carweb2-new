<template>
  <div class="layout-container form-card-insurance">
    <div class="card-header">{{ $t("insurance.contractList") }}</div>
    <div class="card-body" style="overflow-x: hidden;overflow-y: hidden;">
      <div class="insurance-content">
        <!--保单查询条件 start-->
        <table class="form-table" style="width:100%">
          <tr>
            <td>{{ $t("insurance.contractNo") }}:</td>
            <td>
              <el-input size="small" style="width:120px" v-model="policyId" />
            </td>
            <td>{{ $t("insurance.carFrameNo") }}:</td>
            <td>
              <el-input size="small" style="width:120px" v-model="frameId" />
            </td>
            <td>{{ $t("insurance.dealerName") }}:</td>
            <td style="white-space:nowrap">
              <el-input
                size="small"
                style="width:120px"
                v-model="userName"
                @keyup.enter.native="searchUser"
                :placeholder="$t('common.searchUserTip')"
              />
              <el-button
                type="primary"
                style="padding:7px 12px"
                @click="searchUser"
                >{{ $t("common.search") }}</el-button
              >
              <user-box
                bname="Insurance"
                :is-show.sync="isUserBox"
                :search-key="userName"
                @select-result="dealUserItem"
              ></user-box>
            </td>
            <td>{{ $t("insurance.installTime") }}:</td>
            <td style="white-space:nowrap;width:120px;display:inline-block">
              <!-- <date-picker :date.sync="installFrom" :input-width="10" :input-height="3" unit="rem"></date-picker>-
              <date-picker :date.sync="installTo" :input-width="10" :input-height="3" unit="rem"></date-picker> -->
              <el-date-picker
                v-model="installFrom"
                type="date"
                format="yyyy-MM-dd"
                style="width:130px;"
              ></el-date-picker>
              <el-date-picker
                v-model="installTo"
                type="date"
                format="yyyy-MM-dd"
                style="width:130px;"
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>{{ $t("insurance.firstBeneficiary") }}:</td>
            <td>
              <el-input size="small" style="width:120px" v-model="custName" />
            </td>
            <td>{{ $t("insurance.carOwnerName") }}:</td>
            <td>
              <el-input
                size="small"
                style="width:120px"
                v-model="drivLicName"
              />
            </td>
            <td>{{ $t("insurance.carOwnerID") }}:</td>
            <td>
              <el-input
                size="small"
                style="width:120px"
                v-model="drivLicIdNum"
              />
            </td>
            <td>{{ $t("insurance.searchTip") }}</td>
            <td style="white-space:nowrap">
              <el-button
                type="primary"
                style="padding:7px 12px"
                @click="loadInsurance"
                >{{ $t("common.search") }}</el-button
              >
              <el-button
                type="primary"
                style="padding:7px 12px"
                @click="exportTable"
                >{{ $t("common.export") }}</el-button
              >
              <el-button
                type="primary"
                style="padding:7px 12px"
                @click="exportTable('all')"
                >{{ $t("common.exportAll") }}</el-button
              >

              <el-checkbox v-model="isEcall">{{
                $t("insurance.isEcall")
              }}</el-checkbox>
            </td>
          </tr>
        </table>

        <!--保单查询条件 end-->
      </div>
      <!--保单表格 start-->
      <div style="height: calc(100% - 80px);" id="insuranceContent">
        <data-table
          :show-selection="true"
          :data="insuranceList"
          :page="page"
          @selection-change="selectionChange"
          @getTableData="loadInsurance"
        >
          <!--  -->
          <el-table-column
            :label="$t('insurance.policyId')"
            prop="policyId"
            width="160px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.userName')"
            prop="userName"
            width="100px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.seller')"
            prop="seller"
            width="100px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.carType')"
            prop="carBrand"
            width="80px"
          ></el-table-column>
          <el-table-column :label="$t('insurance.installTime')" width="100px">
            <template slot-scope="props">
              {{ props.row.installTime | fdate }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('insurance.tFrom')" width="100px">
            <template slot-scope="props">
              {{ props.row.tFrom | fdate }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('insurance.tTo')" width="100px">
            <template slot-scope="props">
              {{ props.row.tTo | fdate }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('insurance.custName')"
            prop="custName"
            width="140px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.drivLicName')"
            prop="drivLicName"
            width="100px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.drivLicIdNum')"
            prop="drivLicIdNum"
            width="130px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.devModel')"
            prop="devModel"
            width="130px"
          ></el-table-column>
          <el-table-column :label="$t('common.deviceImei')" width="130px">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.$index, props.row, 'insuranceDevice')"
                >{{ props.row.deviceImei }}</a
              >
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('insurance.carBrand')"
            prop="carType"
            width="100px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.carPlateNum')"
            prop="carPlateNum"
            width="100px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.frameId')"
            prop="frameId"
            width="130px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.engineId')"
            prop="engineId"
            width="120px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.carOrigPrice')"
            prop="carOrigPrice"
            width="120px"
          ></el-table-column>
          <el-table-column
            :label="$t('insurance.coverage')"
            prop="coverage"
            width="120px"
          ></el-table-column>
          <el-table-column
            :label="$t('common.phone')"
            prop="custPhone"
            width="110px"
          ></el-table-column>
          <el-table-column :label="$t('common.operation')" width="200px">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.$index, props.row, 'insuranceDetail')"
                >{{ $t("common.detail") }}</a
              >
              <a
                @click="dealTableOp(props.$index, props.row, 'insurancePrint')"
                >{{ $t("insurance.print") }}</a
              >
              <a
                @click.self="
                  dealTableOp(props.$index, props.row, 'insuranceChange')
                "
                >{{ $t("insurance.changeRecord") }}</a
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
      <!--保单表格 end-->
    </div>

    <insu-record-dialog></insu-record-dialog>
  </div>
</template>

<script src="./insurance.js"></script>
<style lang="scss" scoped>
.form-card-insurance {
  height: calc(100vh - 110px);
  width: calc(100% - 20px);
  flex-direction: column;
}
table.form-table {
  input[type="text"] {
    width: 10rem !important;
  }
}
::v-deep .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}
::v-deep .el-icon-date {
  line-height: 32px !important;
}
</style>
