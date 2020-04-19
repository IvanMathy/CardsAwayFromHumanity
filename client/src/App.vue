<template>
  <div id="app">
    <div v-if="$store.state.currentState == 'inLobby'">
      <Home/>
    </div>
    <Game v-else-if="$store.state.currentState == ClientState.inRoom" />
    <Welcome v-else></Welcome>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Welcome from "./components/Welcome.vue";
import Home from "./components/lobby/Home.vue";
import Game from "./components/game/Game.vue";
import { ClientState } from "./store/index";
import { Events, Commands, GameEvents } from "../shared/events";
import { Socket } from 'vue-socket.io-extended';

@Component({
  components: {
    Welcome,
    Game,
    Home
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    disconnect(whyyyyy) {
      if (whyyyyy === "io server disconnect") {
        alert("booted");
      }
    },
    [Events.unknownError]() {
      alert("Unknown Error");
    }
  },
  computed: {
   
  }
})
export default class App extends Vue {
  ClientState = ClientState
}
</script>

<style lang="scss">
html, body {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
  background-color: #242424;
}

@import "~bulma/sass/utilities/_all";

// CAFH overrides:
$body-background-color: #242424;
$body-color: $white;

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
