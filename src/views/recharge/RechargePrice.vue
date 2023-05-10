<template>
  <div class="recharge-price layout-container" style="flex-direction: row">
    <!--用户树 start-->
    <div class="form-card1 body-content-left">
      <div class="card-header">{{ $t("common.myCustomer") }}</div>
      <div class="card-body2">
        <user-tree
          @usertree-select="dealUserTree"
          :user-id.sync="userId"
        ></user-tree>
      </div>
    </div>
    <!--用户树 end-->
    <div class="form-card1 body-content-right" style="padding-left: 0">
      <div class="card-header">{{ $t("rechargePrice.seriesList") }}</div>
      <div class="card-body">
        <!--价目表操作 start-->
        <div class="left-right-box">
          <span class="left-box">
            <el-button type="primary" @click="loadPriceList">{{
              $t("common.refresh")
            }}</el-button>

            <!-- <span class="choose-type">{{ $t("rechargePrice.rechargeType") }}:</span>
            <el-select v-model="rechargeGoodsType" style="width: 150px" @change="rechargeGoodsTypeChange($event)">
              <el-option :value="-1" :label="$t('common.all')"></el-option>
              <el-option :value="1" :label="$t('rechargePrice.goodsType1')"></el-option>
              <el-option :value="2" :label="$t('rechargePrice.goodsType2')"></el-option>
            </el-select> -->
            <!-- 2022-4-20 筛选 -->
            <span class="choose-type"
              >{{ $t("rechargePrice.deviceRecharge") }}:</span
            >
            <el-select
              v-model="rechargeTypeChooseList.num"
              style="width: 140px"
              @change="rechargeTypeChooseChange($event)"
            >
              <el-option
                v-for="(item, idx) in rechargeTypeChooseList"
                :key="idx"
                :value="item.num"
                :label="item.name"
              ></el-option>
            </el-select>
            <span class="choose-type"
              >{{ $t("rechargePrice.rechargeType") }}:</span
            >
            <el-select
              v-model="rechargeGoodsTypeList.num"
              style="width: 140px"
              @change="rechargeGoodsTypeChange($event)"
            >
              <el-option
                v-for="(item, idx) in rechargeGoodsTypeList"
                :key="idx"
                :value="item.num"
                :label="item.name"
              ></el-option>
            </el-select>
            <!-- end -->
            <!-- end -->
          </span>
          <span class="right-box">
            <el-button
              class="btn-primary-button"
              @click="unlockPriceList"
              v-show="false"
              >{{ $t("rechargePrice.unlockList") }}</el-button
            >
            <el-button
              class="btn-primary-button"
              @click="userId == 1 ? showDialog() : showParent()"
              >{{ $t("rechargePrice.addSeries") }}</el-button
            >
            <el-button
              v-show="userId == 1"
              class="btn-primary-button"
              @click="showDialog1"
              >{{ $t("rechargePrice.addAudioSeries") }}</el-button
            >
            <el-button class="btn-primary-button" @click="savePrice">{{
              $t("common.save")
            }}</el-button>
          </span>
        </div>
        <!--价目表操作 end-->

        <div class="orange-box" style="line-height: 30px" v-html="tips"></div>
        <!--价目表-->
        <div style="height: calc(100% - 80px)">
          <data-table
            :data="priceList"
            style="min-width: 800px"
            :show-page="false"
          >
            <!--  -->
            <el-table-column
              :label="$t('rechargePrice.name')"
              prop="goodsName"
              width="120"
            ></el-table-column>
            <el-table-column
              :label="$t('rechargePrice.remark')"
              prop="remark"
              width="120"
            ></el-table-column>
            <el-table-column
              v-if="userId == 1"
              :label="$t('rechargePrice.main_price')"
              width="100"
            >
              <template slot-scope="props">
                ￥
                <input
                  class="text-input small"
                  type="number"
                  v-model.number="priceList[props.$index].mainPrice1"
                  min="100"
                  style="width: 50px"
                  v-if="userId == rootUser.userId"
                />
                <span v-if="userId != rootUser.userId">{{
                  props.row.mainPrice1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePrice.in_discount')"
              v-if="userId == rootUser.userId"
              width="100"
            >
              <template slot-scope="props">
                ￥
                <span v-if="userId == rootUser.userId">{{
                  (
                    props.row.inDiscount *
                    0.01 *
                    props.row.mainPrice *
                    0.01
                  ).toFixed(2)
                }}</span>
                <span v-if="userId != rootUser.userId">{{
                  (
                    props.row.outDiscount *
                    0.01 *
                    props.row.mainPrice *
                    0.01
                  ).toFixed(2)
                }}</span>
              </template>
            </el-table-column>
            <el-table-column style="flex: 1" min-width="250">
              <template slot="header">
                <span
                  v-html="
                    $t(
                      userId == rootUser.userId
                        ? 'rechargePrice.out_discount'
                        : priceTitle
                    )
                  "
                ></span>
              </template>
              <template slot-scope="props">
                <span v-if="userId == rootUser.userId">
                  <i
                    class="iconfont icon-minus-retangle"
                    style="cursor: pointer"
                    @click="minusDiscount(props.$index, 'outDiscount')"
                  ></i>
                  <input
                    type="text"
                    style="width: 50px"
                    class="text-input"
                    v-model="priceList[props.$index].outDiscount"
                  />
                  <i
                    class="iconfont icon-add-retangle"
                    style="cursor: pointer"
                    @click="addDiscount(props.$index, 'outDiscount')"
                  ></i>
                  % =￥{{
                    (
                      props.row.outDiscount *
                      0.01 *
                      props.row.mainPrice *
                      0.01
                    ).toFixed(2)
                  }}
                </span>
                <span v-if="userId != rootUser.userId">
                  <i
                    class="iconfont icon-minus-retangle"
                    style="cursor: pointer"
                    @click="minusDiscount(props.$index, 'inDiscount')"
                  ></i>
                  <input
                    type="text"
                    style="width: 50px"
                    class="text-input"
                    v-model="priceList[props.$index].inDiscount"
                  />
                  <i
                    class="iconfont icon-add-retangle"
                    style="cursor: pointer"
                    @click="addDiscount(props.$index, 'inDiscount')"
                  ></i>
                  % =￥{{
                    (
                      props.row.inDiscount *
                      0.01 *
                      props.row.mainPrice *
                      0.01
                    ).toFixed(2)
                  }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('rechargePrice.salePrice')"
              v-if="rootUser.userId == 1 && userId != rootUser.userId"
              width="250"
            >
              <template slot-scope="props">
                <i
                  class="iconfont icon-minus-retangle"
                  style="cursor: pointer"
                  @click="minusDiscount(props.$index, 'outDiscount')"
                ></i>
                <input
                  type="text"
                  style="width: 50px"
                  class="text-input"
                  v-model="priceList[props.$index].outDiscount"
                />
                <i
                  class="iconfont icon-add-retangle"
                  style="cursor: pointer"
                  @click="addDiscount(props.$index, 'outDiscount')"
                ></i>
                % =￥{{
                  (
                    props.row.outDiscount *
                    0.01 *
                    props.row.mainPrice *
                    0.01
                  ).toFixed(2)
                }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('rechargePrice.manage')" width="140">
              <template slot-scope="props">
                <el-button
                  class="primary-btn-table-shadow-orange"
                  size="small"
                  v-if="props.row.isActive"
                  @click="onGoodActive(props.row, props.$index)"
                  >{{ $t("rechargePrice.offShelf") }}</el-button
                >
                <el-button
                  class="primary-btn-table-shadow-sgreen"
                  size="small"
                  v-if="!props.row.isActive"
                  @click="onGoodActive(props.row, props.$index)"
                  >{{ $t("rechargePrice.onShelf") }}</el-button
                >
                <!-- <el-button class="primary-btn-table-shadow-red" size="small" v-if="!props.row.isActive && rootUser.userId == 1" @click="delGoodActive(props.row, props.$index)">{{
                  $t("common.delete")
                }}</el-button> -->
              </template>
            </el-table-column>
          </data-table>
        </div>
      </div>
      <!--<div class="card-body">-->
    </div>

    <dialog-comp
      :visible.sync="isShowParent"
      :dialog-title="$t('rechargePrice.parentSeries')"
      :dialog-width="800"
    >
      <data-table
        :data="priceList1"
        :show-selection="true"
        style="height: calc(100% - 30px)"
        @selection-change="handleSelectionChange"
        :show-page="false"
      >
        <!--  -->
        <el-table-column
          :label="$t('rechargePrice.name')"
          prop="goodsName"
          min-width="120"
        ></el-table-column>
        <el-table-column
          :label="$t('rechargePrice.remark')"
          prop="remark"
          min-width="120"
        ></el-table-column>
        <el-table-column :label="$t('rechargePrice.parentPrice')">
          <template slot-scope="props">
            ￥{{
              (
                props.row.mainPrice *
                0.01 *
                props.row.inDiscount *
                0.01
              ).toFixed(2)
            }}
          </template>
        </el-table-column>
      </data-table>
      <div style="text-align: center; margin-top: 10px">
        <el-button type="primary" size="small" @click="onParentList">{{
          $t("common.ok")
        }}</el-button>
        <el-button type="warning" size="small" @click="isShowParent = false">{{
          $t("common.cancel")
        }}</el-button>
      </div>
    </dialog-comp>

    <dialog-comp
      :visible.sync="isAddSeries"
      :dialog-title="$t('addSeriesDialog.dialogTitle')"
      :dialog-width="400"
    >
      <!--添加套餐表单 start-->
      <table class="form-table" style="margin: 0 auto">
        <tr>
          <td>{{ $t("addSeriesDialog.name") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsInfo.name" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.note") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsInfo.remark" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("addSeriesDialog.platformTime") }}:</td>
          <td>
            <el-select v-model="goodsInfo.platformMonth" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('addSeriesDialog.none')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('addSeriesDialog.month1')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('addSeriesDialog.month3')"
              ></el-option>
              <el-option
                :value="6"
                :label="$t('addSeriesDialog.month6')"
              ></el-option>
              <el-option
                :value="12"
                :label="$t('addSeriesDialog.year1')"
              ></el-option>
              <el-option
                :value="24"
                :label="$t('addSeriesDialog.year2')"
              ></el-option>
              <el-option
                :value="60"
                :label="$t('addSeriesDialog.year5')"
              ></el-option>
              <el-option
                :value="120"
                :label="$t('addSeriesDialog.year10')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addSeriesDialog.flowTime") }}:</td>
          <td>
            <el-select v-model="goodsInfo.dataMonth" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('addSeriesDialog.none')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('addSeriesDialog.month1')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('addSeriesDialog.month3')"
              ></el-option>
              <el-option
                :value="6"
                :label="$t('addSeriesDialog.month6')"
              ></el-option>
              <el-option
                :value="12"
                :label="$t('addSeriesDialog.year1')"
              ></el-option>
              <el-option
                :value="24"
                :label="$t('addSeriesDialog.year2')"
              ></el-option>
              <el-option
                :value="60"
                :label="$t('addSeriesDialog.year5')"
              ></el-option>
              <el-option
                :value="120"
                :label="$t('addSeriesDialog.year10')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.deviceRecharge") }}:</td>
          <td>
            <el-select v-model="goodsInfo.refillType" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('deviceDetail.baseType1')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('deviceDetail.frcType')"
              ></el-option>
              <el-option
                :value="2"
                :label="$t('deviceDetail.bluetooth')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('deviceDetail.handheld')"
              ></el-option>
              <el-option :value="4" :label="$t('deviceDetail.k8')"></el-option>
              <el-option
                :value="5"
                :label="$t('deviceDetail.controlCar')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.rechargeType") }}:</td>
          <td>
            <!-- <el-select v-model="goodsInfo.goodsType" style="width: 180px">
              <el-option :value="1" :label="$t('rechargePrice.goodsType1')"></el-option>
              <el-option :value="2" :label="$t('rechargePrice.goodsType2')"></el-option>
            </el-select> -->
            <span>{{ $t("rechargePrice.goodsType1") }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addSeriesDialog.originPrice") }}:</td>
          <td>
            <el-input
              style="width: 180px"
              v-model.number="goodsInfo.mainPrice"
            />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.dealerTip") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="searchUserName"></el-input>
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="RechargePrice"
              :is-show.sync="isUserBox"
              :search-key="searchUserName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <span v-show="!isDealer" style="color: red">{{
              $t("rechargePrice.isDealerTip")
            }}</span>
          </td>
        </tr>
      </table>

      <div style="text-align: center">
        <el-button
          type="primary"
          size="small"
          @click="saveSeries"
          :disabled="!isDealer"
          >{{ $t("common.submit") }}</el-button
        >
      </div>
    </dialog-comp>
    <!-- 添加语音套餐 -->
    <dialog-comp
      :visible.sync="isAddAudioSeries"
      :dialog-title="$t('rechargePrice.addAudioSeries')"
      :dialog-width="400"
      icon-window="icon-yuyingouwu"
    >
      <table class="form-table" style="margin: 0 auto">
        <tr>
          <td>{{ $t("addSeriesDialog.name") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsAudioInfo.name" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.note") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsAudioInfo.remark" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.duration") }}:</td>
          <td>
            <span style="color: red">{{
              $t("rechargePrice.durationTip")
            }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.deviceRecharge") }}:</td>
          <td>
            <el-select v-model="goodsAudioInfo.refillType" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('deviceDetail.baseType1')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('deviceDetail.frcType')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.rechargeType") }}:</td>
          <td>
            <span>{{ $t("rechargePrice.goodsType2") }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.priceSet") }}:</td>
          <td>
            <el-select v-model="goodsAudioInfo.mainPrice" style="width: 180px">
              <el-option :value="20" label="20"></el-option>
              <el-option :value="40" label="40"></el-option>
              <el-option :value="60" label="60"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.notifyCount") }}:</td>
          <td>
            <el-select v-model="notifyCount" style="width: 180px">
              <el-option
                :value="50"
                :label="'50' + $t('common.strip')"
              ></el-option>
              <el-option
                :value="120"
                :label="'120' + $t('common.strip')"
              ></el-option>
              <el-option
                :value="200"
                :label="'200' + $t('common.strip')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.dealerTip") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="searchUserName"></el-input>
            <el-button type="primary" @click="searchUser">{{
              $t("common.search")
            }}</el-button>
            <user-box
              bname="RechargePrice"
              :is-show.sync="isUserBox"
              :search-key="searchUserName"
              @select-result="dealUserItem"
            ></user-box>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <span v-show="!isDealer" style="color: red">{{
              $t("rechargePrice.isDealerTip")
            }}</span>
          </td>
        </tr>
      </table>

      <div style="text-align: center">
        <el-button
          type="primary"
          size="small"
          @click="saveAddAudioSeries"
          !isDealer
          >{{ $t("common.submit") }}</el-button
        >
      </div>
    </dialog-comp>
    <!-- 隐藏为了套餐能够自定义 start -->
    <dialog-comp
      :visible.sync="isAddSeries1"
      :dialog-title="$t('addSeriesDialog.dialogTitle')"
      :dialog-width="400"
    >
      <table class="form-table" style="margin: 0 auto">
        <tr>
          <td>{{ $t("addSeriesDialog.name") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsInfo.name" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.note") }}:</td>
          <td>
            <el-input style="width: 180px" v-model="goodsInfo.remark" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.rechargeType") }}:</td>
          <td>
            <el-select v-model="goodsInfo.goodsType" style="width: 180px">
              <el-option
                :value="1"
                :label="$t('rechargePrice.goodsType1')"
              ></el-option>
              <el-option
                :value="2"
                :label="$t('rechargePrice.goodsType2')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr v-if="goodsInfo.goodsType == 1">
          <td>{{ $t("addSeriesDialog.platformTime") }}:</td>
          <td>
            <el-select v-model="goodsInfo.platformMonth" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('addSeriesDialog.none')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('addSeriesDialog.month1')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('addSeriesDialog.month3')"
              ></el-option>
              <el-option
                :value="6"
                :label="$t('addSeriesDialog.month6')"
              ></el-option>
              <el-option
                :value="12"
                :label="$t('addSeriesDialog.year1')"
              ></el-option>
              <el-option
                :value="24"
                :label="$t('addSeriesDialog.year2')"
              ></el-option>
              <el-option
                :value="60"
                :label="$t('addSeriesDialog.year5')"
              ></el-option>
              <el-option
                :value="120"
                :label="$t('addSeriesDialog.year10')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addSeriesDialog.flowTime") }}:</td>
          <td>
            <el-select v-model="goodsInfo.dataMonth" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('addSeriesDialog.none')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('addSeriesDialog.month1')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('addSeriesDialog.month3')"
              ></el-option>
              <el-option
                :value="6"
                :label="$t('addSeriesDialog.month6')"
              ></el-option>
              <el-option
                :value="12"
                :label="$t('addSeriesDialog.year1')"
              ></el-option>
              <el-option
                :value="24"
                :label="$t('addSeriesDialog.year2')"
              ></el-option>
              <el-option
                :value="60"
                :label="$t('addSeriesDialog.year5')"
              ></el-option>
              <el-option
                :value="120"
                :label="$t('addSeriesDialog.year10')"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>{{ $t("rechargePrice.deviceRecharge") }}:</td>
          <td>
            <el-select v-model="goodsInfo.refillType" style="width: 180px">
              <el-option
                :value="0"
                :label="$t('deviceDetail.baseType1')"
              ></el-option>
              <el-option
                :value="1"
                :label="$t('deviceDetail.frcType')"
              ></el-option>
              <el-option
                :value="2"
                :label="$t('deviceDetail.bluetooth')"
              ></el-option>
              <el-option
                :value="3"
                :label="$t('deviceDetail.handheld')"
              ></el-option>
              <el-option :value="4" :label="$t('deviceDetail.k8')"></el-option>
              <el-option
                :value="5"
                :label="$t('deviceDetail.controlCar')"
              ></el-option>
            </el-select>
          </td>
        </tr>

        <tr v-if="goodsInfo.goodsType == 2">
          <td>{{ $t("rechargePrice.notifyCount") }}:</td>
          <td>
            <el-input v-model="notifyCount" style="width: 180px"></el-input>
          </td>
        </tr>
        <tr>
          <td>{{ $t("addSeriesDialog.originPrice") }}:</td>
          <td>
            <el-input
              style="width: 180px"
              v-model.number="goodsInfo.mainPrice"
            />
          </td>
        </tr>
      </table>

      <div style="text-align: center">
        <el-button type="primary" size="small" @click="saveSeries">{{
          $t("common.submit")
        }}</el-button>
      </div>
    </dialog-comp>
    <!-- end -->
  </div>
</template>

<script src="./js/rechargePrice.js"></script>

<style></style>
