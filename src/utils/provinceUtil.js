import Province from "@/json/province/province.json";
import City from "@/json/province/city.json";
// import Area from "@/json/province/area.json";
// import Street from "@/json/province/street.json";
import API from "@/utils/api.js";
let Area;
$.post({
  url: API.staticIcon + "province/area.json",
  method: "get",
  async: false,
  success(result) {
    Area = result;
  },
});
export default {
  province: Province,
  city: City,
  area: Area,
  // street: Street,
  getCity(code) {
    var list = [];
    if (code) {
      for (var i = 0; i < City.length; i++) {
        if (City[i].province == code) {
          list.push(City[i]);
        }
      }
    }

    return list;
  },
  getArea(code) {
    var list = [];
    if (code) {
      for (var i = 0; i < Area.length; i++) {
        if (Area[i].city == code) {
          list.push(Area[i]);
        }
      }
    }

    return list;
  },
  // getStreet(code) {
  //   var list = [];
  //   if (code) {
  //     for (var i = 0; i < Street.length; i++) {
  //       if (Street[i].area == code) {
  //         list.push(Street[i]);
  //       }
  //     }
  //   }

  //   return list;
  // },
  getAreaName(code) {
    var list = [];
    var str = "";
    if (code.length == 2) {
      list = Province;
    } else if (code.length == 4) {
      list = City;
      str = this.getAreaName(code.substring(0, 2));
    } else if (code.length == 6) {
      list = Area;
      str = this.getAreaName(code.substring(0, 2)) + this.getAreaName(code.substring(0, 4));
    }
    for (var i = 0; i < list.length; i++) {
      if (list[i].code == code) {
        return str + list[i].name;
      }
    }
    return "";
  },
  getProvinceCode(name) {
    for (var i = 0; i < Province.length; i++) {
      if (name == Province[i].name) {
        return Province[i].code;
      }
    }
    return "";
  },
  getCityCode(name, province) {
    for (var i = 0; i < City.length; i++) {
      if (name == City[i].name && province == City[i].province) {
        return City[i].code;
      }
    }
    return "";
  },
  getCityCodeInList(name, list) {
    for (var i = 0; i < list.length; i++) {
      if (name == list[i].name) {
        return list[i].code;
      }
    }
    return "";
  },
  formatAddress(address) {
    if (address.indexOf("村") >= 0 && address.indexOf("村") < address.length - 1) {
      return address.substring(address.indexOf("村") + 1);
    }
    if (address.indexOf("街道") >= 0 && address.indexOf("街道") < address.length - 1) {
      return address.substring(address.indexOf("街道") + 2);
    }
    if (address.indexOf("县") >= 0 && address.indexOf("县") < address.length - 1) {
      return address.substring(address.indexOf("县") + 1);
    }
    if (address.indexOf("区") >= 0 && address.indexOf("区") < address.length - 1) {
      return address.substring(address.indexOf("区") + 1);
    }
    if (address.indexOf("镇") >= 0 && address.indexOf("镇") < address.length - 1) {
      return address.substring(address.indexOf("镇") + 1);
    }
    if (address.indexOf("市") >= 0 && address.indexOf("市") < address.length - 1) {
      return address.substring(address.indexOf("市") + 1);
    }
    return address;
  },
};
