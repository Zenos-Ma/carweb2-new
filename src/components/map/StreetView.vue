<template>
  <div :id="'panorama' + mapName" style="height: 100%;width: 100%;overflow-x: hidden;overflow-y: hidden;background:white;" v-show="isShow"></div>
</template>

<script>
export default {
  name: "StreetView",
  props: {
    mapName: {
      type: String,
      default: "",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
    theMap: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    panorama: null,
  }),
  watch: {
    isShow() {
      if (this.isShow) {
        this.showView();
      }
    },
    lat() {
      if (this.isShow) {
        this.changeView();
      }
    },
    lng() {
      if (this.isShow) {
        this.changeView();
      }
    },
  },
  methods: {
    showView() {
      //显示街景
      var panorama = new BMap.Panorama("panorama" + this.mapName);
      panorama.setPosition(new BMap.Point(this.lng, this.lat));
      this.panorama = panorama;
    },
    initPano() {
      //  实现谷歌地图的街景
      // console.log("街景");
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 14,
      });
      var panocont = document.getElementById("panorama" + this.mapName);
      const panorama = new google.maps.StreetViewPanorama(panocont, {
        position: { lat: this.lat, lng: this.lng },
        addressControlOptions: {
          position: google.maps.ControlPosition.BOTTOM_CENTER,
        },
        linksControl: false,
        panControl: true,
        enableCloseButton: false,
      });
      map.setStreetView(panorama);
    },
    changeView() {
      //改变街景位置
      if (this.panorama) {
        // console.log(this.lng, this.lat);
        this.panorama.setPosition(new BMap.Point(this.lng, this.lat));
      } else {
        this.showView();
      }
    },
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style></style>
