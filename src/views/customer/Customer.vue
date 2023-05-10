<template>
  <section class="body-content layout-container" style="flex-direction: row">
    <!--左侧用户树 start-->
    <div
      class="form-card1 body-content-left"
      style="padding-right: 0px; height: 100%"
    >
      <div class="card-header left-right-box">
        <span class="left-box">{{ $t("common.myCustomer") }}</span>
        <span class="right-box">
          <el-button type="primary" @click="showDialog('AddUserDialog')">{{
            $t("customer.add")
          }}</el-button>
        </span>
      </div>
      <div
        class="card-body"
        style="height: calc(100% - 40px); overflow-x: hidden; overflow-y: hidden; padding-right: 0px"
      >
        <user-tree
          :user-id="userId"
          @usertree-right="dealRightTree"
          @usertree1-right="dealRightTree1"
          @usertree-select="changeUser"
          :is-show="true"
        ></user-tree>

        <ul
          class="operation-box"
          v-show="treeBox.isShow"
          :style="{
            left: treeBox.left + 'px',
            top: treeBox.top + 'px'
          }"
        >
          <li
            v-for="(item, idx) in $t('customer.treeOp')"
            @click="onUserTreeOp(item.name)"
            :key="'treeOp' + idx"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="move-bar-h"></div> -->
    <!--左侧用户树 end-->
    <div
      class="body-content-right"
      style="display: flex; flex-direction: column; padding-right: 8px"
    >
      <div class="form-card">
        <!--选中用户抬头 start-->
        <div class="card-header left-right-box" style="border-bottom: unset">
          <span class="left-box"
            >{{ $t("customer.userInfo") }}:{{ userInfo.userName }}</span
          >
          <span class="right-box">
            <!-- <img src="@/assets/img/location.png" alt="" @click="showChartPage" style="vertical-align: middle; cursor: pointer; width: 22px" /> -->
            <el-button
              type="primary"
              class="btn-el-button"
              @click="showDialog('monitor')"
              >{{ $t("common.monitor") }}</el-button
            >
            <el-button
              type="primary"
              class="btn-el-button"
              @click="showDialog('user')"
              >{{ $t("customer.edit") }}</el-button
            >
            <el-button
              type="primary"
              class="btn-el-button"
              @click="showDialog('UserPwdDialog')"
              v-show="rootUser.userId == userId"
              >{{ $t("customer.changePwd") }}</el-button
            >
            <el-button
              type="primary"
              class="btn-el-button"
              @click="resetUserPwd"
              >{{ $t("customer.resetPwd") }}</el-button
            >
          </span>
        </div>
        <!--选中用户抬头 end-->
        <div class="card-body3" style="overflow-x: scroll;">
          <!--选中用户信息 start-->
          <table class="form-table" style="width: 100%">
            <tr>
              <td>{{ $t("customer.loginName") }}:</td>
              <td>{{ userInfo.loginNo ? userInfo.loginNo : "--" }}</td>

              <td>{{ $t("common.type") }}:</td>
              <td>
                {{
                  userId == 1
                    ? $t("customer.superUser")
                    : $t(
                        "common.userTypeList[" +
                          (userInfo.userType ? userInfo.userType : 0) +
                          "].text"
                      )
                }}
              </td>

              <td>{{ $t("common.accountIp") }}:</td>
              <td>{{ userId ? userId : rootUser.userId }}</td>

              <td>{{ $t("customer.deviceNum") }}:</td>
              <td style="white-space: nowrap;">
                {{ $t("customer.stockPurchase") }}:{{
                  userInfo.dev_import ? userInfo.dev_import : "--"
                }},{{ $t("customer.stock") }}:{{
                  userInfo.dev_cnt ? userInfo.dev_cnt : "--"
                }},{{ $t("common.updateTime") }}:{{
                  userInfo.summary_time ? userInfo.summary_time : "--"
                }}
              </td>
            </tr>
            <tr>
              <td>{{ $t("common.linkman") }}:</td>
              <td style="white-space: nowrap;">
                {{ userInfo.linkman ? userInfo.linkman : "--" }}
              </td>

              <td>{{ $t("common.phone") }}:</td>
              <td>{{ userInfo.tel ? userInfo.tel : "--" }}</td>

              <td>{{ $t("common.address") }}:</td>
              <td style="white-space: nowrap;">
                {{ userInfo.address ? userInfo.address : "--" }}
              </td>
            </tr>
          </table>

          <!--选中用户信息 end-->
        </div>
      </div>
      <!--end form-card-->

      <div class="form-card" style="height: calc(100% - 120px)">
        <!--切换设备和子账号表格tab start-->
        <div class="card-header">
          <el-tabs v-model="tableMenu">
            <el-tab-pane :label="$t('customer.device')" name="0"></el-tab-pane>
            <el-tab-pane
              :label="$t('customer.subAccount')"
              name="1"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!--切换设备和子账号表格tab end-->
        <!--设备表格操作 start-->
        <div class="card-body">
          <!--设备表格操作 start-->
          <div style="line-height: 40px" v-if="tableMenu == 0">
            <div class="left-right-box">
              <span class="left-box">
                <span>{{ $t("customer.statusFilter") }}:</span>
                <el-select
                  v-model="devFilter"
                  @change="loadDevice"
                  style="width: 200px"
                >
                  <el-option
                    :value="item.name"
                    v-for="(item, idx) in $t('customer.stsList')"
                    :key="'stsList' + idx"
                    :label="item.text"
                  ></el-option>
                </el-select>
                <span v-if="devFilter == 'expired' || devFilter == 'offline'">
                  <el-checkbox v-model="isFilter">{{
                    $t("customer.filterTip")
                  }}</el-checkbox>
                </span>
                <el-select
                  v-if="devFilter == 'offline'"
                  v-model="selectOffline"
                  style="width: 120px"
                >
                  <el-option
                    :value="item.val"
                    v-for="(item, idx) in $t('customer.offlineList')"
                    :key="'offlineList' + idx"
                    :label="item.text"
                  ></el-option>
                </el-select>

                <el-select
                  v-model="selectExpired"
                  v-if="devFilter == 'expired'"
                  style="width: 120px"
                >
                  <el-option
                    :value="item.val"
                    v-for="(item, idx) in $t('customer.expiredList')"
                    :key="'expiredList' + idx"
                    :label="item.text"
                  ></el-option>
                </el-select>

                <el-select
                  v-model="selectExpired1"
                  v-if="devFilter == 'expired'"
                  style="width: 120px"
                >
                  <el-option
                    :value="item.val"
                    v-for="(item, idx) in $t('customer.expiredList1')"
                    :key="'expiredList1' + idx"
                    :label="item.text"
                  ></el-option>
                </el-select>

                <el-button
                  class="btn-el-button"
                  type="primary"
                  @click="loadDevice"
                  >{{ $t("common.refresh") }}</el-button
                >
              </span>
              <span class="right-box">
                <el-button
                  class="btn-el-button"
                  type="primary"
                  @click="exportTable"
                  >{{ $t("common.export") }}</el-button
                >
                <el-button
                  class="btn-el-button"
                  type="primary"
                  @click="exportTable('all')"
                  >{{ $t("common.exportAll") }}</el-button
                >

                <el-checkbox v-model="isChild">{{
                  $t("common.containChild")
                }}</el-checkbox>
              </span>
            </div>
            <div class="left-right-box">
              <span class="left-box">
                <!-- 2022-2-9 -->
                <span
                  class="btn-el-button1"
                  @click="showDialog('batchSale')"
                  v-show="isManage"
                >
                  <i class="iconfont icon-zcpt-xiaoshouguanli"></i>
                  {{ $t("customer.batchSale") }}
                </span>
                <span
                  class="btn-el-button1"
                  @click="showDialog('batchTransfer')"
                  style="margin-left: 5px"
                >
                  <i class="iconfont icon-jiaohuan"></i>
                  {{ $t("customer.batchTransfer") }}
                </span>
                <!-- 三一起重导出安装记录的功能 -->
                <span
                  v-show="rootUser.userId == 1 || rootUser.trinityFlag"
                  class="sanyiqizhong"
                >
                  <button @click="exportRecord">
                    {{ $t("customer.exportRecord") }}
                  </button>
                  <el-checkbox v-model="ishasLower">{{
                    $t("common.containChild1")
                  }}</el-checkbox>
                </span>
                <el-popover popper-class="option" v-model="visible">
                  <div class="btn-content-yingcang">
                    <span
                      class="btn-el-button2"
                      @click="showDialog('batchCommand')"
                    >
                      <i class="iconfont icon-ico_minglingxiafa_xuanzhong"></i>
                      {{ $t("customer.batchCommand") }}
                    </span>
                    <span
                      class="btn-el-button2"
                      @click="showDialog('batchDevice')"
                      v-show="isInitType || userId == 1"
                    >
                      <i class="iconfont icon-xitongchushihua"></i>
                      {{ $t("customer.batchDevice") }}
                    </span>
                    <span
                      class="btn-el-button2"
                      @click="showDialog('batchSendCommand')"
                      v-show="rootUser.userId == 1 || rootUser.userId == 238"
                    >
                      <i
                        class="iconfont icon-ico_minglingxiafa_xuanzhong more-btn-icon"
                      ></i>
                      {{ $t("common.batchLxCommand") }}
                    </span>
                  </div>
                  <span slot="reference">
                    <span style="font-size: 13px" class="more-tanchaung-btn"
                      >{{ $t("infobox.more")
                      }}<i class="iconfont icon-icshowmore"></i
                    ></span>
                  </span>
                </el-popover>
              </span>
              <span class="right-box">
                {{ $t("customer.searchDevice") }}:
                <el-input
                  style="width: 140px"
                  v-model="searchDevKey"
                  :placeholder="$t('common.searchDevTip')"
                  @keyup.enter="searchDevs"
                />
                <el-button
                  class="btn-el-button"
                  type="primary"
                  @click="searchDevs"
                  >{{ $t("common.search") }}</el-button
                >
              </span>
            </div>
          </div>
          <!--设备表格操作 end-->

          <!--子账号表格操作 start-->
          <div
            class="left-right-box"
            style="line-height: 30px"
            v-if="tableMenu == 1"
          >
            <span class="left-box">
              <el-button
                class="btn-el-button"
                type="primary"
                @click="showDialog('AddUserDialog')"
                >{{ $t("customer.addNewUser") }}</el-button
              >
            </span>
            <span class="right-box">
              {{ $t("customer.searchKey") }}:
              <el-input
                v-model="searchUserKey"
                style="width: 160px"
                :placeholder="$t('common.searchUserTip')"
                @keyup.enter="searchUsers"
              />
              <el-button
                class="btn-el-button"
                type="primary"
                @click="searchUsers"
                >{{ $t("common.search") }}</el-button
              >
            </span>
          </div>
          <!--子账号表格操作 end-->

          <!--设备表格 start-->
          <div
            style="height: calc(100% - 84px); width: 100%; overflow-x: auto; overflow-y: hidden"
            v-show="tableMenu == 0"
          >
            <data-table
              :default-sort="{ prop: 'deviceImei', order: 'descending' }"
              :data="deviceList"
              :show-selection="true"
              @selection-change="selectionChange"
              @getTableData="loadDevice"
              :page="page"
              :page-count="page.num"
              style="min-width: 1280px"
            >
              <!-- 2022-4-8 start -->
              <el-table-column
                :label="$t('common.deviceImei')"
                min-width="130"
                sortable
                prop="deviceImei"
              >
                <template slot-scope="props">
                  <a
                    @click="
                      dealTableOp(props.row, props.$index, 'subDevDetail')
                    "
                    >{{ props.row.deviceImei }}</a
                  >
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.deviceName')"
                min-width="120"
                sortable
                prop="name"
              >
                <template slot-scope="props">
                  {{ props.row.name ? props.row.name : "--" }}
                </template>
              </el-table-column>
              <el-table-column label="ICCID" min-width="160">
                <template slot-scope="props">
                  {{ props.row.iccid ? props.row.iccid : "--" }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('customer.openTime')" min-width="120">
                <template slot-scope="props">
                  {{ props.row.openTime | fdate }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('customer.expireTime')"
                min-width="120"
              >
                <template slot-scope="props">
                  {{ props.row.expireTime | fdate }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('customer.signalTime')"
                min-width="120"
              >
                <template slot-scope="props">
                  {{ props.row.signalTime | fdate }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.status')" min-width="150">
                <template slot-scope="props">
                  {{ getDevSts(props.row.status, props.row.signalTime) }}
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('common.activateSts')"
                min-width="120"
              >
                <template slot-scope="props">
                  <el-button
                    size="small"
                    :class="[
                      props.row.enableSts == 0
                        ? 'primary-btn-isactive'
                        : 'primary-btn-actived'
                    ]"
                    @click="
                      dealTableOp(props.row, props.$index, 'deviceActive')
                    "
                    :disabled="props.row.enableSts == 1"
                  >
                    {{
                      props.row.enableSts == 1
                        ? $t("common.isActived")
                        : $t("common.activing")
                    }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.operation')" min-width="120">
                <template slot-scope="props">
                  <span
                    class="detail-dev-btn"
                    @click="
                      dealTableOp(props.row, props.$index, 'subDevDetail')
                    "
                    >{{ $t("common.detail") }}</span
                  >|
                  <el-popover trigger="hover" popper-class="option">
                    <ul class="device-more-list">
                      <li
                        @click="
                          dealTableOp(props.row, props.$index, 'deviceMonitor')
                        "
                      >
                        <i class="iconfont icon-jiankong more-btn-icon"></i
                        >{{ $t("common.monitor") }}
                      </li>
                      <li
                        @click="
                          dealTableOp(props.row, props.$index, 'deviceTrack')
                        "
                      >
                        <i class="iconfont icon-zaitugenzong more-btn-icon"></i
                        >{{ $t("common.track") }}
                      </li>
                      <li
                        class="bor-b"
                        @click="
                          dealTableOp(props.row, props.$index, 'devicePlayback')
                        "
                      >
                        <i class="iconfont icon-guijihuifang more-btn-icon"></i
                        >{{ $t("common.playback") }}
                      </li>
                      <li
                        @click="
                          dealTableOp(props.row, props.$index, 'subDevSale')
                        "
                      >
                        <i class="iconfont icon-kuguanfahuo more-btn-icon"></i
                        >{{ $t("customer.sale") }}
                      </li>
                      <li
                        class="bor-b"
                        @click="
                          dealTableOp(props.row, props.$index, 'subDevTransfer')
                        "
                      >
                        <i class="iconfont icon-jiaohuan more-btn-icon"></i
                        >{{ $t("customer.transfer") }}
                      </li>
                      <li
                        @click="
                          dealTableOp(props.row, props.$index, 'subDevResetPwd')
                        "
                      >
                        <i class="iconfont icon-zhongzhi more-btn-icon"></i
                        >{{ $t("customer.resetPwd") }}
                      </li>
                      <!-- <li @click="dealTableOp({ item, idx, name: 'editPwd' })"><i class="iconfont icon-xiugai more-btn-icon"></i>{{ $t("accountMain.editPwd") }}</li> -->
                    </ul>
                    <span slot="reference">
                      <span style="font-size: 13px"
                        >{{ $t("infobox.more")
                        }}<i class="iconfont icon-icshowmore"></i
                      ></span>
                    </span>
                  </el-popover>
                </template>
              </el-table-column>
              <!-- 2022-4-8 end -->
            </data-table>
          </div>
          <!--设备表格 end-->

          <!--子账号表格 start-->
          <div
            style="height: calc(100% - 33px); overflow-x: auto; overflow-y: hidden"
            v-show="tableMenu == 1"
          >
            <data-table
              :data="userList"
              style="min-width: 940px"
              :show-index="true"
              :show-page="false"
            >
              <!--  -->
              <el-table-column :label="$t('common.userName')" min-width="120">
                <template slot-scope="props">
                  <a
                    @click="
                      dealTableOp(props.row, props.$index, 'customerDetail')
                    "
                    >{{ props.row.userName ? props.row.userName : "--" }}</a
                  >
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('customer.loginName')"
                min-width="120"
              >
                <template slot-scope="props">
                  {{ props.row.loginNo ? props.row.loginNo : "--" }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.type')" min-width="80">
                <template slot-scope="props">
                  {{
                    $t(
                      "common.userTypeList[" +
                        (props.row.userType ? props.row.userType : 0) +
                        "].text"
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.linkman')" min-width="100">
                <template slot-scope="props">
                  {{ props.row.linkman ? props.row.linkman : "--" }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.phone')" min-width="100">
                <template slot-scope="props">
                  {{ props.row.tel ? props.row.tel : "--" }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('customer.deviceNum')" min-width="80">
                <template slot-scope="props">
                  {{ props.row.dev_cnt > 0 ? props.row.dev_cnt : 0 }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.operation')" min-width="90">
                <template slot-scope="props">
                  <span
                    class="detail-dev-btn"
                    @click="
                      dealTableOp(props.row, props.$index, 'customerDetail')
                    "
                    >{{ $t("common.detail") }}</span
                  >|
                  <el-popover trigger="hover" popper-class="option">
                    <ul class="device-more-list">
                      <li
                        @click="
                          dealTableOp(
                            props.row,
                            props.$index,
                            'customerMonitor'
                          )
                        "
                      >
                        <i class="iconfont icon-jiankong more-btn-icon"></i
                        >{{ $t("common.monitor") }}
                      </li>
                      <li
                        @click="
                          dealTableOp(
                            props.row,
                            props.$index,
                            'customerResetPwd'
                          )
                        "
                      >
                        <i class="iconfont icon-zhongzhi more-btn-icon"></i
                        >{{ $t("customer.resetPwd") }}
                      </li>
                      <li
                        @click="
                          dealTableOp(props.row, props.$index, 'customerDelete')
                        "
                      >
                        <i class="iconfont icon-clear more-btn-icon"></i
                        >{{ $t("common.delete") }}
                      </li>
                    </ul>
                    <span slot="reference">
                      <span style="font-size: 13px"
                        >{{ $t("infobox.more")
                        }}<i class="iconfont icon-icshowmore"></i
                      ></span>
                    </span>
                  </el-popover>
                </template>
              </el-table-column>
            </data-table>
          </div>
          <!--子账号表格 end-->
        </div>
        <!--<div class="card-body">-->
      </div>
      <!--end form-card-->
    </div>
    <!-- <user-pwd-dialog></user-pwd-dialog> -->
    <add-user-dialog></add-user-dialog>
    <quick-sale-dialog></quick-sale-dialog>
    <transfer-dialog></transfer-dialog>
    <batch-sale-dialog></batch-sale-dialog>
    <batch-transfer-dialog></batch-transfer-dialog>
    <batch-command-dialog></batch-command-dialog>
    <batch-device-dialog></batch-device-dialog>
    <batch-alarm-dialog></batch-alarm-dialog>
    <user-transfer-dialog></user-transfer-dialog>
    <batch-send-command></batch-send-command>
  </section>
</template>

<script src="./customer.js"></script>

<style lang="scss" scoped>
.operation-box {
  position: fixed;
  z-index: 9999;
  background: #fff;
  overflow: hidden;
  flex-direction: column;
  overflow: auto;
  border: 1px solid #dcdcdc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 9;
  background: #fff;
  line-height: 25px;
  text-align: center;
  // padding: 10px 0;
}
.customer {
  height: calc(100vh - 111px);
}
.btn-el-button2 {
  padding: 10px;
  cursor: pointer;
}
.more-tanchaung-btn {
  cursor: pointer;
  padding-left: 10px;
  color: #666666;
}
.btn-content-yingcang {
  display: flex;
  flex-direction: column;
  .btn-el-button1 {
    margin-bottom: 10px;
  }
}
.detail-dev-btn {
  padding: 0 4px;
}
.device-more-list {
  margin: 0;
  padding: 0;
  > li {
    line-height: 20px;
    cursor: pointer;
    font-size: 13px;
    color: #343434;
    padding: 5px 15px;
    list-style: none;
    .more-btn-icon {
      margin-right: 5px;
      width: 16px;
      height: 16px;
      display: inline-block;
    }
  }
  > li:hover {
    background-color: #f9f9f9;
    color: #2eb8ff;
  }
  .bor-b {
    border-bottom: 1px solid #eee;
  }
}
.btn-operation {
  span {
    color: #0095ec;
    cursor: pointer;
  }
}
</style>
