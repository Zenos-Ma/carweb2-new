<template>
  <div :class="['warn-list', isShow ? 'max' : 'hide']">
    <!-- 回放轨迹右下角 start -->
    <div class="warn-list-bar" style="display: flex; flex-direction: row">
      <span style="flex: 1; cursor: move" :title="$t('trackTable.moveTip')">{{
        $t("trackTable.trackDetail")
      }}</span>
      <el-button
        class="primary-btn-table-shadow-orange"
        size="small"
        @click="onDownload"
        v-show="isShow"
        style="padding: 5px 12px !important;margin-right:5px"
      >
        {{ $t("trackTable.download") }}
      </el-button>
      <span
        style="cursor: pointer; display: inline-block; margin-right: 0.8rem"
        @click="showHideTrack"
        >{{ $t(isShow ? "trackTable.hide" : "trackTable.show") }}</span
      >
    </div>
    <!-- 回放轨迹右下角 end -->

    <div class="warn-list-table">
      <!-- 回放轨迹表格title start -->
      <table>
        <thead>
          <tr>
            <th style="width: 5rem">{{ $t("trackTable.order") }}</th>
            <th style="width: 14rem">{{ $t("trackTable.time") }}</th>
            <th style="width: 10rem">{{ $t("alarm.longitude") }}</th>
            <th style="width: 10rem">{{ $t("alarm.latitude") }}</th>
            <th style="width: 8rem">{{ $t("alarm.speed") }}</th>
            <th style="width: 10rem">{{ $t("trackTable.direction") }}</th>
            <th style="width: 10rem">
              {{ $t("trackTable.altitude") }}({{ $t("infobox.meter") }})
            </th>
            <th style="width: 12rem">{{ $t("trackTable.accuracyType") }}</th>
            <th style="width: 10rem">{{ $t("trackTable.temperature") }}</th>
            <th style="width: 10rem">两点之间距离(cm)</th>
            <th style="flex: 1">
              {{ $t("common.address") }}
              <button
                class="btn-orange xsmall"
                v-show="isDeng"
                @click="onParseAddress"
              >
                {{ $t("alarm.parseAddress") }}
              </button>
            </th>
            <th></th>
          </tr>
        </thead>
      </table>
      <!-- 回放轨迹表格title end -->

      <div class="table-content">
        <!-- 回放轨迹表格内容 start -->
        <table v-if="!isLoad && trackTableLength > 0" id="trackTable_content">
          <tbody v-html="tableHtml"></tbody>
        </table>
        <!-- 回放轨迹表格内容 end -->

        <!-- 回放轨迹表格提示 start -->
        <div
          style="display: flex;align-items: center;justify-content: center; height: 100%;"
          v-if="!isLoad && trackTableLength == 0"
        >
          {{ $t("common.nodata") }}
        </div>
        <div
          style=" display: flex;align-items: center; justify-content: center; height: 100%;"
          v-if="isLoad"
        >
          {{ $t("common.loading") }}
        </div>
        <!-- 回放轨迹表格提示 end -->
      </div>
    </div>
  </div>
</template>

