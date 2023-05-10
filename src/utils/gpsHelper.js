export default {
  PI: 3.14159265358979324,
  x_pi: (3.14159265358979324 * 3000.0) / 180.0,
  delta(lat, lng) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
    var dLat = this.transformLat(lng - 105.0, lat - 35.0);
    var dlng = this.transformlng(lng - 105.0, lat - 35.0);
    var radLat = (lat / 180.0) * this.PI;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    dlng = (dlng * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return { lat: dLat, lng: dlng };
  },

  //WGS-84 to GCJ-02  原始的转高德
  gcj_encrypt(wgsLat, wgslng) {
    if (this.outOfChina(wgsLat, wgslng)) return { lat: wgsLat, lng: wgslng };

    var d = this.delta(wgsLat, wgslng);
    return { lat: wgsLat + d.lat, lng: wgslng + d.lng };
  },
  //GCJ-02 to WGS-84
  gcj_decrypt(gcjLat, gcjlng) {
    if (this.outOfChina(gcjLat, gcjlng)) return { lat: gcjLat, lng: gcjlng };

    var d = this.delta(gcjLat, gcjlng);
    return { lat: gcjLat - d.lat, lng: gcjlng - d.lng };
  },

  // wgs-84 转百度（原始的先转成高德，再从高德转为百度）2021-1-11
  wgs_gcj02_bdpt(gcjLat, gcjlng) {
    var pt = this.gcj_encrypt(gcjLat, gcjlng);
    // console.log("pt", pt);
    var gao_bd = this.bd_encrypt(pt.lat, pt.lng);
    // console.log(gao_bd);
    // return this.bd_encrypt(pt[0],pt[1])
    return { lat: gao_bd.lat, lng: gao_bd.lng };
  },

  // 2021-1-11 start
  gcj02tobd09(lng, lat) {
    var z =
      Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_pi);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_pi);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lat, bd_lng];
  },
  wgs84tobd09(lng, lat) {
    let wgs = this.wgs84togcj02(lng, lat);
    // console.log(wgs);
    return this.gcj02tobd09(wgs[0], wgs[1]);
  },
  wgs84togcj02(lng, lat) {
    if (this.outOfChina(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = this.transformLat(lng - 105.0, lat - 35.0);
      var dlng = this.transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * this.PI;
      var magic = Math.sin(radlat);
      magic = 1 - this.ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat =
        (dlat * 180.0) /
        (((this.a * (1 - this.ee)) / (magic * sqrtmagic)) * this.PI);
      dlng =
        (dlng * 180.0) / ((this.a / sqrtmagic) * Math.cos(radlat) * this.PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat];
    }
  },
  //// 2021-1-11 end
  //GCJ-02 to WGS-84 exactly
  gcj_decrypt_exact(gcjLat, gcjlng) {
    var initDelta = 0.01;
    var threshold = 0.000000001;
    var dLat = initDelta,
      dlng = initDelta;
    var mLat = gcjLat - dLat,
      mlng = gcjlng - dlng;
    var pLat = gcjLat + dLat,
      plng = gcjlng + dlng;
    var wgsLat,
      wgslng,
      i = 0;
    while (1) {
      wgsLat = (mLat + pLat) / 2;
      wgslng = (mlng + plng) / 2;
      var tmp = this.gcj_encrypt(wgsLat, wgslng);
      dLat = tmp.lat - gcjLat;
      dlng = tmp.lng - gcjlng;
      if (Math.abs(dLat) < threshold && Math.abs(dlng) < threshold) break;

      if (dLat > 0) pLat = wgsLat;
      else mLat = wgsLat;
      if (dlng > 0) plng = wgslng;
      else mlng = wgslng;

      if (++i > 10000) break;
    }
    //console.log(i);
    return { lat: wgsLat, lng: wgslng };
  },
  //GCJ-02 to BD-09 高德转百度
  bd_encrypt(gcjLat, gcjlng) {
    var x = gcjlng,
      y = gcjLat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    var bdlng = z * Math.cos(theta) + 0.0065;
    var bdLat = z * Math.sin(theta) + 0.006;
    return { lat: bdLat, lng: bdlng };
  },
  //BD-09 to GCJ-02  百度转高德
  bd_decrypt(bdLat, bdlng) {
    var x = bdlng - 0.0065,
      y = bdLat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    var gcjlng = z * Math.cos(theta);
    var gcjLat = z * Math.sin(theta);
    return { lat: gcjLat, lng: gcjlng };
  },
  // 高德转原始坐标系 zenos新增
  gcj02towgs84(lat, lng) {
    lat += lat;
    lng += lng;
    if (this.outOfChina(lat, lng)) {
      return { lat: lat, lng: lng };
    } else {
      var dlat = this.transformLat(lng - 105.0, lat - 35.0);
      var dlng = this.transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * this.PI;
      var magic = Math.sin(radlat);
      magic = 1 - this.ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat =
        (dlat * 180.0) /
        (((this.a * (1 - this.ee)) / (magic * sqrtmagic)) * this.PI);
      dlng =
        (dlng * 180.0) / ((this.a / sqrtmagic) * Math.cos(radlat) * this.PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      var maglat1 = lat * 2 - mglat;
      var maglng1 = lng * 2 - mglng;
      return { lat: maglat1, lng: maglng1 };
    }
  },

  //WGS-84 to Web mercator
  //mercatorLat -> y mercatorlng -> x
  mercator_encrypt(wgsLat, wgslng) {
    var x = (wgslng * 20037508.34) / 180;
    var y =
      Math.log(Math.tan(((90 + wgsLat) * this.PI) / 360)) / (this.PI / 180);
    y = (y * 20037508.34) / 180;
    return { lat: y, lng: x };
    /*
        if ((Math.abs(wgslng) > 180 || Math.abs(wgsLat) > 90))
            return null;
        var x = 6378137.0 * wgslng * 0.017453292519943295;
        var a = wgsLat * 0.017453292519943295;
        var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
        return {'lat' : y, 'lng' : x};
        //*/
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorlng -> x
  mercator_decrypt(mercatorLat, mercatorlng) {
    var x = (mercatorlng / 20037508.34) * 180;
    var y = (mercatorLat / 20037508.34) * 180;
    y =
      (180 / this.PI) *
      (2 * Math.atan(Math.exp((y * this.PI) / 180)) - this.PI / 2);
    return { lat: y, lng: x };
    /*
        if (Math.abs(mercatorlng) < 180 && Math.abs(mercatorLat) < 90)
            return null;
        if ((Math.abs(mercatorlng) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
            return null;
        var a = mercatorlng / 6378137.0 * 57.295779513082323;
        var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
        var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
        return {'lat' : y, 'lng' : x};
        //*/
  },
  // two point's distance
  distance(latA, lngA, latB, lngB) {
    var earthR = 6371000;
    var x =
      Math.cos((latA * this.PI) / 180) *
      Math.cos((latB * this.PI) / 180) *
      Math.cos(((lngA - lngB) * this.PI) / 180);
    var y = Math.sin((latA * this.PI) / 180) * Math.sin((latB * this.PI) / 180);
    var s = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    var alpha = Math.acos(s);
    var distance = alpha * earthR;
    return distance;
  },
  meter2distance: function(s) {
    var earthR = 6371000;
    var alpha = Math.acos(s);
    var distance = alpha * earthR;
    return distance;
  },
  outOfChina(lat, lng) {
    if (lng < 72.004 || lng > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
  },
  transformLat(x, y) {
    var ret =
      -100.0 +
      2.0 * x +
      3.0 * y +
      0.2 * y * y +
      0.1 * x * y +
      0.2 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((y / 12.0) * this.PI) +
        320 * Math.sin((y * this.PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  },
  transformlng(x, y) {
    var ret =
      300.0 +
      x +
      2.0 * y +
      0.1 * x * x +
      0.1 * x * y +
      0.1 * Math.sqrt(Math.abs(x));
    ret +=
      ((20.0 * Math.sin(6.0 * x * this.PI) +
        20.0 * Math.sin(2.0 * x * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) *
        2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((x / 12.0) * this.PI) +
        300.0 * Math.sin((x / 30.0) * this.PI)) *
        2.0) /
      3.0;
    return ret;
  }
};
