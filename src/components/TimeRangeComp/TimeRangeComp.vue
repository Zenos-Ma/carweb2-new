<template>
  <div class="result-box" v-show="isShow" style="width: 360px; height: 200px; overflow: hidden">
    <ul class="select-tabs" style="line-height: 30px; padding: 0 16px; display: flex">
      <li :class="[currentRange == 'week' ? 'active' : '']" @click="currentRange = 'week'" style="flex: 1; text-align: center">{{ $t("datePicker.week") }}</li>
      <li :class="[currentRange == 'month' ? 'active' : '']" @click="currentRange = 'month'" style="flex: 1; text-align: center">{{ $t("datePicker.month") }}</li>
    </ul>
    <!--month-->
    <div class="time-range-body" v-show="currentRange == 'month'">
      <button :class="['time-range-item', selectMonth == item ? 'active' : '']" style="min-width: 30%" @click="selectMonth = item" v-for="(item, idx) in monthList" :key="'month' + idx">
        {{ item }}
      </button>
    </div>
    <!--week-->
    <div class="time-range-body" v-show="currentRange == 'week'">
      <button :class="['time-range-item', selectWeek == item ? 'active' : '']" style="width: calc(50% - 10px)" @click="selectWeek = item" v-for="(item, idx) in weekList" :key="'week' + idx">
        {{ item }}
      </button>
    </div>

    <span style="position: absolute; right: 0; bottom: 0">
      <el-button type="primary" size="small" @click="selectRangeResult">{{ $t("common.ok") }}</el-button>
      <el-button type="warning" size="small" @click="closeBox">{{ $t("common.close") }}</el-button>
    </span>
  </div>
</template>
<script>
  export default {
    name: "TimeRangeComp",
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      currentRange: "month",
      monthList: [],
      selectMonth: "",
      weekList: [],
      selectWeek: "",
      dateStart: new Date().format("yyyy-MM-dd"),
      dateEnd: new Date().format("yyyy-MM-dd"),
      timeStart: new Date().format("yyyy-MM-dd hh:00"),
      timeEnd: new Date().format("yyyy-MM-dd hh:00"),
      lastTime: 0,
      isDateOver: false,
      isDateBefore: false,
      isDateLast: false,
    }),
    watch: {
      isShow() {
        if (this.isShow) {
          this.app.$emit("close-datetime-picker");
          this.app.$emit("close-date-picker");
        }
      },
    },
    methods: {
      closeBox() {
        this.$emit("update:isShow", false);
      },
      selectRangeResult() {
        var start = 0;
        var end = 0;
        if (this.selectMonth || this.selectWeek) {
          switch (this.currentRange) {
            case "month":
              start = new Date(this.selectMonth).getTime();
              if (start < this.lastTime) {
                start = this.lastTime;
              }
              var temp = new Date(new Date(this.selectMonth).getTime() + 31 * 24 * 3600000);
              end = new Date(temp.getFullYear() + "-" + (temp.getMonth() + 1)).getTime() - 1000;

              break;
            case "week":
              {
                let temp = this.selectWeek.split("~");
                start = new Date(temp[0] + " 00:00:00").getTime();
                end = new Date(temp[1] + " 23:59:59").getTime();
              }
              break;
          }

          this.$emit("select-range", {
            range: this.currentRange,
            startTime: start,
            endTime: end,
            startTimeFormat: new Date(start).format("yyyy-MM-dd hh:mm"),
            endTimeFormat: new Date(end).format("yyyy-MM-dd hh:mm"),
          });
          this.closeBox();
        } else {
          this.app.$emit("show-alert-msg", this.$t("datePicker.timeRangeTip"));
        }
      },
      //初始化 半年内月份 和 半年内的周
      initTime() {
        var m = new Date(new Date().getTime() - 180 * 24 * 3600000);
        this.lastTime = new Date(m.getFullYear() + "-" + (m.getMonth() + 1) + "-" + new Date().getDate()).getTime();

        var current = new Date();

        var time = current.getTime();
        var year = current.getFullYear();
        var month = current.getMonth() + 1;
        //获取月份列表
        for (let i = month; i >= month - 6; i--) {
          if (i >= 1) {
            this.monthList.push(year + "-" + i);
          } else {
            this.monthList.push(year - 1 + "-" + (i + 12));
          }
        }

        //获取周列表
        var week = current.getDay() - 1;
        week = week > 0 ? week : week + 7;

        this.weekList.push(new Date(time - week * 24 * 3600000).format("yyyy-MM-dd") + "~" + new Date().format("yyyy-MM-dd"));
        var after = new Date(time - (week + 1) * 24 * 3600000);
        for (let i = 1; i <= Math.floor(180 / 7); i++) {
          var before = after - 6 * 24 * 3600000;
          this.weekList.push(new Date(before).format("yyyy-MM-dd") + "~" + new Date(after).format("yyyy-MM-dd"));
          after = before - 24 * 3600000;
        }
      },
    },
    mounted() {
      this.initTime();
    },
  };
</script>
<style lang="scss" scoped>
  .time-range-body {
    height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;
    white-space: normal;
  }
  .error-tip {
    text-align: center;
    color: red;
    font-size: 12px;
  }
  button.time-range-item {
    color: #8a8a8a;
    background: #f3f3f3;
    border-radius: 4px;
    height: 24px;
    border: none;
    margin: 4px;
    cursor: pointer;

    text-align: center;
    outline: none;
  }
  button.time-range-item.active {
    color: rgb(56, 141, 234);
    background-color: #d9edf6;
  }
</style>
