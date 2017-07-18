<template>
    <div id="app">
        <h1 v-if="quote">{{ quote | upper }}</h1>
        <h1 v-else>Enter quote</h1>
        <div>
            <span>symbol: </span>
            <input @keypress.enter="change" ref="quote"></input>
        </div>
        <div>
            <span>sample count: </span>
            <input type="number" @keypress.enter="change" v-model="sampleCount"></input>
        </div>
        <div>
            <button name="search" @click="change">search</button>
        </div>
        <hr/>
        <div v-if="quote">
            <label :key="k" v-for="(v, k) in {d: 'Day', w: 'Week', m: 'Month', y: 'Year'}">
                <input @change="timeframeChange" type="radio" v-model="timeframe" :value="k"></input>{{ v }}</label>
        </div>
        <OHLCChart :data="chartData" displayType="ohlc"></OHLCChart>
    </div>
</template>

<script>
import { stockService } from './service'
import { aggregate, toMonth, toWeek, toYear } from './ohlc'

import OHLCChart from './OHLCChart.vue'
import { OHLCModel } from './ohlc'

function convertDate(dateString) {
    const arr = dateString.split('/')
    return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
}

export default {
    name: 'app',
    components: { OHLCChart },
    data() {
        return {
            chartData: new OHLCModel(),
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
                        date: data.sample_date.map(convertDate),
                        close: data.close,
                        open: data.open,
                        low: data.low,
                        high: data.high
                    }
                    this.setChartData(this.rawData)
                }
            )
        },
        timeframeChange() {
            if (this.timeframe === 'd') {
                this.setChartData(this.rawData)
            } else if (this.timeframe === 'w') {
                aggregate(toWeek, this.rawData).then(this.setChartData)
            } else if (this.timeframe === 'm') {
                aggregate(toMonth, this.rawData).then(this.setChartData)
            } else if (this.timeframe === 'y') {
                aggregate(toYear, this.rawData).then(this.setChartData)
            } else {
                alert(`unimplemented timeframe [${this.timeframe}]`)
            }
        },
        setChartData(data) {
            this.chartData = data
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #2c3e50;
    margin-top: 60px;
}

h1,
h2 {
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
