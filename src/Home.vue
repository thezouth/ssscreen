<template>
    <div>
        <h1>Enter Quote</h1>
        <input type="text" v-model="quote" @keypress.enter="submit"></input>
        <button @click="submit">-></button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            quote: ""
        }
    },

    methods: {
        submit: function () {
            if (this.quote)
                this.$router.push({name: 'stock-chart', params: { quote: this.quote }})
        }
    }
}
</script>

