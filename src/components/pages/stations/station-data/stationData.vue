<template>
    <div id="app">
        <Loader v-if="show"></loader>
        <NavBar :station="station" @showFeed="toggleFeed"/>
        <div id="main">
          <mqttReceiver 
            @rawMessage="passRawMsg" 
            @statMessage="passStatMsg"
            @queryReadyMain="showLoader"
            :connectReq="connectReq" 
            :disconnectReq="disconnectReq"
            :balloonToTrack="balloonToTrack"
            :station="station"
            :getData="getData"
            :queryDeviceId="queryDeviceId"
            />
            <infoPanel 
              :balloonToTrack="balloonToTrack" 
              :balloonInfoMessage="balloonInfoMessage" 
              :stationTrackingInfoMessage="stationTrackingInfoMessage"
            />
          <feed
            v-show="feed" 
            :balloonInfoMessage="balloonInfoMessage" 
            :stationTrackingInfoMessage="stationTrackingInfoMessage"
          />
        </div>
    </div>
</template>

<script>
import mqttReceiver from './mqttReceiver'
import NavBar from './navbarStation'
import Loader from '../../loader'
import infoPanel from './info-cards/infoPanel'
import feed from './feed'
import gql from 'graphql-tag';


export default {
  components: {
    mqttReceiver,
    NavBar,
    Loader,
    infoPanel,
    feed

  },
  data () {
    return {
      show: false,
      id: '',
      station: '',
      connectReq: false,
      disconnectReq: false,
      balloonInfoMessage: '',
      stationTrackingInfoMessage: '',
      balloonToTrack: '',
      feed: false,
      lastBalloonTime: undefined,
      getData: false,
      queryDeviceId: undefined
    }
  },
  watch: {
    lastBalloonTime (newVal) {
      if (newVal !== null || newVal !== undefined) {
        this.queryDeviceId = newVal[0].device_id
        const lastMessageDate = new Date(newVal[0].data_time)
        const today = new Date()

      if(lastMessageDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
        this.getData = true
      }
      }
    }
  },
  mounted () {
    this.station = this.$route.params.id
    this.$apollo.query({
      query: gql `query lastBalloonTime($station: String!) {
        device_data_aggregate(limit: 1, where: {station_id: {_eq: $station}}, order_by: {data_time: desc}) {
          nodes {
            data_time
            device_id
          }
        }
      }`,
      variables: { station: this.station }
    }).then( response => {
      this.lastBalloonTime = response.data.device_data_aggregate.nodes
    })
  },
  methods: {
    passRawMsg (newVal) {
      this.balloonInfoMessage = newVal
    },
    passStatMsg (newVal) {
      this.stationTrackingInfoMessage = newVal
      this.getBalloonToTrack()

    },
    getBalloonToTrack() {
      const messageOBJ = JSON.parse(this.stationTrackingInfoMessage)
      const balloon = messageOBJ.tracker.track['id']
      // currently tracking first balloon in current_tracks
      this.balloonToTrack = balloon
      if (this.balloonToTrack === null || this.balloonToTrack === undefined) {
        this.show = false
      }
    },
    toggleFeed (data) {
      this.feed = data 
    },
    showLoader (data) {
      if (data === true) {
        this.show = false
      }
    }
  }
};
</script>

<style scoped>
  #v-content{
    padding: 0px;
  }
  #app{
    margin: 0 !important;
  }
  #main{
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  #wraps {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 20vh;
  }
  #data-wrap {
    display: flex;
    margin-top: 1.5em;
    flex-direction: column;
    width: 70vw;
  }
  #data-wrap-2 {
    display: flex;
    margin-top: 1.5em;
    flex-direction: column;
    flex: 1;
  }
  .v-data-table th{
    font-size: 0.7rem !important;
  }
  @media only screen and (max-width: 1280px) and (max-height: 720px){
    #wraps {
      bottom: -7%;
    }
  }
</style>
