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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
  background-color: #242424;
  overflow: hidden;
  position: fixed;
  height: 100%;
  width: 100%;
}

.helvetica {
  font-family: "HelveticaNeueBold", "HelveticaNeue-Bold", "Helvetica Neue Bold", "HelveticaNeue", "Helvetica Neue", 'TeXGyreHerosBold', "Helvetica", "Tahoma", "Geneva", "Arial", sans-serif; 
  font-weight:600; 
  font-stretch:normal;
}

@import "~bulma/sass/utilities/_all";

// CAFH overrides:
$body-background-color: #242424;
$primary: #fa8b02;

$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert)
);

@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
