<template>
  <div id="altitude-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: ['filteredAltitude', 'historicalAltitude'],
    mounted () {
      // let resp = {responsive: true}
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'altitude-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredAltitude(newVal){
        // Extend trace and data only after the historical data has been loaded on
          let objKey = Object.keys(newVal)
          this.currentDevice = objKey[0]
          let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
          let altitude = objKeyMap[0] / 1000
          this.altitude = altitude
          if (this.chart.traces.length === 0) {
            const date = new Date()
            const updateTime = date.toLocaleString('en-US', { timeZone: 'America/Denver' })
            const parsedUpdateTime = new Date(updateTime)
            this.addTrace([parsedUpdateTime], [this.altitude])
          }
          if (this.chart.traces.length > 0) {
            this.extendTrace(this.altitude)
          }
      },
      historicalAltitude (newVal) {
        this.addTrace(newVal.x, newVal.y)
        this.historicalQueryDoneCheck++
        this.timer = new Date() // start 30 min live clock
      }
    },
    data() {
    return {
      altitude: Number,
      currentDevice: '',
      throttleCount: 0,
      historicalQueryDoneCheck: 0,
      timer: undefined,
      counter: 0,
      count: 0,
      chart: {
        uuid: "123",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'Altitude vs Time(s)',
            font: {
              size: 11
            }
          },
          margin: {
            t: 17.5,
            b: 25,
            r: 20,
            l: 35
          },
          showlegend: false,
          xaxis: {
            tickmode: 'auto',
            gridcolor: '#bdbdbd',
            rangemode: 'tozero',
            showline:  true,
            zeroline: false,
            titlefont: {
              size: 10
            },
            tickfont:{
              size: 8
            }
          },
          yaxis: {
            title: {
              text: 'Altitude (m)',
              standoff: 20
            },
            zeroline: false,
            showline:  true,
            rangemode: 'tozero',
            titlefont: {
              size: 9
            },
            tickfont:{
              size: 8
            },
            gridwidth: 1,
            gridcolor: '#bdbdbd',
          }
        }
      }
    }
    },
    methods: {
      extendTrace (altitude) {
        const date = new Date()
        const updateTime = date.toLocaleString('en-US', { timeZone: 'America/Denver' })
        const parsedUpdateTime = new Date(updateTime)
        const update = {
          x: [[parsedUpdateTime]],
          y: [[altitude]]
        }
        Plotly.extendTraces(
          'altitude-graph',
          update,
          [0],
        )
        const newTime = new Date()
        const delta =  (newTime - this.timer) / 1000
        if (delta >= 1800) {
          // 30 minute timeframe reached, need to remove first element of array as new one gets added
          this.chart.traces[0].y.shift()
          this.chart.traces[0].x.shift()
        }
      },
      addTrace (x, y) {
        const traceObj = {
            y: y,
            x: x,
            type: 'scattergl',
            mode: 'lines',
            connectgaps: true,
        }
        this.chart.traces.push(traceObj)
        let config = {displayModeBar: false, responsive: true}
        Plotly.react(
            'altitude-graph',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
    }
  }
</script>

<style scoped>
  #altitude-graph{
    display: inline;
    position: absolute;
    top: 0;
    left: 39%;
    width: 30%;
    height: 40%;
    z-index: 100;
  }
  /* mobile styles */
  @media only screen and (max-width: 600px){
    #altitude-graph{
      display: inline;
      position: absolute;
      top: 150%;
      padding: 1em;
      width: 90vw;
      height: 60%;
      z-index: 100;
    }
  }
</style>