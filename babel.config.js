// const plugins = [];
// if (process.env.NODE_ENV === "production") {
//   plugins.push("transform-remove-console");
//   // plugins.push([
//   //   "component",
//   //   {
//   //     libraryName: "xlsx",
//   //     styleLibraryName: "css"
//   //   }
//   // ]);
// }

// module.exports = {
//   plugins: plugins,
//   presets: ["@vue/app", "@babel/preset-env"],
//   sourceType: "unambiguous"
// };


module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
        'es6.symbol',
        'es6.array.iterator',
        'es6.object.assign',
      ],
      useBuiltIns: 'entry',}],
    ],
}
