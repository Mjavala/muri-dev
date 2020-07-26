<template>
  <div id="temp-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: ['tempGraphObject'],
    mounted () {
    },
    watch: {
        tempGraphObject(newVal) {
            this.addTrace(newVal.x, newVal.y)
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
            text: 'Temp vs Time(s)',
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
              text: 'Temp (°C)',
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
      padding: 2em;
      margin-top: 1em;
      margin-right: 3.5em;
      width: 75vw;
      height: 35vh;
  }
</style>