<template>
  <section style="height: 100%">
    <div class="form-card" style="height: 100%">
      <!--运行总览抬头和操作 start-->
      <div class="card-header" style="padding-left: 10px">
        <span v-show="currentTable == 0">{{
          $t("running.runningOverview")
        }}</span>
        <span v-show="currentTable >= 1">
          <el-button
            type="primary"
            size="small"
            @click="dealDataTable({ name: 'back' })"
            >{{ $t("alarm.back") }}</el-button
          >
          <span v-show="currentTable == 1">{{
            $t("running.mileageStatistic")
          }}</span>
          <span v-show="currentTable == 2">{{
            $t("running.speedStatistic")
          }}</span>
          <span v-show="currentTable == 3">{{
            $t("running.stayStatistic")
          }}</span>
          <span v-show="currentTable == 4">{{
            $t("running.ACCStatistic")
          }}</span>
          :{{ imei }}
          <a
            class="text-blue"
            style="margin-left: 32px; cursor: pointer"
            @click="showDevice"
            >{{ $t("alarm.viewDevice") }}</a
          >
        </span>
        <el-button type="primary" size="small" @click="exportTable">{{
          $t("alarm.exportTable")
        }}</el-button>
      </div>
      <!--运行总览抬头和操作 end-->
      <div class="card-body">
        <!--运行总览查询条件 start-->
        <table style="width: 100%; white-space: nowrap" class="form-table">
          <tr>
            <td>{{ $t("alarm.timeSetting") }}:</td>
            <td colspan="3" style="text-align: left">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 5px"
                v-for="(item, idx) in $t('alarm.range')"
                :key="'timerange' + idx"
                @click="setTimeRange(item.name)"
                >{{ item.text }}</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="isTimeRangeBox = true"
                >{{ $t("datePicker.selectTimeRange") }}</el-button
              >
              <time-range
                :is-show.sync="isTimeRangeBox"
                @select-range="onTimeRange"
              ></time-range>
            </td>
            <td style="text-align: left; font-weight: normal">
              <div class="error-tip" v-show="isDateBefore">
                {{ $t("alarm.dateTip") }}
              </div>
              <div class="error-tip" v-show="isDateOver">
                {{ $t("alarm.dateTip1") }}
              </div>
              <div class="error-tip" v-show="isDateLast">
                {{ $t("alarm.dateTip2") }}
              </div>
            </td>
          </tr>
          <tr>
            <td>{{ $t("common.startTime") }}:</td>
            <td>
              <!-- <datetime-picker :datetime.sync="timeFrom"></datetime-picker> -->
              <el-date-picker
                type="datetime"
                v-model="timeFrom"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 195px"
              ></el-date-picker>
            </td>
            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <!-- <datetime-picker :datetime.sync="timeTo"></datetime-picker> -->
              <el-date-picker
                type="datetime"
                v-model="timeTo"
                format="yyyy-MM-dd hh:mm:ss"
                style="width: 195px"
              ></el-date-picker>
            </td>
            <td>
              <el-button type="primary" size="small" @click="searchTable">{{
                $t("alarm.search")
              }}</el-button>
            </td>
          </tr>
        </table>

        <!--运行总览查询条件 end-->
        <!--运行总览表格-->
        <div
          style="height: calc(100% - 70px); overflow-x: auto; overflow-y: hidden"
        >
          <data-table
            style="min-width: 850px"
            v-show="currentTable == 0"
            :data="runningList"
            :show-index="true"
            :is-loading="isLoading"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column
              :label="$t('common.deviceImei')"
              prop="deviceImei"
              min-width="120"
            ></el-table-column>
            <el-table-column
              :label="$t('common.deviceName')"
              prop="name"
              min-width="120"
            ></el-table-column>
            <el-table-column :label="$t('running.mileage')" min-width="100">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runMileage')"
                  >{{ props.row.mileage }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.overspeed')" min-width="100">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runSpeed')"
                  >{{ props.row.overspeed }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.stay')" min-width="120">
              <template slot-scope="props">
                <a @click="dealDataTable(props.row, props.$index, 'runStay')">{{
                  props.row.stay
                }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.acc')" min-width="100">
              <template slot-scope="props">
                <a @click="dealDataTable(props.row, props.$index, 'runACC')">{{
                  props.row.accRecordCount
                }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runDetail')"
                  >{{ $t("common.detail") }}</a
                >
                <a
                  @click="dealDataTable(props.row, props.$index, 'runPlayback')"
                  >{{ $t("common.playback") }}</a
                >
              </template>
            </el-table-column>
          </data-table>
          <!--里程表格-->
          <data-table
            style="min-width: 750px"
            v-show="currentTable == 1"
            :data="mileageList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('alarm.date')" min-width="120px">
              <template slot-scope="props">
                {{ props.row.date | fdate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.mileage')">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runMileage')"
                  >{{ props.row.mileage }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.overspeed')">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runSpeed')"
                  >{{ props.row.overspeed }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.stay')">
              <template slot-scope="props">
                <a @click="dealDataTable(props.row, props.$index, 'runStay')">{{
                  props.row.stay
                }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="props">
                <a
                  @click="dealDataTable(props.row, props.$index, 'runPlayback')"
                  >{{ $t("common.playback") }}</a
                >
              </template>
            </el-table-column>
          </data-table>
          <!--超速表格-->
          <data-table
            style="min-width: 850px"
            v-show="currentTable == 2"
            :data="overspeedList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('alarm.locationTime')" min-width="120">
              <template slot-scope="props">
                {{ props.row.ts | fdateTime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.speed')"
              prop="speed"
              min-width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.longitude')"
              prop="longitude"
              min-width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.latitude')"
              prop="latitude"
              min-width="100"
            ></el-table-column>
            <el-table-column :label="$t('common.address')" min-width="300">
              <template slot-scope="props">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <a
                  @click="
                    dealDataTable(props.row, props.$index, 'overSpeedAddress')
                  "
                  v-if="!props.row.address"
                  >{{ props.row.latitude | flatlng }},{{
                    props.row.longitude | flatlng
                  }}</a
                >
              </template>
            </el-table-column>
          </data-table>
          <!--停留表格-->
          <data-table
            style="min-width: 850px"
            v-show="currentTable == 3"
            :data="stayList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('common.startTime')">
              <template slot-scope="props">
                {{ props.row.startTs | fdateTime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.endTime')">
              <template slot-scope="props">
                {{ props.row.stopTs | fdateTime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.stayTime')">
              <template slot-scope="props">
                {{ props.row.stayTime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.longitude')">
              <template slot-scope="props">
                {{ props.row.longitude }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.latitude')">
              <template slot-scope="props">
                {{ props.row.latitude }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.address')">
              <template slot-scope="props">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <a
                  @click="dealDataTable(props.row, props.$index, 'stayAddress')"
                  v-if="!props.row.address"
                  >{{ props.row.latitude | flatlng }},{{
                    props.row.longitude | flatlng
                  }}</a
                >
              </template>
            </el-table-column>
          </data-table>
          <!--ACC表格-->
          <data-table
            style="min-width: 750px"
            v-show="currentTable == 4"
            :data="accList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('running.openDate')" min-width="120">
              <template slot-scope="props">
                {{ props.row.openDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.closeDate')" min-width="120">
              <template slot-scope="props">
                {{ props.row.closeDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('running.mileage')"
              prop="mileage"
              min-width="120"
            ></el-table-column>
            <el-table-column
              :label="$t('running.durationTime')"
              prop="durationTime"
            >
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script src="../js/running.js"></script>

<style scoped>
.error-tip {
  display: inline;
  text-align: center;
  color: red;
  font-size: 12px;
  margin-right: 8px;
}
</style>
