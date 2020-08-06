<template>
  <div class="map-data">
    <l-map 
      v-bind="mapConfig"
    >
    <l-tile-layer 
      v-bind="mapRender"
    />
    <l-feature-group ref="features">
      <l-polyline
          :lat-lngs="markers"
          :opacity="1"
          :weight="4"
      />
      <l-marker :lat-lng="startMarker">
          <l-icon v-bind="iconConfigBalloon" />
      </l-marker>
      <l-marker :lat-lng="endMarker">
          <l-icon v-bind="iconConfigFinish" />
      </l-marker>
      <l-marker :lat-lng="apogeeMarker">
          <l-icon v-bind="iconConfigFinish" />
        <l-popup> 
          <div class="popups">
            apogee (m): {{this.apogee}}
          </div> 
        </l-popup>
      </l-marker>
    </l-feature-group>
    </l-map>
  </div>
</template>

<script>
//TODO: Test render of markers / popups / prop data
import {LMap, LTileLayer, LPolyline, LPopup, LFeatureGroup, LMarker, LIcon } from 'vue2-leaflet'
import L from 'leaflet';
import Balloon from '../../../assets/pin.png'
import Finish from '../../../assets/race-flag.png'


export default {
  components: { 
    LMap, 
    LTileLayer,
    LFeatureGroup,
    LPolyline,
    LMarker,
    LIcon,
    LPopup
  },
  props: [
    'mapArray', 'apogeeLatLong'
  ],
  watch: {
    mapArray (newVal) {
        this.markers = newVal
        //this.mapConfig.center = L.latLng(newVal[newVal.length - 1][0], newVal[newVal.length - 1][1])
        this.startMarker = L.latLng(newVal[0][0], newVal[0][1])
        this.endMarker = L.latLng(newVal[newVal.length - 1][0], newVal[newVal.length - 1][1])
        //let midpoint = this.markers[Math.round((this.markers.length -1) / 2)]
        /*if (this.markers.length < 600) {
          this.mapConfig.zoom = 10
        }*/
        this.$emit('ready', true)
        //const startBound = [newVal[0][0], newVal[0][1]]
        //const endBound = [newVal[newVal.length - 1][0], newVal[newVal.length - 1][1]]
        //this.$refs.features.mapObject.fitBounds(startBound, endBound);
    },
    apogeeLatLong (newVal) {
      console.log(newVal)
      this.apogeeMarker = L.latLng(newVal.lat, newVal.lon)
      console.log(newVal.max)
      this.apogee = newVal.max
    }
  },
  data() {
    return {
      markers: [],
      startMarker: L.latLng(40, -105),
      endMarker: L.latLng(40, -105),
      apogee: 0,
      apogeeMarker: L.latLng(40, -105),
      count: 0,
      mapConfig: {
        zoom: 8,
        minZoom: 2,
        center: L.latLng(40, -105),
        Bounds: [
          [-90, -180],
          [90, 180]
        ],
        maxBounds: [
          [-90, -180],
          [90, 180]
        ],
      },
      mapRender: {
        url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      baseUrl:'http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi',
      layers: 'nexrad-n0r-900913',
      format: 'image/png',
      transparent: true,
      opacity: 0.5,
      attribution: "Weather data © 2012 IEM Nexrad",
      iconConfigBalloon: {
        'icon-url': Balloon,
        'icon-size': [30,30],
      },
      iconConfigFinish: {
        'icon-url': Finish,
        'icon-size': [30,30],
      },
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.map-data{
    width: 50vw;
    height: 60vh;
    display: inherit;
    padding: 0 2em;
    position: absolute;
    top: 1%;
    left: 0;
}
.leaflet-control-attribution {
  display: none;
}
.leaflet-marker-icon{
  opacity: .85;
}
.leaflet-control-zoom {
  padding: 2%;
  border: none !important;
}
.leaflet-control-zoom-in{
  background: white !important;
  color: #121212 !important;
}
.leaflet-control-zoom-out{
  background: white !important;
  color: #121212 !important;
}
</style>