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
import { aggregate, toMonth, toWeek, toYear } from './ohlc'
import chart from './Chart.vue'

function convertDate(dateString) {
  const arr = dateString.split('/')
  return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
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
            date: data.sample_date.map( convertDate ),
            close: data.close,
            open: data.open,
            low: data.low,
            high: data.high,
            type: 'ohlc'
          }
          this.chartData = this.rawData
          this.chartData.x = this.rawData.date
          this.chartData.type = 'ohlc'
        }
      )
    },
    timeframeChange() {
      if (this.timeframe === 'd') {
        this.chartData = this.rawData
        this.chartData.x = this.rawData.date
        this.chartData.type = 'ohlc'
      } else if (this.timeframe === 'w') {
        aggregate(toWeek, this.rawData).then( (data) => {
          this.chartData = data
          this.chartData.x = data.date
          this.chartData.type = 'ohlc'
        })
      } else if (this.timeframe === 'm') {
        aggregate(toMonth, this.rawData).then( (data) => {
          this.chartData = data
          this.chartData.x = data.date
          this.chartData.type = 'ohlc'
        })
      } else if (this.timeframe === 'y') {
        aggregate(toYear, this.rawData).then( (data) => {
          this.chartData = data
          this.chartData.x = data.date
          this.chartData.type = 'ohlc'
        })
      } else {
        alert(`unimplemented timeframe [${this.timeframe}]`)
      }
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
