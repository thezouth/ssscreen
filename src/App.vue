<template>
  <div id="app">
    <h1 v-if="quote">{{ quote | upper }}</h1>
    <h1 v-else>Enter quote</h1>
    <div><span>symbol: </span><input @keypress.enter="change" ref="quote"></input></div>
    <div><span>sample count: </span><input type="number" @keypress.enter="change" v-model="sampleCount"></input></div>
    <div><button name="search" @click="change">search</button></div>
    <hr/>
    <div>
      <label v-for="(v, k) in {d: 'Day', w: 'Week', m: 'Month', y: 'Year'}"><input @change="timeframeChange" type="radio" v-model="timeframe" :value="k"></input>{{ v }}</label>
    </div>
    <chart :chartData="chartData" v-show="quote"></chart>
  </div>
</template>

<script>
import { stockService } from './service'
import chart from './Chart.vue'
import { Observable } from 'rx'

function convertDate(dateString) {
  const arr = dateString.split('/')
  return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
}

function ohlc_month(acc, item) {
  const month = new Date(item[0].getYear(), item[0].getMonth(), 1)
  let old = acc[month]
  let neo = []
  if (!old) {
    neo = item
  } else {
    neo[0] = month
    neo[1] = Math.max(0, old[1]) // open
    neo[2] = Math.min(old[2], item[2]) // low
    neo[3] = Math.max(old[3], item[3]) // high
    neo[4] = Math.max(0, item[4]) // close
  }

  acc[month] = neo
  return acc
}

function aggregate(data, timeframe) {
  if (timeframe === 'd') {
    return data
  } else if (timeframe === 'm') {
    console.log('timeframe', 'm')
    let z = Observable.zip(
      Observable.from(data.x), 
      Observable.from(data.open), 
      Observable.from(data.low), 
      Observable.from(data.high), 
      Observable.from(data.close)
    )
    let r = z.reduce(ohlc_month, {})
    let result = []
    r.subscribe( function (a) { result.push(a); console.log(a) } )
    let o = Object.values(result[0])
    return {
      x: o.map( function (x) { return x[0] } ),
      open: o.map( function (x) { return x[1] } ),
      low: o.map( function (x) { return x[2] } ),
      high: o.map( function (x) { return x[3] } ),
      close: o.map( function (x) { return x[4] } ),
      type: 'ohlc'
    }
  }
}

export default {
  name: 'app',
  components: { chart },
  data () {
    return {
      chartData: null,
      quote: '',
      sampleCount: 200,
      timeframe: 'd'
    }
  },
  methods: {
    change() {
      this.quote = this.$refs.quote.value
      if (!this.quote) return;
      stockService.get(`/historical/${this.quote}?count=${this.sampleCount}`).then(
        (response) => {
          const data = response.data.data
          this.rawData = {
            x: data.sample_date.map( convertDate ),
            close: data.close,
            open: data.open,
            low: data.low,
            high: data.high,
            type: 'ohlc'
          }
          this.chartData = aggregate(this.rawData, this.timeframe)
        }
      )
    },
    timeframeChange() {
      this.chartData = aggregate(this.rawData, this.timeframe)
      console.log('chart', this.chartData)
      console.log('raw', this.rawData)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
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
