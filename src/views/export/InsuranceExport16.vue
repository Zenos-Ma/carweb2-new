<template>
  <section style="text-align:center;">
    <el-button
      type="primary"
      size="small"
      @click="exportInsurance"
      id="export_btn"
      style="position:absolute;left:16px;top:16px;"
      ><i class="iconfont icon-import" style="margin-right:8px;"></i
      >导出PDF</el-button
    >
    <div class="ztinfo-insurance" id="export_insurance">
      <div class="insurance-header">
        <img src="@/assets/img/insurance/kangqi16_21.png" alt="" />
        <img src="@/assets/img/insurance/motor.png" />
      </div>
      <div class="title-top">摩托车盗抢保障服务凭证</div>
      <span>编号/确认码: {{ policy.policyId }}</span>

      <table class="insurance-table" border="1">
        <tr>
          <td style="width:7rem">车主姓名</td>
          <td width="140" class="t-center">{{ policy.drivLicName }}</td>
          <td>证件号码</td>
          <td class="t-center" width="140">{{ policy.drivLicIdNum }}</td>
          <td style="width:8rem">电话</td>
          <td class="t-center">{{ policy.custPhone }}</td>
        </tr>
        <tr>
          <td>车牌号码</td>
          <td class="t-center">{{ policy.carPlateNum }}</td>
          <td>车辆厂牌型号</td>
          <td class="t-center">{{ policy.carType }}</td>
          <td>智能终端编号</td>
          <td class="t-center">{{ policy.deviceImei }}</td>
        </tr>
        <tr>
          <td>发动机号</td>
          <td class="t-center">{{ policy.engineId }}</td>
          <td>车架号(VIN)</td>
          <td class="t-center">{{ policy.frameId }}</td>
          <td>机动车种类</td>
          <td class="t-center">摩托车</td>
        </tr>
        <tr>
          <td rowspan="2">服务期限</td>
          <td class="t-center" colspan="12">
            <!-- <span class="underline">3</span> -->
            <span class="underline">{{ yearXian }}</span>
            年，自<span class="underline">{{
              new Date(policy.tFrom).format("yyyy年MM月dd日")
            }}</span>
            零时至
            <span class="underline">{{
              new Date(policy.tTo).format("yyyy年MM月dd日")
            }}</span>
            二十四时止。
          </td>
        </tr>
        <tr>
          <td colspan="12">
            服务期内如果发生车辆过户，必须办理更名过户手续，自过户手续完成次日起，新车主可继续享有盗抢保障服务。
          </td>
        </tr>
        <!--  -->
        <tr>
          <td>新车购置价</td>
          <td class="t-center">
            人民币：<span class="underline">{{ policy.carOrigPrice }}</span
            >元
          </td>
          <td>盗抢服务费</td>
          <td colspan="6" class="t-center">
            人民币：<span class="underline">{{ policy.coverage }}</span
            >元
          </td>
        </tr>
        <!--  -->
        <tr>
          <td>第一受益人</td>
          <td>{{ policy.custName }}</td>
          <td>证件号码</td>
          <td colspan="6">{{ policy.custIdNum }}</td>
        </tr>
        <tr>
          <td colspan="12">盗抢保障服务提供商：{{ companyStr }}</td>
        </tr>
        <tr v-if="!isShowTeJia">
          <td colspan="6">
            盗抢保障特别约定服务：<span v-show="isfare"
              >自开始服务之日起不再计算折旧；服务期内发生全车盗抢未找回事故，购买时为3个月内新车凭购置税凭证赔付购置税；代步车辆费用40元/天*车辆丢失天数(最长不超过25天)。</span
            >
            <span v-show="!isfare"
              >自开始服务之日起不再计算折旧；服务期内发生全车盗抢未找回事故，购买时为3个月内新车的凭购置税凭证赔付购置税。</span
            >
          </td>
        </tr>
        <tr>
          <td colspan="6">
            智能车载终端自安装之日起保修三十六个月，如产品在保修期内出现故障，经告知但用户未到指定部门维修，后果自负。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            您收到服务单证后可以查验，查验请提供您的编号/确认码、身份证信息及车辆信息。服务热线：{{
              policyPhone
            }}
          </td>
        </tr>
      </table>

      <!-- 第二部分 -->
      <span style="padding-left:20px" class="gaizhang_cont">
        本人(公司)已知悉并接受本服务凭证中的各项内容。{{
          policyDealer
        }}明确说明，本人(公司)已了解责任免除条款的内容。
        <img
          v-show="isShowTopGaozhang"
          src="@/assets/img/insurance/kangqi16_21_gaizhang.png"
          alt=""
        />
      </span>
      <table class="insurance-table" border="1">
        <tr>
          <td colspan="6" height="40" class="title-top" style="font-size:20px">
            <span>中国平安财产保险股份有限公司产品责任保险承保声明</span>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            该智能车载定位终端设备已向中国平安财产保险公司投保了产品责任险，保险合同中双方约定的保险期限、承保区域、保险责任、除外责任、赔偿处理、索赔流程及材料的内容如下：
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="fontweight">保 单 号：</span> {{ policyNumber }}
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="fontweight">标的车辆：</span
            >在中华人民共和国境内（港、澳、台除外）的车辆合法车辆。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="fontweight">保险期限：</span
            >约定产品销售安装日期之次日零时起为保险起期。保险责任在首次全车被盗抢发生且无法找回，保险人理赔结束后自动终止。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="fontweight">保险责任：</span
            >保险合同约定的责任，即保障范围内车辆被全车盗窃、抢劫、抢夺，经县级以上公安刑侦部门立案证实，满两个月未查明下落的，保险人根据保险合同约定进行赔偿。
          </td>
        </tr>

        <tr>
          <td colspan="6">
            <span class="fontweight">赔偿处理：</span
            >1、出险摩托车未从其他途径获得赔付的，本保险按被盗车辆折旧后价格的100%进行赔偿；出险摩托车已从其他途径获得赔付的前提下，本保险在赔偿限额内进行差额赔付。折旧率计算方法参照中国平安财产保险股份有限公司机动车辆保险对应的摩托车车辆种类或型号和折旧率；2、我公司确认索赔单证齐全有效后20个工作日内支付赔款。获取赔款后，运营商及车主应协助我公司向责任者进行追偿。本保险单车赔偿限额最高为200万元；3、被保险摩托车全车被盗窃、抢劫、抢夺后受到损坏需要修复的合理费用100%赔付。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="fontweight">除外责任：</span
            >1、非全车遭受盗抢，仅车上零部件或附属设备被盗抢、被损坏；2、被他人诈骗造成全车或部分损失；3、车主因违反政府有关法律、法规，车辆被有关国家机关罚没、扣押；4、车主因与他人的民事、经济纠纷而被抢劫、抢夺；5、租赁车辆与承租人同时失踪；6、车主的故意行为；7、客户违反本产品规定的操作规程或擅自拆卸等引起的损失；8、除保险责任外的其他一切责任；
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="gaizhang">
              <span class="fontweight">有关义务：</span
              >发生摩托车全车被盗抢后，车辆所有人应在24小时内向当地公安机关报案。车辆被盗后通过盐城市盐都区神州摩托车服务有限公司向保险人提交索赔材料。索赔时，车主必须提供车辆保险单证复印件（包括交强险）、受损人驾驶证及身份证复印件、机动车行驶证、机动车登记证书、购车原始发票、车辆购置税完税证明（车辆购置附加费缴费证明）或免税证明、服务凭证、被盗抢摩托车的全套钥匙、公安机关立案证明、机动车所有权权益转让书（由车主向中国平安财产保险股份有限公司转让）、保险人要求的其他材料。
              <img
                v-show="isShowImg"
                src="@/assets/img/insurance/kangqi10-seal.png"
                alt=""
              />
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            保险人：中国平安财产保险股份有限公司<br />
            地 址：{{ policyAddress }}<br />
            服务电话：95511
          </td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
