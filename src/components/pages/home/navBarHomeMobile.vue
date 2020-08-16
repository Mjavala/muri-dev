<template>
    <div>
        <v-app-bar
        color="transparent"
        dark
        flat
        >
        <v-app-bar-nav-icon color="black" @click="drawer = true"></v-app-bar-nav-icon>
        <v-btn id="station-diagnostics" class="sm-font" light small v-if="showStationRedirect">
            <!-- router link - https://router.vuejs.org/api/ -->
            <router-link :to="{name: 'stationDiagnostics', params: { id: this.stationRedirect }}">
                Station Diagnostics
            </router-link>
        </v-btn>
        <v-btn  id="station-data" class="sm-font" light small v-if="showStationRedirect">
            <router-link :to="{name: 'station', params: { id: this.stationRedirect }}">
                Station Data
            </router-link>
        </v-btn>
        </v-app-bar>

        <v-navigation-drawer id="nav-mobile"
        v-model="drawer"
        absolute
        temporary
        width="200"
        >
            <v-btn  id="dgrs-logs" class="sm-font" light small>
                <!-- v-list-item - https://vuetifyjs.com/en/components/lists/ -->
                <a href="http://159.89.152.16/logs/" target="_blank">DGRS Log Files</a>
            </v-btn>
            <v-btn  id="station-data" class="sm-font" light small>
                <router-link to="/muri/historical" target="_blank">Historical Data</router-link>
            </v-btn>
            <v-btn  id="bts" class="sm-font" light small>
                <a href="https://irisslive.net/bts/bts_main.html" target="_blank">BTS (Trajectory Simulator)</a>
            </v-btn>
        </v-navigation-drawer>
    </div>
</template>

<script>
  export default {
    props: ['station'],
    watch: {
        station (newVal) {
            this.userSelectedStationReact(newVal)
        }
    },
    data: () => ({
      drawer: false,
      showStationRedirect: false
    }),
    methods: {
        userSelectedStationReact (station) {
        // redirect URL
        this.showStationRedirect = true
        this.stationRedirect = station
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
    }
</style>