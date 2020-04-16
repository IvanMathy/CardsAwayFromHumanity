import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const playerIdKey = "playerId"

export enum ClientState {
  unauthenticated = "unauthenticated",
  inLobby = "inLobby",
  inRoom = "inRoom"
}

export default new Vuex.Store({
  state() {
    return {
      user: {
        userId: localStorage.getItem(playerIdKey),
        username: ""
      },
      currentState: ClientState.unauthenticated,
      joinedRoom: null
    }
  },
  mutations: {
    authenticated(state, newUser: Record<string, string>) {

      const anyState = state as any

      anyState.user = newUser
      anyState.currentState = ClientState.inLobby

      localStorage.setItem(playerIdKey, newUser.newId)
    },

    SOCKET_JOINED(state, roomId: string) {

      const anyState = state as any

      anyState.currentState = ClientState.inRoom
      anyState.joinedRoom = roomId
    }

  },
  actions: {
    authenticated(context, newUser: Record<string, string>) {
      context.commit('authenticated', newUser)
    }
  }
})
