<template>
  <dialog-comp
    :visible.sync="dialogFormVisible"
    :dialog-title="$t('common.updateLogoIcon')"
    :dialog-width="630"
    :iconWindow="'icon-zhongzhi'"
  >
    <label class="btn" for="uploads">{{ $t("common.selectImg") }}</label>
    <span class="orange-box" style="font-size: 13px">{{
      $t("common.updateImgTip")
    }}</span>
    <input
      type="file"
      id="uploads"
      :value="imgFile"
      style="position: absolute; clip: rect(0 0 0 0)"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="uploadImg($event, 1)"
    />
    <div style="padding: 10px; display: flex">
      <div class="cut">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          :canScale="option.canScale"
          :fixed="option.fixed"
          :centerBox="option.centerBox"
          :high="option.high"
          :mode="option.mode"
          :enlarge="option.enlarge"
          :infoTrue="option.infoTrue"
          :fixedNumber="option.fixedNumber"
          @realTime="realTime"
          @imgLoad="imgLoad"
        ></vueCropper>
      </div>
      <div class="show-preview" :style="{ overflow: 'hidden', margin: '5px' }">
        <div :style="previews.div" class="preview" v-show="previews.div">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="closeCropper" size="small">{{
        $t("common.cancel")
      }}</el-button>
      <el-button type="primary" @click="finish('blob')" size="small">{{
        $t("common.save")
      }}</el-button>
    </div>
  </dialog-comp>
</template>

