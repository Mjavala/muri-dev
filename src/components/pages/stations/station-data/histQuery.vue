<template>
  <div id="map-graph-wrap">
      <filterMapData 
        :id='deviceList' 
        :message='payload' 
        :balloonToTrack3="balloonToTrack3"
        :payloadStat='payloadStat'
        :coordinateArray="coordinateArray"
      />
      <filterGraphData 
        :id='deviceList'
        :message='payload'
        :payloadStat='payloadStat'
        :balloonToTrack3="balloonToTrack3"
        :tempGraphObject="tempGraphObject"
        :rssiGraphObject="rssiGraphObject"
        :battGraphObject="battGraphObject"
        :altitudeGraphObject="altitudeGraphObject"
      />
  </div>

</template>

<script>
import filterMapData from './filterMapData'
import filterGraphData from './filterGraphData'
import gql from 'graphql-tag';

export default {
  props: ['message', 'messageStat', 'balloonToTrack2', 'getDataQuery', 'queryDevice', 'stationFilter'],
  components: {
    filterMapData,
    filterGraphData
  },
  watch: {
    message(newVal) {
      this.payload = newVal
      this.addIdAndFilterMessage(newVal)
    },
    messageStat(newVal) {
      this.payloadStat = newVal
    },
    balloonToTrack2(newVal) {
      this.balloonToTrack3 = newVal
    },
    data_payload () {
      for (var i = 0, len = this.data_payload.length; i < len; i++) {
          this.timeArray.push(this.data_payload[i].data_time)
          this.batteryMonitorArray.push(this.data_payload[i].batt_mon)
          this.ventBattArray.push(this.data_payload[i].vent_batt)
          this.coordinateArray.push([this.data_payload[i].latitude, this.data_payload[i].longitude])
          this.altitudeArray.push(this.data_payload[i].altitude)
          this.temperatureArray.push(this.data_payload[i].temperature)
          this.rssiArray.push(this.data_payload[i].rssi)
      }
      this.packageDataForGraphs()
    },
    queryDevice (newVal) {
      this.queryBalloon = newVal
    },
    stationFilter (newVal) {
      this.queryStation = newVal
    },
    getDataQuery (newVal) {
      if (newVal === true) {
        this.getHistoricalData(this.queryBalloon, this.queryStation)
      }
    }
  },
  data() {
    return {
        payload: [],
        queryBalloon: undefined,
        queryStation: undefined,
        data_payload: undefined,
        payloadStat: [],
        messageOBJ: [],
        deviceList: [],
        listOfIds: new Set(),
        balloonToTrack3: '',
        timeArray: [],
        batteryMonitorArray: [],
        ventBattArray: [],
        coordinateArray: [],
        altitudeArray: [],
        temperatureArray: [],
        rssiArray: [],
        altitudeGraphObject: {},
        rssiGraphObject: {},
        battGraphObject: {},
        tempGraphObject: {},
        queryCount: 0,
        statMsgCount: 0
    }
  },
  methods: {
    addIdAndFilterMessage(message){
      this.messageOBJ = JSON.parse(message)
      this.listOfIds.add(this.messageOBJ.data['ADDR_FROM'])
      this.deviceList = Array.from(this.listOfIds)
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
    getHistoricalData (balloon, station) {
      if (balloon !== null && station !== null) {
        this.$apollo.query({
          query: gql` query data_payload($balloon: String!, $station: String!){
            device_data_aggregate(limit: 500, order_by: {data_time: asc}, where: {device_id: {_eq: $balloon}, _and: {station_id: {_eq: $station}}}) {
              nodes {
                batt_mon
                temperature
                vent_batt
                altitude
                data_time
                longitude
                latitude
                rssi
              }
            }
          }`,
          variables: { balloon, station }
        }).then( response => {
          this.data_payload = response.data.device_data_aggregate.nodes
          this.$emit('queryReady', true)
        }).catch ( error => {console.log(error.message)})
        }
      }
    }
  }
</script>

<style>
  #map-graph-wrap{
    position: relative;
    height: 45vh;
  }
  /* mobile styles */
  @media only screen and (max-width: 600px){
    #map-graph-wrap {
      position: absolute;
      top: -11em;
    }
  }
</style>
