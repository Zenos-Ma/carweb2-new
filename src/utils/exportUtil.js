import { saveAs } from "file-saver-fixed";
// import html2canvas from "html2canvas";
// import xlsx from "node-xlsx";
// import html2pdf from "simple-html2pdf";
// import XLSX from "xlsx";
//解析excel 上传的文件解析成json格式数据
function parseExcel(file, callback) {
  var f = file;
  var reader = new window.FileReader();
  reader.onload = function() {
    var workbook = XLSX.read(this.result, {
      type: "buffer"
    });
    for (var sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        callback(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
        break;
      }
    }
  };
  reader.readAsArrayBuffer(f);
}
//转换为utf8数据流
function convertBase64UrlToBlob(base64) {
  // console.log(base64);
  var parts = base64.split(";base64,");
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new window.Uint8Array(rawLength);
  for (var i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new window.Blob([uInt8Array], {
    type: contentType
  });
}
/***
 * obj为要导出内容Element
 */
//function dealImageCanvas(canvas){
//  var context = canvas.getContext('2d');
//  var c_width =obj.offsetWidth;//如果box设置了padding，需要获取outerWidth和outerHeight来赋给canvas；
//  var c_height =obj.offsetHeight;
//var devicePixelRatio = window.devicePixelRatio || 2;
//var backingStoreRatio = context.webkitBackingStorePixelRatio ||
//      context.mozBackingStorePixelRatio ||
//      context.msBackingStorePixelRatio ||
//      context.oBackingStorePixelRatio ||
//      context.backingStorePixelRatio || 1;
//      var ratio = devicePixelRatio/backingStoreRatio;
//      context.translate();
//}
function exportImage(obj, option) {
  document.getElementById("loading_page").style.display = "flex";
  var op = {
    allowTaint: true, //允许加载跨域的图片
    tainttest: false, //检测每张图片都已经加载完成
    useCORS: true,
    width: obj.offsetWidth,
    height: obj.offsetHeight
    //windowWidth:obj.scrollWidth,//windowHeight:obj.scrollHeight
  };
  if (option) {
    for (var key in option) {
      op[key] = option[key];
    }
  }
  if (op.canvas) {
    op.canvas.width = obj.offsetWidth * 4;
    op.canvas.height = obj.offsetHeight * 4;
    op.canvas.style.width = obj.offsetWidth + "px";
    op.canvas.style.height = obj.offsetHeight + "px";
    op.canvas.getContext("2d").scale(4, 4);
  }
  // html2canvas(obj, op).then(function(canvas) {
  //   var image = null;
  //   if (op.canvas) {
  //     image = op.canvas.toDataURL("image/jpeg");
  //   } else {
  //     image = canvas.toDataURL("image/jpeg");
  //   }
  //   var blob = convertBase64UrlToBlob(image);
  //   saveAs(blob, new Date().getTime() + ".jpg");
  //   document.getElementById("loading_page").style.display = "none";
  // });
}
/***
 * 导出表格xls
 * title格式=>[1,2,3,3,4452354,3434,'hello',true]
 * ,tableList格式=>[[11,33,4,54,54545,66],* [11,33,4,54,54545,66],* [11,33,4,54,54545,66],* [11,33,4,54,54545,66]]
 *  */
function exportTable1(title, tableList) {
  var data = tableList;
  data.unshift(title);
  var buffer = xlsx.build([
    {
      name: "mySheetName",
      data: data
    }
  ]); //Returns a buffer
  var blob = new window.Blob([buffer], {
    type: "application/vnd.ms-excel,charset=UTF-8"
  });
  saveAs(blob, new Date().format("yyyyMMddhhmmss") + ".xls");
}
//生成表格数据

function exportTable(title, list, fileName) {
  var t = "",
    content = "";
  for (let i = 0; i < title.length; i++) {
    t += `<th>${title[i]}</th>`;
  }
  for (let i = 0; i < list.length; i++) {
    var item = list[i],
      listItem = "";
    for (let j = 0; j < item.length; j++) {
      let val = item[j];
      listItem += `<td>  ${
        val === null ||
        val === undefined ||
        val === "undefined" ||
        val === "null"
          ? "--"
          : val
      }</td>`;
    }
    content += `<tr>${listItem}</tr>`;
  }
  if (list.length > 0) {
    var buffer = `<table border="1" style="vnd.ms-excel.numberformat:@" ><tr>${t}</tr>${content}</table>`;
    var blob = new window.Blob([buffer], {
      type: "application/vnd.ms-excel,charset=utf-8"
    });
    saveAs(
      blob,
      fileName
        ? fileName + ".xls"
        : new Date().format("yyyyMMddhhmmss") + ".xls"
    );
  } else {
    alert("no data");
  }
}

function exportFile(file, ex, type) {
  var blob = new window.Blob([file], {
    type: type + ",charset=UTF-8"
  });
  saveAs(blob, new Date().format("yyyyMMddhhmmss") + "." + ex);
}

function exportPdf(obj, filename) {
  html2pdf(
    obj,
    {
      filename: filename ? filename + ".pdf" : new Date().getTime() + ".pdf", //default 'file.pdf'
      margin: 40, //default 40, page margin
      save: true, //default true: Save as file
      output: "", //default '', jsPDF output type
      smart: true //default true: Smartly adjust content width
    },
    output => {
      console.log("导出成功", output);
    }
  );
}

function intToChinese1(str) {
  // 阿拉伯数字改成大写的中文
  str = str + "";
  var len = str.length - 1;
  var idxs = [
    "",
    "拾",
    "佰",
    "仟",
    "万",
    "拾",
    "佰",
    "仟",
    "亿",
    "拾",
    "佰",
    "仟",
    "万",
    "拾",
    "佰",
    "仟",
    "亿"
  ];
  var num = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  return str.replace(/([1-9]|0+)/g, function($, $1, idx, full) {
    var pos = 0;
    if ($1[0] != "0") {
      pos = len - idx;
      if (idx == 0 && $1[0] == 1 && idxs[len - idx] == "十") {
        return idxs[len - idx];
      }
      return num[$1[0]] + idxs[len - idx];
    } else {
      var left = len - idx;
      var right = len - idx + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - (left % 4);
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return "";
      } else {
        return num[$1[0]];
      }
    }
  });
}

function intToChinese(n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  var unit = "仟佰拾亿仟佰拾万仟佰拾元角分",
    str = "";
  n += "00";
  var p = n.indexOf(".");
  if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  // if (p >= 0) n = n.substring(0, p) + n.substring(p + 1, 2);
  // unit = unit.substring(unit.length - n.length);
  for (var i = 0; i < n.length; i++)
    str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
  if (n == 0) {
    return (n = "零");
  }
  return str
    .replace(/零(仟|佰|拾|角)/g, "零")
    .replace(/(零)+/g, "零")
    .replace(/零(万|亿|元)/g, "$1")
    .replace(/(亿)万|壹(拾)/g, "$1$2")
    .replace(/^元零?|零分/g, "")
    .replace(/元$/g, "");
}
export default {
  exportImage,
  exportTable,
  exportTable1,
  exportFile,
  parseExcel,
  exportPdf,
  intToChinese,
  convertBase64UrlToBlob
};
