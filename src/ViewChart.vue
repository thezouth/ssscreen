<template>
    <div>
        <v-toolbar dark class="primary">
            <v-toolbar-title>{{ quote | upper }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field 
                v-if="editQuote" 
                hide-details
                v-model="newQuote"
                @keypress.native.enter="change"
                id="input-search-quote"
                placeholder="Enter Quote" 
                ref="inputSearchQuote">
            </v-text-field>
            <v-btn icon @click.native="onSearch">
                <v-icon>search</v-icon>
            </v-btn>
            <v-btn icon @click.native="showPanel = !showPanel">
                <v-icon>settings</v-icon>
            </v-btn>
        </v-toolbar>
        
        <v-card v-if="showPanel">
            <v-card-title primary-title>
                <h3 class="headline">Settings</h3>
            </v-card-title>
            <v-card-text>
                <v-slider 
                    label="Period" 
                    v-model="sampleCount"
                    :max="2000"
                    :min="100"
                    step="100"
                    snap
                    thumb-label>
                </v-slider>
            </v-card-text>
            <v-card-actions>
                <v-btn flat primary>Save</v-btn>
                <v-btn flat @click.native="showPanel = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
        
        <div class="text-xs-center" style="padding: 10px">
            <v-btn flat :key="k" v-for="(v, k) in {d: 'Day', w: 'Week', m: 'Month', y: 'Year'}"
                :value="timeframe === k"
                @click.native="timeframeChange(k)">
                <span>{{ v }}</span>
            </v-btn>
        </div>
        
        <OHLCChart :data="chartData" displayType="ohlc"></OHLCChart>
        <VolumeChart :data="chartData"></VolumeChart>
    </div>
</template>

<script>
import { stockService } from './service'
import { aggregate, toMonth, toWeek, toYear } from './ohlc'

import OHLCChart from './OHLCChart.vue'
import VolumeChart from './VolumeChart.vue'
import { OHLCModel } from './ohlc'

function convertDate(dateString) {
    const arr = dateString.split('/')
    return new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]))
}

function fetchOHLCVData(quote, count) {
    count = count || 200

    return stockService.get(`/historical/${quote}?count=${200}`).then(
        (response) => {
            const data = response.data.data
            const formattedData = {
                date: data.sample_date.map(convertDate),
                open: data.open,
                high: data.high,
                close: data.close,
                low: data.low,
                volume: data.volume
            }

            return formattedData
        }
    )
}

export default {
    name: 'app',
    props: ['quote'],
    components: { OHLCChart, VolumeChart },
    data() {
        return {
            chartData: new OHLCModel(),
            sampleCount: 200,
            timeframe: 'd',

            editQuote: false,
            newQuote: "",

            showPanel: false
        }
    },

    beforeRouteEnter: function (to, from, next) {
        const quote = to.params.quote

        fetchOHLCVData(quote).then(
            (data) => { next((vm) => vm.setRawData(data)) }
        ).catch((err) => {
            alert('cannot fetch data.')
            next(false)
        })
    },

    beforeRouteUpdate: function (to, from, next) {
        const quote = to.params.quote
        const count = this.sampleCount

        fetchOHLCVData(quote, count).then(
            (data) => {
                this.setRawData(data)
                next()
            }
        ).catch((err) => {
            alert('cannot fetch data.')
            next(false)
        })
    },

    methods: {
        setRawData: function (rawData) {
            this.rawData = rawData
            this.timeframeChange(this.timeframe)
            this.editQuote = false
            this.newQuote = ""
        },

        onSearch: function () {
            if (this.editQuote) {
                this.change()
            } else {
                this.editQuote = true
            }
        },

        change() {
            const quote = this.newQuote
            if (!quote) return;
            this.$router.push({ name: "stock-chart", params: { quote: quote }})
        },

        timeframeChange(newTimeframe) {
            this.timeframe = newTimeframe
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
#input-search-quote {
    background-color: rgba(255, 255, 255, 0.3);
}
</style>
