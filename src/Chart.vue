<template>
  <div style="width:100%;height:500px">
  </div>
</template>

<script>
import { stockService } from './service'
import Plotly from 'plotly.js'
  export default {
    data () {
      return {}
    },
    methods: {
      render() {
        if (!this.chartData) return;
        const layout = {
          showlegend: false,
          xaxis: {
            title: 'Date',
            type: 'date',
            rangeselector: {
              x: 0,
              y: 1.2,
              xanchor: 'left',
              font: {size:8},
              buttons: [{
                  step: 'month',
                  stepmode: 'backward',
                  count: 1,
                  label: '1 month'
              }, {
                  step: 'month',
                  stepmode: 'backward',
                  count: 6,
                  label: '6 months'
              }, {
                  step: 'all',
                  label: 'All dates'
              }],
            }
          }
        }
        Plotly.newPlot(this.$el, [this.chartData], layout)
      }
    },
    mounted () {
      this.render()
    },
    props: [ 'chartData' ],
    watch: { 
      chartData() {
        this.render()
      }
    }
  }
</script>

<style>
</style>
