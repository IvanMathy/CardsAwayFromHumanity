import Vue from 'vue'
import Vuex from 'vuex'
import { GameState, Events, GameEvents } from "../../shared/events";

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
        username: "",
        isRoomHost: false
      },
      currentState: ClientState.unauthenticated,
      joinedRoom: null,
      gameState: null as GameState | null
    }
  },
  mutations: {
    authenticated(state, newUser: Record<string, string>) {

      const anyState = state as any

      anyState.user = newUser
      anyState.currentState = ClientState.inLobby

      localStorage.setItem(playerIdKey, newUser.newId)
    },

    SOCKET_JOINED(state, payload: any) {

      const [roomCode, isHost] = payload
      const anyState = state as any

      anyState.currentState = ClientState.inRoom
      anyState.joinedRoom = roomCode
      anyState.user.isRoomHost = isHost
    },

    [`SOCKET_${GameEvents.stateChanged.toUpperCase()}`](state, newState) {

      const anyState = state as any

      anyState.gameState = newState
    }

  },
  actions: {
    authenticated(context, newUser: Record<string, string>) {
      context.commit('authenticated', newUser)
    }
  }
})
