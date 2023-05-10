import FileUpload from "@/components/FileUpload";
import ExportUtil from "@/utils/exportUtil.js";
import {
  doInPolicy,
  doBatchUpdateSimInfo,
  doBatchUpdateSimNewInfo,
  doUpdateDeviceSim,
  doBatchAddDevice,
  doBatchModifyDevice,
  doBatchSimInfo
} from "@/api/system.js";
export default {
  name: "SystemDevice",
  components: {
    "file-upload": FileUpload
  },
  data: () => ({
    isFile1: false, //是否添加导入新设备文档
    isFile2: false, //是否添加导入修改设备文档
    file2: "",
    isFile3: false, //是否添加导入sim文档,
    isFile4: false, //是否添加导入sim（更新）
    isFile5: false, //是否添加导入保单
    isFile6: false, //是否添加导入用户和流量到期时间
    isFile7: false, //是否更新SIM流量到期
    provider: "S002GM" //sim服务商
  }),
  methods: {
    resetFormDate(tag) {
      // 重置表格中的数据
      switch (tag) {
        case "isFile1":
          this.isFile1 = false;
          this.app.$emit("reset-file-upload");
          break;
        case "isFile3":
          this.isFile3 = false;
          this.app.$emit("reset-file-upload");
          break;
        case "isFile4":
          this.isFile4 = false;
          this.app.$emit("reset-file-upload");
          break;
        case "isFile5":
          this.isFile5 = false;
          this.app.$emit("reset-file-upload");
          break;
        case "isFile6":
          this.isFile6 = false;
          this.app.$emit("reset-file-upload");
          break;
        case "isFile7":
          this.isFile7 = false;
          this.app.$emit("reset-file-upload");
          break;
      }
    },
    resetUpdateDevice() {
      // 重置更新设备的表格数据
      this.isFile2 = false;
      this.file2 = "";
      this.$refs.batch_modify_upload.value = null;
    },
    onUploadFileAdd() {
      this.isFile1 = true;
    },
    onUploadFileUpdate() {
      this.isFile2 = true;
    },
    onUploadFileSim() {
      this.isFile3 = true;
    },
    onUploadFileSimUpdate() {
      this.isFile4 = true;
    },
    onUploadFileDevSim() {
      this.isFile6 = true;
    },
    onUploadFilePolicy() {
      this.isFile5 = true;
    },
    onUploadFileUpdateSimNew() {
      this.isFile7 = true;
    },
    doPolicy() {
      //导入保单
      var that = this;
      var formData = new window.FormData(this.$refs.import_policy);
      console.log(formData);
      if (this.isFile5) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doInPolicy(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.policySuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.policyFail") + ":" + res.errMsg
            );
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.policyTip1"));
      }
      return false;
    },
    doBatchUpdateSim() {
      //批量更新sim流量到期时间

      var that = this;
      var formData = new window.FormData(this.$refs.batch_update_sim);
      if (this.isFile4) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doBatchUpdateSimInfo(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateSimSuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateSimFail") + ":" + res.errMsg
            );
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.updateSimTip"));
      }
      return false;
    },
    // 2021-12-15
    doBatchUpdateSimNew() {
      //批量更新sim流量到期时间
      var that = this;
      var formData = new window.FormData(this.$refs.update_sim_new);
      if (this.isFile7) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doBatchUpdateSimNewInfo(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateSimSuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateSimFail") + ":" + res.errMsg
            );
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.updateSimTip"));
      }
      return false;
    },
    doUpdateDevSim() {
      var that = this;
      var formData = new window.FormData(this.$refs.update_dev_sim);
      if (this.isFile6) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doUpdateDeviceSim(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateDevSimSuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.updateDevSimFail") + ":" + res.errMsg
            );
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.updateSimTip"));
      }
      return false;
    },
    doBatchAdd() {
      //批量导入设备

      var that = this;
      var formData = new window.FormData(this.$refs.batch_add);
      if (this.isFile1) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doBatchAddDevice(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.importSuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.importFail") + ":" + res.errMsg
            );
            if (/[0-9]{15,16}/.test(res.errMsg)) {
              var m = res.errMsg.match(/[0-9]{15,16}/g);
              var list = [];
              for (var i = 0; i < m.length; i++) {
                list.push([m[i]]);
              }
              ExportUtil.exportTable(["deviceImei"], list, "重复导入的设备");
            }
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.addTip"));
      }
      return false;
    },
    doBatchModify() {
      //批量更新设备信息

      var that = this;
      var formData = new window.FormData(this.$refs.batch_modify);
      if (this.isFile2) {
        document.getElementById("loading_page").style.display = "flex";
        //
        doBatchModifyDevice(formData).then(res => {
          if (res.errCode == "200") {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.modifySuccess")
            );
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.modifyFail") + ":" + res.errMsg
            );
          }
          document.getElementById("loading_page").style.display = "none";
        });
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.modifyTip"));
      }
      return false;
    },
    doBatchSim() {
      //批量导入sim卡

      var that = this;
      // var provider = this.provider == "S002GM" ? this.$t("systemDevice.gpsoo") : this.$t("systemDevice.swd");
      var provider = "";
      switch (this.provider) {
        case "S002GM":
          provider = this.$t("systemDevice.gpsoo");
          break;
        case "S001SW":
          provider = this.$t("systemDevice.swd");
          break;
        case "S003ST":
          provider = this.$t("systemDevice.shangtong");
          break;
        case "S004YD":
          provider = this.$t("systemDevice.cnyd");
          break;
        case "S005LT":
          provider = this.$t("systemDevice.cnlt");
          break;
        case "S006XY":
          provider = this.$t("systemDevice.xuyu");
          break;
      }

      if (this.isFile3) {
        this.app.$emit(
          "show-confirm-msg",
          this.$t("systemDevice.simTip") + "【" + provider + "】",
          function() {
            document.getElementById("loading_page").style.display = "flex";
            var formData = new window.FormData(that.$refs.batch_sim);
            //
            doBatchSimInfo(formData).then(res => {
              if (res.errCode == "200") {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("systemDevice.importSimSuccess")
                );
              } else {
                that.app.$emit(
                  "show-alert-msg",
                  that.$t("systemDevice.importSimFail") + ":" + res.errMsg
                );
              }
              document.getElementById("loading_page").style.display = "none";
            });
          }
        );
      } else {
        that.app.$emit("show-alert-msg", that.$t("systemDevice.simTip1"));
      }
      return false;
    }
  },
  mounted() {
    var that = this;
    //上传文件

    document.getElementById("batch_modify_upload").onchange = function() {
      var val = this.value;
      var file = val.substring(val.lastIndexOf("\\") + 1, val.length);
      if (file) {
        that.isFile2 = true;
        that.file2 = file;
      } else {
        that.isFile2 = false;
      }
    };
  }
};
