<template>
    <div id="wrap">
        <v-btn @click="changePauseState">pause</v-btn>
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
         'stationTrackingInfoMessage'
    ],
    watch: {
        stationTrackingInfoMessage (newVal){
            if( this.paused === false){
                this.messageMain = newVal
                this.addToFeedStat()
            }
        }
    },
    methods: {
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

</style>>
