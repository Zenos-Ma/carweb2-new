<template>
  <section style="height: 100%" class="travel-content">
    <div class="form-card" style="height: 100%; width: 100%">
      <div class="card-header" style="padding-left: 10px">
        <span>{{ $t("common.deviceImei") }}:{{ imei }}</span>
      </div>

      <!--头部选项操作 end-->
      <div class="card-body">
        <div class="travel-head">
          <div class="time-box">
            <span>
              {{ $t("common.startTime") }}:
              <el-date-picker v-model="timeFrom" type="datetime" format="yyyy-MM-dd hh:mm:ss" style="width: 195px"></el-date-picker>
            </span>
            <span class="form-table-span"
              >{{ $t("common.endTime") }}:
              <!-- <datetime-picker :datetime.sync="timeTo"></datetime-picker> -->
              <el-date-picker v-model="timeTo" type="datetime" format="yyyy-MM-dd hh:mm:ss" style="width: 195px"></el-date-picker>
            </span>
          </div>
          <div class="error-tip" v-if="isDateBefore">{{ $t("alarm.dateTip") }}</div>
          <div class="error-tip" v-if="isDateOver">{{ $t("alarm.dateTip1") }}</div>
          <div class="error-tip" v-if="isDateLast">{{ $t("alarm.dateTip2") }}</div>
          <div class="right-btn">
            <el-button type="primary" size="small" @click="loadAllTravelDetail">{{ $t("alarm.search") }}</el-button>
          </div>
        </div>
        <!-- 行程的信息start -->
        <div class="travel-data-content">
          <div class="data-head">
            <el-row>
              <el-col :span="6" style="padding-left: 10px; padding-right: 10px">
                <el-card>
                  <div class="fontWeightBold" v-if="detailDeviceListTravel.mileageSum > 0">{{ detailDeviceListTravel.mileageSum / 1000 }}km</div>
                  <div class="fontWeightBold" v-else>0.00km</div>
                  <div>{{ $t("traveling.allMileage") }}</div>
                </el-card>
              </el-col>
              <el-col :span="6" style="padding-left: 10px; padding-right: 10px">
                <el-card>
                  <div class="fontWeightBold" v-if="detailDeviceListTravel.runTime > 0">{{ detailDeviceListTravel.runTime }}分</div>
                  <div class="fontWeightBold" v-else>0{{ $t("traveling.fen") }}</div>
                  <div>{{ $t("traveling.allTime") }}</div>
                </el-card>
              </el-col>
              <el-col :span="6" style="padding-left: 10px; padding-right: 10px">
                <el-card>
                  <div class="fontWeightBold" v-if="detailDeviceListTravel.overspeedSum > 0">{{ detailDeviceListTravel.overspeedSum }}km/h</div>
                  <div class="fontWeightBold" v-else>0km/h</div>
                  <div>{{ $t("traveling.averageSpeed") }}</div>
                </el-card>
              </el-col>
              <el-col :span="6" style="padding-left: 10px; padding-right: 10px">
                <el-card>
                  <div class="fontWeightBold" v-if="detailDeviceListTravel.stopSum > 0">{{ detailDeviceListTravel.stopSum }}{{ $t("traveling.time") }}</div>
                  <div class="fontWeightBold" v-else>0{{ $t("traveling.time") }}</div>
                  <div>{{ $t("traveling.stopTime") }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <!-- 行程内容 -->
          <div class="table-content" style="height: calc(100% - 160px); min-width: 760px">
            <el-scrollbar style="height: 100%" ref="scrollbar">
              <div class="travel-group">
                <div class="group-content" v-for="(item, idx) in detailList" :key="'detailList' + idx" :class="isFixedTop && 'tabs-fixed-top'">
                  <div class="title">
                    <span>{{ item.title }}</span>
                    <div class="item-cont1">
                      <span>{{ item.mileageWithUnit }}</span>
                      <span>{{ item.timeUsed }}</span>
                      <span style="width: 200px">{{ $t("playbackRouteDialog.startAddress") }}</span>
                      <span style="width: 200px">{{ $t("playbackRouteDialog.endAddress") }}</span>
                    </div>
                    <div class="right-btn">
                      <i class="iconfont" :class="[isShow && currentTable == idx ? 'icon-icon-up1' : 'icon-icon-down1']" @click="showgrooupItem(idx)"></i>
                    </div>
                  </div>
                  <div class="group-item" v-for="(it, ii) in item.list" :key="'list' + ii" :data-index="idx" :class="[currentTable == idx ? 'showitem' : '']" ref="showitem">
                    <div class="item" @click="goPlayback(it)">
                      <span><i class="iconfont icon-jinru"></i>{{ it.title }}</span>
                      <span>{{ it.mileageWithUnit }}</span>
                      <span>{{ it.time }}</span>
                    </div>
                    <div class="start-address">
                      <div v-if="it.startAddress">{{ it.startAddress }}</div>
                      <a v-if="!it.startAddress && it.startLat >= 0" @click="onParseAddress(it, idx, ii, 'start')">{{ it.startLat }},{{ it.startLon }}</a>
                    </div>
                    <div class="end-address" style="margin-left: 10px">
                      <div v-if="it.endAddress">{{ it.endAddress }}</div>
                      <a v-if="!it.endAddress && it.endLat >= 0" @click="onParseAddress(it, idx, ii, 'end')">{{ it.endLat }}, {{ it.endLon }}</a>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 暂无数据 -->
              <div class="table-nodata" v-show="detailList.length == 0 && !isLoading">{{ $t("common.nodata") }}</div>
              <div class="table-loading" v-show="isLoading">{{ $t("common.loading") }}</div>
            </el-scrollbar>
          </div>
        </div>
        <!-- 行程的信息end -->
      </div>
      <!--头部选项 end-->
    </div>
  </section>
</template>

<script>
  import { updateDevice, loadTraveling, loadAllTravelDetailInfomation } from "@/api/monitor.js";
  export default {
    name: "Traveling",
    components: {},
    props: {},
    data: () => ({
      currentTable: null, //当前表格
      detailList: [], //详单数据
      imei: "", //当前设备imei
      userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId, //当前用户
      userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
      rootUser: JSON.parse(window.localStorage.getItem("carweb_user")), //登录用户
      page: {
        //分页器
        name: "traveling",
        limit: 30,
        num: 1,
        current: 1,
      },
      timeFrom: new Date(new Date().getTime() - 3600 * 1000).format("yyyy-MM-dd 00:00"),
      timeTo: new Date().format("yyyy-MM-dd hh:00"),

      isDateOver: false,
      isDateBefore: false,
      isDateLast: false,
      devList: [],
      detailDeviceListTravel: [],
      isShow: false,
      isLoading: false,
      startTime: new Date().format("yyyy-MM-dd hh:mm"), //开始时间
      endTime: new Date().format("yyyy-MM-dd hh:mm"), //结束时间
      locTime: new Date().getTime(), //定位时间开始
      isFixedTop: false,
    }),
    watch: {
      timeFrom() {
        this.checkTimeRange();
      },
      timeTo() {
        this.checkTimeRange();
      },
    },
    methods: {
      handleScroll() {
        // 原本是想做吸顶的效果的
        let scrollbarEl = this.$refs.scrollbar.wrap;
        scrollbarEl.onscroll = () => {
          if (scrollbarEl.scrollTop > 135) {
            this.isFixedTop = true;
          } else {
            this.isFixedTop = false;
          }
        };
      },
      showgrooupItem(idx) {
        this.currentTable = idx;
        this.isShow = !this.isShow;
        var element = document.querySelectorAll(".group-item");
        for (var i = 0; i < element.length; i++) {
          var index = element[i].getAttribute("data-index");
          // console.log(index);
          if (idx == index) {
            // console.log(element[i]);
            if (!this.isShow) {
              element[i].classList.remove("showitem");
            } else {
              element[i].classList.add("showitem");
            }
          }
        }
      },
      goPlayback(item) {
        // console.log(item);
        if (!this.imei) {
          this.app.$emit("show-alert-msg", this.$t("traveling.toPlaybackTip"));
          return;
        }
        // let imei = item.deviceImei;
        let timeFromStr, timeToStr;
        this.changeTimeRange(item.special);
        if (item.special == 1 || item.special == 2) {
          timeFromStr = new Date(this.startTime).getTime();
          timeToStr = new Date(this.endTime).getTime();
        } else {
          timeFromStr = item.startTime;
          timeToStr = item.endTime;
        }
        // console.log(timeFromStr, timeToStr);
        window.open(window.location.origin + window.location.pathname + `#/playback?deviceImei=${this.imei}&from=${timeFromStr}&to=${timeToStr}`);
      },
      getDeviceLocation(imei) {
        //获取设备最近的定位信息
        if (imei) {
          updateDevice({ deviceImei: imei }).then((res) => {
            if (res.errCode == "200") {
              this.locTime = res.data.info.locateTime;
              this.startTime = new Date(this.locTime - 3600 * 1000).format("yyyy-MM-dd hh:mm");
              this.endTime = new Date().format("yyyy-MM-dd hh:mm");
            }
          });
        }
      },
      changeTimeRange(tag) {
        let start = new Date().getTime();
        if (tag == 1) {
          // 设备最后获取定位时间的上一个小时
          // console.log("chufa");
          start = this.locTime - 60 * 60 * 1000;
          this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
          this.endTime = new Date(this.locTime).format("yyyy-MM-dd hh:mm");
        }
        if (tag == 2) {
          start = new Date(new Date().format("yyyy-MM-dd")).getTime() - 8 * 60 * 60 * 1000;
          this.startTime = new Date(start).format("yyyy-MM-dd hh:mm");
          this.endTime = new Date().format("yyyy-MM-dd hh:mm");
        }
      },
      handleSelection(arr) {
        console.log(arr);
      },
      handleCurrentChange(current) {
        this.page.current = current;
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
      onTimeRange(op) {
        //时间范围选择结果
        this.timeFrom = op.startTimeFormat;
        this.timeTo = op.endTimeFormat;
      },

      checkTimeRange() {
        //检查时间范围
        var halfYear = new Date().getTime() - 186 * 24 * 3600000;
        if (new Date(this.timeTo).getTime() < halfYear || new Date(this.timeFrom).getTime() < halfYear) {
          this.isDateLast = true;
        } else {
          this.isDateLast = false;
        }
        if (new Date(this.timeTo).getTime() - new Date(this.timeFrom) > 31 * 24 * 3600000) {
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
      onParseAddress(op, idx, ii, tag) {
        // s
        //解析地址
        var that = this;
        // 2022-1-10

        if (tag == "start") {
          var lng = op.startLon,
            lat = op.startLat;
          if (lng && lat && lat != 0 && lng > -180 && lng <= 180 && lat <= 90 && lat >= -90) {
            this.getPoiLocation(lng, lat, function (address) {
              console.log(address);
              that.detailList[idx].list[ii].startAddress = address ? address : that.$t("common.addressFail");
            });
          }
        } else if (tag == "end") {
          var lng1 = op.endLon,
            lat1 = op.endLat;
          if (lng1 && lat1 && lat1 != 0 && lng1 > -180 && lng1 <= 180 && lat1 <= 90 && lat1 >= -90) {
            this.getPoiLocation(lng1, lat1, function (address) {
              console.log(address);
              that.detailList[idx].list[ii].endAddress = address ? address : that.$t("common.addressFail");
            });
          }
        }
      },

      setTimeRange(tag) {
        //设置时间范围
        var from = new Date().getTime();
        var day = new Date().getDay() - 1;
        switch (tag) {
          case "today":
            from = new Date(new Date().format("yyyy-MM-dd")).getTime() - 8 * 60 * 60 * 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
            break;
          case "yesterday":
            from = new Date(new Date().format("yyyy-MM-dd")).getTime() - 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date(from + 24 * 3600 * 1000 - 1000).format("yyyy-MM-dd hh:mm");
            break;
          case "thisWeek":
            from = new Date(new Date().format("yyyy-MM-dd")).getTime() - (day > 0 ? day : day + 7) * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
            break;
          case "lastWeek":
            day = day > 0 ? day : day + 7;
            from = new Date(new Date().format("yyyy-MM-dd")).getTime() - (day + 7) * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000;
            var to = new Date(new Date().format("yyyy-MM-dd")).getTime() - day * 24 * 3600 * 1000 - 8 * 60 * 60 * 1000 - 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm");
            break;
          case "thisMonth":
            var month = new Date().getMonth() + 1;
            from = new Date(new Date().getFullYear() + "-" + (month > 9 ? month : "0" + month) + "-01").getTime() - 8 * 60 * 60 * 1000;
            this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
            this.timeTo = new Date().format("yyyy-MM-dd hh:mm");
            break;
          case "lastMonth":
            {
              var m = new Date(new Date().getTime() - 30 * 24 * 3600000);
              from = new Date(m.getFullYear() + "-" + (m.getMonth() + 1) + "-01").getTime() - 8 * 60 * 60 * 1000;
              let to = new Date(new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-01") - 8 * 60 * 60 * 1000 - 1000;
              this.timeFrom = new Date(from).format("yyyy-MM-dd hh:mm");
              this.timeTo = new Date(to).format("yyyy-MM-dd hh:mm");
            }
            break;
        }
      },
      // 时间间隔毫秒计算具体时间
      computedInterval(value, format) {
        value = parseInt(value / 1000); // 取全部秒
        let second = value % 60; // 取秒
        value = (value - second) / 60; // 取全部分钟
        let minute = value % 60; //取分
        value = (value - minute) / 60; // 取全部小时
        let hour = value % 24; // 取小时
        value = (value - hour) / 24; // 取全部天
        let day = value;
        let str = "";
        str += day <= 0 ? "" : day + "天";
        str = str + (hour <= 0 ? "" : hour + "时");
        str = str + (minute <= 0 ? "" : minute + "分");
        str = str + (second <= 0 ? "" : second + "秒");

        // 只显示两个单位
        let trimTime = this.descriptionTime({
          day,
          hour,
          minute,
          second,
        });

        let ret = {
          str: str,
          trimTime: trimTime,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
        };
        if (format) {
          format = format.replace(/d\+/, "," + day);
          format = format.replace(/h\+/, "," + hour);
          format = format.replace(/m\+/, "," + minute);
          format = format.replace(/s\+/, "," + second);
          format = format.replace(/,(0[^,]+?)/g, "");
          let arr = format.split(",");
          arr = arr.splice(1, 2);
          ret.format = arr.join("");
        }

        return ret;
      },
      // 处理时间间隔，只显示两个单位
      descriptionTime(data) {
        var str = "";
        str += data.day === 0 ? "" : data.day + "天,";
        str = str + (data.hour === 0 ? "" : data.hour + "时,");
        str = str + (data.minute === 0 ? "" : data.minute + "分,");
        str = str + (data.second === 0 ? "" : data.second + "秒");
        var arr = str.split(",");
        arr = arr.splice(0, 2);
        return arr.join("");
      },
      dealTripArray(data) {
        // console.log(data);
        // 处理请求的数据  按天收集
        let map = new Map();
        if (data.Msg) {
          for (let value of data.Msg.reverse()) {
            // console.log(value);
            let time = new Date(value.startTime).format("yyyy-MM-dd");
            map.set(time, {
              // title: new Date(value.startTime.time).format("M月d日"),
              title: new Date(value.startTime).format("M月d日"),
              mileage: value.mileage.toFixed(2),
              mileageWithUnit: value.mileage.toFixed(2) + "km",
              oilWear: value.oilWear.toFixed(2),
              timeUsed: this.descriptionTime(this.computedInterval(value.timeUsed * 1000)),
              middleTime: new Date(time).getTime() + 12 * 3600 * 1000,
              list: [],
            });
          }
        }
        for (let value of data.errMsg) {
          let time = new Date(value.startTime).format("yyyy-MM-dd");
          let o = map.get(time);
          value.title = new Date(value.startTime).format("hh:mm") + "-" + new Date(value.endTime).format("hh:mm");
          value.time = this.descriptionTime(this.computedInterval(value.timeUsed * 1000));
          value.mileageWithUnit = value.mileage + "km";
          o.list.push(value);
        }

        if (this.detailList.length > 0) {
          let index = this.detailList.length - 1;
          let lastTime = new Date(this.detailList[index].middleTime).format("yyyy-MM-dd");
          if (map.has(lastTime)) {
            let lastValue = this.detailList.splice(index, 1);
            let o = map.get(lastTime);
            map.set(lastTime, Object.assign(o, lastValue));
          }
        }

        // this.detailList = this.detailList.concat([...map.values()]);
        this.detailList = [...map.values()];
        // 添加今天的前一小时和今天轨迹查询
        let nowaday = new Date().format("M月d日");
        let template = [
          {
            title: "前一小时",
            mileageWithUnit: "",
            special: 1,
          },
          {
            title: "今天",
            mileageWithUnit: "",
            special: 2,
          },
        ];
        if (this.detailList[0] && this.detailList[0].title == nowaday) {
          if (this.detailList[0].list[0].title != "前一小时") {
            Array.prototype.unshift.apply(this.detailList[0].list, template);
          }
        } else {
          this.detailList.unshift({
            title: nowaday,
            mileage: "",
            oilWear: "",
            timeUsed: "",
            middleTime: new Date(new Date().format("yyyy-MM-dd 12:00:00")).getTime(),
            list: template,
          });
        }
        // console.log(this.detailList);
      },
      searchTraveling() {
        //获取用户设备行程
        let data = {
          deviceImei: this.imei,
          // startTime: 0,
          startTime: new Date(this.timeFrom).getTime(),
          endTime: new Date(this.timeTo).getTime(),
          page: this.page.current,
          pageSize: this.page.limit,
          loadAll: true,
        };
        // console.log(data);
        this.isLoading = true;
        loadTraveling(data).then((res) => {
          if (res.errCode == 200) {
            this.isLoading = false;
            for (let i = 0; i < res.data.errMsg.length; i++) {
              res.data.errMsg[i].startAddress = "";
              res.data.errMsg[i].endAddress = "";
            }
            this.dealTripArray(res.data);
          }
        });
      },
      loadAllTravelDetail() {
        // 查找行车总信息
        let data = {
          deviceImei: this.imei,
          queryMode: "0", //0按天  1按周  2按月
          startTime: new Date(this.timeFrom).getTime(),
          endTime: new Date(this.timeTo).getTime(),
        };
        loadAllTravelDetailInfomation(data).then((res) => {
          if (res.errCode == 200) {
            // console.log(res);
            this.detailDeviceListTravel = res.data;
          }
        });
        this.searchTraveling();
      },
      showDevice() {
        //显示设备详情对话框
        this.app.$emit("show-device-dialog", {
          name: "DeviceDialog",
          imei: this.imei,
        });
      },
      dealDevOp(op) {
        //处理设备列表操作
        // console.log(op);
        this.imei = op.imei;
        if (op.idx == 0) {
          this.showDevice();
        } else if (op.idx == 1) {
          if (this.imei) {
            this.isShow = true;
            this.searchTraveling();
            this.getDeviceLocation(op.imei);
            // this.loadAllTravelDetail(op.imei);
          }
        }
      },
      onSelectUser(userId, userName) {
        //选中用户树中用户
        if (userName) {
          this.userName = userName;
        }
        this.userId = userId;
      },
      onSelectDev(device) {
        // console.log(device);
        //选中设备
        this.imei = device.deviceImei;
      },
      onDevList(op) {
        // console.log(op);
        this.devList = op.devList;
        this.imei = op.devList[0].deviceImei;
      },
      listenEvent() {
        this.app.$on("monitor-select-user", this.onSelectUser);
        this.app.$on("monitor-devlist", this.onDevList);
        this.app.$on("monitor-select-dev", this.onSelectDev);
        this.app.$on("monitor-dev-op", this.dealDevOp);
      },
      offEvent() {
        this.app.$off("monitor-devlist", this.onDevList);
        this.app.$off("monitor-select-user", this.onSelectUser);
        this.app.$off("monitor-select-dev", this.onSelectDev);
        this.app.$off("monitor-dev-op", this.dealDevOp);
      },
    },
    mounted() {
      this.loadAllTravelDetail();

      this.listenEvent();
    },
    beforeDestroy() {
      this.offEvent();
    },
  };
</script>

<style scoped lang="scss" scoped>
  ::v-deep .el-input__icon {
    line-height: 36px !important;
  }
  .travel-content {
    .fontWeightBold {
      font-weight: bold;
      line-height: 20px;
      font-size: 16px;
    }
    .error-tip {
      display: inline;
      text-align: center;
      color: red;
      font-size: 12px;
      margin-right: 8px;
    }
    .travel-data-content {
      padding-top: 10px;
      margin-top: 20px;
      border-top: 1px solid #eee;
      height: 100%;
    }
    .travel-head {
      position: relative;
      display: flex;
      align-items: center;
      .right-btn {
        position: absolute;
        right: 10px;
        top: 6px;
      }
    }
    .table-content {
      padding: 10px;
      height: calc(100% - 188px);
    }
    .time-box {
      padding: 0 10px;
    }
    .travel-group {
      .group-content {
        .title {
          height: 30px;
          line-height: 30px;
          // width: 100%;
          // background: #e7f7ff;
          background: #cde4f0;
          // color: #fff;
          padding-left: 10px;
          flex-direction: row;
          display: flex;
          position: relative;
          font-size: 14px;
          span {
            display: inline-block;
            width: 100px;
          }
          .right-btn {
            position: absolute;
            right: 20px;
            cursor: pointer;
            .iconfont {
              color: #6f6f6f;
            }
          }
        }
      }
      .group-item {
        display: flex;
        flex-direction: row;
        // height: 25px;
        line-height: 36px;
        border-bottom: 1px solid #ccc;
        position: relative;
        padding-left: 8px;
        .iconfont {
          vertical-align: middle;
          padding-right: 5px;
        }
        span {
          display: inline-block;
          width: 100px;
        }
        .right-btn1 {
          position: absolute;
          right: 5px;
        }
        .item {
          // padding-left: 10px;
          cursor: pointer;
        }
        .start-address,
        .end-address {
          width: 200px;
          word-break: break-all;
          line-height: 18px;
          div {
            color: #2cabe3;
          }
          a {
            line-height: 36px;
          }
        }
      }
    }
    .group-content > .group-item:last-child {
      border-bottom: none;
    }
    .table-nodata,
    .table-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 400px;
    }
    .showitem {
      display: none !important;
    }
  }
  .form-table-span {
    margin-left: 10px;
  }
</style>
