<template>
  <div id="app">
    <span>symbol: </span><input @keypress.enter="change" ref="quote"></input><button name="search" @click="change">search</button>
    <span>sample count: </span><input type="number" v-model="sampleCount"></input> 
    <h1>{{ quote || 'Enter Quote' }}</h1>
    <chart :quote="quote" v-show="quote"></chart>
  </div>
</template>

<script>
import { stockService } from './service'
import chart from './Chart.vue'
export default {
  name: 'app',
  components: { chart },
  data () {
    return {
      quote: '',
    }
  },
  methods: {
    change() {
      this.quote = this.$refs.quote.value
      //stockService.get('/historical/' + this.quote).then( (data) => console.log(data) )
      //console.log(this.quote)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
