<template>
  <section style="text-align:center;">
    <el-button
      type="primary"
      size="small"
      @click="exportInsurance"
      class="btn-white"
      id="export_btn"
      style="position:absolute;left:16px;top:16px;"
      ><i class="iconfont icon-import" style="margin-right:8px;"></i
      >导出PDF</el-button
    >
    <div class="shuncheng-insurance" id="export_insurance">
      <div class="insurance-header">
        <div class="hearder-img">
          <img src="@/assets/img/insurance/shuncheng.png" />
        </div>
        <div>盗抢责任证明函</div>
      </div>

      <table class="insurance-table1" border="1">
        <tr>
          <td>
            兹证明“济南泰乐汽车用品有限公司”销售的“车载GPS车辆定位监控管理系统”（下称该产品）已向中华联合财产保险股份有限公司淄博中心支公司（下称本公司）投保产品责任保险，投保人、被保险人均为“济南泰乐汽车用品有限公司”，保险单号为
            <span class="underline">{{ policy.policyId }}</span>
            ，保险合同中双方约定的保险期限、承保区域、保险责任、除外责任、赔偿处理、索赔材料的内容如下：
          </td>
        </tr>
        <tr>
          <td>
            一、 保险期限：
            <br />叁年（保险期限为
            <span class="underline">{{ policy.tFromStr }}</span>
            至
            <span class="underline">{{ policy.tToStr }}</span
            >），自车辆安装该产品起生效，在保险期限内，如果发生车辆转让，原保险责任立即中止，且应立即通知本公司办理变更手续，变更手续办理的零时起，保险责任恢复，但原保险终止日期不变，保险责任中止期间本公司不负责赔偿。
          </td>
        </tr>
        <tr>
          <td>二、 承保区域：中华人民共和国境内（不含港、澳、台地区）</td>
        </tr>
        <tr>
          <td>
            三、保险责任：
            <br />在保险期限内，已安装和使用了该产品的车辆因该产品存在缺陷而在承保区域内被全车盗抢，且满二个月仍未查明下落，依法应由被保险人承担经济赔偿责任，车主在保险期限内向被保险人提出损害赔偿请求的，保险人根据保险合同的约定向被保险人赔偿。
          </td>
        </tr>
        <tr>
          <td>
            四、除外责任：
            <br />1.除产品责任保险条款所列的除外责任外，保险人对下列亦不负责赔偿：1.非全车遭受盗窃，仅车上零件或附属设备被盗窃、破坏；
            <br />2.被他人诈骗造成全车或部分损失；
            <br />3.车辆被有关国家机关罚没、扣押；
            <br />4.因民事、经济纠纷造成车辆被抢劫、抢夺； <br />5.租赁车辆；
            <br />6.被保险人及其车主故意行为；
            <br />7.因违反该产品使用说明书中规定的操作规程或擅自拆卸等引起的损失；
            <br />8.因未按时交纳移动通信费用或服务费用被停机，导致该设备无法正常工作的。
          </td>
        </tr>
        <tr>
          <td>
            五、赔偿处理：
            <br />发生保险责任事故时，被保险人可以得到下列赔偿：
            <br />被保险机动车被盗窃、抢劫、抢夺，经出险当地县级以上公安刑侦部门立案调查，满60天未查明下落的，按照车辆实际价值的赔付；
            <br />被保险机动车在被盗抢、抢劫、抢夺，受到损坏需要修复合理费用的80%赔付；
            <br />赔偿限额最高为
            <span class="underline">{{ policy.coverage }}</span>
            元。
            <br />
            <img
              src="@/assets/img/insurance/shuncheng2.png"
              style="position:absolute;z-index:-1;left:calc(50% - 360px)"
            />
            注：折旧率为每月6‰,折旧按月计算，不足一个月部分不折旧。
            <br />折旧金额=安装该产品时的新车购置价*安装该产品已使用的月数*月折旧率。
            <br />特别声明：若安装该产品的车辆为金融机构贷款所购，未还清贷款时，同意优先向第一受益人支付保险赔款。
            <br />第一受益人：
            <span class="underline">{{ policy.custName }}</span>
          </td>
        </tr>
        <tr>
          <td>
            六、索赔材料
            <br />1.本保险证明函、购买及安装本产品的凭证、缴费凭证；
            <br />2.被盗车辆的行驶证、车辆登记证书、原始购车发票、购置税本、车辆购置税发票、原车的所有钥匙、县级以上公安刑侦部门出具的盗窃案件证明，每缺少一项增加0.5%的免赔率;
            <br />3.机动车辆保险单、出险通知书、权益转让书；
            <br />4.保险人要求的其他相关材料。
          </td>
        </tr>
        <tr>
          <td>
            保险人名称：中华联合财产保险股份有限公司淄博中心支公司
            <br />保险人地址：山东省淄博市张店区柳泉路99号
            联系方式：0533-6218712 18953360160
          </td>
        </tr>
      </table>

      <br />
      <img
        src="@/assets/img/insurance/shuncheng1.png"
        style="position:absolute;z-index:-1;left:calc(50% - 360px)"
      />
      <table class="insurance-table" border="1">
        <tr>
          <td>车主姓名</td>
          <td>{{ policy.drivLicName }}</td>
          <td>身份证号</td>
          <td>{{ policy.drivLicIdNum }}</td>
          <td>出生日期</td>
          <td>{{ policy.custBirthStr }}</td>
        </tr>
        <tr>
          <td>移动电话</td>
          <td>{{ policy.custPhone }}</td>
          <td>是否已购买机动车辆商业盗抢险</td>
          <td colspan="3">
            <input class="text-input" type="checkbox" />是
            <input class="text-input" type="checkbox" />否
          </td>
        </tr>

        <tr>
          <td>车牌号码</td>
          <td>{{ policy.carPlateNum }}</td>
          <td>厂牌型号</td>
          <td>{{ policy.carType }}</td>
          <td>新车购置价</td>
          <td>{{ policy.carOrigPrice }}</td>
        </tr>
        <tr>
          <td>发动机号</td>
          <td>{{ policy.engineId }}</td>
          <td>车架号</td>
          <td>{{ policy.frameId }}</td>
          <td>车辆初次登记日</td>
          <td>{{ policy.carRegTimeStr }}</td>
        </tr>
        <tr>
          <td>GPS型号</td>
          <td>{{ policy.devModel }}</td>
          <td>机身编号</td>
          <td>{{ policy.deviceImei }}</td>
          <td>安装日期</td>
          <td>{{ policy.installTimeStr }}</td>
        </tr>

        <tr>
          <td>联系地址</td>
          <td colspan="3">{{ policy.custAddr }}</td>
          <td>销售员</td>
          <td>{{ policy.seller }}</td>
        </tr>
      </table>

      <div>
        注：该产品在安装之日起保修36个月，若产品在保修期内出现故障，用户未到指定部门维修服务，后果自负。
        <br />产品销售公司：（签章）
        <div>
          车主签名：
          <span class="underline" style="width:20%"></span> 日期：
          <span class="underline">{{ policy.tFromStr }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
//shuncheng
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance";
export default {
  name: "InsuranceExport2",
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
    validYear: 0
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei + "_盗抢责任证明函(" + this.policy.policyId + ")"
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
          var data = res.data;
          for (var key in data) {
            this.policy[key] = data[key];
          }
          this.validYear = Math.ceil(
            (this.policy.tTo - this.policy.tFrom) / (365 * 24 * 3600000)
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
        }
      });
    }
  },
  mounted() {
    if (this.$route.query.deviceImei) {
      this.imei = this.$route.query.deviceImei;
      this.loadInsurance();
    }
  }
};
</script>

<style lang="scss">
@page {
  margin: 0;
}
.shuncheng-insurance {
  width: 720px;
  display: inline-block;
  margin: 0 auto;
  text-align: left;
  font-size: 12px;
  line-height: 20px;
  * {
    font-family: "宋体" !important;
  }
  .insurance-header {
    width: 100%;

    text-align: center;
    .hearder-img {
      text-align: left;
      border-bottom: solid 1px gainsboro;
      > img {
        opacity: 0.5;
        height: 44px;
      }
    }
    > div {
      font-size: 24px;
      line-height: 40px;
      font-weight: bold;
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

    text-align: left;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 16px;
    tr > td:nth-child(odd) {
      text-align: center;
    }
    tr > td:nth-child(even) {
      padding: 0 8px;
    }
    tr > td[colspan] {
      text-align: left;
      padding: 0 8px;
    }
  }
  .insurance-table1 {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 16px;

    tr > td {
      padding: 0 8px;
      > span {
        font-weight: bold;
      }
    }
  }
}
</style>
