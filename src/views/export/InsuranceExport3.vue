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
    <div class="ecall-insurance" id="export_insurance">
      <div class="one-page">
        <div class="insurance-header">
          <div class="hearder-img">
            <span>
              <img src="@/assets/img/insurance/ecall.png" />
              <img src="@/assets/img/insurance/ecall1.png" />
            </span>
            <span>
              E-Call人伤救援服务专线 400-600-8817
              <img src="@/assets/img/insurance/ecall2.png" />
            </span>
          </div>
          <div>爱车易救援服务保障卡</div>
        </div>
        <div
          style="position:absolute;right:calc(50% - 320px);color:red;font-weight:bold;text-align:right;"
        >
          救援服务专线
          <br />人伤救援E-Call 400-600-8817
        </div>
        <div>
          救援保障服务ID：{{ policy.drivLicIdNum }}
          <br />套餐编号：KQ-PC-BJS202001Q028-PRODUCT <br />渠道代码：CB1000040
        </div>
        <div style="text-align:right">
          签单日期：2020 年 04 月 15 日
          <br />服务机构：北京远盟道康科技有限公司
        </div>
        <div>
          重要告知：请用注册电话拨打救援服务热线！服务内容包括人伤救援服务、车辆救援服务，请务必详细阅读服务条款、特别是责任免除、被保障人义务的相关内容。
        </div>

        <table class="insurance-table" border="1">
          <tr>
            <td>被保障人</td>
            <td>{{ policy.custName }}</td>
            <td>证件号码（身份证）</td>
            <td>{{ policy.drivLicIdNum }}</td>
          </tr>
          <tr>
            <td>行驶证车主</td>
            <td>{{ policy.drivLicName }}</td>
            <td>注册电话</td>
            <td>{{ policy.custPhone }}</td>
          </tr>

          <tr>
            <td>车牌号码</td>
            <td>{{ policy.carPlateNum }}</td>
            <td>车辆厂牌型号</td>
            <td>{{ policy.carType }}</td>
          </tr>
          <tr>
            <td>发动机号</td>
            <td>{{ policy.engineId }}</td>
            <td>车架号/VIN 码</td>
            <td>{{ policy.frameId }}</td>
          </tr>
          <tr>
            <td>紧急联系人1</td>
            <td>{{ policy.emergencyContactOne }}</td>
            <td>电话</td>
            <td>{{ policy.emergencyContactNumberOne }}</td>
          </tr>
          <tr>
            <td>紧急联系人2</td>
            <td>{{ policy.emergencyContactTwo }}</td>
            <td>电话</td>
            <td>{{ policy.emergencyContactNumberTwo }}</td>
          </tr>

          <tr>
            <td>服务费</td>
            <td colspan="3">
              人民币大写：伍佰陆拾伍元整
              <span style="display:inline-block;width:20%"></span
              >小写：￥565.00元
            </td>
          </tr>
          <tr>
            <td>保障期间</td>
            <td colspan="3">
              自2020年04月16日 零时 至2021年04月15日 二十四 时 止
            </td>
          </tr>
          <tr>
            <td>服务项目</td>
            <td colspan="3">7*24小时E-Call 人伤救援服务</td>
          </tr>
        </table>

        <table class="insurance-table1" border="1">
          <tr>
            <td colspan="3">服务名称</td>
            <td>服务简述</td>
          </tr>
          <tr>
            <td rowspan="9">
              E-Call
              <br />人伤 <br />救援 <br />服务
            </td>
            <td>1</td>
            <td style="width:100px">费用管理</td>
            <td>
              满足以下条件之一，服务机构将承担救护车急救费用（每车每年限额1000元，含车上人员及第三者）：
              <br />1、用户直接呼叫救援电话要求协助呼叫救护车；
              <br />2、用户呼叫救护车，并在救护车到达出险现场前及时通知服务机构提出救援服务需求
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>手动报警管理</td>
            <td>
              当用户通过主动拨打救援电话触发紧急呼叫请求时，救援服务中心可提供24小时应急响应，通过自动接收并解析报警数据了解到被服务车辆位置，并按用户要求为其安排急救服务。
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>120报警协助</td>
            <td>
              服务机构通过急救调度辖区GIS系统自动匹配准确的辖区120调度电话、HPN网络数据传输与信息交互等多通路协助用户代叫120救护车。
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>安防报警协助</td>
            <td>在出险时协助用户向110、派出所、119等安防机构报案</td>
          </tr>
          <tr>
            <td>5</td>
            <td>保险公司报案协助</td>
            <td>
              在出险时协助用户向保险公司报案；（在用户告知承保保险公司信息并表示需要时）
            </td>
          </tr>
          <tr>
            <td>6</td>
            <td>紧急联络人联络</td>
            <td>
              重大事故案件，根据用户意愿及提供的联系方式通知家属或紧急联络人
            </td>
          </tr>
          <tr>
            <td>7</td>
            <td>
              白金10分钟
              <br />自救互救指导
            </td>
            <td>
              为被服务车辆提供24小时专业医护人员中、英双语救援咨询；被服务车辆发生交通人伤事故时（含车上人员及第三者），基于MPDS系统进行精准的急救分诊调度；在用户授权且正确提供现场情况的前提下，急救服务人员可通过电话提供“自救”或“互救”应急建议。
            </td>
          </tr>
          <tr>
            <td>8</td>
            <td>急救医院推介</td>
            <td>
              涉及人伤案件事故，向用户推介实施急救的医院或其他医疗机构，由用户自主决定，或根据实际情况由救护车上的医生安排。
            </td>
          </tr>
          <tr>
            <td>9</td>
            <td>进程管理</td>
            <td>
              1、为伤者提供人伤救援的全程跟踪、协调与关怀；
              <br />2、向用户提供伤者救援进程主要节点及急救处置情况的信息共享，如车辆派出、接到伤者、送达医院等。
            </td>
          </tr>
          <tr>
            <td>
              重
              <br />要 <br />提 <br />示
            </td>
            <td colspan="3">
              1、收到本服务凭证后，请及时核对保障内容，如有不符或者疏漏，请及时通知保障人办理变更手续。
              <br />2、请务必详细阅读保障条款、特别是关于特别约定、责任免除、被保障人义务的相关内容。
              <br />3、被保障机动车因改装、加装、改变使用性质等导致危险程度显著增加的，以及转卖、转让、赠送给他人的，应通知保障人。
              <br />4、服务条款详见附件。
            </td>
          </tr>
        </table>
      </div>

      <!-- 1 -->

      <div class="one-page">
        <div class="insurance-header">
          <div class="hearder-img">
            <span>
              <img src="@/assets/img/insurance/ecall.png" />
              <img src="@/assets/img/insurance/ecall1.png" />
            </span>
            <span>
              E-Call人伤救援服务专线 400-600-8817
              <img src="@/assets/img/insurance/ecall2.png" />
            </span>
          </div>
          <div>E-Call救援服务条款</div>
        </div>
        <div style="font-size:14px;">
          欢迎使用E-Call救援服务，请仔细阅读如下条款，确保您充分理解本条款中各条款内容。
          <br />1、您确认，一旦您使用此救援服务，就表示您已充分阅读、理解并接受本条款的全部内容，并同意遵循本条款的所有约定。
          <br />2、您同意，服务机构有权随时对本条款内容进行单方面的变更，并以公告的方式予以公布，无需另行单独通知您。
          <br />3、若您在本条款内容公告变更后继续使用、接受服务机构的救援服务条款，表示您已充分阅读、理解并接受修改后的条款内容，并同意遵循修改后条款的所有约定；若您不同意修改后的条款内容，您应当立即停止使用本救援服务。
          <br />
          <br />一、服务对象 <br />免费救援的服务对象须同时满足如下三个条件：
          <br />1、购买指定商业险、并且保险单在有效期内的客户。
          <br />2、家庭自用或者非营业用两轮或三轮摩托车客户。
          <br />3、拥有《E-Call救援服务单》规定资格的客户。
          <br />如不满足免费救援条件，可按次购买救援服务。
          <br />
          <br />二、服务项目 <br />1、 人伤救援服务
          <br />客户车辆在行驶途中发生交通事故或意外导致人身或财产安全时，救援中心将协助联系距离最近的公共紧急救援机构赶往事故现场，同时为伤者提供专业的电话急救指导，最大程度减轻伤害。救援中心还将承担每车每年1000元的院前急救费用。
          <br />
          <span class="text-bold">
            •
            救援中心仅负责从急救现场到救治医院过程中，符合救护车出车条件的救护车急救费用，一年内不限次数，每车每年限额1000元，含车上人员及第三者；救护车急救费用包含救护车（含120及999救护车）出车费、抢救药品以及其他必要的施救费用；
          </span>
          <br />
          <br />三、服务范围 <br />1、人伤救援服务
          <br />全国范围（不含港澳台地区），急救救护范围以各急救中心服务覆盖范围为准。
          <br />
          <br />四、法律适用及管辖
          <br />1、本条款的解释及适用，以及与本条款有关的争议，均应依照中华人民共和国法律予以处理。
          <br />2、在法律许可的范围内，爱车易对本条款享有最终解释权。
          <br />
        </div>
      </div>
      <!-- 2 -->

      <div class="one-page">
        <div class="insurance-header">
          <div class="hearder-img">
            <span>
              <img src="@/assets/img/insurance/ecall.png" />
              <img src="@/assets/img/insurance/ecall1.png" />
            </span>
            <span>
              E-Call人伤救援服务专线 400-600-8817
              <img src="@/assets/img/insurance/ecall2.png" />
            </span>
          </div>
          <div>《E-Call救援服务单》</div>
        </div>

        <div style="font-size:14px;">
          <span class="text-bold">一、用前须知</span>
          <br />1、本服务为会员制服务，在使用服务前，需要进行信息注册，成为爱车易的会员（以下简称用户或者会员），注册方式包括手机APP端，或者其他爱车易发布的方式，注册信息包括但不限于姓名、手机号、车牌号车架号等。
          <br />2、用户注册成为爱车易会员时，即授权爱车易有权合法使用和存储会员的注册信息和服务报警信息。爱车易承诺遵守有关法律要求保护会员的个人信息。
          <br />3、用户应确保所提供的注册信息和服务报警信息真实有效，若因用户的信息有误导致的救援失败或者延误，服务机构不承担相应责任。
          <br />
          <br />二、服务内容 <br />1、人伤救援服务
          <br />用户车辆在行驶途中发生交通事故或意外导致人身或财产安全时，救援中心将协助联系距离最近的公共紧急救援机构赶往事故现场，同时为伤者提供专业的电话急救指导，最大程度减轻伤害。救援中心还将承担每车每年1000元的院前急救费用。
          <br />
          <br />

          <table class="insurance-table1" border="1" style="font-size:12px;">
            <tr>
              <th style="width:80px;">服务类型</th>
              <th style="width:140px;">服务项目</th>
              <th>服务说明</th>
            </tr>
            <tr>
              <td rowspan="5">
                报警
                <br />管理
              </td>
              <td>手动报警管理</td>
              <td>
                当用户通过主动拨打救援电话触发紧急呼叫请求时，救援服务中心可提供24小时应急响应，通过自动接收并解析报警数据了解到被服务车辆位置，并按用户要求为其安排急救服务。
              </td>
            </tr>
            <tr>
              <td>120报警协助</td>
              <td>
                通过急救调度辖区GIS系统自动匹配准确的辖区120调度电话、HPN网络数据传输与信息交互等多通路协助用户代叫120救护车。
              </td>
            </tr>
            <tr>
              <td>安防报警协助</td>
              <td>在出险时协助用户向110、派出所、119等安防机构报案</td>
            </tr>

            <tr>
              <td>保险公司报案协助</td>
              <td>
                在出险时协助用户向保险公司报案；（在用户告知承保保险公司信息并表示需要时）
              </td>
            </tr>
            <tr>
              <td>紧急联络人联络</td>
              <td>
                重大事故案件，根据用户意愿及提供的联系方式通知家属或紧急联络人
              </td>
            </tr>
            <tr>
              <td rowspan="2">
                急救
                <br />管理
              </td>
              <td>
                白金10分钟
                <br />自救互救指导
              </td>
              <td>
                为被服务车辆提供24小时专业医护人员中、英双语救援咨询；被服务车辆发生交通人伤事故时（含车上人员及第三者），基于MPDS系统进行精准的急救分诊调度；在用户授权且正确提供现场情况的前提下，急救服务人员可通过电话提供“自救”或“互救”应急建议。
              </td>
            </tr>
            <tr>
              <td>急救医院推介</td>
              <td>
                涉及人伤案件事故，向用户推介实施急救的医院或其他医疗机构，由用户自主决定，或根据实际情况由救护车上的医生安排。
              </td>
            </tr>
            <tr>
              <td>
                进程
                <br />管理
              </td>
              <td>进程管理</td>
              <td>
                1、为伤者提供人伤救援的全程跟踪、协调与关怀；
                <br />2、向用户提供伤者救援进程主要节点及急救处置情况的信息共享，如车辆派出、接到伤者、送达医院等。
              </td>
            </tr>
            <tr>
              <td>
                费用
                <br />管理
              </td>
              <td>费用管理</td>
              <td>
                满足以下条件之一，服务机构将承担救护车急救费用（每车每年限额1000元，含车上人员及第三者）：
                <br />1、 用户直接呼叫救援电话要求协助呼叫救护车； <br />2、
                用户呼叫救护车，并在救护车到达出险现场前及时通知服务机构提出救援服务需求
              </td>
            </tr>
          </table>

          <br />

          <div style="font-size:14px;">
            <span class="text-bold">三、服务说明</span>
            <br />1、人伤救援服务： <br />1)
            人伤救援服务，从用户注册时的次日零时生效，有效期1年，有效期内不限使用次数；
            <br />2) 7*24小时， 365天全年服务响应；
            <br />
          </div>
        </div>
      </div>
      <!-- 3 -->

      <div class="one-page">
        <div class="insurance-header">
          <div class="hearder-img">
            <span>
              <img src="@/assets/img/insurance/ecall.png" />
              <img src="@/assets/img/insurance/ecall1.png" />
            </span>
            <span>
              E-Call人伤救援服务专线 400-600-8817
              <img src="@/assets/img/insurance/ecall2.png" />
            </span>
          </div>
        </div>
        <div style="font-size:14px;">
          3) 在服务有效期内，不限次数，免费使用服务；
          <br />4)
          电话急救指导是救援中心急救服务人员根据用户在电话中所描述的事件情况，给出的紧急急救指导，仅供用户作为应急参考，用户可自行选择是否采纳；
          <br />5)
          联络家属服务需要用户在激活个人信息时已经填写相关家属联系方式且用户明确表示愿意被协助通报家属；
          <br />6)
          救援中心仅负责从急救现场到救治医院过程中，符合救护车出车条件的救护车急救费用，一年内不限次数，每车每年限额1000元，含车上人员及第三者；救护车急救费用包含救护车（含120及999救护车）出车费、抢救药品以及其他必要的施救费用；
          <br />7)
          用户通过拨打指定7*24小时救援电话呼叫救护车并提出急救费用承担服务请求时，若由于身份核实、责任判定或其他原因导致救援中心没能当场提供费用承担服务，用户应该按照正常程序使用救护车并先行支付相关费用，同时妥善保管相关票据及证明文件，事后向爱车易提出此费用报销；
          <br />8)
          若用户自行拨打120呼叫救护车，但仍希望获得急救费用报销服务时，请在救护车到达出险现场前向爱车易报案，且妥善保管相关票据及证明文件，事后向爱车易提出此费用报销申请。报销申请文件请邮寄至（邮费请用户自理）：北京市朝阳区十里河富华弘燕大厦四层8002，收件人：远盟急救组
          （注明：救护车费用报销），邮编：100122。包括： <br />a)
          救护车急救费用发票（收据）原件； <br />b) 车主姓名； <br />c)
          车主手机号； <br />d) 车主车牌号； <br />e)
          收款方式（真实有效，提供形式不限，但符合财务要求）；
          <br />注：（b）（c）（d）（e）材料提供形式不限，真实有效即可。服务机构在收到上述单据后将进行必要的身份核实，确认由服务享用者本人使用的符合服务标准的限额内费用即可获得报销；收到报销材料起，1个工作日完成审核，4个工作日完成付款。
          <br />
          <br />

          <span class="text-bold">四、服务范围</span>
          <br />1、 人伤救援服务 <br />1)
          全国范围（不含港澳台地区），急救救护范围以各急救中心服务覆盖范围为准；
          <br />2) 救援对象包括该车辆驾乘者及该车辆发生交通事故所涉及的第三者。
          <br />3) 适用于普通摩托车（非专用或特种摩托车）；
          <br />

          <span class="text-bold">五、服务免责</span>
          <br />1、 人伤救援服务
          <br />服务机构作为紧急人伤救援协助及医疗信息咨询的第三方服务提供者，并非专业的医疗机构，将为以下由服务机构提供的服务所产生的质量问题导致用户投诉、争议或诉讼承担相关责任。
          <br />1) 救护车协助安排服务 <br />a)
          服务机构提供的救护车协助安排服务，包括协助用户呼叫救护车辆、跟踪用户被救护车送至医院；
          <br />b)
          服务机构对其24小时应急响应中心的接警响应时间、向急救机构正确传递来自用户的对紧急救治有益的报警信息负有责任，并承担由此导致的用户投诉、争议或诉讼等相关责任；
          <br />c)
          服务机构无权干涉公共急救或医疗机构自身的运营管理，因国家公共急救及医疗体系自身原因在施救过程中导致的任何法律责任或服务投诉，服务机构不承担连带责任。这些责任包括但不仅限于：救护车派遣时效、救护车路上时长、救护车上医护人员对用户进行紧急医疗处置的正确性、救护车上人员的服务态度、救治费用收取的合理性、因医院床位紧张导致的“押床”等问题，均由急救或医疗机构自行承担。若出现上述情况，服务机构将积极维护用户的合法权益；
          <br />
        </div>
      </div>
      <!-- 4 -->
      <div>
        <div class="insurance-header">
          <div class="hearder-img">
            <span>
              <img src="@/assets/img/insurance/ecall.png" />
              <img src="@/assets/img/insurance/ecall1.png" />
            </span>
            <span>
              E-Call人伤救援服务专线 400-600-8817
              <img src="@/assets/img/insurance/ecall2.png" />
            </span>
          </div>
        </div>
        <div style="font-size:14px;">
          d)
          在服务机构坐席无法通过事件信息或备案信息中的联系方式与车主以及车上相关人员取得有效联系的情况下，且报警方式为“自动报警”，服务机构会积极协调急救中心根据用户传输的位置信息前往事故现场。但是由于急救中心自身的车辆派遣制度等原因导致急救中心无法派车前往现场的情况，服务机构免责；
          <br />e)
          服务机构在签约急救中心城市覆盖范围内会积极协调救护车费用现场免付，若由于身份核实、责任判定或其他急救中心自身原因导致服务机构没能当场提供费用承担服务的，服务机构免责，但服务机构支持用户后续向服务机构提出此费用的报销。
          <br />2) 在线急救指导服务 <br />a)
          服务机构提供的在线急救指导服务不应被视为电话诊疗、公共急救服务或任何根据法律法规应当由医疗机构提供的服务，且用户在急救呼叫时存在的精神类疾病和心理咨询等不在此服务范围之内；
          <br />b)
          服务机构对其在线急救指导服务中的在线医生服务态度、服务质量及满意度负有责任，并承担由此导致的用户投诉、争议等相关责任；
          <br />c)
          因本指导只通过电话进行，所有建议均基于用户对于现场情况的描述，仅供用户作为应急参考，用户可自行选择是否采纳，服务机构不承担由此产生的针对施救效果导致的法律责任。服务机构建议，在可能的前提下，用户在除获得服务机构提供的电话应急参考外，还应根据现场情况积极寻求其它的救援帮助。
          <br />3) E-Call报警数据处理服务 <br />a)
          服务机构提供的E-Call报警数据处理服务，包括数据的接收与解析、根据数据显示的事故位置匹配适当的急救机构，并将急救机构所需要的有益于救援时效及救治成功率的数据送至适当的急救机构；
          <br />b)
          因各地急救机构的信息技术水平差异，服务机构不承诺向急救机构传送的上述数据一定以数据对接的形式自动传输；
          <br />c)
          服务机构对于上述数据的接收、解析及向急救机构发送上述数据的时效性和准确性负有责任。
          <br />4) 其它免责条款
          <br />如因以下问题导致服务延迟或服务无法正常开展，服务机构不承担相关责任：
          <br />a)
          因在中国境内的救援机构均无法实施有效救援的特殊环境下的车险人伤事故；
          <br />b)
          因运营商网络信号无覆盖或信号不佳，导致报警数据无法或延误发出；
          <br />c)
          因备案回呼号码不是实际应服务车辆上的驾乘人员，且通过回呼号码无法准确找到出险车辆实际驾乘人员而导致的无法施救；
          <br />d)
          因用户存在精神类疾病和心理疾病而导致服务机构提供的服务出现偏差；
          <br />e)
          服务机构仅在得到用户（书面/口头）许可的情况下，提供电话在线的协助紧急自救、互救应急指导，且该指导不得被视为提供医疗服务；
          <br />f)
          由于自然灾害或公共通讯故障等不可抗力因素造成的协助救援延迟或失败；
          <br />g)
          用户填写备案信息登记表时，由于填写错误或内容失实造成无法准确完成救援服务的。
          <br />
        </div>
      </div>
      <!-- 5 -->
    </div>
  </section>
