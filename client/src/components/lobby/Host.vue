<template>
  <div class="host modal-card">
    <div class="modal-card" style="width: auto" v-if="!gameId">
      <header class="modal-card-head">
        <p class="modal-card-title">Host a Game</p>
      </header>
      <section class="modal-card-body">
        <b-tabs type="is-toggle-rounded" v-model="gameType" id="gameType" expanded>
          <b-tab-item label="Private" icon="lock"></b-tab-item>
          <b-tab-item label="Public" icon="globe"></b-tab-item>
        </b-tabs>
        <b-field label="Password" v-if="gameType == 0">
          <b-input type="password" :value="password" password-reveal></b-input>
        </b-field>
        <b-message
          type="is-warning"
          v-else
        >Anyone can join a public game. If you want to play with friends or family, Private is probably better.</b-message>

        <b-field label="Points to win">
          <b-slider size="is-medium" :min="4" :max="12">
            <template v-for="val in [4,5,6,7,8,9,10,11,12]">
              <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button
          class="button is-primary"
          v-on:click="host()"
          :disabled="gameType == 'private' && password == ''"
        >Host</button>
      </footer>
    </div>
    <div v-else>
      <b-message title="Room Created" type="is-success" :closable="false" has-icon>
        Your room has successfully been created! Would you like to play on your phone or on this device?
        <p>
          <b-button
            type="is-success"
            size="is-medium"
            icon-left="mobile"
            expanded
            v-on:click="authenticate()"
            :disabled="username == ''"
          >Play on my phone</b-button>
        </p>
        <p>
          <b-button
            type="is-success"
            size="is-medium"
            icon-left="tv"
            outlined
            expanded
            v-on:click="authenticate()"
            :disabled="username == ''"
          >Play on this device</b-button>
        </p>
      </b-message>
      {{gameId}}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../../shared/events";

@Component({
  sockets: {
    [Events.alreadyHosting]() {
      this.$buefy.toast.open({
        message: "You are already the host of another room.",
        duration: 5000,
        type: "is-danger",
        queue: false
      });
    },
    [Events.roomCreationFailed]() {
      alert("Room Creation Failed");
    },
    [Events.roomCreated](this: Host, roomId) {
      this.gameId = roomId;
    }
  }
})
export default class Host extends Vue {
  password = "";
  gameType = 0;

  gameId = "";

  host() {
    const payload = {};

    if (this.gameType == 1) {
      payload["isPublic"] = true;
    } else {
      if (this.password.length == 0) {
        alert("Please enter a password.");
        return;
      }

      payload["isPublic"] = false;
      payload["password"] = this.password;
    }
    this.$socket.client.emit(Commands.hostGame, payload, (gameId: string) => {
      if (gameId == undefined) {
        alert("Could not create game. Sorry!");
        return;
      } else {
        alert(gameId);
        this.gameId = gameId;
      }
    });
  }
}
</script>

<style lang="scss">
.host {
  max-width: 400px;
  color: black;
}

#gameType > .tab-content {
  display: none !important;
}
</style>
