<template>
  <div class="device-upgrade-setting">
    <div class="device-setting">
      <el-form size="small">
        <el-form-item>
          <el-button type="primary" @click="ShowUpgradeBox"
            >加入升级设备</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ShowBatchUpgradeBox"
            >批量加入升级设备</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportTable">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportTable('all')"
            >导出全部</el-button
          >
          <el-tag type="info">升级服务器地址:ups,agps.basegps.com,9998</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <div class="device-setting1">
      <el-form size="small" class="form-table-content form-data">
        <el-form-item label="设备:">
          <el-input
            type="text"
            id="name"
            style="position:fixed;bottom:-9999px;width:160px"
            size="small"
            class="device-input"
          ></el-input>
          <el-input
            type="text"
            id="name"
            class="device-input"
            style="width:160px"
            size="small"
            v-model="deviceImei"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备型号:">
          <el-input
            style="width:160px"
            size="small"
            v-model="deviceModel"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本号:">
          <el-input
            style="width:160px"
            size="small"
            v-model="version"
          ></el-input>
        </el-form-item>
        <el-form-item label="升级结果:">
          <el-select style="width:160px" size="small" v-model="upgradeStatus">
            <el-option :value="-1" label="全部"></el-option>
            <el-option :value="0" label="等待升级"></el-option>
            <el-option :value="1" label="升级成功"></el-option>
            <el-option :value="2" label="升级中"></el-option>
            <el-option :value="3" label="升级失败"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadUpgradeSettingList"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="device-upgrade-table layout-container-table height70">
      <el-table
        :data="upgradeSettingList"
        height="100%"
        border
        :row-class-name="tableRowClassName"
        :header-cell-style="{ background: '#f7f7f7' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column label="设备号" width="180" prop="deviceImei">
          <template slot-scope="scope">
            <a @click="dealTableDevice(scope.row)">{{
              scope.row.deviceImei
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="设备型号"
          width="180"
          prop="model"
        ></el-table-column>
        <el-table-column
          label="原版本号"
          width="200"
          prop="oldVersion"
        ></el-table-column>
        <el-table-column
          label="升级版本号"
          width="200"
          prop="newVersion"
        ></el-table-column>
        <el-table-column label="升级结果" style="flex: 1">
          <template slot-scope="props">
            {{ getUpgradeStatus(props.row.isUpdate) }}
          </template>
        </el-table-column>
        <el-table-column label="升级状态" width="100">
          <template slot-scope="props">
            {{ props.row.status == 0 ? "未完成" : "已完成" }}
          </template>
        </el-table-column>
        <el-table-column label="跨版本升级" width="150">
          <template slot-scope="props">
            {{ props.row.crossVersion == 0 ? "否" : "是" }}
          </template>
        </el-table-column>
        <el-table-column label="升级时间" width="150">
          <template slot-scope="props">
            {{ props.row.createDate.time | fdatetime }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="150"
          prop="remark"
        ></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              v-show="
                (scope.row.status == 0 && scope.row.isUpdate != 2) ||
                  (scope.row.status == 0 && scope.row.isUpdate == 0)
              "
              @click="showUpdateSettingBox(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              v-show="
                (scope.row.status == 0 && scope.row.isUpdate != 2) ||
                  (scope.row.status == 0 && scope.row.isUpdate == 0) ||
                  (scope.row.status == 1 && scope.row.isUpdate == 1)
              "
              @click="deleleUpgradeSetting(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, prev, pager, next,jumper"
      ></el-pagination>
    </div>
    <dialog-comp
      :visible.sync="isShowUpgradeBox"
      dialog-title="设备升级"
      :dialog-width="500"
    >
      <div class="upgrade-box">
        <el-form label-width="120px" style="width:450px">
          <el-form-item label="设备型号：">
            <el-select v-model="upgradeDeviceModel" style="width:330px">
              <el-option
                v-for="(item, idx) in modelList"
                :key="item + idx"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需升级版本号：">
            <el-select style="width:330px" v-model="upgradeDeviceVersion">
              <el-option
                v-for="(item, idx) in versionList"
                :key="item + idx"
                :value="item.version"
                :label="item.version"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否跨版本升级:">
            <el-select v-model="upgradeDeviceCrossVersion" style="width: 330px">
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备号：">
            <el-input v-model="upgradeDeviceImei"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="upgradeDeviceRemark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveShengJiDevice"
              >上传</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
    <dialog-comp
      :visible.sync="isShowBatchUpgradeBox"
      dialog-title="批量添加升级文件"
      :dialog-width="500"
    >
      <div class="upgrade-box">
        <el-form label-width="120px" style="width:450px">
          <el-form-item label="设备型号：">
            <el-select v-model="upgradeDeviceModel" style="width:330px">
              <el-option
                v-for="item in modelList"
                :key="item + 'item'"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需升级版本号：">
            <el-select style="width:330px" v-model="upgradeDeviceVersion">
              <el-option
                v-for="item in versionList"
                :key="item + 'item'"
                :value="item.version"
                :label="item.version"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否跨版本升级:">
            <el-select v-model="upgradeDeviceCrossVersion" style="width: 330px">
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备系列号：">
            <div style="width:330px">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="#"
                :limit="1"
                :file-list="fileList"
                :on-change="uploadFile"
                :before-upload="beforeUpload"
              >
                <el-button slot="trigger" class="btn-primary-button"
                  >选取文件</el-button
                >
                <div slot="tip" class="el-upload-list__item-name">
                  {{ fileName }}
                </div>
              </el-upload>
            </div>
            <div class="orange-box">
              <div v-html="$t('batchTransfer.downloadTip1')"></div>
              <div>
                <font style="color: red;font-weight: bold;">{{
                  $t("common.template")
                }}</font>
                <a
                  class="btn-white"
                  style="margin-left: 0.8rem;"
                  :href="API.batchInitFile"
                  >{{ $t("common.download") }}</a
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="upgradeDeviceRemark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveBatchShengJiDevice"
              >上传</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
    <dialog-comp
      :visible.sync="isShowupdateDeviceBox"
      dialog-title="修改配置信息"
      :dialog-width="500"
    >
      <div class="upgrade-box">
        <el-form label-width="130px" style="width:450px">
          <el-form-item label="设备号：">
            <span>{{ updateDeviceSetting.deviceImei }}</span>
          </el-form-item>
          <!--  -->
          <el-form-item label="设备型号：">
            <el-input v-model="updateDeviceSetting.model"></el-input>
          </el-form-item>
          <el-form-item label="需升级版本号：">
            <el-select
              style="width:320px"
              v-model="updateDeviceSetting.newVersion"
            >
              <el-option
                v-for="(item, index) in versionList"
                :key="index"
                :value="item.version"
                :label="item.version"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否跨版本升级：">
            <el-select
              style="width:320px"
              v-model="updateDeviceSetting.crossVersion"
            >
              <el-option :value="0" label="否"></el-option>
              <el-option :value="1" label="是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              v-model="updateDeviceSetting.remark"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUpdateSetting"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import ExportUtil from "@/utils/exportUtil.js";
import {
  queryFirmwareUpdate,
  queryModelGuangLianVersion,
  AddBatchDeviceFirmware,
  queryModelVersion,
  saveUpdateDeviceSetting,
  deleteUpdateSetting
} from "@/api/production";
export default {
  name: "deviceUpdateSetting",
  data: () => ({
    upgradeDeviceImei: "",
    upgradeDeviceModel: "",
    upgradeDeviceVersion: "",
    upgradeDeviceRemark: "",
    upgradeSettingList: [], //设备升级设置
    userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
    // upgradeSettingList: Array.from({ length: 30 }).map((_, index) => ({
    //   index,
    //   deviceImei: parseInt(Math.random() * 100000000000),
    //   model: "WT07",
    //   currentModel: "WT07_V2.1." + index,
    //   newModel: "WT07_V2.1." + index,
    //   status: "你牛啊",
    //   person: "admin" + index,
    // })),
    // upgradeList: Array.from({ length: 30 }).map((_, index) => ({
    //   index,
    //   version: "GK07_V1.0.9" + index,
    //   fileName: "zenos" + index,
    //   byte: parseInt(Math.random() * 1000000),
    //   url: "http://47.106.81.204:8080/update_file/" + index,
    //   explain: "ABC" + parseInt(Math.random() * 100),
    //   status: "可用啊",
    //   person: "牛逼" + index + 1 + "号",
    // })),
    isShowBatchUpgradeBox: false,
    isShowUpgradeBox: false,
    isShowupdateDeviceBox: false,
    height1: 587,
    fileList: [],
    fileName: "",
    files: "",
    upgradeStatus: -1,
    page: {
      current: 0,
      num: 1,
      total: 0,
      pageSize: 30
    },
    deviceImei: "",
    version: "",
    deviceModel: "",
    updateDeviceSetting: {
      deviceImei: "",
      model: "",
      newVersion: "",
      crossVersion: 0,
      remark: "",
      pkId: 0
    },
    uploadDeviceList: [],
    modelList: [],
    versionList: [],
    upgradeDeviceCrossVersion: 1,
    selectList: []
  }),
  watch: {
    upgradeDeviceModel() {
      if (this.upgradeDeviceModel) {
        this.upgradeDeviceVersion = "";
        this.loadModelVersionList(this.upgradeDeviceModel);
      }
    }
  },
  methods: {
    dealTableDevice(item) {
      // console.log(item);
      // 点击设备打开设备详情的窗口
      this.app.$emit("show-device-dialog", {
        name: "DeviceDialog",
        imei: item.deviceImei,
        tab: "device"
      });
    },
    handleSelectionChange(arr) {
      this.selectList = arr;
    },
    exportEcall(list) {
      // 导出的模板
      let theTitle = [
        "序号",
        "设备号",
        "设备型号",
        "当前版本号",
        "最新版本号",
        "升级结果",
        "升级状态",
        "跨版本升级",
        "升级时间",
        "备注"
      ];
      let theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.deviceImei,
          item.model,
          item.oldVersion,
          item.newVersion,
          this.getUpgradeStatus(item.isUpdate),
          item.status == 0 ? "未完成" : "已完成",
          item.crossVersion == 0 ? "否" : "是",
          item.createDate.time
            ? new Date(item.createDate.time).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.remark ? item.remark : "--"
        ]);
      }
      ExportUtil.exportTable(theTitle, theList, "设备升级设置记录");
    },
    exportTable(tag) {
      // 导出表格
      if (tag == "all") {
        let data = {
          page: this.page.current,
          pageSize: 100000
        };
        if (this.deviceImei) {
          data.deviceImei = this.deviceImei;
        }
        if (this.version) {
          data.version = this.version;
        }
        if (this.upgradeStatus != -1) {
          data.isUpdate = this.upgradeStatus;
        }
        if (this.deviceModel) {
          data.model = this.deviceModel;
        }
        queryFirmwareUpdate(data).then(res => {
          if (res.errCode == 200) {
            this.exportEcall(res.data.list);
          }
        });
      } else {
        if (this.selectList.length == 0) {
          this.app.$emit("show-alert-msg", this.$t("common.exportTip"));
          return;
        } else {
          this.exportEcall(this.selectList);
        }
      }
    },
    loadModelVersionList(model) {
      // 通过设备型号获取关联的版本号
      let data = {
        page: this.page.current,
        pageSize: 10000
      };
      // data.model = this.upgradeDeviceModel;
      data.model = model;
      queryModelGuangLianVersion(data).then(res => {
        if (res.errCode == 200) {
          this.versionList = res.data.list;
        }
      });
    },
    ShowBatchUpgradeBox() {
      // 打开批量升级窗口
      this.isShowBatchUpgradeBox = true;
      this.upgradeDeviceModel = "";
      this.upgradeDeviceVersion = "";
      this.upgradeDeviceImei = "";
      this.upgradeDeviceRemark = "";
      this.uploadDeviceList = [];
      this.loadModelOptions();
    },
    ShowUpgradeBox() {
      // 打开单个升级窗口
      this.isShowUpgradeBox = true;
      this.upgradeDeviceModel = "";
      this.upgradeDeviceVersion = "";
      this.upgradeDeviceImei = "";
      this.upgradeDeviceRemark = "";
      this.loadModelOptions();
    },
    isHasValue() {
      if (!this.upgradeDeviceImei) {
        this.app.$emit("show-alert-msg", "请添加设备号");
        return;
      }
      if (!this.upgradeDeviceModel) {
        this.app.$emit("show-alert-msg", "请选择设备型号");
        return;
      }
      if (!this.upgradeDeviceVersion) {
        this.app.$emit("show-alert-msg", "请选择相关的版本号");
        return;
      }
      if (!this.upgradeDeviceRemark) {
        this.app.$emit("show-alert-msg", "请填写备注信息");
        return;
      }
    },
    saveShengJiDevice() {
      // 单个设备升级
      if (!this.upgradeDeviceImei) {
        this.app.$emit("show-alert-msg", "请添加设备号");
        return;
      }
      if (!this.upgradeDeviceModel) {
        this.app.$emit("show-alert-msg", "请选择设备型号");
        return;
      }
      if (!this.upgradeDeviceVersion) {
        this.app.$emit("show-alert-msg", "请选择相关的版本号");
        return;
      }
      // if (!this.upgradeDeviceRemark) {
      //   this.app.$emit("show-alert-msg", "请填写备注信息");
      //   return;
      // }
      const data = {
        deviceImei: this.upgradeDeviceImei,
        model: this.upgradeDeviceModel,
        crossVersion: this.upgradeDeviceCrossVersion,
        newVersion: this.upgradeDeviceVersion,
        remark: this.upgradeDeviceRemark
      };
      AddDeviceFirmware(data).then(res => {
        if (res.errCode == 200) {
          this.$message({
            message: "设备升级成功",
            type: "success"
          });
          this.loadUpgradeSettingList();
          this.isShowUpgradeBox = false;
        } else {
          this.$message.error("设备升级失败");
        }
      });
    },
    saveBatchShengJiDevice() {
      if (!this.uploadDeviceList) {
        this.app.$emit("show-alert-msg", "请添加设备号");
        return;
      }
      if (!this.upgradeDeviceModel) {
        this.app.$emit("show-alert-msg", "请选择设备型号");
        return;
      }
      if (!this.upgradeDeviceVersion) {
        this.app.$emit("show-alert-msg", "请选择相关的版本号");
        return;
      }
      if (!this.upgradeDeviceRemark) {
        this.app.$emit("show-alert-msg", "请填写备注信息");
        return;
      }
      // 多个设备升级
      const data = {
        deviceImeis: this.uploadDeviceList.join(","),
        model: this.upgradeDeviceModel,
        crossVersion: this.upgradeDeviceCrossVersion,
        newVersion: this.upgradeDeviceVersion,
        remark: this.upgradeDeviceRemark
      };
      AddBatchDeviceFirmware(data).then(res => {
        if (res.errCode == 200) {
          this.$message({
            message: "设备批量升级成功",
            type: "success"
          });
          this.loadUpgradeSettingList();
          this.isShowBatchUpgradeBox = false;
        } else {
          this.$message.error("设备批量升级失败");
        }
      });
    },
    loadModelOptions() {
      // 获取可导入的设备型号信息
      queryModelVersion({ type: 0 }).then(res => {
        if (res.errCode == 200) {
          this.modelList = res.data;
        }
      });
    },
    // loadVersionOptions() {
    //   // 获取可导入的版本号
    //   queryModelVersion({ type: 1}).then(res=> {
    //     if (res.errCode == 200) {
    //       this.versionList = res.data;
    //     }
    //   })
    // },
    saveUpdateSetting() {
      // 保存修改升级配置
      if (!this.updateDeviceSetting.model) {
        this.app.$emit("show-alert-msg", "请填写型号");
        return;
      }
      if (!this.updateDeviceSetting.newVersion) {
        this.app.$emit("show-alert-msg", "请选择升级的版本号");
        return;
      }
      if (!this.updateDeviceSetting.remark) {
        this.app.$emit("show-alert-msg", "请填写备注信息");
        return;
      }
      let data = this.updateDeviceSetting;
      saveUpdateDeviceSetting(data).then(res => {
        if (res.errCode == 200) {
          this.loadUpgradeSettingList();
          this.isShowupdateDeviceBox = false;
          this.$message({
            message: "升级配置修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "升级配置修改失败",
            type: "warning"
          });
        }
      });
    },
    showUpdateSettingBox(item) {
      this.isShowupdateDeviceBox = true;
      for (let key in this.updateDeviceSetting) {
        this.updateDeviceSetting[key] = item[key];
      }
      this.loadModelVersionList(item.model);
    },
    deleleUpgradeSetting(item) {
      // 删除升级配置信息
      const data = {
        pkIds: Array.from([item.pkId])
      };
      // console.log(data);
      this.app.$emit("show-confirm-msg", "是否要删除该条升级配置", () => {
        deleteUpdateSetting(data).then(res => {
          if (res.errCode == 200) {
            this.loadUpgradeSettingList();
            this.$message({
              message: "设备配置信息删除成功",
              type: "success"
            });
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadUpgradeSettingList();
    },
    getUpgradeStatus(num) {
      // 获取升级结果
      switch (num) {
        case 0:
          return "等待升级";
        case 1:
          return "升级成功";
        case 2:
          return "升级中";
        case 3:
          return "升级失败";
      }
    },
    loadUpgradeSettingList() {
      // 获取设备升级列表
      let data = {
        page: this.page.current,
        pageSize: this.page.pageSize
      };
      if (this.deviceImei) {
        data.deviceImei = this.deviceImei;
      }
      if (this.version) {
        data.version = this.version;
      }
      if (this.upgradeStatus != -1) {
        data.isUpdate = this.upgradeStatus;
      }
      if (this.deviceModel) {
        data.model = this.deviceModel;
      }
      queryFirmwareUpdate(data).then(res => {
        if (res.errCode == 200) {
          this.upgradeSettingList = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      // 表格中条纹的设置
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    getTableHeight() {
      let windowH = window.innerHeight;
      if (windowH <= 768) {
        this.height1 = 417;
      } else {
        this.height1 = 587;
      }
    },
    uploadFile(file, fileList) {
      // console.log("file", file);
      // console.log("fileList", fileList);
      ExportUtil.parseExcel(file.raw, this.dealExcel);
    },
    dealExcel(result) {
      console.log(result);
      let arrList = [];
      arrList = result.map((item, index, arr) => {
        return item;
      });
      let arrListStr = [];
      for (let i = 0; i < arrList.length; i++) {
        let item = arrList[i];
        for (let key in item) {
          arrListStr.push(item[key]);
        }
      }
      this.uploadDeviceList = arrListStr;
    },
    beforeUpload(file) {
      // 上传前 文件校验
      console.log("file", file);
      this.files = file;
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!extension && !extension2) {
      //   this.$message.warning("上传文件只能是 xls、xlsx格式!");
      //   return;
      // }
      if (!isLt2M) {
        this.$message.warning("上传文件大小不能超过 2MB!");
        return;
      }
      this.fileName = file.name;
      return false; // 返回false不会自动上传
    },
    listenEvent() {
      this.app.$on("load-firmware-update", this.loadUpgradeSettingList);
    },
    offEvent() {
      this.app.$off("load-firmware-update", this.loadUpgradeSettingList);
    }
  },
  created() {
    this.getTableHeight();
  },
  mounted() {
    this.listenEvent();
    window.addEventListener("resize", this.debounce(this.getTableHeight, 200));
  },
  beforeDestroy() {
    this.offEvent();
    window.removeEventListener(
      "resize",
      this.debounce(this.getTableHeight, 200)
    );
  }
};
</script>

<style scoped lang="scss">
.device-upgrade-setting {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.form-data {
  ::v-deep .el-input__icon {
    height: 32px !important;
  }
}
.form-table-content {
  ::v-deep .el-form-item__label {
    white-space: nowrap;
  }
}
.upload-demo {
  display: flex;
}
.device-upgrade-table {
  // margin-top: 10px;
}
.device-setting,
.device-setting1 {
  margin-bottom: 5px;
  ::v-deep .el-form {
    display: flex;
    flex-direction: row;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
    display: flex;
    flex-direction: row;
    margin-right: 5px;
  }
  ::v-deep .el-button {
    padding: 9px 20px !important;
  }
}
.device-setting1 {
  margin-bottom: 0 !important;
}
.device-upgrade-file {
  ::v-deep .el-form {
    display: flex;
    flex-direction: row;
  }
  ::v-deep .el-form-item {
    margin-bottom: 0;
    display: flex;
    flex-direction: row;
    margin-right: 5px;
  }
  ::v-deep .el-button {
    // margin-left: 5px !important;
    padding: 9px 20px !important;
  }
}
</style>
