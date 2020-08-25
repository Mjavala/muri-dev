<template>
    <div id="wrap">
        <v-btn small light id="pause-button" @click="changePauseState">pause</v-btn>
        <pre id="feed">
        </pre>
    </div>
</template>

<script>
export default {
    data(){
        return {
            messageMain: '',
            paused: false
        }
    },
    props: [
        'balloonInfoMessage', 'stationTrackingInfoMessage'
    ],
    watch: {
        balloonInfoMessage(newVal){
            if( this.paused === false){
                this.messageMain = newVal
                this.addToFeed()
            }
        },
        stationTrackingInfoMessage (newVal){
            if( this.paused === false){
                this.messageMain = newVal
                this.addToFeedStat()
            }
        }
    },
    methods: {
        addToFeed(){
            let feed = document.getElementById('feed')
            const message = JSON.parse(this.messageMain)
            feed.innerHTML = 'muri/raw' + ' ' +  JSON.stringify(message, undefined, 4) ;
        },
        addToFeedStat () {
            let feed = document.getElementById('feed');
            const message = JSON.parse(this.messageMain)
            feed.innerHTML = 'muri/stat' + ' ' +  JSON.stringify(message, undefined, 4)
        },
        changePauseState (){
            this.paused = !this.paused
        }
    }
}
</script>

<style scoped>
    #wrap{
        position: fixed;
        top: 8%;
        right: 0;
        width: 20vw;
        height: 100vh;
        border-radius: 5px;
        border-width: 1px;
        z-index: 100;
        background-color: white;
        overflow-y: scroll;
        overflow-x: scroll;
    }
    #feed {
        font-size: 0.7em;
        padding-top: 0.5em;
    }
  /* mobile styles */
  @media only screen and (max-width: 600px){
    #wrap {
        top: 10%;
        left: 0;
        z-index: 1000000;
        width: 100vw;
    }
    #pause-button {
        font-size: 0.6em;
    }
  }
</style>>
