<template>
<v-app>
  <navBar />
  <Loader v-if="show"></loader>
  <v-icon class="reload" @click="reloadPage" v-if="showSubmitButton">
    mdi-refresh
  </v-icon>
  <div class="data-wrapper">
    <div id="form-wrap">
      <div class="form-item" v-show="!show">
        <v-select
            :items="selectDeviceList"
            label="Available xbees"
            filled
            v-model="device"
            v-on:input="deviceSelected = true"
            min-width=300
        ></v-select>
        <v-select
            :items="stationList"
            label="Available stations"
            filled
            v-model="station"
            v-on:input="stationSelected = true"
        ></v-select>
      </div>
      <div class="form-item" v-if="showSubmitButton">
        <v-btn @click="getDeviceData(device, station)">
          Get Flight Data
        </v-btn>
      </div>
    </div>
  </div>
</v-app>
</template>

<script>
import Loader from '../loader'
import navBar from './navbarHistorical'
import gql from 'graphql-tag';

export default {
  components: {
    Loader,
    navBar,
  },
  watch: {
    DEVICES (newVal) {
      if (newVal.length > 0) {
        this.deviceListResponse = newVal
        this.availableDevices(this.deviceListResponse)
      }
    },
    STATIONS (newVal) {
      if (newVal.length > 0) {
        this.stationListResponse = newVal
        this.availabeStations(this.stationListResponse)
      }
    },
    stationSelected (newVal) {
      if (newVal === true && this.deviceSelected === true) {
        this.showSubmitButton = true
      }
    },
    deviceSelected (newVal) {
      if (newVal === true && this.stationSelected === true) {
        this.showSubmitButton = true
      }
    },
    data_payload (newVal, oldVal) {
      if (newVal.length == oldVal.length) {
        // done with for loop
        let objValues = Object.keys(newVal).map((k) => newVal[k]);

        objValues.forEach( (element) => {
          if (!(element === undefined)) {
            let date = element.data_time.split(' ')[0];
            this.flight_dates.push(date)
          }
        })
      }
    },
    flight_dates (newVal) {
      newVal.forEach((element, i) => {
        this.selectDeviceList.push(element + ' ' + this.deviceList[i])
      })
    }
  },
  data () {
    return {
      show: true,
      deviceSelected: false,
      stationSelected: false,
      selectDeviceList: [],
      DEVICES: [],
      STATIONS: [],
      timeArray: [],
      data_payload: [],
      device: '',
      station: '',
      deviceList: [],
      stationList: [],
      deviceListResponse: [],
      showSubmitButton: false,
      flight_dates: []
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
        this.dateQuery(element.addr)
      })
    },
    availabeStations (response) {
      response.forEach(element => {
        this.stationList.push(element.stat_addr)
      })
    },
    getDeviceData () { 
      this.$router.push({
          name: "historical",
          params: { device: this.device, station: this.station}
        });
    },
    reloadPage(){
      window.location.reload()
    },
    showData(){
      this.show = false
    },
    returnIndexOfMax (arr) {
      if (arr.length === 0) {
          return -1
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
    },
    dateQuery (xbeeId) {
      this.$apollo.query({
        query: gql` query data_payload($xbeeId: String!){
          device_data(limit: 1, where: {device_id: {_eq: $xbeeId}}) {
            data_time
          }
        }`,
        variables: { xbeeId }
        }).then( (response) => {
        this.data_payload.push(response.data.device_data[0])
      })
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
      },
      STATIONS: {
        query: gql`{
          STATIONS {
            stat_addr
          }
        }`
      }
    }
  }

</script>

<style>
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
  .v-list-item__title {
    font-size: 0.9em !important;
  }
  .v-menu__content {
    min-width: 300px !important;
  }
</style>