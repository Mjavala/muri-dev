<template>
  <div id="app">
    <div id="wrapper">
      <v-btn v-show="!$vuetify.breakpoint.xs" icon depressed rounded id="live" v-if="this.status">
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
      <filterID v-bind:message="this.message" :messageStat="messageStat" />
      <div v-if="antCmd" id="antenna-cmd">
        <div id="antenna-move-wrap">
          <v-text-field class="input" height:50 dense filled label='azimuth' rounded v-model="azm">
          </v-text-field>
          <v-text-field  class="input" dense filled label='elevation' rounded v-model="elv">
          </v-text-field>
          <v-btn small @click="sendAntennaMove">
            Move Antenna
          </v-btn>
          <v-btn small @click="stopAntennaMove">
            Stop
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filterID from './filterID'

export default {
  props:
  ['station', 'connectReq', 'disconnectReq', 'antToggle'],
  mounted () {
    try {
      this.connect()
    } catch {
      console.log('!---Connect function failed ---!')
    }
  },
  watch: {
    station (newVal) {
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
    antToggle (newVal){
      this.antCmd = newVal
    }
  },
  data () {
    return {
      message: '',
      messageStat: '',
      logs: [],
      status: false,
      stationFilter: '',
      clientID: "clientID-" + parseInt(Math.random() * 100),
      host: 'irisslive.net',
      port: 9001,
      username: 'muri',
      password: 'demo2020',
      antCmd: false,
      elv: '',
      azm: '',
      alt: '',
      rssi: '',
      last_range: ''
    }
  },
  components: {
    filterID
  },
  methods: {
    connect () {
      this.client = new window.Paho.Client(this.host, this.port, this.clientID)
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
        this.client.subscribe("muri_test/raw")
        this.client.subscribe("muri_test/stat")
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
      if (message.destinationName === 'muri_test/raw'){
        const check = this.checkMessagePurity(message.payloadString)
        if (check === false) {
          return
        }
        if (check === true) {
          const messageOBJ = JSON.parse(message.payloadString)
          if (messageOBJ['station'] === this.stationFilter){
            this.alt = (messageOBJ.data.frame_data['gps_alt'] / 1000000).toFixed(2)
            this.rssi = messageOBJ.data['RSSI_RX']
            this.message = message.payloadString
            this.$emit('rawMessage', this.message)
          }
        }
      }
      if (message.destinationName === 'muri_test/stat'){
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
    sendAntennaMove () {
      const data = {
          'from': "webpage", 
          'command': "MOVE", 
          'azm': parseInt(this.azm),
          'elv': parseInt(this.elv)
      }
      const jsonMessage = JSON.stringify(data)
      let message = new window.Paho.Message(jsonMessage);
      message.destinationName = `muri/${this.stationFilter}`;
      //console.log(message.destinationName)
      this.client.send(message);
    },
    stopAntennaMove () {
      const data = {
          'from': "webpage", 
          'command': "STOP", 
          'azm': 1,
          'elv': 1
      }
      const jsonMessage = JSON.stringify(data)
      let message = new window.Paho.Message(jsonMessage);
      message.destinationName = `muri/${this.stationFilter}`;
      //console.log(message.destinationName)
      this.client.send(message);
      return
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
    position: relative;
  }
  #wrapper{
    position: relative;
    height: 105%;
  }
  #antenna-cmd{
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
    height: 100vh;
    width: 25vw;
    background-color: white;
    border: 1px solid grey;
    z-index: 1000000;
  }
  #conFeedWrap{
    margin-top: 0.5%;
  }
  #live{
    position: absolute;
    top: -15%;
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
    font-size: 1.5em;
    font-weight: bolder;
    position: absolute;
    top: -2%;
    left: 0.5%;
  }
  .top-data-rssi {
    font-size: 1.5em;
    font-weight: bolder;
    position: absolute;
    top: -2%;
    left: 19.75%;
  }
  .top-data-last-range {
    font-size: 1.5em;
    font-weight: bolder;
    position: absolute;
    top: -2%;
    left: 28%;
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
      top: -6em;
      left: 0;
      font-size: 0.8em;
      padding: 0.5em;
    }
    .top-data-rssi  {
      position: absolute;
      top: -6em;
      left: 36.5%;
      font-size: 0.8em;
      padding: 0.5em;
    }
    .top-data-last-range  {
      position: absolute;
      top: -6em;
      left: 56.5%;
      font-size: 0.8em;
      padding: 0.5em;
    }
    #wrapper {
      margin: 0;
    }
  }
</style>