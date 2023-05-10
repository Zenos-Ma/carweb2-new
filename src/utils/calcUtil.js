export default {
  sortStr(a, b) {
    // var aa = new String(a);
    // var bb = new String(b);
    // console.log(aa);
    // console.log(bb);
    // console.log(aa.length);
    // console.log(bb.length);
    // if (aa.length > bb.length) {
    //   for (let i = 0; i < bb.length; i++) {
    //     let codeA = aa.charAt(i).charCodeAt();
    //     let codeB = bb.charAt(i).charCodeAt();
    //     if (codeA != codeB) {
    //       return codeA - codeB;
    //     }
    //   }
    // }else {
    //   for (let i = 0; i < aa.length; i++) {
    //     let codeA = aa.charAt(i).charCodeAt();
    //     let codeB = bb.charAt(i).charCodeAt();
    //     if (codeA != codeB) {
    //       return codeA - codeB;
    //     }
    //   }
    // }
    var aa = new String(a);
    var bb = new String(b);
    console.log(aa);
    console.log(bb);
    console.log(aa.length);
    console.log(bb.length);
    // if (aa.length > bb.length) {
    for (let i = 0; i < bb.length; i++) {
      let codeA = aa.charAt(i).charCodeAt();
      let codeB = bb.charAt(i).charCodeAt();
      if (codeA != codeB) {
        return codeA - codeB;
      }
    }
    // }
    // else {
    //   for (let i = 0; i < aa.length; i++) {
    //     let codeA = aa.charAt(i).charCodeAt();
    //     let codeB = bb.charAt(i).charCodeAt();
    //     if (codeA != codeB) {
    //       return codeA - codeB;
    //     }
    //   }
    // }
  },
  toLineBarData(arr) {
    var name = [],
      value = [];
    for (var i = 0; i < arr.length; i++) {
      name.push(arr[i].name);
      value.push(arr[i].value);
    }
    return {
      name: name,
      value: value,
    };
  },
  toScatterData(arr1, arr2) {
    var r = [];
    for (var i = 0; i < arr1.length; i++) {
      r.push([arr1[i], arr2[i]]);
    }
    return r;
  },
  toRadarData() {},
  objToArray(obj) {
    var arr = [];
    for (var key in obj) {
      if (key)
        arr.push({
          name: key,
          value: obj[key],
        });
    }
    return arr;
  }, //计数
  countNum(xs) {
    var obj = {};
    for (var i = 0; i < xs.length; i++) {
      obj[xs[i]] = obj[xs[i]] ? obj[xs[i]] + 1 : 1;
    }

    return this.objToArray(obj);
  }, //求和
  sumNum(xs, ys) {
    var obj = {};
    for (var i = 0; i < xs.length; i++) {
      var y = parseFloat(ys[i]);
      obj[xs[i]] = obj[xs[i]] ? y + obj[xs[i]] : y;
    }
    return this.objToArray(obj);
  }, //平均
  averageNum(xs, ys) {
    var obj = {};
    for (var i = 0; i < xs.length; i++) {
      var y = parseFloat(ys[i]);
      obj[xs[i]] = obj[xs[i]] ? y + obj[xs[i]] : y;
      obj[xs[i] + "__count"] = obj[xs[i] + "__count"] ? obj[xs[i] + "__count"] + 1 : 1;
    }
    var arr = [];
    for (var key in obj) {
      var k = key.substring(0, key.indexOf("__count"));
      if (key.indexOf("__count") >= 0 && k) {
        arr.push({
          name: k,
          value: obj[k] / obj[key],
        });
      }
    }
    return arr;
  }, //最大值
  maxNum(xs, ys) {
    var obj = {};
    for (var i = 0; i < xs.length; i++) {
      obj[xs[i]] = obj[xs[i]] ? (obj[xs[i]] > ys[i] ? obj[xs[i]] : ys[i]) : Number.NEGATIVE_INFINITY;
    }
    return this.objToArray(obj);
  }, //最小值
  minNum(xs, ys) {
    var obj = {};
    for (var i = 0; i < xs.length; i++) {
      obj[xs[i]] = obj[xs[i]] ? (obj[xs[i]] < ys[i] ? obj[xs[i]] : ys[i]) : Number.POSITIVE_INFINITY;
    }
    return this.objToArray(obj);
  },
  calcData(type, xs, ys) {
    switch (type) {
      case "sum":
        return this.sumNum(xs, ys);
      case "count":
        return this.countNum(xs);
      case "average":
        return this.averageNum(xs, ys);
      case "max":
        return this.maxNum(xs, ys);
      case "min":
        return this.minNum(xs, ys);
    }
  },
};
