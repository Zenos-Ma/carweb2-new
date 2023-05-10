<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('common.batchLxCommand')"
    :dialog-width="800"
    :dialog-height="560"
    dialog-unit="px"
    :icon-window="'icon-ico_minglingxiafa_xuanzhong'"
  >
    <div>
      <!--批量下发指令 start-->
      <table class="form-table">
        <tr>
          <td>{{ $t("batchCommandDialog.command") }}:</td>
          <td>
            <el-input style="width: 200px;" v-model="cmd" />
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
    <div v-show="currentAdd == 0" style="height: 90px;margin-top:5px">
      <el-input
        v-model="deviceImei"
        @keyup.enter.native="showHideBox('device')"
        :placeholder="$t('common.searchDevTip')"
        style="width:20rem"
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
    <div v-show="currentAdd == 1" style="height: 90px;">
      <div class="orange-box">
        <div v-html="$t('batchTransfer.downloadTip')"></div>
        <div>
          <font style="color: red;font-weight: bold;">{{
            $t("common.template")
          }}</font>
          <a
            class="btn-white"
            style="margin-left: 0.8rem;"
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

    <div class="left-right-box" style="line-height:32px">
      <div class="left-box">
        <span style="font-weight: bold; color: gray;margin-left:16px">{{
          $t("common.deviceList")
        }}</span>
        <span style="margin-left:16px;margin-right:0.8rem"
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
    <div style="height:calc(100% - 200px)">
      <data-table :table-data="devList" :show-index="true">
        <!--  -->
        <el-table-column
          :label="$t('common.deviceImei')"
          width="130px"
          prop="deviceImei"
        >
        </el-table-column>
        <el-table-column
          :label="$t('batchCommandDialog.result')"
          style="flex:1"
        >
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
        <el-table-column :label="$t('common.operation')" width="100px">
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
  </dialog-comp>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import DeviceBox from "@/components/DeviceBox";
import FileUpload from "@/components/FileUpload";
export default {
  name: "BatchSendLxCommand",
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
    deviceImei: ""
  }),
  methods: {
    //某个设备重新执行命令
    redoListItem(idx) {
      this.devList[idx].result = "";
      this.sendCmd(idx);
    },
    //全部设备执行命令
    doAllCmd() {
      let arrList = [];
      if (this.devList.length > 0) {
        this.devList.forEach(item => {
          arrList.push(item.deviceImei);
          item.sendable = false;
        });
      }
      if (this.cmd) {
        let data = {
          deviceImeis: arrList.join(","),
          cmdContent: this.cmd.toUpperCase()
        };
        // console.log(data);
        this.post(this.API.batchSendCmd, data, res => {
          this.devList.forEach(item => {
            item.sendable = true;
            if (res.errCode == "200") {
              item.result =
                new Date().format("yyyy-MM-dd hh:mm:ss") + " " + res.errMsg;
            } else {
              item.result =
                new Date().format("yyyy-MM-dd hh:mm:ss") +
                " fail:" +
                this.$t("batchCommandDialog.errTip");
            }
          });
        });
      } else {
        this.app.$emit("show-alert-msg", this.$t("batchCommandDialog.cmdTip"));
      }
    },
    // 执行命令
    sendCmd(idx) {
      if (!this.cmd) {
        this.app.$emit("show-alert-msg", this.$t("batchCommandDialog.cmdTip"));
        return;
      }
      var that = this;
      var data = {
        deviceImeis: this.devList[idx].deviceImei,
        cmdContent: this.cmd.toUpperCase()
      };

      this.devList[idx].sendable = false;
      // console.log(data);
      this.post(this.API.batchSendCmd, data, function(res) {
        that.devList[idx].sendable = true;
        if (res.errCode == "200") {
          that.devList[idx].result =
            new Date().format("yyyy-MM-dd hh:mm:ss") + " " + res.errMsg;
        } else {
          that.devList[idx].result =
            new Date().format("yyyy-MM-dd hh:mm:ss") +
            " fail:" +
            that.$t("batchCommandDialog.errTip");
        }
      });
    },
    deleteListItem(idx) {
      this.devList.splice(idx, 1);
    },
    resetList() {
      this.devList = [];
      this.app.$emit("reset-file-upload");
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
        if (this.devList.length > 500) {
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
      // console.log(result);
      // 处理从列表中勾选的设备
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
      // console.log("dadad", op);
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
      this.app.$on("show-batch-send-command", this.showDialog);
      this.app.$on("close-show-batch-send-command", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-batch-send-command", this.showDialog);
      this.app.$off("close-show-batch-send-command", this.closeDialog);
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
