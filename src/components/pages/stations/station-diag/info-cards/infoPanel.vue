<template>
    <div id="data-wrapper">
        <div class="balloon-gps-wrap">
            <table class="tables">
                <tr>
                    <th>Tracking ID:</th>
                    <th>{{this.current_balloon}}</th>
                </tr>
                <tr>
                    <th>Lat:</th>
                    <td>{{this.lat}}</td>
                </tr>
                <tr>
                    <th>Lon:</th>
                    <td>{{this.lon}}</td>
                </tr>
                <tr>
                    <th>Altitude:</th>
                    <td>{{this.alt}}</td>
                </tr>
                <tr>
                    <th>Tow:</th>
                    <td>{{this.tow}} </td>
                </tr>
                <tr>
                    <th>Num Sats:</th>
                    <td>{{this.ns}} </td>
                </tr>
                <tr>
                    <th>Velocity (North):</th>
                    <td>{{this.velx}}</td>
                </tr>
                <tr>
                    <th>Velocity (East):</th>
                    <td>{{this.vely}}</td>
                </tr>
                <tr>
                    <th>Velocity (Down):</th>
                    <td>{{this.velz}}</td>
                </tr>
            </table>
        </div>
        <div class="ground-station-info">
            <table class="tables table2" style="width:100%">
                <tr>
                    <th>GPS Lat:</th>
                    <td>{{this.gps_lat}}</td>
                </tr>
                <tr>
                    <th>GPS Lon:</th>
                    <td>{{this.gps_lon}}</td>
                </tr>
                <tr>
                    <th>GPS Alt:</th>
                    <td>{{this.gps_alt}}</td>
                </tr>
                <tr>
                    <th>GPS Numsats:</th>
                    <td>{{this.gps_numsats}}</td>
                </tr>
                <tr>
                    <th>Ant Status:</th>
                    <td>{{this.status}}</td>
                </tr>
                <tr>
                    <th>RSSI:</th>
                    <td>{{this.rssi}}</td>
                </tr>
                <tr>
                    <th>Azimuth:</th>
                    <td>{{this.azm}}</td>
                </tr>
                <tr>
                    <th>Elevation:</th>
                    <td>{{this.elv}}</td>
                </tr>
                <tr>
                    <th>Req Azm:</th>
                    <td>{{this.req_azm}}</td>
                </tr>
                <tr>
                    <th>Req Elv:</th>
                    <td>{{this.req_elv}}</td>
                </tr>
                <tr>
                    <th>Last Range:</th>
                    <td>{{this.last_range}}</td>
                </tr>
                <tr>
                    <th>Last Azm:</th>
                    <td>{{this.last_azm}}</td>
                </tr>
                <tr>
                    <th>Last Elv:</th>
                    <td>{{this.last_elv}}</td>
                </tr>
            </table>
        </div>
        <div  class="comms-stats" >
            <table class="tables">
                <tr>
                    <th>El Pending:</th>
                    <td>{{this.el_pending}} </td>
                </tr>
                <tr>
                    <th>Az Pending:</th>
                    <td>{{this.az_pending}} </td>
                </tr>
                <tr>
                    <th>Last Update:</th>
                    <td>{{this.last_update}}</td>
                </tr>
                <tr>
                    <th>Period:</th>
                    <td>{{this.period_secs}}</td>
                </tr>
                <tr>
                    <th>Avg Bytes Sec:</th>
                    <td>{{this.avg_bytes_sec}} </td>
                </tr>
                <tr>
                    <th>Tot Bytes:</th>
                    <td>{{this.tot_bytes}} </td>
                </tr>
                <tr>
                    <th>Parsed Bytes:</th>
                    <td>{{this.par_bytes}}</td>
                </tr>
                <tr>
                    <th>MQTT Buffer:</th>
                    <td>{{this.mqtt_out}}</td>
                </tr>
                <tr>
                    <th>Track Status:</th>
                    <td>{{this.track_status}} </td>
                </tr>
                <tr>
                    <th>RSSI Filtered:</th>
                    <td>{{this.rssi_filtered}}</td>
                </tr>
                <tr>
                    <th>Last Radio Packet:</th>
                    <td>{{this.secs_ago}}</td>
                </tr>
                <tr v-for="(device,i) in radios" :key="i">
                    <th>Radio Received:</th>
                    <td>{{device.id}}: {{device.ts}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // GPS balloon
            lat: -999,
            lon: -999,
            alt: -999,
            velx: -999,
            vely: -999,
            velz: -999,
            tow: -999,
            ns: -999,
            // Tracking Info
            last_range: -999,
            last_azm: -999,
            last_elv: -999,
            el_pending: 'None',
            az_pending: 'None',
            track_status: 'None',
            id: 'None',
            last_update: -999,
            azm: -999,
            elv: -999,
            status: 'None',
            req_azm: -999,
            req_elv: -999,
            rssi: -999,
            gps_lat: -999,
            gps_lon: -999,
            gps_alt: -999,
            gps_numsats: -999,
            // Comms Stats
            par_bytes: -999,
            par_packets: -999,
            unpar_bytes: -999,
            unpar_packets: -999,
            avg_bytes_sec: -999,
            tot_bytes: -999,
            mqtt_out: -999,
            par_byts: -999,
            period_secs: -999,
            unpar_bytes_rec: -999,
            current_balloon: '',
            rssi_filtered: -999,
            secs_ago: -999,
            radios: []
        }
    },
    props: ['balloonToTrack', 'balloonInfoMessage', 'stationTrackingInfoMessage'],
    watch: {
        balloonToTrack (newVal) {
            this.current_balloon = newVal
        },
        balloonInfoMessage (newVal) {
            const messageOBJ = JSON.parse(newVal)
            if (messageOBJ.data['ADDR_FROM'] === this.current_balloon) {
                // both frame types 
                this.lat = ((messageOBJ.data.frame_data['gps_lat'] / 10000000).toFixed(4) + '°')
                this.lon = ((messageOBJ.data.frame_data['gps_lon'] / 10000000).toFixed(4) + '°')
                this.alt = ((messageOBJ.data.frame_data['gps_alt'] / 1000).toFixed(2) + ' m')
                this.tow = (messageOBJ.data.frame_data['gps_tow'] / 1000).toFixed(2)
                this.ns = messageOBJ.data.frame_data['gps_numsats']
                this.rssi = messageOBJ.data['RSSI_RX']

                if (messageOBJ.data['FRAME_TYPE'] === '0xd2a8') {
                    this.velx = (messageOBJ.data.frame_data['gps_veln_C']).toFixed(3) + ' m/s'
                    this.vely = (messageOBJ.data.frame_data['gps_vele_C']).toFixed(3) + ' m/s'
                    this.velz = (messageOBJ.data.frame_data['gps_veld_C']).toFixed(3) + ' m/s'
                }
            }
        },
        stationTrackingInfoMessage (newVal) {
            const statMessage = JSON.parse(newVal)
            //  this.last_range = (statMessage.tracker.track['last_range']).toFixed(4)
            //  this.last_azm = ((statMessage.tracker.track['last_azm']).toFixed(4) + '°')
            //  this.last_elv = ((statMessage.tracker.track['last_elv']).toFixed(4) + '°')
            //  this.el_pending = statMessage.tracker.track['el_pending']
            //  this.az_pending = statMessage.tracker.track['az_pending']
            //  this.track_status = statMessage.tracker.track['status']
            //  this.id = statMessage.tracker.track['id']
            /* const last_update = new Date(statMessage.tracker.track['last_update'] * 1000)
            const month = last_update.getMonth() + 1
            const day = last_update.getDate()
            const hours = lastdw_update.getHours()
            const minutes = last_update.getMinutes()
            const seconds = last_update.getSeconds()
            this.last_update = `${month}:${day}: ${hours}:${minutes}:${seconds}`
            */
            //this.azm = ((statMessage.tracker.ant['azm']).toFixed(2) + '°')
            //this.elv = ((statMessage.tracker.ant['elv']).toFixed(2) + '°')
            this.status = statMessage.tracker.ant['status']
            //this.req_azm = (statMessage.tracker.ant['req_azm'] + '°')
            //this.req_elv = (statMessage.tracker.ant['req_elv'] + '°')
            // !-- this.rssi --! //
            //this.gps_lat = ((statMessage.tracker.gps['gps_lat']).toFixed(4) + '°')
            //this.gps_lon = ((statMessage.tracker.gps['gps_lon']).toFixed(4) + '°')
            //this.gps_alt = (statMessage.tracker.gps['gps_alt'] + ' m')
            //this.gps_numsats = statMessage.tracker.gps['gps_numsats']
            // !-- last field --! //
            //this.par_bytes = statMessage.receiver_1.last['par_bytes']
            //this.period_secs = (statMessage.receiver_1.last['period_secs']).toFixed(6)
            //this.avg_bytes_sec = (statMessage.receiver_1.last['avg_byte_sec']).toFixed(6)
            //this.tot_bytes = statMessage.receiver_1.last['tot_bytes']
            //this.mqtt_out = statMessage.receiver_1.last['msg_out_queue']
            //this.rssi_filtered = statMessage.receiver_1.last.rssi_last['rssi']
            //this.secs_ago = (statMessage.receiver_1.last.rssi_last['secs_ago']).toFixed(4)

            const allKeys = Object.keys(statMessage.receiver_1.all)
            const allValues = Object.keys(statMessage.receiver_1.all).map((k) => statMessage.receiver_1.all[k])

            for (var i = 0; i < allKeys.length; i++) {
                let last_update = new Date(allValues[i].last_update * 1000)
                let month = last_update.getMonth() + 1
                let day = last_update.getDate()
                let hours = last_update.getHours()
                let minutes = last_update.getMinutes()
                let seconds = last_update.getSeconds()

                if (this.radios[i] === undefined) {

                    const radioReceived = {
                        id: allKeys[i],
                        ts: `${month}:${day}: ${hours}:${minutes}:${seconds}`
                    }
                    this.radios.push(radioReceived)
                }
                if (this.radios[i].id == allKeys[i]){

                    this.radios[i].ts = `${month}:${day}: ${hours}:${minutes}:${seconds}`
                }
                if (!(this.radios[i].id == allKeys[i])) {
                    const radioReceived = {
                        id: allKeys[i],
                        ts: `${month}:${day}: ${hours}:${minutes}:${seconds}`
                    }
                    this.radios.push(radioReceived)
                }
            }

            this.stationMessageDecode(statMessage)

        }
    },
    methods: {
        stationMessageDecode (payload) {
            //const message = JSON.parse(payload)
            const flatPayload = this.flattenMessageTree(payload)

            for (let i in flatPayload) {
                if (i === 'last_range') {
                    this.last_range = flatPayload[i]
                }
                if (i === 'last_azm') {
                    this.last_azm = flatPayload[i]
                }
                if (i === 'last_elv') {
                    this.last_elv = flatPayload[i]
                }
                if (i === 'el_pending') {
                    this.el_pending = flatPayload[i]
                }
                if (i === 'az_pending') {
                    this.az_pending = flatPayload[i]
                }
                if (i === 'status') {
                    this.track_status = flatPayload[i]
                }
                if (i === 'id') {
                    this.id = flatPayload[i]
                }
                if (i === 'last_update') {
                    const last_update = new Date(flatPayload[i] * 1000)
                    const month = last_update.getMonth() + 1
                    const day = last_update.getDate()
                    const hours = last_update.getHours()
                    const minutes = last_update.getMinutes()
                    const seconds = last_update.getSeconds()

                    this.last_update = `${month}:${day}: ${hours}:${minutes}:${seconds}`
                }
                if (i === 'azm') {
                    this.azm = flatPayload[i]
                }
                if (i === 'elv') {
                    this.elv = flatPayload[i]
                }
                if (i === 'req_azm') {
                    this.req_azm = flatPayload[i]
                }
                if (i === 'req_elv') {
                    this.req_elv = flatPayload[i]
                }
                if (i === 'gps_lat') {
                    this.gps_lat = flatPayload[i]
                }
                if (i === 'gps_lon') {
                    this.gps_lon = flatPayload[i]
                }
                if (i === 'gps_alt') {
                    this.gps_alt = flatPayload[i]
                }
                if (i === 'gps_alt') {
                    this.gps_alt = flatPayload[i]
                }
                if (i === 'gps_numsats') {
                    this.gps_numsats = flatPayload[i]
                }
                if (i === 'par_bytes') {
                    this.par_bytes = flatPayload[i]
                }
                if (i === 'period_secs') {
                    this.period_secs = flatPayload[i]
                }
                if (i === 'avg_byte_sec') {
                    this.avg_bytes_sec = flatPayload[i]
                }
                if (i === 'tot_bytes') {
                    this.tot_bytes = flatPayload[i]
                }
                if (i === 'msg_out_queue') {
                    this.mqtt_out = flatPayload[i]
                }
                if (i === 'rssi') {
                    this.rssi_filtered = flatPayload[i]
                }
                if (i === 'secs_ago') {
                    this.secs_ago = flatPayload[i]
                }
            }
        },
        flattenMessageTree(obj) {
            const flattened = {}
            Object.keys(obj).forEach((key) => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    console.log(obj, obj[key], key)
                    if (key === 'all') {
                        console.log('nothing to see here')
                    } else if ( key !== 'all') {
                        Object.assign(flattened, this.flattenMessageTree(obj[key]))
                    }
                } else {
                    flattened[key] = obj[key]
                }
            })
            return flattened
        }
    }
}
</script>


<style scoped>
    #data-wrapper{
        display: flex;
        width: 100vw;
        height: 25vh;
        margin: 0 1em;
        margin-bottom: 0.75em;
    }
    .balloon-gps-wrap, .ground-station-info, .balloon-diagnostics, .comms-stats{
        flex: 1;
    }
    th, td {
        text-align: left !important;
    }
    .tables {
        max-height: 100%;
        width: 100%;
    }
    .Instrument-data-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }
    .tbd{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>