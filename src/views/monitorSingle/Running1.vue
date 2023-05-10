<template>
  <section class="body-content">
    <div class="form-card" style="flex: 1; position: relative">
      <!--切换表格tab start-->
      <div class="card-header">
        <ul class="select-tabs">
          <li
            v-for="(item, idx) in $t('running1.runningTabs')"
            :class="[currentTable == idx ? 'active' : '']"
            @click="changeCurrentTable(idx, item.name)"
            :key="'running' + idx"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
      <!--切换表格tab end-->
      <div class="card-body" style="position: absolute; top: 30px; width: 99%">
        <!--查询条件 start-->
        <table class="form-table">
          <tr>
            <td>{{ $t("alarm.timeSetting") }}:</td>
            <td colspan="6" style="text-align: left; white-space: nowrap">
              <el-button
                type="primary"
                size="small"
                style="margin-right: 6px"
                v-for="(item, idx) in $t('alarm.range')"
                :key="'timerange' + idx"
                class="btn-white small"
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
                v-model="timeFrom"
                type="date"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </td>
            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <!-- <datetime-picker :datetime.sync="timeTo"></datetime-picker> -->
              <el-date-picker
                v-model="timeTo"
                type="date"
                format="yyyy-MM-dd"
                style="width: 150px"
              ></el-date-picker>
            </td>
            <td v-show="currentTable == 5">
              {{ $t("alarm.limitedAlarmType") }}:
            </td>
            <td v-show="currentTable == 5">
              <el-select v-model="alertTypeId" style="width: 180px">
                <el-option
                  v-for="(item, idx) in $t('common.alarmTypeList')"
                  :value="item.num"
                  :key="'alarmType' + idx"
                  :label="item.text"
                ></el-option>
              </el-select>
            </td>

            <td>
              <el-button type="primary" @click="searchTable">{{
                $t("common.search")
              }}</el-button>
            </td>
          </tr>
        </table>

        <!--查询条件 end-->

        <div style="height: calc(100% - 70px)">
          <!--里程表格-->
          <data-table
            v-show="currentPart == 'mileage'"
            :data="mileageList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('alarm.date')" width="140">
              <template slot-scope="props">
                {{ props.row.date | fdate }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('running.mileage')"
              width="120"
              prop="mileage"
            ></el-table-column>
            <el-table-column
              :label="$t('running.overspeed')"
              width="150"
              prop="overspeed"
            ></el-table-column>
            <el-table-column
              :label="$t('running.stay')"
              style="flex: 1"
              prop="stay"
            ></el-table-column>
          </data-table>
          <!--超速表格-->
          <data-table
            v-show="currentPart == 'overspeed'"
            :data="overspeedList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('alarm.locationTime')" width="140">
              <template slot-scope="props">
                {{ props.row.ts | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.speed')"
              width="100"
              prop="speed"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.longitude')"
              width="100"
              prop="longitude"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.latitude')"
              width="100"
              prop="latitude"
            ></el-table-column>
            <el-table-column :label="$t('common.address')" style="flex: 1">
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
            v-show="currentPart == 'stay'"
            :data="stayList"
            :show-index="true"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('common.startTime')" width="140">
              <template slot-scope="props">
                {{ props.row.startTs | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.endTime')" width="140">
              <template slot-scope="props">
                {{ props.row.stopTs | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('running.stayTime')"
              width="100"
              prop="stayTime"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.longitude')"
              width="100"
              prop="longitude"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.latitude')"
              width="100"
              prop="latitude"
            ></el-table-column>
            <el-table-column :label="$t('common.address')" style="flex;1">
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
            v-show="currentPart == 'acc'"
            :data="accList"
            :show-index="true"
          >
            <!--  -->
            <el-table-column :label="$t('running.openDate')" width="140">
              <template slot-scope="props">
                {{ props.row.openDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('running.closeDate')" width="140">
              <template slot-scope="props">
                {{ props.row.closeDate | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('running.mileage')"
              width="120"
              prop="mileage"
            ></el-table-column>
            <el-table-column
              :label="$t('running.durationTime')"
              style="flex: 1"
              prop="durationTime"
            ></el-table-column>
          </data-table>

          <!--统计表格 start-->

          <data-table
            :data="statisticsList"
            :show-index="true"
            v-show="currentPart == 'statistic'"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column :label="$t('alarm.date')" style="flex;1">
              <template slot-scope="props">
                {{ props.row.msgTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.shock')"
              prop="num2"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.powerOff')"
              prop="num3"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.lowPower')"
              prop="num4"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.overSpeed')"
              prop="num6"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.fenceOut')"
              prop="num7"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.antennaShort')"
              prop="num9"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.antennaOpen')"
              prop="num10"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.lowVoltage')"
              prop="num13"
              width="100"
            ></el-table-column>
            <el-table-column :label="$t('alarm.switchDoor')" width="100">
              <template slot-scope="props">
                {{ props.row.num16 + props.row.num17 }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.remove')"
              prop="num20"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.lightSense')"
              prop="num21"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.offline')"
              prop="num25"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.acceleration')"
              prop="num31"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.deceleration')"
              prop="num32"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.turnleft')"
              prop="num33"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.turnright')"
              prop="num34"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.weakSignal')"
              prop="num28"
              width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.recovery')"
              prop="num29"
              width="200"
            ></el-table-column>
          </data-table>

          <!--统计表格 end-->

          <!--详单表格 start-->

          <data-table
            :data="detailList"
            :show-index="true"
            v-show="currentPart == 'detail'"
            @getTableData="dealPager"
            :page="page"
          >
            <!--  -->
            <el-table-column
              :label="$t('alarm.alarmType')"
              prop="warnName"
              width="120"
            ></el-table-column>
            <el-table-column :label="$t('alarm.alarmTime')" width="140">
              <template slot-scope="props">
                {{ props.row.msgTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.latitude')"
              prop="latitude"
              width="120"
            ></el-table-column>
            <el-table-column
              :label="$t('alarm.longitude')"
              prop="longitude"
              width="120"
            ></el-table-column>
            <el-table-column :label="$t('alarm.locationTime')" width="140">
              <template slot-scope="props">
                {{ props.row.locTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarm.speed')"
              prop="speed"
              width="100"
            ></el-table-column>
            <el-table-column :label="$t('common.address')" style="flex: 1">
              <template slot-scope="props">
                <span v-if="props.row.address">{{ props.row.address }}</span>
                <a
                  v-if="!props.row.address"
                  @click="
                    dealDataTable(props.row, props.$index, 'alarmDetailAddress')
                  "
                  >{{ props.row.latitude | flatlng }},{{
                    props.row.longitude | flatlng
                  }}</a
                >
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import mapUtil from "@/utils/mapUtil.js";
import TimeRange from "@/components/TimeRangeComp/TimeRangeComp";
import {
  loadDeviceMileage,
  loadDeviceOverSpeed,
  loadDeviceStay,
  loadDeviceACC,
  loadDeviceStatistics,
  loadDeviceDetail
} from "@/api/monitor.js";
export default {
  name: "Running1",
  components: {
    "time-range": TimeRange
  },
  data: () => ({
    isLoading: false, //数据是否正在加载
    alertTypeId: 1, //选中报警类型
    currentTable: 0, //当前表格tab
    currentPart: "mileage", //当前表格内容
    imei: JSON.parse(window.localStorage.getItem("carweb_user")).deviceImei, //当前登录设备
    timeFrom: new Date(new Date().getTime() - 24 * 360 * 1000).format(
      "yyyy-MM-dd hh:mm"
    ), //查询开始时间
    timeTo: new Date().format("yyyy-MM-dd hh:mm"), //查询结束时间
    page: {
      name: "running1",
      pageSize: 30,
      num: 1,
      current: 1,
      total: 0
    },
    mileageList: [], //里程统计数据
    overspeedList: [], //超速统计数据
    stayList: [], //停留统计数据
    accList: [], //ACC统计数据
    statisticsList: [], //统计数据
    detailList: [], //详单数据
    isDateOver: false,
    isDateBefore: false,
    isDateLast: false,
    isTimeRangeBox: false
  }),
  watch: {
    timeFrom() {
      this.checkTimeRange();
    },
    timeTo() {
      this.checkTimeRange();
    }
  },
  methods: {
    onTimeRange(op) {
      this.timeFrom = op.startTimeFormat;
      this.timeTo = op.endTimeFormat;
    },
    checkTimeRange() {
      var halfYear = new Date().getTime() - 186 * 24 * 3600000;
      if (
        new Date(this.timeTo).getTime() < halfYear ||
        new Date(this.timeFrom).getTime() < halfYear
      ) {
        this.isDateLast = true;
      } else {
        this.isDateLast = false;
      }
      if (
        new Date(this.timeTo).getTime() - new Date(this.timeFrom) >
        31 * 24 * 3600000
      ) {
        this.isDateOver = true;
      } else {
        this.isDateOver = false;
      }
      if (new Date(this.timeFrom).getTime() > new Date(this.timeTo).getTime()) {
        this.isDateBefore = true;
      } else {
        this.isDateBefore = false;
      }
    },
    showDevice() {
      //搜索设备
      this.app.$emit("show-device-dialog1", {
        name: "DeviceDialog",
        imei: this.imei
      });
    },
    setTimeRange(tag) {
      //设置查询开始结束时间
      var from = new Date().getTime();
      var day = new Date().getDay() - 1;
      switch (tag) {
        case "today":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "day";
          break;
        case "yesterday":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date(from + 24 * 3600 * 1000 - 1000).format(
            "yyyy-MM-dd hh:mm:ss"
          );
          this.searchType = "day";
          break;
        case "thisWeek":
          from =
            new Date(new Date().format("yyyy-MM-dd")).getTime() -
            (day > 0 ? day : day + 7) * 24 * 3600 * 1000 -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "week";
          break;
        case "lastWeek":
          {
            day = day > 0 ? day : day + 7;

            from =
              new Date(new Date().format("yyyy-MM-dd")).getTime() -
              (day + 7) * 24 * 3600 * 1000 -
              8 * 60 * 60 * 1000;
            var to =
              new Date(new Date().format("yyyy-MM-dd")).getTime() -
              day * 24 * 3600 * 1000 -
              8 * 60 * 60 * 1000 -
              1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.searchType = "week";
          }

          break;
        case "thisMonth":
          var month = new Date().getMonth() + 1;
          from =
            new Date(
              new Date().getFullYear() +
                "-" +
                (month > 9 ? month : "0" + month) +
                "-01"
            ).getTime() -
            8 * 60 * 60 * 1000;
          this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
          this.timeTo = new Date().format("yyyy-MM-dd hh:mm:ss");
          this.searchType = "month";
          break;
        case "lastMonth":
          {
            var m = new Date(new Date().getTime() - 30 * 24 * 3600000);
            from =
              new Date(
                m.getFullYear() + "-" + (m.getMonth() + 1) + "-01"
              ).getTime() -
              8 * 60 * 60 * 1000;
            let to =
              new Date(
                new Date().getFullYear() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-01"
              ) -
              8 * 60 * 60 * 1000 -
              1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm:ss");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm:ss");
            this.searchType = "month";
          }

          break;
      }
    },
    dealDataTable(op) {
      //处理表格操作
      var that = this;
      if (op.name == "overSpeedAddress") {
        //超速表格地址
        var lng = op.item.baidu_lon,
          lat = op.item.baidu_lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.overspeedList[op.idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        }
      } else if (op.name == "stayAddress") {
        //停留表格地址
        let lng = op.item.baidu_lon,
          lat = op.item.baidu_lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.stayList[op.idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        }
      } else if (op.name == "alarmDetailAddress") {
        //报警表格地址
        let lng = op.item.baidu_lon,
          lat = op.item.baidu_lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.detailList[op.idx].address = address
              ? address
              : that.$t("common.addressFail");
          });
        }
      }
    }, //查询表格
    searchTable() {
      this.page.current = 1;
      this.dealPager();
    }, //改变分页器页
    dealPager() {
      switch (this.currentPart) {
        case "mileage":
          this.loadMileage();
          break;
        case "overspeed":
          this.loadOverSpeed();
          break;
        case "stay":
          this.loadStay();
          break;
        case "acc":
          this.loadACC();
          break;
        case "statistic":
          this.loadStatistics();
          break;
        case "detail":
          this.loadDetail();
          break;
      }
    },
    cnTime: mapUtil.cnTime, //加载里程统计
    loadMileage() {
      this.isLoading = true;
      var that = this;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei
      };
      loadDeviceMileage(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.mileageList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    }, //加载超速统计
    loadOverSpeed() {
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.limit,
        deviceImei: this.imei
      };
      loadDeviceOverSpeed(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.childs.length; i++) {
            res.data.childs[i].address = "";
          }
          this.overspeedList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    }, //加载停留统计
    loadStay() {
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei
      };
      loadDeviceStay(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          var data = res.data;
          for (var i = 0; i < data.childs.length; i++) {
            var item = data.childs[i];
            data.childs[i].address = "";
            data.childs[i].stayTime = mapUtil.cnTime(
              item.stopTs - item.startTs
            );
          }
          this.stayList = data.childs;
          this.page.num = Math.ceil(data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    },
    loadACC() {
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei
      };
      loadDeviceACC(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.accList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    }, //加载统计表格
    loadStatistics() {
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei
      };
      loadDeviceStatistics(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          this.statisticsList = res.data.childs;
          this.page.num = Math.ceil(res.data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    }, //加载详单表格
    loadDetail() {
      this.isLoading = true;
      var data = {
        t_start: new Date(this.timeFrom).getTime(),
        t_end: new Date(this.timeTo).getTime(),
        page: this.page.current,
        pageSize: this.page.pageSize,
        deviceImei: this.imei,
        alertTypeId: this.alertTypeId
      };
      loadDeviceDetail(data).then(res => {
        this.isLoading = false;
        if (res.errCode == "200") {
          var data = res.data;
          for (var i = 0; i < data.childs.length; i++) {
            data.childs[i].address = "";
          }
          this.detailList = data.childs;
          this.page.num = Math.ceil(data.itemsConut / this.page.pageSize);
          this.page.total = res.data.itemsConut;
        }
      });
    }, //切换表格tab
    changeCurrentTable(idx, name) {
      this.currentTable = idx;
      this.currentPart = name;
      this.page.current = 1;
      if (this.isDateLast || this.isDateOver || this.isDateBefore) return;
      switch (name) {
        case "mileage":
          this.loadMileage();
          break;
        case "overspeed":
          this.loadOverSpeed();
          break;
        case "stay":
          this.loadStay();
          break;
        case "acc":
          this.loadACC();
          break;
        case "statistic":
          this.loadStatistics();
          break;
        case "detail":
          this.loadDetail();
          break;
      }
    },
    listenEvent() {
      this.app.$on("select-user", this.onSelectUser);
      //this.app.$on('select-dev', this.onSelectDev);

      this.app.$on("device-list-op", this.dealDevOp);
    },
    offEvent() {
      this.app.$off("select-user", this.onSelectUser);

      this.app.$off("device-list-op", this.dealDevOp);
    }
  },
  mounted() {
    this.listenEvent();
    this.changeCurrentTable(0, "mileage");
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped>
.error-tip {
  display: inline;
  text-align: center;
  color: red;
  font-size: 12px;
  margin-right: 8px;
}
</style>
