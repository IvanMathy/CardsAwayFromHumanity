<template>
  <div id="app">
    <div>
      <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
    </div>
    <button v-on:click="hostGame()">Host</button>
    <button v-on:click="joinGame('D0KM')">Join</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { Events } from "../../shared/events";

@Component({
  components: {
    HelloWorld
  },
  sockets: {
  connect() {
    console.log("socket connected");
  },
  [Events.alreadyHosting]() {
    alert("Already Hosting");
  },
  [Events.invalidRoomCode]() {
    alert("Invalid Room Code");
  },
  [Events.unknownError]() {
    alert("Unknown Error");
  }
},
  methods: {
    hostGame() {
      this.$socket.client.emit(Events.hostGame, { password: "test" });
      console.log("sent");
    },
    joinGame(gameId) {
      this.$socket.client.emit(Events.joinGame, { gameId: gameId });
      console.log("sent");
    }
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
