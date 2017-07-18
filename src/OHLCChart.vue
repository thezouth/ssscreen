<template>
    <div :style="elementStyle">
    </div>
</template>

<script>
import Plotly from 'plotly.js'
import { OHLCModel } from './ohlc'

const rangeSelector = {
    x: 0,
    y: 1.2,
    xanchor: 'left',
    font: { size: 8 },
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

const layout = {
    showlegend: false,
    xaxis: {
        title: 'Date',
        type: 'date',
        rangeSelector: rangeSelector
    }
}

export default {
    props: {
        data: {
            type: Object
        },

        displayType: {
            type: String,
            default: function () { return 'ohlc' },
            validator: function (value) { return ['ohlc', 'candlestick'].indexOf(value) >= 0 }
        },

        height: {
            type: Number,
            default: 500,
            validator: function (value) { return value > 100 }
        }
    },

    data: function () {
        return {

        }
    },

    computed: {
        elementStyle: function () {
            return `width: 100%; height: ${this.height}px`
        }
    },

    methods: {
        render: function () {
            console.log(this.data)
            if (!this.data)
                return

            const chartData = {
                x: this.data.date,
                open: this.data.open,
                high: this.data.high,
                low: this.data.low,
                close: this.data.close,
                type: this.displayType
            }

            Plotly.newPlot(this.$el, [chartData], layout)
        }
    },

    mounted: function () {
        this.render()
    },

    watch: {
        data: function () {
            this.render()
        }
    }
}
</script>

<style>

</style>
