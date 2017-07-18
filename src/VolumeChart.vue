<template>
    <div style="width: 100%, height: 500px">
    </div>
</template>

<script>
import Plotly from 'plotly.js'

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
        }
    },
    methods: {
        render: function () {
            if (!this.data)
                return

            const chartData = {
                x: this.data.date,
                y: this.data.volume,
                type: 'bar'
            }

            Plotly.newPlot(this.$el, [chartData], layout)
        }
    },

    mounted: function () {
        console.log('mount')
        this.render()
    },

    watch: {
        data: function () {
            console.log('change')
            this.render()
        }
    }
}
</script>

<style>

</style>


