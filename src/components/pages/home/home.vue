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
            <p class="hidden-xs-only" id="instructions">Click a Station or Select from list, then pick Station Data to display 
                payload data from that receive station, or click Station Diagnostics to view Receive Station Information</p>
            <!-- https://vuetifyjs.com/en/components/selects/ -->
            <v-select
                :items="items"
                label="Available Stations"
                filled
                v-model="station"
            ></v-select>
            <p class="hidden-xs-only"><i>Note: simulation from today at 1400 will be displayed if available. </i></p>
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
        },
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
        height: 100vh;
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
    #instructions {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        font-size: 1em;
        font-weight: 600;
    }
    /* mobile styles */
    @media only screen and (max-width: 600px){
        #stations-dropdown {
            width: 50vw;
            top: 87.5%;
            z-index: 1000000;
        }
    }
</style>