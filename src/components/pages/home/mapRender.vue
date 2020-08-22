<template>
  <div class="map-home">
    <l-map 
      v-bind="mapConfig"
    >
    <l-tile-layer 
      v-bind="mapRender"
    />
    <l-marker 
        :key="marker.id"
        v-for="marker in markersBalloon"
        :lat-lng="marker.latlng"
      >
      <l-icon v-bind="iconConfigBalloon" />
    </l-marker>
      <l-polyline
        :key="marker.id + 'line'"
        v-for="marker in markers"
        :lat-lngs="marker.polylines"
        :opacity="1"
        :weight="3"
      >
      </l-polyline>
    <l-marker
        :key="marker.id"
        v-for="marker in markers"
        :lat-lng="marker.latlng"
        :options="{alt: marker.id}"
      >
      <l-icon v-bind="iconConfig" />
    </l-marker>
    <l-circle
      :key="'circle' + marker.id"
      v-for="marker in markers"
      :lat-lng="marker.latlng"
      :radius="100000"
      :opacity="0.75"
      :fillOpacity="0.1"
    >
    </l-circle>
    <l-wms-tile-layer v-if="showLayer"
      :base-url="baseUrl"
      :layers="layers"
      :opacity="opacity"
      :transparent="transparent"
      :attribution="attribution"
      :format="format"
    >
    </l-wms-tile-layer>
    <l-geo-json :geojson="geojson" :options="geoJSON_options"></l-geo-json>
    </l-map>
  </div>
</template>

<script>
//TODO: Test render of markers / popups / prop data
import {LMap, LTileLayer, LMarker, LIcon, LCircle, LPolyline, LWMSTileLayer, LGeoJson} from 'vue2-leaflet'
import L from 'leaflet';
import Station from '../../../assets/broadcast.png'
import Balloon from '../../../assets/pin.png'

