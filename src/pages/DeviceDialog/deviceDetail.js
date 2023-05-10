import ExportUtil from "@/utils/exportUtil.js";
// import ImageCropper from "@/components/ImageCropper";
import mapUtil from "@/utils/mapUtil";
import { getDeviceDetail, loadFlowExpireInfo, loadDeviceCarRelationInfo, batchCarDeviceRelationInfo, saveDeviceInfo } from "@/api/common.js";
import { loadPhoneNotify, loadTheDeviceIcon, updateDeviceLocation, loadSanyiInstallLogImei,isSanyiDevice } from "@/api/common.js";
export default {
  name: "DeviceDetail",
  components: {
    // "image-cropper": ImageCropper,
  },
  props: {
    dname: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    imagecropperShow: false,
    imagecropperKey: 0,
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    imei: "", //设备当前icon
    currentIcon: "01", //设备icon选项
    deviceIcon: [
      {
        icon: "icon01",
        value: "01",
      },
      {
        icon: "icon21",
        value: "21",
      },
      {
        icon: "icon22",
        value: "22",
      },
      {
        icon: "icon23",
        value: "23",
      },
      {
        icon: "icon24",
        value: "24",
      },
      {
        icon: "icon25",
        value: "25",
      },
      {
        icon: "icon26",
        value: "26",
      },
      {
        icon: "icon31",
        value: "31",
      },
      {
        icon: "icon32",
        value: "32",
      },
    ],
    deviceDetail: {
      //设备详情信息
      alertOffline: "0",
      alertOverspeed: "0",
      cornet: "",
      deviceImei: "",
      enableDate: "",
      iccid: "",
      icon: "",
      importTime: "",
      isObd: "",
      isRent: "",
      la: 0,
      linkman: "",
      lo: 0,
      locTime: "",
      loginNo: "",
      model: "",
      msisdn: "",
      name: "",
      overspeed: 0,
      plateNumber: "",
      platformExpire: new Date().format("yyyy-MM-dd"),
      remark: "",
      deviceRemark: "",
      sigTime: "",
      speed: 0,
      tel: "",
      userExpire: new Date().format("yyyy-MM-dd"),
      platformExpireSts: false,
      autoDefense: null,
      // 2021-2-25新增4中類型
      baseType: 0, //基本类型：0 有线，1：无线
      refillType: 0, //充值类型： 0 标准，1 风控，2 蓝牙，3 手持
      productType: 0, //产品类型： 0 车载，1 蓝牙，2 手持
      isStation: 0, //是否有基站： 0 无，1 有
      isLock: "", //是否锁定
    },
    userExpireSts: false,
    platformExpireSts: false,
    flowExpire: "", //流量到期时间
    flowExpireSts: false, //流量是否到期

    isOfflineRecursion: false, //离线报警是否应用下级
    isOfflineLongRecursion: false, //离线时长应用到下级

    isLowElectricRecursion: false, //低电报警应用到下级
    isElectricPercent: false, //低电量应用到下级

    overspeedRecursion: false, //超速报警是否应用下级
    isOverspeedRecursion: false, //超速速度应用到下级
    isUnused: false,
    originDetail: "", //未修改原始数据

    isEditType: false,
    isSim: false,
    isDealerNote: false,
    carDeviceDetail: {
      // 设备车辆详情
      deviceImei: "",
      userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
      platNumber: "",
      carOwner: "",
      vehicleNumber: "",
      engineNumber: "",
      brand: "",
      carType: "",
      carName: "",
      installSite: "",
      installPerson: "",
      installTime: new Date().format("yyyy-MM-dd hh:mm"),
      remark: "",
    },
    originCarDeviceDetail1: [], //原始的设备车辆信息集合
    originCarDeviceDetail: [],
    isflag: false,
    isKeight: false, //是否是k8型号设备
    isShowOver: false,
    trinityFlag: false, //判断是否是三一起重的
    installRecordList: [], //安装设备列表
    letterSpacing12: 12,
    letterSpacing04: 4,
    dWidth: 450,
    imgUrl2: null,
    image: null,
    phoneNotify: {},
    phoneNotifyCount: 0,
    phoneNotifyDate: null,
  }),
  watch: {
    deviceDetail() {
      this.platformExpireSts = this.deviceDetail.platformExpire ? new Date(this.deviceDetail.platformExpire).getTime() <= new Date().getTime() : true;
      //增加是否是k8系列的设备 "N6", "N7", "N8", "N9", "P6", "P6B", "P6C"
      const model = this.deviceDetail.model;
      const k8Series = ["N6", "N7", "N8", "N9", "P6", "P6B", "P6C"];
      for (var i = 0; i < k8Series.length; i++) {
        if (model.toUpperCase().indexOf(k8Series[i]) != -1) {
          console.log("model");
          this.isKeight = true;
          this.isUnused = false;
        }
      }
    },
    carDeviceDetail() {
      this.carDeviceDetail.platNumber = this.carDeviceDetail.platNumber ? this.carDeviceDetail.platNumber : this.deviceDetail.plateNumber;
    },
  },
  methods: {
    saveDeviceLocation() {
      // 修改设备定位信息
      const data = {
        deviceImei: this.deviceDetail.deviceImei,
        la: this.deviceDetail.la,
        lo: this.deviceDetail.lo,
        locTime: new Date(this.deviceDetail.locTime).format("yyyy-MM-dd hh:mm:ss"),
        sigTime: new Date(this.deviceDetail.sigTime).format("yyyy-MM-dd hh:mm:ss"),
      };
      updateDeviceLocation(data).then(res=> {
        if (res.errCode == 200) {
          this.app.$emit("show-alert-msg", this.$t("deviceDetail.updateDeviceLocationTip"));
          this.loadDeviceDetail();
        }
      })
    },
    handleChangeImage() {
      // this.imagecropperShow = true;
      this.app.$emit("handle-change-image");
    },
    cropSuccess(resData) {
      // console.log(resData);
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
    },
    close() {
      this.imagecropperShow = false;
    },
    exportRecordList() {
      // 导出安装记录
      this.exportEcall(this.installRecordList);
    },
    exportEcall(list) {
      let title = [
        this.$t("common.num"),
        this.$t("common.deviceImei"),
        this.$t("car.carNo"),
        this.$t("deviceDetail.installPerson"),
        this.$t("deviceDetail.installSite"),
        this.$t("insurance.installTime"),
        this.$t("common.updateTime"),
        this.$t("deviceDetail.remark"),
      ];
      let theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.deviceImei,
          item.platNumber,
          item.installPerson,
          item.installSite ? item.installSite : "--",
          item.installDate ? new Date(item.installDate).format("yyyy-MM-dd hh:mm:ss") : "--",
          item.updateTime ? new Date(item.updateTime).format("yyyy-MM-dd hh:mm:ss") : "--",
          item.remark,
        ]);
      }
      let accountName = JSON.parse(window.localStorage.getItem("carweb_user")).loginNo;
      ExportUtil.exportTable(title, theList, accountName + "--" + this.$t("deviceDetail.deviceInstallRecord"));
    },
    initStyle() {
      // 样式的变化
      const langType = window.localStorage.getItem("langType");
      if (langType == "en") {
        this.letterSpacing12 = 0;
        this.letterSpacing04 = 0;
        this.dWidth = 500;
      } else {
        this.letterSpacing12 = 12;
        this.letterSpacing04 = 4;
        this.dWidth = 450;
      }
    },
    installRecord() {
      // 查看安装记录
      this.installRecordList = [];
      loadSanyiInstallLogImei({ deviceImei: this.imei}).then(res=> {
        if (res.errCode == 200 && res.data.length > 0) {
          this.isShowOver = true;
          this.installRecordList = res.data;
        } else {
          this.isShowOver = false;
          this.app.$emit("show-alert-msg", this.$t("deviceDetail.installNoTip"));
        }
      })
    },
    dealDeviceImei(imei) {
      // 判断是否是三一起重的设备
      isSanyiDevice({ deviceImei: imei}).then(res=> {
        if (res.errCode == 200) {
          this.trinityFlag = res.data.trinityFlag;
        }
      })
    },
    showAddress() {
      // 解析地址
      // console.log(this.deviceDetail.lo);
      // console.log("this.deviceDetail.lo.toFixed(6)", typeof this.deviceDetail.lo);
      var that = this;
      var lng = Number(this.deviceDetail.lo).toFixed(6);
      var lat = Number(this.deviceDetail.la).toFixed(6);
      if (lng && lat && lat != 0 && lng > -180 && lng <= 180 && lat <= 90 && lat >= -90 && !this.deviceDetail.address) {
        this.getPoiLocation(lng, lat, function(address) {
          that.deviceDetail.address = address ? address : that.$t("common.addressFail"); //详细地址结果
          // console.log("res", that.deviceDetail);
        });
      }
    },
    getTheDeviceIcon() {
      let data = {
        deviceImei: this.imei,
      };
      loadTheDeviceIcon(data).then(res=>{
        if (res.errCode == 200) {
          // console.log(res);
          if (res.data.originIcon) {
            this.imgUrl2 = this.API.staticResource + res.data.originIcon;
          } else {
            this.imgUrl2 = mapUtil.getListDeviceIcon(res.data.deviceType);
          }
        }
      })
    },
    //获取设备详情
    loadDeviceDetail() {
      getDeviceDetail({ deviceImei: this.imei}).then(res=> {
        if (res.errCode == "200" || data.deviceImei) {
          var data = res.data;
          for (var key in data) {
            if (data[key] === "" || data[key] === undefined || data[key] === "undefined" || data[key] === null || data[key] === "null") {
              data[key] = "";
            }
          }
          this.deviceDetail = data;

          // 加载车辆信息 start
          // if (that.imei && that.deviceDetail.plateNumber) {
          if (this.imei) {
            this.loadDeviceCarRelation();
          }
          this.carDeviceDetail.platNumber = this.carDeviceDetail.platNumber ? this.carDeviceDetail.platNumber : this.deviceDetail.plateNumber;

          if (!this.deviceDetail.plateNumber || this.isflag) {
            this.carDeviceDetail = {
              // 设备车辆详情
              deviceImei: "",
              userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
              platNumber: "",
              carOwner: "",
              vehicleNumber: "",
              engineNumber: "",
              brand: "",
              carType: "",
              carName: "",
              installSite: "",
              installPerson: "",
              installTime: new Date().format("yyyy-MM-dd hh:mm"),
              remark: "",
            };
          } else {
            this.isflag = false;
          }
          // 加载车辆信息 end
          this.deviceDetail.icon = data.icon ? data.icon : "01";
          // this.deviceDetail.enableDate = data.enableDate ? data.enableDate : "(未启用)";
          if (this.userId == 1) {
            if (this.deviceDetail.enableDate == "--") {
              this.deviceDetail.enableDate = "";
            } else {
              this.deviceDetail.enableDate = data.enableDate ? data.enableDate : "";
            }
          } else {
            this.deviceDetail.enableDate = data.enableDate ? data.enableDate : "";
          }
          this.deviceDetail.alertLowElectric = data.alertLowElectric == 1;
          this.deviceDetail.alertOffline = data.alertOffline == "1";
          this.deviceDetail.alertOverspeed = data.alertOverspeed == "1";
          this.platformExpireSts = data.platformExpire ? new Date(data.platformExpire).getTime() <= new Date().getTime() : true;
          this.userExpireSts = data.userExpire ? new Date(data.userExpire).getTime() <= new Date().getTime() : true;
          if (!this.deviceDetail.remark) {
            this.$set(this.deviceDetail, "remark", "");
          }
          if (!this.deviceDetail.deviceRemark) {
            this.$set(this.deviceDetail, "deviceRemark", "");
          }
          // if (that.deviceDetail.lo && that.deviceDetail.la) {
          //   that.getPoiLocation(that.deviceDetail.lo.toFixed(6), that.deviceDetail.la.toFixed(6), (address) => {
          //     that.deviceDetail.address = address;
          //   });
          // }
          if (this.userId != 1) {
            if (new Date(this.deviceDetail.platformExpire).getTime() < new Date(this.deviceDetail.userExpire).getTime()) {
              this.deviceDetail.platformExpire = this.deviceDetail.userExpire;
            }
          }
          this.$set(this.deviceDetail, "address", "");
          this.originDetail = JSON.stringify(this.deviceDetail);
          this.loadFlowExpire(data.iccid);
        } else {
          this.app.$emit("show-alert-msg", res.errMsg);
        }
      })
    }, 
    Imgerror(val) {
      // console.log(val);
    },
    //获取iccid流量到期时间
    loadFlowExpire(iccid) {
      var that = this;
      if (iccid) {
        loadFlowExpireInfo({ iccid: iccid}).then(res=> {
          if (res.errCode == "200") {
            var data = res.data;
            // console.log(res);
            that.flowExpire = data.flowExpiry;
            if (new Date(data.flowExpiry).getTime()) {
              if (new Date(data.flowExpiry).getFullYear() <= 1970 || data.flowExpire == "1970-01-01 00:00:00") {
                that.isUnused = true;
              } else {
                that.isUnused = false;
                if (new Date(data.flowExpiry).getTime() > new Date().getTime()) {
                  that.flowExpireSts = true;
                } else {
                  that.flowExpireSts = false;
                }
              }
            } else {
              that.isUnused = false;
              that.flowExpireSts = true;
            }
          } else {
            that.isUnused = false;
            that.flowExpire = that.$t("deviceDetail.noFlowExpire");
            that.flowExpireSts = true;
          }
        })
      } else {
        that.flowExpire = that.$t("deviceDetail.noFlowExpire");
        that.flowExpireSts = true;
      }
    }, //保存设备信息
    loadDeviceCarRelation() {
      // 获取设备车辆关联关系信息
      var data = {
        deviceImei: this.imei,
        // platNumber: this.deviceDetail.plateNumber,
      };
      if (this.deviceDetail.plateNumber) {
        data.platNumber = this.deviceDetail.plateNumber;
      }
      // console.log(data);
      loadDeviceCarRelationInfo(data).then(res=> {
        if (res.errCode == 200) {
          // console.log(res);
          this.carDeviceDetail = res.data;
          if (this.carDeviceDetail == false) {
            this.carDeviceDetail = {
              // 设备车辆详情
              deviceImei: "",
              userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
              platNumber: "",
              carOwner: "",
              vehicleNumber: "",
              engineNumber: "",
              brand: "",
              carType: "",
              carName: "",
              installSite: "",
              installPerson: "",
              installTime: new Date().format("yyyy-MM-dd hh:mm"),
              remark: "",
            };
          }
          this.originCarDeviceDetail = JSON.stringify(this.carDeviceDetail);
        } else {
          this.isflag = true;
        }
      })
    },
    batchCarDeviceRelation() {
      // 编辑设备车辆
      var data;
      if (!this.trinityFlag) {
        data = {
          deviceImei: this.imei,
          platNumber: this.carDeviceDetail.platNumber,
          carOwner: this.carDeviceDetail.carOwner,
          vehicleNumber: this.carDeviceDetail.vehicleNumber,
          engineNumber: this.carDeviceDetail.engineNumber,
          brand: this.carDeviceDetail.brand,
          carType: this.carDeviceDetail.carType,
          carName: this.carDeviceDetail.carName,
          installSite: this.carDeviceDetail.installSite,
          remark: this.carDeviceDetail.remark,
        };
        if (this.carDeviceDetail.pkId) {
          data.pkId = this.carDeviceDetail.pkId;
        }
      } else if (this.trinityFlag) {
        data = {
          trinityFlag: true,
          installTimeLong: new Date(this.carDeviceDetail.installTime).getTime(),
          deviceImei: this.imei,
          installSite: this.carDeviceDetail.installSite,
          platNumber: this.carDeviceDetail.platNumber ? this.carDeviceDetail.platNumber : "",
          installPerson: this.carDeviceDetail.installPerson,
          remark: this.carDeviceDetail.remark,
        };
        if (!this.carDeviceDetail.platNumber) {
          this.app.$emit("show-alert-msg", this.$t("car.isCarNo"));
          return;
        }
        if (!this.carDeviceDetail.installTime) {
          this.app.$emit("show-alert-msg", this.$t("deviceDetail.installTimeTip"));
          return;
        }
      }

      // console.log(data);
      batchCarDeviceRelationInfo(data).then(res=> {
        if (res.errCode == 200) {
          console.log(res);
          this.loadDeviceCarRelation();
        } else {
          // this.app.$emit("show-alert-msg", this.$t("deviceDetail.saveFail1"));
        }
      })
    },
    saveDevice() {
      if (this.originCarDeviceDetail != JSON.stringify(this.carDeviceDetail)) {
        this.batchCarDeviceRelation();
      }
      // }
      if (this.originDetail != JSON.stringify(this.deviceDetail) || this.originCarDeviceDetail != JSON.stringify(this.carDeviceDetail)) {
        var data = {
          userId: this.userId,
          deviceImei: this.imei,
          model: this.deviceDetail.model,
          name: this.deviceDetail.name,
          // plateNumber: this.carDeviceDetail.platNumber ? this.carDeviceDetail.platNumber : this.deviceDetail.plateNumber,
          plateNumber: this.carDeviceDetail.platNumber,
          linkman: this.deviceDetail.linkman,
          tel: this.deviceDetail.tel,
          msisdn: this.deviceDetail.msisdn,
          icon: this.deviceDetail.icon,
          isRent: this.deviceDetail.isRent,
          remark: this.deviceDetail.remark,
          deviceRemark: this.deviceDetail.deviceRemark,
          iccid: this.deviceDetail.iccid,
          isObd: this.deviceDetail.isObd,
          platformExpire: new Date(new Date(this.deviceDetail.platformExpire).getTime()).format("yyyy-MM-dd"),
          userExpire: new Date(new Date(this.deviceDetail.userExpire).getTime()).format("yyyy-MM-dd"),
          // overspeedRecursion: this.overspeedRecursion,//超速应用到所有
          // offlineLong: this.deviceDetail.alertOfflineLong,
          // overspeed: this.deviceDetail.overspeed,
          // electricPercent: this.deviceDetail.alertLowElectricPercent,
          // isOffline: this.deviceDetail.alertOffline ? "1" : "0",
          // isOfflineRecursion: this.isOfflineRecursion,//离线预警报警到所有
          // isOfflineLongRecursion: this.isOfflineLongRecursion,//离线预警到所有
          // isOverspeed: this.deviceDetail.alertOverspeed ? "1" : "0",
          // isOverspeedRecursion: this.isOverspeedRecursion,//超速报警应用到所有
          // lowElectric: this.deviceDetail.alertLowElectric ? "1" : "0",
          // isLowElectricRecursion: this.isLowElectricRecursion,//低电电量报警到所有
          // isElectricPercent: this.isElectricPercent,//低电电量到所有
          cornet: this.deviceDetail.cornet,
          warnClose: "0",
          baseType: this.deviceDetail.baseType,
          productType: this.deviceDetail.productType,
          refillType: this.deviceDetail.refillType,
          isStation: this.deviceDetail.isStation,
          isLock: this.deviceDetail.isLock,
          la: Number(this.deviceDetail.la),
          lo: Number(this.deviceDetail.lo),
          locTime: new Date(this.deviceDetail.locTime).format("yyyy-MM-dd hh:mm:ss"),
          sigTime: new Date(this.deviceDetail.sigTime).format("yyyy-MM-dd hh:mm:ss"),
        };
        if (this.deviceDetail.enableDate && this.deviceDetail.enableDate != "--" && this.deviceDetail.enableDate != JSON.parse(this.originDetail).enableDate) {
          data.enableDate = new Date(new Date(this.deviceDetail.enableDate).getTime()).format("yyyy-MM-dd");
          data.enableSts = 1;
          // console.log("dad");
        } else {
          // console.log("aaaa");
          data.enableSts = this.deviceDetail.enableSts;
          data.enableDate = this.deviceDetail.enableDate;
        }
        if (new Date(data.platformExpire).getTime() < new Date(data.userExpire).getTime()) {
          this.app.$emit("show-alert-msg", "平台时间需要大于等于用户时间");
          return;
        }
        if (this.deviceDetail.autoDefense !== undefined && this.deviceDetail.autoDefense !== null) {
          data.autoDefense = this.deviceDetail.autoDefense;
        }
        for (var key in data) {
          if (data[key] === "" || data[key] === undefined || data[key] === "undefined" || data[key] === null || data[key] === "null") {
            data[key] = "";
          }
        }
        // console.log(data);
        saveDeviceInfo(data).then(res=> {
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("deviceDetail.saveSuccess"));
            this.loadDeviceDetail();
          } else {
            this.app.$emit("show-alert-msg", this.$t("deviceDetail.saveFail") + res.errMsg);
          }
        })
      } else {
        this.app.$emit("show-alert-msg", this.$t("deviceDetail.nochange"));
      }
    }, 
    //处理设备详情对话框操作
    dealDevDetail(imei, dname) {
      this.imei = imei;
      this.isKeight = false;
      if (this.imei && dname == this.dname) {
        this.loadDeviceDetail();
        this.initStyle();
        this.getTheDeviceIcon();
        this.loadPhoneNotifyDetail();
      }
      this.dealDeviceImei(imei);
    },
    loadPhoneNotifyDetail() {
      // 查询电话报警详情
      loadPhoneNotify({ deviceImei: this.imei}).then(res=> {
        if (res.errCode == 200) {
          this.phoneNotifyCount = res.data.notifyCount;
          this.phoneNotifyDate = new Date(res.data.expireDate.time).format("yyyy-MM-dd");
        }
      })
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDetail);
      this.app.$on("dev-detail-dialog", this.dealDevDetail);
      this.app.$on("refresh-dev-icon", this.getTheDeviceIcon);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDetail);
      this.app.$off("dev-detail-dialog", this.dealDevDetail);
      this.app.$off("refresh-dev-icon", this.getTheDeviceIcon);
    },
    initPermission() {
      var typeUser = [5186, 1];
      var tag2 = true;
      for (var i = 0; i < typeUser.length; i++) {
        if (this.userId == typeUser[i]) {
          this.isEditType = true;
          tag2 = false;
          break;
        }
      }
      if (tag2) {
        this.isEditType = false;
      }

      var simUser = [5186, 1, 6549, 7850];
      var tag1 = true;
      for (let i = 0; i < simUser.length; i++) {
        if (this.userId == simUser[i]) {
          this.isSim = true;
          tag1 = false;
          break;
        }
      }
      if (tag1) {
        this.isSim = false;
      }
      if (window.localStorage.getItem("carweb_customer") == "shanghai_deng") {
        var dearNoteUser = [5186, 6549, 7850, 7037, 2475, 8167, 8168, 8169, 8170, 8171, 8172, 8173, 238];
        var tag = true;
        for (let i = 0; i < dearNoteUser.length; i++) {
          if (this.userId == dearNoteUser[i]) {
            this.isDealerNote = true;
            tag = false;
            break;
          }
        }
        if (tag) {
          this.isDealerNote = false;
        }
      } else {
        this.isDealerNote = JSON.parse(window.localStorage.getItem("carweb_user")).userTypeV2 == 2;
      }
    },
  },
  created() {
    this.carDeviceDetail.platNumber = this.deviceDetail.plateNumber;
  },
  updated() {
  },
  mounted() {
    this.listenEvent();
    this.initPermission();
  },
  beforeDestroy() {
    this.offEvent();
  },
};
