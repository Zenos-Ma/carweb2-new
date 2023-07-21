// "use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
// 开启gzip压缩，按需引用
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 开启gzip压缩，按需写入
const productionGzipExtensions = /\.(js|css|json|txt|html|icon|svg)(\?>*)?$/i;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = defaultSettings.title || "domilink"; // page title
const port = process.env.port || process.env.npm_config_port || 8383; // dev port
console.log(process.env.VUE_APP_BASE_API);

module.exports = {
  transpileDependencies: process.env.NODE_ENV === "development" ? ["*"] : [],
  // transpileDependencies: process.env.NODE_ENV === "production" ? ["*"] : [],

  /**
   */
  // publicPath: process.env.NODE_ENV === "production" ? "/carweb/v3/" : "./",
  publicPath: "./",
  outputDir: "dist",
  assetsDir: "static",
  // lintOnSave: process.env.NODE_ENV === "development",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: !1,
    overlay: {
      warnings: false,
      errors: true
    },

    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      // [process.env.VUE_APP_BASE_API]: {
      //   // target: `http://127.0.0.1:${port}/mock`,
      //   target: "http://test.basegps.com/",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ['^' + process.env.VUE_APP_BASE_API]: ''
      //   }
      // }
      "/": {
        ws: false,
        // target: "http://test.basegps.com/",
        target: process.env.VUE_APP_BASE_API,
        // target: "http://test.basegps.com",
        // target: "http://task.domilink.cn:8088",
        // target: "http://192.168.1.238:8080",
        // target: "http://web1-server",
        // target: "https://www.domilink.com/",
        // target: "http://192.168.1.188:8080/", //本地测试锅波
        changeOrigin: true,
        pathRewrite: { "^/": "" }
      }
    }
    // after: require("./mock/mock-server.js")
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    externals: {
      jquery: "jQuery",
      // echarts: "echarts",
      xlsx: "XLSX",
      "simple-html2pdf": "html2pdf",
      moment: "moment",
      BMap: "BMap",
      AMap: "AMap"
    },
    name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack(config) {
    config.entry("main").add("babel-polyfill");
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    //
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    config.module.rule("vue").uses.store.delete("cache-loader");
    config.module.rule("js").uses.store.delete("cache-loader");
    // 修复热更新失效
    config.resolve.symlinks(true);
    if (process.env.use_analyzer) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          base: {
            name: "base",
            minChunks: 1,
            test: /[\\/]node_modules[\\/]vue[\\/]|[\\/]node_modules[\\/]vue-router[\\/]|[\\/]node_modules[\\/]vuex[\\/]|[\\/]node_modules[\\/]axios[\\/][\\/]node_modules[\\/]echarts[\\/]/,
            chunks: "initial",
            priority: -3
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          elementJs: {
            name: "chunk-elementJS",
            test: /[\\/]node_modules[\\/]element-ui[\\/]lib[\\/]/,
            priority: 20,
            minChunks: 1
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  },
  css: {
    // 使用dart-sass时需要打开
    loaderOptions: {
      sass: {
        implementation: require("sass") // This line must in sass option
      }
    },
    // 是否生成map文件
    sourceMap: false
  }
};
