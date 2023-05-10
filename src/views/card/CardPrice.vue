<template>
  <div class="card-price-content layout-container" style="flex-direction: row">
    <!-- 用户树 -->
    <div class="form-card1 body-content-left">
      <div class="card-header">{{ $t("common.myCustomer") }}</div>
      <div class="card-body2">
        <user-tree
          @usertree-select="dealUserTree"
          :user-id.sync="userId"
        ></user-tree>
      </div>
    </div>
    <!-- 价目表 -->
    <div class="form-card1 body-content-right">
      <div
        class="card-header"
        style="display: flex; justify-content: space-between"
      >
        <div>
          <span style="color: red">{{ userName }}</span>
          {{ $t("card.cardPrice") }}
        </div>
        <div>
          <el-button
            type="primary"
            @click="addPriceType"
            v-show="userId == 1"
            >{{ $t("card.rechargeCard") }}</el-button
          >
        </div>
      </div>
      <div class="card-body" style="overflow-x: hidden; overflow-y: auto">
        <!-- 原始售价 -->
        <ul class="select-tabs1">
          <li class="active active-price">{{ $t("card.originPrice") }}</li>
        </ul>
        <!-- 充值卡类型tab start -->
        <div class="card-header" style="border-bottom: none">
          <el-tabs v-model="selectTab" @tab-click="changeTab">
            <el-tab-pane
              v-for="(item, idx) in packageListType"
              :key="'packType' + idx"
              :name="item.idx"
              :label="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 充值卡类型tab end -->
        <table class="form-table1" style="margin: 20px 12px">
          <!-- type == 0 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'packageList' + idx"
            v-show="item.type == 0 && selectTab == '0'"
          >
            <td>
              <!-- <span style="margin:0 8px;display:inline-block">({{ item.packageId }})</span> -->
              {{ item.text }}:
            </td>
            <td>
              ￥
              <el-input
                clearable
                style="width: 200px"
                v-model.number="item.price"
                :disabled="!isChangePrice"
              />
            </td>
          </tr>
          <!-- type == 1 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'packageList1' + idx"
            v-show="item.type == 1 && selectTab == '1'"
          >
            <td>
              <!-- <span style="margin:0 8px;display:inline-block">({{ item.packageId }})</span> -->
              {{ item.text }}:
            </td>
            <td>
              ￥
              <el-input
                clearable
                style="width: 200px"
                type="text"
                v-model.number="item.price"
                :disabled="!isChangePrice"
              />
            </td>
          </tr>
          <!-- type == 2 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'packageList2' + idx"
            v-show="item.type == 2 && selectTab == '2'"
          >
            <td>
              <!-- <span style="margin:0 8px;display:inline-block">({{ item.packageId }})</span> -->
              {{ item.text }}:
            </td>
            <td>
              ￥
              <el-input
                clearable
                style="width: 200px"
                type="text"
                v-model.number="item.price"
                :disabled="!isChangePrice"
              />
            </td>
          </tr>
          <!-- 3 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'packageList3' + idx"
            v-show="item.type == 3 && selectTab == '3'"
          >
            <td>
              <!-- <span style="margin:0 8px;display:inline-block">({{ item.packageId }})</span> -->
              {{ item.text }}:
            </td>
            <td>
              ￥
              <el-input
                clearable
                style="width: 200px"
                type="text"
                v-model.number="item.price"
                :disabled="!isChangePrice"
              />
            </td>
          </tr>
          <tr>
            <td colspan="2" class="center">
              <el-button
                type="primary"
                size="small"
                @click="saveOriginPrice"
                :disabled="!isChangeDiscount"
                >{{ $t("common.save") }}</el-button
              >
              <el-button
                type="warning"
                size="small"
                @click="showCodeDialog('price')"
                >{{ $t("card.changePrice") }}</el-button
              >
            </td>
          </tr>
        </table>

        <!-- 折扣 -->
        <ul class="select-tabs1">
          <li class="active active-price">{{ $t("card.discount") }}</li>
        </ul>
        <table class="form-table1" style="margin: 20px 12px">
          <tr>
            <td colspan="2" class="center">
              <el-checkbox v-model="isRechargeCard" :disabled="userType == 1">{{
                $t("userDetail.isOpenCard")
              }}</el-checkbox>
              <div style="color: red; font-size: 12px" v-show="userType == 1">
                {{ $t("card.userCannotRecharge") }}
              </div>
            </td>
          </tr>
          <tr class="user-kind">
            <td>{{ $t("card.userKind") }}:</td>
            <td>
              <!-- <input type="radio" v-model="userKind" class="text-input" value="A" :disabled="!isRechargeCard" /><span>1{{ this.$t("card.kindDealer") }}</span>
              <input type="radio" v-model="userKind" class="text-input" value="B" :disabled="!isRechargeCard" /><span>2{{ this.$t("card.kindDealer") }}</span>
              <input type="radio" v-model="userKind" class="text-input" value="C" :disabled="!isRechargeCard" /><span>3{{ this.$t("card.kindDealer") }}</span> -->
              <el-radio v-model="userKind" label="A" :disabled="!isRechargeCard"
                >1{{ this.$t("card.kindDealer") }}</el-radio
              >
              <el-radio v-model="userKind" label="B" :disabled="!isRechargeCard"
                >2{{ this.$t("card.kindDealer") }}</el-radio
              >
              <el-radio v-model="userKind" label="C" :disabled="!isRechargeCard"
                >3{{ this.$t("card.kindDealer") }}</el-radio
              >
            </td>
          </tr>
          <!-- type == 0 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'discount' + idx"
            v-show="item.type == 0 && selectTab == '0'"
          >
            <td>
              <!-- <input class="text-input" type="checkbox" v-model="item.enable" :disabled="!isRechargeCard" />
              {{ item.text }}{{ $t("card.discount") }}: -->
              <el-checkbox v-model="item.enable" :disabled="!isRechargeCard"
                >{{ item.text }}{{ $t("card.discount") }}:</el-checkbox
              >
            </td>
            <td>
              <el-input
                clearable
                style="width: 200px"
                v-model.number="item.discount"
                :disabled="!isChangeDiscount ? true : !item.enable"
              />%
            </td>
          </tr>
          <!-- type == 1 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'discount1' + idx"
            v-show="item.type == 1 && selectTab == '1'"
          >
            <td>
              <el-checkbox v-model="item.enable" :disabled="!isRechargeCard"
                >{{ item.text }}{{ $t("card.discount") }}:</el-checkbox
              >
            </td>
            <td>
              <el-input
                clearable
                style="width: 200px"
                v-model.number="item.discount"
                :disabled="!isChangeDiscount ? true : !item.enable"
              />%
            </td>
          </tr>
          <!-- type == 2 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'discount2' + idx"
            v-show="item.type == 2 && selectTab == '2'"
          >
            <td>
              <el-checkbox v-model="item.enable" :disabled="!isRechargeCard"
                >{{ item.text }}{{ $t("card.discount") }}:</el-checkbox
              >
            </td>
            <td>
              <el-input
                clearable
                style="width: 200px"
                v-model.number="item.discount"
                :disabled="!isChangeDiscount ? true : !item.enable"
              />%
            </td>
          </tr>
          <!-- type == 3 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'discount3' + idx"
            v-show="item.type == 3 && selectTab == '3'"
          >
            <td>
              <el-checkbox v-model="item.enable" :disabled="!isRechargeCard"
                >{{ item.text }}{{ $t("card.discount") }}:</el-checkbox
              >
            </td>
            <td>
              <el-input
                clearable
                style="width: 200px"
                v-model.number="item.discount"
                :disabled="!isChangeDiscount ? true : !item.enable"
              />%
            </td>
          </tr>

          <tr>
            <td colspan="2" class="center">
              <el-button
                type="primary"
                size="small"
                @click="saveUserDiscount"
                :disabled="!isChangeDiscount"
                >{{ $t("common.save") }}</el-button
              >
              <el-button
                type="warning"
                size="small"
                @click="showCodeDialog('discount')"
                >{{ $t("card.changeDiscount") }}</el-button
              >
            </td>
          </tr>
        </table>

        <!-- 售价 -->
        <ul class="select-tabs1">
          <li class="active active-price">
            {{ $t("rechargePrice.salePrice") }}
          </li>
        </ul>
        <table class="form-table1" style="margin: 20px 12px">
          <!-- 0 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'sale0' + idx"
            v-show="item.enable && item.type == 0 && selectTab == '0'"
          >
            <td>{{ item.text }}:</td>
            <td>￥{{ (item.price * item.discount * 0.01) | fmoney }}</td>
          </tr>
          <!-- 1 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'sale1' + idx"
            v-show="item.enable && item.type == 1 && selectTab == '1'"
          >
            <td>{{ item.text }}:</td>
            <td>￥{{ (item.price * item.discount * 0.01) | fmoney }}</td>
          </tr>
          <!-- 2 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'sale2' + idx"
            v-show="item.enable && item.type == 2 && selectTab == '2'"
          >
            <td>{{ item.text }}:</td>
            <td>￥{{ (item.price * item.discount * 0.01) | fmoney }}</td>
          </tr>
          <!-- 3 -->
          <tr
            v-for="(item, idx) in packageList"
            :key="'sale3' + idx"
            v-show="item.enable && item.type == 3 && selectTab == '3'"
          >
            <td>{{ item.text }}:</td>
            <td>￥{{ (item.price * item.discount * 0.01) | fmoney }}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 验证码 -->
    <dialog-comp
      :dialog-width="350"
      :visible.sync="isChangeDialog"
      :dialog-title="$t('card.vertifyCode')"
    >
      <table class="form-table" style="margin: 0 auto">
        <tr>
          <td><el-input v-model="vertifyCode" /></td>
          <td>
            <el-button
              type="primary"
              @click="onSendCode()"
              :disabled="!isSendable"
              >{{
                isSendable
                  ? $t("card.sendCode")
                  : refreshTime + $t("card.resendCode")
              }}</el-button
            >
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <el-button type="warning" @click="onCheckCode()">{{
              $t("common.submit")
            }}</el-button>
          </td>
        </tr>
      </table>
    </dialog-comp>
    <!-- 添加充值卡类型 2021-3-27-->
    <dialog-comp
      :dialog-width="500"
      :visible.sync="isTypeDialog"
      :dialog-title="'充值卡类型添加'"
    >
      <table class="form-table card-type" style="margin: 0 auto">
        <tr>
          <td>{{ $t("card.cardName") }}：</td>
          <td>
            <el-input
              clearable
              style="width: 200px"
              v-model="addCardType.cardName"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("card.mainPrice") }}：</td>
          <td>
            <el-input
              clearable
              style="width: 200px"
              v-model="addCardType.mainPrice"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("card.isActive") }}：</td>
          <td>
            <!-- <input type="radio" style="margin-right:5px" class="text-input" value="1" v-model="addCardType.isActive" />{{ $t("card.no")
            }}<input type="radio" class="text-input" value="0" style="margin:0 5px 0 5px;" v-model="addCardType.isActive" />{{ $t("card.yes") }} -->
            <el-radio v-model="addCardType.isActive" label="1">{{
              $t("card.no")
            }}</el-radio>
            <el-radio v-model="addCardType.isActive" label="0   ">{{
              $t("card.yes")
            }}</el-radio>
          </td>
        </tr>
        <tr>
          <td>{{ $t("card.isPlatfromFee") }}：</td>
          <el-checkbox v-model="addCardType.isPlatfromFee"></el-checkbox>
        </tr>
        <tr>
          <td>{{ $t("card.platfromMonth") }}：</td>
          <el-input
            clearable
            style="width: 200px"
            v-model="addCardType.platfromMonth"
          />
        </tr>
        <tr>
          <td>{{ $t("card.isDataFee") }}：</td>
          <el-checkbox v-model="addCardType.isDataFee"></el-checkbox>
        </tr>
        <tr>
          <td>{{ $t("card.dataMonth") }}：</td>
          <el-input
            clearable
            style="width: 200px"
            v-model="addCardType.dataMonth"
          />
        </tr>
        <tr>
          <td>{{ $t("card.cardType") }}：</td>
          <el-select style="width: 200px" v-model="addCardType.type">
            <el-option
              v-for="(item, idx) in $t('card.cardTypeList')"
              :key="'cardType' + idx"
              :value="item.type"
              :label="item.name"
            ></el-option>
          </el-select>
        </tr>
        <tr>
          <td>{{ $t("common.note") }}：</td>
          <el-input
            clearable
            style="width: 200px"
            v-model="addCardType.remark"
          />
        </tr>
        <tr>
          <td colspan="4">
            <el-button
              type="primary"
              size="small"
              style="margin-top: 8px; width: 80px"
              @click="addCard"
              >{{ $t("common.save") }}</el-button
            >
          </td>
        </tr>
      </table>
    </dialog-comp>
  </div>
