<template>
  <div id="hw-graph">
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist/plotly'

export default {
    props: [
      'idList', 'filteredHwAvgs'
    ],
    mounted () {
      let config = {displayModeBar: false, responsive: true}
      Plotly.react(
        'hw-graph',
        this.chart.traces,
        this.chart.layout,
        config
      )
    },
    watch: {
      filteredHwAvgs(newVal){
          // need slightly different setup for bar chart
        let objKey = Object.keys(newVal)
        this.currentDevice = objKey[0]
        let objKeyMap = Object.keys(newVal).map((k) => newVal[k]);
        let hwAverages = objKeyMap[0]
        this.hw = hwAverages
      },
      idList(newVal, oldVal){
        if (newVal.length === oldVal.length){
          this.findTrace(newVal)
        }
        if (newVal.length > oldVal.length && newVal.length > 1){
          this.addTrace(this.hw)
          this.findTrace(newVal)
        }
        if (newVal.length === 1){
          // first device
          if (this.counter === 0) {
            this.timer = new Date()
            this.addTrace(this.hw)
            this.counter = this.counter + 1
          }
        }
      }
    },
    data() {
    return {
      hw: [],
      currentDevice: '',
      counter: 0,
      count: 0,
      chart: {
        uuid: "123",
        traces: [],
        layout: {
          plot_bgcolor: '#F5F5F5',
          title: {
            text: 'HW Spectral Averages',
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
            showline:  true,
            zeroline: false,
            gridwidth: 1,
            tickfont:{
              size: 8
            }
          },
          yaxis: {
            showline:  true,
            zeroline: false,
            type: 'log',
            autorange: true,
            gridwidth: 1,
            gridcolor: '#bdbdbd',
            tickfont: {
              size: 8
            }
          }
        }
      }
    }
    },
    methods: {
      addData (hw, traceIndex) {
        // only restyle if the data is different
        const update = {
          y: [hw],
        }
        Plotly.restyle(
          'hw-graph',
          update,
          [traceIndex]
        )
      },
      findTrace (deviceList) {
        for (const [i, id] of deviceList.entries()){
          if (id === this.currentDevice){
            this.addData(this.hw, i)
          }
        }
      },
      addTrace (hw) {
        const traceObj = {
            y: [hw],
            x: ['hw0', 'hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw6', 'hw7', 'hw8'],
            type: 'bar',
            name: this.currentDevice
        }
        this.chart.traces.push(traceObj)
        Plotly.react(
          'hw-graph',
          this.chart.traces,
          this.chart.layout
        )
      }
    } 
  }
</script>

<style scoped>
  #hw-graph{
    display: inline;
    position: absolute;
    top: 80%;
    left: 39%;
    width: 30%;
    height: 40%;
    z-index: 10;
  }
  @media only screen and (max-width: 600px){
    #hw-graph{
      display: inline;
      position: absolute;
      top: 475%;
      padding: 1em;
      width: 90vw;
      height: 60%;
      z-index: 100;
    }
  }
</style>