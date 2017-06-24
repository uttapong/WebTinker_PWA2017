// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import {store} from '@/vuex/store'
import {firebase} from '@/assets/js/FirebaseConfig'

Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    clipped: false,
    drawer: true,
    fixed: false,
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: 'Vuetify.js'
  },
  methods: {
    processUser (authed) {
      // console.log(authed)
      if (authed === null) {
        this.loginFail = true
        this.user = null
        // store.commit('setUser', this.user)
        return
      } else store.commit('setUser', authed)
    }
  },
  created: function () {
    firebase.auth().onAuthStateChanged(this.processUser)
  },
  props: ['user']
})
