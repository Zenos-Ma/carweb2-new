export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
      // console.log("1111111111dadaddada");
    } else {
      // console.log("dadaddada");
      var script = document.createElement("script");
      script.type = "text/javascript";
      // script.async = true;
      // b8dca57bcd955bef13a12fb3ec87cfda 珠海公交的key
      // ed45731968f87e2ebd5a627a791e1c0b 人保
      script.src = "https://webapi.amap.com/maps?v=1.4.15&key=b8dca57bcd955bef13a12fb3ec87cfda&plugin=AMap.MouseTool,AMap.ToolBar,AMap.Driving&callback=initAMap";
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}
