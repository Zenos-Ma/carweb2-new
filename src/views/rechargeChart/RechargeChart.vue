<template>
  <section style class="recharge-chart-bg">
    <div
      class="recharge-chart-card"
      style="position:absolute;width:50%;height:50%;"
    >
      <div class="chart-card-header">{{ $t("rechargeChart.chart1") }}</div>
      <div
        class="chart-card-content"
        id="recharge-chart1"
        style=" background-image: linear-gradient(to bottom right,transparent,rgba(255,255,255,0.8));"
      ></div>
    </div>
    <div
      class="recharge-chart-card"
      style="position:absolute;width:50%;height:50%;top:50%;"
    >
      <div class="chart-card-header1">{{ $t("rechargeChart.chart2") }}</div>
      <div class="chart-card-content" id="recharge-chart2"></div>
    </div>
    <div
      class="recharge-chart-card"
      style="position:absolute;width:50%;height:50%;left:50%;"
    >
      <div class="chart-card-content" id="recharge-chart3"></div>
      <div class="chart-card-header">{{ $t("rechargeChart.chart3") }}</div>
    </div>
    <div
      class="recharge-chart-card"
      style="position:absolute;width:50%;height:50%;top:50%;left:50%;"
    >
      <div
        class="chart-card-content"
        id="recharge-chart4"
        style=" background-image: linear-gradient(to top left,transparent,rgba(255,255,255,0.8));"
      ></div>
      <div class="chart-card-header1">{{ $t("rechargeChart.chart4") }}</div>
    </div>
    <div
      class="recharge-chart-title"
      @click="isShowTimeRange = true"
      :title="$t('rechargeBill.timeRangeTip')"
    >
      <div class="recharge-chart-caption">
        {{ new Date(startTime).format("yyyy年MM月dd日") }}-{{
          new Date(endTime).format("yyyy年MM月dd日")
        }}
      </div>
      {{ $t("rechargeChart.title") }}
    </div>

    <dialog-comp
      :visible.sync="isShowTimeRange"
      :dialog-title="$t('rechargeBill.timeRangeTip')"
      :dialog-width="300"
    >
      <div style="padding:1rem;">
        <table class="form-table">
          <tr>
            <td>{{ $t("common.startTime") }}</td>
            <td>
              <!-- <date-picker :date.sync="startTime"></date-picker> -->
              <el-date-picker
                v-model="startTime"
                type="date"
                format="yyyy-MM-dd"
                style="width: 160px"
              ></el-date-picker>
            </td>
          </tr>
          <tr>
            <td>{{ $t("common.endTime") }}</td>
            <td>
              <!-- <date-picker :date.sync="endTime"></date-picker> -->
              <el-date-picker
                v-model="endTime"
                type="date"
                format="yyyy-MM-dd"
                style="width: 160px"
              ></el-date-picker>
            </td>
          </tr>
        </table>

        <div style="text-align:center">
          <el-button type="primary" size="small" @click="changeRange">{{
            $t("common.ok")
          }}</el-button>
          <el-button
            type="info"
            size="small"
            @click="isShowTimeRange = false"
            >{{ $t("common.cancel") }}</el-button
          >
        </div>
      </div>
    </dialog-comp>
  </section>
