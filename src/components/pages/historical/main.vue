<template>
<v-app>
  <navBar />
  <Loader v-if="show"></loader>
  <v-icon class="reload" @click="reloadPage" v-if="showSubmitButton">
    mdi-refresh
  </v-icon>
  <div class="data-wrapper" v-if="noDataRequested">
    <div id="form-wrap">
      <div class="form-item" v-show="!show">
        <v-select
            :items="deviceList"
            label="Available xbees"
            filled
            v-model="device"
            v-on:input="showSubmitButton = true"
        ></v-select>
      </div>
      <div class="form-item" v-if="showSubmitButton">
        <v-btn @click="getDeviceData(device)">
          Get Flight Data
        </v-btn>
      </div>
    </div>
  </div>
  <div id="viz-wrap">
    <mapRender @ready="showData" :mapArray="mapArray" />
    <altitudeGraph :altitudeGraphObject="altitudeGraphObject"/>
    <tempGraph :tempGraphObject="tempGraphObject" />
    <rssiGraph :rssiGraphObject="rssiGraphObject" />
    <battGraph :battGraphObject="battGraphObject" />
  </div>
</v-app>
</template>

<script>
import Loader from '../loader'
import navBar from './navbarHistorical'
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
    DEVICES (newVal) {
      if (newVal.length > 0) {
        this.deviceListResponse = newVal
        this.availableDevices(this.deviceListResponse)
      }
    },
    device () {
      this.showSubmitButton = true
    },
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
    }

  },
  data () {
    return {
      show: true,
      DEVICES: [],
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
      device: '',
      deviceList: [],
      deviceListResponse: [],
      data_payload: [],
      showSubmitButton: false,
      noDataRequested: true
    }
  },
  mounted() {
    this.showToggle()
  },
  methods: {
    showToggle(){
      setTimeout(() => {
        this.show = false
      }, 1500)
    },
    availableDevices (response) {
      response.forEach(element => {
        this.deviceList.push(element.addr)
      });
    },
    getDeviceData (xbeeId) {
      this.show = true
      this.$apollo.query({
        query: gql` query data_payload($xbeeId: String!){
          device_data(where: {device_id: {_eq: $xbeeId}}) {
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
        variables: { xbeeId }
    }).then( (response) => {
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
    }
  },
  apollo: {
    DEVICES: {
      query: gql`
         {
          DEVICES {
            addr
          }
        }`
      }
    }
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
    height: auto;
    margin-top: 3em;
  }
  .reload {
    position: absolute;
    top: 3em;
    right: 3em;
  }
</style>