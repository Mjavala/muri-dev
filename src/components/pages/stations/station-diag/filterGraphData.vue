<template>
  <div>
    <rssiGraph 
      :filteredRSSI="filteredRSSI"
      :filteredRSSIStat="filteredRSSIStat"
    />
    <bytesPerSec  :filteredAvgByteSec="filteredAvgByteSec"/>
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
import bytesPerSec from './graphs/bytesPerSec'

export default {

  props: ['id', 'message', 'payloadStat'],
  components: {
    rssiGraph,
    bytesPerSec,
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
        filteredAvgByteSec: {},
        filteredElVoltage: {},
        filteredAzimuth: {},
        filteredElevation: {},
        filteredRSSI: {},
        filteredRSSIStat: {},
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

      this.filteredAvgByteSec = {
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
      this.filteredRSSIStat = {
          [id] : message.receiver_1.last.rssi_last['rssi']
      }
    }
  }
}
</script>