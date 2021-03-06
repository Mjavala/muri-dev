<template>
  <div>
    <div id="wrapper">
      <v-btn icon depressed rounded id="live" v-if="this.status" v-show="!$vuetify.breakpoint.xs">
        <v-icon id="live-icon" color="#76FF03">mdi-wifi</v-icon>
      </v-btn>
      <div class="top-data">
        Balloon Alt: {{this.alt}} km
      </div>
      <div class="top-data-rssi">
        RSSI: {{this.rssi}}
      </div>
      <div class="top-data-last-range">
        Last Range: {{this.last_range}}
      </div>
      <histQuery 
        @queryReady="queryReadyToMainPage"
        v-bind:message="this.message" 
        :getDataQuery="getDataQuery"
        :messageStat="messageStat" 
        :balloonToTrack2="balloonToTrack2"
        :queryDevice="queryDevice"
        :stationFilter="stationFilter"
        />
    </div>
  </div>
</template>

<script>
import histQuery from './histQuery'

export default {
  props:
  ['station', 'connectReq', 'disconnectReq', 'balloonToTrack', 'getData', 'queryDeviceId', 'connectMQTT'],
  watch: {
    station(newVal) {
      this.stationFilter = newVal
    },
    connectReq (newVal) {
      if (newVal === true) {
        this.connect()
      }
    },
    disconnectReq (newVal) {
      if (newVal === true) {
        this.disconnect()
      }
    },
    balloonToTrack (newVal) {
      this.balloonToTrack2 = newVal
    },
    getData (newVal) {
      if (newVal === true) {
        this.getDataQuery = true
      }
    },
    queryDeviceId (newVal) {
      this.queryDevice = newVal
    },
    connectMQTT (newVal) {
      if (newVal === true && this.connectCount === 0) {
        try {
          this.connect()
          this.connectCount++
        } catch {
          console.log('!---Connect function failed ---!')
        }
      }
    }
  },
  data () {
    return {
      message: '',
      messageStat: '',
      balloonToTrack2: '',
      alt: '',
      rssi: '',
      last_range: '',
      logs: [],
      status: false,
      stationFilter: '',
      clientID: "clientID-" + parseInt(Math.random() * 100),
      host: 'irisslive.net',
      port: 9001,
      username: 'muri',
      password: 'demo2020',
      getDataQuery: false,
      queryDevice: undefined,
      connectCount: 0
      
    }
  },
  components: {
    histQuery
  },
  methods: {
    connect () {
      this.client = new window.Paho.Client(this.host, this.port, this.clientID);
      this.client.connect({      
        onSuccess: this.onConnect,
        useSSL: true, 
        cleanSession: false,
        userName : this.username,
        password : this.password,
        keepAliveInterval: 15,
        reconnect : true
        }
      );
      this.client.onMessageArrived = this.onMessageArrived;
      this.client.onConnectionLost = this.onConnectionLost
      this.client.onConnect = this.onConnect
    },
    onConnect(){
        // Once a connection has been made, make a subscription and send a message.
        console.log("Connected");
        this.status = true
        this.client.subscribe("muri/stat")
        this.client.subscribe("muri/raw")
        console.log('subscribed to muri/raw')
        console.log('subscribed to muri/stat')
    },
    onConnectionLost(responseObject) {
      console.log('disconnected')
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorCode)
        console.log("onConnectionLost:"+responseObject.errorMessage)
      }
      this.status = false
    },
    disconnect(){
      this.client.disconnect()
      this.status = false
    },
    onMessageArrived(message) {
      if (message.destinationName === 'muri/raw'){
        const check = this.checkMessagePurity(message.payloadString)
        if (check === false) {
          return
        }
        if (check === true) {
          const messageOBJ = JSON.parse(message.payloadString)
          if (messageOBJ.data['ADDR_FROM'] == this.balloonToTrack2) {
            this.alt = (messageOBJ.data.frame_data['gps_alt'] / 1000000).toFixed(2)
            this.rssi = messageOBJ.data['RSSI_RX']
          }
          if (messageOBJ['station'] === this.stationFilter){
            this.message = message.payloadString
            this.$emit('rawMessage', this.message)
          }
        }
      }
      if (message.destinationName === 'muri/stat'){
        const messageOBJ = JSON.parse(message.payloadString)
        if (messageOBJ['station'] === this.stationFilter){
          this.last_range = (messageOBJ.tracker.track['last_range']).toFixed(2)
          this.messageStat = message.payloadString
          this.$emit('statMessage', this.messageStat)
        }
      }
    },
    checkMessagePurity(message) {
      const messageOBJ = JSON.parse(message)
      if (messageOBJ.data.frame_data === undefined){
        return false
      } else {
        return true
      }
    },
    queryReadyToMainPage (data) {
      if (data === true) {
        this.$emit('queryReadyMain', true)
        setTimeout(() => {
          try {
            this.connect()
          } catch {
            console.log('!---Connect function failed ---!')
          }
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
  #wrapper {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
    position: relative;
    height: 105%;
    margin: 2em 0;
  }
  #conFeedWrap{
    margin-top: 0.5%;
  }
  #live{
    position: absolute;
    top: -16%;
    left: 18em;
    z-index: 1001;
    background: transparent;
  }
  #live-icon{
    animation: shadow-pulse 3s infinite;
    border-radius: 50%;
    background: #E3F2FD;  /* fallback for old browsers */
  }
  #disconnect {
    z-index: 11;
  }
  .top-data {
    font-size: 1.35em;
    font-weight: bolder;
    position: absolute;
    top: -3%;
    left: 0.5%;
  }
  .top-data-rssi {
    font-size: 1.35em;
    font-weight: bolder;
    position: absolute;
    top: -3%;
    left: 16.5%;
  }
  .top-data-last-range {
    font-size: 1.35em;
    font-weight: bolder;
    position: absolute;
    top: -3%;
    left: 24%;
  }
  @keyframes shadow-pulse
  {
    0% {
      box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
    }
  }
  /* mobile styles */
  @media only screen and (max-width: 600px){
    .top-data  {
      position: absolute;
      top: -18em;
      left: 0;
      font-size: 0.8em;
      padding: 0.5em;
    }
    .top-data-rssi  {
      position: absolute;
      top: -18em;
      left: 36.5%;
      font-size: 0.8em;
      padding: 0.5em;
    }
    .top-data-last-range  {
      position: absolute;
      top: -18em;
      left: 56.5%;
      font-size: 0.8em;
      padding: 0.5em;
    }
    #wrapper {
      margin: 0;
    }
  }
</style>