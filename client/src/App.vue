<template>
  <div id="app">
    <div>
      <span>{{ $socket.connected ? 'Connected' : 'Disconnected' }}</span>
    </div>
    <div>
      <span>{{ $store.state.userId }}</span>
    </div>
    <button v-on:click="hostGame()">Host</button>
    <button v-on:click="joinGame('NKMV')">Join</button>
    <button v-on:click="authenticate()">Authenticate</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "./components/HelloWorld.vue";
import { Events, Commands } from "../shared/events";

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
      this.$socket.client.emit(Commands.hostGame, { password: "test" });
      console.log("sent");
    },
    joinGame(gameId) {
      this.$socket.client.emit(Commands.joinGame, { gameId: gameId });
      console.log("sent");
    },
    authenticate() {
      this.$socket.client.emit(Commands.authenticate, this.$store.state.userId, (newId?: string) => {
        if(newId == undefined) {
          alert("Could not authenticate. Sorry!")
          return
        }
        this.$store.dispatch('setId', newId)
      });
      console.log("sent");
    }
  },
  mounted() {
    if (this.$store.state.userId == null) {
      alert('empty')
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
