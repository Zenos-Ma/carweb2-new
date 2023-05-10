<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('batchDeviceDialog.batchDevice')"
    :dialog-width="800"
    :icon-window="'icon-xitongchushihua'"
  >
    <ul class="select-tabs1">
      <li :class="[currentAdd == 0 ? 'active' : '']" @click="currentAdd = 0">
        {{ $t("batchTransfer.addOne") }}
      </li>
      <li :class="[currentAdd == 1 ? 'active' : '']" @click="currentAdd = 1">
        {{ $t("batchTransfer.addBatch") }}
      </li>
    </ul>
    <!-- 逐个添加，设备 -->
    <div v-show="currentAdd == 0" style="height: 90px; margin-top: 20px">
      <table class="form-table">
        <tr>
          <td>{{ $t("common.deviceImei") }}:</td>
          <td>
            <el-input
              style="width: 200px"
              v-model="deviceImei"
              class="text-input small"
              @keyup.enter="showHideBox('device')"
              :placeholder="$t('common.searchDevTip')"
            />
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
          </td>
        </tr>
      </table>
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
            :href="API.batchInitFile"
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
        <span style="margin-left: 16px; margin-right: 0.8rem"
          >{{ $t("batchTransfer.devNum") }}:</span
        >
        {{ devList.length }}
      </div>
      <div class="right-box">
        <el-button type="warning" size="small" @click="resetList">{{
          $t("common.reset")
        }}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="doAllCmd"
          :disabled="isBtnCont"
          >{{ $t("batchCommandDialog.runCmd") }}</el-button
        >
      </div>
    </div>
    <!-- 指令执行清单 -->
    <div style="height: 250px">
      <data-table :data="devList" :show-index="false" :show-page="false">
        <el-table-column :label="$t('common.deviceImei')" prop="deviceImei" min-width="130"></el-table-column>
        <el-table-column :label="$t('batchCommandDialog.result')" style="flex:1">
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
        <el-table-column :label="$t('common.operation')" min-width="120">
          <template slot-scope="props">
            <a @click="deleteListItem(props.$index)" v-show="props.row.sendable">{{
                $t("batchDeviceDialog.delete")
              }}</a>
              <a @click="redoListItem(props.$index)" v-show="props.row.sendable">{{
                $t("batchDeviceDialog.redo")
              }}</a>
          </template>
        </el-table-column>
      </data-table>
    </div>
    <dialog-comp
      :dialog-width="40"
      :dialog-height="16"
      dialog-unit="rem"
      :visible.sync="isDeviceDialog"
      :dialog-title="$t('batchDeviceDialog.checkDeviceback')"
    >
      <div class="deivce-content">
        <div class="item">
          <span style="font-size: 13px; line-height: 24px; padding-top: 5px"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
              $t("batchDeviceDialog.failNum1")
            }}
          </span>
          <el-button type="primary" style="width: 8rem" @click="downloadFail"
            >查看详情</el-button
          >
        </div>
      </div>
    </dialog-comp>
  </dialog-comp>
</template>

