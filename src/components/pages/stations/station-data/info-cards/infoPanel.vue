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
                    <th>Status:</th>
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
        <div  class="balloon-diagnostics">
            <table class="tables">
                <tr>
                    <th>Ta 1:</th>
                    <td>{{this.ta1}}</td>
                </tr>
                <tr>
                    <th>Ta 1:</th>
                    <td>{{this.ta2}}</td>
                </tr>
                <tr>
                    <th>Ti 1:</th>
                    <td>{{this.ti1}}</td>
                </tr>
                <tr>
                    <th>Ti 2:</th>
                    <td>{{this.ti2}}</td>
                </tr>
                <tr>
                    <th>Vent Status:</th>
                    <td>{{this.vent_stat}}</td>
                </tr>
                <tr>
                    <th>Vent Ti 1:</th>
                    <td>{{this.vent_t1}}</td>
                </tr>
                <tr>
                    <th>Vent Ti 2:</th>
                    <td>{{this.vent_t2}}</td>
                </tr>
                <tr>
                    <th>Vent Batt:</th>
                    <td>{{this.vent_batt}} </td>
                </tr>
                <tr>
                    <th>Batt Mon:</th>
                    <td>{{this.batt_mon}} </td>
                </tr>
                <tr>
                    <th>Packet Num:</th>
                    <td>{{this.packet_num}} </td>
                </tr>
                <tr>
                    <th>Epoch Index:</th>
                    <td>{{this.epoch_index}} </td>
                </tr>
                <tr>
                    <th>Interval Index:</th>
                    <td>{{this.interval_index}} </td>
                </tr>
            </table>
        </div>
        <div  class="comms-stats" >
            <table class="tables">
                <tr>
                    <th>Par Bytes:</th>
                    <td>{{this.par_bytes}} </td>
                </tr>
                <tr>
                    <th>Unpar Bytes:</th>
                    <td>{{this.unpar_bytes}} </td>
                </tr>
                <tr>
                    <th>Tot Bytes:</th>
                    <td>{{this.tot_bytes}} </td>
                </tr>
                <tr>
                    <th>Avg Bytes Sec:</th>
                    <td>{{this.avg_bytes_sec}} </td>
                </tr>
                <tr>
                    <th>RSSI Filtered:</th>
                    <td>{{this.rssi_filtered}} </td>
                </tr>
                <tr>
                    <th>Last Radio Packet:</th>
                    <td>{{this.secs_ago}} </td>
                </tr>
                <tr>
                    <th>Track Status:</th>
                    <td>{{this.tracker_status}} </td>
                </tr>
            </table>
        </div>
        <div  class="comms-stats" >
        <div class="title">Instrument Data</div>
            <div class="Instrument-data-wrap">
                <div class="tbd"> TBD </div>
            </div>
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
            azm: -999,
            elv: -999,
            status: 'none',
            req_azm: -999,
            req_elv: -999,
            rssi: -999,
            gps_lat: -999,
            gps_lon: -999,
            gps_alt: -999,
            gps_numsats: -999,
            // Balloon Diagnostics
            packet_num: -999,
            epoch_index: -999,
            batt_mon: -999,
            vent_batt: -999,
            ta1: -999,
            ta2: -999,
            ti1: -999,
            ti2: -999,
            vent_stat: -999,
            vent_t1: -999,
            vent_t2: -999,
            // Comms Stats
            last_update: -999,
            par_bytes: -999,
            unpar_bytes: -999,
            avg_bytes_sec: -999,
            tot_bytes: -999,
            par_byts: -999,
            current_balloon: '',
            rssi_filtered: -999,
            secs_ago: -999,
            tracker_status: 'None',
            interval_index: -999
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
                // both frame types -
                this.lat = ((messageOBJ.data.frame_data['gps_lat'] / 10000000).toFixed(4) + '°')
                this.lon = ((messageOBJ.data.frame_data['gps_lon'] / 10000000).toFixed(4) + '°')
                this.alt = ((messageOBJ.data.frame_data['gps_alt'] / 1000).toFixed(2) + ' m')
                this.tow = (messageOBJ.data.frame_data['gps_tow'] / 1000).toFixed(2)
                this.ns = messageOBJ.data.frame_data['gps_numsats']
                this.packet_num = messageOBJ.data.frame_data['packet_num']
                this.epoch_index = messageOBJ.data.frame_data['epoch index']
                this.interval_index = messageOBJ.data.frame_data['interval index']
                this.packet_num = messageOBJ.data.frame_data['packet_num']
                this.rssi = messageOBJ.data['RSSI_RX']
                // 0xd2a8 only
                // asuming gps_veln (n = north = y), gps_vele (e = east = x), gps_vel_d(d = down = -z)
                if (messageOBJ.data['FRAME_TYPE'] === '0xd2a8') {
                    this.velx = (messageOBJ.data.frame_data['gps_veln_C']).toFixed(3) + ' m/s'
                    this.vely = (messageOBJ.data.frame_data['gps_vele_C']).toFixed(3) + ' m/s'
                    this.velz = (messageOBJ.data.frame_data['gps_veld_C']).toFixed(3) + ' m/s'
                    this.batt_mon = (messageOBJ.data.frame_data['GOND_BATT_C']).toFixed(3) + ' V'
                    this.vent_batt = (messageOBJ.data.frame_data['VENT_BATT_C']).toFixed(3) + ' V'
                    this.ti1 = (messageOBJ.data.frame_data['Ti1_C']).toFixed(3) + ' °C'
                    this.ti2 = (messageOBJ.data.frame_data['Ti2_C']).toFixed(3) + ' °C'
                    this.vent_stat = (messageOBJ.data.frame_data['VENT_STAT']).toString(16)
                    this.vent_t1 = (messageOBJ.data.frame_data['VENT_Ti1_C']).toFixed(3) + ' °C'
                    this.vent_t2 = (messageOBJ.data.frame_data['VENT_Ti2_C']).toFixed(3) + ' °C'
                    this.ta1 = (messageOBJ.data.frame_data['Ta1_C']).toFixed(3) + ' °C'
                    this.ta2 = (messageOBJ.data.frame_data['Ta2_C']).toFixed(3) + ' °C'
                }
            }
        },
        stationTrackingInfoMessage (newVal) {
            const statMessage = JSON.parse(newVal)
            this.last_range = (statMessage.tracker.track['last_range']).toFixed(4)
            this.last_azm = ((statMessage.tracker.track['last_azm']).toFixed(4) + '°') 
            this.last_elv = ((statMessage.tracker.track['last_elv']).toFixed(4) + '°') 
            this.tracker_status = statMessage.tracker.track['status']
            this.azm = ((statMessage.tracker.ant['azm']).toFixed(2) + '°') 
            this.elv = ((statMessage.tracker.ant['elv']).toFixed(2) + '°') 
            this.status = statMessage.tracker.ant['status']
            this.req_azm = statMessage.tracker.ant['req_azm']
            this.req_elv = statMessage.tracker.ant['req_elv']
            // !-- this.rssi --! //
            this.gps_lat = ((statMessage.tracker.gps['gps_lat']).toFixed(4) + '°') 
            this.gps_lon = ((statMessage.tracker.gps['gps_lon']).toFixed(4) + '°') 
            this.gps_alt = (statMessage.tracker.gps['gps_alt'] + ' m') 
            this.gps_numsats = statMessage.tracker.gps['gps_numsats']
        
            this.avg_bytes_sec = (statMessage.receiver_1.last['avg_byte_sec']).toFixed(6)
            this.rssi_filtered = statMessage.receiver_1.last.rssi_last['rssi']
            this.secs_ago = (statMessage.receiver_1.last.rssi_last['secs_ago']).toFixed(4)
            
            const allKeys = Object.keys(statMessage.receiver_1.all)
            const allValues = Object.keys(statMessage.receiver_1.all).map((k) => statMessage.receiver_1.all[k])

            allKeys.forEach((key, i) => {
                if (key === this.current_balloon) {
                    const last_update = new Date(allValues[i].last_update * 1000)
                    const month = last_update.getMonth() + 1
                    const day = last_update.getDate()
                    const hours = last_update.getHours()
                    const minutes = last_update.getMinutes()
                    const seconds = last_update.getSeconds()
                    this.last_update = `${month}:${day}: ${hours}:${minutes}:${seconds}`
                    this.par_bytes = allValues[i].par_bytes
                    this.unpar_bytes = allValues[i].unpar_bytes
                    this.tot_bytes = this.par_bytes + this.unpar_bytes
                }
            })
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
    /*
    @media only screen and (min-width: 1900px) and (min-height: 1080px) {
        #data-wrapper{
            margin: 2em 1em;
        }
    }  
    @media only screen and (min-width: 1900px) and (min-height: 1200px) {
        #data-wrapper{
            margin: 1em 1em;
        }
    }
    */ 

</style>