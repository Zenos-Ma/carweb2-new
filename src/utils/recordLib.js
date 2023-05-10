/* 轨迹回放 */
// import BMapLib from "@/util/GeoUtils.js";
var RecordLib = function(histPtList, options) {
  var startTime = options.startTime; //开始时间
  var stopTime = options.stopTime; //结束时间
  var filtedTrack = [];
  var staticPts = [];
  var avgSpd = 0; //平均速度
  // console.log("histPtList", histPtList);
  init();
  // console.log("filtedTrack", filtedTrack);
  function init() {
    if (histPtList.length > 0) {
      filtedTrack = histPtList;
      if (options.no_smooth) {
        console.warn("滤波已取消");
        // filtedTrack = dofiltTrack(filtedTrack);
      } else {
        // filtedTrack = filtedTrack_smoothstay(filtedTrack);
        // filtedTrack = filtTrack_timeout(histPtList);
        // filtedTrack = filtTrack_fly(filtedTrack);
        //处理原始数据，减少遍历次数
        filtedTrack = dofiltTrack(filtedTrack);
        filtedTrack = filtTrack_debris(filtedTrack);
      }

      staticPts = filtTrack_parseStatic(filtedTrack);

      calculateDist();
      calculateRunTime();
      avgSpd = calculateAvgSpd();
      avgSpd = calcTrack();

      console.debug("过滤前长度" + histPtList.length + "过滤后长度" + filtedTrack.length);
    } else {
      console.warn("轨迹是空的");
    }
  }

  //获取两经纬度距离
  function getDistance(point1, point2) {
    var lat1 = point1.lat,
      lng1 = point1.lng,
      lat2 = point2.lat,
      lng2 = point2.lng;
    var radLat1 = (lat1 * Math.PI) / 180.0;
    var radLat2 = (lat2 * Math.PI) / 180.0;
    var a = radLat1 - radLat2;
    var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // 地球半径，千米;
    s = Math.round(s * 10000) / 10000; //输出为公里
    s = Math.round(s * 1000) / 1; //单位修改为米,取整
    // s = s.toFixed(4);
    return s;
  }
  function calcTrack() {
    var totalDist = 0;
    var totalRunTime = 0;
    var spdCnt = 0;
    var spdSum = 0;
    if (filtedTrack.length === 0) return 0;
    filtedTrack[0].totalDist = 0;
    for (var i = 1; i < filtedTrack.length; i++) {
      //计算总行驶里程
      var distance = getDistance(filtedTrack[i - 1].realPt, filtedTrack[i].realPt);
      if (isNaN(distance)) {
        distance = 0;
      }
      totalDist += distance;
      filtedTrack[i].totalDist = totalDist;
      //计算总运行时间
      if (filtedTrack[i - 1].speed > 7) {
        totalRunTime += filtedTrack[i].realTime - filtedTrack[i - 1].realTime;
      }
      filtedTrack[i].totalRunTime = totalRunTime;
      spdCnt++;
      spdSum += filtedTrack[i].speed;
    }
    //计算平均运行速度
    if (spdCnt == 0) {
      return 0;
    } else {
      return spdSum / spdCnt;
    }
  }

  function dofiltTrack(track) {
    // console.log(track);
    if (track.length == 0) {
      return track;
    }
    var newTrack = [];
    var tag = true;
    var distLimit = 350; // 距离阈值
    var prev_ts = track[0].realTime; // 时间阈值
    var prev_loc = track[0].realPt;
    newTrack.push(track[0]);
    for (var i = 1; i < track.length; i++) {
      var currPt = track[i];
      var dt = currPt.realTime - prev_ts; // 当前点的时间与上个点的时间差(时间戳)  时间跨度
      var d_dist = getDistance(currPt.realPt, prev_loc); // 当前点的位置与上个点的位置差   距离跨度
      var partKmh = (d_dist / (dt / 1000)) * 3.6; // 1m/s等于3.6km/h 短时匀速
      var realKmh = currPt.speed; // 当前位置的速度
      var eKmh = Math.abs(realKmh - partKmh); // 速度差
      var reKmh = eKmh / partKmh; // 速度比
      var isStatic = dt > 30 * 1000;
      // 两点之间的距离除以两点之间的时间得出的速度 partkmh,
      // 当前点的速度真实速度 realKmh
      // 当前点的速度与两点之间的速度差为 eKmh
      // 当前点的速度与两点之间的速度差与两点两点之间的速度比 reKmh
      // 当前点对比上一个点的时间差 dt ， 大于30秒视为是否静止
      // isFly:  速度比大于0.5 并且 不是静止的，或者速度差大于7 并且是静止的；才为true.否则就是false

      var isFly = (reKmh > 0.5 && !isStatic) || (eKmh > 7 && isStatic);
      // 反正就想拿到isFly的false值，只要是不满足isFly条件的就行，就是说isFly为true的话就过滤掉
      // console.log(
      //   "isFly",
      //   isFly,
      //   "reKmh",
      //   reKmh,
      //   "isStatic",
      //   isStatic,
      //   "d_dist",
      //   d_dist,
      //   "dt",
      //   dt,
      //   "eKmh",
      //   eKmh,
      //   "(reKmh > 0.5 && !isStatic)",
      //   reKmh > 0.5 && !isStatic,
      //   "(eKmh > 7 && isStatic)",
      //   eKmh > 7 && isStatic
      // );
      // console.log("!isFly", !isFly);
      if (!isFly && d_dist <= distLimit && dt < 30 * 1000 && dt > 0) {
        //除去不正常的飘点
        if (currPt.speed <= 0 && tag) {
          newTrack.push(currPt);
          tag = false;
        } else if (currPt.speed > 0) {
          newTrack.push(currPt);
          tag = true;
        }
      }
      prev_ts = currPt.realTime;
      prev_loc = currPt.realPt;
    }
    if (newTrack[newTrack.length - 1] != track[track.length - 1]) {
      newTrack.push(track[track.length - 1]);
    }
    return newTrack;
  }
  //连续停留点整合在一起
  function filtedTrack_smoothstay(track) {
    if (track.length == 0) {
      return track;
    }
    var newTrack = [];
    var tag = true;
    newTrack.push(track[0]);
    for (var i = 1; i < track.length; i++) {
      var currPt = track[i];
      if (currPt.speed <= 0 && tag) {
        newTrack.push(currPt);
        tag = false;
      } else if (currPt.speed > 0) {
        newTrack.push(currPt);
        tag = true;
      }
    }
    if (newTrack[newTrack.length - 1] != track[track.length - 1]) {
      newTrack.push(track[track.length - 1]);
    }
    console.log("整合停留点后", newTrack);
    return newTrack;
  }
  //清除时间异常点（静止时不应该上传点，因此超过30秒应该被视为无效点）
  function filtTrack_timeout(track) {
    if (track.length == 0) {
      return track;
    }
    var newTrack = [];
    var prev_ts = track[0].realTime;
    for (var i = 1; i < track.length; i++) {
      var currPt = track[i];
      var dt = currPt.realTime - prev_ts;
      //除了大于30秒的，还有重复的
      if (dt < 30 * 1000 && dt > 0) {
        newTrack.push(currPt);
      }
      prev_ts = currPt.realTime;
    }
    return newTrack;
  }
  //识别飞点（根据瞬时速度与短时匀速的对比）
  function filtTrack_fly(track) {
    if (track.length == 0) {
      return track;
    }
    var newTrack = [];
    var prev_ts = track[0].realTime;
    var prev_loc = track[0].realPt;
    for (var i = 1; i < track.length; i++) {
      var currPt = track[i];
      var dt = currPt.realTime - prev_ts;
      var d_dist = 0;
      d_dist = getDistance(currPt.realPt, prev_loc);
      var partKmh = (d_dist / (dt / 1000)) * 3.6;
      var realKmh = currPt.speed;
      var eKmh = Math.abs(realKmh - partKmh);
      var reKmh = eKmh / partKmh;
      var isStatic = dt > 30 * 1000;
      var isFly = (reKmh > 0.5 && !isStatic) || (eKmh > 7 && isStatic);
      if (!isFly) {
        newTrack.push(currPt);
      }
      prev_ts = currPt.realTime;
      prev_loc = currPt.realPt;
    }
    return newTrack;
  }
  //去除碎片
  function filtTrack_debris(track) {
    if (track.length == 0) {
      return track;
    }

    var newTrack = [];
    var fragment_start = 0;
    var fragment_len = 0;
    for (var i = 0; i < track.length; i++) {
      var currPt = track[i];
      // console.log("currPt", currPt);
      if (i == 0) {
        fragment_start = i;
      } else if (track[i - 1].index + 1 != currPt.index) {
        // 前一个track的index加一不等于当前的track的index的话
        fragment_start = i;
        // console.log("fragment", fragment_start);
      }
      var doPush = false; //是否执行 之前的fragment_len > 3的但是有很多地方出现轨迹没有了
      if (i == track.length - 1) {
        fragment_len = i + 1 - fragment_start;
        if (fragment_len > 1) doPush = true;
      } else if (track[i + 1].index - 1 != currPt.index) {
        // 下一个track的index减一不等于当前的track的index的话
        fragment_len = i + 1 - fragment_start;
        if (fragment_len > 1) doPush = true;
      }
      if (doPush) {
        for (var j = 0; j < fragment_len; j++) {
          newTrack.push(track[fragment_start + j]);
        }
      }
    }
    return newTrack;
  }
  //识别静止点
  function filtTrack_parseStatic(track) {
    if (track.length == 0) {
      return [];
    }
    var staticPt = [];
    var prev_loc = track[0].realPt;
    var prev_time = track[0].realTime;
    var dTime = 0;
    for (var i = 1; i < track.length; i++) {
      var currPt = track[i];
      var realDist = getDistance(currPt.realPt, prev_loc);
      dTime = currPt.realTime - prev_time;
      var realSpd = currPt.speed;
      var expSpd = (realDist / dTime) * 3600;
      var errRatio = expSpd / realSpd;
      //判定上一帧为静止点
      if (dTime > 60 * 1000 && errRatio < 0.2) {
        var point = {
          position: "",
          prevTime: prev_time,
          realTime: currPt.realTime,
          pt: track[i - 1].baiduPt,
          t: dTime,
          idx: i - 1,
        };
        staticPt.push(point);
        // console.debug("检测到静止点", point);
      }
      prev_loc = currPt.realPt;
      prev_time = currPt.realTime;
    }
    dTime = stopTime - track[track.length - 1].realTime;
    if (dTime > 60 * 1000) {
      staticPt.push({
        position: "",
        prevTime: track[track.length - 1].realTime,
        realTime: stopTime,
        pt: track[track.length - 1].baiduPt,
        t: dTime,
        idx: track.length - 1,
      });
    }
    return staticPt;
  }
  //计算里程
  function calculateDist() {
    var totalDist = 0;
    if (filtedTrack.length === 0) return 0;
    filtedTrack[0].totalDist = 0;
    for (var i = 1; i < filtedTrack.length; i++) {
      var distance = getDistance(filtedTrack[i - 1].realPt, filtedTrack[i].realPt);
      if (isNaN(distance)) {
        distance = 0;
      }
      totalDist += distance;
      filtedTrack[i].totalDist = totalDist;
    }
    return totalDist;
  }
  /**
   * 计算运行时长
   * @returns{number}
   */
  function calculateRunTime() {
    var totalRunTime = 0;
    if (filtedTrack.length === 0) return 0;
    filtedTrack[0].totalRunTime = 0;
    for (var i = 1; i < filtedTrack.length; i++) {
      if (filtedTrack[i - 1].speed > 7) {
        totalRunTime += filtedTrack[i].realTime - filtedTrack[i - 1].realTime;
      }
      filtedTrack[i].totalRunTime = totalRunTime;
    }
    return totalRunTime;
  }
  //计算平均速度
  function calculateAvgSpd() {
    var spdCnt = 0;
    var spdSum = 0;
    for (var i = 1; i < filtedTrack.length; i++) {
      spdCnt++;
      spdSum += filtedTrack[i].speed;
    }
    if (spdCnt == 0) {
      return 0;
    } else {
      return spdSum / spdCnt;
    }
  }
  //对外接口----------------------------------------------//获取轨迹点的数量
  this.getFiltedPtsCnt = function() {
    return filtedTrack.length;
  };
  //获取轨迹点数组
  this.getFiltedTrack = function() {
    return filtedTrack;
  };
  //获取index位置的轨迹点
  this.getFiltedTrackIndex = function(index) {
    if (index < filtedTrack.length) {
      return filtedTrack[index];
    } else {
      return null;
    }
  };
  //获取轨迹点数组的位置信息数组
  this.getFiltedPoints = function() {
    var ptList = [];
    for (var i = 0; i < filtedTrack.length; i++) {
      ptList.push(filtedTrack[i].baiduPt);
    }
    return ptList;
  };
  //获取静止点
  this.getStaticPoints = function() {
    return staticPts;
  };
  //获取超速点
  this.getOverspeedPoints = function(spdLimit) {
    var ovPts = [];
    for (let i = 0; i < filtedTrack.length; i++) {
      if (filtedTrack[i].speed > spdLimit) {
        let ovPt = filtedTrack[i];
        ovPt.idx = i;
        ovPts.push(ovPt);
      }
    }
    return ovPts;
  };
  //获取总里程
  this.getTotalDist = function() {
    if (filtedTrack.length == 0) {
      return 0;
    } else {
      return filtedTrack[filtedTrack.length - 1].totalDist;
    }
  };
  //获取平均速度
  this.getAvgSpeed = function() {
    return avgSpd;
  };
};
export default RecordLib;
