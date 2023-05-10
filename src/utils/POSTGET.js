$.support.cors = true;

function POST(url, data, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(
        request.responseText.indexOf("{") == 0 || request.responseText.indexOf("[") == 0
          ? JSON.parse(request.responseText)
          : {
              errCode: -1,
            }
      );
    }
  };
  request.open("POST", url);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  var form = "";
  for (var key in data) {
    if (data[key] && typeof data[key] == "string") {
      var str = data[key].replace(/'/g, "’");
      str = str.replace(/\"/g, "”");
      form += key + "=" + str + "&";
    } else {
      form += key + "=" + data[key] + "&";
    }
  }

  form = form.substring(0, form.length - 1);
  request.withCredentials = true;
  request.crossDomain = true;
  // request.setRequestHeader('')
  request.send(form);
}

function POST1(url, data, callback) {
  console.log(data);
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(
        request.responseText.indexOf("{") == 0 || request.responseText.indexOf("[") == 0
          ? JSON.parse(request.responseText)
          : {
              errCode: -1,
            }
      );
    }
  };
  request.open("POST", url);

  var form = new FormData();
  for (var key in data) {
    //上传单个文件
    if (data[key] instanceof File) {
      var f = data[key];
      var blob = new window.Blob([f], {
        type: f.type,
      });
      form.append(key, blob);
      //上传多个文件
    } else if (data[key] instanceof FileList) {
      var files = data[key];
      for (let k = 0; k < files.length; k++) {
        let f = files[k];
        let blob = new window.Blob([f], {
          type: f.type,
        });
        form.append(key + k, blob);
      }
    } else if (data[key] instanceof Array) {
      var arrObj = data[key];
      //上传多个文件
      if (arrObj.length > 0 && arrObj[0] instanceof File) {
        let files = data[key];
        for (let k = 0; k < files.length; k++) {
          let f = files[k];
          let blob = new window.Blob([f], {
            type: f.type,
          });
          form.append(key + k, blob);
        }
      } else {
        form.append(key, JSON.stringify(arrObj));
      }
      //字符串化对象
    } else if (data[key] instanceof Object) {
      form.append(key, JSON.stringify(data[key]));
    } else {
      //字符型参数，对英文'"替换为中文’”
      if (data[key] && typeof data[key] == "string") {
        var str = data[key].replace(/'/g, "’");
        str = str.replace(/\"/g, "”");
        form.append(key, str);
      } else {
        form.append(key, data[key]);
      }
    }
  }
  // console.log(form);
  request.send(form);
}

function GET(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(
        request.responseText.indexOf("{") == 0 || request.responseText.indexOf("[") == 0
          ? JSON.parse(request.responseText)
          : {
              errCode: -1,
            }
      );
    }
  };
  request.withCredentials = true;
  request.crossDomain = true;
  request.open("GET", url);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  request.send(null);
}

function GET1(url, data, callback) {
  var query = "";
  for (var key in data) {
    query += key + "=" + data[key] + "&";
  }
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(
        request.responseText.indexOf("{") == 0 || request.responseText.indexOf("[") == 0
          ? JSON.parse(request.responseText)
          : {
              errCode: -1,
            }
      );
    }
  };
  request.open("GET", url + (url.indexOf("?") >= 0 ? "&" : "?") + query.substring(0, query.length - 1));
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  request.send(null);
}
//解析请求地址参数
function parseQueryVal(address) {
  address = address.match(/\?\S+/)[0];
  address = address.substring(1);
  var list = address.split("&");
  var result = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i].split("=");
    result[item[0]] = item[1];
  }
  return result;
}

export default {
  POST,
  POST1,
  GET,
  GET1,
  parseQueryVal,
};
