<template>
  <div style="display: flex; flex-direction: column; height: calc(100% - 20px)" class="batch-sale">
    <!--批量销售用户信息和平台到期时间 start-->
    <!--  -->
    <el-form label-width="120px">
      <el-form-item :label="$t('batchSale.saleTo')">
        <el-input v-model="userName" @keyup.enter="showHideBox('user')" :placeholder="$t('common.searchUserTip')" />
        <el-button type="primary" style="margin-left: 8px" @click="showHideBox('user')">
          {{ $t("common.search") }}
        </el-button>
        <user-box bname="BatchSale" :is-show.sync="isUserBox" :search-key="userName" @select-result="dealUserItem"></user-box>
      </el-form-item>
      <!-- 2 -->
      <el-form-item :label="$t('batchSale.platformExpired')">
        <!-- <date-picker :date.sync="platformExpire"></date-picker> -->
        <el-date-picker type="date" v-model="platformExpire" :placeholder="$t('common.chooseTime')"> </el-date-picker>
      </el-form-item>
    </el-form>

    <!--批量销售用户信息和平台到期时间 end-->

    <!--批量销售添加方式tab start-->
    <el-tabs v-model="currentAdd">
      <el-tab-pane :label="$t('batchTransfer.addOne')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('batchTransfer.addBatch')" name="1"></el-tab-pane>
    </el-tabs>
    <!--批量销售添加方式tab end-->

    <!--逐个添加 start-->
    <div v-show="currentAdd == 0" style="padding-top: 8px; flex: 1; display: flex; flex-direction: column">
      <!--逐个添加表单 start-->

      <!-- element -->
      <el-form label-width="120px">
        <!-- 1 -->
        <el-form-item :label="$t('common.deviceImei')">
          <el-input v-model="deviceImei" @keyup.enter="showHideBox('device')" :placeholder="$t('common.searchDevTip')" />
          <el-button type="primary" style="margin-left: 8px" @click="showHideBox('device')">
            {{ $t("common.search") }}
          </el-button>
          <device-box box-type="sell" :is-show.sync="isDeviceBox" :search-key="deviceImei" @select-result="dealDevItem"></device-box>
        </el-form-item>
        <!-- 2 -->
        <el-form-item label="ICCID">
          <el-input v-model="iccid" />
        </el-form-item>
        <!-- 3 -->
        <el-form-item :label="$t('common.simNo')">
          <el-input v-model="deviceSim" />
        </el-form-item>
        <!-- 3 -->
        <el-form-item :label="$t('batchSale.simProvider')" v-show="isShowYear">
          <el-select v-model="supplier" :placeholder="$t('rechargePurchase.pleaseChoose')" style="width: 100%">
            <el-option value="S001SW">{{ $t("simInfo.swd") }}</el-option>
            <el-option value="S002GM">{{ $t("simInfo.gm") }}</el-option>
            <el-option value="S003ST">{{ $t("systemDevice.shangtong") }}</el-option>
            <el-option value="S004YD">{{ $t("systemDevice.cnyd") }}</el-option>
            <el-option value="S005LT">{{ $t("systemDevice.cnlt") }}</el-option>
            <el-option value="S006XY">{{ $t("systemDevice.xuyu") }}</el-option>
            <el-option value="other">{{ $t("simInfo.other") }}</el-option>
          </el-select>
        </el-form-item>
        <!-- 4 -->
        <el-form-item :label="$t('batchSale.validYear')" v-show="isShowYear">
          <el-input v-model="validYear" />
        </el-form-item>
        <!-- 5 -->
        <el-form-item :label="$t('batchTransfer.note')">
          <el-input v-model="note" />
          <el-button type="primary" style="margin-left: 8px" @click="addBill">
            {{ $t("batchTransfer.addToList") }}
          </el-button>
        </el-form-item>
      </el-form>

      <!--逐个添加表单 end-->
      <!--逐个添加表格抬头 start-->
      <div class="left-right-box">
        <span class="left-box" style="padding-left: 16px">
          <span style="font-weight: bold; color: gray">{{ $t("batchSale.saleList") }}</span>
          <span style="margin-left: 32px">{{ $t("batchTransfer.devNum") }}:{{ saleList.length }}</span>
        </span>
        <span class="right-box">
          <el-button @click="saleList = []">
            {{ $t("common.reset") }}
          </el-button>
          <el-button type="primary" @click="doSubmit">
            {{ $t("common.submit") }}
          </el-button>
        </span>
      </div>
      <!--逐个添加表格抬头 end-->

      <!--逐个添加表格 start-->
      <div style="margin-top: 5px; max-height: 250px; height: 200px">
        <data-table :data="saleList" :show-index="false" :show-page="false">
          <el-table-column :label="$t('batchTransfer.device')" min-width="120">
            <template slot-scope="props">
              {{ props.row.deviceName && props.row.deviceName != props.row.deviceImei ? props.row.deviceImei + "(" + props.row.deviceName + ")" : props.row.deviceImei }}
            </template>
          </el-table-column>
          <el-table-column label="ICCID" prop="iccid" min-width="140"></el-table-column>
          <el-table-column :label="$t('common.simNo')" min-width="120">
            <template slot-scope="props">
              {{ props.row.deviceSim ? props.row.deviceSim : "--" }}
            </template>
          </el-table-column>
          <el-table-column min-width="120" :label="$t('batchSale.simProvider')" v-if="isShowYear">
            <template slot-scope="props">
              <span v-if="props.row.supplier == 'S001SW'">{{ $t("simInfo.swd") }}</span>
              <span v-if="props.row.supplier == 'S002GM'">{{ $t("simInfo.gm") }}</span>
              <span v-if="props.row.supplier == 'S003ST'">{{ $t("systemDevice.shangtong") }}</span>
              <span v-if="props.row.supplier == 'S004YD'">{{ $t("simInfo.cnyd") }}</span>
              <span v-if="props.row.supplier == 'S005LT'">{{ $t("simInfo.cnlt") }}</span>
              <span v-if="props.row.supplier == 'other'">{{ $t("simInfo.other") }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" v-if="isShowYear" :label="$t('batchSale.validYear')">
            <template slot-scope="props">
              {{ props.row.validYear ? props.row.validYear : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.note')" min-width="120">
            <template slot-scope="props">
              {{ props.row.remark ? props.row.remark : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="120">
            <template slot-scope="props">
              <a @click="dealTableOp(props.$index, props.row, 'saleDelete')">{{ $t("common.delete") }}</a>
            </template>
          </el-table-column>
        </data-table>
      </div>
      <!--逐个添加表格 end-->
    </div>
    <!--逐个添加 end-->
    <!--批量添加 start-->
    <div v-show="currentAdd == 1">
      <div class="orange-box" style="line-height: 40px">
        <div v-html="$t('batchTransfer.downloadTip')"></div>
        <div>
          <font style="color: red; font-weight: bold">{{ $t("common.template") }}1</font>
          <a class="btn-white" style="margin-left: 8px" :href="isShowYear ? API.batchSaleXls1 : API.batchSaleXls">{{ $t("common.download") }}</a>
        </div>
      </div>
      <!--批量添加上传文件 start-->
      <form style="display: flex; flex-direction: row" :action="API.batchSaleFile" enctype="multipart/form-data" ref="batch_sell" method="post">
        <input type="hidden" v-model="userId" name="toUserId" />
        <div class="file-input" style="flex: 1">
          <input type="file" :id="'batchSale_upload_' + dname" name="file" ref="batchSale_upload" />
          <div class="file-btn" v-show="!isFile">
            {{ $t("common.chooseFile") }}
          </div>
          <div class="file-btn" v-show="isFile">{{ $t("common.selectedFile") }}:{{ uploadFile }}</div>
        </div>
        <span class="btn-primary-system" @click="resetForm">{{ $t("common.reset") }}</span>
        <button class="btn-primary-system" type="submit" v-show="userId != ''">
          {{ $t("common.submit") }}
        </button>
        <a href="javascript:void(0);" class="btn-primary-system" v-show="userId == ''" @click="btnHref">{{ $t("common.submit") }}</a>
      </form>
    </div>
  </div>
</template>

<script>
  import UserBox from "@/components/UserBox";
  import DeviceBox from "@/components/DeviceBox";
  import FileUpload from "@/components/FileUpload";
  import ExportUtil from "@/utils/exportUtil.js";
  import { postBatchSale } from "@/api/account.js";
  
  export default {
    name: "BatchSale",
    props: {
      dname: {
        type: String,
        default: "",
      },
    },
    components: {
      "user-box": UserBox,
      "device-box": DeviceBox,
      "file-upload": FileUpload,
    },
    data: () => ({
      currentAdd: 0, //当前批量销售添加模式  0表格填写  1 文件上传

      saleOp: [],
      saleList: [], //销售清单
      deviceImei: "", //设备号
      isShowYear: JSON.parse(window.localStorage.getItem("carweb_user")).userId == 1, //是否显示有效年限
      userId: "", //用户ID
      userName: "", //用户名
      note: "", //备注
      deviceSim: "", //sim号
      platformExpire: new Date(new Date().getTime() + 2 * 365 * 3600 * 24 * 1000).format("yyyy-MM-dd"), //平台到期时间
      iccid: "", //ICCID
      supplier: "", //服务商
      validYear: "", //有效年限
      uploadFile: "", //上传文件
      isFile: false, //是否有上传文件
      isDeviceBox: false,
      isUserBox: false,
      doSellList: "", //批量销售
    }),
    watch: {
      userName() {
        if (!this.userName) {
          //当用户户名为空关闭搜索box，清空userid
          this.userId = "";
        }
      },
      deviceImei() {
        if (!this.deviceImei) {
          //当设备号为空，关闭搜索box，清空相关设备信息
          this.resetSale();
          this.isDeviceBox = false;
        }
      },
    },
    methods: {
      resetForm() {
        // 重置
        // console.log("chufa");
        this.uploadFile = "";
        this.isFile = false;
        this.$refs.batchSale_upload.value = null;
      },
      //搜索box
      showHideBox(tag) {
        if (tag == "device") {
          //搜索设备

          if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
            this.isDeviceBox = true;
            this.isUserBox = false;
          } else {
            this.isDeviceBox = false;
            this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
          }
        } else {
          //搜索用户
          this.app.$emit("close-user-box");
          this.isUserBox = true;
          this.isDeviceBox = false;
        }
      }, //执行销售设备
      doSubmit() {
        if (!this.userId) {
          this.app.$emit("show-alert-msg", this.$t("batchSale.saleTip"));
          return;
        }
        if (this.saleList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("batchSale.saleTip1"));
          return;
        }
        var content = "";
        for (var i = 0; i < this.saleList.length; i++) {
          var item = this.saleList[i];
          content = content + item.deviceImei + "," + item.deviceSim + "," + item.iccid + "," + item.supplier + "," + item.remark + "," + item.validYear + ";";
        }
        var data = {
          file: content,
          expireTime: new Date(this.platformExpire).getTime(),
          toUserId: this.userId,
        };
        postBatchSale(data).then((res) => {
          if (res.errCode == "200" && res.data.child.length == 0) {
            this.app.$emit("show-alert-msg", this.$t("batchSale.saleSuccess"));
            this.resetSale();
            this.saleList = [];
            this.app.$emit("close-batch-sale-dialog", null);
            this.app.$emit("customer-refresh-dev");
          } else {
            if (res.data.child.length > 0) {
              var dev = "";
              for (var i = 0; i < res.data.child.length; i++) {
                dev = dev + res.data.child[i].replace(",null", "");
              }
              this.app.$emit("show-alert-msg", this.$t("batchSale.saleFail") + ":" + res.errMsg + dev);
            } else {
              this.app.$emit("show-alert-msg", this.$t("batchSale.saleFail") + ":" + res.errMsg);
            }
          }
        });
      },
      //添加设备信息到销售表格中
      addBill() {
        var that = this;
        if (!this.deviceImei) {
          this.app.$emit("show-alert-msg", this.$t("batchSale.saleDevTip"));
          return;
        }
        var tag = false,
          idx = 0;
        for (var i = 0; i < this.saleList.length; i++) {
          if (this.saleList[i].deviceImei == this.deviceImei) {
            idx = i;
            tag = true;
            break;
          }
        }

        if (this.validYear == "") {
          this.validYear = 1;
        }

        var data = {
          deviceImei: this.deviceImei,
          deviceSim: this.deviceSim,
          iccid: this.iccid,
          supplier: this.supplier,
          validYear: this.validYear,
          remark: this.note,
        };

        if (tag) {
          this.app.$emit("show-confirm-msg", this.deviceImei + this.$t("batchSale.saleCoverTip"), function () {
            that.saleList.splice(idx, 1, data);
            that.resetSale();
          });
        } else {
          this.saleList.push(data);
          this.resetSale();
        }
      }, //置空设备信息
      resetSale() {
        this.deviceImei = "";
        this.deviceSim = "";
        this.iccid = "";
        this.supplier = "";
        this.validYear = "";
        this.note = "";
      }, //处理选中搜索用户box
      dealUserItem(op) {
        this.userId = op.userId;
        this.userName = op.userName;
      }, //处理选中搜索设备box
      dealDevItem(op) {
        this.deviceImei = op.deviceImei;
        this.deviceSim = op.item.sim_no;
        this.iccid = op.item.iccid_no;

        this.supplier = op.item.userName;
        this.validYear = op.item.validYear;
        this.note = op.item.remark;
      },
      /**
       * 处理表格操作
       * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
       */
      dealTableOp(idx, item, name) {
        // console.log(op);
        if (name == "saleDelete") {
          this.saleList.splice(idx, 1);
        }
      }, //处理批量销售对话框操作
      dealDialog(devList, userId, userName) {
        this.userId = userId ? userId : JSON.parse(window.localStorage.getItem("carweb_user")).userId;

        this.userName = userName ? userName : JSON.parse(window.localStorage.getItem("carweb_user")).userName;
        if (devList) {
          var list = [];
          for (var i = 0; i < devList.length; i++) {
            var item = devList[i];
            var start = item.openTime ? new Date(item.openTime).getTime() : new Date().getTime();
            var yearTime = new Date(item.expireTime).getTime() - start;
            var data = {
              deviceImei: item.deviceImei,
              deviceSim: item.msisdn,
              iccid: item.iccid,
              supplier: item.msisdn ? this.$t("simInfo.gm") : this.$t("simInfo.swd"),
              validYear: yearTime >= 0 ? (yearTime / (365 * 24 * 60 * 60 * 1000)).toFixed(1) : this.$t("batchSale.devExpire"),
              remark: "",
            };
            list.push(data);
          }
          this.saleList = list;
        } else {
          this.saleList = [];
        }
        this.resetSale();
      }, //处理用户详情对话框操作
      dealUserDialog(uid, uname) {
        this.userId = uid ? uid : JSON.parse(window.localStorage.getItem("carweb_user")).userId;
        this.userName = uname ? uname : JSON.parse(window.localStorage.getItem("carweb_user")).userName;
      },
      listenEvent() {
        this.app.$on("batch-sale-dialog", this.dealDialog);
        this.app.$on("user-dialog", this.dealUserDialog);
      },
      offEvent() {
        this.app.$off("batch-sale-dialog", this.dealDialog);
        this.app.$off("user-dialog", this.dealUserDialog);
      },
      initTableTitle() {
        //监听文件上传
        var that = this;
        document.getElementById("batchSale_upload_" + this.dname).onchange = function () {
          var val = this.value;
          var file = val.substring(val.lastIndexOf("\\") + 1, val.length);

          if (file) {
            that.isFile = true;
            that.uploadFile = file;
          } else {
            that.isFile = false;
          }
        };
      },
      // 目前这两个方法没有用
      onUploadFilePolicy(files) {
        this.isFile = true;
        ExportUtil.parseExcel(files[0], this.dealExcel);
      },
      dealExcel(result) {
        // console.log(result);
        this.doSellList = result;
      },
      btnHref() {
        this.app.$emit("show-alert-msg", this.$t("batchSale.saleTips12"));
      },
    },
    mounted() {
      this.listenEvent();
      // this.initTableTitle();
      this.getStrLen("wqdada");
    },
    beforeDestroy() {
      this.offEvent();
    },
  };
</script>

<style lang="scss" scoped>
  .file-btn {
    background: #a4a39b;
    // left: -5px;
    text-align: center;
    color: #fff;
  }
</style>
