<template>
    <div>
        <Loader v-if="show"></loader>
        <NavBar 
          :station="station" 
          @antCMD="passAntToggle"
          @showFeed="toggleFeed"
        />
        <div id="main">
          <mqttReceiver 
            @rawMessage="passSawMsg" 
            @statMessage="passStatMsg"
            :connectReq="connectReq" 
            :disconnectReq="disconnectReq" 
            :station="station"
            :antToggle="antToggle"
          />
          <infoPanel id="panel-wrap"
            :balloonToTrack="balloonToTrack"
            :stationTrackingInfoMessage="stationTrackingInfoMessage"
            :balloonInfoMessage="balloonInfoMessage"
          />
        </div>
        <feed v-show="feed" :stationTrackingInfoMessage="stationTrackingInfoMessage" />
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
      antToggle: false,
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
    showToggle () {
      setTimeout(() => {
        this.show = false
      }, 1500)
    },
    toggleFeed (data) {
      this.feed = data 
    },
    passSawMsg (newVal) {
      this.balloonInfoMessage = newVal
    },
    passStatMsg (newVal) {
      this.stationTrackingInfoMessage = newVal
      this.getBalloonToTrack()

    },
    getBalloonToTrack() {
      const messageOBJ = JSON.parse(this.stationTrackingInfoMessage)
      const balloon = Object.keys(messageOBJ.current_tracks)
      // currently tracking first balloon in current_tracks
      this.balloonToTrack = balloon[0]
    },
    passAntToggle (newVal){
      this.antToggle = newVal
    }
  }
};
</script>

<style scoped>

  #app{
    margin: 0 !important;
  }
  #main {
    height: 100vh;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
  }
  #data-wrap {
    display: flex;
    margin-top: 1.5em;
  }
  #tracking-info {
      width: 100% !important;
  }
  #station-tracking-info {
    margin-top: 4em;
  }
  #balloon-info{
    padding: 0.5em;
    padding-bottom: 0;
  }
  #mqtt-stats-2{
    width: 40%;
  }
  .spacing {
    padding: 0.25em;
  }
  .spacing-2 {
      position: absolute;
      left: 0;
      width: 15em;
  }
  #info-wrap {
    display: flex;
  }
  #positional-info-2 {
    width: 50%;
  }
  #panel-wrap{
    display: flex;
    width: 100vw;
    height: 25vh;
    margin: 0 1em;
    margin-bottom: 0.75em;
  }
</style>
