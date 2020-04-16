<template>
  <div id="app">
    <div>
      <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}, </span>
      <span>{{ $store.state.currentState }}</span>
    </div>
    <div v-if="$store.state.currentState == 'inLobby'">
      <p>Username: {{$store.state.user.username}}</p>
      <Host/>
      <Join/>
    </div>
    <div v-else-if="$store.state.currentState == 'inRoom'">
      <p>In Room: {{$store.state.joinedRoom}}</p>
      
    </div>
    <Welcome v-else></Welcome>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Welcome from "./components/Welcome.vue";
import Host from "./components/Host.vue";
import Join from "./components/Join.vue";
import ClientState from "./store/index";
import { Events, Commands } from "../shared/events";

@Component({
  components: {
    Welcome,
    Host,
    Join
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
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  margin-top: 60px;
  background-color: #242424;
}
</style>
