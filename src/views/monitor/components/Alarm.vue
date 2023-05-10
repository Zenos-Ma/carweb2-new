<template>
  <section style="height: 100%">
    <div class="form-card" style="height: 100%; width: 100%">
      <!--报警总览抬头信息和操作 start-->

      <div class="card-header" style="padding-left: 10px">
        <span v-show="currentTable == 0">
          {{ $t("alarm.alarmOverview") }}
          <i class="iconfont icon-chart" style="font-weight: normal; color: #0095ec" @click="showChartPage"></i>
        </span>
        <span v-show="currentTable >= 1">
          <el-button type="primary" size="small" @click="dealDataTable({ name: 'back' })">{{ $t("alarm.back") }}</el-button>
          <span v-show="currentTable == 1">{{ $t("alarm.alarmStatistic") }}</span>
          <span v-show="currentTable == 2">{{ $t("alarm.alarmDetail") }}</span>
          :{{ imei }}
          <a class="text-blue" style="margin-left: 32px; cursor: pointer" @click="showDevice">{{ $t("alarm.viewDevice") }}</a>
        </span>
        <el-button type="primary" size="small" @click="exportTable">{{ $t("alarm.exportTable") }}</el-button>
        <el-button type="primary" size="small" @click="exportTableAll">{{ $t("common.exportAll") }}</el-button>

        <el-checkbox v-model="isChild">{{ $t("common.containChild") }}</el-checkbox>
        <el-checkbox v-model="isExportNotMsg">{{ $t("alarm.exportNoMsg") }}</el-checkbox>
      </div>

      <!--报警总览抬头信息和操作 end-->
      <div class="card-body">
        <!--报警总览条件选择 start-->
        <table style="width: 100%; white-space: nowrap" class="form-table">
          <tr>
            <td>{{ $t("alarm.timeSetting") }}:</td>
            <td style="text-align: left">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 5px"
                v-for="(item, idx) in $t('alarm.range')"
                :key="'timerange' + idx"
                class="btn-white small"
                @click="setTimeRange(item.name)"
                >{{ item.text }}</el-button
              >
              <el-button type="primary" size="small" @click="isTimeRangeBox = true">{{ $t("datePicker.selectTimeRange") }}</el-button>
              <time-range :is-show.sync="isTimeRangeBox" @select-range="onTimeRange"></time-range>
              <el-button type="primary" size="small" @click="isColumnDialog = true" v-show="currentTable == 0">{{ $t("alarm.selectColumn") }}</el-button>
            </td>
            <!-- 时间范围错误提示 -->
            <td style="text-align: left; font-weight: normal">
              <div class="error-tip" v-show="isDateBefore">{{ $t("alarm.dateTip") }}</div>
              <div class="error-tip" v-show="isDateOver">{{ $t("alarm.dateTip1") }}</div>
              <div class="error-tip" v-show="isDateLast">{{ $t("alarm.dateTip2") }}</div>
            </td>
          </tr>
          <tr>
            <td>{{ $t("common.startTime") }}:</td>
            <td colspan="2" style="text-align: left">
              <!-- <datetime-picker :datetime.sync="timeFrom"></datetime-picker> -->
              <el-date-picker type="datetime" v-model="timeFrom" format="yyyy-MM-dd hh:mm:ss" style="width: 195px"></el-date-picker>
              <span class="form-table-span">{{ $t("common.endTime") }}:</span>
              <el-date-picker type="datetime" v-model="timeTo" format="yyyy-MM-dd hh:mm:ss" style="width: 195px"></el-date-picker>

              <el-button type="primary" @click="searchTable">{{ $t("alarm.search") }}</el-button>
            </td>
          </tr>

          <tr v-show="currentTable == 2">
            <td>{{ $t("alarm.limitedAlarmType") }}:</td>
            <td colspan="4" style="text-align: left">
              <el-select v-model="alertTypeId" style="width: 188px">
                <el-option v-for="(item, idx) in $t('common.alarmTypeList')" :value="item.num" :key="'alarmTypeList' + idx" :label="item.text"></el-option>
              </el-select>
            </td>
          </tr>
        </table>

        <!--报警总览条件选择 end-->

        <!--报警总览表格 start-->
        <div style="height: calc(100% - 80px); overflow-x: auto; overflow-y: hidden; width: 100%" v-show="currentTable == 0">
          <data-table style="min-width: 2800px" :data="alarmList" :show-index="true" :page="page" @getTableData="dealPager">
            <!--  -->
            <el-table-column :label="$t('common.deviceImei')" v-show="getColumnsState(0)" min-width="250">
              <template slot-scope="props">
                {{ props.row.deviceImei }}
                <a @click="dealDataTable(props.row, props.$index, 'alarmDevice')">{{ $t("alarm.view") }}</a>
                <a @click="dealDataTable(props.row, props.$index, 'alarmStatistics')">{{ $t("alarm.statistics") }}</a>
                <a @click="dealDataTable(props.row, props.$index, 'alarmDetail')">{{ $t("alarm.detail") }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.deviceName')" v-show="getColumnsState(1)" min-width="120" prop="name"></el-table-column>
            <el-table-column :label="$t('alarm.shock')" v-show="getColumnsState(2)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 2)">{{ props.row.num2 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.powerOff')" v-show="getColumnsState(3)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 3)">{{ props.row.num3 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.lowPower')" v-show="getColumnsState(4)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 4)">{{ props.row.num4 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.overSpeed')" v-show="getColumnsState(5)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 6)">{{ props.row.num6 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.fenceOut')" v-show="getColumnsState(6)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 7)">{{ props.row.num7 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.antennaShort')" v-show="getColumnsState(7)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 9)">{{ props.row.num9 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.antennaOpen')" v-show="getColumnsState(8)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 10)">{{ props.row.num10 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.lowVoltage')" v-show="getColumnsState(9)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 13)">{{ props.row.num13 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.switchDoor')" v-show="getColumnsState(10)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 16)">{{ props.row.num16 + props.row.num17 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.remove')" v-show="getColumnsState(11)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 20)">{{ props.row.num20 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.lightSense')" v-show="getColumnsState(12)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 21)">{{ props.row.num21 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.offline')" v-show="getColumnsState(13)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 25)">{{ props.row.num25 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.acceleration')" v-show="getColumnsState(14)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 31)">{{ props.row.num31 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.deceleration')" v-show="getColumnsState(15)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 32)">{{ props.row.num32 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.turnleft')" v-show="getColumnsState(16)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 33)">{{ props.row.num33 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.turnright')" v-show="getColumnsState(17)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 34)">{{ props.row.num34 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.weakSignal')" v-show="getColumnsState(18)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 28)">{{ props.row.num28 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.clockin')" v-show="getColumnsState(19)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 44)">{{ props.row.num44 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.staticAlarm')" v-show="getColumnsState(20)" min-width="100">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 45)">{{ props.row.num45 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.shielding')" v-show="getColumnsState(21)" min-width="140">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 46)">{{ props.row.num46 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.bluetoothBroken')" v-show="getColumnsState(22)" min-width="140">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 47)">{{ props.row.num47 }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.recovery')" v-show="getColumnsState(23)" min-width="160">
              <template slot-scope="props">
                <a @click="onAlarmTableAction(props.row.deviceImei, 29)">{{ props.row.num29 }}</a>
              </template>
            </el-table-column>
          </data-table>
        </div>
        <!--报警总览表格 end-->

        <!--统计表格 start-->
        <div style="height: calc(100% - 80px); overflow-x: auto; overflow-y: hidden; width: 100%" v-show="currentTable == 1">
          <data-table style="min-width: 2500px" :data="statisticsList" :show-index="true" :page="page" @getTableData="dealPager">
            <!--  -->
            <el-table-column :label="$t('alarm.date')" min-width="120">
              <template slot-scope="props">
                {{ props.row.msgTime | fdate }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.shock')" prop="num2" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.powerOff')" prop="num3" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.lowPower')" prop="num4" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.overSpeed')" prop="num6" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.fenceOut')" prop="num7" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.antennaShort')" prop="num9" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.antennaOpen')" prop="num10" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.lowVoltage')" prop="num13" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.switchDoor')" min-width="100">
              <template slot-scope="props">
                {{ props.row.num16 + props.row.num17 }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.remove')" prop="num20" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.lightSense')" prop="num21" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.offline')" prop="num25" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.acceleration')" prop="num31" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.deceleration')" prop="num32" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.turnleft')" prop="num33" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.turnright')" prop="num34" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.weakSignal')" prop="num28" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.clockin')" prop="num44" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.staticAlarm')" prop="num45" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.shielding')" prop="num46" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.bluetoothBroken')" prop="num47" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.recovery')" prop="num29" min-width="160"></el-table-column>
          </data-table>
        </div>
        <!--统计表格 end-->

        <!--详单表格 start-->
        <div style="height: calc(100% - 125px); overflow-x: auto; overflow-y: hidden; width: 100%" v-show="currentTable == 2">
          <data-table style="min-width: 1050px" :data="detailList" :show-index="true" :page="page" @getTableData="dealPager">
            <!--  -->
            <el-table-column :label="$t('alarm.alarmType')" prop="warnName" min-width="120"></el-table-column>
            <el-table-column :label="$t('alarm.alarmTime')" min-width="120">
              <template slot-scope="props">
                {{ props.row.msgTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.latitude')" prop="latitude" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.longitude')" prop="longitude" min-width="100"></el-table-column>
            <el-table-column :label="$t('alarm.locationTime')" min-width="120">
              <template slot-scope="props">
                {{ props.row.locTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('alarm.speed')" prop="speed" min-width="100"></el-table-column>
            <el-table-column min-width="120">
              <template slot="header">
                <span>{{ $t("common.address") }}</span>
                <el-button v-show="iDeng" size="small" @click="onParseAddress">{{ $t("alarm.parseAddress") }}</el-button>
              </template>
              <template slot-scope="props">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <a v-if="!props.row.address" @click="dealDataTable(props.row, props.$index, 'alarmDetailAddress')">{{ props.row.latitude | flatlng }},{{ props.row.longitude | flatlng }}</a>
              </template>
            </el-table-column>
          </data-table>
        </div>
        <!--详单表格 end-->
        <!-- <pager :pname="pager.name" :num="pager.num" :limit="pager.limit" :current.sync="pager.current" @change-current="dealPager"></pager> -->
      </div>
    </div>

    <dialog-comp :visible.sync="isColumnDialog" :dialog-title="$t('alarm.selectColumn')" :dialog-width="400">
      <div style="line-height: 30px">
        <el-button type="primary" size="small" @click="onSelectAllColumns">{{ $t("alarm.selectAll") }}</el-button>
        <el-button type="warning" size="small" @click="onUnselectAllColumns" class="btn-white small">{{ $t("alarm.unselectAll") }}</el-button>
      </div>

      <div style="display: inline-block; width: 50%; line-height: 30px" v-for="(item, idx) in exportTitle" :key="'exportTitle' + idx">
        <input class="text-input" type="checkbox" v-model="exportColumns" :value="idx" />
        {{ item.name }}
      </div>
    </dialog-comp>
  </section>
</template>

<script src="../js/alarm.js"></script>

<style scoped>
  .error-tip {
    display: inline;
    text-align: center;
    color: red;
    font-size: 12px;
    margin-right: 8px;
  }
</style>
