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
        <img src="@/assets/img/insurance/kangqi8.png" />
        <div class="top-title">
          <span>客户服务单</span>
        </div>
        <div class="tab-item">
          <span>保单号：6615402021130194000002</span>
          <span>NO：{{ policy.policyId }}</span>
        </div>
      </div>
      <table class="insurance-table" border="1">
        <tr>
          <td>客户名称</td>
          <td>{{ policy.drivLicName }}</td>
          <td>身份证号</td>
          <td colspan="3">{{ policy.drivLicIdNum }}</td>
        </tr>
        <tr>
          <td>固定电话</td>
          <td>{{ policy.custTel }}</td>
          <td>移动电话</td>
          <td colspan="3">{{ policy.custPhone }}</td>
        </tr>
        <tr>
          <td colspan="6">
            <!-- 是否已购买摩托车盗抢险
            <span style="display:inline-block;"></span>
            <input class="text-input" type="checkbox" />是
            <span style="display:inline-block;"></span>
            <input class="text-input" type="checkbox" />否  -->
            <span style="margin-left:20px;">新车购置价</span
            ><span class="underline" style="width:50px">{{
              policy.carOrigPrice
            }}</span>
            <span style="margin-left:130px;">大写</span
            ><span class="underline">{{ biggers }}圆整</span>
          </td>
        </tr>
        <tr>
          <td>联系地址</td>
          <td colspan="5">{{ policy.custAddr }}</td>
        </tr>
        <tr>
          <td>购买摩托车厂牌型号</td>
          <td>{{ policy.carBrand }}</td>
          <td>车辆型号</td>
          <td>{{ policy.carType }}</td>
          <td>摩托车登记日期</td>
          <td>{{ policy.carRegTimeStr }}</td>
        </tr>
        <tr>
          <td>车牌号</td>
          <td>{{ policy.carPlateNum }}</td>
          <td>安装日期</td>
          <td>{{ policy.installTimeStr }}</td>
          <td>发动机号</td>
          <td>{{ policy.engineId }}</td>
        </tr>
        <tr>
          <td>VIN 码</td>
          <td>{{ policy.frameId }}</td>
          <td>产品 SN 编号</td>
          <td colspan="3">{{ policy.deviceImei }}</td>
        </tr>
        <tr>
          <td>安装地点</td>
          <td>{{ policy.custAddr }}</td>
          <td>安装人签名</td>
          <td colspan="3">{{ policy.seller }}</td>
        </tr>
      </table>

      <div style="margin:8px 0">
        请您准确、完整的填写全车盗抢综合保险客户服务单表格列明的信息，并对填写真实有效性负责，
        <br />否则，由此产生的责任将由您自行承担。
      </div>
      <table class="insurance-table1" border="1">
        <tr>
          <th>中国人寿财产保险股份有限公司产品责任保险承保声明</th>
        </tr>
        <tr>
          <td>
            <span>保障范围：</span
            >凡在中华人民共和国境内安装了爱车星（河北）科技有限公司销售的爱车易VPS智能车载终端的车辆，该车辆必须手续齐全，合法有效。
          </td>
        </tr>
        <tr>
          <td>
            <span>保险期限：<span class="underline">3</span></span
            >年，自设备安装之日起生效，在保险期间内如发生车辆转让，保险责任终止；车辆所有人或管理人应及时通知爱车星（河北）科技有限公司变更手续，手续变更次日零时保险责任恢复，否则保险人不承担赔偿责任。保险期限：
            <span class="underline">{{
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
          <td>
            <span>保险责任：</span
            >保险合同（保单号：6615402021130194000002）项下约定的责任，即保障范围内车辆被全车盗窃、抢劫、抢夺，经县级以上公安刑侦部门立案证实，满两个月未查明下落的，保险人根据保险合同约定进行赔偿。
          </td>
        </tr>
        <tr>
          <td>
            <span>赔偿处理：</span>
            <br />1.出险摩托车未购买盗抢险的，按被盗车辆折旧后价格的100%进行赔偿；出险摩托车已购买盗抢险的，在摩托车商业盗抢险保险先行赔付的前提下，本保险对摩托车盗抢险20%免赔部分在赔偿限额内进行差额赔付。折旧率计算方法参照中国人寿财产保险股份有限公司机动车辆保险对应的摩托车车辆种类或型号和折旧率。
            <br />
            2.我公司确认索赔单证齐全有效后20个工作日内支付赔款。获取赔款后，运营商及车主应协助我公司向责任者进行追偿。本保险赔偿限额最高为<span
              class="underline"
              >{{ policy.coverage }}</span
            >元。
            <br />3.被保险摩托车全车被盗窃、抢劫、抢夺后受到损坏需要修复的合理费用100%赔付。<br />
            4.特别声明：若投保摩托车为银行、金融公司贷款所购，发生保险事故，未还清银行、金融公司贷款时，保险赔款将直接支付给所属银行或金融公司。第一受益人：
            <span class="underline">{{ policy.custName }}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>有关义务：</span>
            <br />发生摩托车全车被盗抢后，车辆所有人应在24小时内向当地公安机关报案。车辆被盗后应当通过爱车星（河北）科技有限公司向保险人索赔。索赔时，车主必须提供车辆保险单证复印件（包括交强险）、受损人驾驶证及身份证复印件、机动车行驶证、机动车登记证书、购车原始发票、车辆购置税完税证明（车辆购置附加费缴费证明）或免税证明、产品保修卡、保险证明（全车盗抢综合保险客户服务单）、被盗抢摩托车的全套钥匙、公安机关立案证明机动车所有权权益转让书（由车主向中国人寿财险河北分公司转让）、保险人要求的其他材料。
          </td>
        </tr>
        <tr>
          <td>
            <span>除外责任：</span>
            <div class="seal-logo">
              <img src="@/assets/img/insurance/kangqi8-seal.png" />
            </div>
            1、非全车遭受盗抢，仅车上零部件或附属设备被盗抢、被损坏；2、被他人诈骗造成全车或部分损失；3、车主因违反政府有关法律、法规，车辆被有关国家机关罚没、扣押；4、车主因与他人的民事、经济纠纷而被抢劫、抢夺；5、租赁车辆与承租人同时失踪；6、车主的故意行为；7、客户违反本产品中规定的操作规程或擅自拆卸等引起的损失；
            8、除保险责任外的其他一切责任；
          </td>
        </tr>
        <tr>
          <td>
            <span>保险人：中国人寿财产保险股份有限公司石家庄市中心支公司</span>
            <br />地 址：河北省石家庄市桥西区新石中路377号物联网大厦A座13楼
            <br />保险服务咨询：010-95519 服务咨询：4006006861
          </td>
        </tr>
      </table>

      <div>
        <br />本保险由中国人寿财产保险股份有限公司石家庄市中心支公司承保。
        <br />注：爱车易vps智能车载终端自安装之日起保修三十六个月，如产品在保修期内出现故障，经告知，但用户未到指定部门维修，后果自负。
        <br />本人（公司）已知悉并接受本服务单中的各项内容。经保险人明确说明，本人（公司）已了解责任免除条款的内容。
        <!-- <br />客户签名： -->
        <!-- <span class="underline" style="width:20%;text-align:center;font-weight:normal">{{ policy.drivLicName }}</span> -->
        <!-- 日期： <span class="underline" style="width:5%"></span>年 <span class="underline" style="width:5%"></span>月
        <span class="underline" style="width:5%"></span> -->
        <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期：<span -->
        <!-- class="underline" -->
        <!-- style="text-align:center;font-weight:normal" -->
        <!-- >{{ new Date(policy.createTime).format("yyyy年MM月dd日") }}</span -->
        <!-- > -->
        <div class="sign-content">
          <p class="text">
            客户签名：<span
              class="underline"
              style="width:40%;text-align:center;font-weight:normal"
              >{{ policy.drivLicName }}</span
            >
          </p>
          <p>
            日期：<span
              class="underline"
              style="text-align:center;font-weight:normal"
              >{{ new Date(policy.createTime).format("yyyy年MM月dd日") }}</span
            >
          </p>
        </div>
      </div>

      <!-- 2020-11-23 新增-->
      <div class="new-content">
        <!-- <p>保险客户</p> -->
        <p>摩托车盗抢综合保障服务费率对照表</p>
        <table class="insurance-table11" border="1">
          <tr>
            <th>车价区间</th>
            <th>服务期限1年</th>
            <th>服务期限2年</th>
            <th>服务期限3年</th>
          </tr>
          <tr>
            <td>1万以下车型</td>
            <td>980</td>
            <td>1460</td>
            <td>2120</td>
          </tr>
          <tr>
            <td>1万＜车价≤2万</td>
            <td>1180</td>
            <td>1760</td>
            <td>2520</td>
          </tr>
          <tr>
            <td>2万＜车价≤3万</td>
            <td>1580</td>
            <td>2580</td>
            <td>3380</td>
          </tr>
          <tr>
            <td>3万＜车价≤6万</td>
            <td>1750</td>
            <td>2800</td>
            <td>3650</td>
          </tr>
          <tr>
            <td>6万＜车价≤10万</td>
            <td>2150</td>
            <td>3250</td>
            <td>4150</td>
          </tr>
          <tr>
            <td>10万＜车价≤13万</td>
            <td>2720</td>
            <td>3870</td>
            <td>4820</td>
          </tr>
          <tr>
            <td>13万＜车价≤16万</td>
            <td>2930</td>
            <td>4130</td>
            <td>5130</td>
          </tr>
          <tr>
            <td>16万＜车价≤20万</td>
            <td>3150</td>
            <td>4400</td>
            <td>5450</td>
          </tr>
          <tr>
            <td>20万＜车价≤23万</td>
            <td>3730</td>
            <td>5030</td>
            <td>6330</td>
          </tr>
          <tr>
            <td>23万＜车价≤26万</td>
            <td>4150</td>
            <td>5550</td>
            <td>6750</td>
          </tr>
          <tr>
            <td>26万＜车价≤30万</td>
            <td>4450</td>
            <td>5950</td>
            <td>7250</td>
          </tr>
          <tr>
            <td>35万＜车价≤40万</td>
            <td>4980</td>
            <td>7490</td>
            <td>10320</td>
          </tr>
          <tr>
            <td>40万＜车价≤45万</td>
            <td>5950</td>
            <td>8980</td>
            <td>12040</td>
          </tr>
          <tr>
            <td>45万＜车价≤50万</td>
            <td>6950</td>
            <td>9780</td>
            <td>13170</td>
          </tr>
          <tr>
            <td>50万＜车价≤60万</td>
            <td>7280</td>
            <td>10380</td>
            <td>13950</td>
          </tr>
        </table>

        <p style="font-weight:normal;font-size:24px;margin-top:40px">
          特别预约清单
        </p>
        <div class="tab-item1" style="margin-left:30px">
          <span>保单号：6615402021130194000002</span><br />
          <span>NO：{{ policy.policyId }}</span>
        </div>
        <div class="foot-content">
          <div class="seal-logo2">
            <img src="@/assets/img/insurance/kangqi8-seal2.png" />
          </div>
          <p>1、自承保之日起不再计算折旧。</p>
          <p>
            2、有效期内发生全车盗抢未找回事故，按本约定条款全额赔付，无免赔。
          </p>
          <!-- <p>3、有效期内发生全车盗抢未找回事故，凭购置税凭证赔付购置税。</p> -->
          <p>3、以上特别约定由爱车星（河北）科技有限公司先行赔付。</p>
          <p>4、爱车星（河北）科技有限公司凭有效单据向保险公司索赔。</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
//ztinfo
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance";
export default {
  name: "InsuranceExport12",
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
    biggers: ""
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei + "_保险客户服务单(" + this.policy.policyId + ")"
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

<style lang="scss" scoped>
@import "~@/assets/scss/export1.scss";
</style>
