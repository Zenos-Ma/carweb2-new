<template>
  <div class="file-input">
    <input type="file" ref="file_upload" :accept="accept" name="file" />
    <div class="file-btn" v-show="!isFile" style="text-align:center">
      {{ $t("common.chooseFile") }}
    </div>
    <div class="file-btn" v-show="isFile">
      {{ $t("common.selectedFile") }}:{{ uploadFile }}
    </div>
  </div>
</template>
<script>
export default {
  name: "FileUpload",
  props: {
    accept: {
      type: String,
      default: "*"
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isFile: false,
    uploadFile: ""
  }),
  methods: {
    resetList() {
      this.isFile = false;
      this.uploadFile = "";
      this.changeValue();
    },
    changeValue() {
      this.$refs.file_upload.value = null;
    },
    listEvent() {
      this.app.$on("reset-file-upload", this.resetList);
    },
    offEvent() {
      this.app.$off("reset-file-upload", this.resetList);
    }
  },
  mounted() {
    var that = this;
    this.$refs.file_upload.onchange = function() {
      var val = this.value;
      var file = val.substring(val.lastIndexOf("\\") + 1, val.length);
      if (file) {
        that.isFile = true;
        that.uploadFile = file;
        if (that.isCheck) {
          if (this.files[0].size > 1024 * 1024) {
            that.app.$emit(
              "show-alert-msg",
              that.$t("systemDevice.fileOverSize")
            );
          } else {
            that.$emit("select-file", this.files);
          }
        } else {
          that.$emit("select-file", this.files);
        }
      } else {
        that.isFile = false;
      }
    };
    this.files = "";
    this.uploadFile = "";
    this.listEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>
