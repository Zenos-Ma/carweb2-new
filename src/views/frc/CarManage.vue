<template>
  <div class="form-card frc-car layout-container">
    <!-- 车辆查询内容 -->
    <div class="card-header">
      <el-tabs
        type="border-card"
        v-model="currtentShow"
        @tab-click="changeMenu"
      >
        <el-tab-pane
          v-for="(item, idx) in leftMenusShow"
          :key="idx"
          :label="item.text"
          :name="item.idx"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="card-content-right" v-show="currtentShow == '0'">
      <div class="card-body">
        <table class="form-table" style="width: 90%">
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
                style="width: 180px"
              ></el-date-picker>
            </td>

            <td>{{ $t("common.endTime") }}:</td>
            <td>
              <el-date-picker
                v-model="timeTo"
                type="date"
                format="yyyy-MM-dd"
                :disabled="!isTime"
                style="width: 180px"
              ></el-date-picker>
            </td>
          </tr>
          <!-- 1 -->
          <tr>
            <td>{{ $t("car.carOwner") }}:</td>
            <td>
              <el-input style="width: 180px" v-model="car.carOwner" />
            </td>
            <td>{{ $t("car.carNo") }}:</td>
            <td>
              <el-input style="width: 180px" v-model="car.carNo" />
            </td>
            <td>{{ $t("report.selectContext") }}:</td>
            <td>
              <el-button type="primary" size="small" @click="loadCarList">{{
                $t("common.search")
              }}</el-button>
              <el-button type="warning" size="small" @click="exportTable">{{
                $t("common.export")
              }}</el-button>
              <el-button
                type="warning"
                size="small"
                @click="exportTable('all')"
                >{{ $t("common.exportAll") }}</el-button
              >
            </td>
          </tr>
        </table>

        <!-- 车辆管理报表 -->
        <div style="height: calc(100% - 100px); margin-top: 10px">
          <!--  -->
          <data-table
            :data="dataList"
            @selection-change="handleSelection"
            :page="page"
            :show-selection="true"
            @getTableData="loadCarList"
          >
            <el-table-column
              :label="$t('common.carNo')"
              prop="plateNumbers"
              width="150px"
            ></el-table-column>
            <el-table-column
              :label="$t('common.owner')"
              prop="plateName"
              width="100px"
            ></el-table-column>
            <el-table-column
              :label="$t('common.phone')"
              prop="phone"
              width="120px"
            ></el-table-column>
            <el-table-column
              :label="$t('car.installDevs')"
              prop="deviceCount"
              width="180px"
            ></el-table-column>
            <el-table-column :label="$t('report.reportTime')" width="180px">
              <template slot-scope="scope">
                <span :title="scope.row.createTime">
                  {{ scope.row.createTime | fdatetime }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('report.updateTime')" width="180px">
              <template slot-scope="scope">
                <span :title="scope.row.updateTime">
                  {{ scope.row.updateTime | fdatetime }}
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('car.notes')">
              <template slot-scope="scope">
                <span :title="scope.row.remark">
                  {{ scope.row.remark ? scope.row.remark : "--" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('common.operation')"
              min-width="280"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  size="small"
                  @click="showCarDetailDialog(scope.row)"
                  v-show="scope.row.deviceCount >= 1"
                  >{{ $t("common.detail") }}</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="showCarInstallDialog(scope.row)"
                  >{{ $t("car.install") }}</el-button
                >
                <el-button
                  type="success"
                  size="small"
                  @click="showCarUpdateDialog(scope.row)"
                  >{{ $t("car.update") }}</el-button
                >
                <el-button
                  type="info"
                  size="small"
                  @click="carDeleteItem(scope.$index, scope.row)"
                  >{{ $t("car.carDelete") }}</el-button
                >
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
    </div>
    <!-- 车辆新增内容 -->
    <div class="card-content-right" v-show="currtentShow == '1'">
      <div class="car-content-main">
        <div
          class="card-body111"
          style="height: calc(100% - 10px); padding: 1rem"
        >
          <div class="header-title" style="margin-bottom: 10px">
            <ul class="select-tabs1">
              <li :class="{ active: currentTabIndex == 0 }" @click="showTab(0)">
                {{ $t("car.carOne") }}
              </li>
              <li :class="{ active: currentTabIndex == 1 }" @click="showTab(1)">
                {{ $t("car.carMore") }}
              </li>
            </ul>
          </div>
          <!--  -->
          <!--  -->
          <el-form
            label-width="120px"
            v-show="currentTabIndex == 0"
            style="margin: 60px 0 auto"
          >
            <el-form-item :label="$t('car.carNo')">
              <el-input v-model="car.carNo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.carOwner')">
              <el-input v-model="car.carOwner"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.phone')">
              <el-input v-model="car.phone"></el-input>
            </el-form-item>
            <el-form-item :label="$t('car.notes')">
              <el-input v-model="car.notes"></el-input>
            </el-form-item>
          </el-form>

          <!-- 右边车辆批量添加功能 -->
          <div v-show="currentTabIndex == 1" style="height: 90px">
            <div class="orange-box">
              <div v-html="$t('batchTransfer.downloadTip')"></div>
              <div>
                <font style="color: red; font-weight: bold">{{
                  $t("common.template")
                }}</font>
                <a
                  class="btn-white1"
                  style="margin-left: 8px"
                  :href="API.batchSaveCarFile"
                  >{{ $t("common.download") }}</a
                >
              </div>
            </div>

            <div>
              <file-upload
                accept="application/vnd.ms-excel"
                @select-file="onUploadFile"
              ></file-upload>
            </div>
          </div>
          <el-table
            :data="batchCarList.list"
            border
            :row-class-name="tableRowClassName"
            height="78%"
            @selection-change="handleSelection"
            v-show="currentTabIndex == 1"
            :header-cell-style="{ background: '#bce5fb', color: '#000' }"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              :label="$t('car.carNo')"
              prop="plateNumbers"
              width="150px"
            ></el-table-column>
            <el-table-column
              :label="$t('car.carOwner')"
              prop="plate_name"
              width="150px"
            ></el-table-column>
            <el-table-column
              :label="$t('common.phone')"
              prop="phone"
              width="150px"
            ></el-table-column>
            <el-table-column
              :label="$t('car.notes')"
              prop="remark"
              width="150px"
            ></el-table-column>
            <el-table-column :label="$t('common.operation')">
              <template slot-scope="scope">
                <a @click="delCarOne(scope.$index)">{{
                  $t("common.delete")
                }}</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn-content">
            <el-button type="primary" @click="batchSaveVehicle">{{
              $t("common.submit")
            }}</el-button>
            <el-button type="warning">{{ $t("common.reset") }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 车辆详情对话框 -->
    <dialog-comp
      :visible.sync="isCarDetailDialog"
      :dialog-title="$t('car.carInfo')"
      :dialog-width="850"
    >
      <el-form label-width="80px" style="width: 500px">
        <el-form-item :label="$t('common.carNo')">
          <el-input v-model="selectCar.plateNumbers" disabled />
        </el-form-item>
        <el-form-item :label="$t('car.carOwner')">
          <el-input v-model="selectCar.plateName" disabled />
        </el-form-item>
        <el-form-item :label="$t('common.phone')">
          <el-input v-model="selectCar.phone" disabled />
        </el-form-item>
      </el-form>

      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.deviceInfo") }}</li>
      </ul>
      <div style="height: 300px">
        <data-table :show-index="true" :show-page="false" :data="deviceList">
          <!--  -->
          <el-table-column
            :label="$t('common.deviceImei')"
            width="150"
            prop="deviceImei"
          ></el-table-column>
          <el-table-column
            :label="$t('car.worker')"
            width="120"
            prop="installName"
          ></el-table-column>
          <el-table-column
            :label="$t('common.phone')"
            width="120"
            prop="installPhone"
          ></el-table-column>
          <el-table-column
            :label="$t('car.installSite')"
            width="120"
            prop="installSite"
          ></el-table-column>
          <el-table-column :label="$t('car.installTime')" width="140">
            <template slot-scope="props">
              {{ props.row.installTime | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('car.notes')"
            width="120"
            prop="remark"
          ></el-table-column>
          <el-table-column :label="$t('common.operation')" width="120">
            <template slot-scope="props">
              <a @click="showVehicleRelation(props.row)">{{
                $t("car.update")
              }}</a>
              <a @click="unInstallMachine(props.$index, props.row)">{{
                $t("car.uninstall")
              }}</a>
            </template>
          </el-table-column>
        </data-table>
      </div>
      <div style="text-align: center; margin-top: 10px">
        <el-button type="primary" size="small">{{
          $t("common.submit")
        }}</el-button>
        <el-button
          type="warning"
          size="small"
          @click="isCarDetailDialog = false"
          >{{ $t("common.close") }}</el-button
        >
      </div>
    </dialog-comp>
    <!-- 车辆安装对话框 -->
    <dialog-comp
      :visible.sync="isCarInstallDialog"
      :dialog-title="$t('car.carInfo')"
      :dialog-width="zhenwidth"
    >
      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.carInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("common.carNo") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.plateNumbers"
              disabled
            />
          </td>

          <td>{{ $t("car.carOwner") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.plateName"
              disabled
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.phone") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.phone"
              disabled
            />
          </td>
        </tr>
      </table>

      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.deviceInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td colspan="3" style="text-align: left">
            <el-input size="small" style="width: 160px" v-model="deviceImei" />
            <el-button
              type="primary"
              size="small"
              @click="searchDev"
              style="margin-left: 5px"
              >{{ $t("common.search") }}</el-button
            >
            <span style="font-size: 12px; color: red">{{ errMsgText }}</span>
            <device-box
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
        </tr>
      </table>

      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.installInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("car.worker") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="installDevInfo.iName"
            />
          </td>

          <td>{{ $t("common.phone") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="installDevInfo.iPhone"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("car.installSite") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="installDevInfo.iSite"
            />
          </td>

          <td>{{ $t("car.installTime") }}:</td>
          <td>
            <el-date-picker
              v-model="installInfo.installTime"
              style="width: 160px"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <td>{{ $t("car.notes") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="installDevInfo.remark"
            />
          </td>
        </tr>
      </table>

      <div style="text-align: center">
        <el-button type="primary" size="small" @click="addCarDevRelation">{{
          $t("common.submit")
        }}</el-button>
        <el-button
          type="warning"
          size="small"
          @click="isCarInstallDialog = false"
          >{{ $t("common.close") }}</el-button
        >
      </div>
    </dialog-comp>
    <!-- 车辆信息修改框 -->
    <dialog-comp
      :visible.sync="isUpdateDialog"
      :dialog-title="$t('car.carInfo')"
      :dialog-width="500"
    >
      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.carInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("common.carNo") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.plateNumbers"
            />
          </td>

          <td>{{ $t("car.carOwner") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.plateName"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.phone") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.phone"
            />
          </td>

          <td>{{ $t("car.notes") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCar.remark"
            />
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 10px">
        <el-button type="primary" size="small" @click="updateVehicle">{{
          $t("common.submit")
        }}</el-button>
        <el-button
          type="warning"
          size="small"
          @click="isUpdateDialog = false"
          >{{ $t("common.close") }}</el-button
        >
      </div>
    </dialog-comp>
    <!-- 设备车辆关联关系修改框 -->
    <dialog-comp
      :visible.sync="isUpdateRelation"
      :dialog-title="$t('car.carInfo')"
      :dialog-width="500"
    >
      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.deviceInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td colspan="3" style="text-align: left">
            <el-input
              size="small"
              style="width: 160px"
              v-model="deviceImei"
              @keydown.enter="searchDev"
            />

            <el-button type="primary" size="small" @click="searchDev">{{
              $t("common.search")
            }}</el-button>
            <device-box
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
        </tr>
      </table>

      <ul class="select-tabs1" style="margin: 10px 0">
        <li class="active">{{ $t("car.installInfo") }}</li>
      </ul>
      <table class="form-table">
        <tr>
          <td>{{ $t("car.worker") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCarRelation.installName"
            />
          </td>

          <td>{{ $t("common.phone") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCarRelation.installPhone"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("car.installSite") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCarRelation.installSite"
            />
          </td>

          <td>{{ $t("car.installTime") }}:</td>
          <td>
            <el-date-picker
              v-model="installInfo.installTime"
              type="date"
              format="yyyy-MM-dd"
              style="width: 160px"
            ></el-date-picker>
          </td>
        </tr>
        <tr>
          <td>{{ $t("car.notes") }}:</td>
          <td>
            <el-input
              size="small"
              style="width: 160px"
              v-model="selectCarRelation.remark"
            />
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 10px">
        <el-button type="primary" size="small" @click="updateVehicleRelation">{{
          $t("common.submit")
        }}</el-button>
        <el-button
          type="warning"
          size="small"
          @click="isUpdateRelation = false"
          >{{ $t("common.close") }}</el-button
        >
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import DeviceBox from "@/components/DeviceBox";
import ExportUtil from "@/utils/exportUtil.js";
import FileUpload from "@/components/FileUpload";
import {
  loadVehicleList,
  deleteVehicleInfo,
  deleteVehicleRelation,
  updateVehicleDevRelation,
  updateVehicleInfo,
  uploadVehicleInstallInfo,
  queryVehicleRelationListInfo,
  uploadBatchSaveVehicle
} from "@/api/risk.js";
export default {
  name: "Car",
  components: {
    "file-upload": FileUpload,
    "device-box": DeviceBox
  },
  data: () => ({
    page: {
      name: "Car",
      num: 1,
      current: 1,
      pageSize: 30,
      isAll: true,
      total: 0
    },
    timeFrom: new Date().format("yyyy-01-01"), //开始时间
    timeTo: new Date().format("yyyy-MM-dd"), //结束时间
    isDeviceBox: false, //设备搜索box
    isUserBox: false, //用户搜索box
    deviceImei: "",
    userId: "",
    userName: "",
    isTime: false, //是否自定义时间范围
    isChild: false, //是否包含下级
    dataList: [], //报表数据
    deviceList: [], //设备列表
    isCarDetailDialog: false, //车辆详情对话框
    isCarInstallDialog: false, //车辆安装对话框
    isUpdateDialog: false, //车辆修改对话框
    isUpdateRelation: false, //设备车辆关联关系修改对话框
    leftMenusShow: [], //显示的功能菜单
    currtentShow: "0", //默认显示的右边内容
    currentTabIndex: 0, //车辆单个录入或者批量显示
    selectCar: {}, //选中的车辆信息
    selectCarRelation: {}, //选中的车辆设备关联关系信息
    zhenwidth: 500,
    langType: window.localStorage.getItem("langType"), //当前语言
    installInfo: {
      //安装信息
      installTime: new Date().format("yyyy-MM-dd")
    },
    car: {
      carNo: "", //车牌号
      carOwner: "", //所属用户
      phone: "", //电话号码
      installDevList: "", //车辆列表
      notes: "" //备注
    },
    installDevInfo: {
      deviceNo: "", //设备编号
      iName: "", //安装人姓名
      iSite: "", //安装位置
      remark: "", //备注
      iPhone: "" //安装人电话
    },
    batchCarList: {
      // 批量添加车辆信息
      list: []
    },
    selectList: [], //选中的车辆
    originList: [], //原始的车辆列表
    errMsgText: "" //安装保存失败显示文字
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
    // 'installDevInfo.iPhone'() {
    //   console.log(this.installDevInfo.iPhone);
    //   if(!this.isPhoneNumber(this.installDevInfo.iPhone)) {
    //     console.log('手机格式不对，请重新输入');
    //   }
    // }
  },
  methods: {
    handleSelection(arr) {
      // console.log(arr);
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
      //导出xls表格
      var title = [
        "序号",
        "车牌号",
        "车主姓名",
        "电话",
        "安装设备数量",
        "上报时间",
        "更新时间",
        "备注"
      ];
      var theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.plateNumbers,
          item.plateName,
          item.phone,
          item.deviceCount,
          item.createTime ? new Date(item.createTime).format("yyyy-MM-dd") : "",
          item.updateTime ? new Date(item.updateTime).format("yyyy-MM-dd") : "",
          item.remark ? item.remark : "--"
        ]);
      }
      // console.log(theList);
      ExportUtil.exportTable(title, theList, "车辆管理信息表");
    },
    exportTable(tag) {
      // 车辆信息的导出
      if (tag == "all") {
        var data = {
          pageNum: this.page.current,
          pageSize: this.page.pageSize,
          isAll: this.page.isAll
        };

        if (this.timeFrom && this.timeTo) {
          data.starTime = new Date(this.timeFrom).getTime();
          data.endTime = new Date(this.timeTo + " 23:59:59").getTime();
        }
        //
        loadVehicleList(data).then(res => {
          if (res.errCode == 200) {
            console.log(res.data.list);
            this.exportEcall(res.data.list);
          }
        });
      } else {
        //导出已选中的当前表格的数据项
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        this.exportEcall(this.selectList);
      }
    },
    carDeleteItem(idx, item) {
      // 删除车辆信息
      console.log(item, idx);
      var str = this.$t("car.carDetail").replace("_car_", item.plateNumbers);
      this.app.$emit("show-confirm-msg", str, () => {
        deleteVehicleInfo({ id: item.id }).then(res => {
          if (res.errCode == 200) {
            this.app.$emit("show-alert-msg", this.$t("car.DelcarDetail"));
            this.dataList.splice(idx, 1);
            // 重新加载查询车辆列表
            this.loadCarList();
            // 重新加载查询设备列表
            this.loadDeviceList();
          } else {
            this.app.$emit("show-alert-msg", this.$t("car.DelcarDetailFail"));
          }
        });
      });
    },
    delCarOne(idx) {
      // 删除单行新增的车辆信息
      this.batchCarList.list.splice(idx, 1);
    },
    dealExcel(result) {
      // console.log(result);
      this.batchCarList.list = result;
      // var str = "";
      // for (var i = 0; i < result.length; i++) {
      //   // str += i === result.length - 1 ? JSON.stringify(Object.values(result[i])) : JSON.stringify(Object.values(result[i])) + ";";
      //   str += i === result.length - 1 ? Object.values(result[i]).join(",") : Object.values(result[i]).join(",") + ";";
      // }

      // 这里可以拿到表格中的值，然后直接赋值给批量方式的展示
      // console.log(str);
    },
    onUploadFile(files) {
      ExportUtil.parseExcel(files[0], this.dealExcel);
    },
    unInstallMachine(idx, item) {
      // 删除设备车辆关联关系
      // console.log(item);
      var str = this.$t("car.uninstallTip").replace("_car_", item.deviceImei);
      this.app.$emit("show-confirm-msg", str, () => {
        deleteVehicleRelation({ id: item.id }).then(res => {
          if (res.errCode == 200) {
            this.app.$emit("show-alert-msg", this.$t("car.carDelOk"));
            this.deviceList.splice(idx, 1);
            // 重新加载查询车辆列表
            this.loadCarList();
            // 重新加载查询设备列表
            this.loadDeviceList();
          } else {
            this.app.$emit("show-alert-msg", this.$t("car.carDelFail"));
          }
        });
      });
    },
    updateVehicleRelation() {
      // 修改更新车辆设备关联关系信息
      var list = {
        veId: this.selectCarRelation.veId,
        deviceImei: this.deviceImei,
        installName: this.selectCarRelation.installName,
        installPhone: this.selectCarRelation.installPhone,
        installSite: this.selectCarRelation.installSite,
        remark: this.selectCarRelation.remark,
        id: this.selectCarRelation.id
      };
      // console.log(list);
      updateVehicleDevRelation(list).then(res => {
        if (res.errCode == 200) {
          // console.log("修改成功");
          this.app.$emit("show-alert-msg", this.$t("car.updateOk"));
          this.isUpdateRelation = false;
          this.deviceImei = "";
          // 加载更新后的车辆设备关联关系信息
          this.loadDeviceList();
        }
      });
    },
    updateVehicle() {
      // 修改更新车辆信息
      var data = {
        id: this.selectCar.id,
        userId: this.selectCar.userId,
        plateNumbers: this.selectCar.plateNumbers,
        plateName: this.selectCar.plateName,
        phone: this.selectCar.phone,
        remark: this.selectCar.remark
      };
      console.log(data);
      updateVehicleInfo(data).then(res => {
        if (res.errCode == 200) {
          // console.log("修改成功");
          this.app.$emit("show-alert-msg", this.$t("car.updateOk"));
          this.isUpdateDialog = false;
          // 加载更新后的车辆信息
          this.loadCarList();
        }
      });
    },
    addCarDevRelation() {
      // 上传安装的信息
      this.errMsgText = "";
      // this.installDevInfo = {};
      var data1 = {
        starTime: new Date(this.timeFrom).getTime(),
        endTime: new Date(this.timeTo + " 23:59:59").getTime(),
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: this.page.isAll,
        veId: -1,
        userId: -1,
        deviceImei: this.deviceImei
      };
      // console.log(data);
      queryVehicleRelationListInfo(data1).then(res => {
        if (res.errCode == 501) {
          this.errMsgText = res.errMsg;
          return;
        }
      });
      //
      var data = {
        veId: this.selectCar.id,
        deviceImei: this.deviceImei,
        installName: this.installDevInfo.iName,
        installPhone: this.installDevInfo.iPhone,
        installSite: this.installDevInfo.iSite,
        remark: this.installDevInfo.remark
      };
      if (!this.isPhoneNumber(this.installDevInfo.iPhone)) {
        console.log("手机格式不对，请重新输入");
        this.app.$emit("show-alert-msg", this.$t("car.isPhone"));
        return;
      }
      console.log(data);
      uploadVehicleInstallInfo(data).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", this.$t("car.deviceOk"));
          console.log("上传成功");
          // 加载上传成功车辆信息
          this.loadCarList();
          this.loadDeviceList();
          this.isCarInstallDialog = false;
          this.installDevInfo = {};
          this.deviceImei = "";
        } else {
          this.app.$emit("show-alert-msg", res.errMsg);
          // this.errMsgText = res.errMsg;
        }
      });
    },
    batchSaveVehicle() {
      // 上传保存车辆信息
      if (this.currentTabIndex == 0) {
        var data = {
          plateNumbers: this.car.carNo,
          plate_name: this.car.carOwner,
          phone: this.car.phone,
          remark: this.car.notes
        };
        if (this.car.installDevList) {
          data.device_list = this.car.installDevList;
        }
        // 判断手机号码格式
        if (!this.isPhoneNumber(this.car.phone)) {
          this.app.$emit("show-alert-msg", this.$t("car.isPhone"));
          return;
        }
        if (!this.car.carOwner) {
          this.app.$emit("show-alert-msg", this.$t("car.isCarOwner"));
          return;
        }
        if (!this.car.carNo) {
          this.app.$emit("show-alert-msg", this.$t("car.isCarNo"));
          return;
        }
        console.log(data);
        var list = Object.values(data).join(",");
      }
      // console.log(list.join(","));
      if (this.currentTabIndex == 1) {
        // 批量上传，数组中对象一起转成字符串，以分号隔开
        var str = "";
        var result = this.batchCarList.list;
        for (var i = 0; i < result.length; i++) {
          // str += i === result.length - 1 ? JSON.stringify(Object.values(result[i])) : JSON.stringify(Object.values(result[i])) + ";";
          str +=
            i === result.length - 1
              ? Object.values(result[i]).join(",")
              : Object.values(result[i]).join(",") + ";";
        }
        list = str;
      }
      uploadBatchSaveVehicle({ file: list }).then(res => {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", this.$t("car.carOk"));
          console.log("上传成功");
          // 加载上传成功车辆信息
          this.car = {};
          this.loadCarList();
        } else {
          this.app.$emit("show-alert-msg", this.$t("car.carFail"));
        }
      });
    },
    showTab(index) {
      // 初始化录入信息框
      this.currentTabIndex = index;
      console.log(this.currentTabIndex);
      this.car.carNo = "";
      this.car.carOwner = "";
      this.car.phone = "";
      this.car.installDevList = "";
      this.car.notes = "";
    },
    changeMenu(idx) {
      console.log(idx);
      this.currtentShow = idx.index;
      this.car = {};
    },
    initLeftMenus() {
      this.leftMenusShow = this.$t("car.leftMenus");
    },
    showVehicleRelation(item) {
      // 显示设备车辆关联关系修改框
      // console.log(item);
      this.isUpdateRelation = true;
      this.selectCarRelation = item;
      this.deviceImei = item.deviceImei;
    },
    showCarUpdateDialog(item) {
      this.isUpdateDialog = true;
      this.selectCar = item;
    },
    showCarDetailDialog(item) {
      //显示车辆详情对话框
      this.isCarDetailDialog = true;
      this.selectCar = item;
      this.loadDeviceList();
    },
    showCarInstallDialog(item) {
      //显示安装设备对话框
      this.isCarInstallDialog = true;
      this.selectCar = item;
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
    dealUserItem(item) {
      this.userId = item.userId;
      this.userName = item.userName;
    },
    dealDevItem(item) {
      this.deviceImei = item.deviceImei;
    },
    loadCarList() {
      //加载车辆列表
      var data = {
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: this.page.isAll,
        plateNumbers: this.car.carNo ? this.car.carNo : "",
        plateName: this.car.carOwner ? this.car.carOwner : ""
      };

      var tfrom = new Date().format("yyyy-01-01");
      if (this.isTime) {
        data.starTime = new Date(this.timeFrom).getTime();
        data.endTime = new Date(this.timeTo).getTime();
      } else {
        data.starTime = new Date(tfrom).getTime();
        // 拼接时间时注意要空一格
        data.endTime = new Date(this.timeTo + " 23:59:59").getTime();
        this.timeFrom = new Date().format("yyyy-01-01");
      }

      // console.log(data);
      loadVehicleList(data).then(res => {
        if (res.errCode == 200) {
          this.dataList = res.data.list;
          this.originList = JSON.stringify(res.data.list);
          this.page.num = Math.ceil(res.data.total / this.page.pageSize);
          this.page.total = res.data.total;
        }
      });
    },
    loadDeviceList() {
      //加载设备列表
      var data = {
        starTime: new Date(this.timeFrom).getTime(),
        endTime: new Date(this.timeTo + " 23:59:59").getTime(),
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        isAll: this.page.isAll,
        veId: this.selectCar.id,
        userId: this.selectCar.userId
      };
      // console.log(data);
      queryVehicleRelationListInfo(data).then(res => {
        if (res.errCode == 200) {
          // console.log("获取成功");
          this.deviceList = res.data.list;
          this.page.num = Math.ceil(res.data.total / this.page.limit);
          this.page.total = res.data.total;
        }
      });
    },
    listentDialogWidth() {
      //切换语言类型 zh：中文 en：英语
      var langType = window.localStorage.getItem("langType")
        ? window.localStorage.getItem("langType")
        : (
            window.navigator.language || window.navigator.browserLanguage
          ).toLowerCase(); //直接获取浏览器的默认语言
      if (langType.indexOf("zh") >= 0) {
        langType = "zh";
      } else {
        langType = "en";
      }
      // console.log(langType);
      this.langType = langType;
      if (this.langType == "en") {
        this.zhenwidth = 520;
      } else {
        this.zhenwidth = 500;
      }
    },
    listenEvent() {
      this.app.$on("change-lang-type", this.initLeftMenus);
    },
    offEvent() {
      this.app.$off("change-lang-type", this.initLeftMenus);
    }
  },
  mounted() {
    this.loadCarList();
    this.loadDeviceList();
    this.listenEvent();
    this.initLeftMenus();
  },
  updated() {
    this.listentDialogWidth();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.btn-white {
  background: white !important;
  border: 1px solid #a2a9ba;
  border-color: none !important;
}
.ml {
  margin-left: 26px;
}
.card-tabs {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  height: 100%;
  min-width: 200px;
  .card-item {
    cursor: pointer;
    display: block;
    padding: 16px 0;
    font-size: 14px;
    color: #666666;
    text-align: center;
    .text {
      margin: 0;
      padding: 0;
      line-height: 30px;
    }
  }
}

.card-item .menu-icon.iconfont {
  font-weight: normal;
  font-size: 42px;
  display: inline-block;
}

.card-tabs .card-item.active {
  font-weight: bold;
  color: #0095ec;
}

.card-content-right {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .header-title {
    span {
      padding-right: 10px;
    }
  }
}

.card-body1 {
  margin: 0 10px 0 10px;
  padding: 8px;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 100%;
  overflow: hidden;
  background-color: white;
  border-radius: 5px;
  width: 80%;
}

.form-table-content {
  margin: 20px auto;
  width: 80%;
  input {
    margin-left: 10px;
  }
}

.btn-content {
  margin-top: 10px;
  text-align: center;
}

.card-content-right {
  table.form-table input[type="text"] {
    width: 200px;
    height: 30px !important;
  }
}

.car-content-main {
  margin-top: 5px;
  height: 100%;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 0 3px 0 #aaaaaa;
  width: 100%;
}
</style>
