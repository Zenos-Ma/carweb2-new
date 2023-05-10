import userTreeComp from "@/components/UserTree/UserTree";
import {
  rootAddGoods,
  delGoodsTypeInfo,
  doExtendSuperGoods,
  loadSuperGoods,
  savePriceList,
  onGoodsActive,
  loadPriceListInfo
} from "@/api/recharge.js";
import UserBox from "@/components/UserBox";
import { getUserInfoMation } from "@/api/common.js";

export default {
  name: "RechargePrice",
  components: {
    "user-tree": userTreeComp,
    "user-box": UserBox
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    priceList: [],
    priceList1: [],
    tips: "", //当前权限模式
    mode: 1, //是否解锁列表
    unlocked: true,
    originPrice: "",
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    isLoad: false,
    isShowParent: false,
    isAddSeries: false,
    isAddAudioSeries: false,
    goodsInfo: {
      name: "", //套餐名
      remark: "", //备注
      platformMonth: 1, //平台时间
      dataMonth: 1, //流量时间
      userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
      mainPrice: 1, //原价
      isPlatformFee: 1, //选中平台时间
      isDataFee: 1,
      refillType: 0,
      goodsType: 1
    },
    selectList: [],
    notifyCount: 50,
    rechargeTypeChoose: -1,
    rechargeGoodsType: -1,
    goodsAudioInfo: {
      name: "", //套餐名
      remark: "", //备注
      dataMonth: 12, //流量时间
      mainPrice: 20, //原价
      isPlatformFee: 1, //选中平台时间
      isDataFee: 1,
      refillType: 0,
      goodsType: 1
    },
    isAddSeries1: false,
    rechargeTypeChooseList: [],
    rechargeGoodsTypeList: [],
    searchUserName: "",
    isUserBox: false,
    searchUserId: "",
    isDealer: true
  }),
  created() {
    this.rechargeTypeChooseList = this.$t("rechargePrice.rechargeTypeChoose");
    this.rechargeGoodsTypeList = this.$t("rechargePrice.rechargeGoodsType");
  },
  watch: {
    notifyCount() {
      switch (this.notifyCount) {
        case 50:
          this.goodsAudioInfo.mainPrice = 20;
          break;
        case 120:
          this.goodsAudioInfo.mainPrice = 40;
          break;
        case 200:
          this.goodsAudioInfo.mainPrice = 60;
          break;
      }
    },
    // "goodsAudioInfo.mainPrice": {
    //   handler: function () {
    //     switch (this.goodsAudioInfo.mainPrice) {
    //       case 20:
    //         this.notifyCount = 50;
    //         break;
    //       case 40:
    //         this.notifyCount = 120;
    //         break;
    //       case 60:
    //         this.notifyCount = 120;
    //         break;
    //     }
    //   },
    // },
    goodsAudioInfo: {
      handler: function() {
        switch (this.goodsAudioInfo.mainPrice) {
          case 20:
            this.notifyCount = 50;
            break;
          case 40:
            this.notifyCount = 120;
            break;
          case 60:
            this.notifyCount = 200;
            break;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    searchUser() {
      //搜索用户
      this.app.$emit("close-user-box");
      this.isUserBox = true;
    },
    async dealUserItem(op) {
      // console.log(op);
      this.searchUserName = op.userName;
      this.searchUserId = op.userId;
      const fnDate = await this.getUserInfo(op.userId);
      if (fnDate.data.userType > 1 && fnDate.data.userType < 5) {
        this.isDealer = true;
      } else {
        this.isDealer = false;
      }
    },
    getUserInfo(userId) {
      return getUserInfoMation({ userId: userId });
    },
    rechargeTypeChooseChange(event) {
      // console.log(event);
      // 通过设备充值类型查询
      let originPriceList = JSON.parse(this.originPrice);
      this.rechargeTypeChoose = event;
      if (event == -1) {
        // this.priceList = JSON.parse(this.originPrice);
        // 设备充值类型全部
        if (this.rechargeGoodsType != -1) {
          // 充值套餐不是全部的时候
          originPriceList = originPriceList.filter(item => {
            return item.goodsType == this.rechargeGoodsType;
          });
          this.priceList = originPriceList;
        } else {
          this.priceList = JSON.parse(this.originPrice);
        }
      } else {
        // originPriceList = originPriceList.filter((item, index, arr) => {
        //   return item.refillType == event;
        // });
        if (this.rechargeGoodsType != -1) {
          originPriceList = originPriceList.filter(item => {
            return (
              item.refillType == event &&
              item.goodsType == this.rechargeGoodsType
            );
          });
        } else {
          originPriceList = originPriceList.filter(item => {
            return item.refillType == event;
          });
        }
        this.priceList = originPriceList;
      }
    },
    rechargeGoodsTypeChange(event) {
      // 通过充值套餐的类型查询
      console.log(event);
      let originPriceList = JSON.parse(this.originPrice);
      this.rechargeGoodsType = event;
      if (event == -1) {
        // 充值套餐全部
        if (this.rechargeTypeChoose != -1) {
          // 充值类型不是全部的时候
          originPriceList = originPriceList.filter(item => {
            return item.refillType == this.rechargeTypeChoose;
          });
          this.priceList = originPriceList;
        } else {
          this.priceList = JSON.parse(this.originPrice);
        }
      } else {
        if (this.rechargeTypeChoose != -1) {
          originPriceList = originPriceList.filter(item => {
            return (
              item.goodsType == event &&
              item.refillType == this.rechargeTypeChoose
            );
          });
        } else {
          originPriceList = originPriceList.filter(item => {
            return item.goodsType == event;
          });
        }
        this.priceList = originPriceList;
      }
    },

    handleSelectionChange(val) {
      this.selectList = val;
    },
    addDiscount(idx, tag) {
      var item = this.priceList[idx];
      if (tag == "inDiscount") {
        let percent = item.inDiscount;
        percent = (Math.floor(percent / 5) + 1) * 5;
        this.priceList[idx].inDiscount = percent >= 100 ? percent : 100;
      } else {
        let percent = item.outDiscount;
        percent = (Math.floor(percent / 5) + 1) * 5;
        this.priceList[idx].outDiscount = percent >= 100 ? percent : 100;
      }
    },
    minusDiscount(idx, tag) {
      var item = this.priceList[idx];
      if (tag == "inDiscount") {
        let percent = item.inDiscount;
        percent = (Math.floor(percent / 5) - 1) * 5;
        this.priceList[idx].inDiscount = percent >= 100 ? percent : 100;
      } else {
        let percent = item.outDiscount;
        percent = (Math.floor(percent / 5) - 1) * 5;
        this.priceList[idx].outDiscount = percent >= 100 ? percent : 100;
      }
    },
    clearSeries() {
      this.goodsInfo = {
        name: "", //套餐名
        remark: "", //备注
        platformMonth: 1, //平台时间
        dataMonth: 1, //流量时间
        userId: this.userId,
        mainPrice: 1, //原价
        isPlatformFee: 1, //选中平台时间
        isDataFee: 1,
        refillType: 0,
        goodsType: 1
      };
      this.notifyCount = 0;
    },
    delGoodActive(item, idx) {
      // 删除套餐
      console.log(item);
      let str = this.$t("rechargePrice.delGoodsTip").replace(
        "_name_",
        item.goodsName
      );
      this.app.$emit("show-confirm-msg", str, () => {
        delGoodsTypeInfo({ goodsId: item.goodsId }).then(res => {
          if (res.errCode == 200) {
            this.loadPriceList();
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.delGoodsSuccessTip")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.delGoodsFailTip")
            );
          }
        });
      });
    },
    saveSeries() {
      //root添加套餐
      var that = this;
      if (this.goodsInfo.name && this.goodsInfo.mainPrice) {
        var data = {
          name: this.goodsInfo.name,
          remark: this.goodsInfo.remark,
          dataMonth: this.goodsInfo.dataMonth,
          mainPrice: this.goodsInfo.mainPrice * 100,
          isActive: 1,
          refillType: this.goodsInfo.refillType,
          goodsType: 1
        };
        data.isPlatformFee = this.goodsInfo.platformMonth > 0 ? 1 : 0;
        data.isDataFee = this.goodsInfo.dataMonth > 0 ? 1 : 0;
        data.platformMonth = this.goodsInfo.platformMonth;
        console.log(data);
        rootAddGoods(data).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("addSeriesDialog.addSuccesss")
            );
            that.app.$emit("recharge-price-refresh", null);
            that.isAddSeries = false;
            that.clearSeries();
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("addSeriesDialog.addFail") + ":" + res.errMsg
            );
          }
        });
      } else {
        // this.isAddSeries = false;
        this.app.$emit("show-alert-msg", this.$t("addSeriesDialog.addTip"));
      }
    },
    saveAddAudioSeries() {
      //root添加套餐
      var that = this;
      if (this.goodsAudioInfo.name && this.goodsAudioInfo.mainPrice) {
        var data = {
          name: this.goodsAudioInfo.name,
          remark: this.goodsAudioInfo.remark,
          dataMonth: this.goodsAudioInfo.dataMonth,
          mainPrice: this.goodsAudioInfo.mainPrice * 100,
          isActive: 1,
          refillType: this.goodsAudioInfo.refillType,
          goodsType: 2
        };
        data.notifyCount = this.notifyCount;
        data.isDataFee = 0;
        console.log(data);
        rootAddGoods(data).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("addSeriesDialog.addSuccesss")
            );
            that.app.$emit("recharge-price-refresh", null);
            that.isAddAudioSeries = false;
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("addSeriesDialog.addFail") + ":" + res.errMsg
            );
          }
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("addSeriesDialog.addTip"));
      }
    },
    onParentList() {
      //继承上级用户套餐
      var that = this;
      if (this.selectList.length > 0) {
        var list = [];
        for (let i = 0; i < this.selectList.length; i++) {
          // let item = this.priceList1[this.selectList[i]];
          let item = this.selectList[i];
          console.log(item);
          list.push({
            goodsId: item.goodsId,
            inDiscount: item.inDiscount,
            outDiscount: item.outDiscount,
            isActive: item.isActive ? 1 : 0,
            userId: item.userId
          });
        }
        doExtendSuperGoods(list).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("rechargePrice.extendSuperOk")
            );
            that.loadPriceList();
            that.isShowParent = false;
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("rechargePrice.extendSuperFail") + ":" + res.errMsg
            );
          }
        });
      } else {
        this.isShowParent = false;
      }
    },
    showParent() {
      //获取上级用户套餐
      loadSuperGoods({ userId: this.userId }).then(res => {
        if (res.errCode == "200" && res.data.length > 0) {
          this.priceList1 = res.data;
          this.isShowParent = true;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePrice.noSuperGoods")
          );
        }
      });
    },
    checkDiscount(idx, item) {
      if (item.outDiscount >= item.inDiscount) {
        return 1;
      } else {
        let text = this.$t("rechargePrice.sellPriceTip");
        text = text.replace("_idx_", idx + 1);
        text = text.replace("_name_", item.goodsName);
        this.app.$emit("show-alert-msg", text);
        return -1;
      }
    },
    checkChangeItem(idx) {
      //获取已修改的表格
      var originItem = JSON.parse(this.originPrice)[idx];
      var item = this.priceList[idx];

      if (originItem.mainPrice1 != item.mainPrice1) {
        return 1;
      }
      if (
        originItem.inDiscount != item.inDiscount ||
        originItem.outDiscount != item.outDiscount
      ) {
        return this.checkDiscount(idx, item);
        // return 1;
      } else if (this.checkDiscount(idx, item) == -1) {
        return -1;
      }

      return 0;
    },
    savePrice() {
      //保存价目表
      var that = this;
      var list = [];
      if (this.originPrice == JSON.stringify(this.priceList)) {
        this.app.$emit("show-alert-msg", this.$t("rechargePrice.noChange"));
        return;
      }
      for (let i = 0; i < this.priceList.length; i++) {
        var tag = this.checkChangeItem(i);
        if (tag === 1) {
          var item = this.priceList[i];
          var data = {
            pkId: item.pkId,
            goodsId: item.goodsId,
            outDiscount: item.outDiscount,
            inDiscount: item.inDiscount,
            mainPrice: item.mainPrice1 * 100,
            userId: this.userId
            // isActive: item.isActive ? 1 : 0,
          };
          list.push(data);
        } else if (tag == -1) {
          return;
        }
      }

      savePriceList(list).then(res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePrice.saveSuccess")
          );
          this.loadPriceList();
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargePrice.saveFail") + ":" + res.errMsg
          );
        }
      });
    },
    onGoodActive(item) {
      //产品上下架
      const data = {
        userId: this.userId,
        goodsId: item.goodsId,
        isActive: item.isActive ? 0 : 1
      };
      onGoodsActive(data).then(res => {
        if (res.errCode == "200") {
          if (item.isActive) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.offGoodsOk")
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.onGoodsOk")
            );
          }
          this.loadPriceList();
        } else {
          if (item.isActive) {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.offGoodsFail") + ":" + res.errMsg
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("rechargePrice.onGoodsFail") + ":" + res.errMsg
            );
          }
        }
      });
    },
    showDialog() {
      //显示添加套餐对话框
      this.isAddSeries = true;
    },
    showDialog1() {
      // /显示添加语音套餐对话框
      this.isAddAudioSeries = true;
    },
    unlockPriceList() {
      //解锁列表，修改进价 功能未开发，btn隐藏
      this.unlocked = this.unlocked ? false : true;
    },
    loadPriceList() {
      //加载价格目录数据
      this.selectList = [];
      this.isLoad = true;
      loadPriceListInfo({ userId: this.userId }).then(res => {
        if (res.errCode == "200") {
          var data = res.data.goods ? res.data.goods : res.data;
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            // data[i].outPrice = parseFloat((item.mainPrice * 0.01 * item.outDiscount * 0.01).toFixed(2));
            // data[i].inPrice = parseFloat((item.mainPrice * 0.01 * item.inDiscount * 0.01).toFixed(2));
            data[i].mainPrice1 = parseFloat((item.mainPrice * 0.01).toFixed(2));
          }
          this.priceList = data;
          this.originPrice = JSON.stringify(data);
        }
        setTimeout(() => {
          this.isLoad = false;
        }, 100);
      });
    }, //选中用户树，不同用户修改权限
    dealUserTree(userId, userName) {
      this.userId = userId;
      if (this.userId == this.rootUser.userId) {
        this.tips = this.$t("rechargePrice.tips").replace(
          "_userName_",
          this.$i18n.locale == "en" ? "current user" : "当前用户"
        );
      } else {
        this.tips = this.$t("rechargePrice.tips").replace(
          "_userName_",
          userName
        );
      }
      var title = this.$t("rechargePrice.out_discount1").replace(
        "_userName_",
        userName
      );
      this.priceTitle = title;
      this.loadPriceList();
    }, //处理表格操作
    dealTableOp(op) {
      if (op.name == "pricePurchase") {
        //进价
        this.priceList[op.idx].inDiscount = op.item.inDiscount;
        let tag = this.getChangeIdx(op);
        if (tag) {
          this.changeList.push(op.idx);
        }
      } else if (op.name == "priceUser") {
        //对用户售价
        this.priceList[op.idx].outDiscount = op.item.outDiscount;
        let tag = this.getChangeIdx(op);
        if (tag) {
          this.changeList.push(op.idx);
        }
      } else if (op.name == "priceOffShelf") {
        //下架
        var active = this.priceList[op.idx].isActive;
        this.priceList[op.idx].isActive = active ? false : true;
      } else if (op.name == "priceOrigin") {
        //原始售价
        this.priceList[op.idx].mainPrice = op.item._val * 100;
        var tag = this.getChangeIdx(op);
        if (tag) {
          this.changeList.push(op.idx);
        }
      }
    },
    listenEvent() {
      this.app.$on("select-user", this.dealUserTree);
      this.app.$on("recharge-price-refresh", this.loadPriceList);
    },
    offEvent() {
      this.app.$off("select-user", this.dealUserTree);
      this.app.$off("recharge-price-refresh", this.loadPriceList);
    }
  },
  mounted() {
    this.listenEvent();
    this.dealUserTree(this.rootUser.userId, this.rootUser.userName);
  },
  beforeDestroy() {
    this.offEvent();
  }
};
