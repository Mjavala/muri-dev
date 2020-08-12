<template>
  <div id="temp-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: [
      'filteredTemp', 'historicalTemp'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'temp-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredTemp(newVal){
        let objKey = Object.keys(newVal)
        this.currentDevice = objKey[0]
        let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
        let temp = objKeyMap[0]
        this.temp = temp
        this.extendTrace(this.temp)
      },
      historicalTemp (newVal) {
        this.addTrace(newVal.x, newVal.y)
        this.historicalQueryDoneCheck++
        this.timer = new Date() // start 30 min live clock
      }
    },
    data() {
    return {
      temp: Number,
      currentDevice: '',
      historicalQueryDoneCheck: 0,
      timer: undefined,
      count: 0,
      counter: 0,
      chart: {
        uuid: "12345",
        traces: [],
        layout: {
          showlegend: false,
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'Temp vs Time',
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
          xaxis: {
            tickmode: 'auto',
            gridcolor: '#bdbdbd',
            gridwidth: 1,
            showline:  true,
            zeroline: false,
            rangemode: 'tozero',
            tickfont:{
              size: 8
            }
          },
          yaxis: {
            title: 'Temp (C)',
            showline:  true,
            zeroline: false,
            rangemode: 'tozero',
            titlefont: {
              size: 10
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
      extendTrace (temp) {
        const update = {
          x: [[new Date()]],
          y: [[temp]]
        }
        Plotly.extendTraces(
          'temp-graph',
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
            'temp-graph',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
    } 
  }
</script>

<style scoped>
  #temp-graph{
    display: inline;
    position: absolute;
    top: 0;
    left: 69%;
    width: 30%;
    height: 40%;
    z-index: 10;
  } 
</style>