export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.Microsoft) {
      // console.log("dadadada");
      resolve(window.Microsoft);
    } else {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      let langType = window.localStorage.getItem("langType");
      let mapLang = "";
      if (langType == "zh") {
        mapLang = "zh-cn";
      } else if (langType == "en") {
        mapLang = "en-us";
      }
      script.src = `https://cn.bing.com/api/maps/mapcontrol?key=AisjCHWRd2ahuXBg61CeXfHV9vk1quAhnnn_lxQucGfCViu85UqqUR4zXOpqC-np&mkt=${mapLang}&callback=initAMap`;
      script.onerror = reject;
      document.head.appendChild(script);
      window.initAMap = () => {
        setTimeout(() => {
          // console.log("window.Microsoft", window.Microsoft);
          resolve(window.Microsoft);
        }, 1500);
      };
    }
  });
}

// export default function MapLoader() {
//   let langType = window.localStorage.getItem("langType");
//   let mapLang = "";
//   if (langType == "zh") {
//     mapLang = "zh-cn";
//   } else if (langType == "en") {
//     mapLang = "en-us";
//   }
//   const bingKey = "AisjCHWRd2ahuXBg61CeXfHV9vk1quAhnnn_lxQucGfCViu85UqqUR4zXOpqC-np";
//   const BingMapUrl = "http://www.bing.com/api/maps/mapcontrol?setLang=" + mapLang + "&key=" + bingKey;
//   return new Promise((resolve, reject) => {
//     if (typeof Microsoft !== "undefined") {
//       resolve(Microsoft);
//       return true;
//     }

//     // 插入script脚本
//     let scriptNode = document.createElement("script");
//     scriptNode.setAttribute("type", "text/javascript");
//     scriptNode.setAttribute("src", BingMapUrl);
//     document.body.appendChild(scriptNode);

//     // 等待页面加载完毕回调
//     let timeout = 0;
//     let interval = setInterval(() => {
//       // 超时10秒加载失败
//       if (timeout >= 20) {
//         reject();
//         clearInterval(interval);
//       }
//       // 加载成功
//       if (typeof Microsoft !== "undefined") {
//         resolve(Microsoft);
//         clearInterval(interval);
//       }
//       timeout += 1;
//     }, 1000);
//   });
// }
