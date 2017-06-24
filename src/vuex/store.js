import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    uploadPhoto: null
  },
  mutations: {
    setUser: (state, userinfo) => { state.user = userinfo },
    setPhoto: (state, url) => { state.uploadPhoto = url }
  },
  plugins: [createPersistedState()],
  getters: {
    getUser: state => {
      return state.user
    },
    getPhoto: state => {
      return state.uploadPhoto
    }
  }
})
