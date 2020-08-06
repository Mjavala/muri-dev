<template>
<v-app>
  <navBar />
  <Loader v-if="show"></loader>
  <v-icon class="reload" @click="reloadPage" v-if="showSubmitButton">
    mdi-refresh
  </v-icon>
  <div id="viz-wrap" v-if="!noDataRequested">
    <mapRender @ready="showData" :mapArray="mapArray" :apogeeLatLong="apogeeLatLong"/>
    <altitudeGraph :altitudeGraphObject="altitudeGraphObject"/>
    <tempGraph :tempGraphObject="tempGraphObject" />
    <rssiGraph :rssiGraphObject="rssiGraphObject" />
    <battGraph :battGraphObject="battGraphObject" />
  </div>
</v-app>
</template>

<script>
import Loader from '../loader'
import navBar from './navbarFlightPage'
import gql from 'graphql-tag';
import altitudeGraph from './graphs/altitudeGraph'
import tempGraph from './graphs/tempGraph'
import rssiGraph from './graphs/rssiGraph'
import battGraph from './graphs/battMonGraph'
import mapRender from './mapRender'

export default {
  components: {
    Loader,
    navBar,
    altitudeGraph,
    tempGraph,
    rssiGraph,
    battGraph,
    mapRender
  },
  watch: {
    data_payload () {
      for (var i = 0, len = this.data_payload.length; i < len; i++) {
        this.timeArray.push(this.data_payload[i].data_time)
        this.batteryMonitorArray.push(this.data_payload[i].batt_mon)
        this.ventBattArray.push(this.data_payload[i].vent_batt)
        this.mapArray.push([this.data_payload[i].latitude, this.data_payload[i].longitude])
        this.altitudeArray.push(this.data_payload[i].altitude)
        this.temperatureArray.push(this.data_payload[i].temperature)
        this.rssiArray.push(this.data_payload[i].rssi)
      }
      this.packageDataForGraphs()
    },
    altitudeArray (newVal) {
      let max
      let maxindex
      max, maxindex = this.returnIndexOfMax(newVal)
      this.apogeeLatLong = {
        'max': this.data_payload[maxindex].altitude,
        'lat': this.data_payload[maxindex].latitude,
        'lon': this.data_payload[maxindex].longitude
      }
    }
  },
  data () {
    return {
      show: true,
      timeArray: [],
      batteryMonitorArray: [],
      ventBattArray: [],
      longitudeArray: [],
      lattitudeArray: [],
      altitudeArray: [],
      mapArray: [],
      temperatureArray: [],
      rssiArray: [],
      altitudeGraphObject: {},
      rssiGraphObject: {},
      tempGraphObject: {},
      battGraphObject: {},
      data_payload: [],
      showSubmitButton: false,
      apogeeLatLong: {},
      noDataRequested: true,
      device: '',
      station: ''
    }
  },
  created () {
    this.device = this.$route.params.device
    this.device =this.device.substr(this.device.indexOf(' ')+1); // "tocirah sneab"
    this.station = this.$route.params.station
  },
  mounted() {
    this.showToggle()
    this.getDeviceData(this.device, this.station)
  },
  methods: {
    showToggle(){
      setTimeout(() => {
        this.show = false
      }, 1500)
    },
    getDeviceData (xbeeId, stationId) { 
      this.show = true
      this.$apollo.query({
        query: gql` query data_payload($xbeeId: String!, $stationId: String!){
          device_data(where: {device_id: {_eq: $xbeeId}, station_id: {_eq: $stationId}}) {
            batt_mon
            temperature
            vent_batt
            altitude
            data_time
            longitude
            latitude
            rssi
          }
        }`,
        variables: { xbeeId, stationId }
    }).then( (response) => {
      console.log(response)
      this.data_payload = response.data.device_data
      })
    this.noDataRequested = false
    },
    packageDataForGraphs () {
      this.altitudeGraphObject = {
        y: this.altitudeArray,
        x: this.timeArray
      }
      this.rssiGraphObject = {
        y: this.rssiArray,
        x: this.timeArray
      }
      this.tempGraphObject = {
        y: this.temperatureArray,
        x: this.timeArray
      },
      this.battGraphObject = {
        y: this.batteryMonitorArray,
        y2: this.ventBattArray,
        x: this.timeArray
      }
    },
    reloadPage(){
      window.location.reload()
    },
    showData(){
      this.show = false
    },
    returnIndexOfMax (arr) {
      if (arr.length === 0) {
          return -1;
      }
      var max = arr[0]
      var maxIndex = 0

      for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          maxIndex = i
          max = arr[i]
        }
      }
      return max, maxIndex
    }
  },
}

</script>

<style scoped>
  .data-wrapper {
    width: 100vw;
    height: 100vh;
  }
  #form-wrap{
    margin-top: 7.5em;
    display: flex;
  }
  .form-item {
    padding: 1em;
  }
  #viz-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    margin-top: 3em;
    position: relative;
  }
  .reload {
    position: absolute;
    top: 3em;
    right: 3em;
  }
</style>