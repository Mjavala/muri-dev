<template>
  <div>
    <rssiGraph :idList="idList" :filteredRSSI="filteredRSSI" />
    <voltageGraph  :filteredAzimuthVoltage="filteredAzimuthVoltage"/>
    <azmElv :filteredAzimuth="filteredAzimuth" :filteredElevation="filteredElevation" />

  </div>
</template>

<script>
/* TODO - change message object to (example, will need one for each graph)
  voltage graph
  graphPayload = {
    [id]: {
      filteredAzimuthVoltage: message.tracker.ant['raw_azm_volts']
      filteredElevationVoltage: message.tracker.ant['raw_elv_volts']
    }
  }
*/
import rssiGraph from './graphs/rssiGraph'
import azmElv from './graphs/azmElvGraph'
import voltageGraph from './graphs/voltageGraph'

export default {

  props: ['id', 'message', 'payloadStat'],
  components: {
    rssiGraph,
    voltageGraph,
    azmElv
  },
  watch: {
    message(newVal) {
      this.payload = newVal
      this.filterMessage(this.payload)
    },
    id(newVal){
      this.idList = newVal
    },
    payloadStat (newVal) {
      this.payloadStats = newVal
      this.filterMessageStat(this.payloadStats)
    }
  },
  data() {
    return {
        payload: [],
        payloadStats: [],
        messageOBJ: [],
        idList: [],
        filteredAzimuthVoltage: {},
        filteredElVoltage: {},
        filteredAzimuth: {},
        filteredElevation: {},
        filteredRSSI: {},
        rssi: Number,
        time: new Date()
    }
  },
  methods: {
    filterMessage(message){
      this.messageOBJ = JSON.parse(message)
      this.assignDataObjects(this.messageOBJ)
    },
    filterMessageStat(message){
      this.messageOBJ = JSON.parse(message)
      this.assignDataObjectsStation(this.messageOBJ)
    },
    assignDataObjects(message){
      const id = message.data['ADDR_FROM']
      
      this.filteredRSSI = {
          [id] : message.data['RSSI_RX']
        }
      },
    assignDataObjectsStation (message) {
      const id = message['station']

      this.filteredAzimuthVoltage = {
        [id]: (message.receiver_1.last['avg_byte_sec']).toFixed(3)
      }
      this.filteredElVoltage = {
        [id]: message.tracker.ant['raw_elv_volts']
      }
      this.filteredAzimuth = {
        [id]: message.tracker.ant['azm']
      }
      this.filteredElevation = {
        [id]: message.tracker.ant['elv']
      }
    }
  }
}
</script>