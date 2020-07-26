<template>
  <div>
    <MapRender 
      :idList="idList" 
      :filteredMarker="filteredMarker"
      :filteredStatMarker="filteredStatMarker"
      :filteredAltitude="filteredAltitude"
      :balloonToTrack4="balloonToTrack4"
     />
  </div>
</template>

<script>
import L from 'leaflet';
import MapRender from './mapRender'

export default {
  props: ['id', 'message', 'balloonToTrack3', 'payloadStat'],
  components: {
    MapRender
  },
  watch: {
    message(newVal) {
      this.payload = newVal
      this.filterMessage(this.payload)
    },
    id(newVal){
      this.idList = newVal
    },
    balloonToTrack3(newVal){
      this.balloonToTrack4 = newVal
    },
    payloadStat (newVal) {
      this.messageStat = newVal
      this.assignDataObjectsStat(this.messageStat)
    }
  },
  data() {
    return {
      payload: [],
      messageStat: [],
      messageOBJ: [],
      idList: [],
      filteredMarker: {},
      filteredStatMarker: {},
      filteredAltitude: {},
      rssi: Number,
      balloonToTrack4: ''
    }
  },
  methods: {
    filterMessage(message){
      this.messageOBJ = JSON.parse(message)
      if (this.idList !== [undefined]) {
        this.assignDataObjects(this.messageOBJ)
      }
    },
    assignDataObjects(message){
      const id = message.data['ADDR_FROM']
      this.latLngDataCleanup(message.data.frame_data['gps_lat'], message.data.frame_data['gps_lon'])
      this.filteredMarker = {
          [id] : L.latLng(this.lat, this.lon)
        }
      this.filteredAltitude =  message.data.frame_data['gps_alt'] / 1000
    },
    assignDataObjectsStat (message){
      const messageOBJ = JSON.parse(message)
      const id = messageOBJ['station']
      this.lat = messageOBJ.tracker.gps['gps_lat'] 
      this.lon = messageOBJ.tracker.gps['gps_lon']
      try {
        var marker = {
          [id] : L.latLng(this.lat, this.lon)
        }
      } catch {
        return
      }
      this.filteredStatMarker = marker
    },
    latLngDataCleanup(latitude, longitude){
      const lat = (latitude / 10000000)
      const lon = (longitude / 10000000)
      this.lat = lat
      this.lon = lon
    }
  }
}
</script>