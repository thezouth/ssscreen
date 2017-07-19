import 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import Main from './Main.vue'

function upper(text) {
  return text.toUpperCase()
}

Vue.filter('upper', upper)
Vue.use(VueRouter)
Vue.use(Vuetify)

new Vue({
  el: "#app",
  render: (h) => h(Main)
})
