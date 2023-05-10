<template>
  <section class="production-upgrade layout-container">
    <div class="form-card" style="height:100%;width:100%">
      <div class="upgrade-content">
        <el-tabs
          type="border-card"
          v-model="activeName"
          @tab-click="changeTabs"
        >
          <el-tab-pane :label="$t('production.deviceUpgradeFile')" name="first">
            <div class="device-upgrade-file">
              <el-form size="small" class="form-table-content form-data">
                <el-form-item :label="$t('production.version')">
                  <el-input
                    type="text"
                    id="name"
                    style="position:fixed;bottom:-9999px;width:160px"
                    size="small"
                  ></el-input>
                  <el-input
                    type="text"
                    id="name"
                    style="width:160px"
                    size="small"
                    v-model="deviceVersion"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="$t('production.versionLevel')">
                  <el-select v-model="versionLevel">
                    <el-option
                      :value="-1"
                      :label="$t('common.all')"
                    ></el-option>
                    <el-option
                      v-for="item in 10"
                      :key="item + 'version'"
                      :value="item"
                      :label="$t('production.versionLevel') + item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('production.versionStatus')">
                  <el-select v-model="versionStatus">
                    <el-option
                      :value="-1"
                      :label="$t('common.all')"
                    ></el-option>
                    <el-option :value="0" :label="$t('card.no')"></el-option>
                    <el-option :value="1" :label="$t('card.yes')"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="searchGradeFile">{{
                    $t("common.search")
                  }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="ShowUpgradeBox">{{
                    $t("production.uploadUpgradeFile")
                  }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="exportTable">{{
                    $t("common.export")
                  }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="exportTable('all')">{{
                    $t("common.exportAll")
                  }}</el-button>
                </el-form-item>
              </el-form>
              <div class="device-upgrade-table layout-container-table">
                <el-table
                  :data="upgradeList"
                  height="100%"
                  border
                  :row-class-name="tableRowClassName"
                  :header-cell-style="{ background: '#f7f7f7' }"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                  ></el-table-column>
                  <!-- <el-table-column type="index" width="50" label="序号"> </el-table-column> -->
                  <el-table-column
                    :label="$t('production.version')"
                    width="180"
                    prop="version"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('production.fileName')"
                    width="180"
                    prop="fileName"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('production.fileSize')"
                    width="200"
                    prop="fileSize"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('production.fileUrl')"
                    width="300"
                    prop="fileUrl"
                  ></el-table-column>
                  <el-table-column
                    :align="$t('production.fileStatus')"
                    width="150"
                  >
                    <template slot-scope="props">
                      {{ getVersionFileStatus(props.row.sts) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('production.uploadTime')"
                    width="150"
                  >
                    <template slot-scope="props">
                      {{ props.row.uploadTime }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('production.versionLevel')"
                    style="flex:1"
                    prop="versionLevel"
                  >
                  </el-table-column>
                  <el-table-column :label="$t('common.operation')" width="250">
                    <template slot-scope="scope">
                      <el-button
                        type="success"
                        size="small"
                        @click="updateVerisonFile(scope.row)"
                        >{{ $t("car.update") }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  @current-change="handleCurrentChange"
                  :page-size="page1.limit"
                  :total="page1.total"
                  layout="total, prev, pager, next,jumper"
                ></el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备升级设置" name="second">
            <device-update-setting></device-update-setting>
          </el-tab-pane>
          <el-tab-pane label="绑定管理" name="third">
            <device-bingding></device-bingding>
          </el-tab-pane>
          <el-tab-pane label="设备升级记录" name="fourth">
            <device-update-record></device-update-record>
          </el-tab-pane>
          <el-tab-pane label="设备版本信息" name="fifth">
            <device-message></device-message>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <dialog-comp
      :visible.sync="isShowUpgradeBox"
      dialog-title="添加升级文件"
      :dialog-width="500"
    >
      <div class="upgrade-box">
        <el-form label-width="100px" style="width:450px">
          <el-form-item label="版本号：">
            <el-input v-model="addVersion" style="width: 330px"></el-input>
          </el-form-item>
          <el-form-item label="选择文件：">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :limit="1"
              :file-list="fileList"
              :before-upload="beforeUpload"
            >
              <el-button slot="trigger" class="btn-primary-button"
                >选取文件</el-button
              >
              <div slot="tip" class="el-upload-list__item-name">
                {{ fileName }}
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="版本等级：">
            <el-select v-model="uploadVersionLevel" style="width: 330px">
              <el-option
                v-for="item in 10"
                :key="item + 'item'"
                :value="item"
                :label="'版本等级' + item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="uploadGradeFile">上传</el-button>
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>

    <dialog-comp
      :visible.sync="isShowUpdateFileBox"
      dialog-title="修改版本文件"
      :dialog-width="500"
    >
      <div class="upgrade-box">
        <el-form label-width="100px" style="width:450px">
          <el-form-item label="当前版本号：">
            <span>{{ updateFileBox.version }}</span>
          </el-form-item>
          <el-form-item label="版本等级：">
            <el-select v-model="updateFileBox.versionLevel">
              <el-option
                v-for="item in 10"
                :key="item + 'version'"
                :value="item"
                :label="'版本等级' + item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本状态：">
            <el-select v-model="updateFileBox.sts">
              <el-option :value="0" label="无效"></el-option>
              <el-option :value="1" label="有效"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateVerisonFile1"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
  </section>
</template>

<script>
import deviceUpdateSetting from "@/views/production/deviceUpdateSetting";
import deviceUpdateRecord from "@/views/production/deviceUpdateRecord";
import deviceBingding from "@/views/production/deviceBingding";
import deviceVersionMessage from "@/views/production/deviceVersionMessage";
import ExportUtil from "@/utils/exportUtil.js";
import {
  queryFirmwareFile,
  updateFirmwareFile,
  addFirmwareFile
} from "@/api/production";
export default {
  name: "ProductionUpgrade",
  components: {
    "device-update-setting": deviceUpdateSetting,
    "device-update-record": deviceUpdateRecord,
    "device-bingding": deviceBingding,
    "device-message": deviceVersionMessage
  },
  data: () => ({
    updateFileBox: {},
    isShowUpdateFileBox: false,
    addRemark: "",
    addVersion: "", //导入升级版本号
    versionStatus: -1,
    versionLevel: -1,
    deviceModel: "",
    deviceVersion: "",
    activeName: "first",
    uploadVersionLevel: 1,
    upgradeList: [], //设备升级文件

    isShowUpgradeBox: false,
    fileList: [],
    fileName: "",
    files: "",
    height1: 570,
    height2: 630,
    page1: {
      current: 1,
      num: 1,
      total: 0,
      limit: 30
    },
    allModelList: [], //所有的型号的集合
    selectList: []
  }),
  methods: {
    ShowUpgradeBox() {
      this.isShowUpgradeBox = true;
      this.addVersion = "";
      this.uploadVersionLevel = 1;
      this.files = "";
      this.fileName = "";
      this.$refs.upload.clearFiles();
    },
    exportEcall(list) {
      // 导出模板
      let theTitle = [
        "序号",
        "版本号",
        "文件名称",
        "文件大小",
        "文件地址",
        "文件状态",
        "上传时间",
        "版本等级"
      ];
      let theList = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        theList.push([
          i + 1,
          item.version,
          item.fileName,
          item.fileSize,
          item.fileUrl,
          this.getVersionFileStatus(item.sts),
          item.uploadTime
            ? new Date(item.uploadTime).format("yyyy-MM-dd hh:mm:ss")
            : "--",
          item.versionLevel ? item.versionLevel : "--"
        ]);
      }
      ExportUtil.exportTable(theTitle, theList, "设备升级文件");
    },
    exportTable(tag) {
      // 导出表格
      if (tag == "all") {
        let data = {
          page: this.page1.current,
          pageSize: this.page1.limit
        };
        if (this.versionStatus != -1) {
          data.sts = this.versionStatus;
        }
        if (this.deviceVersion) {
          data.version = this.deviceVersion;
        }
        if (this.versionLevel != -1) {
          data.versionLevel = this.versionLevel;
        }
        queryFirmwareFile(data).then(res => {
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
    handleSelectionChange(arr) {
      this.selectList = arr;
    },
    handleCurrentChange(val) {
      this.page1.current = val;
      this.searchGradeFile();
    },

    getVersionFileStatus(num) {
      // 获取升级文件的状态
      switch (num) {
        case 1:
          return "有效";
        case 0:
          return "无效";
      }
    },
    updateVerisonFile1() {
      // 修改升级文件
      const data = {
        fileId: this.updateFileBox.fileId,
        versionLevel: this.updateFileBox.versionLevel,
        sts: this.updateFileBox.sts
      };
      updateFirmwareFile(data).then(res => {
        if (res.errCode == 200) {
          this.searchGradeFile();
          this.isShowUpdateFileBox = false;
          this.$message({
            message: "升级文件修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "升级文件修改失败",
            type: "warning"
          });
        }
      });
    },
    updateVerisonFile(item) {
      console.log(item);
      // 修改版本文件
      this.updateFileBox = item;
      this.isShowUpdateFileBox = true;
    },
    uploadGradeFile() {
      // 导入升级文件
      let formDate = new FormData();
      formDate.append("file", this.files);
      formDate.append("version", this.addVersion);
      formDate.append("versionLevel", this.uploadVersionLevel);
      var that = this;
      // console.log("formDate", formDate);
      addFirmwareFile(formDate).then(res => {
        if (res.errCode == "200") {
          that.searchGradeFile();
          that.isShowUpgradeBox = false;
          that.$message({
            message: "上传成功",
            type: "success"
          });
        } else {
          that.$message({
            message: "上传失败",
            type: "warning"
          });
        }
      });
    },
    searchGradeFile() {
      // 查询设备升级文件
      let data = {
        page: this.page1.current,
        pageSize: this.page1.limit
      };
      if (this.versionStatus != -1) {
        data.sts = this.versionStatus;
      }
      if (this.deviceVersion) {
        data.version = this.deviceVersion;
      }
      if (this.versionLevel != -1) {
        data.versionLevel = this.versionLevel;
      }
      queryFirmwareFile(data).then(res => {
        if (res.errCode == 200) {
          this.upgradeList = res.data.list;
          this.page1.total = res.data.total;
        }
      });
    },

    beforeUpload(file) {
      // 上传前 文件校验
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
    tableRowClassName({ row, rowIndex }) {
      // 表格中条纹的设置
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    changeTabs(idx) {
      // console.log(idx);
      if (idx.name == "first") {
        this.searchGradeFile();
      } else if (idx.name == "third") {
        // console.log("disige");
        this.app.$emit("load-bang-ding");
      } else if (idx.name == "fourth") {
        // console.log("disige");
        this.app.$emit("load-update-record");
      } else if (idx.name == "second") {
        this.app.$emit("load-firmware-update");
      } else if (idx.name == "fifth") {
        this.app.$emit("load-version-message");
      }
    },
    getTableHeight() {
      let windowH = window.innerHeight;
      if (windowH <= 768) {
        this.height2 = 460;
      } else {
        this.height2 = 630;
      }
    }
  },
  created() {
    this.getTableHeight();
  },
  mounted() {
    this.searchGradeFile();
    window.addEventListener("resize", this.debounce(this.getTableHeight, 200));
  },
  beforeDestroy() {
    window.removeEventListener(
      "resize",
      this.debounce(this.getTableHeight, 200)
    );
  }
};
</script>

<style scoped lang="scss">
.form-table-content {
  ::v-deep .el-form-item__label {
    white-space: nowrap;
  }
}
.btn-content {
  margin-top: 10px;
}
::v-deep .el-tabs__content {
  height: calc(100% - 50px);
  .el-tab-pane {
    height: 100%;
  }
}
.dev-list-transfer {
  height: 100%;
  display: flex;
  flex-direction: row;
  width: 500px;
  .left-table {
    height: calc(100% - 10px);
    width: 250px;
    ::v-deep .el-checkbox__inner {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    ::v-deep .el-checkbox__inner::after {
      top: 2px;
      left: 5px;
    }
  }
  .right-table {
    height: calc(100% - 62px);
    // width: 300px;
    flex: 1;
  }
  .shugang {
    width: 1px;
    height: 100%;
    background: #eee;
    margin: 0 5px;
  }
  .btn-del {
    .iconfont {
      color: #ccc;
    }
  }
  .bottom-btn-cont {
    text-align: right;
  }
  .dev-sum {
    color: #606266;
    display: inline-block;
    margin: 10px 0 5px 10px;
  }
  .left-table-dev {
    height: calc(100% - 28px);
  }
  .imgIcon {
    img {
      display: inline-block;
      width: 35px;
    }
  }
}
.upload-demo {
  display: flex;
}
.upgrade-box {
  ::v-deep .el-form-item {
    white-space: nowrap;
  }
}
.device-upgrade-table {
  // margin-top: 10px;
}
.production-upgrade {
  .upgrade-content {
    height: 100%;
    ::v-deep .el-tabs--border-card {
      height: 99%;
    }
  }
  ::v-deep .el-form-item__label {
    padding: 0 5px 0 0 !important;
  }
  ::v-deep .el-tabs__content {
    padding: 5px !important;
  }
}
.form-data {
  ::v-deep .el-input__icon {
    height: 32px !important;
  }
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
    padding: 8px 20px !important;
  }
}
</style>