<script>
import { VueCropper } from "vue-cropper";
// 官网地址https://github.com/xyxiao001/vue-cropper
export default {
  components: {
    VueCropper
  },
  props: {
    imei: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      userId: JSON.parse(window.localStorage.getItem("carweb_user")).userId,
      previews: {},
      model: false,
      modelSrc: "",
      fileName: "",
      imgFile: "",
      dialogFormVisible: false,
      option: {
        img: "",
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false, //输出原图比例截图 props名full
        outputType: "png", //裁剪生成图片的格式
        canMove: true, //上传图片是否可以移动
        original: false, //上传图片按照原始比例渲染
        canMoveBox: true, //截图框是否可以拖动
        autoCrop: true, //是否默认生成截图框
        autoCropWidth: 200, //默认截图框宽度
        autoCropHeight: 200, //默认生成截图框高度
        fixedBox: true, //固定截图框大小
        fixedNumber: [1, 1], //截图框的宽高比例
        mode: "auto 200px", //图片默认渲染方式
        info: true, //裁剪框的大小信息
        canScale: false, //图片是否允许滚轮缩放
        fixed: false, //是否开启截图框宽高固定比例
        centerBox: true, //截图框是否被限制在图片里面
        high: true, //是否按照设备的dpr 输出等比例图片
        enlarge: 1,
        infoTrue: false
      },
      imgUrl2: "",
      imgtag: ""
    };
  },
  methods: {
    closeCropper() {
      this.dialogFormVisible = false;
      this.previews = {};
      this.option.img = "";
    },
    canvasBase64UrlToBlob(data) {
      var imageData = data;
      var b64 = imageData.replace("data:image/png;base64,", "");
      var binary = atob(b64);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: "image/png" });
    },
    compressImg(file) {
      var files;
      var fileSize = parseFloat(parseInt(file["size"]) / 1024 / 1024).toFixed(
        2
      );
      var read = new FileReader();
      read.readAsDataURL(file);
      return new Promise(function(resolve, reject) {
        read.onload = function(e) {
          var img = new Image();
          img.src = e.target.result;
          img.onload = function() {
            // 默认按比例压缩
            var w = this.width;
            var h = this.height;
            // 生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var base64;
            // 创建属性节点
            canvas.setAttribute("width", w);
            canvas.setAttribute("height", h);
            ctx.drawImage(this, 0, 0, w, h);
            if (fileSize < 1) {
              // 如果图片小于一兆 那么不执行压缩操作
              base64 = canvas.toDataURL(file["type"], 1);
            } else if (fileSize > 1 && fileSize < 2) {
              // 如果图片大于1M并且小于2M 那么压缩0.5
              base64 = canvas.toDataURL(file["type"], 0.2);
            } else {
              // 如果图片超过2m 那么压缩0.2
              base64 = canvas.toDataURL(file["type"], 0.1);
            }
            // 回调函数返回file的值（将base64编码转成file）
            resolve(base64);
          };
        };
      });
    },
    //上传图片（点击上传按钮）
    finish(type) {
      // console.log(type); getCropBlob
      let selft = this;
      let formData = new FormData();
      // 输出
      if (type === "blob") {
        selft.$refs.cropper.getCropBlob(data => {
          let img = data;
          selft.model = true;
          selft.modelSrc = img;
          formData.append("file", data, selft.fileName);
          formData.append("userId", selft.userId);
          if (selft.imgtag == "logo") {
            console.log("chaufa");
            selft.updateLogo(formData);
          } else if (selft.imgtag == "icon") {
            selft.updateIcon(formData);
          }
        });
      }
    },
    updateLogo(formData) {
      var that = this;
      // const url = "/carweb2/" + that.API.updateBusinessLogo;=
      $.ajax({
        url: that.API.updateBusinessLogo,
        type: "post",
        processData: false,
        contentType: false,
        data: formData,
        dataType: "json",
        success(res) {
          if (res.errCode == "200") {
            that.previews = {};
            that.option.img = "";
            that.app.$emit("load-account-logo");
            that.closeCropper();
            that.app.$emit("show-alert-msg", that.$t("common.updatelogoTip"));
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("common.updatelogoFailTip") + ":" + res.errMsg
            );
          }
        }
      });
    },
    updateIcon(formData) {
      var that = this;
      // const url = "/carweb2/" + that.API.renewBusinessIco;
      $.ajax({
        url: that.API.renewBusinessIco,
        type: "post",
        processData: false,
        contentType: false,
        data: formData,
        dataType: "json",
        success(res) {
          this.previews = {};
          if (res.errCode == "200") {
            that.app.$emit("load-account-logo");
            that.option.img = "";
            that.previews = {};
            that.closeCropper();
            that.app.$emit("show-alert-msg", that.$t("common.updateIconTip"));
          } else {
            that.app.$emit(
              "show-alert-msg",
              that.$t("common.updateIconFailTip") + ":" + res.errMsg
            );
          }
        }
      });
    },
    //选择本地图片
    uploadImg(e, num) {
      // console.log(e);
      var selft = this;
      //上传图片
      var file = e.target.files[0];
      selft.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        selft.$message.warning(selft.$t("common.updateTypeTip"));
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 2;
      if (!isLt5M) {
        this.$message.error(selft.$t("common.updateSizeTip"));
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        // console.log(e);
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        // console.log(data.width);
        let imgs = new Image();
        imgs.src = data;
        imgs.onload = function() {
          const { width, height } = imgs;
          // console.log(width, height);
          // console.log(typeof width);
          if (selft.imgtag == "icon" && width < height) {
            // console.log(width, height);
            // console.log("dada");
            selft.option.mode = "200px auto";
          } else if (selft.imgtag == "logo" && width < height) {
            // console.log("da11da");
            selft.option.mode = "280px auto";
          }
        };
        setTimeout(() => {
          if (num === 1) {
            selft.option.img = data;
          } else if (num === 2) {
            selft.example2.img = data;
          }
        }, 50);
      };
      selft.$forceUpdate();
      // 转化为base64
      reader.readAsDataURL(file);
      // 转化为blob
      // reader.readAsArrayBuffer(file);
    },
    show(op) {
      // console.log(op);
      this.dialogFormVisible = true;
      this.imgtag = op.name;
      this.previews = {};
      this.option.img = "";
      if (this.imgtag == "icon") {
        this.option.fixed = false;
        this.option.autoCropWidth = 200; //默认截图框宽度
        this.option.autoCropHeight = 200; //默认生成截图框高度
        this.option.mode = "auto 200px";
        this.option.fixedNumber = [1, 1];
        this.option.centerBox = true;
        this.option.canScale = false;
        this.option.canMoveBox = false;
      } else if (this.imgtag == "logo") {
        this.option.fixed = false;
        this.option.autoCropWidth = 280; //默认截图框宽度
        this.option.autoCropHeight = 100; //默认生成截图框高度
        this.option.mode = "auto 280px";
        this.option.fixedNumber = [2.8, 1];
        this.option.centerBox = false;
        this.option.canScale = true;
        this.option.canMoveBox = false;
        this.option.fixedBox = false;
      }
    },
    // 实时预览函数
    realTime(data) {
      // console.log(data);
      this.previews = data;
    },
    imgLoad(msg) {},
    listEvent() {
      this.app.$on("handle-change-image", this.show);
    },
    offEvent() {
      this.app.$off("handle-change-image", this.show);
    }
  },
  mounted() {
    // console.log("dadssssssssssssssssssss");
    this.listEvent();
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.cut {
  width: 300px;
  height: 300px;
  margin: 0px auto;
}

.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin-left: 10px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #50bfff;
  border-color: #50bfff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.show-preview {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  .preview {
    overflow: hidden;
    background: #cccccc;
    max-height: 300px;
    // max-width: 254px;
  }
}
</style>
