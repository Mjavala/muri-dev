<template>
  <div class="map-diag">
    <l-map 
      v-bind="mapConfig"
    >
    <l-tile-layer 
      v-bind="mapRender"
    />
    <l-control-layers > </l-control-layers>
      <l-marker
        :key="marker.id"
        v-for="marker in markers"
        :lat-lng="marker.latlng"
      >
      <l-popup> 
        <div class="popups">
          alt: {{marker.altitude}}
        </div> 
      </l-popup>
      <l-icon v-bind="iconConfigBalloon" />
      </l-marker>
      <l-marker v-if="this.statCount === 1" :lat-lng="statMarker">
        <l-icon v-bind="iconConfig" />
      </l-marker>
      <l-circle
        v-if="this.statCount === 1"
        :lat-lng="statMarker"
        :radius="100000"
        :opacity="0.75"
        :fillOpacity="0.1"
      >
      </l-circle>
      <l-polyline
        :key="marker.id + 'line'"
        v-for="marker in markers"
        :lat-lngs="marker.pathLine"
        :opacity="1"
        :weight="1"
        :dashArray="'12'"
      />
      <l-polyline
        v-if="this.statCount === 1"
        :lat-lngs="azimuthLine"
        :opacity="1"
        :weight="3"
      >
      <l-popup v-if="this.statCount === 1"> 
        <div class="popups">
          elv: {{this.elv}}
        </div> 
      </l-popup>
      </l-polyline>
      <l-wms-tile-layer
        :base-url="baseUrl"
        :layers="layers"
        :opacity="opacity"
        :transparent="transparent"
        :attribution="attribution"
        :format="format"
      >
      </l-wms-tile-layer>
    </l-map>
  </div>
</template>

<script>
//TODO: Test render of markers / popups / prop data
import {LMap, LTileLayer, LMarker, LIcon, LPolyline , LPopup, LCircle ,LWMSTileLayer, LControlLayers} from 'vue2-leaflet'
import L from 'leaflet';
import Pin from '../../../../assets/pin.png'
import Station from '../../../../assets/broadcast.png'


