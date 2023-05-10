<template>
  <div class="model-bg" v-show="isShow">
    <div
      ref="model_card"
      :class="['model-card', isOpen ? 'open' : '']"
      :style="{
        height: isOpen ? '100%' : h ? h : dialogHeight ? dialogHeight + dialogUnit : 'auto',
        width: isOpen ? '100%' : w ? w : dialogWidth ? dialogWidth + dialogUnit : 'auto',
        top: isOpen ? '0px' : top ? 'calc(50% - ' + top + 'px)' : '10%',
        left: isOpen ? '0px' : left ? 'calc(50% - ' + left + 'px)' : '10%',
      }"
    >
      <div class="model-header">
        <div class="model-title">
          <span class="model-icon iconfont icon-warn"></span>
          <span class="model-title-text">{{ dialogTitle }}</span>
        </div>
        <div class="model-right">
          <span class="model-icon iconfont icon-minus" @click="isHide = isHide ? false : true" v-show="isOpen == false"></span>
          <span :class="['model-icon', 'iconfont', isOpen ? 'icon-windows' : 'icon-window']" @click="isOpen = isOpen ? false : true"></span>
          <span class="model-icon iconfont icon-close1" @click="closeDialog" v-show="isClose"></span>
        </div>
      </div>
      <div class="model-body" v-show="!isHide">
        <slot />
      </div>
      <!--model-body-->
    </div>
  </div>
</template>

<script>
export default {
  name: "DialogComp",
  props: {
    dialogTitle: {
      type: String,
      default: "",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: Number,
      default: 0,
    },
    dialogHeight: {
      type: Number,
      default: 0,
    },
    dialogUnit: {
      type: String,
      default: "px",
    },
    isClose: {
      type: Boolean,
      default: true,
    },
    closeAction: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isHide: false,
    isOpen: false,
    top: 0,
    left: 0,
    h: "",
    w: "",
  }),
  watch: {
    isShow() {
      if (this.isShow) {
        this.isHide = false;
        this.isOpen = false;
        this.setCenter();
      }
    },
    isOpen() {
      //展开
      if (this.isOpen) {
        this.isHide = false;
      }
    },
  },
  methods: {
    closeDialog() {
      //关闭对话框
      if (this.isClose && this.closeAction) {
        this.$emit("close-dialog");
        if (this.$route.query.redirect) {
          window.location.hash = "#" + this.$route.query.redirect;
        } else {
          window.location.hash = "#/home/account";
        }
      } else {
        this.app.$emit("close-user-box");
        this.$emit("update:is-show", false);
        this.app.$emit("close-dialog");
        if (this.$route.query.redirect) {
          window.location.hash = "#" + this.$route.query.redirect;
        } else {
          window.location.hash = "#/home/account";
        }
      }
    },
    setCenter() {
      //居中
      var that = this;
      var card = that.$refs.model_card;
      this.$nextTick(function() {
        if (window.innerWidth < card.offsetWidth) {
          that.w = "100vw";
        }
        if (window.innerHeight < card.offsetHeight) {
          that.h = "100vh";
        }
        that.left = parseInt(card.offsetWidth / 2) > 0 ? parseInt(card.offsetWidth / 2) : 0;
        that.top = parseInt(card.offsetHeight / 2) > 0 ? parseInt(card.offsetHeight / 2) : 0;
        // console.log(that.left);
        // console.log(parseInt(card.offsetWidth / 2));
      });
    },
  },
  mounted() {
    this.setCenter();
    //对话框移动操作
    $(".model-bg .model-card .model-header .model-title").mousedown(function(ev) {
      var model = $(this)
        .parent()
        .parent();
      $("#moving_page").show();
      $("#moving_page").css("cursor", "move");
      var x = 0,
        y = 0,
        dx = ev.pageX - $(model).prop("offsetLeft"),
        dy = ev.pageY - $(model).prop("offsetTop");
      function m(e) {
        if ($("#moving_page").is(":visible")) {
          x = e.pageX;
          y = e.pageY;
          var xx = x - dx;
          if (xx <= 0) {
            xx = 0;
          } else if (xx + $(model).width() >= $("#moving_page").width()) {
            xx = $("#moving_page").width() - $(model).width();
          }
          var yy = y - dy;
          if (yy <= 0) {
            yy = 0;
          } else if (yy + $(model).height() >= $("#moving_page").height()) {
            yy = $("#moving_page").height() - $(model).height();
          }

          $(model).css("left", xx + "px");
          $(model).css("top", yy + "px");
        }
      }
      function mm() {
        if ($("#moving_page").is(":visible")) {
          $("#moving_page").hide();
          $("#moving_page").off({ mousemove: m });
        }
      }
      $("#moving_page").on({
        mousemove: m,
        mouseup: mm,
      });
    });
  },
};
</script>

<style></style>
