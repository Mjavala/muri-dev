<template>
    <div>
        <v-app-bar color="#fff" flat >
        <v-btn class="sm-font" light small>
            <router-link to="/">Home</router-link>
        </v-btn>
        <v-btn id="station-diagnostics" class="sm-font" light small @click="routeToDiagnostics">
            Station Diagnostics
        </v-btn>
        <v-btn class="sm-font" light small @click="toggleFeed">
            Feed
        </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
  export default {
    props: ['station'],
    watch: {
    },
    data: () => ({
      showStationRedirect: false,
      showFeed: false
    }),
    methods: {
        routeToDiagnostics(){
            let routeData = this.$router.resolve({name: 'stationDiagnostics', params: {id: this.station}})
            window.open(routeData.href, '_blank')
        },
        toggleFeed(){
        this.showFeed = !this.showFeed
        this.$emit('showFeedMobile', this.showFeed)
        }
    }
  }
</script>

<style scoped>
    #nav-mobile {
        z-index: 10000;
    }
    .sm-font {
        font-size: 0.6em !important;
        margin: 1em 0.5em !important;
        display: block;
    }
</style>