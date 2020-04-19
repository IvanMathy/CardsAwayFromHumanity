<template>
  <div class="authenticate">
    <div class="box">
      <b-field label="Username" type="is-success">
        <b-input v-model="username"></b-input>
        <b-button type="is-light" v-on:click="authenticate()" :disabled="username == ''">Authenticate</b-button>
      </b-field>
    </div>
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
      alert("Please enter a username.");
      return;
    }

    this.$socket.client.emit(
      Commands.authenticate,
      {
        id: this.$store.state.user.userId,
        name: this.username
      },
      (newId?: string) => {
        if (newId == null || newId == undefined) {
          alert("Could not authenticate. Sorry!");
          return;
        }
        this.$store.dispatch("authenticated", {
          newId: newId,
          username: this.username
        });
      }
    );
    console.log("sent");
  }
}
</script>

<style lang="scss">
.authenticate {
  max-width: 300px;
  margin: auto;
}
</style>
