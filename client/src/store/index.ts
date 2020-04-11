import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const playerIdKey = "playerId"

export default new Vuex.Store({
  state() {
    return {
      user: {
        userId: localStorage.getItem(playerIdKey),
        username: ""
      },
      authenticated: false
    }
  },
  mutations: {
    authenticated(state, newUser: Record<string, string>) {

      const anyState = state as any

      anyState.user = newUser
      anyState.authenticated = true

      localStorage.setItem(playerIdKey, newUser.newId)
    }
  },
  actions: {
    authenticated(context, newUser: Record<string, string>) {
      context.commit('authenticated', newUser)
    }
  },
  modules: {
  }
})
