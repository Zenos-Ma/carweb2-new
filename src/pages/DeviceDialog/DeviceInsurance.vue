<template>
  <div id="insurance_table" style="height:100%;overflow-y:auto;">
    <table
      style="width: 100%;line-height: 3rem;"
      class="form-table"
      v-if="tplList.length > 0"
    >
      <!--保单信息 start-->
      <tr>
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.insuranceInfo") }}
        </th>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.insuranceType") }}:</td>
        <td colspan="3" style="text-align:left">
          <span
            v-for="item in tplList"
            :key="item.tplId"
            style="font-size:1.4rem;width:30%;display:inline-block;"
          >
            <!-- <input type="radio" class="text-input" v-model="policy.policyType" :value="item.tplId" />
            {{ item.tplCnName }} -->
            <el-radio v-model="policy.policyType" :label="item.tplId">{{
              item.tplCnName
            }}</el-radio>
          </span>
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.policyId") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.policyId"
          />
        </td>
        <td>{{ $t("deviceInsurance.insuredAmount") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.coverage"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.insuranceModel") }}:</td>
        <td>{{ getInsuranceType(policy) }}</td>
        <td>{{ $t("deviceInsurance.validateYear") }}:</td>
        <td>
          <!-- <select class="text-input" v-model="validateYear">
            <option></option>
            <option v-for="(item, idx) in $t('deviceInsurance.validateYearList')" :key="'validateYearList' + idx" :value="item.val">{{ item.text }}</option>
          </select> -->
          <!--  -->
          <el-select v-model="validateYear" style="width:180px;" size="small">
            <el-option
              v-for="(item, idx) in $t('deviceInsurance.validateYearList')"
              :key="'validateYearList' + idx"
              :value="item.val"
              :label="item.text"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.tFrom") }}:</td>
        <td style="display:inline-block;width:180px">
          <el-date-picker
            v-model="policy.tFromStr"
            type="date"
            size="small"
            style="width:180px"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </td>

        <td>{{ $t("deviceInsurance.to") }}</td>
        <td style="display:inline-block;width:180px">
          <el-date-picker
            v-model="policy.tToStr"
            type="date"
            size="small"
            style="width:180px"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.dealerName") }}:</td>
        <!-- <td style="white-space: nowrap;"> -->
        <td style="white-space: nowrap;">
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.userName"
            @keyup.enter.native="showHideBox('user')"
            :placeholder="$t('common.searchUserTip')"
          />
          <el-button
            type="primary"
            size="small"
            style="padding:8px 14px !important"
            @click="showHideBox('user')"
            >{{ $t("common.search") }}</el-button
          >
          <user-box
            bname="DeviceInsurance"
            :is-show.sync="isUserBox"
            :search-key="policy.userName"
            @select-result="dealUserItem"
          ></user-box>
        </td>
        <td>{{ $t("insurance.seller") }}:</td>
        <td>
          <el-input style="width:180px" size="small" v-model="policy.seller" />
        </td>
      </tr>
      <!--保单信息 end-->

      <!--设备信息 start-->
      <tr>
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.deviceInfo") }}
        </th>
      </tr>
      <tr>
        <td>{{ $t("common.deviceImei") }}:</td>
        <td>{{ policy.deviceImei }}</td>
        <td>{{ $t("insurance.devModel") }}:</td>
        <td>{{ policy.devModel }}</td>
      </tr>
      <tr>
        <td>{{ $t("insurance.installTime") }}:</td>
        <td style="display:inline-block;width:180px">
          <!-- <date-picker :date.sync="policy.installTimeStr" :is-scroll="true"></date-picker> -->
          <el-date-picker
            v-model="policy.installTimeStr"
            type="date"
            style="width:180px"
            size="small"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
        <td>{{ $t("deviceInsurance.installAddress") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.installAddr"
          />
        </td>
      </tr>
      <!--设备信息 end-->

      <!--第一受益人信息 start-->
      <tr>
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.beneficiaryInfo") }}
        </th>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.name") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.custName"
          />
        </td>
        <td>{{ $t("deviceInsurance.identityNo") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.custIdNum"
          />
        </td>
      </tr>
      <!--第一受益人信息 end-->
      <!-- 紧急联系人信息 start -->
      <tr v-if="policy.policyType == 'kangqi4'">
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.emergencyUserInfo") }}
        </th>
      </tr>
      <tr v-if="policy.policyType == 'kangqi4'">
        <td>{{ $t("deviceInsurance.emergencyUser") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.emergencyContact"
          />
        </td>
        <td>{{ $t("common.phone") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.emergencyContactNumber"
          />
        </td>
      </tr>
      <!-- 紧急联系人信息 end -->
      <!--行驶证信息 start-->
      <tr>
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.drivingInfo") }}
        </th>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.name") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.drivLicName"
          />
        </td>
        <td>{{ $t("deviceInsurance.identityNo") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.drivLicIdNum"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.fixedPhone") }}:</td>
        <td>
          <el-input style="width:180px" size="small" v-model="policy.custTel" />
        </td>
        <td>{{ $t("common.phone") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.custPhone"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceInsurance.birthday") }}:</td>
        <td style="display:inline-block;width:180px">
          <!-- <date-picker :date.sync="policy.custBirthStr" :is-scroll="true"></date-picker> -->
          <el-date-picker
            v-model="policy.custBirthStr"
            style="width:180px"
            type="date"
            size="small"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
        <td>{{ $t("deviceInsurance.address") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.custAddr"
          />
        </td>
      </tr>
      <!--行驶证信息 end-->
      <!--车辆信息 start-->
      <tr>
        <th colspan="6" class="form-header">
          {{ $t("deviceInsurance.carInfo") }}
        </th>
      </tr>
      <tr>
        <td>{{ $t("insurance.carType") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.carBrand"
          />
        </td>

        <td>{{ $t("insurance.carBrand") }}:</td>
        <td>
          <el-input
            size="small"
            v-model="policy.carType"
            style="text-transform:uppercase;width:180px"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.carPlateNum") }}:</td>
        <td>
          <!-- <select class="text-input small" v-model="selectProvince" style="width:5rem">
            <option ></option>
            <option v-for="(item,idx) in province" :key="'province'+idx" :value="item">{{item}}</option>
          </select>-->
          <el-input
            size="small"
            v-model="policy.carPlateNum"
            style="text-transform:uppercase;width:180px"
          />
        </td>
        <td>{{ $t("deviceInsurance.registerTime") }}:</td>
        <td style="display:inline-block;width:180px">
          <!-- <date-picker :date.sync="policy.carRegTimeStr" :is-scroll="true"></date-picker> -->
          <el-date-picker
            v-model="policy.carRegTimeStr"
            style="width:180px"
            type="date"
            size="small"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.engineId") }}:</td>
        <td>
          <el-input
            size="small"
            v-model="policy.engineId"
            style="text-transform:uppercase;width:180px"
          />
        </td>
        <td>{{ $t("insurance.frameId") }}:</td>
        <td>
          <el-input
            size="small"
            v-model="policy.frameId"
            style="text-transform:uppercase;width:180px"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("insurance.carOrigPrice") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="policy.carOrigPrice"
          />
        </td>
      </tr>
      <!--车辆信息 end-->
      <tr>
        <td colspan="6">
          <el-button
            type="success"
            size="small"
            @click="saveInsurance('exportWord')"
            >{{ $t("deviceInsurance.exportWord") }}</el-button
          >
          <el-button
            type="warning"
            size="small"
            v-show="
              policy.policyType == 'ztinfo_docx' ||
                policy.policyType == 'zt' ||
                policy.policyType == 'shandongtaile' ||
                policy.policyType == 'kangqi2' ||
                policy.policyType == 'kangqi4' ||
                isPdfBtn
            "
            @click="saveInsurance('exportPdf')"
          >
            {{ $t("deviceInsurance.exportPdf") }}
          </el-button>
          <el-button type="primary" size="small" @click="saveInsurance">{{
            $t("common.save")
          }}</el-button>
        </td>
      </tr>
    </table>

    <!-- 暂无保单数据 -->
    <div
      style="display: flex;align-items: center;justify-content: center; height: 100%;background-color:#f6f0ca"
      v-if="tplList.length == 0"
    >
      {{ $t("common.nodata") }}
    </div>
    <!-- <div>
      <img class="v3-login-pic" src="@/assets/img/login/login-pic.png" />
    </div> -->
  </div>
</template>

<script src="@/pages/DeviceDialog/deviceInsurance.js"></script>
<style lang="scss" scoped>
#insurance_table {
  max-height: 560px;
  min-height: 500px;
  overflow-x: auto;
  overflow-y: auto;
}
table.form-table > tr > th.form-header {
  background: #cedeee;
  border-radius: 0.4rem;
  line-height: 2.4rem;
  white-space: nowrap;
  padding-left: 1rem;
  height: 2.4rem;
}
</style>
