<template>
  <div class="host">
    <input type="radio" id="private" value="private" v-model="gameType">
    <label for="private">Private</label>
    <br>
    <input type="radio" id="public" value="public" v-model="gameType">
    <label for="public">Public</label>
    <br>Password:
    <input v-model="password" v-if="gameType == 'private'">
    <br>
    <button v-on:click="host()" :disabled="gameType == 'private' && password == ''">Host game</button>

    <p>{{gameId}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../shared/events";

@Component({
  sockets: {
    [Events.alreadyHosting]() {
      alert("Already Hosting");
    }
  }
})

export default class Host extends Vue {
  password = ""
  gameType = ""

  gameId = ""

  host() {
    const payload = {};

    if (this.gameType == "public") {
      payload["isPublic"] = true
    } else {
      if (this.password.length == 0) {
        alert("Please enter a password.");
        return;
      }

      payload["isPublic"] = false
      payload["password"] = this.password
    }

    this.$socket.client.emit(
      Commands.hostGame,
      payload,
      (gameId: string) => {
        if (gameId == undefined) {
          alert("Could not create game. Sorry!");
          return;
        } else {
          this.gameId = gameId
        }
      }
    );
  }
}
</script>

<style scoped lang="scss">
</style>
