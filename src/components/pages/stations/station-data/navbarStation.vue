<template>   
  <div>
      <v-app-bar app id="nav" flat v-if="!$vuetify.breakpoint.xs">
        <v-img id="iriss-logo" max-height="100" max-width="225" src="../../../../assets/iriss_logo.jpg" />
        <v-spacer />
        <div id="station">{{this.diagnostics}}</div>
        <v-spacer />
        <v-btn class="spacing-nav" light small>
          <router-link to="/">Home</router-link>
        </v-btn>
        <v-btn id="station-diagnostics" light small @click="routeToDiagnostics">
          Station Diagnostics
        </v-btn>
        <v-btn class="spacing-nav" light small @click="toggleFeed">
          Feed
        </v-btn>
    </v-app-bar>
    <navBarMobile v-if="$vuetify.breakpoint.xs" :station="station" @showFeedMobile="toggleFeed"/>
  </div> 
</template>

<script>
import navBarMobile from './navBarStationMobile'

export default {
  props: ['station'],
  components: {
    navBarMobile
  },
  watch: {
    station(newVal) {
      this.diagnostics = newVal
    }
  },
  data () {
    return {
      diagnostics: '',
      showFeed: false
    }
  },
  methods: {
    routeToDiagnostics(){
      let routeData = this.$router.resolve({name: 'stationDiagnostics', params: {id: this.station}})
      window.open(routeData.href, '_blank')
    },
    toggleFeed(){
      this.showFeed = !this.showFeed
      this.$emit('showFeed', this.showFeed)
    }
  }
}
</script>

<style>
  #nav{
    position: absolute;
    z-index: 1000;
    height: 2.5em !important;
  }
  #station {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 1.75em;
    font-weight: 500;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .spacing-nav {
    margin: 0 0.25em !important;
  }
  .graph-button {
    margin: 0 4px;
    z-index: 10;
  }
</style>