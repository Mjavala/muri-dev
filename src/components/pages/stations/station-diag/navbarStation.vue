<template>    
    <v-app-bar
        app
        id="nav"
        flat
    >
      <v-img id="iriss-logo" max-height="100" max-width="225" src="../../../../assets/iriss_logo.jpg" />
      <v-spacer />
      <v-btn class="spacing-nav" light small>
        <router-link to="/">Home</router-link>
      </v-btn>
      <v-btn id="station-diagnostics" light small @click="routeToDiagnostics">
        Station Data
      </v-btn>
      <v-btn id="ant-cmd" light small @click="antCMD">
        Antenna cmd
      </v-btn>
      <v-btn class="spacing-nav" light small @click="toggleFeed">
        Feed
      </v-btn>
    </v-app-bar>
</template>

<script>
export default {
  props: ['station'],
  watch: {
    station(newVal) {
      this.diagnostics = newVal
    }
  },
  data () {
    return {
      diagnostics: '',
      antennaToggle: false
    }
  },
  methods: {
    routeToDiagnostics(){
      let routeData = this.$router.resolve({name: 'station', params: {id: this.station}})
      window.open(routeData.href, '_blank')
    },
    antCMD(){
      this.antennaToggle = !this.antennaToggle
      this.$emit('antCMD', this.antennaToggle)
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
    background-color: white;
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
  .active {
    background-color: #76FF03 !important;
  }
  .noShowGraph {
    z-index: -1 !important;
  }
</style>