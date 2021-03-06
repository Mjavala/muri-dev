<template>
  <div class="map-data">
    <l-map ref="map"
      v-bind="mapConfig"
    >
    <l-tile-layer 
      v-bind="mapRender"
    />
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
        :weight="4"
      />
      <l-polyline
        :key="marker +'line'"
        v-for="marker in historicalMarkers"
        :lat-lngs="marker"
        :opacity="1"
        :weight="4"
      />
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
import {LMap, LTileLayer, LMarker, LIcon , LPopup, LPolyline, LCircle ,LWMSTileLayer, LGeoJson} from 'vue2-leaflet'
import L from 'leaflet';
import Pin from '../../../../assets/pin.png'
import Station from '../../../../assets/broadcast.png'
import Finish from '../../../../assets/race-flag.png'


export default {
  components: { 
    LMap, 
    LTileLayer, 
    LMarker,
    LIcon,
    LPolyline,
    LPopup,
    LCircle,
    LGeoJson,
    'l-wms-tile-layer': LWMSTileLayer
  },
  props: [
    'filteredMarker', 'idList', 'filteredAltitude', 'filteredStatMarker', 'mapArray'
  ],
  watch: {
    filteredMarker(newVal){
      this.live = true
      let objKey = Object.keys(newVal)
      this.currentDevice = objKey[0]
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
      this.currentPosition = objKeyMap[0]
      this.mapConfig.center = L.latLng(this.currentPosition.lat, this.currentPosition.lng)
    },
    filteredAltitude(newVal) {
      this.currentAltitude = (newVal).toFixed(1)
    },
    filteredStatMarker(newVal) {
      let objKey = Object.keys(newVal)
      this.currentStation = objKey[0]
      let objKeyMap = Object.keys(newVal).map((k) => newVal[k])
      this.currentStationPosition = objKeyMap[0]
      this.statMarker = objKeyMap[0]
      if(this.statCount === 0) {
        this.statCount = this.statCount + 1
      }
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
    },
    mapArray (newVal) {
      this.historicalMarkers.push([newVal])
      this.historicalDataCounter++ 
      const startBound = [newVal[0][0], newVal[0][1]]
      const endBound = [newVal[newVal.length - 1][0], newVal[newVal.length - 1][1]]
      this.$refs.map.mapObject.fitBounds([startBound, endBound], { padding: [75, 75] });


    }
  },
  created () {

// GET Datestring for today's file
    const date = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' }) 
    const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(date) 

    var fName = `https://irisslive.net/bts/AUTO_JSON/MARS_${year }${month}${day}_1200.json`;
    console.log("Attempint to load prediction: " + fName);

    fetch(fName, {mode: 'no-cors'})
        .then( r => r.text() )
        .then( t => {
            var lines = t.split("\n");
            console.log("Prediction Fetch Complete." );
            console.log(lines[0]);

            this.geojson = JSON.parse(lines[1]);

          });
  },
  computed: {
    uniqueUrl() {
      return `${this.baseUrl}?r=${this.urlModifier}`;
    }
  },
  mounted() {
    this.layerRefresher = window.setInterval(this.refresh, 60000);
  },
  beforeDestroy() {
    window.clearInterval(this.layerRefresher);
  },
  data() {
    return {
      markers: [],
      statMarker: {},
      statCount: 0,
      currentDevice: '',
      historicalMarkers: [],
      showLayer: true,
      urlModifier: 1,
      layerRefresher: undefined,
      live: false,
      startMarker: L.latLng(40, -105),
      currentAltitude: Number,
      currentPosition: {},
      currentStation: '',
      currentStationPosition: {},
      count: 0,
      mapConfig: {
        zoom: 13,
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
      iconConfigFinish: {
        'icon-url': Finish,
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
      } ,
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
.map-data{
  height: 50vh;
  width: 40vw;
  display: inherit;
  padding: 2% 2% 0 1%;
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
    .map-data {
      height: 70vh;
      width: 100vw;
      padding: 0;
    }
  }
</style>