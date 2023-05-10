import UserBox from "@/components/UserBox";
import ExportUtil from "@/utils/exportUtil.js";
import docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver-fixed";
import {
  doSavePolicy,
  loadInsuranceInfo,
  loadPolicyType
} from "@/api/insurance";
export default {
  name: "DeviceInsurance",
  components: {
    "user-box": UserBox
  },
  data: () => ({
    //当前设备imei
    imei: "", //保单内容
    policy: {
      policyId: "",
      coverage: "",
      createUserId: "",
      createUserName: "",
      installAddr: "",
      policyType: "",
      deviceImei: "",
      custName: "",
      custIdNum: "",
      custPhone: "",
      drivLicName: "",
      drivLicIdNum: "",
      custTel: "",
      carPlateNum: "",
      carBrand: "",
      carType: "",
      carOrigPrice: "",
      engineId: "",
      frameId: "",
      devModel: "",
      custAddr: "",
      seller: "",
      emergencyContact: "",
      emergencyContactNumber: "",
      tFromStr: new Date().format("yyyy-MM-dd"),
      tToStr: new Date().format("yyyy-MM-dd"),
      installTimeStr: new Date().format("yyyy-MM-dd"),
      carRegTimeStr: new Date().format("yyyy-MM-dd"),
      custBirthStr: new Date().format("yyyy-MM-dd")
    },
    validateYear: 0, //有效年限
    selectProvince: "", //选中的省份
    originPolicy: "{}", //原始保单内容
    tplList: [], //保单类型
    isUserBox: false, //用户搜索框是否显示
    province: [
      "京",
      "沪",
      "津",
      "渝",
      "鲁",
      "冀",
      "晋",
      "蒙",
      "辽",
      "吉",
      "黑",
      "苏",
      "浙",
      "皖",
      "闽",
      "赣",
      "豫",
      "湘",
      "鄂",
      "粤",
      "桂",
      "琼",
      "川",
      "贵",
      "云",
      "藏",
      "陕",
      "甘",
      "青",
      "宁",
      "新",
      "港",
      "澳",
      "台"
    ],
    isLoad: false, //是否处于加载状态
    timerShow: "",
    isPdfBtn: false
  }),
  watch: {
    "policy.installTimeStr"() {
      //改变安装时间自动生成有效时间范围
      if (!this.isLoad) {
        this.policy.tFromStr = new Date(
          new Date(this.policy.installTimeStr + " 23:59:59").getTime() + 1000
        ).format("yyyy-MM-dd");
        this.setToTimeStr();
      }
    },
    "policy.policyType"() {
      //改变保单类型获取对应类型的保单信息
      if (!this.isLoad) {
        this.loadInsurance();
        this.getThePdfBthShow(this.policy.policyType);
      }
    },
    validateYear() {
      //改变有效年限，自动生成有效时间范围
      if (!this.isLoad) {
        this.setToTimeStr();
        // var time = new Date(this.policy.tFromStr + " 00:00:00").getTime() + 24 * 3600000;
        // this.policy.tFromStr = new Date(time).format('yyyy-MM-dd');
      }
    }
  },
  methods: {
    getThePdfBthShow(type) {
      // 2021-12-14
      var danhao_regx = [
        /7/,
        /8/,
        /9/,
        /10/,
        /11/,
        /12/,
        /13/,
        /14/,
        /15/,
        /16/,
        /17/,
        /18/,
        /19/,
        /20/,
        /21/,
        /22/,
        /23/,
        /24/,
        /25/
      ];
      for (var i = 0; i < danhao_regx.length; i++) {
        if (danhao_regx[i].test(Number(type.replace("kangqi", "")))) {
          // console.log("chufa");
          this.isPdfBtn = true;
        }
      }
      // 2021-12-14 end
    },
    getInsuranceType(item) {
      //根据保额与有效年限得到对应的保单类型
      if (item.coverage > 0 && item.tToStr && item.tFromStr) {
        var money;
        if (item.coverage <= 30000) {
          money = 0;
        } else if (item.coverage > 30000 && item.coverage <= 100000) {
          money = 1;
        } else if (item.coverage > 100000 && item.coverage <= 200000) {
          money = 2;
        } else if (item.coverage > 200000 && item.coverage <= 300000) {
          money = 3;
        } else if (item.coverage > 300000 && item.coverage <= 400000) {
          money = 4;
        } else if (item.coverage > 400000 && item.coverage <= 500000) {
          money = 5;
        } else {
          money = 6;
        }
        var year =
          Math.ceil(
            (new Date(item.tToStr + " 00:00:00").getTime() -
              new Date(item.tFromStr + " 00:00:00").getTime()) /
              (365 * 24 * 3600 * 1000)
          ) + 1;
        return `${year}类-${money}`;
      } else {
        return "--";
      }
    },
    setToTimeStr() {
      //有效时间范围
      // var time = new Date(this.policy.tFromStr + '00:00:00').getTime() - 1000;
      var time =
        new Date(this.policy.tFromStr + " 00:00:00").getTime() - 24 * 3600000;
      var timer = new Date(time).getFullYear();
      if (this.validateYear == 1.5) {
        this.policy.tToStr = new Date(time + 548 * 24 * 3600000).format(
          "yyyy-MM-dd"
        );
      } else {
        // if (((timer + this.validateYear) % 4 == 0 && (timer + this.validateYear) % 100 != 0) || (timer + this.validateYear) % 400 == 0) {
        //   this.policy.tToStr = new Date(time + this.validateYear * 365 * 24 * 3600000 + 1 * 24 * 3600000).format("yyyy-MM-dd");
        // } else {
        //   this.policy.tToStr = new Date(time + this.validateYear * 365 * 24 * 3600000).format("yyyy-MM-dd");
        // }
        var ceshitime = new Date(this.policy.tFromStr + " 00:00:00").format(
          "yyyy-MM-dd"
        );
        this.policy.tToStr = this.dateAddYear(ceshitime, this.validateYear);
        console.log(this.policy.tToStr);
      }
    },

    dateAddYear(date, years) {
      var now = new Date(date);
      var intYear = now.getFullYear() + parseInt(years);
      var intMonth = now.getMonth() + 1; //正常的月份，
      var intDay = now.getDate() - 1; //日期-1
      if (intDay == 0) {
        intMonth--; //减少一个月
        if (intMonth == 0) {
          intYear--; //0:减少一年
          intMonth = 12;
          intDay = 31;
        } else if (
          intMonth == 4 ||
          intMonth == 6 ||
          intMonth == 9 ||
          intMonth == 11
        ) {
          intDay = 30; //4,6,9,11:30天
        } else if (intMonth == 2) {
          intDay = 28; //2:28/29
          if (intYear % 4 == 0) {
            intDay = 29;
          }
        } else {
          intDay = 31; //1,3,5,7,8,10,12 :31天
        }
      }

      var strMonth =
        intMonth < 10 ? "0" + intMonth.toString() : intMonth.toString();
      var strDay = intDay < 10 ? "0" + intDay.toString() : intDay.toString();
      var strEndDate = intYear + "-" + strMonth + "-" + strDay;
      return strEndDate;
    },

    showHideBox(tag) {
      //搜索用户
      if (tag == "user") {
        this.app.$emit("close-user-box");
        this.isUserBox = true;
      }
    },
    saveInsurance(tag) {
      //保存保单信息
      var that = this;
      var data;
      if (this.policy.policyType == "kangqi6") {
        this.exportWord();
        console.log(this.policy.policyType);
        return;
      }
      data = this.getInsurData();
      if (that.originPolicy != JSON.stringify(data)) {
        if (!this.policy.policyId) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceInsurance.noPolicy1")
          );
          return;
        }
        if (!this.policy.policyType) {
          this.app.$emit("show-alert-msg", this.$t("deviceInsurance.noPolicy"));
          return;
        }
        if (this.policy.frameId && this.policy.frameId.length != 17) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceInsurance.frameIdTip")
          );
          return;
        }
        if (this.policy.custIdNum && this.policy.custIdNum.length != 18) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceInsurance.custIdNumTip")
          );
          return;
        }
        if (this.policy.drivLicIdNum && this.policy.drivLicIdNum.length != 18) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("deviceInsurance.drivLicIdNumTip")
          );
          return;
        }
        doSavePolicy(data).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("deviceInsurance.saveSuccess")
            );
            that.loadInsurance();
            if (tag == "exportPdf") {
              that.exportInsurance();
            } else if (tag == "exportWord") {
              that.exportWord();
            }
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("deviceInsurance.saveFail") + ":" + res.errMsg
            );
          }
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("deviceInsurance.noChange"));
        if (tag == "exportPdf") {
          that.exportInsurance();
        } else if (tag == "exportWord") {
          that.exportWord();
        }
      }
    },
    getInsurData() {
      //获取保单数据
      var data = {
        policyType: this.policy.policyType ? this.policy.policyType : "",
        policyId: this.policy.policyId ? this.policy.policyId : "",
        createUserId: this.policy.createUserId ? this.policy.createUserId : 0,
        deviceImei: this.policy.deviceImei ? this.policy.deviceImei : "",
        installAddr: this.policy.installAddr ? this.policy.installAddr : "",
        coverage: this.policy.coverage ? this.policy.coverage : 0,
        custName: this.policy.custName ? this.policy.custName : "",
        custIdNum: this.policy.custIdNum ? this.policy.custIdNum : "",
        custPhone: this.policy.custPhone ? this.policy.custPhone : "",
        drivLicName: this.policy.drivLicName ? this.policy.drivLicName : "",
        drivLicIdNum: this.policy.drivLicIdNum ? this.policy.drivLicIdNum : "",
        custTel: this.policy.custTel ? this.policy.custTel : "",
        carPlateNum: this.policy.carPlateNum
          ? this.policy.carPlateNum.toUpperCase()
          : "",
        carBrand: this.policy.carBrand ? this.policy.carBrand : "",
        carType: this.policy.carType ? this.policy.carType.toUpperCase() : "",
        carOrigPrice: this.policy.carOrigPrice ? this.policy.carOrigPrice : 0,
        engineId: this.policy.engineId
          ? this.policy.engineId.toUpperCase()
          : "",
        frameId: this.policy.frameId ? this.policy.frameId.toUpperCase() : "",
        devModel: this.policy.devModel ? this.policy.devModel : "",
        custAddr: this.policy.custAddr ? this.policy.custAddr : "",
        seller: this.policy.seller ? this.policy.seller : "",
        tFromStr: this.policy.tFromStr ? this.policy.tFromStr : "",
        tToStr: this.policy.tToStr ? this.policy.tToStr : "",
        emergencyContact: this.policy.emergencyContact
          ? this.policy.emergencyContact
          : "",
        emergencyContactNumber: this.policy.emergencyContactNumber
          ? this.policy.emergencyContactNumber
          : "",
        installTimeStr: this.policy.installTimeStr
          ? this.policy.installTimeStr
          : "",
        carRegTimeStr: this.policy.carRegTimeStr
          ? this.policy.carRegTimeStr
          : "",
        custBirthStr: this.policy.custBirthStr ? this.policy.custBirthStr : ""
      };
      if (
        this.policy.policyType == "kangqi8" ||
        this.policy.policyType == "kangqi12" ||
        this.policy.policyType == "kangqi14" ||
        this.policy.policyType == "kangqi15"
      ) {
        data.coverageStr = this.policy.carOrigPrice
          ? ExportUtil.intToChinese(this.policy.carOrigPrice) + "圆整"
          : 0;
      }
      data.carOrigPrice = this.policy.carOrigPrice
        ? this.policy.carOrigPrice
        : 0;
      if (
        this.policy.policyType == "kangqi14" ||
        this.policy.policyType == "kangqi15"
      ) {
        data.robberyStr = this.policy.coverage
          ? ExportUtil.intToChinese(this.policy.coverage) + "圆整"
          : 0;
      }

      return data;
    },
    getPolicyTypeToTheTemplate(type) {
      // 通过康骑号拿到相应的保单模板
      var template = "";
      switch (type) {
        case "ztinfo_docx": //正唐保单_docx
          return (template =
            this.API.exportModulePolicy + "ztinfo-20181119.docx");

        case "kangqi2": //康骑保单
          return (template =
            this.API.exportModulePolicy + "kangqi-20190812.docx");

        case "kangqi5": //摩托车小保单（摩托邦）
          return (template =
            this.API.exportModulePolicy + "motuobang-20200430.docx");

        case "zt": //正唐保单
          return (template =
            this.API.exportModulePolicy + "ztinfo-20181119.docx");

        case "shangdongtaile": //济南泰乐汽车用品有限公司
          return (template =
            this.API.exportModulePolicy + "shandongtaile.docx");

        case "kangqi6": //康骑保单特别约定
          return (template =
            this.API.exportModulePolicy + "teyue-20201014.docx");

        case "kangqi10": //盗抢保障服务服务单
          return (template =
            this.API.exportModulePolicy + "acymoto-20210122.docx");

        case "kangqi11": //宇辰生模板
          return (template =
            this.API.exportModulePolicy + "acymoto-yusheng.docx");

        case "kangqi13": //骑士尊享模板
          return (template =
            this.API.exportModulePolicy + "qishi_acymoto_20210521.docx");

        case "kangqi14": //昌蓝服务单-含购
          return (template =
            this.API.exportModulePolicy + "changlan20210827.docx");

        case "kangqi15": //昌蓝服务单-不含购
          return (template =
            this.API.exportModulePolicy + "no-changlan20210827.docx");

        case "kangqi16": //水哥凭证1
          return (template =
            this.API.exportModulePolicy + "shuigepingzheng1.docx");

        case "kangqi17": //水哥凭证2
          return (template =
            this.API.exportModulePolicy + "shuigepingzheng2.docx");

        case "kangqi18": //神州凭证
          return (template =
            this.API.exportModulePolicy + "shenzhoupingzheng.docx");

        case "kangqi19": //通用版1+
          return (template =
            this.API.exportModulePolicy + "tongyongban1+.docx");

        case "kangqi20": //通用版2+
          return (template =
            this.API.exportModulePolicy + "tongyongban2+.docx");
        case "kangqi21": //尊享骑士
          return (template =
            this.API.exportModulePolicy + "zunxiangqishi.docx");
        case "kangqi22": //神州凭证-不含代步费
          return (template =
            this.API.exportModulePolicy + "shenzhoupingzheng-buhandaibu.docx");
        case "kangqi23": //水哥凭证1-不含代步费
          return (template =
            this.API.exportModulePolicy + "shuigepingzheng1-buhandaibu.docx");
        case "kangqi24": //通用版2+含代步费
          return (template =
            this.API.exportModulePolicy + "tongyongban2+handaibufei.docx");
        case "kangqi25": //通用版-特价
          return (template =
            this.API.exportModulePolicy + "tongyongban-tejia.docx");
      }
    },
    exportWord() {
      //导出word文档
      if (this.policy.policyId && this.policy.policyType) {
        var data = this.getInsurData();
        // let formStr = [`<form action="${this.API.exportPolicy}">`];
        // console.log(formStr);
        // for (let key in data) {
        //   formStr.push(`<input name="${key}" value="${data[key]}">`);
        // }
        // formStr.push("</form>");
        // console.log(formStr);
        // $(formStr.join())
        //   .appendTo("body")
        //   .submit()
        //   .remove();
        // 2021-12-9 start
        let template1 = this.getPolicyTypeToTheTemplate(this.policy.policyType);
        // console.log(template1);
        JSZipUtils.getBinaryContent(template1, (error, content) => {
          if (error) {
            throw error;
          }
          // 创建一个PizZip实例，内容为模板的内容
          let zip = new PizZip(content);
          // 创建并加载docxtemlater()实例对象
          let doc = new docxtemplater();
          // console.log(doc);
          doc.loadZip(zip);
          // 设置模板变量的值
          let todayStr = new Date();
          data.validYear = this.validateYear;
          // data.todayDateStr = todayStr.getFullYear() + "年" + (todayStr.getMonth() + 1) + "月" + todayStr.getDate() + "日";
          data.todayDateStr = todayStr.format("yyyy年MM月dd日");
          data.tFromStr = new Date(data.tFromStr).format("yyyy年MM月dd日");
          data.tToStr = new Date(data.tToStr).format("yyyy年MM月dd日");
          // console.log("doc11", data);
          doc.setData({
            ...data
            // data: data,
          });
          try {
            // 用模板变量的值替换所有模板变量
            doc.render();
          } catch (error) {
            // 抛出异常
            let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            };
            console.log(JSON.stringify({ error: e }));
            throw error;
          }
          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          let out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          });
          // 将目标文件对象保存为目标类型的文件，并命名
          saveAs(out, this.imei + ".docx");
        });
        // end
      } else {
        this.app.$emit("show-alert-msg", this.$t("deviceInsurance.exportTip"));
      }
      return false;
    },
    exportInsurance() {
      //跳转到对应的保单pdf页面
      var path = "";
      switch (this.policy.policyType) {
        case "ztinfo_docx":
          path = "export";
          break;
        case "zt":
          path = "export";
          break;
        case "shandongtaile":
          path = "export2";
          break;
        case "kangqi2":
          path = "export1";
          break;
        case "kangqi4": //e-call
          path = "export3";
          break;
        case "kangqi7": //新增的3个pdf保单
          path = "export7";
          break;
        case "kangqi8":
          path = "export8";
          break;
        case "kangqi9":
          path = "export9";
          break;
        case "kangqi10":
          path = "export10";
          break;
        case "kangqi11":
          path = "export11";
          break;
        case "kangqi12":
          path = "export12";
          break;
        case "kangqi13":
          path = "export13";
          break;
        case "kangqi14":
          path = "export14";
          break;
        case "kangqi15":
          path = "export15";
          break;
        case "kangqi16":
        case "kangqi17":
        case "kangqi18":
        case "kangqi19":
        case "kangqi20":
        case "kangqi21":
        case "kangqi22":
        case "kangqi23":
        case "kangqi24":
        case "kangqi25":
          path = "export16";
          break;
      }
      window.open(
        window.location.origin +
          window.location.pathname +
          `#/${path}?deviceImei=${this.imei}&policyType=${
            this.policy.policyType
          }`
      );
    },
    loadInsurance() {
      //加载保单信息
      var that = this;
      this.isLoad = true;
      var data = {
        deviceImei: this.imei
      };
      if (this.policy.policyType) {
        data.policyType = this.policy.policyType;
      }
      loadInsuranceInfo(data).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          var policy = JSON.parse(JSON.stringify(that.policy));
          for (var key in data) {
            policy[key] = data[key];
          }
          policy.carRegTimeStr = policy.carRegTime
            ? new Date(policy.carRegTime).format("yyyy-MM-dd")
            : new Date().format("yyyy-MM-dd");
          policy.installTimeStr = policy.installTime
            ? new Date(policy.installTime).format("yyyy-MM-dd")
            : new Date().format("yyyy-MM-dd");
          policy.tFromStr = policy.tFrom
            ? new Date(policy.tFrom).format("yyyy-MM-dd")
            : new Date().format("yyyy-MM-dd");
          policy.tToStr = policy.tTo
            ? new Date(policy.tTo).format("yyyy-MM-dd")
            : new Date().format("yyyy-MM-dd");
          policy.custBirthStr = policy.custBirth
            ? new Date(policy.custBirth).format("yyyy-MM-dd")
            : new Date().format("yyyy-MM-dd");

          // console.log(data);
          this.timerShow = policy.tFromStr;
          this.policy = policy;
          var v = (policy.tTo - policy.tFrom) / (365 * 24 * 3600000);
          this.validateYear =
            v > 1.4 && v < 1.6 ? 1.5 : v <= 1 ? 1 : Math.ceil(v);
          this.originPolicy = JSON.stringify(this.policy);
          this.getThePdfBthShow(this.policy.policyType);
          setTimeout(() => {
            this.isLoad = false;
          }, 500);
        }
      });
    },
    dealDevDialog(imei) {
      //打开设备对话框
      this.imei = imei;
      if (this.imei) {
        this.loadInsurance();
      }
    },
    dealUserItem(op) {
      //用户搜索框中选中用户
      this.policy.createUserId = op.userId;
      this.policy.userName = op.userName;
    },
    getPolicyType() {
      //获取保单类型
      loadPolicyType().then(res => {
        if (res.errCode == 200) {
          this.tplList = res.data.tplList;
        }
      });
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDialog);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDialog);
    }
  },
  mounted() {
    this.listenEvent();
    this.getPolicyType();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
