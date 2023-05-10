<template>
  <div style="text-align: center;margin-top:5px" class="card-tab">
    <table class="form-table" style="margin: 0 auto">
      <tr>
        <td>{{ $t("common.deviceImei") }}:</td>
        <td>
          <div class="content-middle">
            <el-input
              style="width:200px;margin-right:5px;"
              size="small"
              v-model="rechargeInfo.deviceImei"
            />
            <el-button
              type="primary"
              @click="isDeviceBox2 = true"
              style="padding: 8px 16px !important;"
            >
              {{ $t("common.search") }}
            </el-button>
          </div>
          <device-box
            :is-show.sync="isDeviceBox2"
            :search-key="rechargeInfo.deviceImei"
            box-type="recharge"
            @select-result="onRechargeDev"
          ></device-box>
        </td>
      </tr>
      <tr v-show="rechargeInfo.deviceName && !isCard">
        <td>{{ $t("common.deviceName") }}:</td>
        <td>
          <a @click="showDevice(rechargeInfo)">{{ rechargeInfo.deviceName }}</a>
        </td>
      </tr>
      <tr v-show="!isCard">
        <td>{{ $t("rechargeMy.cardNo") }}:</td>
        <td>{{ card.rechargeCardNum }}</td>
      </tr>
      <tr v-show="isCard">
        <td>{{ $t("rechargeMy.cardNo") }}:</td>
        <td>
          <div class="content-middle">
            <el-input
              readonly
              size="small"
              style="width: 200px;margin-right:5px;"
              :value="card.rechargeCardNum"
              @click="isCardShow = true"
            />
            <el-button
              type="primary"
              @click="isCardShow = true"
              style="padding: 8px 16px !important;"
            >
              {{ $t("common.search") }}
            </el-button>
          </div>

          <div
            class="result-box"
            v-show="isCardShow"
            style="width: 300px; overflow-x: hidden; overflow-y: hidden"
          >
            <table class="form-table" style="width: 100%">
              <tr>
                <td>{{ $t("rechargeMy.value") }}:</td>
                <td>
                  <select
                    class="text-input small"
                    v-model="selectVal"
                    style="vertical-align: middle;"
                  >
                    <option value>{{ $t("common.all") }}</option>
                    <option
                      v-for="(item, idx) in packageList"
                      :key="'cards' + idx"
                      :value="item.packageId"
                    >
                      {{ item.text }}
                    </option>
                  </select>
                  <el-button
                    type="primary"
                    style="padding: 6px 16px !important;vertical-align: middle;"
                    @click="isCardShow = false"
                  >
                    {{ $t("common.close") }}
                  </el-button>
                </td>
              </tr>
            </table>

            <div
              style="height: calc(100% - 60px);overflow-x: hidden;overflow-y: auto;"
            >
              <ul class="result-list" v-if="cardList.length > 0">
                <li
                  v-for="(item, idx) in cardList"
                  @click="chooseItem(item)"
                  :key="idx"
                >
                  <div class="result-list-icon iconfont icon-setting"></div>
                  <div class="result-list-text">
                    {{ item.rechargeCardNum }}
                    <span style="color: #999"
                      >({{ getCardType(item.packageId) }})</span
                    >
                  </div>
                </li>
              </ul>
              <div
                v-if="cardList.length == 0"
                class="result-box-nodata"
                @click="isCardShow = false"
              >
                {{ $t("common.noresult") }}
              </div>
            </div>
            <!-- <pager :current.sync="pager.current" :limit.sync="pager.limit" :num="pager.num" :is-current="false" style="background: white" @change-current="loadRecharge"></pager> -->
            <el-pagination
              center
              :pager-count="5"
              :page-size="pager.limit"
              :page-count="pager.num"
              background
              layout="prev,pager,next"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </td>
      </tr>
      <tr v-show="isFlowError">
        <td>
          <span
            style=" color: red; font-size: 12px; font-weight: normal; white-space: normal; "
            >{{ $t("common.notice") }}:</span
          >
        </td>
        <td>
          <span
            style="display: inline-block; color: red; font-size: 12px; font-weight: normal; white-space: normal; max-width: 200px; "
            >{{ $t("rechargeMy.noICCIDTip") }}</span
          >
        </td>
      </tr>
      <tr v-show="isLonglife">
        <td></td>
        <td>
          <span
            style="color: red;font-size: 12px;font-weight: normal;hite-space: normal;"
            >{{ $t("rechargeMy.deviceLifelong") }}</span
          >
        </td>
      </tr>
      <!-- 新增风控卡 start-->
      <tr v-show="isfrcType">
        <td></td>
        <td>
          <span
            style="color: red;font-size: 12px;font-weight: normal;hite-space: normal;"
            >{{ $t("rechargeMy.frcTypeTip") }}</span
          >
        </td>
      </tr>
      <!-- end -->
      <tr>
        <td>{{ $t("rechargeMy.value") }}:</td>
        <td>
          <!-- <select class="text-input small" v-model="card.packageId" disabled>
            <option v-for="(item, idx) in packageList" :key="'cards' + idx" :value="item.packageId">
              {{ item.text }}
            </option>
          </select> -->
          <el-select
            v-model="card.packageId"
            size="small"
            disabled
            style="width:200px"
            placeholder="Please choose"
          >
            <el-option
              v-for="(item, idx) in packageList"
              :key="'cards' + idx"
              :value="item.packageId"
              :label="item.text"
            ></el-option>
          </el-select>
        </td>
      </tr>

      <tr v-show="selectPackage.isPlatfromFee == 1 && !isKeight">
        <!-- 平台到期 -->
        <td>{{ $t("deviceDetail.platformExpired") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.platformExpire | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.beforeRecharge") }})</span
          >
        </td>
      </tr>
      <tr v-show="selectPackage.isPlatfromFee == 1 && !isKeight">
        <td></td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.platformExpire1 | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.afterRecharge") }})</span
          >
        </td>
      </tr>
      <!-- 新增的k8 的显示 start -->
      <tr v-show="selectPackage.isPlatfromFee == 1 && isKeight">
        <!-- 平台到期 -->
        <td>{{ $t("deviceDetail.platformExpired") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            value="2049-01-01"
            disabled
          />
        </td>
      </tr>
      <!-- end -->

      <tr v-show="selectPackage.isPlatfromFee == 1 && !isKeight">
        <!-- 用户到期 -->
        <td>{{ $t("deviceDetail.userExpired") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.userExpire | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.beforeRecharge") }})</span
          >
        </td>
      </tr>
      <tr v-show="selectPackage.isPlatfromFee == 1 && !isKeight">
        <td></td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.userExpire1 | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.afterRecharge") }})</span
          >
        </td>
      </tr>
      <tr v-show="selectPackage.isDataFee == 1 && !isKeight">
        <!-- 流量到期 -->
        <td>{{ $t("simInfo.flowExpiry") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.flowExpiry | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.beforeRecharge") }})</span
          >
        </td>
      </tr>
      <tr v-show="selectPackage.isDataFee == 1 && !isKeight">
        <td></td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.flowExpiry1 | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.afterRecharge") }})</span
          >
        </td>
      </tr>
      <!-- 新增的k8的时间显示 start -->
      <tr v-show="selectPackage.isDataFee == 1 && isKeight">
        <!-- 流量到期 -->
        <td>{{ $t("simInfo.flowExpiry") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.userExpire | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.beforeRecharge") }})</span
          >
        </td>
      </tr>
      <tr v-show="selectPackage.isDataFee == 1 && isKeight">
        <td></td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            :value="rechargeInfo.userExpire1 | fdate"
            disabled
          />
          <span style="color: gray"
            >({{ $t("rechargeMy.afterRecharge") }})</span
          >
        </td>
      </tr>
      <!-- end -->

      <tr>
        <td>{{ $t("common.note") }}:</td>
        <td>
          <el-input
            size="small"
            style="width:200px"
            v-model="rechargeInfo.note"
          />
        </td>
      </tr>
    </table>

    <div>
      <el-button
        type="primary"
        size="small"
        @click="onRechargeCard"
        :disabled="isLonglife || isFlowError || isfrcType"
      >
        {{ $t("common.submit") }}
      </el-button>
      <el-button size="small" @click="onClose">
        {{ $t("common.close") }}
      </el-button>
    </div>
    <div class="orange-box" style="color: red">
      {{ $t("rechargeMy.flowTip1") }}
    </div>
  </div>
</template>

<script>
import DeviceBox from "@/components/DeviceBox";
import {
  loadOriginCardPrice,
  doRechargeCard,
  doSearchRechargeDevice,
  loadRechargeCardStorge,
  loadCardNumber
} from "@/api/card.js";
export default {
  name: "CardTab",
  props: {
    isCard: {
      type: Boolean,
      default: false
    }
  },
  components: {
    "device-box": DeviceBox
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    isCardShow: false,
    card: {
      //充值卡信息
      pkId: "",
      rechargeCardNum: "",
      rechargeCardPwd: "",
      userId: 1,
      deviceImei: "",
      packageId: 1,
      remark: "",
      cardStatus: 1,
      createTime: new Date().format("yyyy-MM-dd"),
      rechargeTime: new Date().getTime()
    },
    packageList: [],
    selectPackage: {
      isDataFee: 0,
      isPlatfromFee: 0
    },
    rechargeInfo: {
      //充值信息
      deviceImei: "",
      deviceName: "",
      note: "",
      userExpire: 0,
      userExpire1: 0,
      platformExpire: 0,
      platformExpire1: 0,
      flowExpiry: 0,
      flowExpiry1: 0
    },
    isDeviceBox2: false,
    cardList: [],
    selectVal: 0,
    pager: {
      current: 1,
      limit: 10,
      num: 1,
      total: 0
    },
    device: {},
    isLoading: false,
    isFlowError: false,
    isLonglife: false,
    isfrcType: false,
    platformExpire12: "",
    isKeight: false
  }),
  watch: {
    selectVal() {
      this.pager.current = 1;
      this.loadRecharge();
    },
    card() {
      if (this.device.deviceImei && !this.isLoading && this.isCard) {
        this.onRechargeDev(JSON.parse(JSON.stringify(this.device)));
      }
    },
    device() {
      const model = this.device.item.refillType;
      if (model == 4) {
        this.isKeight = true;
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      // console.log("vale", val);
      this.pager.current = val;
      this.loadRecharge();
    },
    getPackage(packageId) {
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.packageList[i].packageId == packageId) {
          return this.packageList[i];
        }
      }
      return {};
    },
    getCardType(packageId) {
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.packageList[i].packageId == packageId) {
          return this.packageList[i].text;
        }
      }
      return "";
    },
    chooseItem(item) {
      //选中流量充值卡列表
      this.card = item;
      this.selectPackage = this.getPackage(item.packageId);
      this.isCardShow = false;
    },
    resetRechargeCard() {
      //关闭对话框清空数据
      this.selectPackage = {
        isDataFee: 0,
        isPlatfromFee: 0
      };
      this.rechargeInfo = {
        deviceImei: "",
        deviceName: "",
        note: "",
        userExpire: "",
        userExpire1: 0,
        platformExpire: "",
        platformExpire1: 0,
        flowExpiry: "",
        flowExpiry1: 0
      };
      this.card = {
        pkId: "",
        rechargeCardNum: "",
        rechargeCardPwd: "",
        userId: 1,
        deviceImei: "",
        packageId: 1,
        remark: "",
        cardStatus: 1,
        createTime: new Date().format("yyyy-MM-dd"),
        rechargeTime: new Date().getTime()
      };
    },
    showDevice(item) {
      //搜索设备
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: item.deviceImei
      });
    },
    onClose() {
      this.$emit("close-card");
      this.resetRechargeCard();
    },
    onRechargeDevCard() {
      //设备充值
      if (!this.rechargeInfo.deviceImei || !this.card.rechargeCardNum) {
        // console.log(this.rechargeInfo.deviceImei);
        // console.log(this.card.rechargeCardNum);
        return;
      }
      // console.log("122223");
      this.isLoading = true;
      var data = {
        pkId: this.card.pkId,
        rechargeCardNum: this.card.rechargeCardNum,
        rechargeCardPwd: this.card.rechargeCardPwd,
        userId: this.rootUser.userId,
        deviceImei: this.rechargeInfo.deviceImei,
        packageId: this.card.packageId,
        remark: this.rechargeInfo.note,
        cardStatus: this.card.cardStatus,
        userExpire:
          this.rechargeInfo.userExpire1 > 0
            ? new Date(this.rechargeInfo.userExpire1).getTime()
            : new Date(this.rechargeInfo.userExpire).getTime(),
        platformExpire:
          this.rechargeInfo.platformExpire1 > 0
            ? new Date(this.rechargeInfo.platformExpire1).getTime()
            : new Date(this.rechargeInfo.platformExpire).getTime(),
        flowExpire:
          this.rechargeInfo.flowExpiry1 > 0
            ? new Date(this.rechargeInfo.flowExpiry1).getTime()
            : 0,
        platformPreExpire: this.platformExpire12
      };
      if (this.device.item.refillType == "4") {
        data.platformExpire = new Date("2049-01-01").getTime();
        var dt1 = new Date(this.rechargeInfo.userExpire);
        var dt2 = new Date(dt1.setFullYear(dt1.getFullYear() + 1)).getTime();
        // console.log(dt2);
        data.flowExpire = dt2;
      }
      // platformExpire 平台到期 flowExpire 流量到期 userExpire 用户到期

      // console.log(data);
      doRechargeCard(data).then(res => {
        if (res.errCode == "200") {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeMy.deviceRechargeOk")
          );
          this.loadRecharge();
          this.onClose();
          this.app.$emit("load-recharge-list");
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("rechargeMy.deviceRechargeFail") +
              (res.errMsg ? ":" + res.errMsg : "")
          );
        }
        this.isLoading = false;
      });
    },
    onRechargeCard() {
      //设备充值
      // console.log("123");
      if (
        this.selectPackage.isDataFee == 1 &&
        this.rechargeInfo.flowExpiry1 == 0
      ) {
        var that = this;
        this.app.$emit(
          "show-confirm-msg",
          this.$t("rechargeMy.noICCIDTip"),
          function() {
            that.onRechargeDevCard();
          }
        );
        return;
      }

      // console.log(this.device.item);
      if (this.device.item.refillType == 4) {
        // 判断是否是k8系列的设备
        if (
          this.selectPackage.text == "一年流量" ||
          this.selectPackage.text == "一年平台，一年流量"
        ) {
          this.onRechargeDevCard();
          return "";
        } else {
          this.app.$emit("show-alert-msg", this.$t("rechargeMy.kEight"));
          return;
        }
      }
      if (this.device.item.refillType == 0 && this.selectPackage.type == 0) {
        switch (this.selectPackage.packageId) {
          case 3:
            if (
              new Date(this.rechargeInfo.flowExpiry).getTime() <=
              new Date("2037-01-01 00:00:00").getTime()
            ) {
              // this.app.$emit("show-confirm-msg", this.$t("rechargeMy.cardOk3"), () => {
              this.onRechargeDevCard();
              console.log("3：一年流量");
              // });
            }
            break;
          case 2:
            if (
              new Date(this.rechargeInfo.platformExpire).getTime() <=
                new Date("2037-01-01 00:00:00").getTime() ||
              new Date(this.rechargeInfo.userExpire).getTime() <=
                new Date("2037-01-01 00:00:00").getTime()
            ) {
              // this.app.$emit("show-confirm-msg", this.$t("rechargeMy.cardOk2"), () => {
              this.onRechargeDevCard();
              console.log("2：一年平台");
              // });
            }
            break;
          case 1:
            if (
              new Date(this.rechargeInfo.flowExpiry).getTime() <=
                new Date("2037-01-01 00:00:00").getTime() ||
              new Date(this.rechargeInfo.userExpire).getTime() >=
                new Date("2037-01-01 00:00:00").getTime() ||
              new Date(this.rechargeInfo.platformExpire).getTime() >=
                new Date("2037-01-01 00:00:00").getTime()
            ) {
              // this.app.$emit("show-confirm-msg", this.$t("rechargeMy.cardOk1"), () => {
              this.onRechargeDevCard();
              console.log("1:一年流量一年平台");
              // });
            }
            break;
          case 4:
            if (
              new Date(this.rechargeInfo.flowExpiry).getTime() <=
                new Date("2037-01-01 00:00:00").getTime() ||
              new Date(this.rechargeInfo.userExpire).getTime() <=
                new Date("2037-01-01 00:00:00").getTime()
            ) {
              // this.app.$emit("show-confirm-msg", this.$t("rechargeMy.cardOk4"), () => {
              this.onRechargeDevCard();
              console.log("4：终身平台");
              // });
            }
            break;
        }
      } else if (
        this.device.item.refillType == 1 &&
        this.selectPackage.type == 1
      ) {
        // this.app.$emit("show-confirm-msg", this.$t("rechargeMy.cardOk5"), () => {
        this.onRechargeDevCard();
        console.log("5:风控卡");
        return "";
        // });
      } else if (
        this.device.item.refillType == 2 &&
        this.selectPackage.type == 2
      ) {
        this.app.$emit(
          "show-confirm-msg",
          this.$t("rechargeMy.cardOk6"),
          () => {
            this.onRechargeDevCard();
            console.log("5:蓝牙卡");
            return "";
          }
        );
      } else if (
        this.device.item.refillType == 3 &&
        this.selectPackage.type == 3
      ) {
        this.app.$emit(
          "show-confirm-msg",
          this.$t("rechargeMy.cardOk7"),
          () => {
            this.onRechargeDevCard();
            console.log("5:手持卡");
            return "";
          }
        ); //以下是判断不匹配的情况
      } else if (
        this.device.item.refillType == 1 &&
        this.selectPackage.type != 1
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.frcCard"));
        return "";
      } else if (
        this.device.item.refillType == 0 &&
        this.selectPackage.type != 0
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.standardCard"));
        return "";
      } else if (
        this.device.item.refillType == 2 &&
        this.selectPackage.type != 2
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.bluetoothCard"));
        return "";
      } else if (
        this.device.item.refillType == 3 &&
        this.selectPackage.type != 3
      ) {
        this.app.$emit("show-alert-msg", this.$t("rechargeMy.handleCard"));
        return "";
      }

      // this.onRechargeDevCard();
    },
    dateAddYear(data, years) {
      // console.log(data);
      var now = new Date(data);
      var intYear = now.getFullYear() + parseInt(years);
      var intMonth = now.getMonth() + 1; //正常的月份，
      // var intDay = now.getDate() - 1; //日期-1
      var intDay = now.getDate();
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
      // console.log(strEndDate);
      return strEndDate;
    },
    getiSLeapYear(data) {
      // 判断是否是闰年
      var years = new Date(data).getFullYear();
      if ((years % 4 == 0 && !(years % 100 == 0)) || years % 400 == 0) {
        return true;
      } else {
        return false;
      }
    },
    onRechargeDev(item) {
      console.log(item);
      this.platformExpire12 = new Date(item.item.platformExpire).getTime();
      //选中充值设备
      this.isLonglife = false;
      this.isFlowError = false;
      // 是否已经充值了风控卡
      this.isfrcType = false;
      this.device = item;
      this.rechargeInfo.deviceImei = item.deviceImei;
      this.rechargeInfo.deviceName = item.deviceName;

      var afterTime = 0;

      if (this.card.packageId == 4) {
        afterTime =
          new Date("2037-12-31 00:00").getTime() -
          new Date(item.item.platformExpire + " 00:00:00").getTime();
      } else {
        afterTime = 365 * 24 * 3600000;
      }

      if (item.item.userExpire && item.item.platformExpire) {
        // 这是平台或者一年流量一年平台的判断
        this.rechargeInfo.userExpire = item.item.userExpire;
        this.rechargeInfo.platformExpire = item.item.platformExpire;
        if (this.selectPackage.isPlatfromFee == 1) {
          if (
            new Date(item.item.platformExpire).getTime() >=
              new Date("2037-01-01 00:00").getTime() ||
            new Date(item.item.userExpire).getTime() >=
              new Date("2037-01-01 00:00").getTime()
          ) {
            this.isLonglife = true;
            this.rechargeInfo.userExpire1 = new Date(
              "2037-12-31 00:00"
            ).getTime();
            this.rechargeInfo.platformExpire1 = new Date(
              "2037-12-31 00:00"
            ).getTime();
          } else {
            if (this.card.packageId == 4) {
              this.rechargeInfo.userExpire1 = new Date(
                "2037-12-31 00:00"
              ).getTime();
              this.rechargeInfo.platformExpire1 = new Date(
                "2037-12-31 00:00"
              ).getTime();
            } else {
              if (this.getiSLeapYear(item.item.platformExpire)) {
                afterTime = 366 * 24 * 3600000;
              }
              var userExpire1 =
                new Date(item.item.userExpire).getTime() > new Date().getTime()
                  ? new Date(item.item.userExpire).getTime() + afterTime
                  : new Date().getTime() + afterTime;
              var platformExpire1 =
                new Date(item.item.platformExpire).getTime() >
                new Date().getTime()
                  ? new Date(item.item.platformExpire).getTime() + afterTime
                  : new Date().getTime() + afterTime;
              this.rechargeInfo.userExpire1 = new Date(
                new Date(userExpire1).getFullYear() +
                  "-" +
                  (new Date(item.item.userExpire).getMonth() + 1) +
                  "-" +
                  new Date(item.item.userExpire).getDate() +
                  " 00:00:00"
              ).getTime();
              this.rechargeInfo.platformExpire1 = new Date(
                new Date(platformExpire1).getFullYear() +
                  "-" +
                  (new Date(item.item.platformExpire).getMonth() + 1) +
                  "-" +
                  new Date(item.item.platformExpire).getDate() +
                  " 00:00:00"
              ).getTime();
              // 2022-8-18
              // if (new Date(item.item.userExpire).getTime() > new Date().getTime()) {
              //   this.rechargeInfo.userExpire1 = new Date(this.dateAddYear(item.item.userExpire, 1)).getTime();
              // } else {
              //   this.rechargeInfo.userExpire1 = new Date(this.dateAddYear(new Date().format("yyyy-MM-dd"), 1)).getTime();
              // }
              // if (new Date(item.item.platformExpire).getTime() > new Date().getTime()) {
              //   this.rechargeInfo.platformExpire1 = new Date(this.dateAddYear(item.item.platformExpire, 1)).getTime();
              // } else {
              //   this.rechargeInfo.platformExpire1 = new Date(this.dateAddYear(new Date().format("yyyy-MM-dd"), 1)).getTime();
              // }
              // // 如果用户时间大于平台时间就直接按平台时间提交
              if (
                this.rechargeInfo.userExpire1 >
                this.rechargeInfo.platformExpire1
              ) {
                this.rechargeInfo.userExpire1 = this.rechargeInfo.platformExpire1;
              }
            }
          }
        } else {
          this.rechargeInfo.platformExpire1 = item.item.platformExpire;
          this.rechargeInfo.userExpire1 = item.item.userExpire;
        }
      }

      if (
        item.item.iccid_no &&
        (item.item.flowExpiry && item.item.flowExpiry != "null")
      ) {
        // 这是流量卡的判断
        this.rechargeInfo.flowExpiry = item.item.flowExpiry;
        // console.log(this.rechargeInfo.flowExpiry);
        if (this.selectPackage.isDataFee == 1) {
          // 2021-2-27判断设备平台的时间是否大于等于，如果是就显示并禁掉提交功能
          if (
            new Date(item.item.platformExpire).getTime() >=
              new Date("2037-01-01 00:00").getTime() ||
            new Date(item.item.userExpire).getTime() >=
              new Date("2037-01-01 00:00").getTime()
          ) {
            this.isLonglife = true;
          }
          if (item.item.refillType == 4) {
            this.isLonglife = false;
          }
          if (this.getiSLeapYear(item.item.flowExpiry)) {
            afterTime = 366 * 24 * 3600000;
          }
          var flowExpiry1 =
            new Date(item.item.flowExpiry).getTime() > new Date().getTime()
              ? new Date(item.item.flowExpiry).getTime() + afterTime
              : new Date().getTime() + afterTime;
          this.rechargeInfo.flowExpiry1 = new Date(
            new Date(flowExpiry1).getFullYear() +
              "-" +
              (new Date(item.item.flowExpiry).getMonth() + 1) +
              "-" +
              new Date(item.item.flowExpiry).getDate() +
              " 00:00:00"
          ).getTime();
        } else {
          this.rechargeInfo.flowExpiry1 = item.item.flowExpiry;
        }
      } else if (this.selectPackage.isDataFee == 1) {
        this.rechargeInfo.flowExpiry = 0;
        this.rechargeInfo.flowExpiry1 = 0;
        this.isFlowError = true;
      }
      //2021-2-26设置为风控卡的时间显示
      if (item.item.iccid_no && item.item.refillType == 1) {
        this.rechargeInfo.flowExpiry = item.item.flowExpiry;
        if (this.selectPackage.isDataFee == 1) {
          if (this.getiSLeapYear(item.item.flowExpiry)) {
            afterTime = 366 * 24 * 3600000;
          }
          var flowExpiry2 =
            new Date(item.item.flowExpiry).getTime() > new Date().getTime()
              ? new Date(item.item.flowExpiry).getTime() + afterTime
              : new Date().getTime() + afterTime;
          this.rechargeInfo.flowExpiry1 = new Date(
            new Date(flowExpiry2).getFullYear() +
              "-" +
              (new Date(item.item.flowExpiry).getMonth() + 1) +
              "-" +
              new Date(item.item.flowExpiry).getDate() +
              " 00:00:00"
          ).getTime();
        } else {
          this.rechargeInfo.flowExpiry1 = item.item.flowExpiry;
        }
        this.isFlowError = false;
      }

      // 2021-6-9新增的k8卡判断
      if (
        item.item.userExpire &&
        item.item.platformExpire &&
        item.item.refillType == 4
      ) {
        // console.log("12");
        this.isLonglife = false;
        var dt1 = new Date(item.item.userExpire);
        var dt2 = new Date(dt1.setFullYear(dt1.getFullYear() + 1)).getTime();
        this.rechargeInfo.userExpire1 = dt2;
        this.rechargeInfo.userExpire = item.userExpire;
      }
      // 流量的判断没有平台到期的概念
      if (this.selectPackage.text == "一年流量") {
        this.isLonglife = false;
      }
    },
    onCardTab(op) {
      // console.log(op);
      this.isLonglife = false;
      this.isFlowError = false;
      this.isKeight = false;
      this.rechargeInfo = {
        deviceImei: "",
        deviceName: "",
        note: "",
        userExpire: "",
        userExpire1: 0,
        platformExpire: "",
        platformExpire1: 0,
        flowExpiry: "",
        flowExpiry1: 0
      };
      this.selectPackage = op.package;
      this.card = op.card;
      this.packageList = op.packageList;
    },
    dealDevDetail(imei) {
      // console.log(imei);
      this.isLonglife = false;
      this.isFlowError = false;
      this.isKeight = false;
      this.rechargeInfo.deviceImei = imei;
      this.isLoading = true;
      doSearchRechargeDevice({ key: imei }).then(res => {
        if (res.errCode == "200") {
          var data = res.data;
          var item = data[0];
          var device = {
            deviceImei: item.deviceImei,
            deviceName: item.name,
            item: item
          };
          this.device = device;
          this.onRechargeDev(device);
        }
        this.isLoading = false;
      });
    },
    listenEvent() {
      this.app.$on("device-dialog", this.dealDevDetail);
      this.app.$on("show-card-tab", this.onCardTab);
    },
    offEvent() {
      this.app.$off("device-dialog", this.dealDevDetail);
      this.app.$off("show-card-tab", this.onCardTab);
    },
    loadRecharge() {
      //加载充值数据表

      var that = this;
      var data = {
        userId: this.rootUser.userId,
        pageNum: this.pager.current,
        pageSize: this.pager.limit,
        cardStatus: 0
      };
      if (this.selectVal) {
        data.packageId = this.selectVal;
      }
      loadRechargeCardStorge(data).then(res => {
        if (res.errCode == "200") {
          that.cardList = res.data.list;
          that.pager.num = Math.ceil(res.data.total / that.pager.limit);
        }
      });
    },
    getCardNum() {
      //获取剩余充值卡
      loadCardNumber({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == "200") {
          // console.log(res);
          // console.log(that.isEmptyObject(res.data));
          if (this.isEmptyObject(res.data)) {
            return;
          }
          var list = res.data.cardNumStr.split(";");
          var theList = [];
          for (let i = 0; i < list.length; i++) {
            if (list[i]) {
              let item = list[i].split(",");
              theList.push({
                packageId: parseInt(item[0]),
                num: parseInt(item[1])
              });
            }
          }
          var resultList = JSON.parse(JSON.stringify(this.packageList));
          for (let i = 0; i < resultList.length; i++) {
            var enable = false,
              num = 0;
            for (let j = 0; j < theList.length; j++) {
              if (theList[j].packageId == resultList[i].packageId) {
                enable = true;
                num = theList[j].num;
                break;
              }
            }
            resultList[i].num = num;
            resultList[i].enable = enable;
          }
          this.packageList = resultList;
        }
      });
    },

    getOriginPrice() {
      loadOriginCardPrice().then(res => {
        if (res.errCode == "200") {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            let {
              cardId,
              type,
              cardName,
              mainPrice,
              isDataFee,
              isPlatfromFee
            } = res.data[i];
            list.push({
              packageId: cardId,
              text: cardName,
              price: parseInt(mainPrice) * 0.01,
              enable: false,
              isDataFee: isDataFee,
              isPlatfromFee: isPlatfromFee,
              num: 0,
              type: type
            });
          }

          this.packageList = list;
          this.getCardNum();
        }
      });
    }
  },
  mounted() {
    this.listenEvent();
    if (this.isCard) {
      // console.log(new Date(0).getTime());
      this.getOriginPrice();
      this.loadRecharge();
    }
  },
  beforeDestroy() {
    this.offEvent();
    this.resetRechargeCard();
  }
};
</script>

<style scoped lang="scss">
.content-middle {
  display: flex;
  align-items: center;
}
.card-tab {
  .form-table {
    ::v-deep .el-input__icon {
      height: 32px !important;
    }
  }
}
</style>
