<template>
  <section class="production-content layout-container">
    <div class="form-card" style="height:100%;width:100%">
      <div class="production-main">
        <div class="production-left" style="width:340px">
          <!-- 用户树 -->
          <div class="form-card" style="height: calc(35% - 8px)">
            <div class="card-header">
              {{ $t("common.myCustomer") }}
              <span
                style="font-size: 12px; width: 200px; text-overflow: ellipsis"
                v-show="userName"
                >:{{ userName }}</span
              >
            </div>
            <div
              class="card-body"
              style="height: calc(100% - 40px);overflow-x: hidden;overflow-y: hidden;padding-right: 0;background: #f3fbfe;border-radius:unset;box-shadow:unset;border:1px solid #ccc"
            >
              <user-tree
                tree-name="monitor"
                :user-id.sync="userId"
                @usertree-select="onSelectUser"
              ></user-tree>
            </div>
          </div>
          <div class="move-bar-v"></div>
          <!-- 设备列表 start-->
          <div class="form-card" style="height: 65%; padding-top: 0px">
            <div class="card-header">{{ $t("common.deviceList") }}</div>
            <div
              class="card-body"
              style="height: calc(100% - 40px);overflow-x: hidden;overflow-y: hidden;background-color: #f3fbfe;border-radius:unset"
            >
              <device-list
                :user-id.sync="userId"
                :btn-type="currentTab"
                @devlist="onDevList"
                @do-dev-op="dealDevOp"
                @select-dev="onSelectDev"
                :device-imei.sync="deviceImei"
                :is-show-active="false"
              ></device-list>
            </div>
          </div>
          <!-- 设备列表 end-->
        </div>
        <div class="production-right">
          <!-- 图片 -->
          <div class="pictrue-content" v-show="currentTable == 0">
            <div class="header">
              <div>
                <span>{{ $t("common.deviceImei") }}:</span>
                <span>{{ deviceImei }}</span>
              </div>
              <div class="search-btn">
                <el-button type="primary" size="small" @click="loadDevPhoto">{{
                  $t("common.search")
                }}</el-button>
              </div>
            </div>
            <div class="table-content">
              <div class="device-image-wraper">
                <div class="title">{{ $t("production.devicePictrue") }}</div>
                <div class="image-group">
                  <div
                    class="item"
                    v-for="(url, index) in urls"
                    :key="'url' + index"
                    v-show="urls.length > 0"
                  >
                    <el-image
                      :src="API.staticResource + url.fileUrl"
                      :preview-src-list="[API.staticResource + url.fileUrl]"
                      lazy
                    >
                    </el-image>
                    <!-- <el-image :src="'http://task.domilink.cn:8088/' + url.fileUrl" :preview-src-list="['http://task.domilink.cn:8088/' + url.fileUrl]" lazy> </el-image> -->

                    <span
                      v-show="url"
                      class="del-btn"
                      @click="removeDevPhoto(url)"
                    >
                      <!-- <i class="iconfont icon-close1"></i> -->
                      <i class="iconfont icon-shanchu1"></i>
                    </span>
                    <span v-show="url" class="del-btn1">
                      <el-tooltip effect="dark" placement="top">
                        <span slot="content">{{
                          url.createTime | fdatetime
                        }}</span>
                        <i class="iconfont icon-tanhaojinggao"></i>
                      </el-tooltip>
                    </span>
                  </div>
                </div>
                <div class="no-data" v-if="urls.length <= 0">
                  {{ $t("common.nodata") }}
                </div>
              </div>
            </div>
          </div>
          <!-- 日志 -->
          <div class="device-content" v-show="currentTable == 1">
            <div
              class="card-header"
              style="padding-left: 1rem;position: relative;"
            >
              <span>{{ $t("production.devicelog") }}</span>
              <span v-show="deviceImei"
                >{{ $t("common.deviceImei") }}:{{ deviceImei }}</span
              >
              <div class="btn-content">
                <el-button type="primary" size="small" @click="exportTable">{{
                  $t("alarm.exportTable")
                }}</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="exportTable('all')"
                  >{{ $t("common.exportAll") }}</el-button
                >
              </div>
            </div>
            <div class="time-show">
              <span>{{ $t("common.startTime") }}:</span>
              <el-date-picker
                v-model="timeFrom"
                type="datetime"
                style="width:182px"
                :placeholder="$t('common.chooseTime')"
                @change="changeTimeValue"
                ref="fromtime"
              >
              </el-date-picker>
              <span class="form-table-span">{{ $t("common.endTime") }}:</span>
              <el-date-picker
                v-model="timeTo"
                type="datetime"
                style="width:182px"
                :placeholder="$t('common.chooseTime')"
                @change="changeTimeValue"
                ref="totime"
              >
              </el-date-picker>
              <el-button type="primary" @click="searchDate">{{
                $t("alarm.search")
              }}</el-button>
              <span>{{ $t("production.protoNo") }}</span>
              <el-select style="width:80px" v-model="protolNo">
                <el-option value>{{ $t("common.all") }}</el-option>
                <el-option
                  v-for="(item, index) in protocolNoList"
                  :key="index"
                  :value="item"
                ></el-option>
              </el-select>
              <!-- <span>{{ protolNoTip }}</span> -->
              <el-tag type="info" v-show="protolNoTip">{{
                protolNoTip
              }}</el-tag>
              <div class="show-error">
                <div class="error-tip" v-show="isDateBefore">
                  {{ $t("alarm.dateTip") }}
                </div>
                <div class="error-tip" v-show="isDateOver">
                  {{ $t("production.dateTip") }}
                </div>
                <div class="error-tip" v-show="isDateLast">
                  {{ $t("alarm.dateTip2") }}
                </div>
              </div>
            </div>
            <!-- 内容 -->
            <div class="recorder-list-table">
              <el-table
                v-show="isShowContent"
                :data="logList"
                v-loadmore="loadmoreContent"
                style="width:100%"
                height="100%"
                ref="multipleTable"
                @selection-change="handleSelection"
                :row-class-name="tableRowClassName"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  :label="$t('production.uploadTime')"
                  width="180"
                >
                  <template slot-scope="scope">
                    {{ scope.row.uploadTime.time | fdatetime }}
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('production.protoNo')"
                  prop="protocolNo"
                >
                </el-table-column>
                <el-table-column
                  :label="$t('accountMsg.content')"
                  prop="msg"
                  align="left"
                >
                </el-table-column>
              </el-table>
              <div class="no-quanxian" v-show="!isShowContent">
                {{ contentMsg }}
              </div>
            </div>
            <!-- 游标时间 -->
            <!-- <div class="youbiaotime" v-show="isShowtime">
              <el-select v-model="currentIndex" @change="setCurrentRow" style="width:150px">
                <el-option v-for="(i, index) in timeList" :key="i" :value="index" :label="i"> </el-option>
              </el-select>
            </div> -->
            <!-- end -->
            <div class="back-top" @click="backToTop" v-show="isBackTop">
              <el-tooltip
                class="item"
                effect="dark"
                content="返回顶部"
                placement="top"
                v-show="isBackTop"
              >
                <i class="el-icon-caret-top"></i>
              </el-tooltip>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
      <!--头部选项操作 end-->
    </div>
  </section>
