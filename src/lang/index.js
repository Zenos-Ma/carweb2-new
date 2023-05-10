import Vue from "vue";
import VueI18n from "vue-i18n";
import LangZh from "@/i18/i18_zh.js";
import LangEn from "@/i18/i18_en.js";
import LangTc from "@/i18/i18_zh_tc.js";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import twLocale from "element-ui/lib/locale/lang/zh-TW";
import ElementLocale from "element-ui/lib/locale";

Vue.use(VueI18n);

//设置当前语言 2021-7-30 为了全显示为英文
var langType = window.localStorage.getItem("langType")
  ? window.localStorage.getItem("langType")
  : (
      window.navigator.language || window.navigator.browserLanguage
    ).toLowerCase(); //直接获取浏览器的默认语言

if (langType.indexOf("zh") >= 0) {
  langType = "zh";
} else if (langType.indexOf("en") >= 0) {
  langType = "en";
} else if (langType.indexOf("tc") >= 0) {
  langType = "tc";
}
const i18n = new VueI18n({
  locale: langType,
  messages: {
    zh: {
      ...LangZh,
      ...zhLocale
    },
    en: {
      ...LangEn,
      ...enLocale
    },
    tc: {
      ...LangTc,
      ...twLocale
    }
  }
});
ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
