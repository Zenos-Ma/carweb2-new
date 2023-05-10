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
        <img src="@/assets/img/insurance/ztinfo.png" />
        <span>全车盗抢综合保险客户服务单</span>
        <ul>
          <li>保单号：815152016110102000003</li>
          <li>NO：{{ policy.policyId }}</li>
        </ul>
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
            是否已购买机动车辆盗抢险
            <span style="display:inline-block;width:20%;"></span>
            <input class="text-input" type="checkbox" />是
            <span style="display:inline-block;width:20%;"></span>
            <input class="text-input" type="checkbox" />否
          </td>
        </tr>
        <tr>
          <td>联系地址</td>
          <td colspan="5">{{ policy.custAddr }}</td>
        </tr>
        <tr>
          <td>购买车辆厂牌型号</td>
          <td>{{ policy.carBrand }}</td>
          <td>车辆型号</td>
          <td>{{ policy.carType }}</td>
          <td>车辆登记日期</td>
          <td>{{ policy.carRegTimeStr }}</td>
        </tr>
        <tr>
          <td>车牌号</td>
          <td>{{ policy.carPlateNum }}</td>
          <td>发动机号</td>
          <td>{{ policy.engineId }}</td>
          <td>车架号</td>
          <td>{{ policy.frameId }}</td>
        </tr>
        <tr>
          <td>安装日期</td>
          <td>{{ policy.installTimeStr }}</td>
          <td>产品 SN 编号</td>
          <td colspan="3">{{ policy.deviceImei }}</td>
        </tr>
      </table>

      <div style="margin:8px 0">
        请您准确、完整的填写全车盗抢综合保险客户服务单表格列明的信息，并对填写真实有效性负责，
        <br />否则，由此产生的责任将由您自行承担。
      </div>
      <table class="insurance-table1" border="1">
        <tr>
          <th>中国人寿财产保险股份有限公司全车盗抢责任承保声明</th>
        </tr>
        <tr>
          <td>
            <span>保障范围：</span
            >凡在中华人民共和国境内安装了北京基准位置信息科技有限公司销售的车载GPS或北斗安防数据终端产品的车辆，该车辆必须手续齐全，合法有效。
          </td>
        </tr>
        <tr>
          <td>
            <span>保险责任：</span
            >凡在中华人民共和国境内（港、澳、台除外）安装了北京基准位置信息科技有限公司车载GPS或北斗安防数据终端产品的车辆，在约定范围内，全车被盗抢，经县以上公安刑侦部门立案证实，满三个月未查明下落的，我公司在责任限额内依法负责赔偿。
          </td>
        </tr>
        <tr>
          <td>
            <span>保险期限：</span
            >自设备安装之日24时起生效，到保险截止日24时止，在保险期间内如发生车辆转让，保险责任终止；车辆所有人或管理人应及时通知北京基准位置信息科技有限公司办理变更手续，手续变更次日零时保险责任恢复，否则保险人不承担赔偿责任。
          </td>
        </tr>
        <tr>
          <td>
            <span>有关义务：</span>
            <br />发生全车被盗抢后，车辆所有人应在24小时内向当地公安机关报案。车辆被盗后应当通过北京基准位置信息科技有限公司向保险人索赔。索赔时，车主必须提供车辆保险单证复印件（包括交强险）、受损人驾驶证及身份证复印件、机动车行驶证、机动车登记证书、机动车来历凭证、购车原始发票、车辆购置税完税证明（车辆购置附加费缴费证明）或免税证明、保险证明（全车盗抢责任承保声明），被盗抢原车的钥匙、公安机关立案证明、未破案证明、机动车钥匙及机动车所有权权益转让书（由车主向中国人寿财险北京分公司转让）、保险人要求的其他材料。
          </td>
        </tr>
        <tr>
          <td>
            <span>除外责任：</span>
            <br />1、非全车遭受盗抢，仅车上零部件或附属设备被盗抢、被损坏；
            <br />2、被他人诈骗造成全车或部分损失；
            <br />3、车主因违反政府有关法律、法规，车辆被有关国家机关罚没、扣押；
            <br />4、车主因与他人的民事、经济纠纷而被抢劫、抢夺；
            <br />5、租赁车辆与承租人同时失踪；
            <br />
            <img
              src="@/assets/img/insurance/ztinfo2.png"
              style="position:absolute;z-index:-1;left:calc(50% - 360px)"
            />
            6、车主的故意行为；
            <br />7、客户违反本产品中规定的操作规程或擅自拆卸等引起的损失；
            <br />8、产品用户未按时交纳移动通信费用被停机，导致该设备无法正常工作的；
            <br />9、除保险责任外的其他一切责任。
          </td>
        </tr>
        <tr>
          <td>
            <span>保险人：中国人寿财产保险股份有限公司北京市西城支公司</span>
            <br />地 址：北京市朝阳区朝外大街16号中国人寿大厦15层
            <br />保险服务咨询：010-95519 设备厂商服务咨询：4006-916-216
          </td>
        </tr>
        <tr>
          <td>
            <span>赔偿处理：</span>
            <br />1.出险车辆未购买盗抢险的，按被盗车辆折旧后价格的100%进行赔偿；出险车辆已购买盗抢险的，在机动车辆保险先行赔付的前提下，本保险对机动车盗抢险20%免赔部分在赔偿限额内进行差额赔付。折旧率计算方法参照中国人寿财产保险股份有限公司机动车辆保险对应的车辆种类或型号和折旧率。
            <br />
            <img
              src="@/assets/img/insurance/ztinfo1.png"
              style="position:absolute;z-index:-1;right:calc(50% - 360px)"
            />
            2.我公司确认索赔单证齐全有效后20个工作日内支付赔款。获取赔款后，运营商及车主应协助我公司向责任者进行追偿。本保险赔偿限额最高为RMB
            <!-- <span class="underline">{{ policy.coverage }}</span> 万元。 -->
            <span class="underline">{{ policy.coverage }}</span
            >元。
            <br />3、特别声明：若投保车辆为银行、金融公司贷款所购，发生保险事故，未还清银行、金融公司贷款时，保险赔款将直接支付给所属银行或金融公司。
            <br />第一受益人：
            <span class="underline">{{ policy.custName }}</span>
          </td>
        </tr>
      </table>

      <div>
        保险期限：自
        <span class="underline">{{ policy.tFromStr }}</span> 24时起至
        <span class="underline">{{ policy.tToStr }}</span> 24时止。
        <br />本保险由北京基准位置信息科技有限公司向中国人寿财产保险股份有限公司北京市西城支公司投保。
        <br />注：本产品安装之日起保修十二个月，如产品在保修期内出现故障，经告知，但用户未到指定部门维修，后果自负。
        <br />本人（公司）已知悉并接受本服务单中的各项内容。经保险人明确说明，本人（公司）已了解责任免除条款的内容。
        <br />客户签名：
        <span class="underline" style="width:20%"></span> 日期：
        <span class="underline" style="width:5%"></span>年
        <span class="underline" style="width:5%"></span>月
        <span class="underline" style="width:5%"></span>
        日
      </div>
    </div>
  </section>
</template>

<script>
//ztinfo
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance.js";
export default {
  name: "InsuranceExport",
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
    imei: ""
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei + "_全车盗抢综合保险客户服务单(" + this.policy.policyId + ")"
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
.ztinfo-insurance {
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
    height: 130px;

    padding: 0 16px;
    > img {
      vertical-align: middle;
      height: 130px;
      width: 130px;
    }
    > span {
      vertical-align: middle;
      font-size: 24px;
      text-align: center;
      display: inline-block;
      font-weight: bold;
    }
    > ul {
      position: absolute;
      right: calc(50% - 320px);
      top: 80px;
      margin: 0;
      padding: 0;
      display: inline-block;
      list-style: none;
      > li {
        display: block;
        text-align: right;
        margin: 0;
        padding: 0;
        line-height: 20px;
        font-size: 14px;
      }
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
</style>
