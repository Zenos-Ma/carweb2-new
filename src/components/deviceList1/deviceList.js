import mapUtil from "@/utils/mapUtil.js";
import CalcUtil from "@/utils/calcUtil.js";
import { doDeviceActive } from "@/api/common.js";
import { searchDevInfo, loadDeviceImeiList } from "@/api/monitor.js";
export default {
  name: "DeviceList",
  components: {},
  props: {
    btnType: {
      //设备列表按钮类型
      type: Number,
      default: 0
    },
    deviceImei: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isLoad: false, //是否加载数据中
    isSearch: false, //是否当前处于搜索设备列表
    currentTab: 1, //当前设备分类
    currentDev: 0, //当前设备index
    searchKey: "", //搜索关键词
    devList: [], //设备列表
    originList: "[]", //设备列表
    page: {
      //分页器参数

      name: "deviceList",
      limit: 20,
      num: 1,
      current: 1,
      total: 0
    },
    devKinds: {
      //设备分类统计
      all: 0,
      online: 0,
      offline: 0
    },
    isLoadMore: false, //下拉加载更多
    selectOrder: "time", //排序方式 time=>时间排序  name=>名称排序
    currentOrder: "down", //排序顺序 up从小到大  time从大到小
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    isFirst: true, //是否第一次加载,isRefresh: false,mapName: ""
    hasMore: false,
    showLoading: false,
    isLoading: false,
    _scrollHeight: "",
    isShowLoding: false,
    mapType: "a-map",
    isflowExpireTime: false,
    isplatformExpireTime: false
  }),
  watch: {
    //改变排序类型
    selectOrder() {
      this.doSort();
    }, //改变排序顺序
    currentOrder() {
      this.doSort();
    }, //输入搜索关键字
    searchKey() {
      if (!this.searchKey) {
        //搜索框为空切换回设备列表
        this.isSearch = false;
        this.devList = JSON.parse(this.originList);
        this.$emit("devlist", {
          devList: this.devList,
          pager: this.page
        });
      }
    }, //当前传入的设备号
    deviceImei() {
      var tag = true;

      for (var i = 0; i < this.devList.length; i++) {
        if (this.deviceImei == this.devList[i].deviceImei) {
          this.onSelectDev(this.devList[i]);
          tag = false;
          break;
        }
      }
      if (tag) {
        this.currentDev = 0;
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadDeviceList();
    },
    dealDeviceActive(item) {
      let str = this.$t("customer.deviceActive");
      this.app.$emit(
        "show-confirm-msg",
        str.replace("_device_", item.deviceImei),
        () => {
          // console.log("dad");
          doDeviceActive({ deviceImei: item.deviceImei }).then(res => {
            if (res.errCode == 200) {
              // console.log(res);
              if (this.searchKey) {
                this.searchDevice();
              } else {
                this.loadDeviceList();
              }
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceActiveTip")
              );
            } else {
              this.app.$emit(
                "show-alert-msg",
                this.$t("customer.deviceImeiActiced")
              );
            }
          });
        }
      );
      //
    },
    doSort() {
      //设备列表数据排序
      if (
        this.devList.length > 0 &&
        this.selectOrder == "time" &&
        this.currentOrder == "down"
      ) {
        //按时间从大到小排序 最近更新的设备在前 默认
        this.devList = this.devList.sort(function(a, b) {
          if (a.stsNum == 2 && a.stsNum == b.stsNum) {
            //静止 对比定位时间
            return b.locateTime - a.locateTime;
          } else if (a.stsNum == b.stsNum) {
            //相同状态 对比信号时间
            return b.signalTime - a.signalTime;
          } else {
            //非相同状态 对比状态
            return a.stsNum - b.stsNum;
          }
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "name" &&
        this.currentOrder == "down"
      ) {
        //按名称从小到大 0-9a-Z中文
        this.devList = this.devList.sort(function(a, b) {
          // return CalcUtil.sortStr(a.name, b.name);
          let item1 = a.name;
          let item2 = b.name;
          return item1.localeCompare(item2);
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "time" &&
        this.currentOrder == "up"
      ) {
        //按时间从小到大排序
        this.devList = this.devList.sort(function(a, b) {
          if (a.stsNum == 2 && a.stsNum == b.stsNum) {
            //静止 对比定位时间
            return a.locateTime - b.locateTime;
          } else if (a.stsNum == b.stsNum) {
            //相同状态 对比信号时间
            return a.signalTime - b.signalTime;
          } else {
            //非相同状态 对比状态
            return a.stsNum - b.stsNum;
          }
        });
      } else if (
        this.devList.length > 0 &&
        this.selectOrder == "name" &&
        this.currentOrder == "up"
      ) {
        //按名称从大到小 中文Z-a9-0
        this.devList = this.devList.sort(function(a, b) {
          // return CalcUtil.sortStr(b.name, a.name);
          let item1 = a.name;
          let item2 = b.name;
          return item2.localeCompare(item1);
        });
      }
      this.originList = JSON.stringify(this.devList);
    },
    /**
     * 设备操作
     * @param{设备id} imei
     * @param{设备项索引} idx
     */
    doBtn(idx, imei) {
      this.$emit("do-dev-op", {
        idx: idx,
        btnType: this.btnType,
        imei: imei
      });
    },
    /**
     * 改变当前设备列表状态
     * @param{设备状态} idx
     * 1 =》all， 2 =》online  ，3=》offline
     */
    changeCurrentTab(idx) {
      this.currentTab = idx;
      this.page.current = 1;
      this.page.limit = 20;
      this.isLoadMore = false;
      this.isShowLoading = false;
      this.selectOrder = "time";
      this.currentOrder = "down";
      this.devList = [];
      this.loadDeviceList();
    },
    searchDevice() {
      //搜索设备
      var that = this;
      if (this.searchKey) {
        if (this.getStrLen1(this.searchKey) >= this.imeiLen) {
          this.isSearch = true;
          this.isLoadMore = false;
          this.isLoad = true;
          const data = {
            userId: this.userId ? this.userId : this.rootUser.userId,
            key: this.searchKey
          };
          searchDevInfo(data).then(res => {
            if (res.errCode == "200") {
              that.devList = res.data;
              //加载搜索设备到地图上
              that.$emit("devlist", {
                devList: that.devList,
                pager: that.page
              });
            } else {
              that.devList = [];
            }
            that.isLoad = false;
          });
        } else {
          this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip"));
        }
      } else {
        //取消搜索，回到原来的设备列表
        this.isSearch = false;
        this.devList = JSON.parse(this.originList);
        //将原来的设备列表加载到地图上
        this.$emit("devlist", {
          devList: this.devList,
          pager: this.page
        });
      }
    }, //解析设备状态 传入时间差
    getSts: mapUtil.cnStatus1,
    getStsClass(item) {
      // console.log(item);
      //设备状态颜色 item=》设备数据
      var color = ["gray", "green", "blue", "gray", "gray", "gray"];
      if (item.stsNum) {
        return color[item.stsNum] ? color[item.stsNum] : "";
      } else {
        return "";
      }
    },
    onUpdateDevice(option) {
      //选中设备后，option=》每隔十秒更新设备信息
      // console.log(option);
      if (
        this.devList.length > 0 &&
        option &&
        this.deviceImei == option.deviceImei
      ) {
        for (var i = 0; i < this.devList.length; i++) {
          if (this.devList[i].deviceImei == option.deviceImei) {
            //如果更新的设备在设备列表才更新设备信息
            var device = {
              bdlat: option.location.bdlat,
              bdlng: option.location.bdlng,
              course: option.info.course,
              deviceImei: option.deviceImei,
              icon: option.info.icon,
              lat: option.location.lat,
              lng: option.location.lon,
              locateTime: option.info.locateTime,
              name: option.info.name,
              signalTime: option.info.signalTime,
              sts: option.info.sts,
              stsNum: option.info.stsNum,
              flowExpire: option.info.flowExpire,
              platExpire: option.info.platExpire,
              flowFlag: option.info.flowFlag,
              enableSts: option.info.enableSts,
              enableDate: option.info.enableDate,
              voltage: option.info.voltage,
              electricity: option.info.electricity,
              stsIcon: option.info.stsIcon,
              stsSelectIcon: option.info.stsSelectIcon,
              speed: option.info.speed
            };

            var flow, plat;
            var flag = false;
            var flag1 = false;
            // console.log(this.minExpireTime);
            plat = this.judgmentTheTime(device.platExpire);
            if (device.flowFlag && device.flowExpire) {
              flow = this.judgmentTheTime(device.flowExpire);
              if (flow < plat && flow < 0) {
                flag = true;
                device.isflowExpireTime = flag;
              } else if (flow < plat && flow > 0 && flow < this.minExpireTime) {
                device.flowTime = flow;
              }
            }
            if (plat < 0) {
              if (device.flowExpire) {
                if (plat < flow) {
                  flag1 = true;
                  device.isplatformExpireTime = flag1;
                  // return;
                }
              } else {
                flag1 = true;
                device.isplatformExpireTime = flag1;
              }
            } else if (plat > 0 && this.minExpireTime > plat) {
              if (!device.isflowExpireTime) {
                device.platTime = plat;
              }
            }
            // console.log(device);
            this.currentDev = option.deviceImei;
            this.$nextTick(() => {
              this.devList.splice(i, 1, device);
            });
            break;
          }
        }
      }
    },

    loadDeviceList() {
      //加载设备列表
      var that = this;
      //设备状态类型
      var action =
        this.currentTab == 1
          ? "all"
          : this.currentTab == 2
          ? "online"
          : "offline";
      if (!this.isLoadMore && !this.isRefresh) {
        that.isLoad = true;
      }

      const data = {
        userId: this.userId ? this.userId : this.rootUser.userId,
        page: this.page.current,
        pageSize: this.page.limit,
        actionType: action
      };
      loadDeviceImeiList(data).then(res => {
        that.isLoad = false;
        if (res.errCode == "200") {
          that.devList = res.data.devList;
          // 判断显示流量或者平台到期
          that.devList.forEach(item => {
            var flow, plat;
            var flag = false;
            var flag1 = false;
            // (minExpireTime = 30)
            plat = that.judgmentTheTime(item.platformExpire);
            if (item.flowFlag && item.flowExpire) {
              flow = that.judgmentTheTime(item.flowExpire);
              if (flow < plat && flow < 0) {
                flag = true;
                item.isflowExpireTime = flag;
              } else if (flow < plat && flow > 0 && flow < that.minExpireTime) {
                item.flowTime = flow;
              }
            }

            // console.log(plat);
            if (plat < 0) {
              // console.log(plat);
              if (item.flowExpire) {
                if (plat < flow) {
                  flag1 = true;
                  item.isplatformExpireTime = flag1;
                }
              } else {
                // console.log("3214");
                flag1 = true;
                item.isplatformExpireTime = flag1;
              }
            } else if (plat > 0 && that.minExpireTime > plat) {
              if (!item.isflowExpireTime) {
                item.platTime = plat;
              }
            }
          });
          that.doSort();
          //设备类型分类的数量
          that.devKinds.all = res.data.allCount;
          that.devKinds.offline = res.data.offlineCount;
          that.devKinds.online = res.data.onlineCount;
          //分页器设置
          if (that.currentTab == 1) {
            //全部
            that.page.total = res.data.allCount;
            that.page.num = Math.ceil(that.devKinds.all / that.page.limit);
          } else if (that.currentTab == 2) {
            that.page.total = res.data.onlineCount;
            that.page.num = Math.ceil(that.devKinds.online / that.page.limit);
          } else {
            that.page.total = res.data.offlineCount;
            that.page.num = Math.ceil(that.devKinds.offline / that.page.limit);
          }
          if (that.devList.length > 0) {
            if (!that.isRefresh) {
              //加载设备到地图上
              for (let i = 0; i < that.devList.length; i++) {
                mapUtil.disposeDeviceIcon(that.devList[i], false);
              }
              that.$emit("devlist", {
                devList: res.data.devList,
                pager: that.page
              });
              //非第一次加载，且已有选中设备
              if (!that.isFirst && that.currentDev) {
                for (var i = 0; i < that.devList.length; i++) {
                  if (that.currentDev == that.devList[i].deviceImei) {
                    mapUtil.disposeDeviceIcon(that.devList[i], false);
                    that.onSelectDev(that.devList[i]);
                    break;
                  }
                }
              }
              that.isFirst = false;
            } else {
              //更新地图上的所有设备
              for (let i = 0; i < that.devList.length; i++) {
                var item = that.devList[i];
                // 2021-6-15 根据地图的类型不同传过去不同的坐标系 start
                var lat, lng;
                // if (that.mapType == "baidu-map") {
                //   lat = item.bdlat;
                //   lng = item.bdlng;
                // } else {
                lat = Number(item.lat.toFixed(6));
                lng = Number(item.lng.toFixed(6));
                // if (that.deviceImei == that.devList[i].deviceImei) {
                //   mapUtil.disposeDeviceIcon(item, true);
                //   item.iconTag = true;
                // } else {
                //   mapUtil.disposeDeviceIcon(item, false);
                //   item.iconTag = false;
                // }
                // }
                // end
                mapUtil.disposeDeviceIcon(that.devList[i], false);
                that.app.$emit("map-operation", {
                  mapName: "homepage",
                  action: "move-the-marker",
                  lat: lat,
                  lng: lng,
                  title: item.deviceImei,
                  rotation: item.course,
                  // icon: mapUtil.getMarkerIcon(item),
                  icon: item.iconPath,
                  iconTag: item.iconTag
                });
              }
              that.isRefresh = false;
            }
          } else {
            // console.log("dadsdda");
            that.app.$emit("map-operation", {
              mapName: "homepage",
              action: "clear-map"
            });
            that.app.$emit("reset-the-device");
          }
        }
      });
    }, //选择设备列表中的设备

    onSelectDev(device) {
      // console.log(device);
      if (this.devList.length > 0) {
        this.currentDev = device.deviceImei;
        mapUtil.disposeDeviceIcon(device, false);
        this.$emit("select-dev", device);
      }

      // this.getTheListOption(device);
    },
    // 2021-6-11
    getTheListOption(device) {
      // 选中左栏相应显示li   .replace('(','').replace(')','')
      this.$nextTick(() => {
        var deviceList = document.querySelector(".device-list");
        var listItem = deviceList.childNodes;
        // console.log(listItem.length);
        const scrollHeight = deviceList.scrollHeight;
        const scrollTop = deviceList.scrollTop; //当前滚动位置
        const clientHeight = deviceList.clientHeight;
        // console.log(listItem);
        for (let i = 0; i < listItem.length; i++) {
          // let item = listItem[i].children[0].children[1].children[0].innerText.replace("(", "").replace(")", "");
          let item = listItem[
            i
          ].children[0].children[0].children[1].children[0].innerText
            .replace("(", "")
            .replace(")", "");
          if (item == device.deviceImei) {
            // console.log(listItem[10].offsetTop);
            let top = listItem[i].offsetTop;
            if (top > clientHeight || scrollTop > clientHeight) {
              // console.log("123");
              let n = 50; //滑动次数
              let t = 500 / n; // 每次滚动时间
              let targetTop = top - 100; //目标位置
              let s = (targetTop - scrollTop) / n;
              let j = 0;
              let timer = setInterval(() => {
                if (j == n) {
                  clearInterval(timer);
                  return;
                }
                j = j + 1;
                deviceList.scrollTo(0, scrollTop + s * j);
              }, t);
            }
          }
        }
      });
    },
    // end
    dealUserTree(userId) {
      //用户树选择用户
      this.userId = userId;
      this.page.current = 1;
      this.isSearch = false;
      this.selectOrder = "time";
      this.currentOrder = "down";
      this.changeCurrentTab(1);
      this.currentDev = 0;
      this.isFirst = true;
    },
    refreshDeviceList(op) {
      //更新所有设备
      if (!this.isSearch) {
        this.isRefresh = true;
        this.mapName = op.mapName;
        var that = this;
        this.$nextTick(function() {
          that.loadDeviceList();
        });
      }
    },
    getTheMapType(op) {
      // console.log(op);
      this.mapType = op.mapType;
    },
    listenEvent() {
      this.app.$on("show-device-position", this.getTheListOption);
      this.app.$on("change-the-maptype", this.getTheMapType);
      this.app.$on("infobox-data", this.onUpdateDevice);
      this.app.$on("usertree-userid", this.dealUserTree);
      this.app.$on("refresh-dev-list", this.refreshDeviceList);
      this.app.$on("refresh-current-dev", this.loadDeviceList);
      this.app.$on("agin-load-device", this.loadDeviceList);
    },
    offEvent() {
      this.app.$off("show-device-position", this.getTheListOption);
      this.app.$off("infobox-data", this.onUpdateDevice);
      this.app.$off("usertree-userid", this.dealUserTree);
      this.app.$off("refresh-dev-list", this.refreshDeviceList);
      this.app.$off("refresh-current-dev", this.loadDeviceList);
      this.app.$off("agin-load-device", this.loadDeviceList);
    },

    listenEventLoading() {
      // 不分页监听滚动条到底部显示文案
      var that = this;
      document.getElementById("dev_list").onscroll = function() {
        let _scrollHeight = document.getElementById("dev_list").scrollHeight;
        let _scrollTop = document.getElementById("dev_list").scrollTop;
        let _clientHeight = document.getElementById("dev_list").clientHeight;
        if (_scrollHeight - _scrollTop - _clientHeight == 0) {
          that.isShowLoding = true;
        }
        if (_scrollHeight - _scrollTop - _clientHeight >= 10) {
          that.isShowLoding = false;
        }
      };
    }
  },

  mounted() {
    this.listenEvent();
    var that = this;
    //延时 对监控平台中的url设备号与用户进行解析与加载对应信息，防止重复加载
    setTimeout(() => {
      that.changeCurrentTab(1);
    }, 300);
  },
  updated() {
    // 更新2021-2-1 不分页监听滚动条
    // 监听滚动条
    // this.listenEventLoading();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
