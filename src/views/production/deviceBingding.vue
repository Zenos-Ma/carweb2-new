<template>
  <div class="bingding-content">
    <div class="bang-ding-top">
      <el-button
        type="primary"
        style="padding:8px 20px !important"
        @click="showAddModelBox"
        >{{ $t("production.addDeviceType") }}</el-button
      >
      <el-button
        type="primary"
        style="padding:8px 20px !important"
        @click="ShowModelbangdingVersion"
        >{{ $t("production.deviceBangdingVersion") }}</el-button
      >
      <el-button
        type="primary"
        style="padding:8px 20px !important"
        @click="ShowVersionbangdingModel"
        >{{ $t("production.versionBangdingDevice") }}</el-button
      >
      <span
        >{{ $t("deviceDetail.deviceType") }}:<el-input
          v-model="deviceModel"
          size="small"
          style="width: 150px"
        ></el-input
      ></span>
      <span
        >{{ $t("production.version") }}:<el-input
          v-model="deviceVersion"
          size="small"
          style="width: 150px"
        ></el-input
      ></span>
      <el-button
        type="primary"
        style="padding:8px 20px !important"
        @click="loadModelVersionList"
        >{{ $t("common.search") }}</el-button
      >
    </div>
    <div class="bang-ding-content">
      <div class="device-upgrade-table layout-container-table">
        <el-table
          :data="modelVersionList"
          height="100%"
          border
          :row-class-name="tableRowClassName"
          :header-cell-style="{ background: '#f7f7f7' }"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            type="index"
            width="50"
            :label="$t('common.num')"
          ></el-table-column>
          <el-table-column
            :label="$t('deviceDetail.deviceType')"
            width="180"
            prop="model"
          ></el-table-column>
          <el-table-column
            :label="$t('production.version')"
            width="200"
            prop="version"
          ></el-table-column>
          <el-table-column
            :label="$t('production.bangdingTime')"
            style="flex: 1"
          >
            <template slot-scope="props">
              {{ props.row.createDate.time | fdatetime }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('common.operation')"
            width="300"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                @click="deleteModelVersion(scope.row)"
                >{{ $t("common.delete") }}</el-button
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
    </div>
    <dialog-comp
      :visible.sync="isShowAddModelBox"
      :dialog-title="$t('production.addDeviceType')"
      :dialog-width="350"
      :dialog-height="300"
    >
      <div class="upgrade-box">
        <el-form label-width="100px" size="small">
          <el-form-item :label="$t('common.deviceType')">
            <!-- <el-input type="textarea" :rows="4" placeholder="一行一个设备" style="width:180px" v-model="deviceModels" clearable></el-input> -->
            <el-select v-model="addModelList" multiple>
              <el-option
                v-for="item in allModelList"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addBatchSaveModel">{{
              $t("common.save")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </dialog-comp>
    <dialog-comp
      :visible.sync="isShowModelbangdingVersion"
      :dialog-title="$t('production.deviceBangdingVersion')"
      :dialog-width="500"
      :dialog-height="550"
    >
      <div class="model-bang-ding-version">
        <h3>{{ $t("production.deviceBangdingVersionOneToMany") }}</h3>
        <span>
          {{ $t("common.deviceType") }}:
          <el-select v-model="modelOptions" @change="changeModel">
            <el-option
              v-for="item in modelList"
              :key="item + 'model'"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </span>
        <div style="padding:10px 0">
          {{ $t("production.chooseVersion") }}:
          <multiselect
            v-model="versionOptionsList"
            :options="versionOptionsList1"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            :placeholder="$t('production.chooseVersionTip')"
          >
            <template slot="clear" slot-scope="props">
              <div
                class="multiselect__clear"
                v-if="versionOptionsList.length"
                @mousedown.prevent.stop="clearAll(props.search, 'version')"
              ></div>
            </template>
          </multiselect>
        </div>
        <span>
          <el-button type="primary" @click="modelBingdingVersion">{{
            $t("production.bangding")
          }}</el-button>
        </span>
      </div>
    </dialog-comp>
    <dialog-comp
      :visible.sync="isShowVersionbangdingModel"
      :dialog-title="$t('production.versionBangdingDevice')"
      :dialog-width="500"
    >
      <div class="version-bang-ding-model">
        <h3>{{ $t("production.versionBangdingDeviceOneToMany") }}</h3>
        <span>{{ $t("production.chooseVersion") }}:</span>
        <el-select v-model="versionOptions" @change="changeVersion">
          <el-option
            v-for="item in versionList"
            :key="item + 'model'"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
        <div style="padding:10px 0">
          {{ $t("common.deviceType") }}:
          <multiselect
            v-model="modelOptionsList"
            :options="modelOptionsList1"
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false"
            :preserve-search="true"
            placeholder="请选择版本号"
          >
            <template slot="clear" slot-scope="props">
              <div
                class="multiselect__clear"
                v-if="modelOptionsList.length"
                @mousedown.prevent.stop="clearAll(props.search, 'model')"
              ></div>
            </template>
          </multiselect>
        </div>
        <span>
          <el-button type="primary" @click="versionBingdingModel">{{
            $t("production.bangding")
          }}</el-button>
        </span>
      </div>
    </dialog-comp>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import {
  deleteModelGuangLianVersion,
  queryModelGuangLianVersion,
  addModelVersion,
  queryValidAddList,
  queryValidModelList,
  queryModelVersion,
  addDeviceModel
} from "@/api/production";
export default {
  name: "deviceBingding",
  components: {
    Multiselect
  },
  data: () => ({
    modelOptions: "",
    isShowAddModelBox: false,
    allModelList: [], //所有的型号的集合
    modelList: [], //可以有效的型号
    versionList: [], //可以导入的版本号
    deviceModels: "", //新增的设备型号
    modelOptionsList: [],
    modelOptionsList1: [], //有效型号的集合
    versionOptions: "",
    versionOptionsList: [],
    versionOptionsList1: [], //有效版本的集合
    addModelList: "",
    isShowVersionbangdingModel: false,
    isShowModelbangdingVersion: false,
    modelVersionList: [],
    height: 625,
    page: {
      current: 0,
      num: 1,
      pageSize: 30,
      total: 0
    },
    deviceModel: "",
    deviceVersion: ""
  }),
  watch: {},
  methods: {
    ShowModelbangdingVersion() {
      this.isShowModelbangdingVersion = true;
      this.modelOptions = "";
      this.versionOptionsList = [];
    },
    ShowVersionbangdingModel() {
      this.isShowVersionbangdingModel = true;
      this.versionOptions = "";
      this.modelOptionsList = [];
    },
    handleCurrentChange(val) {
      this.page.current = val;
      this.loadModelVersionList();
    },
    deleteModelVersion(item) {
      // 删除型号版本号的关联
      const data = {
        pkIds: Array.from([item.pkid])
      };
      this.app.$emit(
        "show-confirm-msg",
        this.$t("production.deleteLinkTip"),
        () => {
          deleteModelGuangLianVersion(data).then(res => {
            if (res.errCode == 200) {
              this.loadModelVersionList();
              this.$message({
                message: this.$t("prodction."),
                type: "success"
              });
            } else {
              this.$message({
                message: "型号和版本号关联关系删除失败",
                type: "warning"
              });
            }
          });
        }
      );
    },
    loadModelVersionList() {
      // 获取型号和版本号关联的列表
      let data = {
        page: this.page.current,
        pageSize: this.page.pageSize
      };
      if (this.deviceModel) {
        data.model = this.deviceModel;
      }
      if (this.deviceVersion) {
        data.version = this.deviceVersion;
      }
      queryModelGuangLianVersion(data).then(res => {
        if (res.errCode == 200) {
          this.modelVersionList = res.data.list;
          this.page.total = res.data.total;
        }
      });
    },
    getTableHeight() {
      let windowH = window.innerHeight;
      if (windowH <= 768) {
        this.height = 457;
      } else {
        this.height = 625;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // 表格中条纹的设置
      if (rowIndex % 2 === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        // return "success-row";
      }
      return "";
    },
    modelBingdingVersion() {
      // 型号绑定版本号
      // key为1， 型号
      // key 为0， 版本号
      if (!this.modelOptions) {
        this.app.$emit("show-alert-msg", "请选择型号");
        return;
      }
      if (!this.modelOptionsList) {
        this.app.$emit("show-alert-msg", "请选择需要绑定的版本号");
        return;
      }
      const data = {
        key: this.modelOptions,
        list: this.versionOptionsList.join(","),
        type: 1
      };
      addModelVersion(data).then(res => {
        if (res.errCode == 200) {
          this.loadModelVersionList();
          this.versionOptionsList = [];
          this.modelOptions = "";
          this.$message({
            message: "型号关联版本号成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "型号关联版本号失败",
            type: "warning"
          });
        }
      });
    },
    versionBingdingModel() {
      // 版本号绑定型号
      // key为1， 型号
      // key 为0， 版本号
      if (!this.versionOptions) {
        this.app.$emit("show-alert-msg", "请选择版本号");
        return;
      }
      if (!this.modelOptionsList) {
        this.app.$emit("show-alert-msg", "请选择需要绑定的型号");
        return;
      }
      const data = {
        key: this.versionOptions,
        list: this.modelOptionsList.join(","),
        type: 0
      };
      addModelVersion(data).then(res => {
        if (res.errCode == 200) {
          this.loadModelVersionList();
          this.modelOptionsList = [];
          this.versionOptions = "";
          this.$message({
            message: "版本号绑定型号成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "版本号绑定型号失败",
            type: "warning"
          });
        }
      });
    },
    changeModel(value) {
      // 通过型号去获取有效的版本号
      console.log(value);
      if (value) {
        let data = {
          key: this.modelOptions,
          type: 1
        };
        queryValidAddList(data).then(res => {
          if (res.errCode == 200) {
            this.versionOptionsList1 = res.data;
          }
        });
      }
    },
    changeVersion(value) {
      // 通过版本号去获取有效的型号
      if (value) {
        let data = {
          key: this.versionOptions,
          type: 0
        };
        queryValidAddList(data).then(res => {
          if (res.errCode == 200) {
            this.modelOptionsList1 = res.data;
          }
        });
      }
    },
    showAddModelBox() {
      // 打开获取到所有的型号
      this.isShowAddModelBox = true;

      queryValidModelList().then(res => {
        if (res.errCode == 200) {
          this.allModelList = res.data;
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
    loadVersionOptions() {
      // 获取可导入的版本号
      queryModelVersion({ type: 1 }).then(res => {
        if (res.errCode == 200) {
          this.versionList = res.data;
        }
      });
    },
    addBatchSaveModel() {
      // 添加设备型号
      // let list = this.deviceModels.replace(/\n|\r\n/g, ",");
      // let arrList = list.split(",");
      // let stsList = [];
      // for (let i = 0; i < arrList.length; i++) {
      //   stsList.push(arrList[i].trim());
      // }
      // if (!stsList) {
      //   this.app.$emit("show-alert-msg", "请输入设备型号");
      //   return;
      // }
      const data = {
        models: this.addModelList.join(",")
      };
      addDeviceModel(data).then(res => {
        if (res.errCode == 200) {
          this.loadModelOptions();
          this.showAddModelBox();
          this.addModelList = "";
          this.$message({
            message: "添加设备型号成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "添加设备型号失败",
            type: "warning"
          });
        }
      });
    },
    clearAll(data, tag) {
      // 清空所有的选中
      if (tag == "version") this.versionOptionsList = [];
      if (tag == "model") this.modelOptionsList = [];
    },
    listEvent() {
      this.app.$on("load-bang-ding", this.loadModelVersionList);
    },
    offEvent() {
      this.app.$off("load-bang-ding", this.loadModelVersionList);
    }
  },
  created() {
    this.getTableHeight();
  },
  mounted() {
    this.loadModelOptions();
    this.loadVersionOptions();
    this.listEvent();
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
.upgrade-box {
  ::v-deep .el-input__icon {
    height: 32px !important;
  }
}
.bang-ding-top {
  display: flex;
  align-items: center;
  ::v-deep .el-button {
    margin-right: 5px !important;
  }
  span {
    margin-right: 5px;
  }
}
.bang-ding-content {
  // margin-top: 10px;
  height: 100%;
  // display: flex;
  // justify-content: space-around;
}
.model-bang-ding-version,
.version-bang-ding-model {
  // margin-top: 10px;
  // width: 45%;
  ::v-deep .el-button {
    // margin-top: 10px;
  }
  // padding: 20px;
  // box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  height: calc(100% - 20px);
  padding: 10px;
}
.multiselect__clear {
  position: absolute;
  right: 41px;
  height: 40px;
  width: 40px;
  display: block;
  cursor: pointer;
  z-index: 2;
}
.multiselect__clear::after,
.multiselect__clear::before {
  content: "";
  display: block;
  position: absolute;
  width: 3px;
  height: 16px;
  background: #aaa;
  top: 12px;
  right: 4px;
}
.multiselect__clear:before {
  transform: rotate(45deg);
}
.multiselect__clear:after {
  transform: rotate(-45deg);
}
.bingding-content {
  height: 100%;
}
</style>
