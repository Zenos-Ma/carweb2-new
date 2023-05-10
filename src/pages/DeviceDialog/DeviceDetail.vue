<template>
  <div
    style="overflow-x: auto;overflow-y: auto;height:100%;"
    class="device-detail"
  >
    <table class="form-table" style="width:100%;">
      <!-- 设备信息 start -->
      <tr class="form-table-bg">
        <td colspan="4">{{ $t("deviceDetail.deviceInfo") }}</td>
      </tr>

      <tr>
        <td class="hover-box">
          {{ $t("common.deviceImei") }}:
          <span class="orange-box">{{ $t("deviceDetail.deviceImeiTip") }}</span>
        </td>
        <td>{{ imei }}</td>

        <td>{{ $t("deviceDetail.deviceType") }}:</td>
        <td>
          <!-- <input type="text" class="text-input small" v-model="deviceDetail.model" :disabled="!isEditType" /> -->
          <!-- 2021-2-25把所有用户的全禁了 -->
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.model"
            :disabled="userId != 1"
          />
        </td>
      </tr>

      <tr>
        <td>{{ $t("common.deviceName") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.name"
          />
        </td>
        <td>{{ $t("deviceDetail.loginName") }}:</td>
        <td>{{ deviceDetail.loginNo }}</td>
      </tr>

      <tr>
        <td>{{ $t("common.linkman") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.linkman"
          />
        </td>
        <td>{{ $t("common.phone1") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.tel"
          />
        </td>
      </tr>

      <tr>
        <td>{{ $t("deviceDetail.isOBD") }}:</td>
        <td>
          <el-radio v-model="deviceDetail.isObd" label="1">{{
            $t("deviceDetail.support")
          }}</el-radio>

          <el-radio v-model="deviceDetail.isObd" label="0">{{
            $t("deviceDetail.notSupport")
          }}</el-radio>
        </td>
        <!-- 设置基站 -->
        <td>{{ $t("deviceDetail.isStation") }}:</td>
        <!-- <td :class="{ actived: userId != 1 }"> -->
        <td>
          <el-radio v-model="deviceDetail.isStation" label="1">{{
            $t("deviceDetail.yes")
          }}</el-radio>
          <el-radio v-model="deviceDetail.isStation" label="0">{{
            $t("deviceDetail.no")
          }}</el-radio>
        </td>
      </tr>
      <!-- 2021-2-25新增 -->
      <tr>
        <!-- 设备基本类型 -->
        <td>{{ $t("deviceDetail.baseType") }}:</td>
        <td :class="{ actived: userId != 1 }">
          <el-radio
            v-model="deviceDetail.baseType"
            label="0"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.wire") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.baseType"
            label="1"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.wireless") }}</el-radio
          >
        </td>
        <!-- 产品类型 -->
        <td>{{ $t("deviceDetail.productType") }}:</td>
        <el-select
          v-if="deviceDetail.productType != 3"
          style="width:180px"
          v-model="deviceDetail.productType"
          :disabled="userId == 1 ? false : true"
          size="small"
        >
          <el-option
            v-for="(item, idx) in $t('deviceDetail.productTypeList')"
            :key="'pledgeType' + idx"
            :value="item.value"
            :label="item.name"
          ></el-option>
        </el-select>
        <span v-if="deviceDetail.productType == 3">{{
          $t("deviceDetail.remoteControl")
        }}</span>
      </tr>
      <tr>
        <td>{{ $t("deviceDetail.refillType") }}:</td>
        <td
          :class="{ actived: userId != 1 }"
          colspan="3"
          style="text-align:left"
        >
          <el-radio
            v-model="deviceDetail.refillType"
            label="0"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.baseType1") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.refillType"
            label="1"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.frcType") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.refillType"
            label="2"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.bluetooth") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.refillType"
            label="3"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.handheld") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.refillType"
            label="4"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.k8") }}</el-radio
          >
          <el-radio
            v-model="deviceDetail.refillType"
            label="5"
            :disabled="userId == 1 ? false : true"
            >{{ $t("deviceDetail.controlCar") }}</el-radio
          >
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceDetail.deviceIcon") }}:</td>
        <td colspan="3" style="text-align:left;">
          <span
            v-for="item in deviceIcon"
            :key="'deviceicon' + item.value"
            class="icon-device"
          >
            <el-radio v-model="deviceDetail.icon" :label="item.value">
              <span
                :class="['device-icon', item.icon]"
                style="margin-right:1rem"
              ></span>
            </el-radio>
          </span>
          <!-- 2022-1-7新增上传图标 url="https://httpbin.org/post"-->
          <!-- <el-button icon="el-icon-plus" style="padding:15px !important" @click="handleChangeImage"></el-button>
          <image-cropper
            :key="imagecropperKey"
            :width="300"
            :height="300"
            lang-type="zh"
            :imei="imei"
            :device-type="deviceDetail.productType.toString()"
            @close="close"
            @crop-upload-success="cropSuccess"
          />
          <img :src="imgUrl2" alt="" style="display:inline-block;width:45px;vertical-align: middle;" /> -->
          <!-- 2022-1-7新增上传图标 end-->
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceDetail.isRent") }}:</td>
        <td>
          <!--  -->
          <el-radio v-model="deviceDetail.isRent" label="1">{{
            $t("deviceDetail.yes")
          }}</el-radio>
          <el-radio v-model="deviceDetail.isRent" label="0">{{
            $t("deviceDetail.no")
          }}</el-radio>
        </td>
        <td
          v-if="
            deviceDetail.autoDefense !== null &&
              deviceDetail.autoDefense !== undefined
          "
        >
          {{ $t("deviceDetail.autoDefense") }}:
        </td>
        <td
          v-if="
            deviceDetail.autoDefense !== null &&
              deviceDetail.autoDefense !== undefined
          "
        >
          <!-- <input type="radio" class="text-input" v-model="deviceDetail.autoDefense" :value="1" />
          {{ $t("deviceDetail.yes") }}
          <input type="radio" class="text-input" v-model="deviceDetail.autoDefense" :value="0" />
          {{ $t("deviceDetail.no") }} -->
          <el-radio v-model="deviceDetail.autoDefense" :label="1">{{
            $t("deviceDetail.yes")
          }}</el-radio>
          <el-radio v-model="deviceDetail.autoDefense" :label="0">{{
            $t("deviceDetail.no")
          }}</el-radio>
        </td>
      </tr>
      <tr>
        <td v-show="isDealerNote">{{ $t("deviceDetail.note") }}:</td>
        <td v-show="isDealerNote">
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.remark"
            :disabled="userId == 1 ? false : true"
          />
        </td>
        <td>{{ $t("deviceDetail.note1") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.deviceRemark"
          />
        </td>
      </tr>
      <!-- 设备信息 end -->
      <!-- 车辆信息 start 2021-1-30-->
      <tr class="form-table-bg">
        <td colspan="4">
          {{ $t("deviceDetail.carInfo") }}
          <!-- <span style="font-size:12px;color:red">(新增修改要有车牌号)</span> -->
        </td>
      </tr>
      <tr>
        <td>{{ $t("common.carNo") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.platNumber"
          />
        </td>
        <td>{{ $t("deviceDetail.installSite") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.installSite"
          />
        </td>
      </tr>
      <tr v-show="!trinityFlag">
        <!-- 车架号 -->
        <td>{{ $t("deviceDetail.carFrameNo") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.vehicleNumber"
          />
        </td>
        <td>{{ $t("insurance.engineId") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.engineNumber"
          />
        </td>
      </tr>
      <tr v-show="!trinityFlag">
        <!-- 车辆品牌 -->
        <td>{{ $t("deviceDetail.carBrand") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.brand"
          />
        </td>
        <td>{{ $t("deviceDetail.carType") }}:</td>
        <td>
          <el-select
            v-model="carDeviceDetail.carType"
            style="width:180px"
            size="small"
            :placeholder="$t('rechargePurchase.pleaseChoose')"
          >
            <el-option
              v-for="(item, idx) in $t('deviceDetail.carTypeList')"
              :key="'pledgeType' + idx"
              :value="item.key"
              :label="item.name"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr v-show="!trinityFlag">
        <!-- 车系名称 -->
        <td>{{ $t("deviceDetail.CarSeries") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.carName"
          />
        </td>

        <td>{{ $t("deviceDetail.carOwner") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.carOwner"
          />
        </td>
      </tr>
      <!-- 三一起重专用 -->
      <tr v-show="trinityFlag">
        <td>{{ $t("insurance.installTime") }}:</td>
        <td>
          <!-- <datetime-picker :datetime.sync="carDeviceDetail.installTime" :input-width="162" unit="px"></datetime-picker> -->
          <el-date-picker
            popper-class="date-picker-time"
            v-model="carDeviceDetail.installTime"
            type="datetime"
            style="width:180px"
          ></el-date-picker>
        </td>
        <td>{{ $t("deviceDetail.installPerson") }}:</td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="carDeviceDetail.installPerson"
          />
        </td>
      </tr>
      <tr>
        <td>{{ $t("deviceDetail.remark") }}:</td>
        <el-input
          style="width:180px"
          size="small"
          v-model="carDeviceDetail.remark"
        />
      </tr>
      <tr v-show="trinityFlag">
        <td colspan="4">
          <el-button type="primary" size="small" @click="installRecord">{{
            $t("deviceDetail.installRecord")
          }}</el-button>
        </td>
      </tr>
      <!--  -->
      <!-- 车辆信息 end 2021-1-31-->
      <!-- 设备定位信息 start -->
      <tr class="form-table-bg">
        <td colspan="4">{{ $t("deviceDetail.locaInfo") }}</td>
      </tr>
      <tr>
        <td>{{ $t("deviceDetail.speed") }}:</td>
        <td>{{ deviceDetail.speed }}km/h</td>
        <td>{{ $t("deviceDetail.locate") }}:</td>
        <td v-if="!deviceDetail.address && userId != 1" @click="showAddress">
          <a
            >{{ deviceDetail.lo ? deviceDetail.lo.toFixed(6) : 0.0 }},{{
              deviceDetail.la ? deviceDetail.la.toFixed(6) : 0.0
            }}</a
          >
        </td>
        <td v-if="!deviceDetail.address && userId == 1">
          <!-- <a>{{ deviceDetail.lo ? deviceDetail.lo.toFixed(6) : 0.0 }},{{ deviceDetail.la ? deviceDetail.la.toFixed(6) : 0.0 }}</a> -->
          <el-input
            v-model="deviceDetail.lo"
            style="width:100px"
            size="small"
          ></el-input
          >,
          <el-input
            v-model="deviceDetail.la"
            style="width:100px"
            size="small"
          ></el-input>
          <span @click="showAddress" class="btn-primary-system">{{
            $t("common.jiexi")
          }}</span>
        </td>
        <td v-if="deviceDetail.address">
          <span>{{ deviceDetail.address }}</span>
        </td>
      </tr>
      <tr>
        <td class="hover-box">
          {{ $t("deviceDetail.locateTime") }}:
          <span class="orange-box">{{ $t("deviceDetail.locateTimeTip") }}</span>
        </td>
        <td v-if="userId != 1">{{ deviceDetail.locTime }}</td>
        <td v-if="userId == 1">
          <el-date-picker
            size="small"
            v-model="deviceDetail.locTime"
            type="datetime"
            style="width:180px"
            format="yyyy-MM-dd HH:mm:ss"
            popper-class="date-picker-time"
          ></el-date-picker>
        </td>
        <!-- 状态时间 -->
        <td>{{ $t("deviceDetail.statusTime") }}:</td>
        <td v-if="userId != 1">
          {{ deviceDetail.sigTime }}
        </td>
        <td v-if="userId == 1">
          <el-date-picker
            size="small"
            v-model="deviceDetail.sigTime"
            type="datetime"
            style="width:180px"
            format="yyyy-MM-dd HH:mm:ss"
            popper-class="date-picker-time"
          ></el-date-picker>
          <!-- root下定位信息保存 -->
          <span @click="saveDeviceLocation" class="btn-primary-system">{{
            $t("common.save")
          }}</span>
        </td>
      </tr>
      <!-- 设备定位信息 end -->
      <!-- 2021-12-23start -->
      <!-- 时间信息 start -->
      <tr class="form-table-bg">
        <td colspan="4">{{ $t("deviceDetail.timeInfo") }}</td>
      </tr>

      <tr>
        <td class="hover-box">
          {{ $t("deviceDetail.useTime") }}:
          <span class="orange-box">{{ $t("deviceDetail.useTimeTip") }}</span>
        </td>
        <td>
          <span
            v-if="
              deviceDetail.enableDate &&
                deviceDetail.enableDate != '--' &&
                deviceDetail.enableSts == '1'
            "
            >{{ deviceDetail.enableDate }}</span
          >
          <!-- <el-date-picker
            v-model="deviceDetail.enableDate"
            v-show="(deviceDetail.enableDate && deviceDetail.enableDate != '--' && deviceDetail.enableSts == '1') || userId == 1"
            :disabled="userId != 1"
            type="date"
            style="width:180px"
            format="yyyy-MM-dd"
            popper-class="date-picker-time"
          ></el-date-picker> -->
          <!-- <span v-if="!deviceDetail.enableDate || deviceDetail.enableDate == '--'">{{ deviceDetail.enableSts == "0" ? $t("deviceDetail.unusedTip") : $t("deviceDetail.usedTip") }}</span> -->
          <span
            v-if="
              deviceDetail.enableSts == '0' &&
                deviceDetail.enableDate == '--' &&
                userId != 1
            "
          >
            {{ $t("deviceDetail.unusedTip") }}
          </span>
        </td>
        <td v-show="userId == 1 || userId == 2059 || userId == 238">
          {{ $t("deviceDetail.importTime") }}:
        </td>
        <td v-show="userId == 1 || userId == 2059 || userId == 238">
          {{ deviceDetail.importTime }}
        </td>
      </tr>

      <tr>
        <!-- 平台到期 -->
        <td class="hover-box">
          {{ $t("deviceDetail.platformExpired") }}:
          <span class="orange-box">{{
            $t("deviceDetail.platformExpiredTip")
          }}</span>
        </td>
        <td
          v-if="!isKeight"
          style="display:inline-block;width:180px;white-space: nowrap;"
        >
          <!-- <el-input
            v-show="deviceDetail.enableSts == '1' && deviceDetail.enableDate != '--'"
            v-model="deviceDetail.platformExpire"
            :disabled="userId != 1"
            prefix-icon="el-icon-date"
            class="date-input-time"
          ></el-input> -->
          <el-date-picker
            v-model="deviceDetail.platformExpire"
            v-show="
              (deviceDetail.enableSts == '1' &&
                deviceDetail.enableDate != '--') ||
                userId == 1
            "
            :disabled="userId != 1"
            type="date"
            style="width:180px"
            size="small"
            popper-class="date-picker-time"
          ></el-date-picker>
          <span
            v-show="
              (deviceDetail.enableSts == '0' ||
                deviceDetail.enableDate == '--') &&
                userId != 1
            "
            >--</span
          >
          <span
            v-if="
              platformExpireSts &&
                deviceDetail.enableSts == '1' &&
                deviceDetail.enableDate != '--'
            "
            style="color:red;"
            >({{ $t("deviceDetail.expired") }})</span
          >
        </td>
        <td v-if="isKeight">
          <span>2049-01-01</span>
        </td>
        <!-- 用户到期 -->
        <td class="hover-box" v-if="!isKeight">
          {{ $t("deviceDetail.userExpired") }}:
          <span class="orange-box">{{
            $t("deviceDetail.userExpiredTip")
          }}</span>
        </td>
        <td
          v-if="!isKeight"
          id="device-content"
          style="display:inline-block;width:180px;white-space: nowrap;"
        >
          <!-- <date-picker :date.sync="deviceDetail.userExpire" :is-scroll="true" v-show="(deviceDetail.enableSts == '1' && deviceDetail.enableDate != '--') || userId == 1"></date-picker> -->
          <el-date-picker
            v-model="deviceDetail.userExpire"
            v-show="
              (deviceDetail.enableSts == '1' &&
                deviceDetail.enableDate != '--') ||
                userId == 1
            "
            type="date"
            style="width:180px"
            size="small"
            popper-class="date-picker-time"
          ></el-date-picker>
          <span
            v-show="
              (deviceDetail.enableDate == '--' ||
                deviceDetail.enableSts == '0') &&
                userId != 1
            "
            >--</span
          >
          <span
            v-if="
              userExpireSts &&
                deviceDetail.enableSts == '1' &&
                deviceDetail.enableDate != '--'
            "
            style="color:red;"
            >({{ $t("deviceDetail.expired") }})</span
          >
        </td>
      </tr>
      <!-- 电话报警信息，日期和条数 -->
      <tr v-if="userId == 1 && deviceDetail.enableDate">
        <td>{{ $t("phoneNotify.serviceWorker") }}:</td>
        <td>
          <span>{{ phoneNotifyDate }}</span>
        </td>
        <td>{{ $t("phoneNotify.surplusNotify") }}:</td>
        <td>
          <span>{{ phoneNotifyCount }}</span>
        </td>
      </tr>
      <tr v-if="userId == 1 && deviceDetail.enableDate == ''">
        <td>{{ $t("batchSale.validYear") }}:</td>
        <td>
          <el-input
            v-model="deviceDetail.cornet"
            size="small"
            style="width:180px"
          ></el-input>
        </td>
      </tr>
      <!-- 时间信息 end -->
      <!-- 2021-12-23end -->

      <!-- 流量信息 start -->
      <tr class="form-table-bg">
        <td colspan="4">{{ $t("deviceDetail.flowInfo") }}</td>
      </tr>
      <tr>
        <td class="hover-box">
          ICCID:
          <span class="orange-box">{{ $t("deviceDetail.iccidTip") }}</span>
        </td>
        <td>
          <el-input
            style="width:190px"
            size="small"
            v-model="deviceDetail.iccid"
            :disabled="userId != 1"
          />
        </td>
        <td class="hover-box">
          {{ $t("common.simNo") }}:
          <span class="orange-box">{{ $t("deviceDetail.simNoTip") }}</span>
        </td>
        <td>
          <el-input
            style="width:180px"
            size="small"
            v-model="deviceDetail.msisdn"
            :disabled="!isSim"
          />
        </td>
      </tr>

      <tr>
        <td class="hover-box">
          {{ $t("deviceDetail.flowExpiredTime") }}:
          <span class="orange-box">{{
            $t("deviceDetail.flowExpiredTimeTip")
          }}</span>
        </td>
        <td v-if="!isKeight">
          <span v-if="!isUnused">{{ flowExpire }}</span>
          <span
            v-if="!isUnused && !flowExpireSts && deviceDetail.iccid"
            style="color:red"
            >({{ $t("deviceDetail.expired") }})</span
          >
          <span style="color:orange" v-if="isUnused && deviceDetail.iccid"
            >({{ $t("deviceDetail.unusedTip") }})</span
          >
          <span v-if="!isUnused && !flowExpireSts && !deviceDetail.iccid">{{
            $t("deviceDetail.noIccid")
          }}</span>
        </td>
        <!-- 2021-6-3新增了k8系列的显示 -->
        <td v-if="isKeight">
          <!-- <date-picker :date.sync="deviceDetail.userExpire" :is-scroll="true"></date-picker> -->
          <span>{{ deviceDetail.userExpire }}</span>
          <span v-if="userExpireSts" style="color:red;"
            >({{ $t("deviceDetail.expired") }})</span
          >
        </td>
        <!-- 2021-6-3新增了k8系列的显示 -->
        <td class="hover-box" v-if="userId == 1 && isKeight">
          {{ $t("deviceDetail.reallyTime") }}
          <span class="orange-box">{{ $t("deviceDetail.reallyTimeTip") }}</span>
        </td>
        <td v-if="userId == 1 && isKeight">
          <span>{{ flowExpire }}</span>
        </td>
        <!-- end -->
      </tr>
      <tr>
        <td colspan="4">
          <el-button type="primary" size="small" @click="saveDevice">{{
            $t("common.save")
          }}</el-button>
          <el-button type="warning" size="small" @click="loadDeviceDetail">{{
            $t("common.reset")
          }}</el-button>
        </td>
      </tr>
    </table>

    <!-- 三一起重专用查看记录窗口 -->
    <dialog-comp
      :visible.sync="isShowOver"
      :dialog-title="$t('deviceDetail.deviceInstallRecord')"
      :dialog-width="dWidth"
      dialog-unit="px"
      :dialog-height="400"
    >
      <!-- 安装记录的弹窗 -->
      <div class="body-list">
        <div
          v-for="(item, idx) in installRecordList"
          :key="'installList' + idx"
          class="record-list"
        >
          <!-- 1 -->
          <div class="install-item">
            <div>
              <span :style="{ letterSpacing: letterSpacing04 + 'px' }">{{
                $t("common.deviceImei")
              }}</span
              >：
              <span>{{ item.deviceImei }}</span>
            </div>
            <div>
              <span :style="{ letterSpacing: letterSpacing04 + 'px' }">{{
                $t("car.carNo")
              }}</span
              >：
              <span>{{ item.platNumber }}</span>
            </div>
          </div>
          <!-- 2 -->
          <div class="install-item">
            <div>
              <span>{{ $t("deviceDetail.installPerson") }}：</span>
              <span>{{ item.installPerson }}</span>
            </div>
            <div>
              <span>{{ $t("deviceDetail.installSite") }}：</span>
              <span>{{ item.installSite }}</span>
            </div>
          </div>
          <!-- 3 -->
          <div class="install-item">
            <div>
              <span>{{ $t("insurance.installTime") }}：</span>
              <span>{{ item.installDate | fdatetime }}</span>
            </div>
            <div>
              <span>{{ $t("common.updateTime") }}：</span>
              <span>{{ item.updateTime | fdatetime }}</span>
            </div>
          </div>
          <!-- 4 -->
          <div class="install-item1">
            <span :style="{ letterSpacing: letterSpacing12 + 'px' }">{{
              $t("deviceDetail.remark")
            }}</span
            >：
            <span>{{ item.remark }}</span>
          </div>
        </div>
      </div>
      <div class="btn-content-list" style="text-align:center">
        <el-button type="primary" size="small" @click="exportRecordList">{{
          $t("common.export")
        }}</el-button>
      </div>
    </dialog-comp>
    <!-- end -->
  </div>
</template>

<script src="@/pages/DeviceDialog/deviceDetail.js"></script>

<style lang="scss">
.body-list {
  width: 100%;
  overflow: scroll;
  height: calc(100% - 22px);
}

.device-detail {
  max-height: 560px;
  overflow-x: auto;
  overflow-y: auto;
  .record-list {
    padding: 10px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
    margin: 10px;
    line-height: 18px;
    border-radius: 4px;
    .install-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        width: 49%;
      }
    }
  }
  table.form-table > tr {
    // white-space: nowrap;
    > td:nth-child(odd) {
      font-weight: normal;
    }
    > td.hover-box {
      position: relative;
      cursor: pointer;
      font-weight: bold !important;
    }
    > td.hover-box .orange-box {
      display: none;
      position: absolute;
      white-space: normal;
      width: 20rem;
      border-radius: 0.5rem;
      z-index: 2;
    }
    > td.hover-box:hover .orange-box {
      display: inline-block;
      top: -70px;
      left: 45px;
    }
  }

  .actived {
    cursor: not-allowed;
    color: gray !important;
  }
  .actived input[type="radio"].text-input:checked {
    // background-image: url("../assets/img/dot12.svg");
    background-size: 80% 80%;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
  .actived input:checked[type="radio"] {
    border: solid 0.1rem gray;
  }
}
</style>
<style scoped lang="scss">
.date-input-time {
  ::v-deep .el-input__inner {
    padding-left: 25px !important;
  }
}
::v-deep .el-image {
  width: 45px;
  vertical-align: middle;
  margin-left: 5px;
}
#device-content {
  ::v-deep .el-input--small .el-input__inner {
    padding-left: 30px !important;
  }
  ::v-deep .el-input__icon {
    line-height: 32px !important;
    height: 32px !important;
  }
}
</style>
