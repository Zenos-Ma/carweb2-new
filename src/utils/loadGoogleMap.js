export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
    } else {
      var script = document.createElement("script");
      script.type = "text/javascript";
      // script.async = true;
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhnBVTRF-i2BNqJOxzKwzdH-4zMQ2bgCY&sensor=false&libraries=places&language=en-us&callback=initAMap";
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.google);
    };
  });
}
