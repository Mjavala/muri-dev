// https://router.vuejs.org/

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/pages/home/home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    // router props - https://router.vuejs.org/guide/essentials/passing-props.html
    path: '/muri/historical&:device&:station',
    name: 'historical',
    props: {device: '', station: ''},
    component: () => import('../components/pages/historical/flightPage.vue')
  },
  {
    path: '/muri/historical',
    name: 'historicalEntrypoint',
    //  lazy loaded pages -  https://router.vuejs.org/guide/advanced/lazy-loading.html
    component: () => import(/* webpackChunkName: "about" */ '../components/pages/historical/main.vue')
  },
  {
    path: '/muri/station/data&:id',
    name: 'station',
    props: true,
    component: () => import('../components/pages/stations/station-data/stationData.vue')
  },
  {
    path: '/muri/station/diagnostics&:id',
    name: 'stationDiagnostics',
    props: true,
    component: () => import('../components/pages/stations/station-diag/stationDiag.vue')
  },
  {
    path: '/muri/station/all',
    name: 'stationGeneral',
    props: true,
    component: () => import('../components/pages/stations/station-data/stationData.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
