<template>
  <div id="bytes-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
  // voltage --> azm need to rename
    props: [ 
      'filteredAvgByteSec'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'bytes-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredAvgByteSec(newVal){
        if (this.statMessageCount === 0) {
          this.statMessageCount = this.statMessageCount + 1
        }
        let objKey = Object.keys(newVal)
        this.currentDevice = objKey[0]
        let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
        this.bytes = objKeyMap[0]
        if (this.counter === 0 && this.statMessageCount === 1) {
          this.timer = new Date()
          this.addTrace(this.bytes, 'bytes')
          this.counter = this.counter + 1
        } else {
          this.addData(this.bytes)
        }
      }
    },
    data() {
    return {
      bytes: Number,
      currentDevice: '',
      timer: Number,
      counter: 0,
      filteredRSSIHook: false,
      statMessageCount: 0,
      chart: {
        uuid: "12323",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'Average Bytes Per Second',
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
            title: {
              standoff: 0
            },
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
      addData (point) {
        const update = {
          x: [[new Date()]],
          y: [[point]]
        }
        Plotly.extendTraces(
          'bytes-graph',
          update, 
          [0]
        )
        const newTime = new Date()
        const delta =  (newTime - this.timer) / 1000
        if (delta >= 1800) {
          // 30 minute timeframe reached
          this.chart.traces[0].y.shift()
          this.chart.traces[0].x.shift()
        }
      },
      addTrace (point, name) {
        const traceObj = {
          y: [point],
          x: [new Date()],
          type: 'scattergl',
          mode: 'lines',
          connectgaps: true,
          name: name,
        }
        this.chart.traces.push(traceObj)
      },
    }
  }
</script>

<style scoped>
  #bytes-graph{
    display: inline;
    position: absolute;
    top: 69.5%;
    left: 51%;
    width: 45%;
    height: 35%;
    z-index: 10;
  }
</style>