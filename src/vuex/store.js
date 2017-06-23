let Vue = require('vue')
let Vuex = require('vuex')
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser: (state, userinfo) => { state.user = userinfo }
  },
  plugins: [createPersistedState()],
  getters: {
    getUser: state => {
      return state.user
    }
  }
})
