import 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

import Main from './Main.vue'

function upper(text) {
  return text.toUpperCase()
}

Vue.filter('upper', upper)
Vue.use(VueRouter)

new Vue({
  el: "#app",
  render: (h) => h(Main)
})
