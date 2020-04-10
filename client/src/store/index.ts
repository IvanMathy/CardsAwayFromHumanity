import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const playerIdKey = "playerId"

export default new Vuex.Store({
  state() {
    return {
      userId: localStorage.getItem(playerIdKey)
    }
  },
  mutations: {
    setId(state, newId: string) {
      (state as any).userId = newId
      localStorage.setItem(playerIdKey, newId)
    }
  },
  actions: {
    setId(context, newId: string) {
      context.commit('setId', newId)
    }
  },
  modules: {
  }
})
