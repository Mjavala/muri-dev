<template>
  <div>
    <MapRender 
      :idList="idList" 
      :filteredMarker="filteredMarker" 
      :filteredAltitude="filteredAltitude" 
      :filteredMarkerStat="filteredMarkerStat"
      :filteredAzimuth="filteredAzimuth"
      :filteredElevation="filteredElevation"
    />
  </div>
</template>

<script>
/* TODO - change message object to (example, will need one for each graph)
  will need two - one for stat messages and one for raw messages
  raw message needs to include logic for different payload types
  mapPayloadRaw = {
    [id]: {
      filteredMarker: L.latLng(this.lat, this.lon),
      filteredAltitude: message.data.frame_data['gps_alt'] / 1000,
    }
  mapPayloadStat = {
    [id]: {
      filteredMarkerStat: L.latLng(this.lat, this.lon), !!!! lat/lon change between message types
      filteredAzimuth: messageOBJ.tracker.ant['azm'],
      filteredElevation: messageOBJ.tracker.ant['elv']
    }
  }
*/
import L from 'leaflet';
import MapRender from './mapRender'

export default {
  props: ['id', 'message', 'payloadStat'],
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
    payloadStat(newVal) {
      this.payloadStats = newVal
      this.assignDataObjectsStat(this.payloadStats)
    }
  },
  data() {
    return {
      payload: [],
      payloadStats: [],
      messageOBJ: [],
      idList: [],
      filteredMarker: {},
      filteredMarkerStat: {},
      filteredAltitude: {},
      filteredAzimuth: {},
      filteredElevation: {},
      rssi: Number
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
      this.filteredMarkerStat = marker
      this.filteredAzimuth = {
        [id]: messageOBJ.tracker.ant['azm']
      }
      this.filteredElevation = {
        [id]: messageOBJ.tracker.ant['elv']
        }
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