<template>
  <section class="body-content layout-container account-setting-content">
    <div class="account-setting">
      <div class="updateImg form-card">
        <div class="card-header">{{ $t("common.imgsetting") }}</div>
        <div class="qiyelogo-update">
          <h3>{{ $t("common.updateLogo") }}</h3>
          <div class="img-look-upload">
            <img alt="logo" :src="imageUrl" @error="handleLoadError" />
            <el-button class="btn-show" @click="showCropper">
              <!-- {{ $t("common.caijian") }} -->
              <i class="el-icon-upload el-icon-arrow-right"></i>
            </el-button>
          </div>

          <!-- 上传logo -->
          <vue-cropper></vue-cropper>
          <!-- end -->
        </div>
        <!--  -->
        <div class="icon-file1">
          <h3>{{ $t("common.updateIcon") }}</h3>
          <div class="img-look-upload">
            <img alt="logo" :src="imageUrl1" @error="handleLoadError" />
            <el-button class="btn-show" @click="showCropper1">
              <!-- {{ $t("common.caijian") }} -->
              <i class="el-icon-upload el-icon-arrow-right"></i>
            </el-button>
          </div>
        </div>
      </div>
      <!--我的服务商 start-->
      <div class="form-card12">
        <div class="card-header">{{ $t("accountMain.myServiceProvider") }}</div>
        <div class="card-body" style="margin-top: 5px">
          <table class="form-table" style="flex: 1; height: auto">
            <tr>
              <td>{{ $t("accountMain.provider") }}:</td>
              <td>{{ superUser.userName }}</td>
            </tr>
            <tr>
              <td>{{ $t("common.linkman") }}:</td>
              <td>{{ superUser.linkman }}</td>
            </tr>
            <tr>
              <td>{{ $t("common.phone") }}:</td>
              <td>{{ superUser.tel }}</td>
            </tr>
            <tr>
              <td>{{ $t("common.address") }}:</td>
              <td>{{ superUser.addr }}</td>
            </tr>
          </table>
        </div>
      </div>
      <!--我的服务商 end-->
    </div>
  </section>
</template>

<script>
import VueCropper from "@/components/vueCropper/VueCropper";
import { loadAccountMain, loadQiyeIcon, loadQiyeLogo } from "@/api/account.js";
export default {
  name: "AccountSetting",
  props: {},
  components: {
    "vue-cropper": VueCropper
    // "vue-cropper1": VueCropper1,
  },
  data: () => ({
    rootUser: JSON.parse(window.localStorage.getItem("carweb_user")),
    userId: [], //用户树勾选的用户
    previews: {},
    imgFile: "",
    imageUrl: null,
    imageUrl1: null,
    superUser: {
      //服务商
      userName: "",
      linkman: "",
      tel: "",
      addr: ""
    },
    localFile: null
  }),
  methods: {
    showCropper() {
      this.app.$emit("handle-change-image", {
        name: "logo"
      });
    },
    showCropper1() {
      this.app.$emit("handle-change-image", {
        name: "icon"
      });
    },
    handleLoadError(e) {
      const img = e.srcElement;
      this.imageUrl = this.errorLoadImg; //  用加载失败的图片替代之
      img.onerror = null; //  清除错误:如果错误时加载时显示的图片出错，将会一直循环，所以我们必须清除掉错误，限制运行一次
    },

    loadIcon() {
      loadQiyeIcon({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == 200) {
          this.imageUrl1 = this.API.staticResource + res.data.icon;
        }
      });
    },
    loadLogo() {
      loadQiyeLogo({ userId: this.rootUser.userId }).then(res => {
        if (res.errCode == 200) {
          this.imageUrl = this.API.staticResource + res.data.logo;
          let logo = this.API.staticResource + res.data.logo;
          window.localStorage.setItem("carweb_logo", logo);
        }
      });
    },

    loadAccountMain() {
      //获取当前用户相关账号信息
      loadAccountMain().then(res => {
        if (res.errCode == "200") {
          this.superUser = res.data.superUser;
        }
      });
    },
    listenEvent() {
      this.app.$on("load-account-logo", this.loadLogo);
      this.app.$on("load-account-icon", this.loadIcon);
    },
    offEvent() {
      this.app.$on("load-account-logo", this.loadLogo);
      this.app.$on("load-account-icon", this.loadIcon);
    }
  },
  mounted() {
    this.loadIcon();
    this.loadLogo();
    this.listenEvent();
    setTimeout(() => {
      this.loadAccountMain();
    }, 10);
  },
  beforeDestroy() {
    this.offEvent();
  }
};
</script>

<style lang="scss" scoped>
.account-setting-content {
  // width: unset;
  // box-shadow: unset;
  // height: calc(100% - 2px);
  // border-top: 1px solid #ccc;
  overflow: scroll;
  background: unset !important;
  .btn-show {
    width: 150px;
    margin-left: 10px;
    display: inline-block;
  }
  .updateImg {
    background-color: #fff;
    border-radius: 10px;
    padding: 16px;
  }
  .account-setting {
    width: 600px;
  }
  .el-icon-upload {
    font-size: 80px;
    // padding-left: 5px;
  }
}
.img-look-upload {
  display: flex;
  img {
    display: inline-block;
    height: 150px;
    margin-right: 10px;
    max-width: 410px;
    background: lightgray;
    min-width: 150px;
  }
}
.btn-click-upload {
  font-size: 80px;
  color: #666;
  // padding-top: 20px;
}
.upload-demo {
  margin-left: 5px;
  background-color: #f9f9f9;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 250px;
  height: 150px;
  text-align: center;
  position: relative;
  overflow: hidden;
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
@media screen and (max-height: 768px) {
  .form-card12 {
    margin-top: 5px;
  }
  .upload-demo {
    width: 220px;
    height: 120px;
  }
  .img-look-upload {
    img {
      display: inline-block;
      height: 120px;
    }
  }
}
</style>
