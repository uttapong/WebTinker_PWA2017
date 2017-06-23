<template>
  <v-app>
  <v-navigation-drawer></v-navigation-drawer>
  <v-toolbar>xxx</v-toolbar>
  <main>
    <v-container fluid>
    </v-container>
  </main>
  <v-footer></v-footer>
</v-app>
</template>


<script>
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default {
  name: 'nearby',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
