<template>
  <div id="volt-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
  // voltage --> azm need to rename
    props: [ 
      'filteredAzimuthVoltage', 'filteredElVoltage'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'volt-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredAzimuthVoltage(newVal){
        if (this.statMessageCount === 0) {
          this.statMessageCount = this.statMessageCount + 1
        }
        let objKey = Object.keys(newVal)
        this.currentDevice = objKey[0]
        let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
        this.az = objKeyMap[0]
        if (this.counter === 0 && this.statMessageCount === 1) {
          this.timer = new Date()
          this.addTrace(this.az, 'az_volt')
          this.counter = this.counter + 1
        } else {
          this.addData(this.az)
        }
      }
    },
    data() {
    return {
      az: Number,
      elv: Number,
      currentDevice: '',
      currentDevice1: '',
      timer: Number,
      counter: 0,
      counter1: 0,
      statMessageCount: 0,
      statMessageCount1: 0,
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
          'volt-graph',
          update, 
          [0],  // only 1 station
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
      addDataElv (point) {
        const update = {
          x: [[new Date()]],
          y: [[point]]
        }
        Plotly.extendTraces(
          'volt-graph',
          update, 
          [1],  // repeating yourself cuz you suuuuuuuuck ~ deadlineisbelikedeadlinedo ~
        )
      },
      addTrace (point, name) {
        if (this.chart.traces.length === 1) {
          const traceObj = {
              y: [point],
              x: [new Date()],
              type: 'scattergl',
              mode: 'lines',
              connectgaps: true,
              name: name,
              yaxis: "y2"
          }
          this.chart.traces.push(traceObj)
        } else {
          const traceObj = {
              y: [point],
              x: [new Date()],
              type: 'scattergl',
              mode: 'lines',
              connectgaps: true,
              name: name
          }
          this.chart.traces.push(traceObj)
        }
      },
    }
  }
</script>

<style scoped>
  #volt-graph{
    display: inline;
    position: absolute;
    top: 70.5%;
    left: 51%;
    width: 45%;
    height: 35%;
    z-index: 10;
  }
</style>