<template>
    <div id="app">
        <Loader v-if="show"></loader>
        <NavBar :station="station" @showFeed="toggleFeed"/>
        <div id="main">
          <mqttReceiver 
            @rawMessage="passRawMsg" 
            @statMessage="passStatMsg"
            :connectReq="connectReq" 
            :disconnectReq="disconnectReq"
            :balloonToTrack="balloonToTrack"
            :station="station"/>
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
      show: true,
      id: '',
      station: '',
      connectReq: false,
      disconnectReq: false,
      balloonInfoMessage: '',
      stationTrackingInfoMessage: '',
      balloonToTrack: '',
      feed: false
    }
  },
  watch: {
    id(newVal) {
      this.station = newVal
    }
  },
  created () {
    this.id = this.$route.params.id
  },
  mounted() {
    this.showToggle()
  },
  methods: {
    showToggle(){
      setTimeout(() => {
        this.show = false
      }, 1500)
    },
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
    },
    toggleFeed (data) {
      this.feed = data 
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
