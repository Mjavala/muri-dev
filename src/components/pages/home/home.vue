<template>
    <v-app>
    <div id="home-wrap">
        <navbar :station="station" :live="live"/>
        <!--    @stations, @live, @stationsFromMap are all events emitted from child components
            https://vuejs.org/v2/guide/components-custom-events.html    -->
        <mqttReceiver 
            @stations="newStationListFunc" 
            @live="mqttConnected"
            @stationsFromMap="StationClickedFromMap"
        />
        <div id="stations-dropdown">
            <!-- https://vuetifyjs.com/en/components/selects/ -->
            <v-select
                :items="items"
                label="Available Stations"
                filled
                v-model="station"
            ></v-select>
        </div>
    </div>
    </v-app>
</template>

<script>
import navbar from './navbarHome'
import mqttReceiver from './mqttReceiver'

export default {
    // child components imported, exported, and used in the html template above
    components: {
        navbar, 
        mqttReceiver
    },
    /*  Watches a given data object for changes, can also capture the old value like so 
        newStationList(newVal, oldVal) {... logic with both values ...} 
        https://vuejs.org/v2/guide/computed.html#Watchers   */
    watch: {
        newStationList(newVal) {
            this.items = newVal
        }
    },
    // regular javascript methods
    methods: {
        newStationListFunc(data){
            this.newStationList = data
        },
        mqttConnected(data) {
            this.live = data
        },
        StationClickedFromMap(station){
            this.station = station
        }
    },
    /*  reactive data properties defined for a given component
        https://vuejs.org/v2/guide/instance.html    */
    data () {
        return {
            items: [],
            newStationList: [],
            station: '',
            live: false
        }
    }
}
</script>

<!-- Add scoped to limit CSS styling to this component -->
<style>
    a {
        color: inherit;
        text-decoration: none;
    }
    #home-wrap {
        position: relative;
    }
    #stations-dropdown {
        width: 20vw;
        position: absolute;
        top: 10%;
        right: 5%;
    }
    #station-button {
        position: absolute;
        top: 50%;
        left: 89%;
        z-index: 10000000;
    }
    #stations {
        z-index: 10;
    }
</style>