<template>
  <div id="app">
    <div>
      <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
    </div>
    <div>
      <span>{{ $store.state.userId }}</span>
    </div>
    <div v-if="$store.state.authenticated">
      <p>Username: {{$store.state.user.username}}</p>
      <Host/>
      <button v-on:click="joinGame('VEAN')">Join</button>
    </div>
    <Welcome v-else></Welcome>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import Welcome from "./components/Welcome.vue";
import Host from "./components/Host.vue";
import { Events, Commands } from "../shared/events";

@Component({
  components: {
    Welcome,
    Host
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
    [Events.invalidRoomCode]() {
      alert("Invalid Room Code");
    },
    [Events.unknownError]() {
      alert("Unknown Error");
    }
  }
})
export default class App extends Vue {
  hostGame() {
      this.$socket.client.emit(Commands.hostGame, {});
      console.log("sent");
  }
  joinGame(gameId) {
    this.$socket.client.emit(Commands.joinGame, { gameId: gameId });
    console.log("sent");
  }
}
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
