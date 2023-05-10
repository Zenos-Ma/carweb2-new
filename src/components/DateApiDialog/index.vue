<template>
  <dialog-comp
    :visible.sync="isShow"
    :dialog-title="$t('apiInfo.apiSet')"
    :dialog-width="500"
  >
    <div class="api-content-container">
      <div class="tab-top">
        <!-- <div class="title"></div> -->
        <div class="link">
          <!-- <router-link :to="{ name: 'Insurance', params: { id: 1 } }">接口文档</router-link> -->
          <a @click="jumpToApi" v-if="isTime">{{ $t("apiInfo.text") }}</a>
          <span class="no-use-tip" v-if="!isTime">{{
            $t("apiInfo.text")
          }}</span>
          <span v-if="!isTime" class="is-use-tip">
            ({{ $t("apiInfo.useTip") }})
          </span>
        </div>
      </div>
      <el-form label-width="100px">
        <el-form-item :label="$t('apiInfo.useId')">
          <el-col :span="18">
            <span style="line-height: 40px;">{{ apiInfo.userName }}</span>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('apiInfo.keywords')">
          <el-col :span="18">
            <span style="line-height: 40px;">{{ apiInfo.secretKey }}</span>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="$t('apiInfo.apiAddress')"
          prop="ParameterDataList"
        >
          <el-col :span="18">
            <el-input
              size="small"
              v-model="postForm.ParameterDataList[0]"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="info"
              icon="el-icon-plus"
              @click="addItem"
              :disabled="isbtnSOS"
              style="margin-left: 5px !important;padding: 8px 12px !important;vertical-align: middle;"
            ></el-button>
          </el-col>
        </el-form-item>
        <div v-for="(item, index) in postForm.ParameterDataList" :key="index">
          <el-form-item v-if="index !== 0" :label="$t('apiInfo.apiAddress')">
            <el-col :span="18">
              <el-input
                size="small"
                v-model="postForm.ParameterDataList[index]"
                placeholder="请填写"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button
                size="small"
                type="info"
                icon="el-icon-delete"
                @click="deleteItem(item, index)"
                style="margin-left: 5px !important;padding: 8px 12px !important"
              ></el-button>
            </el-col>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button size="small" type="primary" @click="saveApiInfo">{{
            $t("common.save")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </dialog-comp>
</template>

<script>
import { getApiInfo } from "@/api/common.js";
export default {
  name: "DateApiDialog",
  data: () => ({
    isShow: false,
    postForm: {
      ParameterDataList: [""]
    },
    isbtnSOS: false,
    apiInfo: {},
    apiAddress: "",
    currentTime: new Date().getTime()
  }),
  computed: {
    isTime() {
      return this.currentTime - this.apiInfo.createTime >= 60 * 60 * 1000
        ? true
        : false;
    }
  },
  methods: {
    addItem() {
      this.isbtnSOS = false;
      this.postForm.ParameterDataList.push("");
      if (this.postForm.ParameterDataList.length > 2) {
        this.isbtnSOS = true;
      } else {
        this.isbtnSOS = false;
      }
    },
    deleteItem(item, index) {
      this.postForm.ParameterDataList.splice(index, 1);
      this.isbtnSOS = false;
    },
    showDialog() {
      this.isShow = true;
      this.postForm.ParameterDataList = [""];
      this.isbtnSOS = false;
      this.getApiInfomation();
    },
    jumpToApi() {
      // this.$router.push({ path: "/apiDoc" });
      window.open(
        window.location.origin + window.location.pathname + "#/apiDoc"
      );
      this.isShow = false;
    },
    getApiInfomation() {
      // 获取ip地址、
      getApiInfo().then(res => {
        if (res.data.ips) {
          this.postForm.ParameterDataList = res.data.ips;
          if (this.postForm.ParameterDataList.length > 2) {
            this.isbtnSOS = true;
          }
        }
        this.apiInfo = res.data;
      });
    },
    saveApiInfo() {
      // 保存更行ip地址
      const data = {
        ips: this.postForm.ParameterDataList.join(",")
        // ip1: this.postForm.ParameterDataList[0],
        // ip2: this.postForm.ParameterDataList[1],
        // ip3: this.postForm.ParameterDataList[2],
      };
      console.log(data);
      this.post(this.API.updateApiInfo, data, res => {
        if (res.errCode == 200) {
          this.getApiInfomation();
          this.app.$emit("show-alert-msg", this.$t("apiInfo.updateSuccessTip"));
        } else {
          this.app.$emit("show-alert-msg", this.$t("apiInfo.updateFailTip"));
        }
      });
    },
    listenEvent() {
      this.app.$on("show-api-dialog", this.showDialog);
    },
    offEvent() {
      this.app.$off("show-api-dialog", this.showDialog);
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
.is-use-tip {
  padding-left: 10px;
  color: red;
}
.api-content-container {
  ::v-deep .el-form-item {
    margin-bottom: 10px;
  }
  ::v-deep .el-form-item__content {
    line-height: 32px;
    position: relative;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
}
.tab-top {
  display: flex;
  color: #606266;
  margin-left: 100px;
  margin-bottom: 10px;
  .link {
    // margin-left: 20px;
    cursor: pointer;
  }
}
</style>
