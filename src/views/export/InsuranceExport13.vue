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
    <div class="ztinfo-insurance" id="export_insurance">
      <div class="insurance-header">
        <img src="@/assets/img/insurance/motor.png" />
      </div>
      <table class="insurance-table" border="1">
        <th colspan="6" height="40" class="title-top">
          摩托车盗抢保障服务凭证
        </th>
        <tr>
          <td>编号/确认码</td>
          <td colspan="6" style="padding-left:20px">{{ policy.policyId }}</td>
        </tr>
        <tr>
          <td>车主姓名</td>
          <td width="140" class="t-center">{{ policy.drivLicName }}</td>
          <td>证件号码</td>
          <td class="t-center">{{ policy.drivLicIdNum }}</td>
          <td>电话</td>
          <td class="t-center">{{ policy.custPhone }}</td>
        </tr>
        <tr>
          <td>车牌号码</td>
          <td class="t-center">{{ policy.carPlateNum }}</td>
          <td>车辆厂牌型号</td>
          <td class="t-center">{{ policy.carBrand }}</td>
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
          <td>服务期限</td>
          <td colspan="6" class="t-center">
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
        <tr>
          <td colspan="6">
            您安装使用的摩托邦车辆盗抢保障服务系统有关事项声明如下：
          </td>
        </tr>
        <tr>
          <td colspan="6">
            一、盗抢保障服务提供商：摩托邦（北京）网络科技有限公司
          </td>
        </tr>
        <tr>
          <td colspan="6">
            二、理赔标准;被保险车辆未购买车辆商业盗抢险的，按保险合同约定协议的100%进行赔偿。被盗抢车辆已购买车辆商业盗抢险的，由车辆盗抢险优先赔付，不足部分在服务合同载明的赔偿限额内补足差额，但最高单车赔偿限额不超过50万元人民币。折旧率计算方法参照中国平安财产保险股份有限公司机动车辆保险对应的车辆种类或型号和折旧率。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            三、相关义务：发生全车被盗抢后，车辆所有人应在24小时内向当地公安机关报案。车辆被盗后应当通过摩托邦（北京）网络科技有限公司向保险人索赔。索赔时，车主必须提供车辆保险单证复印件（包括交强险）、受损人驾驶证及身份证复印件、机动车行驶证、机动车登记证书、购车原始发票、车辆购置税完税证明（车辆购置附加费缴费证明）或免税证明、保障服务凭证（车辆盗抢保障服务凭证）、被盗抢车辆的全套钥匙、公安机关立案证明、被盗抢车辆状态证明、其他要求的材料。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            本人(公司)已知悉并接受本服务凭证中的各项内容。经摩托邦明确说明，本人(公司)已了解责任免除条款的内容。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="content-flex">
              <span
                >客户签名(受益人):<span
                  class="underline"
                  style="width:180px;text-align:center"
                  >{{ policy.custName }}</span
                ></span
              >
              <span
                >日期：<span class="underline">{{
                  new Date(policy.createTime).format("yyyy年MM月dd日")
                }}</span></span
              >
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="content-flex">
              <span>产品服务运营商：摩托邦（北京）网络科技有限公司</span>
              <span>服务电话：400-600-8987</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6" height="40" class="title-top">
            <span>投保产品责任险保险凭证</span>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            兹证明该GPS设备已向中国平安财产保险公司投保了产品责任险，保险合同中双方约定的保险期限、承保区域、保险责任、除外责任、赔偿处理、索赔流程及材料的内容如下：
          </td>
        </tr>
        <tr>
          <td colspan="6">
            一、保 单 号：10560003901315967225
          </td>
        </tr>
        <tr>
          <td colspan="6">
            二、保险期限：约定产品销售安装日期之次日零时起为保险起期。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            三、标的车辆：在中华人民共和国境内（港、澳、台除外），安装使用了摩托邦RIDEBOX车辆盗抢保障服务管理系统的车辆，且车辆均为上牌车、正规车辆、在车管所有备案车辆。投保人向我司投保后，在保险期内，如果发生车辆转让情况，必须办理更名过户手续，自过户手续完成次日起，新车主可继续享有盗抢保障服务，保险责任在首次全车被盗抢发生且无法找回，保险人理赔结束后自动终止。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            四、保险责任：在中华人民共和国境内（港、澳、台除外），安装了摩托邦RIDEBOX系列车辆管理服务系统的车辆，由于被保险人所提供的管理服终端存在缺陷导致全车被盗抢，经县以上公安刑侦部门立案证实，满二个月未查明下落的，保险人赔偿限额内按照保险合同约定内容负责赔偿。单车赔偿限额为保险人对单一车辆损失承担的最高赔偿限额，并且不超过受损车辆新车购置价减去车辆已使用年限对应折旧的金额，承保GPS需保证可正常运行。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            五、除外责任：1、被他人诈骗造成全车或部分损失；2、车主因违反政府有关法律、法规，车辆被有关国家机关罚没、扣押；3、车主因与他人的民事、经济纠纷而被抢劫、抢夺；4、被保车辆与车主同时失踪；5、车主的故意行为；6、客户违反产品规定的操作规程或擅自拆卸等引起的损失；7、产品用户未按时交纳移动通信费用被停机，导致该设备无法正常工作的；8、除保险责任外的其他一切责任；
          </td>
        </tr>
        <tr>
          <td colspan="6">
            六、赔偿处理：发生保险责任范围内的损失时，由摩托邦（北京）网络科技有限公司按约定赔付标准赔付，签署权益转让书后保险人可在收到权益转让书后，在约定的赔偿限额内赔付。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <span class="gaizhang">
              七、相关义务：理赔材料按照保险协议约定执行，除理赔标准中展示，需提供提供保险证明、机动车所有权权益转让书（由车主向平安财险转让）、其他保险人要求的材料。
              <img src="@/assets/img/insurance/kangqi10-seal.png" alt="" />
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            八、保险人承担保险责任应当依照保险合同以及投保人与保险人签署的各项协议执行，最终应以保险人出具保险单为准。
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="content-flex">
              <span>保险人：中国平安财产保险股份有限公司深圳分公司 </span>
              <span>地址：深圳市福田区农林路69号深国投广场1号写字楼</span>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="content-flex">
              <span>保险人(盖章):</span>
              <span
                >签单日期:<span class="underline">{{
                  new Date(policy.createTime).format("yyyy年MM月dd日")
                }}</span></span
              >
              <span>服务电话：95511</span>
            </div>
          </td>
        </tr>
      </table>

      <!-- <div class="footer-content" style="margin-top:70px">
        <p style="font-weight:normal;font-size:24px;margin-top:40px;text-align:center">特别约定清单</p>
        <div class="tab-item1" style="font-size:14px;margin-left:30px">
          <span>保单号：10560003901283011086</span><br />
          <span>NO：{{ policy.policyId }}</span>
        </div>
        <div class="foot-content">
          <div class="seal-logo2">
            <img src="@/assets/img/insurance/baichean.png" />
          </div>
          <p>1、自承保之日起不再计算折旧。</p>
          <p>2、有效期内发生全车盗抢未找回事故，按本约定条款全额赔付，无免赔。</p>
          <p>3、新车投保后在有效期内发生全车盗抢未找回事故，凭购置税凭证赔付购置税</p>
          <p>4、以上特别约定由河北佰车安科技有限公司先行赔付。</p>
          <p>5、爱车星（河北）科技有限公司凭有效单据向保险公司索赔。</p>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script>
//ztinfo
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance";
export default {
  name: "InsuranceExport13",
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
    yearXian: "" //年限
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei +
          "_骑士尊享摩托车车辆盗抢保障服务(" +
          this.policy.policyId +
          ")"
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
      // while (startTime1.setFullYear(startTime1.getFullYear() + 1) <= endTime1.getTime()){
      //  years++;
      // }
      years = endTime1.getFullYear() - startTime1.getFullYear();
      // console.log(endTime1.getFullYear(),startTime1.getFullYear());
      // console.log((startTime1.getMonth()-endTime1.getMonth())>5);
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
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/export1011.scss";
</style>
