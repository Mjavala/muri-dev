<template>
  <div id="mqtt-wrap">
    <div id="wrapper">
      <filterID 
        :message='message' 
        :messageRaw="messageRaw"
        @addStation="passStationFunc"
      />
    </div>
  </div>
</template>

<script>
import filterID from './filterID'

export default {
  components: {
    filterID
  },
  watch: {
    /* ---------------- stale station watch logic --------------
      If a message hasn't been received from a given station in 15 minutes, the station will be removed from
      the master list. 
      - onMessageArrived (), stationsListAndLastMessageTimestamps () is called, which updates the stations watcher below
      - the watcher adds new stations to the list of stationTimeObj and updates the timestamp associated with each station
      - Every 15 minutes, checkStationMessageTimestamp (). Station is removed from array if timestamp is over 15 minutes.
    */
    stations(newVal, oldVal){
      // watcher for stale stations
      this.t1 = new Date()
      if (newVal.length === oldVal.length){
        this.updateStationLatestTimestamp()
      }
      if (newVal.length > oldVal.length && newVal.length > 1){
        this.$emit('stations', this.stations)
        this.listOfStationTimeObj.push(this.stationTimeObj)
        this.updateStationLatestTimestamp()
      }
      if (newVal.length === 1){
        // Custom event, from child component (mqttReceiver) to parent component (home)
        this.$emit('stations', this.stations)
        if (this.count === 0) {
          this.listOfStationTimeObj.push(this.stationTimeObj)
          this.count = this.count + 1
        }
      }
      // 900000 ms ~ 15 minutes
      if ((this.t1 - this.t0) > this.delta) {
        this.checkStationMessageTimestamp()
        this.t0 = new Date()
      }
    }
  },
  data () {
    return {
      message: '',
      messageRaw: '',
      live: false,
      clientID: "clientID-" + parseInt(Math.random() * 100),
      host: 'irisslive.net',
      port: 9001,
      username: 'muri',
      password: 'demo2020',
      stationList: new Set(),
      stations: [],
      t0: Number,
      delta: 900000, // 1 min for test
      stationTimeObj: {},
      listOfStationTimeObj: [],
      count: 0,
      currentStation: ''
    }
  },
  /* the mounted hook is called when the DOM elements are loaded on the page
    lifecycle hooks - https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks */
  mounted () {
    try {
      this.connect()
    } catch (e){
      console.log('!---Connect function failed ---!' + e)
    }
    this.t0 = new Date()
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
        this.live = true
        this.client.subscribe("muri/stat")
        this.client.subscribe("muri/raw")

        this.$emit('live', this.live)
    },
    onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("Disconnected: " + responseObject.errorMessage + "Error Code: " + responseObject.errorCode)
      }
      this.live = false
      this.$emit('live', this.live)
    },
    onMessageArrived(message) {
      if (message.destinationName === 'muri/stat') {
        this.message = message.payloadString
        this.stationsListAndLastMessageTimestamps(this.message)
      }
      if (message.destinationName === 'muri/raw'){
        // payloads may come in corrupted
        const check = this.checkMessagePurity(message.payloadString)
        if (check === false) {
          return
        }
        if (check === true) {
          this.messageRaw = message.payloadString
        }
      }
    },
    stationsListAndLastMessageTimestamps(message) {
      const messageOBJ = JSON.parse(message)
      this.currentStation = messageOBJ['station']

      const result = this.stationList.has(messageOBJ['station'])
      if (result) {
        // need to update stations object on every message so that the watcher hook above works
        this.stations = Array.from(this.stationList)
        return
      } else {
        this.stationList.add(messageOBJ['station'])
        this.stations = Array.from(this.stationList)

        this.stationTimeObj = {
          [messageOBJ['station']]: new Date()
        }
      }
    },
    checkMessagePurity (message) {
      const messageOBJ = JSON.parse(message)
      if (messageOBJ.data.frame_data === undefined || messageOBJ.data.frame_data === null){
        return false
      } else {
        return true
      }
    },
    updateStationLatestTimestamp () {
      for (const [i, id] of Object.entries(this.listOfStationTimeObj)) {
        let key = Object.keys(id)[0]
        if (key === this.currentStation){
          this.addData(i)
        }
      }
    },
    addData (i) {
      this.listOfStationTimeObj[i] = new Date()
    },
    checkStationMessageTimestamp() {
      this.listOfStationTimeObj.forEach(element => {

        var station = Object.keys(element)[0]
        const currentTimestamp = Object.keys(element).map((k) => element[k])

        const timeDelta = Date.parse(currentTimestamp) - this.t0
        if (timeDelta > this.delta) {
          this.stations.forEach((element, i) => {
            if (element === station){
                this.stations.splice(i, 1)
            }
          })
        }
      })
    },
    passStationFunc (station) {
      this.$emit('stationsFromMap', station)
    }
  }
}
</script>

<style>
  #mqtt-wrap {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
    position: relative;
  }
  #live-icon{
    animation: shadow-pulse 3s infinite;
    border-radius: 50%;
    background: #E3F2FD;  /* fallback for old browsers */
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
    #mqtt-wrap {
      margin-top: -0.75em;
    }
  }
</style>