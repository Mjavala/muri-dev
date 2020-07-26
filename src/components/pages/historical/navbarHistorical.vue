<template>    
    <v-app-bar app flat id="nav"
    >
      <v-img id="iriss-logo" max-height="50" max-width="200" src="../../../assets/iriss_logo.jpg" />
      <v-btn icon depressed rounded id="live" v-if="mqttConnected">
          <v-icon id="live-icon" color="#76FF03">mdi-wifi</v-icon>
      </v-btn>
      <v-spacer />
        <v-btn id="station-diagnostics" light small>
            <router-link to="/">
               Home
            </router-link>
        </v-btn>
        <v-btn  id="station-data" light small>
          <a href="http://159.89.152.16/logs/" target="_blank">Log Files</a>
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  props: ['station', 'live'],
  data () {
    return {
      stationRedirect: '',
      mqttConnected: false,
      showStationRedirect: false
    }
  },
  watch: {
    station (newVal) {
      this.showStationRedirect = true
      this.stationRedirect = newVal
    },
    live (newVal){
      this.mqttConnected = newVal
    }
  }
}
</script>

<style>
  #nav{
    position: fixed;
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
    animation: wiggle 3s infinite ease-in-out forwards 4s;
  }
  #station-diagnostics {
    margin: 0 0.5em;
    transform-origin: center !important;
    animation: wiggle 3s infinite ease-in-out forwards 2s;
  }
  @keyframes wiggle {
    0% {transform: rotate(0deg);}
    25% {transform: rotate(-0.1deg);}
    30% {transform: rotate(-2deg);}
    35% {transform: rotate(3deg);}
    40% {transform: rotate(0deg);}
    100% {transform: rotate(0deg);}
  }
</style>