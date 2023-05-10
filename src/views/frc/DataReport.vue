<template>
  <div class="form-card data-report-content layout-container">
    <el-tabs v-model="currentTab" @tab-click="changeTab" type="border-card">
      <el-tab-pane
        v-for="(item, idx) in $t('report.tabs')"
        :key="'report-tab' + idx"
        :name="item.name"
      >
        <span slot="label">
          <i :class="['iconfont', item.icon]"></i>
          <span>{{ item.text }}</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <div class="card-body data-report">
      <!--查询订单条件 start-->
      <table class="form-table" style="width: 100%; min-width: 1100px">
        <tr>
          <td>
            <span class="require-icon">*</span>
            {{ $t("rechargeBill.timeRangeTip") }}:
          </td>
          <td>
            <el-radio v-model="isTime" :label="false">{{
              $t("common.all")
            }}</el-radio>
            <el-radio v-model="isTime" :label="true">{{
              $t("rechargeBill.custom")
            }}</el-radio>
          </td>
          <td>{{ $t("common.startTime") }}:</td>
          <td>
            <el-date-picker
              v-model="timeFrom"
              type="date"
              format="yyyy-MM-dd"
              :disabled="!isTime"
              style="width: 160px"
            ></el-date-picker>
          </td>

          <td>{{ $t("common.endTime") }}:</td>
          <td>
            <el-date-picker
              v-model="timeTo"
              type="date"
              format="yyyy-MM-dd"
              :disabled="!isTime"
              style="width: 160px"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.userName") }}:</td>
          <td>
            <el-input
              style="width: 160px"
              v-model="userName"
              @keyup.enter.native="searchUser"
              :placeholder="$t('common.searchUserTip')"
            />
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="RechargeBill"
              :is-show.sync="isUserBox"
              :search-key="userName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td>
            <el-input
              style="width: 160px"
              v-model="deviceImei"
              @keyup.enter.native="searchDev"
              :placeholder="$t('common.searchDevTip')"
            />
            <el-button type="primary" @click="searchDev">{{
              $t("common.search")
            }}</el-button>
            <device-box
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
          <td>{{ $t("report.selectContext") }}:</td>
          <td>
            <el-button type="warning" size="small" @click="searchTable">{{
              $t("common.search")
            }}</el-button>
            <el-button type="info" size="small" @click="exportTable">{{
              $t("common.export")
            }}</el-button>
            <el-button
              type="success"
              size="small"
              style="width: 70px"
              @click="exportTable('all')"
              >{{ $t("common.exportAll") }}</el-button
            >
          </td>
        </tr>
      </table>

      <div
        style="height: calc(100% - 80px)"
        v-if="currentTab == 'pledge-stay'"
        v-cloak
      >
        <!-- 二押久留报表 -->
        <!--  -->
        <data-table
          :data="dataList"
          border
          @selection-change="handleSelection"
          :page="page"
          @getTableData="searchTable"
          :show-selection="true"
        >
          <el-table-column
            prop="deviceImei"
            :label="$t('common.deviceImei')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="plateNumbers"
            :label="$t('common.carNo')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="plateName"
            :label="$t('common.owner')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="defenseName"
            :label="$t('report.pledgeName')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="defenseType1"
            :label="$t('report.pledgeType')"
            width="150px"
          ></el-table-column>
          <el-table-column :label="$t('report.stayTime')" width="150px">
            <template slot-scope="scope">
              <span :title="scope.row.stayLong1">
                {{ scope.row.stayLong1 ? scope.row.stayLong1 : 0 }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.address')"
            min-width="350"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
              <a v-if="!scope.row.address" @click="showAddress(scope.$index)"
                >{{ scope.row.latitude | flatlng }},{{
                  scope.row.longitude | flatlng
                }}</a
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
      <div
        style="height: calc(100% - 80px)"
        v-if="currentTab == 'pledge-in-out'"
        v-cloak
      >
        <!-- 进二押报表 -->
        <!--  -->
        <data-table
          :data="dataList"
          :page="page"
          @getTableData="searchTable"
          @selection-change="handleSelection"
          :show-selection="true"
        >
          <el-table-column
            prop="deviceImei"
            :label="$t('common.deviceImei')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="plateNumbers"
            :label="$t('common.carNo')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="plateName"
            :label="$t('common.owner')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="defenseName"
            :label="$t('report.pledgeName')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="defenseType1"
            :label="$t('report.pledgeType')"
            width="150px"
          ></el-table-column>
          <el-table-column :label="$t('report.time')" width="180px">
            <template slot-scope="scope">
              <span :title="scope.row.alarmDate">
                {{ scope.row.alarmDate | fdatetime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.address')"
            min-width="350"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
              <a v-if="!scope.row.address" @click="showAddress(scope.$index)"
                >{{ scope.row.latitude | flatlng }},{{
                  scope.row.longitude | flatlng
                }}</a
              >
            </template>
          </el-table-column>
        </data-table>
        <!--  -->
      </div>
      <div
        style="height: calc(100% - 80px)"
        v-if="currentTab == 'fence-in-out'"
        v-cloak
      >
        <!-- 出二押点报表 -->
        <!--  -->
        <data-table
          :data="dataList"
          :page="page"
          @getTableData="searchTable"
          @selection-change="handleSelection"
          :show-selection="true"
        >
          <el-table-column
            prop="deviceImei"
            :label="$t('common.deviceImei')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="plateNumbers"
            :label="$t('common.carNo')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="plateName"
            :label="$t('common.owner')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="defenseName"
            :label="$t('report.fenceName')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="defenseType1"
            :label="$t('report.pledgeType')"
            width="150px"
          ></el-table-column>
          <el-table-column :label="$t('report.time')" width="180px">
            <template slot-scope="scope">
              <span :title="scope.row.alarmDate">
                {{ scope.row.alarmDate | fdatetime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.address')"
            min-width="350"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
              <a v-if="!scope.row.address" @click="showAddress(scope.$index)"
                >{{ scope.row.latitude | flatlng }},{{
                  scope.row.longitude | flatlng
                }}</a
              >
            </template>
          </el-table-column>
        </data-table>
        <!--  -->
      </div>
      <div
        style="height: calc(100% - 80px)"
        v-if="currentTab == 'offline-time'"
      >
        <!-- 离线时长报表 -->
        <!--  -->
        <data-table
          :data="dataList"
          :page="page"
          @getTableData="searchTable"
          @selection-change="handleSelection"
          :show-selection="true"
        >
          <el-table-column
            prop="deviceImei"
            :label="$t('common.deviceImei')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="plateNumbers"
            :label="$t('common.carNo')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="plateName"
            :label="$t('common.owner')"
            width="120px"
          ></el-table-column>

          <el-table-column :label="$t('report.time')" width="180px">
            <template slot-scope="scope">
              <span :title="scope.row.locateDate">
                {{ scope.row.locateDate | fdatetime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="duration"
            :label="$t('report.duration')"
            width="120px"
          ></el-table-column>
          <el-table-column
            :label="$t('common.address')"
            min-width="350"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
              <a v-if="!scope.row.address" @click="showAddress(scope.$index)"
                >{{ scope.row.latitude | flatlng }},{{
                  scope.row.longitude | flatlng
                }}</a
              >
            </template>
          </el-table-column>
        </data-table>
        <!--  -->
      </div>
      <div style="height: calc(100% - 80px)" v-if="currentTab == 'dev-status'">
        <!-- 设备实时状态报表 -->
        <!--  -->
        <data-table
          :data="dataList"
          @selection-change="handleSelection"
          :page="page"
          @getTableData="searchTable"
          :show-selection="true"
        >
          <el-table-column
            prop="deviceImei"
            :label="$t('common.deviceImei')"
            width="150px"
          ></el-table-column>
          <el-table-column
            prop="plateNumbers"
            :label="$t('common.carNo')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="plateName"
            :label="$t('common.owner')"
            width="120px"
          ></el-table-column>
          <el-table-column
            prop="status"
            :label="$t('common.status')"
            width="120px"
          ></el-table-column>
          <el-table-column :label="$t('report.latestTime')" width="180px">
            <template slot-scope="scope">
              <span :title="scope.row.locateDate">
                {{ scope.row.locateDate | fdatetime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="duration"
            :label="$t('report.statusDuration')"
            width="180px"
          ></el-table-column>
          <el-table-column
            :label="$t('report.latestLocation')"
            min-width="350"
            fixed="right"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.address">{{ scope.row.address }}</span>
              <a v-if="!scope.row.address" @click="showAddress(scope.$index)"
                >{{ scope.row.latitude | flatlng }},{{
                  scope.row.longitude | flatlng
                }}</a
              >
            </template>
          </el-table-column>
        </data-table>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script>
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import ExportUtil from "@/utils/exportUtil.js";
import {
  loadTurnoverAlarmInfo,
  loadPledgeStayInfo,
  loadDeviceStatusInfo
} from "@/api/risk.js";
export default {
  name: "DataReport",
  components: {
    "user-box": UserBox,
    "device-box": DeviceBox
  },
  data: () => ({
    currentTab: "pledge-stay",
    page: {
      //报表分页
      name: "DataReport",
      num: 1,
      current: 1,
      pageSize: 20,
      total: 0
    },
    timeFrom: new Date().format("yyyy-01-01"), //开始时间
    timeTo: new Date().format("yyyy-MM-dd"), //结束时间
    isDeviceBox: false, //显示隐藏设备搜索结果box
    isUserBox: false, //显示隐藏用户搜索结果box
    deviceImei: "", //设备号
    // userId: "", //用户id
    userName: "", //用户名
    isTime: false, //是否自定义时间范围
    isChild: false, //是否包含下级
    dataList: [], //报表数据
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    denfenseTypeList: [], //二押点类型列表
    selectList: [] //选中的信息的下标
  }),
  watch: {
    userName() {
      if (!this.userName) {
        this.userId = "";
      }
    },
    deviceImei() {
      if (!this.deviceImei) {
        this.isDeviceBox = false;
      }
    }
  },
  methods: {
    handleSizeChange() {},
    handleCurrentChange(current) {
      this.page.current = current;
    },
    handleSelection(arr) {
      this.selectList = arr;
    },
    tableRowClassName({ row, rowIndex }) {
      // 表格中条纹的设置
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        // return "success-row";
      }
      return "";
    },
    exportEcall(list) {
      // 导出xls表格
      switch (this.currentTab) {
        case "pledge-stay":
          var title = [
            this.$t("common.num"),
            this.$t("common.deviceImei"),
            this.$t("car.carNo"),
            this.$t("car.carOwner"),
            this.$t("report.pledgeName"),
            this.$t("report.pledgeType"),
            this.$t("report.stayTime"),
            this.$t("common.address")
          ];
          var theList = [];
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            theList.push([
              i + 1,
              item.deviceImei,
              item.plateNumbers,
              item.plateName,
              item.defenseName,
              item.defenseType1,
              item.stayLong1 ? item.stayLong1 : 0,
              item.address ? item.address : item.longitude + "," + item.latitude
            ]);
            console.log(theList);
          }
          ExportUtil.exportTable(
            title,
            theList,
            this.$t("report.pledgeListXls")
          );
          break;
        case "pledge-in-out":
          var list1 = list;
          var title1 = [
            this.$t("common.num"),
            this.$t("common.deviceImei"),
            this.$t("car.carNo"),
            this.$t("car.carOwner"),
            this.$t("report.pledgeName"),
            this.$t("report.pledgeType"),
            this.$t("report.inTime"),
            this.$t("common.address")
          ];
          var theList1 = [];
          for (let i = 0; i < list1.length; i++) {
            let item = list1[i];
            theList1.push([
              i + 1,
              item.deviceImei,
              item.plateNumbers,
              item.plateName,
              item.defenseName,
              item.defenseType1,
              item.alarmDate
                ? new Date(item.alarmDate).format("yyyy-MM-dd")
                : "",
              item.address ? item.address : item.longitude + "," + item.latitude
            ]);
            console.log(theList);
          }
          ExportUtil.exportTable(
            title1,
            theList1,
            this.$t("report.pledgeInOut")
          );
          break;
        case "fence-in-out":
          var list2 = list;
          var title2 = [
            this.$t("common.num"),
            this.$t("common.deviceImei"),
            this.$t("car.carNo"),
            this.$t("car.carOwner"),
            this.$t("report.pledgeName"),
            this.$t("report.pledgeType"),
            this.$t("report.outTime"),
            this.$t("common.address")
          ];
          var theList2 = [];
          for (let i = 0; i < list2.length; i++) {
            let item = list2[i];
            theList2.push([
              i + 1,
              item.deviceImei,
              item.plateNumbers,
              item.plateName,
              item.defenseName,
              item.defenseType1,
              item.alarmDate
                ? new Date(item.alarmDate).format("yyyy-MM-dd")
                : "",
              item.address ? item.address : item.longitude + "," + item.latitude
            ]);
            console.log(theList);
          }
          ExportUtil.exportTable(title2, theList2, this.$t("report.pledgeOut"));
          break;
        case "offline-time":
          var list3 = list;
          var title3 = [
            this.$t("common.num"),
            this.$t("common.deviceImei"),
            this.$t("car.carNo"),
            this.$t("report.pledgeName"),
            this.$t("report.time"),
            this.$t("report.duration"),
            this.$t("common.address")
          ];
          var theList3 = [];
          for (let i = 0; i < list3.length; i++) {
            let item = list3[i];
            theList3.push([
              i + 1,
              item.deviceImei,
              item.plateNumbers,
              item.plateName,
              item.locateDate
                ? new Date(item.locateDate).format("yyyy-MM-dd")
                : "",
              item.duration,
              item.address ? item.address : item.longitude + "," + item.latitude
            ]);
            console.log(theList3);
          }
          ExportUtil.exportTable(
            title3,
            theList3,
            this.$t("report.offlineTime")
          );
          break;
        case "dev-status":
          var list4 = list;
          var title4 = [
            this.$t("common.num"),
            this.$t("common.deviceImei"),
            this.$t("car.carNo"),
            this.$t("report.pledgeName"),
            this.$t("common.status"),
            this.$t("report.latestTime"),
            this.$t("report.statusDuration"),
            this.$t("report.latestLocation")
          ];
          var theList4 = [];
          for (let i = 0; i < list4.length; i++) {
            let item = list4[i];
            theList4.push([
              i + 1,
              item.deviceImei,
              item.plateNumbers,
              item.plateName,
              item.status,
              item.locateDate
                ? new Date(item.locateDate).format("yyyy-MM-dd")
                : "",
              item.duration,
              item.address ? item.address : item.longitude + "," + item.latitude
            ]);
            console.log(theList4);
          }
          ExportUtil.exportTable(title4, theList4, this.$t("report.devStatus"));
          break;
      }
      // ExportUtil.exportTable(title, theList);
    },
    exportTable(tag) {
      // console.log(tag);
      // 信息表格的导出
      if (tag == "all") {
        this.exportEcall(this.dataList);
      } else {
        // 导出选中的当前表格的数据项
        // var origin_data = [];
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        this.exportEcall(this.selectList);
      }
    },
    getDenfenseType(code) {
      // 通过类型数字拿到类型文字
      this.denfenseTypeList = this.$t("pledge.pledgeTypeList");
      var list = this.denfenseTypeList;
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == code) {
          return str + list[i].text;
        }
      }
      return "";
    },
    getDevStatus(number) {
      // 通过数字拿到相应的类型文字
      var arr = ["", "行驶", "静止", "离线"];
      var str = "";
      for (var i in arr) {
        if (i == number) {
          return str + arr[i];
        }
      }
      return "";
    },
    changeTab(item) {
      //改变tab
      this.currentTab = item.name;
      this.page.current = 1;
      this.searchTable();
    },
    timeStamp(StatusMinute) {
      // 时间分钟转为小时
      var day = parseInt(StatusMinute / 60 / 24);
      var hour = parseInt((StatusMinute / 60) % 24);
      var min = parseInt(StatusMinute % 60);
      StatusMinute = "";
      if (day > 0) {
        StatusMinute = day + "天";
      }
      if (hour > 0) {
        StatusMinute += hour + "小时";
      }
      if (min > 0) {
        StatusMinute += parseFloat(min) + "分钟";
      }
      return StatusMinute;
    },
    showAddress(idx) {
      console.log(idx);
      //解析地址
      var that = this;
      if (idx < this.dataList.length && idx >= 0) {
        var item = this.dataList[idx];
        // this.$set(item, "address", item.address);
        var lng = item.longitude,
          lat = item.latitude;
        console.log(lng, lat);
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90 &&
          !this.dataList[idx].address
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            that.dataList[idx].address = address
              ? address
              : that.$t("common.addressFail"); //详细地址结果
            console.log("res", address);
          });
        }
      }
    },
    searchUser() {
      //搜索用户
      this.isUserBox = true;
      this.isDeviceBox = false;
    },

    searchDev() {
      //搜索设备
      if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
        this.isDeviceBox = true;
        this.isUserBox = false;
      } else {
        this.isDeviceBox = false;
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
      }
    },
    loadFenceInOut() {
      //进出围栏统计
      this.loadPledgeInOut();
    },
    loadProvinceOut() {
      //出省市围栏统计
      var list = [];
      for (let i = 0; i < this.page.pageSize; i++) {
        list.push({
          deviceImei: parseInt(Math.random() * 1000000),
          userName: "user" + i,
          plateNumber: "car" + i,
          province: "test" + i,
          time: new Date().getTime(),
          lat: (39.915 + 0.01 * i).toFixed(6),
          lng: (116.404 + 0.01 * i).toFixed(6),
          address: ""
        });
      }
      this.dataList = list;
    },
    loadPledgeInOut() {
      //进出二押点统计
      var data = {
        userId: this.userId,
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: true
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      this.currentTab == "pledge-in-out"
        ? (data.alarmType = 0)
        : (data.alarmType = 1);
      var tfrom = new Date().format("yyyy-01-01");
      if (this.isTime) {
        data.starDate = new Date(this.timeFrom).getTime();
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
      } else {
        data.starDate = new Date(tfrom).getTime();
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
        this.timeFrom = new Date().format("yyyy-01-01");
      }
      loadTurnoverAlarmInfo(data).then(res => {
        if (res.errCode == 200) {
          this.dataList = res.data.list;
          for (var i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], "address", "");
            this.dataList[i].defenseType1 = this.getDenfenseType(
              this.dataList[i].defenseTypeStr
            );
            this.dataList[i].stayLong1 = this.timeStamp(
              this.dataList[i].stayLong
            );
          }
          this.page.num = Math.ceil(res.data.total / this.page.limit);
          this.page.total = res.data.total;
          this.current = 1;
        }
      });
    },
    loadPledgeStay() {
      //二押点停留统计
      var data = {
        userId: this.userId,
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: true
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      var tfrom = new Date().format("yyyy-01-01");
      if (this.isTime) {
        data.starDate = new Date(this.timeFrom).getTime();
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
      } else {
        data.starDate = new Date(tfrom).getTime();
        // 拼接时间时注意要空一格
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
        this.timeFrom = new Date().format("yyyy-01-01");
      }
      loadPledgeStayInfo(data).then(res => {
        if (res.errCode == 200) {
          this.dataList = res.data.list;
          for (var i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], "address", "");
            this.dataList[i].defenseType1 = this.getDenfenseType(
              this.dataList[i].defenseTypeStr
            );
            this.dataList[i].stayLong1 = this.timeStamp(
              this.dataList[i].stayLong
            );
          }
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
          this.page.current = 1;
          // console.log(this.dataList);
        }
      });
    },
    loadOfflineTime() {
      //离线时长统计
      this.loadDevStatus();
    },
    loadDevStatus() {
      //设备状态统计
      var data = {
        userId: this.userId,
        status: this.currentTab == "dev-status" ? 0 : 3,
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: true
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      var tfrom = new Date().format("yyyy-01-01");
      if (this.isTime) {
        data.starDate = new Date(this.timeFrom).getTime();
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
      } else {
        data.starDate = new Date(tfrom).getTime();
        // 拼接时间时注意要空一格
        data.endDate = new Date(this.timeTo + " 23:59:59").getTime();
        this.timeFrom = new Date().format("yyyy-01-01");
      }
      loadDeviceStatusInfo(data).then(res => {
        if (res.errCode == 200) {
          this.dataList = res.data.list;
          for (var i = 0; i < this.dataList.length; i++) {
            this.$set(this.dataList[i], "address", "");
            this.dataList[i].defenseType1 = this.getDenfenseType(
              this.dataList[i].defenseTypeStr
            );
            this.dataList[i].duration = this.timeStamp(
              this.dataList[i].duration
            );
            this.dataList[i].status = this.getDevStatus(
              this.dataList[i].status
            );
          }
          // console.log(this.dataList);
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
          this.current = 1;
        }
      });
    },
    loadPowerSurplus() {
      //剩余电量统计
      var list = [];
      for (let i = 0; i < this.page.pageSize; i++) {
        list.push({
          deviceImei: parseInt(Math.random() * 1000000),
          userName: "user" + i,
          plateNumber: "car" + i,
          power: ((i + 1) % 10) * 10 + "%",
          time: new Date().getTime(),
          lat: (39.915 + 0.01 * i).toFixed(6),
          lng: (116.404 + 0.01 * i).toFixed(6),
          address: ""
        });
      }
      this.dataList = list;
    },
    dealUserItem(item) {
      //选中用户结果
      this.userId = item.userId;
      this.userName = item.userName;
    },
    dealDevItem(item) {
      //选中设备结果
      this.deviceImei = item.deviceImei;
    },
    searchTable() {
      //加载报表
      // this.app.$emit("show-progress-page", 0);
      this.dataList = [];
      var action = {
        "pledge-stay": this.loadPledgeStay,
        "pledge-in-out": this.loadPledgeInOut,
        "fence-in-out": this.loadFenceInOut,
        "province-out": this.loadProvinceOut,
        "offline-time": this.loadOfflineTime,
        "dev-status": this.loadDevStatus,
        "power-surplus": this.loadPowerSurplus
      };
      action[this.currentTab] && action[this.currentTab]();
    }
  },
  mounted() {
    this.searchTable();
    this.getDenfenseType();
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
