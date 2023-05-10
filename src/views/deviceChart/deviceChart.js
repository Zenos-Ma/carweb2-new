import echarts from "echarts";
import "@/utils/echarts-wordcloud.min.js";
import model1Json from "@/json/model1.js";
import CalcUtil from "@/utils/calcUtil.js";
import themeJSON from "@/json/purple-passion.json";
// import chinaJson from "echarts/map/json/china.json";
import chinaJson from "@/json/china.json";
import UserSelectDialog from "@/components/UserSelectDialog";
import {
  getUserInfoMation,
  loadDevStatistics,
  loadDevDate,
  loadChildUsers,
  getDeviceDateInfo
} from "@/api/common.js";
export default {
  name: "DeviceChart",
  components: {
    "select-user-dialog": UserSelectDialog
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    chartTheme: "purple-passion",
    chartList: [],
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,
    provinces: {},
    modelTitle: "",
    total: 0
  }),
  methods: {
    selectUserResult(op) {
      // 选择用户展示相关的信息
      this.userId = op.userId;
      this.userName = op.userName;
      window.location.hash = "#/device-chart?userId=" + this.userId;
      for (var i = 0; i < this.chartList.length; i++) {
        this.chartList[i].dispose();
      }
      this.chartList = [];
      this.modelTitle = this.$t("deviceChart.modelTitle").replace(
        "_username_",
        this.userName
      );
      this.initChart();
    },
    changeUser() {
      this.app.$emit("show-select-user-dialog", {
        name: "UserSelect",
        userId: this.userId,
        userName: this.userName
      });
    },
    createMap(id, option, tag, geoJson) {
      echarts.registerMap(tag, geoJson);
      var theChart = echarts.init(document.getElementById(id), this.chartTheme);
      theChart.setOption(option);
      this.chartList.push(theChart);
    },
    createChart(id, option) {
      var theChart = echarts.init(document.getElementById(id), this.chartTheme);
      theChart.setOption(option);
      this.chartList.push(theChart);
    },
    initChart() {
      this.app.$emit("show-progress-page", 0);
      echarts.registerTheme(this.chartTheme, themeJSON);
      this.loadChidDevs();
      this.loadDev();
      this.loadDevStatistics();
      this.loadDeviceStatus();
    },
    loadDevStatistics() {
      var that = this;
      var data = {
        userId: this.userId,
        model: "",
        isContainSub: false,
        startImportTime: parseInt(new Date("2000-01-01").getTime() / 1000),
        endImportTime: parseInt(new Date().getTime() / 1000)
      };
      loadDevStatistics(data).then(res => {
        if (res.errCode == 200) {
          var d = res.data;
          model1Json.op5.series[0].data[0].value = res.data.onlineTotal;
          model1Json.op5.series[0].data[1].value = res.data.offlineTotal;
          that.createChart("model1_chart5", model1Json.op5);
          var data = [
            {
              name: "在线",
              value: res.data.onlineTotal
            },
            {
              name: "离线",
              value: res.data.offlineTotal
            },
            {
              name: "未启用",
              value: d.notEnabledTotal
            },
            {
              name: "已使用",
              value: d.useMonitorDeviceTotal
            },
            {
              name: "欠费",
              value: d.arrearsTotal
            },
            {
              name: "七天内离线",
              value: d.sevendayOfflineTotal
            }
          ];
          model1Json.op7.series[0].data[0].children = data;
          that.createChart("model1_chart7", model1Json.op7);
        }
      });
    },
    loadDev() {
      var that = this;
      var data = {
        userId: this.userId ? this.userId : this.rootUser.userId,
        dispLv: "all",
        tFilt: false,
        tFrom: new Date("2001-01-01").getTime(),
        tTo: new Date().getTime(),
        pageSize: 1000000000,
        page: 1,
        alreadyExpire: 0
      };
      loadDevDate(data).then(res => {
        if (res.errCode == "200" && res.data.devs.length) {
          var data = res.data;
          that.total = data.devs.length;
          var devs = {},
            open = {};
          //设备类型
          for (var i = 0; i < data.devs.length; i++) {
            devs[data.devs[i].devType] =
              devs[data.devs[i].devType] > 0
                ? devs[data.devs[i].devType] + 1
                : 1;
            if (data.devs[i].openTime && data.devs[i].openTime != "--") {
              open[data.devs[i].openTime] =
                open[data.devs[i].openTime] > 0
                  ? open[data.devs[i].openTime] + 1
                  : 1;
            }
          }
          var result = CalcUtil.objToArray(devs);
          result = result.sort(function(a, b) {
            return b.value - a.value;
          });
          model1Json.op4.series[0].data = result;
          that.createChart("model1_chart4", model1Json.op4);
          //设备启用日期统计
          var result1 = CalcUtil.objToArray(open);
          result1 = result1.sort(function(a, b) {
            return new Date(a.name).getTime() - new Date(b.name).getTime();
          });
          var category = [],
            value = [];
          result1.forEach(item => {
            category.push(item.name);
            value.push(item.value);
          });
          model1Json.op6.xAxis.data = category;
          model1Json.op6.series[0].data = value;
          model1Json.op6.visualMap.min = 0;
          model1Json.op6.visualMap.max = result1.sort(function(a, b) {
            return b.value - a.value;
          })[0].value;
          that.createChart("model1_chart6", model1Json.op6);
        }
      });
    },
    loadChidDevs() {
      const data = {
        userId: this.userId,
        page: 1,
        pageSize: 400
      };
      loadChildUsers(data).then(res => {
        if (res.errCode == "200") {
          //用户类型统计
          var data = res.data;
          var xs = {};
          for (let i = 0; i < data.childs.length; i++) {
            xs[data.childs[i].userType] =
              xs[data.childs[i].userType] > 0
                ? xs[data.childs[i].userType] + 1
                : 1;
          }
          var result = CalcUtil.objToArray(xs);
          for (let i = 0; i < result.length; i++) {
            result[i].name = this.$t(
              "common.userTypeList[" +
                (result[i].name ? result[i].name : 0) +
                "].text"
            );
          }
          // console.log(result);
          model1Json.op1.series[0].data = result;
          // console.log(model1Json.op1);
          this.createChart("model1_chart1", model1Json.op1);
          //用户设备数前十排名
          var childs = data.childs
            .sort(function(a, b) {
              return b.dev_cnt - a.dev_cnt;
            })
            .slice(0, 10);
          var category = [];
          var value = [];
          for (var i = 0; i < childs.length; i++) {
            category.push(
              childs[i].userName ? childs[i].userName : childs[i].linkman
            );
            value.push(childs[i].dev_cnt);
          }
          model1Json.op2.yAxis.data = category;
          model1Json.op2.series[0].data = value;
          this.createChart("model1_chart2", model1Json.op2);
        }
      });
    },
    getLocationByLatlng(lat, lng, callback) {
      var geoc = new BMap.Geocoder();
      var pt = new BMap.Point(lng, lat);
      geoc.getLocation(pt, function(rs) {
        if (rs && rs.addressComponents) {
          callback(rs.addressComponents);
        } else {
          callback({
            province: ""
          });
        }
      });
    },
    //统计省份设备分布情况，按顺序获取，递归执行，以免过度请求被百度地图地址解析拦截
    getProvinces(idx, devList, callback) {
      this.app.$emit(
        "show-progress-page",
        ((idx / devList.length) * 100).toFixed(1)
      );
      if (idx < devList.length) {
        var that = this;
        var item = devList[idx];
        if (item.bdlat != 0 && item.bdlng != 0) {
          this.getLocationByLatlng(item.bdlat, item.bdlng, function(res) {
            if (res.province) {
              that.provinces[res.province] =
                that.provinces[res.province] > 0
                  ? that.provinces[res.province] + 1
                  : 1;
            }
            that.$nextTick(() => {
              that.getProvinces(idx + 1, devList, callback);
            });
          });
        } else {
          that.$nextTick(() => {
            that.getProvinces(idx + 1, devList, callback);
          });
        }
      } else {
        callback();
      }
    },
    //处理省份统计结果，画地图
    calcProvince() {
      // console.log(this.provinces);
      var result = CalcUtil.objToArray(this.provinces);
      var i = 0;
      while (i < result.length) {
        result[i].percent = (
          (parseInt(result[i].value) / this.total) *
          100
        ).toFixed(2);
        if (/\w+/.test(result[i].name)) {
          result.splice(i, 1);
          continue;
        } else if (result[i].name.indexOf("省") >= 0) {
          result[i].name = result[i].name.substring(
            0,
            result[i].name.indexOf("省")
          );
        } else if (result[i].name.indexOf("市") >= 0) {
          result[i].name = result[i].name.substring(
            0,
            result[i].name.indexOf("市")
          );
        } else if (result[i].name.indexOf("区") >= 0) {
          result[i].name = result[i].name.substring(0, 2);
        }
        i++;
      }
      result = result.sort(function(a, b) {
        return b.value - a.value;
      });
      // console.log(result);
      model1Json.op3.visualMap.min = 0;
      model1Json.op3.visualMap.max = result[0].value + 5;
      model1Json.op3.series[0].data = result;
      console.log(model1Json.op3);
      this.createMap("model1_chart3", model1Json.op3, "china", chinaJson);
      this.app.$emit("show-progress-page", 100);
    },
    loadDeviceStatus() {
      getDeviceDateInfo({ userId: this.userId }).then(res => {
        if (res.errCode == 200 && res.data.length > 0) {
          this.provinces = {};
          this.getProvinces(0, res.data, this.calcProvince);
        }
      });
    }
  },
  mounted() {
    var that = this;
    document.getElementsByTagName("body")[0].onresize = function() {
      for (var i = 0; i < that.chartList.length; i++) {
        var chart = that.chartList[i];
        chart.resize(chart.getDom().offsetWidth, chart.getDom().offsetHeight);
      }
    };
    if (this.$route.query.userId) {
      this.userId = parseInt(this.$route.query.userId);
      getUserInfoMation({ userId: this.userId }).then(res => {
        if (res.errCode == 200) {
          this.selectUserResult(res.data);
        }
      });
    } else {
      that.selectUserResult(this.rootUser);
    }
  }
};
