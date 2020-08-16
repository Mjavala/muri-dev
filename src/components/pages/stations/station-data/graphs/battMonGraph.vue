<template>
  <div id="battery-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: [ 
      'filteredBatteryMonitor', 'filteredVentBattery','historicalBattery'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'battery-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredBatteryMonitor(newVal){
        if (this.historicalQueryDoneCheck > 0) {
          let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
          this.batt = objKeyMap[0]
          this.addData(this.batt, 0)
        }
      },
      filteredVentBattery(newVal){
        if (this.historicalQueryDoneCheck > 0) {
          let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
          this.vbatt = objKeyMap[0]
          this.addData(this.vbatt, 1)
        }
      },
      historicalBattery (newVal) {
        this.addTrace(newVal.x, newVal.y, newVal.y2)
        this.historicalQueryDoneCheck++
        this.timer = new Date() // start 30 min live clock
      }
    },
    data() {
    return {
      batt: Number,
      vbatt: Number,
      timer: undefined,
      counter: 0,
      counter1: 0,
      statMessageCount: 0,
      statMessageCount1: 0,
      chart: {
        uuid: "1233",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'Battery Monitor',
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
            title: 'Batt Mon',
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
          'battery-graph',
          update, 
          [trace],
        )
        const newTime = new Date()
        const delta =  (newTime - this.timer) / 1000
        if (delta >= 1800) {
          // 30 minute timeframe reached, need to remove first element of array as new one gets added
          this.chart.traces[0].y.shift()
          this.chart.traces[0].x.shift()
          this.chart.traces[1].y.shift()
          this.chart.traces[1].x.shift()
        }
      },
      addTrace (x, y, y2) {
        let traceObj = {
            y: y,
            x: x,
            type: 'scattergl',
            mode: 'lines',
            connectgaps: true,
            name: 'batt_mon'
        }
        this.chart.traces.push(traceObj)
        traceObj = {
            y: y2,
            x: x,
            type: 'scattergl',
            mode: 'lines',
            connectgaps: true,
            name: "vent_batt"
        }
        this.chart.traces.push(traceObj)
        let config = {displayModeBar: false, responsive: true}
        Plotly.react(
            'battery-graph',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
    }
  }
</script>

<style scoped>
  #battery-graph{
    display: inline;
    position: absolute;
    top: 40%;
    left: 69%;
    width: 30%;
    height: 40%;
    z-index: 10;
  }
  /* mobile styles */
  @media only screen and (max-width: 600px){
    #battery-graph{
      display: inline;
      position: absolute;
      top: 345%;
      padding: 1em;
      width: 90vw;
      height: 60%;
      z-index: 100;
    }
  }
</style>