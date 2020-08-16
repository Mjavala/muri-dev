<!--
  - FilterID component ingests (props) station messages and balloon messages.
  - A list of all known stations and balloons are populated reactively and passed to the filteredMapData component.
  - TODO: map out @as2 custom event. 
    - This is the user click of a station that has to be propegated to the mqttReceiver component.
    - Ideally, a state management system (Vuex) would be used here (TODO)
-->
<template>
  <div>
      <filterMapData 
        :stationList='stationList' 
        :message='payload' 
        :messageRaw="payloadRaw" 
        :balloonIds="balloonIds"
        @selectedStationToFilterID="sendStationToParent"
      />
  </div>

</template>

<script>
import filterMapData from './filterMapData'

export default {
  props: ['message', 'messageRaw'],
  components: {
    filterMapData,
  },
  watch: {
    message(newVal) {
      this.payload = newVal
      this.addIdAndFilterMessage(newVal)
    },
    messageRaw(newVal) {
      this.payloadRaw = newVal
      this.addIdAndFilterMessageRaw(newVal)
    }
  },
  data() {
    return {
        payload: [],
        payloadRaw: [],
        messageOBJ: [],
        messageOBJRaw: [],
        stationList: [],
        balloonIds: [],
        uniqueStations: new Set(),
        uniqueBalloons: new Set()
    }
  },
  methods: {
    addIdAndFilterMessage(message){
      this.messageOBJ = JSON.parse(message)
      this.uniqueStations.add(this.messageOBJ['station'])
      this.stationList = Array.from(this.uniqueStations)
    },
    addIdAndFilterMessageRaw(message){
      this.messageOBJRaw = JSON.parse(message)
      this.uniqueBalloons.add(this.messageOBJRaw.data['ADDR_FROM'])
      this.balloonIds = Array.from(this.uniqueBalloons)
    },
    sendStationToParent (station) {
      this.$emit('addStation', station)
    }
  }
}
</script>
