<template>
    <!-- v-app-bar - https://vuetifyjs.com/en/components/app-bars/ -->
    <v-app-bar app flat id="nav">
      <v-img id="iriss-logo" max-height="50" max-width="200" src="../../../assets/iriss_logo.jpg" />
      <!-- v-btn - https://vuetifyjs.com/en/components/buttons/ -->
      <v-btn icon depressed rounded id="live" v-if="mqttConnected">
        <!-- v-icon - https://vuetifyjs.com/en/components/icons/  -->
          <v-icon id="live-icon" color="#76FF03">mdi-wifi</v-icon>
      </v-btn>
      <v-spacer />
        <v-btn id="station-diagnostics" light small v-if="showStationRedirect">
          <!-- router link - https://router.vuejs.org/api/ -->
            <router-link :to="{name: 'stationDiagnostics', params: { id: this.stationRedirect }}">
                Station Diagnostics
            </router-link>
        </v-btn>
        <v-btn  id="station-data" light small v-if="showStationRedirect">
            <router-link :to="{name: 'station', params: { id: this.stationRedirect }}">
                Station Data
            </router-link>
        </v-btn>
        <v-btn  id="station-data" light small>
          <!-- v-list-item - https://vuetifyjs.com/en/components/lists/ -->
          <a href="http://159.89.152.16/logs/" target="_blank">Log Files</a>
        </v-btn>
        <v-btn  id="station-data" light small>
          <router-link to="/muri/historical" target="_blank">Historical Data</router-link>
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  /* props are objects passed down from the parent component, in this case home.vue
    https://vuejs.org/v2/guide/components-props.html  */
  props: ['station', 'live'],
  watch: {
    station (newVal) {
      this.showStationRedirect = true
      this.stationRedirect = newVal
    },
    live (newVal){
      this.mqttConnected = newVal
    }
  },
  data () {
    return {
      stationRedirect: '',
      mqttConnected: false,
      showStationRedirect: false
    }
  }
}
</script>

<style>
  #nav{
    position: absolute;
    z-index: 1000;
    background-color: white;
  }
  a {
    color: black !important;
    text-decoration: none;
  }
  .noShowGraph {
    z-index: -1 !important;
  }
  .active {
    background-color: #76FF03 !important;
  }
  #live-icon {
    margin-top: 25%;
  }
  #station-data {
    margin: 0 0.5em;
    transform-origin: center !important;
  }
  #station-diagnostics {
    margin: 0 0.5em;
    transform-origin: center !important;
  }
</style>