//ztinfo
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance";
export default {
  name: "InsuranceExport16",
  data: () => ({
    policy: {
      policyId: "",
      custName: "",
      drivLicName: "",
      drivLicIdNum: "",
      custPhone: "",
      custTel: "",
      custAddr: "",
      carBrand: "",
      carType: "",
      carRegTimeStr: "",
      carPlateNum: "",
      engineId: "",
      frameId: "",
      installTimeStr: "",
      deviceImei: "",
      tFromStr: "",
      tToStr: "",
      coverage: 0
    },
    imei: "",
    biggers: "",
    yearXian: "", //年限
    isShowImg: false,
    companyStr: "",
    policyNumber: "",
    policyAddress: "",
    policyPhone: "",
    policyDealer: "",
    isfare: false,
    isShowTopGaozhang: false, //是否显示上面的盖章图片
    isShowTeJia: false
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      let policyTypeStr = this.$route.query.policyType;
      let policyName;
      switch (policyTypeStr) {
        case "kangqi16": //水哥凭证1
          policyName = "水哥凭证1";
          break;
        case "kangqi17": //水哥凭证2
          policyName = "水哥凭证2";
          break;
        case "kangqi18": //神州凭证
          policyName = "神州凭证";
          break;
        case "kangqi19": //通用版1
          policyName = "通用版1";
          break;
        case "kangqi20": //通用版2
          policyName = "通用版2";
          break;
        case "kangqi21": //尊享骑士
          policyName = "尊享骑士";
          break;
        case "kangqi22": //神州凭证-不含代步
          policyName = "神州凭证-不含代步费";
          break;
        case "kangqi23":
          policyName = "水哥凭证1-不含代步费";
          break;
        case "kangqi24":
          policyName = "通用版2+含代步费";
          break;
        case "kangqi25":
          policyName = "通用版-特价";
      }
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei + policyName + "(" + this.policy.policyId + ")"
      );
      setTimeout(() => {
        document.getElementById("export_btn").style.display = "";
      }, 1000);
    },
    loadInsurance() {
      var data = {
        deviceImei: this.imei
      };
      if (this.$route.query.policyType) {
        data.policyType = this.$route.query.policyType;
      }
      loadInsuranceInfo(data).then(res => {
        if (res.errCode == "200") {
          for (var key in data) {
            this.policy[key] = data[key];
          }
          this.yearXian = this.setDate(
            new Date(this.policy.tFrom).format("yyyy,MM,dd"),
            new Date(this.policy.tTo).format("yyyy,MM,dd")
          );
          this.policy.carRegTimeStr = this.policy.carRegTime
            ? new Date(this.policy.carRegTime).format("yyyy年MM月dd日")
            : new Date().format("yyyy年MM月dd日");
          this.policy.installTimeStr = this.policy.installTime
            ? new Date(this.policy.installTime).format("yyyy年MM月dd日")
            : new Date().format("yyyy年MM月dd日");
          this.policy.tFromStr = this.policy.tFrom
            ? new Date(this.policy.tFrom).format("yyyy年MM月dd日")
            : new Date().format("yyyy年MM月dd日");
          this.policy.tToStr = this.policy.tTo
            ? new Date(this.policy.tTo).format("yyyy年MM月dd日")
            : new Date().format("yyyy年MM月dd日");
          this.policy.custBirthStr = this.policy.custBirth
            ? new Date(this.policy.custBirth).format("yyyy年MM月dd日")
            : new Date().format("yyyy年MM月dd日");
          this.originPolicy = JSON.stringify(this.policy);
          // console.log(ExportUtil.intToChinese(this.policy.coverage));
          this.biggers = ExportUtil.intToChinese(this.policy.carOrigPrice);
          // this.yearXian = this.policy.tTo - this.policy.tFrom + new Date().getTime();
        }
      });
    },
    setDate(startTime, endTime) {
      var startTime1 = new Date(startTime);
      var endTime1 = new Date(endTime);
      console.log(startTime1);
      console.log(endTime1);
      var years = 0;
      years = endTime1.getFullYear() - startTime1.getFullYear();
      if (endTime1.getMonth() + 1 - startTime1.getMonth() + 1 > 5) {
        years = years + 0.5;
      }
      if (startTime1.getMonth() - endTime1.getMonth() > 5) {
        years = years - 0.5;
      }
      return years;
    }
  },
  mounted() {
    if (this.$route.query.deviceImei) {
      this.imei = this.$route.query.deviceImei;
      this.loadInsurance();
    }
    if (this.$route.query.policyType) {
      let policyTypeStr = this.$route.query.policyType;
      switch (policyTypeStr) {
        case "kangqi17": //水哥凭证1
          this.isShowImg = true;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "13693352110";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = true;
          break;
        case "kangqi16": //水哥凭证2
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "13693352110";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = true;
          break;
        case "kangqi18": //神州凭证
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = true;
          break;
        case "kangqi19": //通用版1
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          break;
        case "kangqi20": //通用版2
          this.isShowImg = true;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          break;
        case "kangqi21": //尊享骑士
          this.isShowImg = true;
          this.companyStr = "摩托邦（北京）网络科技有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = false;
          this.isfare = false;
          break;
        case "kangqi22": //神州凭证-不含代步费
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          break;
        case "kangqi23": //水哥凭证1-不含代步费
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "13693352110";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          break;
        case "kangqi24": //通用版2+含代步费
          this.isShowImg = true;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          break;
        case "kangqi25": //通用版2+含代步费
          this.isShowImg = false;
          this.companyStr = "盐城市盐都区神州摩托车服务有限公司";
          this.policyNumber = "10134003901464835642";
          this.policyAddress = "北京市西城区金融大街23号";
          this.policyPhone = "4006669582";
          this.policyDealer = "经销售商";
          this.isShowTopGaozhang = true;
          this.isfare = false;
          this.isShowTeJia = true;
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fontweight {
  font-weight: bold;
}
@page {
  margin: 0;
}
.foot-content {
  p {
    font-size: 14px;
  }
}
tr {
  height: 25px;
}
.gaizhang {
  display: inline-block;
  position: relative;
  img {
    display: inline-block;
    position: absolute;
    left: 74px;
    top: -8px;
    width: 180px;
    height: 130px;
  }
}
.content-flex {
  display: flex;
  justify-content: space-between;
}
.t-center {
  text-align: center !important;
}

.sign-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    width: 50%;
  }
}
.seal-logo {
  position: relative;
  > img {
    display: inline-block;
    position: absolute;
    left: 75px;
    top: -62px;
    width: 150px;
    z-index: -1;
  }
}
.ztinfo-insurance {
  width: 720px;
  display: inline-block;
  margin: 0 auto;
  text-align: left;
  font-size: 12px;
  line-height: 20px;
  // *
  table {
    font-family: "宋体";
  }
  .insurance-header {
    height: 40px;
    width: 100%;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    > img {
      vertical-align: middle;
      width: 30%;
      height: 40px !important;
    }
  }
  input[type="checkbox"] {
    background-color: transparent;
    border-radius: 0;

    height: 14px;
    width: 14px;
    margin: 0 8px;
    border: solid 1px black;
  }
  span.underline {
    border-bottom: solid 1px black;
    display: inline-block;
    padding: 0 16px;
    font-weight: bold;
  }
  .pciture-image {
    position: absolute;
  }
  .insurance-table {
    width: 100%;
    // text-align: left;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 16px;
    tr > td:nth-child(odd) {
      text-align: center;
    }
    tr > td:nth-child(even) {
      padding: 0 8px;
      text-align: left;
    }
    tr > td[colspan] {
      text-align: left;
      padding: 0 8px;
      line-height: 1.5;
    }
    .underline {
      position: relative;
      ::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 20px;
        height: 1px;
      }
    }
  }
  .insurance-table1 {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 16px;
    tr > th {
      font-size: 24px;
      line-height: 40px;
      text-align: center;
    }
    tr > td {
      padding: 0 8px;
      > span {
        font-weight: bold;
      }
    }
  }
}

.new-content {
  margin-top: 80px;
  > p {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
}

.seal-logo2 {
  position: relative;
  > img {
    display: inline-block;
    position: absolute;
    left: 9px;
    top: -90px;
    width: 290px;
    z-index: -1;
  }
}

.tab-item1 {
  font-size: 16px;
  line-height: 28px;
}

.foot-content {
  margin-top: 80px;
  p {
    font-size: 14px;
  }
}

.ztinfo-insurance .title-top {
  text-align: center !important;
  line-height: 40px;
  color: #000;
  font-weight: bold;
  font-size: 25px;
  font-family: sans-serif !important;
}
.gaizhang_cont {
  position: relative;
  margin: 5px;
  display: inline-block;
  img {
    position: absolute;
    right: -66px;
    top: -135px;
    width: 150px;
    z-index: 9999;
  }
}
</style>