</template>

<script>
import userTree from "@/components/UserTree/UserTree";
import {
  addRechargeCard,
  sendPhoneCode,
  checkPhoneCode,
  loadOriginCardPrice,
  saveOriginCardPrice,
  getUserCardDiscountInfo,
  saveUserCardDiscountInfo
} from "@/api/card.js";
import { getUserTreeInfo } from "@/api/customer.js";
export default {
  name: "CardPrice",
  components: {
    "user-tree": userTree
  },
  data: () => ({
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    userName: JSON.parse(window.localStorage.getItem("carweb_user")).userName,

    isRechargeCard: true,
    packageList: [],
    userKind: "",
    userType: JSON.parse(window.localStorage.getItem("carweb_user")).userType,
    isChangeDialog: false,
    isChangePrice: false,
    isChangeDiscount: false,
    vertifyCode: "",
    codePhone: "18922219090", //"18922219090"
    refreshInterval: null,
    refreshTime: 59,
    isSendable: true,
    changeType: "",
    packageListType: [],
    selectTab: "0", //当前tab
    isTypeDialog: false,
    addCardType: {
      cardName: "",
      mainPrice: "",
      isActive: 0,
      isPlatfromFee: 0,
      platfromMonth: 0,
      isDataFee: 0,
      dataMonth: 0,
      type: "",
      remark: ""
    }
    // originCardTypeList: [],
  }),
  watch: {
    isRechargeCard() {
      if (!this.isRechargeCard) {
        this.yearDiscount = 100;
        this.lifeDiscount = 100;
      }
    }
  },
  methods: {
    addCard() {
      // 添加充值卡
      var data = {
        cardId: this.packageList[this.packageList.length - 1].packageId + 1,
        cardName: this.addCardType.cardName,
        mainPrice: this.addCardType.mainPrice * 100,
        isActive: this.addCardType.isActive,
        remark: this.addCardType.remark,
        isPlatfromFee: this.addCardType.isPlatfromFee ? 1 : 0,
        platfromMonth: this.addCardType.platfromMonth,
        isDataFee: this.addCardType.isDataFee ? 1 : 0,
        dataMonth: this.addCardType.dataMonth,
        type: this.addCardType.type
      };
      // console.log(data);
      addRechargeCard(data).then(res => {
        if (res.errCode == 200) {
          this.getOriginPrice();
          this.getUserDiscount();
          this.app.$emit("show-alert-msg", this.$t("card.addCardTip"));
          this.isTypeDialog = false;
        } else {
          this.app.$emit("show-alert-msg", this.$t("card.addCardFailTip"));
        }
      });
    },
    addPriceType() {
      this.isTypeDialog = true;
      this.addCardType = {
        cardName: "",
        mainPrice: "",
        isActive: 0,
        isPlatfromFee: 0,
        platfromMonth: 0,
        isDataFee: 0,
        dataMonth: 0,
        type: "",
        remark: ""
      };
    },
    changeTab(idx) {
      //改变tab对应的数据表格
      this.selectTab = idx.index;
    },
    showCodeDialog(tag) {
      this.isChangeDialog = true;
      if (this.changeType != tag) {
        this.isSendable = true;
      }
      this.changeType = tag;
    },
    onSendCode() {
      // 发送手机验证码
      var that = this;
      const data = {
        telephone: this.codePhone,
        codeType: this.changeType
      };
      sendPhoneCode(data).then(res => {
        if (res.errCode == "200") {
          that.app.$emit("show-alert-msg", that.$t("card.sendCodeOk"));
        } else {
          that.app.$emit(
            "show-alert-msg",
            that.$t("card.sendCodeFail") + res.errMsg ? res.errMsg : ""
          );
        }
      });
      if (this.refreshInterval) {
        this.refreshInterval = clearInterval(this.refreshInterval);
      }
      this.isSendable = false;
      this.refreshTime = 59;
      this.refreshInterval = setInterval(function() {
        if (that.refreshTime <= 0) {
          that.isSendable = true;
          that.refreshInterval = clearInterval(that.refreshInterval);
        } else {
          that.refreshTime--;
        }
      }, 1000);
    },
    onCheckCode() {
      // 验证手机验证码
      if (this.vertifyCode && this.vertifyCode.length == 6) {
        //
        const data = {
          telephone: this.codePhone,
          smscheck: this.vertifyCode,
          codeType: this.changeType
        };
        checkPhoneCode(data).then(res => {
          this.vertifyCode = "";
          if (res.errCode == "200") {
            this.app.$emit("show-alert-msg", this.$t("card.checkCodeOk"));
            this.isChangeDialog = false;
            if (this.changeType == "price") {
              this.isChangePrice = true;
            } else {
              this.isChangeDiscount = true;
            }

            if (this.refreshInterval) {
              this.refreshInterval = clearInterval(this.refreshInterval);
            }
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("card.checkCodeFail") + res.errMsg ? res.errMsg : ""
            );
          }
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("card.checkCodeTip"));
      }
    },
    getUserInfo() {
      // 获取用户的类型
      getUserTreeInfo({ userId: this.userId }).then(res => {
        if (res.errCode == 200) {
          this.userType = res.data.userType;
        }
      });
    },
    dealUserTree(userId, userName) {
      this.userId = userId;
      this.userName = userName;
      this.getUserInfo();
      this.getOriginPrice();
    },
    getOriginPrice() {
      loadOriginCardPrice().then(res => {
        if (res.errCode == "200") {
          var list = [];
          for (var i = 0; i < res.data.length; i++) {
            let { cardId, cardName, mainPrice, type } = res.data[i];
            list.push({
              packageId: cardId,
              text: cardName,
              price: parseInt(mainPrice) * 0.01,
              enable: false,
              discount: 100,
              type: type
            });
          }

          this.packageList = list;
          this.getPackageList(this.packageList);
          this.getUserDiscount();
        }
      });
    },
    saveOriginPrice() {
      var str = "";
      for (let i = 0; i < this.packageList.length; i++) {
        let { packageId, price } = this.packageList[i];
        str += packageId + "," + parseInt(price * 100) + ";";
      }
      saveOriginCardPrice({ cardType: str }).then(res => {
        this.isChangePrice = false;
        this.isSendable = true;
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("card.saveOriginOk"));

          this.getOriginPrice();
        } else {
          this.app.$emit("show-alert-msg", this.$t("card.saveOriginFail"));
        }
      });
    },
    getUserDiscount() {
      // 拿到用户的折扣
      //
      getUserCardDiscountInfo({ userId: this.userId }).then(res => {
        if (res.errCode == "200") {
          this.isRechargeCard = this.userId == 1 ? true : res.data.isRefillCard;
          this.userKind = res.data.levelType ? res.data.levelType : "";
          console.log(res);
          var list = res.data.cardTypeStr.split(";");
          var theList = [];
          for (let i = 0; i < list.length; i++) {
            if (list[i]) {
              let item = list[i].split(",");
              theList.push({
                packageId: parseInt(item[0]),
                discount: parseInt(item[1])
              });
            }
          }
          var resultList = JSON.parse(JSON.stringify(this.packageList));
          for (let i = 0; i < resultList.length; i++) {
            var enable = false,
              discount = 100;
            for (let j = 0; j < theList.length; j++) {
              if (theList[j].packageId == resultList[i].packageId) {
                enable = true;
                discount = theList[j].discount;
                break;
              }
            }
            resultList[i].discount = discount;
            resultList[i].enable = enable;
          }
          this.packageList = resultList;
        }
      });
    },
    saveUserDiscount() {
      var card = [],
        discountList = [];
      for (let i = 0; i < this.packageList.length; i++) {
        let { enable, packageId, discount } = this.packageList[i];
        if (enable) {
          card.push(packageId);
          discountList.push(packageId + "," + discount);
        }
      }
      var data = {
        level: this.userKind,
        isRechargeCard: this.isRechargeCard,
        userId: this.userId,
        cardType: card.join(","),
        discountStr: discountList.join(";")
      };
      //
      saveUserCardDiscountInfo(data).then(res => {
        this.isChangeDiscount = false;
        this.isSendable = true;
        if (res.errCode == "200") {
          this.app.$emit("show-alert-msg", this.$t("card.saveDiscountOk"));
          this.getUserDiscount();
        } else {
          this.app.$emit("show-alert-msg", this.$t("card.saveDiscountFail"));
        }
      });
    },
    getPackageList(list) {
      // var originList = [{ text: "车载", type: 0 }, { text: "风控", type: 1 }, { text: "蓝牙", type: 2 }, { text: "手持", type: 3 }];
      var originList = this.$t("card.cardTypeList");
      if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var type = item.type;
          var isExist = false;
          for (var j = 0; j < originList.length; j++) {
            var item1 = originList[j];
            if (item1.type == type) {
              isExist = true;
              break;
            }
          }
          if (isExist) {
            this.packageListType.push(item1);
          }
        }
        this.packageListType = this.packageListType.filter(
          (item, index, self) => {
            return self.indexOf(item) == index;
          }
        );
        return this.packageListType;
      }
    },
    listentEvent() {},
    offEvent() {}
  },

  mounted() {
    this.listentEvent();
    this.getOriginPrice();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.user-kind {
  span {
    vertical-align: middle;
  }
}
.card-body {
  .select-tabs1 {
    .active-price {
      border: none;
      border-bottom: solid 1px gainsboro;
    }
  }
}
.card-type {
  table.form-table > tbody > tr,
  table.form-table1 > tbody > tr,
  table.form-table > tr,
  table.form-table1 > tr {
    line-height: 30px;
  }
}
.body-content-left {
  height: 100%;
  width: 320px;
}
.body-content-right {
  width: calc(100% - 320px);
  margin-left: 10px;
  height: 100%;
}
</style>
