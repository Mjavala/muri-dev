<template>
    <!-- v-app-bar - https://vuetifyjs.com/en/components/app-bars/ -->
    <div>
      <v-app-bar app flat id="nav" class="hidden-xs-only">
        <v-img id="iriss-logo" max-height="50" max-width="200" src="../../../assets/iriss_logo.jpg" />
        <!-- v-btn - https://vuetifyjs.com/en/components/buttons/ -->
        <v-btn icon depressed rounded id="live" v-if="mqttConnected">
          <!-- v-icon - https://vuetifyjs.com/en/components/icons/  -->
            <v-icon id="live-icon" color="#76FF03">mdi-wifi</v-icon>
        </v-btn>
        <v-spacer />
        <div>
          <h1 id="title">MURI/HIFLiTS Live DGRS Tracker</h1>
        </div>
        <v-spacer />
          <v-btn  id="bts" light small>
            <a class="links" href="https://irisslive.net/bts/bts_main.html" target="_blank">BTS (Trajectory Simulator)</a>
          </v-btn>
          <v-btn id="station-diagnostics" light small v-if="showStationRedirect">
            <!-- router link - https://router.vuejs.org/api/ -->
              <router-link class="links" :to="{name: 'stationDiagnostics', params: { id: this.stationRedirect }}">
                  Station Diagnostics
              </router-link>
          </v-btn>
          <v-btn  id="station-data" light small v-if="showStationRedirect">
              <router-link class="links" :to="{name: 'station', params: { id: this.stationRedirect }}">
                  Station Data
              </router-link>
          </v-btn>
          <v-btn  id="dgrs-logs" light small>
            <!-- v-list-item - https://vuetifyjs.com/en/components/lists/ -->
            <a class="links" href="http://159.89.152.16/logs/" target="_blank">DGRS Log Files</a>
          </v-btn>
          <v-btn  id="station-data" light small>
            <router-link class="links" to="/muri/historical" target="_blank">Historical Data</router-link>
          </v-btn>
      </v-app-bar>
      <navBarMobile :station="station" class="hidden-sm-and-up" />
    </div>
</template>

<script>
import navBarMobile from './navBarHomeMobile'

export default {
  /* props are objects passed down from the parent component, in this case home.vue
    https://vuejs.org/v2/guide/components-props.html  */
  props: ['station', 'live'],
  components: {
    navBarMobile
  },
  watch: {
    station (newVal) {
      this.userSelectedStationReact(newVal)
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
  },
  methods: {
    userSelectedStationReact (station) {
      // redirect URL
      this.showStationRedirect = true
      this.stationRedirect = station
      // title styles
      const title = document.getElementById('title')
      title.classList.add('smallTitle')
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
  .links {
    color: black !important;
    text-decoration: none;
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
  h1 {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      font-size: 2em;
      font-weight: 600;
  }
  .smallTitle {
    font-size: 1.5em;
  }
</style>