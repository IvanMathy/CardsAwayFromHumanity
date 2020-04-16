<template>
  <div class="authenticate">
    <input v-model="username">
    {{$store.state.userId}}
    <button v-on:click="authenticate()" :disabled="username == ''">Authenticate</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../shared/events";

@Component
export default class Welcome extends Vue {
  username = "";

  authenticate() {

    if (this.username.length == 0) {
      alert("Please enter a username.")
      return
    }

    this.$socket.client.emit(
      Commands.authenticate, {
        id: this.$store.state.user.userId,
        name: this.username
      },
      (newId?: string) => {
        if (newId == null || newId == undefined) {
          alert("Could not authenticate. Sorry!");
          return;
        }
        this.$store.dispatch("authenticated", {newId: newId, username: this.username});
      }
    );
    console.log("sent");
  }
}
</script>

<style scoped lang="scss">
</style>