<script>
var failList = [];
var succList = [];
import ExportUtil from "@/utils/exportUtil.js";
import DeviceBox from "@/components/DeviceBox";
import FileUpload from "@/components/FileUpload";
import { checkDeviceListInfo, doDeviceInit } from "@/api/customer.js";
export default {
  name: "BatchDeviceDialog",
  props: {},
  components: {
    "device-box": DeviceBox,
    "file-upload": FileUpload
  },
  data: () => ({
    isShow: false,
    currentAdd: 0,
    devList: [],
    isDeviceBox: false,
    deviceImei: "",
    isPwd: false,
    delImeiList: [],
    checkImeiList: [], //检查回来的数组
    isDeviceDialog: false,
    sucessLength: 0,
    failLength: 0,
    isSuccess: true, //检查有成功的才能进行添加
    failDeviceList: [], //检查失败拿到的数组
    isBtnCont: false
  }),
  watch: {
    isShow() {
      if (!this.isShow) {
        this.delImeiList = [];
        this.devList = [];
        this.failDeviceList = [];
      }
    }
  },
  methods: {
    downloadFail() {
      // console.log(failList);
      if (failList.length > 0) {
        if (/[0-9]{15,16}/.test(failList)) {
          var m = failList;
          var arr = [];
          for (var j = 0; j < m.length; j++) {
            arr.push([m[j]]);
          }
          ExportUtil.exportTable(
            ["deviceImei"],
            arr,
            this.$t("batchDeviceDialog.failTip")
          );
        }
      } else {
        // this.app.$emit("show-alert-msg", this.$t("batchDeviceDialog.failTip1"));
      }
    },
    downloadSucess() {
      if (this.devList.length > 0) {
        var m = this.devList;
        var arr = [];
        for (var j = 0; j < m.length; j++) {
          arr.push([m[j].deviceImei]);
        }
        // console.log(arr);
        ExportUtil.exportTable(
          ["deviceImei"],
          arr,
          this.$t("batchDeviceDialog.sucessTip")
        );
      } else {
        this.app.$emit(
          "show-alert-msg",
          this.$t("batchDeviceDialog.sucessTip1")
        );
      }
    },
    continueBtn() {
      // 拿到返回的成功的设备进行批量的初始化
      this.isDeviceDialog = false;
      if (this.devList.length > 0) {
        var arr = [];
        for (var i = 0; i < this.devList.length; i++) {
          this.devList[i].sendable = false;
          arr.push(this.devList[i].deviceImei);
        }
        var data = {
          delImeiList: arr
        };
        this.isBtnCont = true;
        this.postDeviceInit(data);
      } else {
        this.app.$emit("show-alert-msg", this.$t("batchDeviceDialog.failTip2"));
      }
    },
    //某个设备重新执行命令
    redoListItem(idx) {
      this.devList[idx].result = "";
      this.sendCmd(idx);
    },
    doAllCmd() {
      //全部设备执行命令
      for (var i = 0; i < this.devList.length; i++) {
        this.delImeiList.push(this.devList[i].deviceImei);
        this.devList[i].sendable = false;
      }
      console.log(this.delImeiList);
      var data = {
        delImeiList: JSON.parse(JSON.stringify(this.delImeiList))
      };
      data.delImeiList = data.delImeiList.filter((item, index, self) => {
        return self.indexOf(item) == index;
      });
      // 执行初始化
      this.isBtnCont = true;
      this.postDeviceInit(data);
    },
    // 执行单个初始化
    sendCmd(idx) {
      // console.log(idx);
      var list = this.devList[idx].deviceImei;
      var data = {
        delImeiList: list
      };
      this.devList[idx].sendable = false;
      this.isBtnCont = true;
      this.postDeviceInit(data, idx);
    },
    checkDeviceList(list) {
      // 检查导入的表格中设备能否执行初始化
      // console.log(list);
      if (list.length == 0) {
        return;
      }
      var data = {
        delImeiList: list
      };
      console.log(data);
      // 2022-4-8
      checkDeviceListInfo(data).then(res => {
        if (res.errCode == "200") {
          // console.log(res);
          var list = res.data;
          this.checkImeiList = list;
          this.failLength = list.failList.length;
          this.sucessLength = list.sucessList.length;
          failList = list.failList;
          succList = list.sucessList;
          //
          var arrList = [];
          for (var k = 0; k < succList.length; k++) {
            arrList.push({
              deviceImei: succList[k],
              result: "",
              sendable: true
            });
          }
          console.log(arrList);
          // 失败的总数的计算
          this.devList = this.devList.concat(arrList);
          this.devList = this.deleteObject(this.devList);
          if (list.sucessList.length > 0) {
            // 存在可以初始化的设备
            if (list.sucessList.length > 1) {
              // this.isDeviceDialog = true;
            }
            this.isSuccess = true;
          }
          if (list.failList.length > 0) {
            console.log("12");
            // 存在不能初始化的设备
            this.isSuccess = false;
            if (
              list.failList.length == 1 &&
              typeof data.delImeiList == "string"
            ) {
              console.log("aaa");
              // 单个执行检查时的弹窗
              this.app.$emit(
                "show-alert-msg",
                this.$t("batchDeviceDialog.failTip3")
              );
            } else {
              this.isDeviceDialog = true;
              for (var i = 0; i < this.devList.length; i++) {
                this.devList[i].sendable = true;
              }
            }
          }
        } else {
          this.isSuccess = false;
          this.app.$emit(
            "show-alert-msg",
            this.$t("batchDeviceDialog.failTip4")
          );
        }
      });
    },
    postDeviceInit(list, idx) {
      //执行设备初始化
      console.log(list, idx);
      var data = list;

      // console.log(data);
      doDeviceInit(data).then(res => {
        if (idx != "undefined") {
          for (var k = 0; k < this.devList.length; k++) {
            this.devList[k].sendable = true;
          }
        } else {
          this.devList[idx].sendable = true;
        }
        this.isSuccess = false;
        if (res.errCode == "200" && res.data == "true") {
          this.isDeviceDialog = false;
          this.isBtnCont = false;
          for (var i = 0; i < this.devList.length; i++) {
            this.devList[i].result =
              new Date().format("yyyy-MM-dd hh:mm:ss") + " " + res.errMsg;
          }
          this.app.$emit("show-alert-msg", this.$t("batchDeviceDialog.ok"));
        } else {
          for (var j = 0; j < this.devList.length; j++) {
            this.devList[j].result =
              new Date().format("yyyy-MM-dd hh:mm:ss") +
              " fail:" +
              this.$t("batchCommandDialog.errTip1");
          }
          this.app.$emit("show-alert-msg", this.$t("batchDeviceDialog.fail"));
        }
      });
    },
    deleteListItem(idx) {
      this.devList.splice(idx, 1);
      this.delImeiList.splice(idx, 1);
    },
    resetList() {
      this.devList = [];
      this.delImeiList = [];
    },
    checkList(imei) {
      // 检查设备是否存在重复
      var tag = true;
      for (var i = 0; i < this.devList.length; i++) {
        if (imei == this.devList[i].deviceImei) {
          tag = false;
          break;
        }
      }
      if (tag) {
        if (this.devList.length > 30) {
          this.app.$emit("show-alert-msg", this.$t("common.importTips"));
          tag = false;
        }
      }
      return tag;
    },
    addToList() {
      var tag = this.checkList(this.deviceImei);
      if (tag) {
        this.checkDeviceList(this.deviceImei);
        setTimeout(() => {
          if (this.isSuccess) {
            // console.log("成功");
            // console.log(this.isSuccess);
            this.devList.push({
              deviceImei: this.deviceImei,
              result: "",
              sendable: true
            });
            this.devList = this.deleteObject(this.devList);
          }
        }, 500);
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
      // 导入的表格数据
      console.log(result);
      var imeiKey = "";
      for (var key in result[0]) {
        imeiKey = key;
        break;
      }
      var list = [];
      for (var i = 0; i < result.length; i++) {
        var imei = result[i][imeiKey];
        console.log(result.length);
        if (result.length > 30) {
          this.app.$emit("show-alert-msg", this.$t("common.importTips"));
          return false;
        }
        if (this.checkList(imei) && /[0-9]{15}/.test(imei)) {
          // this.devList.push({
          //   deviceImei: result[i][imeiKey],
          //   result: "",
          //   sendable: true,
          // });
          list.push(result[i][imeiKey]);
        }
      }
      console.log(list);
      // 导入的设备先进行检查
      this.checkDeviceList(JSON.parse(JSON.stringify(list)));
      console.log(succList);
    },
    dealDevItem(op) {
      this.deviceImei = op.deviceImei;
    },
    showDialog(op) {
      console.log('op', op)
      // 打开设备初始化窗口
      this.isShow = true;
      this.uploadFile = "";
      this.isFile = false;
      this.deviceImei = "";
      var list = [];
      for (var i = 0; i < op.devList.length; i++) {
        list.push(op.devList[i].deviceImei);
      }
      // 导入的设备先进行检查
      this.checkDeviceList(JSON.parse(JSON.stringify(list)));
      console.log('succList', succList);
    },
    onUploadFile(files) {
      ExportUtil.parseExcel(files[0], this.dealExcel);
    },
    deleteObject(obj) {
      // 去除数组对象中存在重复的对象
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        // console.log(keys);
        keys.sort(function(a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!Object.prototype.hasOwnProperty.call(stringify, str)) {
          uniques.push(obj[i]);
          // console.log(obj[i]);
          stringify[str] = true;
        }
      }
      return uniques;
    },
    closeDialog() {
      this.isShow = false;
      succList = [];
      failList = [];
      this.devList = [];
    },
    listenEvent() {
      this.app.$on("show-batch-device-dialog", this.showDialog);
      this.app.$on("close-batch-device-dialog", this.closeDialog);
    },
    offEvent() {
      this.app.$off("show-batch-device-dialog", this.showDialog);
      this.app.$off("close-batch-device-dialog", this.closeDialog);
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

<style lang="scss" scoped>
.deivce-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: center;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      margin-top: 18px;
      margin-bottom: 4px;
    }
  }
}
</style>
