<template>
  <div id="altitude-graph-hist">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: ['altitudeGraphObject'],
    mounted () {
    },
    watch: {
        altitudeGraphObject(newVal) {
            this.addTrace(newVal.x, newVal.y)
        }
    },
    data() {
    return {
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
            //tickmode: 'auto',
            gridcolor: '#bdbdbd',
            //rangemode: 'tozero',
            //showline:  true,
            //zeroline: false,
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
            'altitude-graph-hist',
            this.chart.traces,
            this.chart.layout,
            config
        )
      }
      
    } 
  }
</script>

<style scoped>
  #altitude-graph-hist{
      padding: 2em;
      margin-top: 1em;
      margin-right: 3.5em;
      width: 75vw;
      height: 35vh;
  }
</style>