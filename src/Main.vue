<template>
    <v-app light>
        <router-view></router-view>
    </v-app>
</template>

<script>
import VueRouter from 'vue-router'
import Home from './Home.vue'
import ViewChart from './ViewChart.vue'

const routes = [
    { name: 'home', path: '', component: Home },
    { name: 'stock-chart', path: '/stock-chart/:quote', component: ViewChart, props: true }
]

const router = new VueRouter({routes})

export default {
    router: router
}
</script>

<style>
.application {
}
</style>
