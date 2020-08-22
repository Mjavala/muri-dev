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
            <HR />

            <B>Quick Links:</B><BR /><LI><B>BARN 1: </B><A HREF="muri_live/#/muri/station/data&BARN1">Station Data</A> | <A HREF="muri_live/#/muri/station/diagnostics&BARN1">Station Diagnostics</A></LI>

            <p><B>Recent Data Summary Links: (Not auto-generated)</B><BR /></p>
                <LI><A HREF="/muri_live/#/muri/historical&2020-08-18%20xbee_0013A20041B48697&BARN1">COLORADO - 08/18/2020 - BARN1</A></LI>
                <LI><A HREF="https://irisslive.net/muri_live/#/muri/historical&2020-08-11%20xbee_0013A20041B48697&BARN1">COLORADO - 08/11/2020 - BARN1</A></LI>
                <LI><A HREF="https://irisslive.net/muri_live/#/muri/historical&2020-08-07%20xbee_0013A20041B48675&BARN1">COLORADO - 08/7/2020 - BARN1</A></LI>
                <LI><A HREF="https://irisslive.net/muri_live/#/muri/historical&2020-08-04%20xbee_0013A20041B84784&BARN1">COLORADO - 08/4/2020 - BARN1</A></LI>
                <LI><A HREF="https://irisslive.net/muri_live/#/muri/historical&2020-07-28%20xbee_0013A20041B47D7E&BARN1">COLORADO - 07/28/2020 - BARN1</A></LI>
                <LI><A HREF="https://irisslive.net/muri_live/#/muri/historical&2020-07-21%20xbee_0013A20041B847AB&BARN1">COLORADO - 07/21/2020 - BARN1</A></LI>

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
    .hyflits {
        margin: 0.5em;
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