</template>
<script>
import echarts from "echarts";
// import "echarts-wordcloud";
import "@/utils/echarts-wordcloud.min.js";
import themeJSON from "@/json/roma.json";
import CalcUtil from "@/utils/calcUtil.js";
import modelJson from "@/json/recharge.js";
import { loadProfitListInfo } from "@/api/recharge";
export default {
  name: "RechargeChart",
  data: () => ({
    isShowTimeRange: false,
    langType: window.localStorage.getItem("langType"),
    profitList: [],
    chartList: [],
    chartTheme: "roma",
    startTime: new Date().format("yyyy-01-01"),
    endTime: new Date().format("yyyy-MM-dd")
  }),

  methods: {
    //改变时间范围，重新获取数据与绘图
    changeRange() {
      this.isShowTimeRange = false;

      for (var i = 0; i < this.chartList.length; i++) {
        this.chartList[i].dispose();
      }
      this.chartList = [];

      this.initChart();
    },
    createChart(id, option) {
      var theChart = echarts.init(document.getElementById(id), this.chartTheme);
      theChart.setOption(option);
      this.chartList.push(theChart);
    },
    //付款方式统计饼图
    sumPayway() {
      var list = {};
      for (var i = 0; i < this.profitList.length; i++) {
        // console.log(list[this.profitList[i].pay] + 1);
        list[this.profitList[i].pay] =
          list[this.profitList[i].pay] > 0
            ? list[this.profitList[i].pay] + 1
            : 1;
      }
      // console.log(list);
      var result = CalcUtil.objToArray(list);
      modelJson.op1.series[0].data = result;
      this.createChart("recharge-chart1", modelJson.op1);
    },
    //经销商充值次数统计条形图
    sumSeller() {
      var list = {};
      for (let i = 0; i < this.profitList.length; i++) {
        list[this.profitList[i].userName] =
          list[this.profitList[i].userName] > 0
            ? list[this.profitList[i].userName] + 1
            : 1;
      }
      var result = CalcUtil.objToArray(list);
      result = result.sort(function(a, b) {
        return b.value - a.value;
      });
      result = result.slice(0, 10);
      var name = [],
        value = [];
      for (let i = 0; i < result.length; i++) {
        name.push(result[i].name);
        value.push(result[i].value);
      }
      modelJson.op2.xAxis.data = name;
      modelJson.op2.series[0].data = value;
      this.createChart("recharge-chart2", modelJson.op2);
    },
    //解析付款方式
    status_cn(item) {
      switch (item.payWay) {
        case 1:
          return this.$t("recharge.alipay");

        case 2:
          return this.$t("recharge.wechat");

        default:
          return this.$t("recharge.other");
      }
    },
    //套餐统计云字符图
    sumGoods() {
      var list = {};
      for (var i = 0; i < this.profitList.length; i++) {
        list[this.profitList[i].goodsName] =
          list[this.profitList[i].goodsName] > 0
            ? list[this.profitList[i].goodsName] + 1
            : 1;
      }
      var result = CalcUtil.objToArray(list);
      modelJson.op3.series[0].data = result;
      this.createChart("recharge-chart3", modelJson.op3);
    },
    //下单日期次数折线图
    sumOrderTime() {
      var list = [];
      for (let i = 0; i < this.profitList.length; i++) {
        let n = new Date(this.profitList[i].createTime).format("yyyy-MM-dd");
        list[n] = list[n] > 0 ? list[n] + 1 : 1;
      }
      var result = CalcUtil.objToArray(list);
      result = result.sort(function(a, b) {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
      });
      var name = [],
        value = [],
        max = 0;
      for (let i = 0; i < result.length; i++) {
        name.push(result[i].name);
        value.push(result[i].value);
        if (result[i].value > max) {
          max = result[i].value;
        }
      }
      modelJson.op4.xAxis.data = name;
      modelJson.op4.visualMap.max = max;
      modelJson.op4.series[0].data = value;
      this.createChart("recharge-chart4", modelJson.op4);
    },
    //获取订单数据
    loadRecharge() {
      var that = this;
      document.getElementById("loading_page").style.display = "flex";
      const data = {
        page: 1,
        pageSize: 1000000000,
        errOnly: false,
        from: new Date(this.startTime + " 00:00:00").getTime(),
        to: new Date(this.endTime + " 23:59:59").getTime()
      };
      loadProfitListInfo(data).then(res => {
        if (res.errCode == "200" && res.data.list.length > 0) {
          var list = res.data.list;
          for (var i = 0; i < list.length; i++) {
            list[i].pay = that.status_cn(list[i]);
          }
          that.profitList = list;

          that.sumSeller();
          that.sumPayway();
          that.sumOrderTime();
          that.sumGoods();
        } else {
          that.app.$emit("show-alert-msg", that.$t("common.nodata"));
        }
        document.getElementById("loading_page").style.display = "none";
      });
    },
    initChart() {
      echarts.registerTheme(this.chartTheme, themeJSON);
      this.loadRecharge();
    }
  },
  mounted() {
    this.initChart();
    var that = this;
    document.getElementsByTagName("body")[0].onresize = function() {
      for (var i = 0; i < that.chartList.length; i++) {
        var chart = that.chartList[i];
        chart.resize(chart.getDom().offsetWidth, chart.getDom().offsetHeight);
      }
    };
  }
};
</script>
<style lang="scss" scoped>
$imgPath: "~@/assets/img/";
.recharge-chart-bg {
  height: 100%;
  width: 100%;
  background-image: url($imgPath+"bg/model3-bg-1.jpg");
  background-size: 100%;
}
.recharge-chart-title {
  cursor: pointer;
  display: inline-block;
  line-height: 8rem;
  height: 10rem;
  letter-spacing: 1rem;
  color: white;
  font-size: 4rem;
  text-align: center;
  position: absolute;
  width: 40rem;
  left: calc(50% - 20rem);

  z-index: 8;
  top: calc(50% - 5rem);

  background: #ffcc00;
  box-shadow: 0 0 1rem gray;
  .recharge-chart-caption {
    font-size: 2rem;
    line-height: 2rem;
    letter-spacing: 0;
  }
}
.recharge-chart-card {
  display: inline-flex;
  flex-direction: row;
  overflow: hidden;
  .chart-card-header {
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    width: 3rem;
    height: calc(100% - 2rem);
    font-size: 3rem;
    padding: 2rem 1rem 0 1rem;
    writing-mode: horizontal-tb;
    color: white;
    word-wrap: break-word;
    text-shadow: 0 0 0.4rem dodgerblue;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.8) 30%,
      transparent
    );
  }
  .chart-card-header1 {
    @extend .chart-card-header;
    align-items: flex-end;
    padding: 0 1rem 2rem 1rem;
    background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.8) 30%,
      transparent
    );
  }
  .chart-card-content {
    width: calc(100% - 3rem);
    overflow: hidden;
    height: 100%;
  }
}
</style>
