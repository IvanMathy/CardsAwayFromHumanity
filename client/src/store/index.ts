import Vue from 'vue'
import Vuex from 'vuex'
import { GameState, Events, GameEvents, PlayerLocation } from "../../shared/events";

Vue.use(Vuex)

const playerIdKey = "playerId"
export const usernameStorageKey = "username"

export enum ClientState {
  unauthenticated = "unauthenticated",
  inLobby = "inLobby",
  spectating = "spectating",
  inRoom = "inRoom",
  disconnected = "disconnected"
}

function s(name: string) {
  return `SOCKET_${name.toUpperCase()}`
}

export default new Vuex.Store({
  state() {
    return {
      user: {
        userId: localStorage.getItem(playerIdKey),
        username: "",
        isRoomHost: false,
        isCzar: false,
        hand: [],
      },
      isPlayer: false,
      currentState: ClientState.unauthenticated,
      gameState: null as GameState | null
    }
  },
  mutations: {
    authenticated(state: any, newUser: Record<string, string>) {
      state.user.userId = newUser.newId
      state.user.username = newUser.username
      state.currentState = ClientState.inLobby

      localStorage.setItem(playerIdKey, newUser.newId)
      localStorage.setItem(usernameStorageKey, newUser.username)
    },

    rejoined(state: any, userState: Record<string, string>) {
      switch (userState.location as PlayerLocation) {
        case PlayerLocation.inGame:

          state.currentState = ClientState.inRoom
          state.joinedRoom = userState.room
          break;
        case PlayerLocation.spectating:

          state.currentState = ClientState.spectating
          state.joinedRoom = userState.room
          break;

        default:
          break;
      }
    },

    disconnected(state: any) {
      state.currentState = ClientState.disconnected
    },

    SOCKET_JOINED(state, payload: any) {

      const [roomCode, isHost] = payload
      const anyState = state as any

      anyState.currentState = ClientState.inRoom
      anyState.joinedRoom = roomCode
      anyState.user.isRoomHost = isHost
    },

    [s(Events.startedSpectating)](state: any, payload: any) {
      const [roomCode, isHost] = payload
      const anyState = state as any

      anyState.currentState = ClientState.spectating
      anyState.joinedRoom = roomCode
      anyState.user.isRoomHost = isHost
    },

    [s(GameEvents.stateChanged)](state: any, newState) {

      state.gameState = newState
    },
    [s(GameEvents.timer)](state: any, time) {

      (state.gameState as GameState).time = time
    },
    [s(GameEvents.becomeCzar)](state: any) {
      state.user.isCzar = true
    },
    [s(GameEvents.updateHand)](state: any, hand: number[]) {
      state.user.isCzar = false
      state.user.hand = hand
    }

  },
  actions: {
    authenticated(context, newUser: Record<string, string>) {
      context.commit('authenticated', newUser)
    },
    rejoined(context, userState: Record<string, string>) {
      context.commit('rejoined', userState)
    },
    disconnected(context) {
      context.commit('disconnected')
    }
  }
})
