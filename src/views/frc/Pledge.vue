<template>
  <div
    class="body-content pledge-content layout-container"
    style="flex-direction: row;"
  >
    <div class="body-content-left" style="width: 350px">
      <!-- 二押点列表 -->
      <div class="form-card" style="height: calc(40% - 18px)">
        <el-tabs v-model="currentList" @tab-click="changeTab">
          <el-tab-pane
            name="0"
            :label="$t('pledge.customPledge')"
          ></el-tab-pane>
          <el-tab-pane name="1" :label="$t('pledge.sharePledge')"></el-tab-pane>
        </el-tabs>
        <div class="card-body" v-show="currentList == '0'">
          <data-table :data="customList" :show-page="false">
            <!--  -->
            <el-table-column :label="$t('report.pledgeName')" width="100">
              <template slot-scope="props">
                <a @click="showArea(props.$index, props.row)">{{
                  props.row.defenseName
                }}</a>
                <div style="color: gray">
                  ({{ props.row.address }}|{{
                    $t(
                      props.row.shapeType == 1 && 3
                        ? "pledge.circle"
                        : "pledge.polygon"
                    )
                  }})
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.createTime')" width="145">
              <template slot-scope="props">
                {{ props.row.createTime | fdatetime }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.operation')" style="flex: 1">
              <template slot-scope="props">
                <a @click="onLinkPledge(props.$index, props.row)">{{
                  $t("fence.link")
                }}</a>
                <a @click="onDelSecondDash(props.$index, props.row)">{{
                  $t("common.delete")
                }}</a>
              </template>
            </el-table-column>
          </data-table>
        </div>
        <div class="card-body" v-show="currentList == '1'">
          <ul
            class="area-list"
            style="padding-right: 8px; height: 100%; overflow-x: hidden; overflow-y: auto"
          >
            <li
              v-for="(item, idx) in $t('pledge.province')"
              :key="'province' + idx"
              :class="[expendProvince == item.name ? 'active' : '']"
            >
              <div>
                <span @click="loadExpendProvince(item)">
                  <i class="iconfont icon-right"></i>
                  {{ item.text }}
                </span>
                <span
                  v-if="expendProvince == item.name && pledgeList.length > 0"
                >
                  <el-input
                    style="width: 100px"
                    :placeholder="$t('pledge.pledgeTip')"
                    size="small"
                    v-model="searchKey"
                    @keyup.enter.native="searchPledge"
                  />
                  <i
                    class="iconfont icon-search"
                    style="cursor: pointer"
                    @click="searchPledge"
                  ></i>
                </span>
              </div>
              <div
                v-if="expendProvince == item.name && pledgeList.length > 0"
                style="height: 280px; overflow-x: hidden; overflow-y: auto"
              >
                <div v-show="isSearch">
                  {{ $t("common.searchResultNum") }}:{{ pledgeList.length }}
                </div>
                <ul class="area-list" style="padding-left: 10px">
                  <li
                    v-for="(it, ii) in pledgeList"
                    :key="'pledgeList' + idx + '-' + ii"
                    :class="[selectPledge.name == it.name ? 'active' : '']"
                  >
                    <div>
                      <span @click="showPledge(it)">{{ it.name }}</span>
                      <a @click="onLinkPledge(ii, it)">{{
                        $t("fence.link")
                      }}</a>
                    </div>
                  </li>
                </ul>
                <el-pagination
                  center
                  :pager-count="5"
                  :page-size="page.pageSize"
                  :total="page.total"
                  background
                  layout="prev,pager,next"
                  @current-change="handleCurrentChange"
                  v-show="!isSearch"
                ></el-pagination>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="move-bar-v"></div>
      <!-- 设备列表 -->
      <div class="form-card" style="height: 60%">
        <el-tabs v-model="currentList1" @tab-click="changeTab1">
          <el-tab-pane name="0" :label="$t('common.myCustomer')"></el-tab-pane>
          <el-tab-pane name="1" :label="$t('common.deviceList')"></el-tab-pane>
          <el-tab-pane
            name="2"
            :label="$t('fencePolygon.linkedDevice')"
          ></el-tab-pane>
          <el-tab-pane v-show="pledgeId || isDraw">
            <span slot="label">
              <el-button
                type="primary"
                size="small"
                @click="onSaveSecondDash"
                >{{ $t("common.save") }}</el-button
              >
            </span>
          </el-tab-pane>
        </el-tabs>
        <div class="card-body" v-show="currentList1 == '0'">
          <user-tree
            tree-name="Pledge"
            @usertree-select="changeUser"
            :user-id.sync="userId"
          ></user-tree>
        </div>
        <div class="card-body" v-show="currentList1 == '1'">
          <div style="display: flex; flex-driection: row" class="card-top">
            <!-- 设备号、设备名称 -->
            <el-input
              size="small"
              v-model="searchDevKey"
              :placeholder="$t('common.searchDevTip')"
              style="flex: 1; margin-right: 8px"
              @keydown.enter="onSearchDevice"
            />
            <el-button type="warning" @click="onSearchDevice">{{
              $t("common.search")
            }}</el-button>
          </div>
          <link-device-list
            :link-list.sync="linkList"
            :dev-list="deviceList"
            :device-imei.sync="deviceImei"
            style="height: calc(100% - 60px)"
            @select-dev="showDevice"
            :is-operate="isDraw"
          ></link-device-list>
          <el-pagination
            center
            :pager-count="5"
            :page-size="page1.pageSize"
            :total="page1.total"
            background
            layout="prev,pager,next"
            @current-change="handleCurrentChange1"
            v-show="!isSearch"
          ></el-pagination>
        </div>
        <div class="card-body" v-show="currentList1 == '2'">
          <link-device-list
            :link-list.sync="linkList"
            :dev-list="linkList"
            :device-imei.sync="deviceImei"
            @select-dev="showDevice"
            :is-operate="isDraw"
          ></link-device-list>
        </div>
      </div>
    </div>
    <div class="move-bar-h"></div>
    <!-- 地图 -->
    <div
      class="form-card body-content-right"
      style="width: calc(100% - 380px); height: calc(100% - 10px)"
    >
      <div class="card-header">
        {{ $t("pledge.map") }}
        <el-button
          type="primary"
          size="small"
          @click="onDrawAction('circle')"
          >{{ $t("pledge.addCircle") }}</el-button
        >

        <el-button
          type="primary"
          size="small"
          @click="onDrawAction('polygon')"
          >{{ $t("pledge.addPolygon") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="onDrawAction('edit')"
          v-show="!isEdit && isDraw"
          >{{ $t("pledge.editPledge") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="onDrawAction('quit')"
          v-show="isEdit && isDraw"
          >{{ $t("pledge.quitEdit") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="onDrawAction('clear')"
          v-show="isDraw"
          >{{ $t("pledge.clear") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="onSaveSecondDash"
          v-show="isDraw"
          >{{ $t("pledge.savePledge") }}</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-show="isDraw"
          @click="isDrawBox = isDrawBox ? false : true"
          >{{ $t("pledge.pledgeSet") }}</el-button
        >
      </div>
      <div class="card-body" style="padding: 0">
        <!-- 二押点设置box -->
        <div
          class="result-box"
          v-show="isDraw && isDrawBox"
          :style="{ width: width1 + 'px', height: height1 + 'px' }"
        >
          <table class="form-table">
            <tr>
              <td>{{ $t("report.pledgeName") }}:</td>
              <td>
                <el-input
                  style="width: 180px"
                  v-model="pledgeName"
                  :placeholder="$t('pledge.pledgeName')"
                />
              </td>
            </tr>
            <tr>
              <td>{{ $t("pledge.pledgeType") }}:</td>
              <td>
                <el-select v-model="selectedPledgeType" style="width: 180px">
                  <el-option
                    v-for="(item, idx) in $t('pledge.pledgeTypeList')"
                    :key="'pledgeType' + idx"
                    :value="item.name"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{ $t("pledge.selectProvince") }}:</td>
              <td>
                <el-select v-model="selectProvince" style="width: 180px">
                  <el-option
                    v-for="(item, idx) in AllProvince"
                    :key="'province' + idx"
                    :value="item.code"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>{{ $t("pledge.pledgeAlarmTip1") }}:</td>
              <td>
                <!--  -->
                <el-checkbox v-model="isEnterAlarm">{{
                  $t("fencePolygon.isOpen")
                }}</el-checkbox>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-input
                  size="small"
                  style="width: 50px"
                  v-model="enterAlarmTimes"
                />
                {{ $t("fencePolygon.fenceTime") }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("pledge.pledgeAlarmTip") }}:</td>
              <td>
                <el-checkbox v-model="isLeaveAlarm">{{
                  $t("fencePolygon.isOpen")
                }}</el-checkbox>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <el-input
                  size="small"
                  style="width: 50px"
                  v-model="leaveAlarmTimes"
                />
                {{ $t("fencePolygon.fenceTime") }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-button
                  type="warning"
                  size="small"
                  @click="isDrawBox = false"
                  >{{ $t("common.close") }}</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="onSaveSecondDash"
                  >{{ $t("common.save") }}</el-button
                >
              </td>
            </tr>
          </table>

          <div style="font-size: 12px">{{ $t("fencePolygon.drawTip") }}</div>
        </div>
        <baidu-map :map-name="mapName"></baidu-map>
        <info-box1 :map-name="mapName" :device-imei="deviceImei"></info-box1>
      </div>
    </div>
    <!-- 关联对话框 -->
    <dialog-comp
      :visible.sync="isLinkShow"
      :dialog-title="$t('pledge.link') + ':' + this.pledgeName"
      :dialog-width="900"
    >
      <div
        style="display: flex; flex-direction: row; height: 100%; width: 100%"
      >
        <div class="form-card" style="width: 30%">
          <div class="card-header">{{ $t("common.myCustomer") }}</div>
          <div class="card-body">
            <user-tree
              tree-name="Pledge"
              @usertree-select="changeUser"
              :user-id.sync="userId"
            ></user-tree>
          </div>
        </div>

        <div class="form-card" style="width: 70%; padding-left: 8px">
          <div class="card-header">
            <ul class="select-tabs">
              <li
                :class="[currentList1 == '1' ? 'active' : '']"
                @click="currentList1 = '1'"
              >
                {{ $t("common.deviceList") }}
              </li>
              <li
                :class="[currentList1 == '2' ? 'active' : '']"
                @click="currentList1 = '2'"
              >
                {{ $t("fencePolygon.linkedDevice") }}
              </li>
              <li
                :class="[currentList1 == '3' ? 'active' : '']"
                @click="currentList1 = '3'"
              >
                {{ $t("pledge.pledgeSet") }}
              </li>
              <li>
                <el-input
                  style="width: 200px"
                  size="small"
                  v-model="searchDevKey"
                  :placeholder="$t('common.searchDevTip')"
                />
                <el-button type="primary" size="small">{{
                  $t("common.search")
                }}</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="onSaveSecondDash"
                  >{{ $t("common.save") }}</el-button
                >
              </li>
            </ul>
          </div>
          <div class="card-body" v-show="currentList1 == '1'">
            <link-device-list
              :link-list.sync="linkList"
              :dev-list="deviceList"
              :device-imei.sync="deviceImei"
              @select-dev="showDevice"
              :is-operate="isDraw"
              style="height: calc(100% - 30px)"
            ></link-device-list>
            <el-pagination
              center
              :pager-count="5"
              :page-size="page1.pageSize"
              :total="page1.total"
              background
              layout="prev,pager,next"
              @current-change="handleCurrentChange1"
              v-show="!isSearch"
            ></el-pagination>
          </div>
          <div class="card-body" v-show="currentList1 == '2'">
            <link-device-list
              :link-list.sync="linkList"
              :dev-list="linkList"
              :device-imei.sync="deviceImei"
              @select-dev="showDevice"
              :is-operate="isDraw"
            ></link-device-list>
          </div>
          <div class="card-body" v-show="currentList1 == '3'">
            <!-- 修改后的二押点设置 -->
            <table class="form-table">
              <tr>
                <td>{{ $t("report.pledgeName") }}:</td>
                <td>
                  <el-input
                    style="width: 200px"
                    v-model="pledgeName"
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <td>{{ $t("pledge.pledgeType") }}:</td>
                <td>
                  <el-select v-model="selectedPledgeType" style="width: 200px">
                    <el-option
                      v-for="(item, idx) in $t('pledge.pledgeTypeList')"
                      :key="'pledgeType' + idx"
                      :value="item.name"
                      :label="item.text"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>{{ $t("pledge.selectProvince") }}:</td>
                <td>
                  <el-select v-model="selectProvince" style="width: 200px">
                    <el-option
                      v-for="(item, idx) in AllProvince"
                      :key="'province' + idx"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>{{ $t("pledge.pledgeAlarmTip1") }}:</td>
                <td>
                  <el-checkbox v-model="isEnterAlarm">{{
                    $t("fencePolygon.isOpen")
                  }}</el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-input
                    style="width: 50px"
                    size="small"
                    v-model="enterAlarmTimes"
                  ></el-input
                  >{{ $t("fencePolygon.fenceTime") }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("pledge.pledgeAlarmTip") }}:</td>
                <td>
                  <el-checkbox v-model="isLeaveAlarm">{{
                    $t("fencePolygon.isOpen")
                  }}</el-checkbox>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <el-input
                    size="small"
                    style="width: 50px"
                    v-model="leaveAlarmTimes"
                  />
                  {{ $t("fencePolygon.fenceTime") }}
                </td>
              </tr>
            </table>

            <!-- 修改后的二押点设置 end -->
          </div>
        </div>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import baiduMapComp from "@/components/map/BaiduMapComp";
import mapUtil from "@/utils/mapUtil.js";
import EditPointIcon from "@/assets/img/dot.svg";
import CenterPointIcon from "@/assets/img/dot1.svg";
import UserTree from "@/components/UserTree/UserTree";
import LinkDeviceList from "@/components/LinkDeviceList/LinkDeviceList";
import InfoBox1 from "@/components/map/InfoBoxComp1";
import ProvinceUtil from "@/utils/provinceUtil.js";
import pledgeList from "@/components/PledgeList/PledgeList.vue";
import {
  loadDevicePledgeInfo,
  loadProvinceInfo,
  loadCustPledgeList,
  loadLinkDeviceInfo,
  batchSavePledgeInfo,
  doDeletePledge
} from "@/api/risk.js";
import { searchDevInfo, loadDeviceImeiList } from "@/api/monitor.js";
export default {
  name: "Pledge",
  components: {
    "baidu-map": baiduMapComp,
    "user-tree": UserTree,
    "link-device-list": LinkDeviceList,
    "info-box1": InfoBox1,
    "pledge-list": pledgeList
  },
  data: () => ({
    theMap: "baidu-map",
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    mapName: "Pledge",
    expendProvince: "", //共享二押点展开项
    expendProvinceCode: "", //共享二押点code值
    currentList: "0", //当前二押点列表
    currentList1: "1", //当前设备关联列表
    pledgeList: [], //二押点列表
    linkPledgeList: [], //通过设备拿到二押点列表
    isPledgeLink: false,
    page: {
      //二押点分页
      name: "Pledge",
      num: 1,
      pageSize: 10,
      current: 1
    },
    originList: "[]", //原始二押点列表
    searchKey: "", //搜索二押点关键词
    isSearch: false, //是否处于搜索二押点状态
    selectPledge: {
      //选中二押点
      pledgeName: ""
    },
    isLinkShow: false, //关联对话框

    linkList: [], //已关联设备
    deviceList: [], //设备列表
    originList1: "[]", //原始设备列表
    page1: {
      //设备列表分页
      name: "Pledge1",
      num: 1,
      pageSize: 20,
      current: 1
    },
    searchDevKey: "", //搜索设备关键词
    deviceImei: "", //选中设备号
    isDraw: false, //是否处于绘图状态
    isEdit: false, //是否处于编辑状态
    points: [], //经纬度端点
    radius: 100, //半径
    drawType: "circle", //画图类型
    customList: [], //自定义二押点列表
    pledgeName: "test", //二押点的名称
    isEnterAlarm: false, //是否进入二押点报警
    enterAlarmTimes: "", //进入二押点的报警时间
    isLeaveAlarm: false, //是否离开二押点报警
    leaveAlarmTimes: "", //离开围栏后的报警时间
    pledgeId: 0, //电子二押点的ID
    isDrawBox: false, //二押点设置box
    selectedPledgeType: "", //选择的二押点的类型
    originLink: "[]", //原始关联设备列表
    shapeType: 1, //二押点圆形或者多边形的类型
    selectProvince: "", //选择省份
    AllProvince: ProvinceUtil.province, //省份
    showProvince: "", //显示的省份
    cityList: [],
    shapeParam: [], //地点经纬度
    width1: "350",
    height1: "320",
    isDrawAction: true //
  }),
  watch: {
    searchDevKey() {
      if (!this.searchDevKey) {
        this.isSearch = false;
        this.deviceList = JSON.parse(this.originList1);
      }
    }
  },
  methods: {
    handleCurrentChange1(val) {
      this.page1.current = val;
      this.loadDeviceList();
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadPledgeList();
    },
    changeTab1(idx) {
      this.currentList1 = idx.name;
    },
    changeTab(idx) {
      this.currentList = idx.name;
    },
    loadDevicePledge(deviceImei) {
      // console.log(deviceImei);
      // 显示设备关联的围栏
      //
      loadDevicePledgeInfo({ deviceImei: deviceImei }).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          // 显示设备已关联的围栏
          this.linkPledgeList = res.data;
        }
      });
    },
    onSearchDevice() {
      //搜索设备
      // console.log("res", this.imeiLen);
      if (
        this.searchDevKey &&
        this.getStrLen1(this.searchDevKey) >= this.imeiLen
      ) {
        this.isSearch = true;
        const data = {
          userId: this.userId ? this.userId : this.rootUser.userId,
          key: this.searchDevKey
        };
        searchDevInfo(data).then(res => {
          if (res.errCode == "200") {
            this.deviceList = res.data;
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("pledge.SearchDevKeyFail")
            );
          }
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("pledge.inputSearchKey"));
      }
    },
    onLinkPledge(idx, item) {
      console.log(item);
      //关联二押点对话框显示
      this.showArea(idx, item);
      this.isLinkShow = true;
      this.selectPledge = item;
      // console.log(item);
      this.loadLinkDevice();

      // 更改时间：2020-10-27-10-10-00
      if (this.currentList == "1" && this.selectPledge) {
        this.pledgeName = this.selectPledge.name;
        this.isEnterAlarm = this.selectPledge.in_fence_prompt;
        this.isLeaveAlarm = this.selectPledge.out_fence_prompt;
        this.enterAlarmTimes = this.selectPledge.long_stay_prompt;
        this.leaveAlarmTimes = this.selectPledge.long_stay_threshold;
        this.shapeType = this.selectPledge.shape_type;
        this.selectProvince = this.expendProvinceCode;
        this.shapeParam = this.selectPledge.shape_param;
        this.selectedPledgeType =
          Number(this.selectPledge.fence_type) > 0
            ? Number(this.selectPledge.fence_type)
            : 1;
        // console.log("hhh");
        // console.log(this.selectPledge.fence_type);
        // console.log(this.selectedPledgeType);
      }
      if (this.currentList == "0" && this.selectPledge) {
        this.pledgeName = this.selectPledge.defenseName;
        this.isEnterAlarm = this.selectPledge.isEnterAlarm;
        this.isLeaveAlarm = this.selectPledge.isLeaveAlarm;
        this.enterAlarmTimes = this.selectPledge.enterAlarmTimes;
        this.leaveAlarmTimes = this.selectPledge.leaveAlarmTimes;
        this.selectProvince = this.selectPledge.province;
        this.shapeType = this.selectPledge.shapeType;
        this.selectedPledgeType = Number(this.selectPledge.defenseType);
        // console.log(this.selectPledge.province);
        // console.log("aaa");
      }
      this.isDraw = true;
    },
    // onDelPledge(idx, item) {
    //   //删除二押点
    //   var that = this;
    //   this.app.$emit("show-confirm-msg", this.$t("pledge.delPledgeTip").replace("_pledge_", item.pledgeName), function() {
    //     that.customList.splice(idx, 1);
    //   });
    // },
    showArea(idx, item) {
      //显示图形
      this.isDraw = true;
      this.isPledgeLink = false;
      this.currentList1 = "2";
      // console.log(item);
      document
        .querySelector("#baidu_map_" + this.mapName + ">div")
        .classList.remove("draw");
      document
        .querySelector("#baidu_map_" + this.mapName + ">div")
        .classList.remove("move");

      this.isDraw = true;
      this.pledgeId = item.rdId;
      this.pledgeName = item.defenseName;
      this.isEnterAlarm = item.isEnterAlarm == 1;
      this.isLeaveAlarm = item.isLeaveAlarm == 1;
      this.enterAlarmTimes = item.enterAlarmTimes;
      this.leaveAlarmTimes = item.leaveAlarmTimes;
      this.shapeType = item.shapeType;
      this.selectedPledgeType = item.defenseType;
      this.selectProvince = item.province;
      if (this.shapeType) {
        this.drawType = this.shapeType == 1 && 3 ? "circle" : "polygon";
      }
      var points = [];
      // 之前的代码
      var params = item.shapeParam;
      if (params) {
        params = params.split(";");
        for (let i = 0; i < params.length; i++) {
          let item = params[i].split(",");

          points.push(new BMap.Point(parseFloat(item[0]), parseFloat(item[1])));
        }
      }
      // 更新2020-10-30-16-10-00
      this.points = points;
      // 更新于2020-10-29-10-16-00
      // 多边形的展示
      if (this.points.length > 2) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-circle"
          // points: points,
        });
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-polygon",
          points: points
        });
      }

      // 圆形的展示
      if (this.points.length == 2) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-polygon"
          // points: points,
        });
        this.radius = mapUtil.getDistance(
          this.points[0].lat,
          this.points[0].lng,
          this.points[1].lat,
          this.points[1].lng
        );
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-circle",
          lat: this.points[0].lat,
          lng: this.points[0].lng,
          radius: this.radius,
          isDraw: true
        });
      }

      // 共享点的圆形的展示
      if (this.points.length == 1) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "remove-polygon",
          points: points
        });
        if (item.shapeParam) {
          let item1 = item.shapeParam.split(",");
          this.radius = parseFloat(item1[2]);
        }
        // console.log("item", this.radius);
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "draw-circle",
          lat: this.points[0].lat,
          lng: this.points[0].lng,
          radius: this.radius,
          isDraw: true
        });
      }

      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });
      // this.addEditPoint();
      this.loadLinkDevice();
    },
    showDevice(item) {
      //显示选中设备到地图上
      // console.log(item);
      var that = this;
      this.isPledgeLink = true;
      this.deviceImei = item.deviceImei;
      setTimeout(function() {
        that.app.$emit("refresh-infobox", item, that.mapName, that.theMap);
      }, 100);
      if (item.bdlat && item.bdlng) {
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "set-center",
          lat: item.bdlat,
          lng: item.bdlng
        });
      }
      this.loadDevicePledge(item.deviceImei);
      //
    },
    searchPledge() {
      //搜索二押点
      var list = JSON.parse(this.originList);
      if (this.searchKey) {
        this.isSearch = true;
        var result = [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].name.indexOf(this.searchKey) >= 0) {
            result.push(list[i]);
          }
        }
        this.pledgeList = result;
      } else {
        this.isSearch = false;
        this.loadPledgeList();
      }
    },
    showPledge(it) {
      //显示二押点
      this.selectPledge = it;
      this.app.$emit("map-operation", {
        action: "remove-circle",
        mapName: this.mapName
      });
      this.app.$emit("map-operation", {
        action: "remove-polygon",
        mapName: this.mapName
      });
      if (it.shape_param.indexOf(";") >= 0) {
        //多边形二押点
        var shape = it.shape_param.split(";");
        var pts = [];
        for (var i = 0; i < shape.length; i++) {
          var item = shape[i].split(",");
          pts.push(new BMap.Point(parseFloat(item[0]), parseFloat(item[1])));
        }
        this.app.$emit("map-operation", {
          action: "draw-polygon",
          points: pts,
          mapName: this.mapName
        });
        this.app.$emit("map-operation", {
          action: "set-view-port",
          points: pts,
          mapName: this.mapName
        });
      } else {
        //圆形二押点
        var val = it.shape_param.split(",");
        var radius = parseFloat(val[2]);

        var lat = parseFloat(val[1]),
          lng = parseFloat(val[0]);
        this.app.$emit("map-operation", {
          action: "draw-circle",
          lat: lat,
          lng: lng,
          radius: radius,
          mapName: this.mapName,
          isDraw: true
        });
        this.app.$emit("map-operation", {
          action: "set-center",
          lat: lat,
          lng: lng,
          mapName: this.mapName
        });
        this.app.$emit("map-operation", {
          action: "set-zoom",
          zoom: mapUtil.getBaiduZoomByMeter(radius),
          mapName: this.mapName
        });
      }
    },
    loadPledgeList() {
      //加载二押点列表
      var page = this.page.current;
      var limit = this.page.pageSize;
      this.pledgeList = JSON.parse(this.originList).slice(
        (page - 1) * limit,
        page * limit
      );
    },
    loadExpendProvince(item) {
      console.log(item);
      //获取各省份的共享二押点
      this.expendProvince = item.name;
      this.expendProvinceCode = item.code;
      this.selectProvince = item.code;

      this.isSearch = false;
      loadProvinceInfo(item).then(res => {
        this.originList = JSON.stringify(res.data.alarmAreaList);
        this.page.num = Math.ceil(res.data.iTotal / this.page.pageSize);
        this.page.total = res.data.iTotal;
        this.page.current = 1;
        this.loadPledgeList();
      });
    },
    changeUser(userId) {
      //改变用户树选中用户
      this.userId = userId;
      this.page1.current = 1;
      this.loadDeviceList();
    },
    loadDeviceList() {
      //加载设备列表
      var that = this;
      this.isSearch = false;
      const data = {
        userId: this.userId ? this.userId : this.rootUser.userId,
        page: this.page1.current,
        pageSize: this.page1.pageSize,
        actionType: "all"
      };
      loadDeviceImeiList(data).then(res => {
        if (res.errCode == "200") {
          for (var i = 0; i < res.data.devList.length; i++) {
            res.data.devList[i].address = "";
          }
          that.originList1 = JSON.stringify(res.data.devList);
          that.deviceList = res.data.devList;
          that.page1.num = Math.ceil(res.data.allCount / that.page1.pageSize);
          that.page1.total = res.data.allCount;
          setTimeout(function() {
            that.onDevList();
          }, 1000);
        }
      });
    },
    onDevList() {
      //加载设备到地图上
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "clear-map"
      });
      var points = [];
      for (let i = 0; i < this.deviceList.length; i++) {
        var item = this.deviceList[i];
        this.app.$emit("map-operation", {
          mapName: this.mapName,
          action: "add-marker",
          lat: item.bdlat,
          lng: item.bdlng,
          icon: mapUtil.getMarkerIcon(item),
          // icon: item.iconPath,
          title: item.name,
          rotation: item.course,
          data: item,
          item: item
        });
        points.push(new BMap.Point(item.bdlng, item.bdlat));
      }
      this.showDevice(this.deviceList[0]);
      this.app.$emit("map-operation", {
        mapName: this.mapName,
        action: "set-view-port",
        points: points
      });
    },
    onSelectDev(item) {
      //选中设备
      if (item.deviceImei != this.deviceImei) {
        var that = this;
        this.deviceImei = item.deviceImei;
        setTimeout(function() {
          that.app.$emit("refresh-infobox", item, that.mapName, that.theMap);
        }, 100);

        if (item.bdlat && item.bdlng) {
          this.app.$emit("map-operation", {
            mapName: this.mapName,
            action: "set-center",
            lat: item.bdlat,
            lng: item.bdlng
          });
        }
      }
    },
    getAreaName(code) {
      // 通过省份的code值拿到相应的中文名字
      var list = [];
      var str = "";
      if (code.length == 2) {
        list = this.AllProvince;
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i].code == code) {
          return str + list[i].name;
        }
      }
      return "";
    },
    loadCustomList() {
      //加载自定义二押点列表(虚拟数据)
      const data = {
        userId: this.userId ? this.userId : this.rootUser.userId
      };
      loadCustPledgeList(data).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          // 根据拿到的省份的code值转成中文赋值给新增的属性address
          for (var i = 0; i < data.length; i++) {
            data[i].address = this.getAreaName(res.data[i].province);
          }
          this.customList = data;
        }
      });
    },
    onDrawAction(tag) {
      //画图动作启动
      switch (tag) {
        case "circle": //画圆
          // 初始化对话框的值 2020-10-29
          this.pledgeName = "";
          this.selectedPledgeType = 0;
          this.points = [];
          this.pledgeId = "";
          this.radius = "";
          this.isEnterAlarm = false;
          this.isLeaveAlarm = false;
          this.enterAlarmTimes = 0;
          this.leaveAlarmTimes = 0;
          this.selectProvince = 0;
          this.linkList = [];
          this.isDrawBox = true;
          this.isDraw = true;
          this.shapeType = "1";
          this.drawType = "circle";
          this.onDrawAction("clear");
          this.app.$emit("map-operation", {
            action: "on-map-click",
            mapName: this.mapName
          });
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("move");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.add("draw");
          break;
        case "polygon": //画多边形
          // 初始化对话框的值  2020-10-29
          this.pledgeName = "";
          this.selectedPledgeType = 0;
          this.points = [];
          this.pledgeId = 0;
          // this.radius = ''
          this.isEnterAlarm = false;
          this.isLeaveAlarm = false;
          this.enterAlarmTimes = 0;
          this.leaveAlarmTimes = 0;
          this.selectProvince = 0;
          this.linkList = [];
          this.isDrawBox = true;
          this.isDraw = true;
          this.shapeType = "2";
          this.drawType = "polygon";
          this.onDrawAction("clear");
          this.app.$emit("map-operation", {
            action: "on-map-click",
            mapName: this.mapName
          });
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("move");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.add("draw");
          break;

        case "clear": //清空地图画上去的图形
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("move");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.add("draw");
          this.points = [];
          this.isEdit = false;
          this.app.$emit("map-operation", {
            action: "remove-polygon",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "remove-circle",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "clear-edit-point",
            mapName: this.mapName
          });
          break;
        case "save": //保存画上去图形
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("draw");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("move");
          this.isDraw = false;
          this.app.$emit("map-operation", {
            action: "off-map-click",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "clear-edit-point",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "remove-polygon",
            mapName: this.mapName
          });
          this.app.$emit("map-operation", {
            action: "remove-circle",
            mapName: this.mapName
          });
          break;
        case "edit": //编辑图形
          this.isDraw = true;
          this.isEdit = true;
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("draw");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.add("move");
          if (this.drawType == "polygon") {
            this.points = JSON.parse(
              JSON.stringify(this.points.slice(0, this.points.length - 1))
            );
          }
          // 更新2020-11-19 点击编辑退出不会增加圆形的点
          if (this.drawType == "circle") {
            this.points = JSON.parse(JSON.stringify(this.points.slice(0, 2)));
          }
          // console.log(this.points);
          this.addEditPoint();
          break;
        case "quit": //退出编辑模式
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.remove("move");
          document
            .querySelector("#baidu_map_" + this.mapName + ">div")
            .classList.add("draw");
          this.app.$emit("map-operation", {
            action: "clear-edit-point",
            mapName: this.mapName
          });
          if (this.points.length > 0) {
            this.points.push(
              JSON.parse(JSON.stringify(this.points[this.points.length - 1]))
            );
          }
          // 更新2020-11-19 点击编辑退出不会增加圆形的点
          if (this.drawType == "circle") {
            this.points = JSON.parse(JSON.stringify(this.points.slice(0, 2)));
          }
          this.isEdit = false;
          // console.log("a", this.points.length);
          break;
      }
    },
    addEditPoint() {
      //添加编辑图形的可拖动点
      if (this.shapeType) {
        this.drawType = this.shapeType == 1 && 3 ? "circle" : "polygon";
      }
      if (this.points.length >= 3 && this.drawType == "polygon") {
        //多边形
        var editPoints = this.points;
        this.app.$emit("map-operation", {
          action: "clear-edit-point",
          mapName: this.mapName
        });
        var points = [];
        for (var i = 0; i < editPoints.length; i++) {
          this.app.$emit("map-operation", {
            action: "add-edit-point",
            mapName: this.mapName,
            lat: editPoints[i].lat,
            lng: editPoints[i].lng,
            icon: EditPointIcon, //蓝色的有效点
            idx: i,
            tag: "point"
          });
          if (i > 0) {
            points.push({
              lat: (editPoints[i].lat + editPoints[i - 1].lat) / 2,
              lng: (editPoints[i].lng + editPoints[i - 1].lng) / 2
            });
          }
        }
        // console.log(points);
        points.push({
          lat: (editPoints[0].lat + editPoints[editPoints.length - 1].lat) / 2,
          lng: (editPoints[0].lng + editPoints[editPoints.length - 1].lng) / 2
        });

        for (let i = 0; i < points.length; i++) {
          this.app.$emit("map-operation", {
            action: "add-edit-point",
            mapName: this.mapName,
            lat: points[i].lat,
            lng: points[i].lng,
            icon: CenterPointIcon, //灰色的中间点
            idx: i,
            tag: "center"
          });
        }
      } else if (this.points.length >= 2 && this.drawType == "circle") {
        //圆形
        this.app.$emit("map-operation", {
          action: "clear-edit-point",
          mapName: this.mapName
        });
        this.app.$emit("map-operation", {
          action: "add-edit-point",
          mapName: this.mapName,
          lat: this.points[0].lat,
          lng: this.points[0].lng,
          icon: EditPointIcon,
          idx: 0,
          tag: "point"
        });
      }
    },
    loadLinkDevice() {
      //加载围栏关联的设备
      loadLinkDeviceInfo({ rdId: this.pledgeId }).then(res => {
        if (res.errCode == "200") {
          this.linkList = res.data;
          this.originLink = JSON.stringify(res.data);
        }
      });
    },
    getAreaName1(name) {
      // 通过省份的code值拿到相应的中文名字
      var list = [];
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == name) {
          return str + list[i].code;
        }
      }
      return "";
    },
    // 二押点的保存上传
    onSaveSecondDash() {
      //保存当前二押点信息
      var that = this;
      var points = [];

      // 更改时间：2020-10-27-10-10-00
      if (this.currentList == "1" && this.selectPledge) {
        this.isDraw = true;
        this.pledgeId = this.selectPledge.rdId;
        this.pledgeName = this.selectPledge.name;
        this.isEnterAlarm = this.selectPledge.in_fence_prompt;
        this.isLeaveAlarm = this.selectPledge.out_fence_prompt;
        this.enterAlarmTimes = this.selectPledge.long_stay_prompt;
        this.leaveAlarmTimes = this.selectPledge.long_stay_threshold;
        this.shapeType = this.selectPledge.shape_type;
        this.shapeParam = this.selectPledge.shape_param;
        this.selectProvince = this.expendProvinceCode;
        this.defenseType = this.selectPledge.fence_type;
        if (this.shapeParam) {
          // this.points = eval("(" + this.selectPledge.shape_param + ")");
          var points1 = this.selectPledge.shape_param.split(";");
          this.points = Object.assign({}, points1);
        }

        // console.log(this.points);
        // this.selectProvince = this.selectProvince;
      }

      if (!this.pledgeName) {
        this.app.$emit("show-alert-msg", this.$t("pledge.pledgeTip"));

        return;
      }
      if (this.enterAlarmTimes % 5 != 0) {
        this.app.$emit("show-alert-msg", this.$t("pledge.inpledgeTimeTip"));
        return;
      }
      if (this.leaveAlarmTimes % 5 != 0) {
        this.app.$emit("show-alert-msg", this.$t("pledge.outpledgeTimeTip"));
        return;
      }
      if (this.points.length < 3 && this.shapeType == 2) {
        this.app.$emit("show-alert-msg", this.$t("pledge.pointTip"));
        return;
      }
      if (this.points.length < 1 && this.shapeType == 1) {
        this.app.$emit("show-alert-msg", this.$t("pledge.pointTip2"));
        return;
      }
      if (this.points.length > 30) {
        this.app.$emit("show-alert-msg", this.$t("pledge.pointTip1"));
        return;
      }
      for (var i = 0; i < this.points.length; i++) {
        points.push(this.points[i].lng + "," + this.points[i].lat);
      }

      var data = {};
      if (this.pledgeId) {
        //更新二押点信息
        var addDev = [];
        var delDev = [];
        var originLink = JSON.parse(this.originLink);
        // console.log(originLink);
        if (originLink.length == 0) {
          for (let i = 0; i < this.linkList.length; i++) {
            addDev.push(this.linkList[i].deviceImei);
          }
          delDev = [];
        } else {
          for (let i = 0; i < this.linkList.length; i++) {
            let tag = true;
            for (var j = 0; j < originLink.length; j++) {
              if (this.linkList[i].deviceImei == originLink[j].deviceImei) {
                tag = false;
                break;
              }
            }
            if (tag) {
              addDev.push(this.linkList[i].deviceImei);
            }
          }

          for (let i = 0; i < originLink.length; i++) {
            let tag = true;
            for (let j = 0; j < this.linkList.length; j++) {
              if (this.linkList[j].deviceImei == originLink[i].deviceImei) {
                tag = false;
                break;
              }
            }
            if (tag) {
              delDev.push(originLink[i].deviceImei);
            }
          }
        }

        data = {
          defenseName: this.pledgeName,
          shapeParam: points.join(";") ? points.join(";") : this.shapeParam,
          deviceImeiList: addDev.join(","),
          isEnterAlarm: this.isEnterAlarm ? 1 : 0,
          enterAlarmTimes: this.enterAlarmTimes,
          isLeaveAlarm: this.isLeaveAlarm ? 1 : 0,
          leaveAlarmTimes: this.leaveAlarmTimes,
          rdId: this.pledgeId,
          shapeType: this.shapeType,
          defenseType: this.selectedPledgeType,
          province: this.selectProvince,
          delDeviceImeiList: delDev.join(",")
        };
        // console.log(data);
      } else {
        //添加二押点
        var dev = [];
        for (let i = 0; i < this.linkList.length; i++) {
          dev.push(this.linkList[i].deviceImei);
        }
        data = {
          defenseName: this.pledgeName,
          isEnterAlarm: this.isEnterAlarm ? 1 : 0,
          enterAlarmTimes: this.enterAlarmTimes,
          isLeaveAlarm: this.isLeaveAlarm ? 1 : 0,
          leaveAlarmTimes: this.leaveAlarmTimes,
          shapeParam: points.join(";") ? points.join(";") : this.shapeParam,
          deviceImeiList: dev.join(","),
          shapeType: this.shapeType,
          defenseType: this.selectedPledgeType,
          province: this.selectProvince
        };
        // console.log(data);
      }

      // console.log(data);
      batchSavePledgeInfo(data).then(res => {
        if (res.errCode == "200") {
          console.log(res);
          this.app.$emit("show-alert-msg", this.$t("pledge.saveOk"));
          this.onDrawAction("save");
          this.loadCustomList();
          // 加载二押点关联的设备
          this.loadLinkDevice();
          this.isDrawBox = false;
        } else {
          this.app.$emit("show-alert-msg", this.$t("pledge.saveFail"));
        }
      });
    },
    onDelSecondDash(idx, item) {
      // console.log(item);
      //删除二押点
      var str = this.$t("pledge.delPledgeTip").replace(
        "_pledge_",
        item.defenseName
      );
      this.app.$emit("show-confirm-msg", str, () => {
        doDeletePledge({ rdId: item.rdId }).then(res => {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("pledge.delOk"));
            this.customList.splice(idx, 1);
            this.onDrawAction("clear");
          } else {
            this.app.$emit("show-alert-msg", this.$t("pledge.delFail"));
          }
        });
      });
    },
    onMapRight() {
      //右击地图进入编辑模式
      if (this.drawType == "polygon" && this.points.length >= 3) {
        this.onDrawAction("edit");
      } else if (this.drawType == "circle" && this.points.length >= 2) {
        this.onDrawAction("edit");
      }
    },
    onMapClick(op) {
      // op.point = this.deteleObject(op.point)
      // console.log(op)
      if (op.mapName == this.mapName && this.isDraw && !this.isEdit) {
        if (this.drawType == "polygon") {
          //点击地图添加点
          if (this.points.length == 0) {
            this.points[0] = op.point;
            this.points[1] = op.point;
          } else {
            this.points[this.points.length - 1] = op.point;
            // console.log(op.point)
            this.points.push(op.point);
            // console.log(this.points)
          }
          // console.log(this.points)
          if (this.points.length >= 3) {
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-polygon",
              points: this.points
            });
          }
        } else {
          if (this.points.length == 0) {
            //圆心
            this.points[0] = op.point;
          } else {
            //半径点
            this.points[1] = op.point;
          }
          if (this.points.length == 2) {
            this.radius = mapUtil.getDistance(
              this.points[0].lat,
              this.points[0].lng,
              this.points[1].lat,
              this.points[1].lng
            );
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-circle",
              lat: this.points[0].lat,
              lng: this.points[0].lng,
              radius: this.radius,
              isDraw: true
            });
          }
        }
      }
    },
    onMapOver(op) {
      if (op.mapName == this.mapName && this.isDraw && !this.isEdit) {
        if (this.drawType == "polygon") {
          //悬浮地图点边跟随
          if (this.points.length >= 3) {
            this.points[this.points.length - 1] = op.point;

            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-polygon",
              points: this.points
            });
          }
        } else {
          //更新2020-12-8（之前是注释的）
          if (this.points.length >= 2) {
            this.radius = mapUtil.getDistance(
              this.points[0].lat,
              this.points[0].lng,
              this.points[1].lat,
              this.points[1].lng
            );
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-circle",
              lat: this.points[0].lat,
              lng: this.points[0].lng,
              radius: this.radius
            });
          }
        }
      }
    },
    onEditPoint(op) {
      //编辑图形
      if (op.mapName == this.mapName && this.isDraw && this.isEdit) {
        if (this.drawType == "polygon") {
          //移动端点位置
          if (this.points.length >= 3) {
            if (op.tag == "point") {
              this.points[op.idx] = op.point;
              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "draw-polygon",
                points: this.points
              });
            } else {
              this.points.splice(op.idx, 1, this.points[op.idx], op.point);

              this.app.$emit("map-operation", {
                mapName: this.mapName,
                action: "draw-polygon",
                points: this.points
              });
            }
          }
        } else {
          //移动圆形的中心
          if (this.points.length >= 2) {
            this.points[0] = op.point;
            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-circle",
              lat: this.points[0].lat,
              lng: this.points[0].lng,
              radius: this.radius,
              isDraw: true
            });
          }
        }
        this.addEditPoint();
      }
    },
    onRightEditPoint(op) {
      //右击端点删除
      if (op.mapName == this.mapName && this.isDraw && this.isEdit) {
        if (this.drawType == "polygon") {
          if (this.points.length > 3) {
            this.points.splice(op.idx, 1);

            this.app.$emit("map-operation", {
              mapName: this.mapName,
              action: "draw-polygon",
              points: this.points
            });

            this.addEditPoint();
          }
        }
      }
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
        this.width1 = 400;
        this.height1 = 330;
      } else {
        this.width1 = 350;
        this.height1 = 320;
      }
    },
    listenEvent() {
      this.app.$on("map-click", this.onMapClick);
      this.app.$on("map-rightclick", this.onMapRight);
      this.app.$on("map-eidt-point", this.onEditPoint);
      this.app.$on("map-select-marker", this.onSelectDev);
      this.app.$on("map-over", this.onMapOver);

      this.app.$on("map-eidt-point-right", this.onRightEditPoint);
    },
    offEvent() {
      this.app.$off("map-click", this.onMapClick);
      this.app.$off("map-rightclick", this.onMapRight);
      this.app.$off("map-eidt-point", this.onEditPoint);
      this.app.$off("map-select-marker", this.onSelectDev);
      this.app.$off("map-over", this.onMapOver);

      this.app.$off("map-eidt-point-right", this.onRightEditPoint);
    }
  },
  mounted() {
    this.moveVertical();
    this.moveHoriztion();
    this.listenEvent();
    this.$nextTick(() => {
      this.loadCustomList();
      this.loadDeviceList();
    });
  },
  updated() {
    this.listentDialogWidth();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss">
.result-box {
  padding: 10px;
}
</style>