</template>

<script>
//Ecall
import ExportUtil from "@/utils/exportUtil.js";
import { loadInsuranceInfo } from "@/api/insurance";
export default {
  name: "InsuranceExport3",
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
      coverage: 0,
      emergencyContactOne: "",
      emergencyContactNumberOne: "",
      emergencyContactTwo: "",
      emergencyContactNumberTwo: ""
    },
    imei: "",
    validYear: 0
  }),
  methods: {
    exportInsurance() {
      document.getElementById("export_btn").style.display = "none";
      ExportUtil.exportPdf(
        document.getElementById("export_insurance"),
        this.imei + "_爱车易救援服务保障卡(" + this.policy.policyId + ")"
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
.ecall-insurance {
  width: 720px;
  display: inline-block;
  margin: 0 auto;
  text-align: left;
  font-size: 12px;
  line-height: 20px;
  .one-page {
    height: 1050px;
    width: 100%;
  }
  * {
    font-family: "宋体" !important;
  }
  .text-bold {
    font-weight: bold;
  }
  .insurance-header {
    width: 100%;

    text-align: center;
    .hearder-img {
      white-space: nowrap;
      width: 100%;
      text-align: left;
      > span {
        display: inline-block;
        width: 45%;
        font-size: 14px;
        color: red;
      }
      > span:first-child {
        text-align: left;
      }
      > span:last-child {
        text-align: right;
      }
      img {
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

  .insurance-table {
    width: 100%;

    text-align: left;
    border-collapse: collapse;
    border-spacing: 0;
    line-height: 20px;
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
    line-height: 20px;

    tr > td {
      padding: 0 8px;
    }
    tr > td:first-child {
      text-align: center;
    }
    tr > td:nth-last-child(2) {
      text-align: center;
    }
  }
}
</style>
