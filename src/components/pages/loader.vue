<template>
    <div id="loader">
        <svg class="loader" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle class="external-circle" cx="60" cy="60" r="50"></circle>
          <circle class="internal-circle" cx="60" cy="60" r="30"></circle>
        </svg>
        <div id="load-info" v-show="loadingDbData">
          Loading Data From Latest Flight
        </div>
    </div>
</template>

<script>
export default {
  props: ['loaderState'],
  watch: {
    loaderState (newVal) {
      this.loadingDbData = newVal
    }
  },
  data () {
    return {
      loadingDbData: undefined
    }
  }
  
}
</script>

<style>
  #loader {
      background-color: white;
      display: flex;
      justify-content: center;
      height: 105vh;
      align-items: center;
      flex-direction: column;
      z-index: 9990999;
  }
  .loader {
    width: 120px;
    height: 120px;
    transform: rotate(90deg);
    stroke-linecap: round;
    stroke-width: 2.5;
    fill: none !important;
  }
  .fade-out-click{
      margin: 0 10% 10% 0;
  }
  #load-info {
    padding: 2em;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #667db6;
    font-size: 1.35em;
  }
  .internal-circle,
  .external-circle {
    stroke: #667db6;
    stroke-dashoffset: 0;
    transform-origin: center;
  }
  .internal-circle {
    stroke-dasharray: 187;
    animation: internal 3s ease-in-out infinite;
    opacity: .5;
  }
  
  .external-circle {
    stroke-dasharray: 312;
    animation: external 5s linear infinite;
  }
  .external-circle-active{ 
    stroke: transparent;
    transform-origin: center;
    animation: leave .35s linear 1 forwards;
  }
  .external-loader-active{
    background-color: #2234ae;
    background-image: linear-gradient(315deg,#020299, 33%, #ff0066 66%);
    border-radius: 50%;
    filter: blur(1.5px);
    animation: animate 1s linear 1 forwards, pulse 1s 1 forwards;
    
  }
  @keyframes animate {
      0% {
          transform: rotate(0deg);
      }
      100% {
        transform: rotate(270deg);
      }
  }
  @keyframes pulse {
    0% {
        opacity: .7;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 0;
    }
  }
  @keyframes leave {
    0% {
        opacity: .1;
    }
    100% {
        opacity: 1;
    }
  }
@keyframes internal {
  0% {
    stroke-dashoffset: 0;
  }
  35% {
    stroke-dashoffset: -70;
  }
  100% {
    stroke-dashoffset: -187;
    transform: rotate(1440deg);
  }
}
@keyframes external {
  0% {
    stroke-dashoffset: 312;
  }
  60% {
    stroke-dashoffset: 100;
    
  }
  100% {
    stroke-dashoffset: -312;
    transform: rotate(1800deg);
  }
}
</style>