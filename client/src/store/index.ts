import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    // eslint-disable-next-line camelcase
    socket_test() { 
      console.log('hello')
    }
  },
  modules: {
  }
})
