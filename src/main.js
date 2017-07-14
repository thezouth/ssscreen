import 'axios'
import Vue from 'vue'

import App from './App.vue'

function upper(text) {
  return text.toUpperCase()
}

Vue.filter('upper', upper)

new Vue({
  el: '#app',
  render: h => h(App)
})
