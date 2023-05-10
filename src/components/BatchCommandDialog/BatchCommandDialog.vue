<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('batchCommandDialog.batchCommand')"
    :dialog-width="800"
    :icon-window="'icon-ico_minglingxiafa_xuanzhong'"
  >
    <div class="batch-command-dialog">
      <div>
        <!--批量下发指令 start-->
        <table class="form-table">
          <tr>
            <td>{{ $t("batchCommandDialog.command") }}:</td>
            <td>
              <el-input style="width: 200px" v-model="cmd" />
            </td>
          </tr>
          <tr v-show="isPwd">
            <td>{{ $t("batchCommandDialog.pwd") }}:</td>
            <td>
              <el-input show-password v-model="pwd" style="width: 200px" />
            </td>
          </tr>
        </table>
      </div>
      <ul class="select-tabs1">
        <li :class="[currentAdd == 0 ? 'active' : '']" @click="currentAdd = 0">
          {{ $t("batchTransfer.addOne") }}
        </li>
        <li :class="[currentAdd == 1 ? 'active' : '']" @click="currentAdd = 1">
          {{ $t("batchTransfer.addBatch") }}
        </li>
      </ul>
      <!-- 逐个添加，设备 -->
      <div v-show="currentAdd == 0" style="height: 90px; margin-top: 5px">
        <el-input
          v-model="deviceImei"
          @keyup.enter="showHideBox('device')"
          :placeholder="$t('common.searchDevTip')"
          style="width: 200px"
        ></el-input>
        <el-button type="primary" @click="showHideBox('device')">{{
          $t("common.search")
        }}</el-button>
        <el-button type="primary" @click="addToList">{{
          $t("batchTransfer.addToList")
        }}</el-button>
        <device-box
          box-type="sell"
          :is-show.sync="isDeviceBox"
          :search-key="deviceImei"
          @select-result="dealDevItem"
        ></device-box>
      </div>
      <!-- 批量添加，导入模板文件 -->
      <div v-show="currentAdd == 1" style="height: 90px">
        <div class="orange-box">
          <div v-html="$t('batchTransfer.downloadTip')"></div>
          <div>
            <font style="color: red; font-weight: bold">{{
              $t("common.template")
            }}</font>
            <a
              class="btn-white"
              style="margin-left: 8px"
              :href="API.batchCmdFile"
              >{{ $t("common.download") }}</a
            >
          </div>
        </div>

        <div>
          <file-upload
            accept="application/vnd.ms-excel"
            @select-file="onUploadFile"
          ></file-upload>
        </div>
      </div>

      <div class="left-right-box" style="line-height: 32px">
        <div class="left-box">
          <span style="font-weight: bold; color: gray; margin-left: 16px">{{
            $t("common.deviceList")
          }}</span>
          <span style="margin-left: 16px; margin-right: 8px"
            >{{ $t("batchTransfer.devNum") }}:</span
          >
          {{ devList.length }}
        </div>
        <div class="right-box">
          <el-button type="warning" size="small" @click="resetList">{{
            $t("common.reset")
          }}</el-button>
          <el-button type="primary" size="small" @click="doAllCmd">{{
            $t("batchCommandDialog.runCmd")
          }}</el-button>
        </div>
      </div>
      <!-- 指令执行清单 -->
      <div style="height: calc(100% - 240px)">
        <data-table :data="devList" :show-index="true" :show-page="false">
          <!--  -->
          <el-table-column
            :label="$t('common.deviceImei')"
            prop="deviceImei"
            min-width="130"
          ></el-table-column>
          <el-table-column :label="$t('batchCommandDialog.result')">
            <template slot-scope="props">
              {{
                props.row.result
                  ? props.row.result
                  : props.row.sendable
                  ? $t("batchCommandDialog.undo")
                  : $t("batchCommandDialog.running")
              }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="100">
            <template slot-scope="props">
              <a
                @click="deleteListItem(props.$index)"
                v-show="props.row.sendable"
                >{{ $t("common.delete") }}</a
              >
              <a
                @click="redoListItem(props.$index)"
                v-show="props.row.sendable"
                >{{ $t("batchCommandDialog.redo") }}</a
              >
            </template>
          </el-table-column>
        </data-table>
      </div>
    </div>
  </dialog-comp>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import DeviceBox from "@/components/DeviceBox";
import FileUpload from "@/components/FileUpload";
export default {
  name: "BatchCommandDialog",
  props: {},
  components: {
    "device-box": DeviceBox,
    "file-upload": FileUpload
  },
  data: () => ({
    isShow: false,
    currentAdd: 0,
    devList: [],
    cmd: "",
    pwd: "",
    isDeviceBox: false,
    deviceImei: "",
    isPwd: false
  }),
  watch: {
    cmd() {
      var command = this.cmd;
      if (command) {
        command = command.toUpperCase();
        if (command.indexOf("DYD") >= 0 || command.indexOf("HFYD") >= 0) {
          this.isPwd = true;
        } else {
          this.isPwd = false;
        }
      } else {
        this.isPwd = false;
      }
    }
  },
  methods: {
    //某个设备重新执行命令
    redoListItem(idx) {
      this.devList[idx].result = "";
      this.sendCmd(idx);
    },
    //全部设备执行命令
    doAllCmd() {
      if (this.cmd) {
        for (var i = 0; i < this.devList.length; i++) {
          this.sendCmd(i);
        }
      } else {
        this.app.$emit("show-alert-msg", this.$t("batchCommandDialog.cmdTip"));
      }
    },
    // 执行命令
    sendCmd(idx) {
      if (!this.cmd) return;
      var data = {
        deviceImei: this.devList[idx].deviceImei,
        cmdContent: this.cmd.toUpperCase()
      };
      if (this.isPwd) {
        if (this.pwd) {
          data.password = this.password;
        } else {
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchCommandDialog.pwdTip")
          );
          return;
        }
      }

      this.devList[idx].sendable = false;
      // console.log(data);
      sendDeviceCmd(data).then(res => {
        this.devList[idx].sendable = true;
        if (res.errCode == "200") {
          this.devList[idx].result =
            new Date().format("yyyy-MM-dd hh:mm:ss") + " " + res.data;
        } else {
          this.devList[idx].result =
            new Date().format("yyyy-MM-dd hh:mm:ss") +
            " fail:" +
            this.$t("batchCommandDialog.errTip");
        }
      });
    },
    deleteListItem(idx) {
      this.devList.splice(idx, 1);
    },
    resetList() {
      this.devList = [];
    },
    checkList(imei) {
      var tag = true;
      for (var i = 0; i < this.devList.length; i++) {
        if (imei == this.devList[i].deviceImei) {
          tag = false;
          break;
        }
      }
      if (tag) {
        if (this.devList.length > 100) {
          tag = false;
        }
      }
      return tag;
    },
    addToList() {
      var tag = this.checkList(this.deviceImei);
      if (tag) {
        this.devList.push({
          deviceImei: this.deviceImei,
          result: "",
          sendable: true
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("batchTransfer.transferTip2"));
      }
    },
    showHideBox() {
      if (this.getStrLen(this.deviceImei) >= this.imeiLen) {
        this.isDeviceBox = true;
      } else {
        this.app.$emit("show-alert-msg", this.$t("common.searchDeviceTip1"));
      }
    },
    dealExcel(result) {
      var imeiKey = "";
      for (var key in result[0]) {
        imeiKey = key;
        break;
      }

      for (var i = 0; i < result.length; i++) {
        var imei = result[i][imeiKey];
        if (this.checkList(imei) && /[0-9]{15}/.test(imei)) {
          this.devList.push({
            deviceImei: result[i][imeiKey],
            result: "",
            sendable: true
          });
        }
      }
    },
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
    },
    showDialog(op) {
      // console.log('op', op)
      this.isShow = true;
      this.uploadFile = "";
      this.isFile = false;
      this.deviceImei = "";
      var list = [];
      for (var i = 0; i < op.devList.length; i++) {
        list.push({
          deviceImei: op.devList[i].deviceImei,
          result: "",
          sendable: true
        });
      }
      this.devList = list;
    },
    onUploadFile(files) {
      ExportUtil.parseExcel(files[0], this.dealExcel);
    },
    closeDialog() {
      this.isShow = false;
    },
    listenEvent() {
      this.app.$on("show-batch-command-dialog", this.showDialog);
      this.app.$on("close-batch-command-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-batch-command-dialog", this.showDialog);
      this.app.$off("close-batch-command-dialog", this.closeDialog);
    }
  },
  mounted() {
    this.listenEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style scoped>
.batch-command-dialog {
  height: 520px;
}
</style>
