<template>
  <div id="rssi-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: [ 
      'filteredRSSI', 'filteredRSSIStat', 'historicalRSSI'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'rssi-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredRSSI (newVal) {
        this.live === true
        if (this.historicalQueryDoneCheck > 0) {
          let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
          this.rssi = objKeyMap[0]
          this.addData(this.rssi, 1)
        }
      },
      filteredRSSIStat(newVal){
        if (this.historicalQueryDoneCheck > 0 && this.live === true) {
          let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
          this.rssiFiltered = objKeyMap[0]
          if (this.chart.traces.length > 0) {
            this.addData(this.rssiFiltered, 0)
          }
        }
      },
      historicalRSSI (newVal) {
        this.addTrace(newVal.x, newVal.y)
        this.historicalQueryDoneCheck++
        this.timer = new Date() // start 30 min live clock
      }
    },
    data() {
    return {
      rssiFiltered: Number,
      rssi: Number,
      timer: undefined,
      live: false,
      historicalQueryDoneCheck: 0,
      filteredRSSIHook: false,
      chart: {
        uuid: "1233",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'RSSI Graph',
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
            gridwidth: 1,
            tickfont:{
              size: 8
            }
          },
          yaxis: {
            zeroline: false,
            showline:  true,
            rangemode: 'tozero',
            title: 'RSSI',
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
      addData (point, trace) {
        const update = {
          x: [[new Date()]],
          y: [[point]]
        }
        Plotly.extendTraces(
          'rssi-graph',
          update, 
          [trace], 
        )
        const newTime = new Date()
        const delta =  (newTime - this.timer) / 1000
        if (delta >= 1800) {
          // 30 minute timeframe reached, need to remove first element of array as new one gets added
          this.chart.traces[0].y.shift()
          this.chart.traces[0].x.shift()
          this.filteredRSSIHook = true
        }
        if (trace === 1 && this.filteredRSSIHook === true) {
          this.chart.traces[1].y.shift()
          this.chart.traces[1].x.shift()
        }
      },
      addTrace (x, y) {
          const filteredRSSITrace = {
            y: y,
            x: x,
            type: 'scattergl',
            mode: 'lines',
            connectgaps: true,
            name: 'RSSI Filtered',
        }
        this.chart.traces.push(filteredRSSITrace)
        // Empty rssi obj, db currently only has rssi filtered values
        const RSSITrace = {
            y: [],
            x: [],
            type: 'scattergl',
            mode: 'lines',
            connectgaps: true,
            name: 'RSSI'
        }
        this.chart.traces.push(RSSITrace)
        let config = {displayModeBar: false, responsive: true}
        Plotly.react(
            'rssi-graph',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
    }
  }
</script>

<style scoped>
  #rssi-graph{
    display: inline;
    position: absolute;
    top: 40%;
    left: 39%;
    width: 30%;
    height: 40%;
    z-index: 10;
  }
  @media only screen and (max-width: 600px){
    #rssi-graph{
      display: inline;
      position: absolute;
      top: 215%;
      padding: 1em;
      width: 90vw;
      height: 60%;
      z-index: 100;
    }
  }
</style>