</template>

<script>
import DeviceListComp from "@/components/DeviceList/DeviceList.vue";
import UserTreeComp from "@/components/UserTree/UserTree";
import ExportUtil from "@/utils/exportUtil.js";
import {
  loadDeviceLogInfo,
  onSelectUserInfo,
  loadDevicePhoto,
  removePhoto
} from "@/api/production";
export default {
  name: "ProductionManage",
  components: {
    "user-tree": UserTreeComp,
    "device-list": DeviceListComp
  },
  props: {},
  data: () => ({
    currentTable: 0, //当前表格
    currentTab: 6, //当前导航
    detailList: [], //详单数据
    deviceImei: "", //当前设备imei
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    page: {
      //分页器
      name: "Production",
      limit: 30,
      num: 1,
      current: 1
    },
    devList: [],
    urls: [],
    logList: [],
    timeFrom: "",
    timeTo: "",
    isDateOver: false,
    isDateBefore: false,
    isDateLast: false,
    protolNo: "",
    protocolNoList: [
      "01",
      "12",
      "13",
      "16",
      "18",
      "19",
      "f3",
      "f1",
      "1a",
      "80",
      "0b"
    ],
    isLoadMore: false,
    selectList: [],
    protolNoTip: "",
    youbiaoTime: "",
    isShowtime: false,
    currentIndex: "",
    timeList: [],
    isBackTop: false,
    contentMsg: "",
    isShowContent: false
  }),
  watch: {
    timeFrom() {
      if (this.timeFrom && this.timeFrom != null) {
        this.checkTimeRange();
      }
    },
    timeTo() {
      if (this.timeTo && this.timeTo != null) {
        this.checkTimeRange();
      }
    },
    protolNo() {
      this.protolNoTip = this.getTheProtocolName(this.protolNo);
    }
  },
  methods: {
    backToTop() {
      // 返回顶部
      const start = this.$refs.multipleTable.bodyWrapper.scrollTop;
      let i = 0;
      this.interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500));
        if (next <= 50) {
          this.$refs.multipleTable.bodyWrapper.scrollTo(0, 50);
          clearInterval(this.interval);
          this.isMoving = false;
        } else {
          this.$refs.multipleTable.bodyWrapper.scrollTo(0, next);
        }
        i++;
      }, 16.7);
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
    setCurrentRow(i) {
      // 跳到当前选中的行
      let k;
      for (let j = 1; j < this.logList.length; j++) {
        if (
          this.timeList[i] ==
          new Date(this.logList[j].uploadTime.time).format(
            "yyyy-MM-dd hh:mm:ss"
          )
        ) {
          console.log(this.timeList[i]);
          k = j;
          this.$refs.multipleTable.setCurrentRow(this.logList[k - 1]);
          const targetTop = this.$refs.multipleTable.$el
            .querySelectorAll(".el-table__body tr")
            [k - 1].getBoundingClientRect().top;
          const containerTop = this.$refs.multipleTable.$el
            .querySelector(".el-table__body")
            .getBoundingClientRect().top;
          const scrollParent = this.$refs.multipleTable.$el.querySelector(
            ".el-table__body-wrapper"
          );
          scrollParent.scrollTop = targetTop - containerTop;
        }
      }
    },
    showCurrentTimecontent() {
      var itemContent;
      for (let i = 1; i < this.logList.length; i++) {
        var item = this.logList[i].uploadTime.time;
        console.log(new Date(item).format("yyyy-MM-dd hh:mm:ss"));
        if (this.youbiaoTime == new Date(item).format("yyyy-MM-dd hh:mm:ss")) {
          itemContent = this.logList[i];
          console.log(i);
          this.setCurrentRow(i);
        }
      }
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
    handleSelection(arr) {
      this.selectList = arr;
    },
    getTheProtocolName(num) {
      var thelist = this.$t("production.protocolNoList");
      var str = "";
      for (var i = 0; i < thelist.length; i++) {
        if (num == thelist[i].num) {
          return str + thelist[i].text;
        }
      }
      return "";
    },
    changeTimeValue(val) {
      console.log(val);
    },
    exportTable(tag) {
      // 导出功能，单项导出和导全部
      if (tag == "all") {
        // this.exportTableLog(this.logList);
        let data = {
          from: 1,
          pageSize: 1000000,
          deviceImei: this.deviceImei
        };
        if (this.protolNo) {
          data.protocolNo = this.protolNo;
        }
        if (this.timeFrom && this.timeTo) {
          data.startTime = new Date(this.timeFrom).getTime();
          data.endTime = new Date(this.timeTo).getTime();
        }
        loadDeviceLogInfo(data).then(res => {
          if (res.errCode == 200) {
            this.exportTableLog(res.data.data);
          }
        });
      } else {
        if (this.logList.length < 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        }
        this.exportTableLog(this.selectList);
      }
    },
    exportTableLog(list) {
      // 配置导出的数据格式
      let title = [
        this.$t("production.uploadTime"),
        this.$t("production.protoNo"),
        this.$t("production.content")
      ];
      let arr = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        arr.push([
          item.uploadTime.time
            ? new Date(item.uploadTime.time).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.protocolNo,
          item.msg
        ]);
      }
      ExportUtil.exportTable(title, arr, this.deviceImei + "设备日志");
    },
    searchDate() {
      // 查询事件
      this.page.current = 1;
      this.isLoadMore = false;
      if (this.isDateOver || this.isDateBefore || this.isDateLast) return;
      switch (this.currentTable) {
        case 0:
          this.loadDevPhoto();
          break;
        case 1:
          this.backToTop();
          setTimeout(() => {
            this.loadDeviceLog();
          }, 1000);

          break;
      }
    },
    checkTimeRange() {
      //检查时间范围
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
        10 * 24 * 3600000
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
    handleCurrentChange(current) {
      this.page.current = current;
    },
    onParseAddress(op) {
      //解析地址
      var that = this;
      for (var i = 0; i < this.detailList.length; i++) {
        var item = this.detailList[i];
        var lng = item.baidu_lon,
          lat = item.baidu_lat;
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
    },
    onSelectUser(userId, userName) {
      // console.log(typeof userId);
      this.userId = Number(userId);
      if (!userName) {
        onSelectUserInfo({ userId: userId }).then(res => {
          if (res.errCode == 200) {
            this.userName = res.data.userName;
          }
        });
      } else {
        this.userName = userName;
      }

      this.app.$emit("usertree-userid", userId, userName);
      window.location.hash = this.$route.path + "?userId=" + userId;
    },
    onSelectUserId(userId) {
      this.userId = userId;
      this.app.$emit("usertree-userid", userId);
    },
    onSelectDev(device) {
      // console.log(device);
      if (device && device.deviceImei) {
        this.deviceImei = device.deviceImei;
        // this.loadDevPhoto();
      }
    },
    dealDevOp(op) {
      //设备列表的操作
      console.log(op);
      var idx = op.idx;
      this.deviceImei = op.imei;
      if (op.btnType == 6) {
        //监控平台设备列表操作
        if (idx == 0) {
          //跳转跟踪界面 currentMap
          // window.open(window.location.origin + window.location.pathname + `#/track?deviceImei=${imei}`);
          this.currentTable = 0;
          this.loadDevPhoto();
          this.page.current = 1;
        } else if (idx == 1) {
          //跳转回放界面 "#/playback?deviceImei=" + imei
          // window.open(window.location.origin + window.location.pathname + `#/playback?deviceImei=${imei}`);
          this.page.current = 1;
          this.currentTable = 1;
          this.isLoadMore = false;
          this.backToTop();
          setTimeout(() => {
            this.loadDeviceLog();
          }, 1000);
        } else if (idx == 2) {
          //更多 查看设备详情对话框
          this.app.$emit(
            "show-device-dialog",
            {
              name: "DeviceDialog",
              imei: op.imei
            },
            "production"
          );
        }
      }
    },
    onDevList(op) {
      // console.log(op);
      this.devList = op.devList;
      // this.page = op.page;
      this.deviceImei = op.devList[0].deviceImei;
    },
    selectDevice(device) {
      console.log(device);
      if (device && device.deviceImei) {
        this.deviceImei = device.deviceImei;
      }
    },
    loadDevPhoto() {
      if (!this.deviceImei) {
        this.app.$emit("show-alert-msg", this.$t("traveling.toPlaybackTip"));
      }
      let data = {
        deviceImei: this.deviceImei
      };
      loadDevicePhoto(data).then(res => {
        if (res.errCode == 200) {
          // console.log(res);
          this.urls = res.data;
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.getPhotoFail"));
        }
      });
    },
    removeDevPhoto(item) {
      let data = {
        "pkIds[]": Array.from([item.pkId]),
        deviceImei: item.deviceImei
      };
      this.app.$emit(
        "show-confirm-msg",
        this.$t("production.deletePhotoTip"),
        () => {
          removePhoto(data).then(res => {
            if (res.errCode == 200) {
              this.loadDevPhoto();
              this.app.$emit(
                "show-alert-msg",
                this.$t("common.removeDevPhoto")
              );
            }
          });
        }
      );
    },
    loadDeviceLog() {
      let data = {
        from: this.page.current,
        pageSize: this.page.limit,
        deviceImei: this.deviceImei
      };
      if (this.protolNo) {
        data.protocolNo = this.protolNo;
      }
      if (this.timeFrom && this.timeTo) {
        data.startTime = new Date(this.timeFrom).getTime();
        data.endTime = new Date(this.timeTo).getTime();
      }
      loadDeviceLogInfo(data).then(res => {
        if (res.errCode == 200) {
          this.isShowContent = true;
          this.logList = res.data.data;
        } else if (res.errCode == 0) {
          this.isShowContent = false;
          this.contentMsg = res.errMsg;
        }
      });
    },
    loadmoreContent() {
      // 无限加载数据
      let that = this;
      if (this.isLoadMore) {
        return;
      }
      let data = {
        from: (that.page.current += that.page.limit),
        pageSize: that.page.limit,
        deviceImei: that.deviceImei
      };
      if (this.timeFrom) {
        data.startTime = new Date(this.timeFrom).getTime();
      }
      if (this.timeTo) {
        data.endTime = new Date(this.timeTo).getTime();
      }
      if (this.protolNo) {
        data.protocolNo = this.protolNo;
      }
      loadDeviceLogInfo(data).then(res => {
        if (res.errCode == 200) {
          if (res.data.data.length > 0) {
            that.logList = that.logList.concat(res.data.data);
            for (let i = 0; i < that.logList.length; i++) {
              that.youbiaoTime = new Date(
                this.logList[0].uploadTime.time
              ).format("yyyy-MM-dd hh:mm:ss");
              that.timeList.push(
                new Date(this.logList[i].uploadTime.time).format(
                  "yyyy-MM-dd hh:mm:ss"
                )
              );
              that.timeList = that.timeList.filter((item, index, self) => {
                return self.indexOf(item) == index;
              });
            }
            // console.log("res", res);
          } else {
            // console.log("res", res);
            that.isLoadMore = true;
            return;
          }
        }
      });
    },
    scrollBackToTopTag() {
      this.$refs.multipleTable.bodyWrapper.addEventListener("scroll", res => {
        let height = res.target;
        let clientHeight = height.clientHeight;
        let scrollTop = height.scrollTop;
        let scrollHeight = height.scrollHeight;
        if (clientHeight < scrollTop + 300) {
          this.isBackTop = true;
          this.isShowtime = true;
          // this.isLoadMore = false; //避免重新查询滚动不了
        } else {
          this.isBackTop = false;
          this.isShowtime = false;
        }
      });
    }
  },
  mounted() {
    this.scrollBackToTopTag();
    // this.listenEvent();
  },
  beforeDestroy() {
    // this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.recorder-list-table {
  height: calc(100% - 80px);
}
.no-quanxian {
  height: 780px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.device-content {
  height: 100%;
  .btn-content {
    position: absolute;
    right: 0px;
    top: 0;
  }
}
.time-show {
  margin: 10px;
  white-space: nowrap;
  .show-error {
    color: red;
    display: inline-block;
  }
}
.youbiaotime {
  position: fixed;
  right: 20px;
  z-index: 9999;
  // width: 100px;
  height: 30px;
  top: 50%;
  // span {
  //   display: inline-block;
  //   padding: 8px 10px;
  //   background: green;
  //   border-radius: 2px;
  //   color: #fff;
  //   cursor: pointer;
  // }
}
.production-content {
  ::v-deep .el-table td.el-table__cell:last-child div {
    text-align: left !important;
  }
  // height: calc(100% - 12px);
  // height: 100%;
  .production-main {
    display: flex;
    flex-direction: row;
    height: calc(100% - 2px);
  }
  .pictrue-content {
    height: 100%;
    width: 100%;
  }
  .back-top {
    position: fixed;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    z-index: 5;
    right: 40px;
    bottom: 60px;
  }
  .production-left {
    width: 340px;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    // height: calc(100% - 5rem);
    background-color: #e7f7ff;
    padding: 10px 20px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  }
  .production-right {
    padding: 0.8rem;
    flex: 1;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-left: 10px;
    .header {
      padding: 6px;
      border-bottom: 1px solid #ccc;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:nth-of-type(1) {
        font-weight: bold;
      }
    }
    .table-content {
      height: calc(100% - 24px);
      .device-image-wraper {
        height: 100%;
        // overflow: scroll;
        height: calc(100% - 20px);
        overflow: scroll;
        .title {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          padding: 10px 0 5px 0;
        }
        .image-group {
          display: flex;
          flex-wrap: wrap;
          overflow: scroll;
          padding-left: 14px;
          // height: calc(100% - 35px);
          .item {
            // height: 200px;
            margin: 12px;
            width: 30%;
            border-radius: 5px;
            // box-shadow: 1px 1px 5px #333;
            position: relative;
            // overflow: hidden;
            .del-btn {
              position: absolute;
              right: 10px;
              top: 10px;
              z-index: 888;
              display: inline-block;
              background: #eee;
              width: 26px;
              height: 20px;
              text-align: center;
              border-radius: 50%;
              line-height: 20px;
              .iconfont {
                font-size: 15px;
              }
            }
            .del-btn1 {
              @extend .del-btn;
              right: 45px;
            }
          }
          .item:not(:nth-child(4n)) {
            // margin-right: calc(4% / 3);
          }
          ::v-deep .el-image {
            border-radius: 5px;
            box-shadow: 1px 1px 5px #333;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    // height: 100%;
    height: calc(100% - 45px);
  }
  @media screen and (max-width: 1400px) {
    .image-group .item {
      margin: 12px !important;
      width: 45% !important;
    }
  }
  @media screen and (min-width: 1400px) and (max-width: 1500px) {
    .image-group .item {
      margin: 12px !important;
      width: 30% !important;
    }
  }
  @media screen and (min-width: 1920px) {
    .image-group .item {
      margin: 12px !important;
      width: 30% !important;
    }
  }
}
</style>
