module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    window: true,
    BMap: true,
    BMAP_NORMAL_MAP: true,
    BMAP_SATELLITE_MAP: true,
    BMAP_ANCHOR_TOP_LEFT: true,
    BMAP_NAVIGATION_CONTROL_LARGE: true,
    BMapLib: true,
    $: true,
    Microsoft: true,
    AMap: true,
    BMAP_POINT_SHAPE_WATERDROP: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module"
  },
  plugins: ["vue"],
  rules: {
    indent: "off",
    semi: 0,
    quotes: "off",
    "no-console": "off",
    "no-alert": "error",
    "space-before-function-paren": 0,
    "comma-dangle": "off",
    "vue/comment-directive": "off",
    "no-unused-vars": "off", //重要 var 变量为引入
    "generator-star-spacing": "off",
    "no-tabs": "off",
    "no-unused-vars": "off",
    "no-irregular-whitespace": "off",
    "no-debugger": "off",
    "no-useless-escape": 0,
    "no-unexpected-multiline": "off",
    "no-constant-condition": "off",
    "vue/no-unused-components": "off",
    "vue/no-parsing-error": [
      "error",
      {
        "invalid-first-character-of-tag-name": false
      }
    ]
  }
};