export default {
  components: { 
    LMap, 
    LTileLayer, 
    LMarker,
    LIcon,
    LCircle,
    LPolyline,
    LGeoJson,
    'l-wms-tile-layer': LWMSTileLayer
  },
  mounted () {
    document.addEventListener('click', (e) => {
      for (const [i, markersObj] of this.markers.entries()) {
        if (e.target.alt === markersObj.id) {
          this.$emit('selectedStationToMapFilter', this.markers[i].id)
        }
      }
    })
    this.layerRefresher = window.setInterval(this.refresh, 60000);
  },
  props: [
    'filteredMarker', 'idList', 'filteredBalloonMarker', 'balloonIdList', 'filteredAzimuth', 'filteredElevation'
  ],
  watch: {
    filteredMarker(newVal){
      let {marker, data} = this.unpackObj(newVal)
      this.currentStation = marker
      this.currentPosition = data
    },
    filteredAzimuth (newVal) {
      let {marker, data} = this.unpackObj(newVal)
      this.currentStationAzimuth = marker
      this.currentAzimuth = data
      this.updateData('azimuth')
    },
    filteredElevation (newVal) {
      let {marker, data} = this.unpackObj(newVal)
      this.currentStationElevation = marker
      this.currentElevation = data
      this.updateData('elevation')
    },
    filteredBalloonMarker(newVal) {
      let {marker, data} = this.unpackObj(newVal)
      this.currentBalloon = marker
      this.currentBalloonPosition = data
    },
    idList(newVal, oldVal){
      if (newVal.length === oldVal.length){
        // loop through array and find the array index that matches the 'currentDevice'
        // update the 'markers' array L.latlng field at the given index
        this.updateData('station')
      }
      if (newVal.length > oldVal.length && newVal.length > 1){
        // new device detected, push the 'filteredMarkers' object into the 'markers' array
        this.addMarkerToStationMarkerArray()
      }
      if (newVal.length === 1){
        // first device, add the first marker
        if (this.count === 0){
          this.addMarkerToStationMarkerArray()
          this.count = this.count + 1
        }
      }
    },
    balloonIdList(newVal, oldVal) {
      if (newVal.length === oldVal.length){
        // loop through array and find the array index that matches the 'currentDevice'
        // update the 'markers' array L.latlng field at the given index
        this.updateData('balloon')
      }
      if (newVal.length > oldVal.length && newVal.length > 1){
        // new device detected, push the 'filteredMarkers' object into the 'markers' array
        this.addMarkerToBalloonMarkerArray()
      }
      if (newVal.length === 1){
        // first device, add the first marker
        if (this.countBalloon === 0){
          if ('lat' in this.currentBalloonPosition) {
            this.addMarkerToBalloonMarkerArray()
            this.countBalloon = this.countBalloon + 1
          }
        }
      }
    }
  },
  computed: {
    uniqueUrl() {
      return `${this.baseUrl}?r=${this.urlModifier}`;
    }
  },
  beforeDestroy() {
    window.clearInterval(this.layerRefresher);
  },
  data() {
    return {
      markers: [],
      markersBalloon: [],
      currentStation: undefined,
      currentAzimuth: Number,
      currentElevation: Number,
      layerRefresher: undefined,
      showLayer: true,
      bearing: Number,
      currentStationAzimuth: undefined,
      currentStationElevation: undefined,
      currentBalloon: '',
      currentPosition: {},
      currentBalloonPosition: {},
      count: 0,
      countBalloon: 0,
      mapConfig: {
        zoom: 9,
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
      iconConfig: {
        'icon-url': Station,
        'icon-size': [30,30],
      },
      iconConfigBalloon: {
        'icon-url': Balloon,
        'icon-size': [30,30],
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
      geojson: null,
      geoJSON_options: {
        pointToLayer: function (feature, latlng) {
            //Styles
            var geojsonMarkerOptions = {
                radius: 6,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            };

            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        onEachFeature: function onEachFeature(feature, layer) {
            switch (feature.properties.title) {
                case "Landing": layer.setStyle({fillColor :'red'});  break;
                case "Launch": layer.setStyle({fillColor :'green'});  break;
                case "Apogee": layer.setStyle({fillColor :'blue'}); layer.bindPopup("<strong>Apogee</strong>");  break;
                case "Cut-Down": layer.setStyle({fillColor :'orange'}); break;
                case "Balloon In Measurement Range (20-40 km)": layer.setStyle({color :'#CCFF99', opacity: 0.8, dashArray: "5,15"}); break;
                case "Balloon Trajectory": layer.setStyle({color: "#6666FF", opacity: 0.8 }); break;
            }
        }
      },
    }
  },
  methods: {
    latLng(lat,long){
      return L.latLng(lat,long)
    },
    updateData (type) {
      for (const [i, markersObj] of this.markers.entries()) {
        if (type === 'elevation') {
          if (this.currentStationElevation === markersObj.id) {
            this.markers[i].elevation = this.currentElevation
          }
        }
        if (type === 'azimuth') {
          if (this.currentStationAzimuth === markersObj.id) {
            console.log(this.currentStationAzimuth, markersObj.id, i)
            this.pushPolylineArray(i)
          }
        }
        if (type === 'station') {
          if (this.currentStation === markersObj.id) {
            this.markers[i].latlng = L.latLng(this.currentPosition.lat, this.currentPosition.lng)
          }
        }
        if (type === 'balloon') {
          if (this.currentBalloon === markersObj.id) {
            this.markersBalloon[i].latlng = L.latLng(this.currentBalloonPosition.lat, this.currentBalloonPosition.lng)
          }
        }
      }
    },
    pushPolylineArray (i) {
      const start = L.latLng(this.currentPosition.lat, this.currentPosition.lng)
      const end = this.calculatePolylineEndpoint(this.currentPosition, this.currentAzimuth)
      this.markers[i].polylines = [start, end]
    },
    calculatePolylineEndpoint(start, azimuth) {
      if (azimuth >= 0 && azimuth <= 90) {
        this.bearing = azimuth
      }
      if (azimuth > 90 && azimuth <= 180) {
        this.bearing = azimuth
      }
      if (azimuth > 180 && azimuth <= 270) {
        this.bearing = this.az
      }
      if (azimuth > 270 && azimuth <= 360) {
        this.bearing = - (360 - azimuth)
      }
      const R = 6378.1
      const brng = this.bearing * Math.PI / 180
      const d = 100 
      const lat1 = start.lat *  Math.PI / 180
      const lon1 = start.lng *  Math.PI / 180
      const lat2 = Math.asin( Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng))
      const lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2))

      const lat2Final = lat2 * 180 / Math.PI
      const lon2Final = lon2 * 180 / Math.PI
      const endpoint = L.latLng(lat2Final, lon2Final)
      return endpoint
    },
    addMarkerToStationMarkerArray() {
      const markerObj = {
        id: this.currentStation,
        latlng: L.latLng(this.currentPosition.lat, this.currentPosition.lng),
        polylines: [],
        elevation: Number
      }
      this.markers.push(markerObj)
    },
    addMarkerToBalloonMarkerArray() {
      const markerObj = {
        id: this.currentBalloon,
        latlng: L.latLng(this.currentBalloonPosition.lat, this.currentBalloonPosition.lng)
      }
      this.markersBalloon.push(markerObj)
    },
    refresh() {
      this.urlModifier++
      this.showLayer = false
      this.$nextTick(() => (this.showLayer = true))
    },
    unpackObj (data) {
      let objKey = Object.keys(data)[0]
      let objKeyMap = Object.keys(data).map((k) => data[k])[0]
      return {
        marker: objKey, 
        data: objKeyMap
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map-home{
  height: 85vh;
  width: 75vw;
  display: inherit;
  padding: 2% 2% 0 1%;
  margin-top: 3.5%;
}
.leaflet-container a.leaflet-popup-close-button{
  color: #121212;
  width: 15px;
  padding: 0;
}
.leaflet-popup-content-wrapper, .leaflet-popup-tip{
  background: #121212;
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
/* mobile styles */
@media only screen and (max-width: 600px){
    .map-home {
      height: 75vh;
      width: 100vw;
      padding: 0;
    }
}
</style>