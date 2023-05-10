import "babel-polyfill";
// 上面这句放在页面最顶上
import Es6Promise from "es6-promise";
Es6Promise.polyfill();

import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
import i18n from "@/lang";

import API from "@/utils/api.js";
import "@/utils/dateUtil.js";

import waves from "@/components/waves/waves";

import "@/icons"; // icon
import "@/permission"; // permission control

// import { mockXHR } from "../mock";
// mockXHR();

import "@/utils/vueDirective";
import "@/utils/utils";
import "@/utils/getTheMapAddressByPoint";

//设置当前语言
var langType = window.localStorage.getItem("langType")
  ? window.localStorage.getItem("langType")
  : (
      window.navigator.language || window.navigator.browserLanguage
    ).toLowerCase(); //直接获取浏览器的默认语言

if (langType.indexOf("zh") >= 0) {
  langType = "zh";
} else if (langType.indexOf("en") >= 0) {
  langType = "en";
}
window.localStorage.setItem("langType", langType);

//设置rem
var docElmt = document.documentElement;
var rem = window.innerHeight / 100;
docElmt.style.fontSize = (rem > 10 ? rem : 10) + "px";

window.onresize = function() {
  var rem = window.innerHeight / 100;
  docElmt.style.fontSize = (rem > 10 ? rem : 10) + "px";
};

import DialogComp from "@/components/DialogComp";
import TableComp from "@/components/TableComp";
Vue.use({
  install: function() {
    Vue.component("dialog-comp", DialogComp); // 对话框组件
    Vue.component("data-table", TableComp); // 数据表格组件
  }
});

// eventBus的vue
var theApp = new Vue();
Vue.prototype.app = theApp;

Vue.prototype.API = API;

import "@/utils/element";

Vue.config.productionTip = false;

Vue.directive("waves", waves);

/**
 *扩展ie中不兼容的startsWith,endsWith方法
 */
if (typeof String.prototype.endsWith != "function") {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

new Vue({
  el: "#app",
  i18n,
  router,
  store,
  render: h => h(App)
});

// 解决在ie下，当url的hash change的时候浏览器没有做出反应
if (
  "-ms-scroll-limit" in document.documentElement.style &&
  "-ms-ime-align" in document.documentElement.style
) {
  window.addEventListener(
    "hashchange",
    function(event) {
      let currentPath = this.window.location.hash.slice(1);
      router.push(currentPath);
    },
    false
  );
}
