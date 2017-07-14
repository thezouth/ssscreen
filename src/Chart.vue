<template>
  <div style="width:100%;height:500px">
  </div>
</template>

<script>
import { stockService } from './service'
import Plotly from 'plotly.js'
  function convertDate(dateString) {
    const arr = dateString.split('/')
    return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
  }
  export default {
    data () {
      return {}
    },
    methods: {
      read() {
        if (!this.quote) return;
        stockService.get(`/historical/${this.quote}`).then(
          (response) => {
            const data = response.data.data
            const chartData = {
              x: data.sample_date.map( convertDate ),
              close: data.close,
              open: data.open,
              low: data.low,
              high: data.high,
              type: 'ohlc'
            }
            const layout = {
              showlegend: false,
              xaxis: {
                title: 'Date',
                type: 'date'
              }
            }
            Plotly.newPlot(this.$el, [chartData], layout)
            console.log(chartData)
          }
        )
      }
    },
    mounted () {
      this.read()
    },
    props: [ 'quote' ],
    watch: { 
      quote() {
        this.read()
      }
    }
  }
</script>

<style>
</style>
