<template>
  <div>
    <altitudeGraph :idList="idList" :filteredAltitude="filteredAltitude" />
    <rssiGraph :idList="idList" :filteredRSSI="filteredRSSI" />
    <tempGraph :idList="idList" :filteredTemp="filteredTemp" />
    <battMon 
      :filteredBatteryMonitor="filteredBatteryMonitor"
      :filteredVentBattery="filteredVentBattery" 
    />
    <hwAvgs :idList="idList" :filteredHwAvgs="filteredHwAvgs" />
    <cwAvgs :idList="idList" :filteredCwAvgs="filteredCwAvgs" />
  </div>
</template>

<script>
import altitudeGraph from './graphs/altitudeGraph'
import rssiGraph from './graphs/RSSIGraph'
import tempGraph from './graphs/temperatureGraph'
import battMon from './graphs/battMonGraph'  // nanananananana battMon!!!
import hwAvgs from './graphs/hwSpectralAvgs'
import cwAvgs from './graphs/cwSpectralAvgs'



export default {

  props: ['id', 'message', 'payloadStat'],
  components: {
    altitudeGraph,
    rssiGraph,
    tempGraph,
    battMon,
    hwAvgs,
    cwAvgs
  },
  watch: {
    message(newVal) {
      this.payload = newVal
      this.filterMessage(this.payload)
    },
    id(newVal){
      this.idList = newVal
    }
  },
  data() {
    return {
        payload: [],
        messageOBJ: [],
        idList: [],
        filteredAltitude: {},
        filteredRSSI: {},
        filteredTemp: {},
        filteredBatteryMonitor: {},
        filteredVentBattery: {},
        filteredHwAvgs: {},
        filteredCwAvgs: {},
        altitude: {},
        rssi: Number,
        time: new Date()
    }
  },
  methods: {
    filterMessage(message){
      this.messageOBJ = JSON.parse(message)
      this.assignDataObjects(this.messageOBJ)
    },
    assignDataObjects(message){
        const id = message.data['ADDR_FROM']

        this.filteredAltitude = {
            [id] : message.data.frame_data['gps_alt']
          }
        this.filteredRSSI = {
            [id] : message.data['RSSI_RX']
          }
        this.filteredTemp = {
            [id]: message.data.frame_data['Ta2_C']
          }
        //  need RS41 for humidity
        if (message.data['FRAME_TYPE'] === '0xd2a8') {
          this.filteredBatteryMonitor = {
              [id]: (message.data.frame_data['GOND_BATT_C']).toFixed(4)
          }
          this.filteredVentBattery = {
              [id]: message.data.frame_data['VENT_BATT_C']
          }
        }
        if (message.data['FRAME_TYPE'] === '0xc109') {
          const cw0 = message.data.frame_data['CW_SA_0']
          const cw1 = message.data.frame_data['CW_SA_1']
          const cw2 = message.data.frame_data['CW_SA_2']
          const cw3 = message.data.frame_data['CW_SA_3']
          const cw4 = message.data.frame_data['CW_SA_4']
          const cw5 = message.data.frame_data['CW_SA_5']
          const cw6 = message.data.frame_data['CW_SA_6']
          const cw7 = message.data.frame_data['CW_SA_7']
          const cw8 = message.data.frame_data['CW_SA_8']

          this.filteredCwAvgs = {
              [id] : [cw0, cw1, cw2, cw3, cw4, cw5, cw6, cw7, cw8]
            }
          const hw0 = message.data.frame_data['HW_SA_0']
          const hw1 = message.data.frame_data['HW_SA_1']
          const hw2 = message.data.frame_data['HW_SA_2']
          const hw3 = message.data.frame_data['HW_SA_3']
          const hw4 = message.data.frame_data['HW_SA_4']
          const hw5 = message.data.frame_data['HW_SA_5']
          const hw6 = message.data.frame_data['HW_SA_6']
          const hw7 = message.data.frame_data['HW_SA_7']
          const hw8 = message.data.frame_data['HW_SA_8']

          this.filteredHwAvgs = {
              [id] : [hw0, hw1, hw2, hw3, hw4, hw5, hw6, hw7, hw8]
            }
          }
        }
    }
}
</script>