export default {
  components: { 
    LMap, 
    LTileLayer, 
    LMarker,
    LIcon,
    LPolyline,
    LPopup,
    LCircle,
    LControlLayers,
    'l-wms-tile-layer': LWMSTileLayer
  },
  props: [
    'filteredMarker', 'idList', 'filteredAltitude', 'filteredMarkerStat', 'filteredAzimuth', 'filteredElevation'
  ],
  async created () {

// GET Datestring for today's file
    const date = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date) 

    var fName = `https://irisslive.net/bts/AUTO_JSON/MARS_${year }${month}${day}_1400.json`;

    console.log("Attempint to load prediction: " + fName);

    //const fName = 'https://irisslive.net/bts/AUTO_JSON/TODAY.geojson'
    const response = await fetch(fName, {
      mode: 'no-cors' // 'cors' by default
    });
    var thisTXT= await response.text();

    var lines = thisTXT.split("\n");

    console.log("Prediction Fetch Complete." );
    console.log(lines[0]);

    //console.log('GOT: ' + thisJSON);
    this.geojson = JSON.parse(lines[1]);
  },
  watch: {
    filteredMarker(newVal){
      let objKey = Object.keys(newVal)
      this.currentDevice = objKey[0]
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
      this.currentPosition = objKeyMap[0]
    },
    filteredAltitude(newVal) {
      this.currentAltitude = (newVal).toFixed(1)
    },
    filteredMarkerStat(newVal) {
      let objKey = Object.keys(newVal)
      this.currentStation = objKey[0]
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k])
      this.currentStationPosition = objKeyMap[0]
      this.mapConfig.center = L.latLng(this.currentStationPosition.lat, this.currentStationPosition.lng)
      this.statMarker = objKeyMap[0]
      if(this.statCount === 0) {
        this.statCount = this.statCount + 1
      }
    },
    filteredAzimuth (newVal) {
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k])
      this.az = objKeyMap[0]
      if (this.az >= 0 && this.az <= 90) {
        this.bearing = this.az
      }
      if (this.az > 90 && this.az <= 180) {
        this.bearing = this.az
      }
      if (this.az > 180 && this.az <= 270) {
        this.bearing = this.az
      }
      if (this.az > 270 && this.az <= 360) {
        this.bearing = - (360 - this.az)
      }
      if(this.statCount === 1){
        const start = this.mapConfig.center
        const R = 6378.1
        const brng = this.bearing * Math.PI / 180
        const d = 100 
        const lat1 = start.lat *  Math.PI / 180
        const lon1 = start.lng *  Math.PI / 180
        const lat2 = Math.asin( Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng))
        const lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2))

        const lat2Final = lat2 * 180 / Math.PI
        const lon2Final = lon2 * 180 / Math.PI
        this.azimuthLineEnd = L.latLng(lat2Final, lon2Final)
        this.azimuthLine = [this.mapConfig.center, this.azimuthLineEnd]
      }
    },
    filteredElevation (newVal) {
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k])
      this.elv = objKeyMap[0]
    },
    idList(newVal, oldVal){
      if (newVal.length === oldVal.length){
        // loop through array and find the array index that matches the 'currentDevice'
        // update the 'markers' array L.latlng field at the given index ..
        this.matchDeviceId()
      }
      if (newVal.length > oldVal.length && newVal.length > 1){
        // new device detected, push the 'filteredMarkers' object into the 'markers' array
        this.addMarkerToMarkerArray()
      }
      if (newVal.length === 1){
        // first device, add the first marker
        if (this.count === 0){
          if (this.currentPosition !== undefined) {
            this.addMarkerToMarkerArray()
            this.count = this.count + 1
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
  mounted () {
    this.layerRefresher = window.setInterval(this.refresh, 60000);
  },
  beforeDestroy() {
    window.clearInterval(this.layerRefresher);
  },
  data() {
    return {
      markers: [],
      azimuthLine: {},
      azimuthLineEnd: {},
      az: Number,
      elv: Number,
      bearing: Number,
      layerRefresher: undefined,
      showLayer: true,
      statMarker: {},
      statCount: 0,
      currentDevice: '',
      currentAltitude: Number,
      currentPosition: {},
      currentStation: '',
      currentStationPosition: {},
      count: 0,
      mapConfig: {
        zoom: 7,
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
      iconConfigBalloon: {
        'icon-url': Pin,
        'icon-size': [30,30],
      },
      iconConfig: {
        'icon-url': Station,
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
      attribution: "Weather data © 2012 IEM Nexrad"
    }
  },
  methods: {
    latLng(lat,long){
      return L.latLng(lat,long)
    },
    updateMarker(i) {
      this.markers[i].latlng = L.latLng(this.currentPosition.lat, this.currentPosition.lng)
      this.markers[i].pathLine.push([this.currentPosition.lat, this.currentPosition.lng])
      this.markers[i].altitude = this.currentAltitude
    },
    matchDeviceId () {
      for (const [i, markersObj] of this.markers.entries()) {
        if (this.currentDevice === markersObj.id) {
          this.updateMarker(i)
        }
      }
    },
    addMarkerToMarkerArray () {
      const markerObj = {
        id: this.currentDevice,
        latlng: L.latLng(this.currentPosition.lat, this.currentPosition.lng),
        pathLine: [[this.currentPosition.lat, this.currentPosition.lng]],
        altitude: this.currentAltitude
      }
      this.markers.push(markerObj)
    },
    refresh() {
      this.urlModifier++
      this.showLayer = false
      this.$nextTick(() => (this.showLayer = true))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.map-diag{
  height: 50vh;
  width: 50vw;
  display: inherit;
  padding: 2% 2% 0 1%;
  margin-top: 1em;
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
    .map-diag {
      height: 70vh;
      width: 100vw;
      padding: 0;
    }
  }
</style>