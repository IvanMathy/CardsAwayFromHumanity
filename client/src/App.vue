<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    <button v-on:click="hostGame()">Host</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
import {Events} from '../../shared/events'



@Component({
  components: {
    HelloWorld,
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    customEmit(val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
    test(val) {
      console.log(`test ${val}`)
    }
  },
  methods: {
    hostGame() {
      this.$socket.client.emit(Events.hostGame, { password: "test" })
      console.log("sent")
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
