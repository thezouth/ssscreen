<template>
     <v-container fluid class="page-home">
        <h2 class="display-3 text-xs-center">Stock chart</h2>
        <v-layout row wrap>
            <v-flex xs12 md6 offset-md3 xl4 offset-xl4>
                <v-text-field label="Enter Quote" v-model="quote" @keypress.native.enter="submit"></v-text-field>
            </v-flex>
        </v-layout>
        <div class="text-xs-center">
            <v-btn @click.native="submit" primary :loading="loading">Go!</v-btn>
        </div>
    </v-container> 
</template>

<script>
export default {
    data: function () {
        return {
            quote: "",
            loading: false
        }
    },

    methods: {
        submit: function () {
            if (this.quote) {
                this.$router.push({name: 'stock-chart', params: { quote: this.quote }})
            }
        }
    }
}
</script>

<style>
.page-home {
    padding-top: 150px;
}

.page-home h1 {
    margin-bottom: 60px;
}
</style>

