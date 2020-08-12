<template>
  <div id="batt-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: ['battGraphObject'],
    mounted () {
    },
    watch: {
        battGraphObject(newVal) {
            this.addTrace(newVal.x, newVal.y, newVal.y2)
        }
    },
    data() {
    return {
      altitude: Number,
      currentDevice: '',
      throttleCount: 0,
      timer: Number,
      counter: 0,
      count: 0,
      chart: {
        uuid: "123",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'Battery vs Time(s)',
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
              text: 'Battery Monitor',
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
          },
        }
      }
    }
    },
    methods: {
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
            'batt-graph',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
    } 
  }
</script>

<style scoped>
  #batt-graph{
    position: absolute;
    display: inline;
    top: 33%;
    left: 51%;
    width: 45%;
    height: 29%;
  }
</style>