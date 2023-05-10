<template>
  <div style="padding: 8px" class="batch-transfer">
    <!--批量转移用户信息 start-->

    <!--  -->
    <el-form label-width="120px">
      <el-form-item :label="$t('batchTransfer.transferTo')">
        <el-input
          type="text"
          v-model="userName"
          class="text-input small"
          @keyup.enter="showHideBox('user')"
          :placeholder="$t('common.searchUserTip')"
        />
        <el-button type="primary" @click="showHideBox('user')">{{
          $t("common.search")
        }}</el-button>
        <user-box
          bname="BatchTransfer"
          :is-show.sync="isUserBox"
          :search-key="userName"
          @select-result="dealUserItem"
        ></user-box>
      </el-form-item>
    </el-form>

    <!--批量转移用户信息 end-->
    <el-tabs v-model="currentAdd">
      <el-tab-pane :label="$t('batchTransfer.addOne')" name="0"></el-tab-pane>
      <el-tab-pane :label="$t('batchTransfer.addBatch')" name="1"></el-tab-pane>
    </el-tabs>
    <!--批量转移添加方式tab end-->

    <!--批量转移逐个添加 start-->
    <div
      v-show="currentAdd == 0"
      style="padding-top: 8px; flex: 1; display: flex; flex-direction: column; height: calc(100% - 100px)"
    >
      <!--批量转移逐个添加表单 start-->
      <table class="form-table" style="width: 100%; height: auto">
        <tr>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td>
            <el-input
              v-model="deviceImei"
              @keyup.enter="showHideBox('device')"
              :placeholder="$t('common.searchDevTip')"
            />
            <el-button type="primary" @click="showHideBox('device')">{{
              $t("common.search")
            }}</el-button>
            <device-box
              box-type="sell"
              :is-show.sync="isDeviceBox"
              :search-key="deviceImei"
              @select-result="dealDevItem"
            ></device-box>
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.deviceName") }}:</td>
          <td>
            <el-input v-model="deviceName" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("batchTransfer.deviceOwner") }}:</td>
          <td>
            <el-input v-model="deviceOwner" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("common.simNo") }}:</td>
          <td>
            <el-input v-model="sim" />
          </td>
        </tr>
        <tr>
          <td>{{ $t("batchTransfer.note") }}:</td>
          <td>
            <el-input v-model="note" />
            <el-button type="primary" @click="addBill">{{
              $t("batchTransfer.addToList")
            }}</el-button>
          </td>
        </tr>
      </table>

      <!--批量转移逐个添加表单 end-->

      <!--批量转移逐个添加表格抬头 start-->
      <div class="left-right-box" style="line-height: 40px; padding-left: 16px">
        <span class="left-box">
          <span style="font-weight: bold; color: gray; margin-right: 32px">{{
            $t("batchTransfer.transferBill")
          }}</span>
          {{ $t("batchTransfer.devNum") }}:{{ transferList.length }}
        </span>
        <span class="right-box">
          <el-button type="warning" size="small" @click="transferList = []">{{
            $t("common.reset")
          }}</el-button>
          <el-button type="primary" size="small" @click="doSubmit">{{
            $t("common.submit")
          }}</el-button>
        </span>
      </div>
      <!--批量转移逐个添加表格抬头 end-->

      <!--批量转移逐个添加表格 start-->
      <div style="max-height: 250px; height: 250px">
        <data-table height="100%" :data="transferList" :show-page="false" :show-index="false">
          <!--  -->
          <el-table-column :label="$t('batchTransfer.device')">
            <template slot-scope="props">
              {{
                props.row.deviceName &&
                props.row.deviceName != props.row.deviceImei
                  ? props.row.deviceImei + "(" + props.row.deviceName + ")"
                  : props.row.deviceImei
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.simNo')">
            <template slot-scope="props">
              {{ props.row.deviceSim ? props.row.deviceSim : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.note')">
            <template slot-scope="props">
              {{ props.row.remark ? props.row.remark : "--" }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')">
            <template slot-scope="props">
              <a
                @click="dealTableOp(props.$index, props.row, 'transferDelete')"
                >{{ $t("common.delete") }}</a
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
      <!--批量转移逐个添加表格 end-->
    </div>
    <!--批量转移逐个添加 end-->

    <!--批量转移批量添加 start-->
    <div v-show="currentAdd == 1">
      <div class="orange-box" style="line-height: 4rem">
        <div v-html="$t('batchTransfer.downloadTip')"></div>
        <div>
          <font style="color: red; font-weight: bold"
            >{{ $t("common.template") }}1</font
          >
          <a
            class="btn-white"
            style="margin-left: 0.8rem"
            type="application/x-xls"
            :href="isRoot ? API.batchTransferXls1 : API.batchTransferXls"
            >{{ $t("common.download") }}</a
          >
        </div>
      </div>
      <form
        style="display: flex; flex-direction: row"
        :action="API.batchTransferFile"
        enctype="multipart/form-data"
        method="post"
      >
        <input type="hidden" v-model="userId" name="toUserId" />

        <div class="file-input" style="flex: 1">
          <input
            type="file"
            :id="'batchTransfer_upload_' + dname"
            name="file"
            ref="batchTransfer_upload"
          />
          <div class="file-btn" v-show="!isFile">
            {{ $t("common.chooseFile") }}
          </div>
          <div class="file-btn" v-show="isFile">
            {{ $t("common.selectedFile") }}:{{ uploadFile }}
          </div>
        </div>
        <span class="btn-primary-system" @click="resetForm">{{
          $t("common.reset")
        }}</span>
        <button class="btn-primary-system" v-show="userId != ''">
          {{ $t("common.submit") }}
        </button>
        <a
          href="javascript:void(0);"
          class="btn-primary-system"
          v-show="userId == ''"
          @click="btnHref"
          >{{ $t("common.submit") }}</a
        >
      </form>
    </div>
    <!--批量转移批量添加 end-->
  </div>
</template>

<script>
import UserBox from "@/components/UserBox";
import DeviceBox from "@/components/DeviceBox";
import { batchTransferDev, getDeviceDetail } from "@/api/common.js";
export default {
  name: "DeviceTransfer",
  props: {
    dname: {
      type: String,
      default: ""
    }
  },
  components: {
    "user-box": UserBox,
    "device-box": DeviceBox
  },
  data: () => ({
    //转移设备表格数据
    transferList: [],
    transferOp: [],
    deviceImei: "",
    userId: 0,
    userName: "",
    deviceName: "",
    deviceOwner: "", //所属用户
    sim: "",
    note: "",
    isRoot: JSON.parse(window.localStorage.getItem("carweb_user")).userId == 1,
    currentAdd: 0, //当前转移方式 0批量转移表格 1批量转移文件
    uploadFile: "", //上传文件
    isFile: false, //是否有上传文件
    isDeviceBox: false,
    isUserBox: false
  }),
  watch: {
    userName() {
      if (!this.userName) {
        this.userId = "";
      }
    },
    deviceImei() {
      if (!this.deviceImei) {
        this.resetTran();
        this.isDeviceBox = false;
      }
    }
  },
  methods: {
    btnHref() {
      this.app.$emit("show-alert-msg", this.$t("batchSale.saleTips12"));
    },
    resetForm() {
      // 重置表格数据
      this.isFile = false;
      this.uploadFile = "";
      this.$refs.batchTransfer_upload.value = null;
    },
    //添加到转移清单
    addBill() {
      var that = this;
      if (!this.deviceImei) {
        this.app.$emit(
          "show-alert-msg",
          this.$t("batchTransfer.transferDevTip")
        );
        return;
      }
      var tag = false,
        idx = 0;
      for (var i = 0; i < this.transferList.length; i++) {
        if (this.transferList[i].deviceImei == this.deviceImei) {
          idx = i;
          tag = true;
          break;
        }
      }

      var data = {
        deviceImei: this.deviceImei,
        deviceName: this.deviceName,
        deviceSim: this.sim,
        remark: this.note
      };

      if (tag) {
        this.app.$emit(
          "show-confirm-msg",
          this.deviceImei + this.$t("batchTransfer.transferTip2"),
          function() {
            that.transferList.splice(idx, 1, data);
            that.resetTran();
          }
        );
      } else {
        this.transferList.push(data);
        this.resetTran();
      }
    }, //执行转移设备操作
    doSubmit() {
      if (!this.userId) {
        this.app.$emit("show-alert-msg", this.$t("batchTransfer.transferTip"));
        return;
      }
      if (this.transferList.length == 0) {
        this.app.$emit("show-alert-msg", this.$t("batchTransfer.transferTip1"));
        return;
      }
      var content = "";
      for (var i = 0; i < this.transferList.length; i++) {
        content +=
          this.transferList[i].deviceImei +
          "," +
          this.transferList[i].deviceSim +
          "," +
          this.transferList[i].remark +
          ";";
      }
      var data = {
        file: content,
        toUserId: this.userId
      };
      batchTransferDev(data).then(res => {
        if (res.errCode == "200" && res.data.child.length == 0) {
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchTransfer.transferSuccess")
          );
          this.resetTran();
          this.transferList = [];
          this.app.$emit("close-batch-transfer-dialog", null);
          this.app.$emit("customer-refresh-dev");
        } else {
          //转移失败
          if (res.data.child.length > 0) {
            //有未转移成功的设备
            var dev = "";
            for (var i = 0; i < res.data.child.length; i++) {
              dev = dev + res.data.child[i].replace(",null", "");
            }
            this.app.$emit(
              "show-alert-msg",
              this.$t("batchTransfer.transferFail") + ":" + res.errMsg + dev
            );
          } else {
            this.app.$emit(
              "show-alert-msg",
              this.$t("batchTransfer.transferFail") + ":" + res.errMsg
            );
          }
        }
      });
    }, //搜索用户或设备box
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
    },
    changeCurrentAdd(idx) {
      this.currentAdd = idx;
    }, //处理选中搜索用户box
    dealUserItem(op) {
      this.userId = op.userId;
      this.userName = op.userName;
    }, //清空设备信息
    resetTran() {
      this.sim = "";
      this.deviceOwner = "";
      this.deviceName = "";
      this.deviceImei = "";
      this.note = "";
    }, //选中搜索设备box
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
      this.deviceName = op.deviceName;
      this.deviceSim = op.item.sim_no;
      this.deviceOwner = op.item.userName;
      this.note = op.item.remark;
    },
    /**
     * 处理表格操作
     * @param{操作参数} op =》idx表格项索引，item表格项数据，name操作名
     */
    dealTableOp(index, item, name) {
      if (name == "transferDelete") {
        this.transferList.splice(index, 1);
      }
    }, //处理批量转移对话框
    dealDialog(devList, userId, userName) {
      // console.log(devList, userId, userName);
      this.userId = userId
        ? userId
        : JSON.parse(window.localStorage.getItem("carweb_user")).userId;
      this.userName = userName
        ? userName
        : JSON.parse(window.localStorage.getItem("carweb_user")).userName;
      if (devList) {
        var list = [];
        for (var i = 0; i < devList.length; i++) {
          var item = devList[i];
          var data = {
            deviceImei: item.deviceImei,
            deviceName: item.name,
            deviceSim: item.msisdn,
            remark: ""
          };
          list.push(data);
        }
        this.transferList = list;
      } else {
        this.transferList = [];
      }
      this.resetTran();
    },
    dealUserDialog(uid, uname) {
      this.userId = uid
        ? uid
        : JSON.parse(window.localStorage.getItem("carweb_user")).userId;
      this.userName = uname
        ? uname
        : JSON.parse(window.localStorage.getItem("carweb_user")).userName;
    }, //处理设备详情对话框
    dealDevDialog(imei, tag) {
      var that = this;
      that.transferList = [];

      if (imei && this.dname == tag) {
        getDeviceDetail({ deviceImei: imei }).then(res => {
          if (res.errCode == "200") {
            that.transferList.push({
              deviceImei: res.data.deviceImei,
              deviceName: res.data.name,
              deviceSim: res.data.msisdn,
              remark: ""
            });
          }
        });
      }
    },
    listenEvent() {
      this.app.$on("batch-transfer-dialog", this.dealDialog);
      this.app.$on("user-dialog", this.dealUserDialog);
      this.app.$on("device-dialog", this.dealDevDialog);
    },
    offEvent() {
      this.app.$off("batch-transfer-dialog", this.dealDialog);
      this.app.$off("user-dialog", this.dealUserDialog);
      this.app.$off("device-dialog", this.dealDevDialog);
    },
    onUploadFile() {
      this.isFile = true;
    }
  },
  mounted() {
    this.listenEvent();
    var that = this;
    //上传文件

    document.getElementById(
      "batchTransfer_upload_" + this.dname
    ).onchange = function() {
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
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped="scoped" lang="scss"></style>
