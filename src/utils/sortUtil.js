var arraySort = function(propertyName) {
  return function(o1, o2) {
    var v1 = o1[propertyName];
    var v2 = o2[propertyName];
    if (typeof v1 === "number" && typeof v2 === "string") {
      return -1;
    } else if (typeof v1 === "string" && typeof v2 === "number") {
      return 1;
    } else if (typeof v1 === "string" && typeof v2 === "string") {
      return compareString(v1, v2);
    } else {
      if (v1 > v2) {
        return 1;
      } else if (v1 < v2) {
        return -1;
      } else {
        return 0;
      }
    }
  };
};
function compareString(v1, v2) {
  /*
   * 比较字符串
   * 数字>英文>中文
   * 中文比较按照localeCompare
   * */
  if (/^[0-9]+/.test(v1) && /^[0-9]+/.test(v2)) {
    if (parseInt(v1) > parseInt(v2)) return 1;
    else if (parseInt(v1) < parseInt(v2)) return -1;
    else return 0;
  }
  var length = v1.length <= v2.length ? v1.length : v2.length;
  var i = 0,
    s1,
    s2;
  for (; i < length; i++) {
    s1 = v1.charAt(i);
    s2 = v2.charAt(i);
    if (/[0-9a-zA-Z]/.test(s1) && /[0-9a-zA-Z]/.test(s2)) {
      //都是数字和字母
      if (s1 > s2) return 1;
      else if (s1 < s2) return -1;
      else continue;
    } else if (!/[0-9a-zA-Z]/.test(s1) && !/[0-9a-zA-Z]/.test(s2)) {
      //都是中文
      //if(s1.localeCompare(s2) === 0) continue;
      //else return s1.localeCompare(s2);
      var py1 = ConvertPinyin(s1),
        py2 = ConvertPinyin(s2);
      if (py1 > py2) {
        return 1;
      } else if (py1 < py2) {
        return -1;
      } else {
        return 0;
      }
    } else if (!/[0-9a-zA-Z]/.test(s1) && /[0-9a-zA-Z]/.test(s2)) {
      return 1;
    } else {
      return -1;
    }
  }
  if (i === length) {
    if (v1.length === v2.length) return 0;
    else if (v1.length <= v2.length) return -1;
    else return 1;
  }
}
var PinYin = {
  a: "\u554a\u963f\u9515",
  ai: "\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d",

  fou: "\u7f36",
  bia: "\u9adf",
};
//汉字转拼音
function ConvertPinyin(l1) {
  var l2 = l1.length;
  var I1 = "";
  var reg = new RegExp("[a-zA-Z0-9- ]");
  for (var i = 0; i < l2; i++) {
    // var val = l1.substr(i, 1);
    var val = l1.substring(i, 1);
    var name = arraySearch(val, PinYin);
    if (reg.test(val)) {
      I1 += val;
    } else if (name !== false) {
      I1 += name;
    }
  }
  I1 = I1.replace(/ /g, "-");
  while (I1.indexOf("--") > 0) {
    I1 = I1.replace("--", "-");
  }
  return I1;
}
//在对象中搜索
function arraySearch(l1, l2) {
  for (var name in PinYin) {
    if (PinYin[name].indexOf(l1) != -1) {
      //return ucfirst(name); break;
      return name;
    }
  }
  return false;
}
//首字母大写
function ucfirst(l1) {
  if (l1.length > 0) {
    // var first = l1.substr(0, 1).toUpperCase();
    var first = l1.substring(0, 1).toUpperCase();
    var spare = l1.substring(1, l1.length);
    return first + spare;
    //return first;
  }
}
export default arraySort;