<script>
import gpsHelper from "@/utils/gpsHelper.js";
var trackTable = [];
var pointList = [];
export default {
  name: "TrackTable",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isLoad: false, //正在加载

    trackTableLength: 0, //轨迹表格

    isLoadNew: false, //是否新一次加载
    isDeng: false,
    tableHtml: ""
  }),
  methods: {
    onDownload() {
      this.app.$emit("playback-download");
    },
    onParseAddress() {
      // console.log("1234");
      this.showAddressByIdx1(0);
    }, //显示轨迹点地址
    showPosition(idx) {
      var that = this;
      if (idx < this.trackTableLength && idx >= 0) {
        var item = trackTable[idx];
        var lng = item.baiduPt.lng,
          lat = item.baiduPt.lat;
        if (
          lng &&
          lat &&
          lat != 0 &&
          lng > -180 &&
          lng <= 180 &&
          lat <= 90 &&
          lat >= -90 &&
          !trackTable[idx].position
        ) {
          this.getPoiLocation(lng, lat, function(address) {
            trackTable[idx].position = address
              ? address
              : that.$t("common.addressFail"); //详细地址结果
            document.querySelector(
              `#trackTable_content>tbody>tr[title='${idx}']>td:last-child`
            ).innerHTML = address;
            // console.log(idx, new Date(trackTable[idx].realTime).format("yyyy-MM-dd hh:mm:ss"), address);

            that.app.$emit("track-table-address", idx, address);
          });
        }
      }
    },
    showHideTrack() {
      //显示隐藏轨迹详情表格
      if (this.isShow) {
        this.$emit("update:isShow", false);
      } else {
        this.$emit("update:isShow", true);
      }

      //延迟判断是否显示，显示就加载停留点地址，隐藏就除去移动高度
      var that = this;
      this.$nextTick(function() {
        if (that.isShow) {
          that.showTrack();
        } else {
          $(".warn-list").css("height", "");
        }
      });
    },
    selectTrackItem(idx) {
      //选中轨迹表格项
      this.app.$emit("track-table-item", idx);
    },
    showTrack() {
      if (this.isLoadNew) {
        var list = trackTable;
        var points = pointList;

        if (list.length > 0) {
          this.showPosition(0); //起点地址显示
          this.showPosition(list.length - 1); //终点地址显示
        }
        //递归显示停留点地址
        if (points && points.length > 0) {
          this.showAddressByIdx(0, points);
        }
      }
    },
    showAddressByIdx(idx, points) {
      if (idx >= 0 && idx < points.length) {
        var that = this;
        this.showPosition(points[idx].idx);
        setTimeout(() => {
          that.showAddressByIdx(idx + 1, points);
        }, 50);
      }
    },
    showAddressByIdx1(idx) {
      if (idx >= 0 && idx < this.trackTableLength) {
        var that = this;
        this.showPosition(idx);
        setTimeout(() => {
          that.showAddressByIdx1(idx + 1, that.trackTableLength);
        }, 50);
      }
    },
    showTrackAddress() {
      this.isLoadNew = true;
      this.showTrack();
    },
    getaCcuracyType(num) {
      var list = this.$t("trackTable.accuracyTypeList");
      // console.log(list);
      var str = "";
      for (var i = 0; i < list.length; i++) {
        if (list[i].name == num) {
          return str + list[i].text;
        }
      }
      return "";
    },
    getAltitude(op, num) {
      // console.log(op, num);
      // 判断精度类型，海拔高度的显示
      switch (num) {
        case "0":
        case "-1":
          return this.$t("trackTable.nodata");
        case "1":
        case "2":
        case "4":
        case "5":
        case "6":
          return op.altitude;
        default:
          return 0;
      }
    },
    getTableHTML() {
      //生成表格html并添加动作
      var that = this;
      var html = [];
      // console.log(trackTable);
      //倒序轨迹显示
      for (let i = trackTable.length - 1; i >= 0; i--) {
        let item = trackTable[i];
        let latlngDistance;
        if (i > 0) {
          latlngDistance = gpsHelper
            .distance(
              trackTable[i - 1].realPt.lat,
              trackTable[i - 1].realPt.lng,
              trackTable[i].realPt.lat,
              trackTable[i].realPt.lng
            )
            .toFixed(2);
          latlngDistance = this.signFigures(latlngDistance * 100);
        }
        item.accuracyType1 = that.getaCcuracyType(item.accuracyType);
        item.altitude = that.getAltitude(item, item.accuracyType);
        html.push(`<tr title="${i}">
        <td style="width:5rem" title="${i}">${i + 1}</td>
        <td style="width:14rem" title="${i}">${new Date(item.realTime).format(
          "yyyy-MM-dd hh:mm:ss"
        )}</td>
        <td style="width:10rem" title="${i}">${item.realPt.lng.toFixed(6)}</td>
        <td style="width:10rem" title="${i}">${item.realPt.lat.toFixed(6)}</td>
        <td style="width:8rem" title="${i}">${item.speed}</td>
        <td style="width:10rem" title="${i}">${item.course}</td>
        <td style="width:10rem" title="${i}">${item.altitude}</td>
        <td style="width:12rem" title="${i}">${item.accuracyType1}</td>
        <td style="width:10rem" title="${i}">${
          item.temperature ? item.temperature : "--"
        }</td>
        <td style="width:10rem" title="${i}">${
          latlngDistance ? latlngDistance : "--"
        }</td>
        <td style="flex:1" >${
          item.position
            ? item.position
            : '<a title="' + i + '">' + this.$t("warnList.viewAddress") + "</a>"
        }</td>
        </tr>`);
      }
      this.tableHtml = html.join(" ");
      setTimeout(() => {
        var addressA = document.querySelectorAll(
          "#trackTable_content>tbody>tr a"
        );
        for (var k = 0; k < addressA.length; k++) {
          addressA[k].onclick = function() {
            that.showPosition(this.title);
          };
        }

        var trackItem = document.querySelectorAll(
          "#trackTable_content>tbody>tr>td[title]"
        );
        for (var j = 0; j < trackItem.length; j++) {
          trackItem[j].onclick = function() {
            that.selectTrackItem(this.title);
          };
        }
        // that.showTrack();
      }, 100);
    },
    loadTrackTable(list, points) {
      // console.log(list);
      //加载新轨迹数据和停留点
      this.isLoadNew = false;
      var that = this;
      setTimeout(function() {
        that.isLoadNew = true;
        trackTable = list;
        that.trackTableLength = list.length;
        pointList = points;
        that.getTableHTML();
      }, 100);
    },
    listenEvent() {
      this.app.$on("track-table-stay", this.showTrackAddress);
      this.app.$on("track-table-data", this.loadTrackTable);
    },
    offEvent() {
      this.app.$off("track-table-stay", this.showTrackAddress);
      this.app.$off("track-table-data", this.loadTrackTable);
    },
    moveTable() {
      var that = this;
      //轨迹表格栏操作
      $(".warn-list-bar>span:first-child").mousedown(function() {
        if (!that.isShow) {
          //若未展开轨迹表格，展开表格
          that.$emit("update:isShow", true);
          return;
        }
        var model = $(this)
          .parent()
          .parent(); //轨迹表格
        $("#moving_page").show();

        function m(e) {
          //长按蒙板
          if ($("#moving_page").is(":visible")) {
            //判断拖动蒙板是否显示，若显示才进行拖动操作
            var yy = $("#moving_page").height() - e.pageY;
            if (yy < 200) {
              yy = 200;
            } else if (yy > $("#moving_page").height() - 80) {
              yy = $("#moving_page").height() - 80;
            }

            $(model).css("height", yy + "px"); //调整轨迹表格高度
          }
        }

        function mm() {
          //取消长按
          if ($("#moving_page").is(":visible")) {
            //判断拖动蒙板是否显示，若显示则取消蒙板动作和隐藏蒙板
            $("#moving_page").hide();
            $("#moving_page").off({
              mousemove: m
            });
          }
        }
        $("#moving_page").on({
          mousemove: m,
          mouseup: mm
        });
      });
    },

    initPermission() {
      //判断是否是邓总指定用户显示一键解析所有的轨迹点
      if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
        var users = [
          5186,
          6549,
          7850,
          7037,
          2475,
          8167,
          8168,
          8169,
          8170,
          8171,
          8172,
          8173,
          238
        ];
        for (var i = 0; i < users.length; i++) {
          if (this.rootUser.userId == users[i]) {
            this.isDeng = true;
            break;
          }
        }
      } else {
        this.isDeng = false;
      }
    }
  },
  mounted() {
    this.listenEvent();
    this.moveTable();
    this.initPermission();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>
