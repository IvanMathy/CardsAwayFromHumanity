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
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Your room's password"
            icon-pack="mdi"
          ></b-input>
        </b-field>

        <article v-else class="message is-warning is-small">
          <section class="message-body">
            <div class="media">
              <div
                class="media-content"
              >Anyone can join a public game. If you want to play with friends or family, Private is probably better.</div>
            </div>
          </section>
        </article>

        <b-field label="Points to win">
          <b-slider size="is-medium" :min="4" :max="12" v-model="points">
            <template v-for="val in [4,5,6,7,8,9,10,11,12]">
              <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
        </b-field>
        <div class="field has-text-centered">
          <b-switch type="is-info">Enable Streamer mode</b-switch>

          <b-tooltip
            multilined
            size="is-small"
            class="stream-tooltip"
            label="Streamer mode extends game timers to account for stream delay."
            type="is-dark"
          >
            <b-icon size="is-small" icon="question-circle" class="has-text-grey" />
          </b-tooltip>
        </div>
      </section>
      <footer class="modal-card-foot modal-buttons">
        <button class="button" type="button" @click="$parent.close()">Close</button>
        <button
          class="button is-primary"
          v-on:click="host()"
          :disabled="gameType == 0 && password == ''"
        >Host</button>
      </footer>
    </div>
    <div v-else>
      <b-message title="Room Created" type="is-success" :closable="false" class="room-success">
        <div class="is-hidden-tablet">
          Your room has successfully been created!
          <p>
            <b-button
              type="is-success"
              size="is-medium"
              icon-left="mobile"
              expanded
              v-on:click="join()"
            >Join the Room</b-button>
          </p>

          <p
            class="has-text-centered is-size-7 has-text-grey success-text"
          >Did you know? You can join this game from a computer or a TV to use it as a shared scoreboard.</p>
        </div>
        <div class="is-hidden-mobile">
          Your room has successfully been created! Would you like to play on your phone or on this device?
          <p>
            <b-button
              type="is-success"
              size="is-medium"
              icon-left="mobile"
              expanded
              v-on:click="spectate()"
            >Play on my phone</b-button>
          </p>
          <p>
            <b-button
              type="is-dark"
              size="is-medium"
              icon-left="tv"
              outlined
              expanded
              v-on:click="join()"
            >Play on this device</b-button>
          </p>

          <p class="has-text-centered is-size-7 has-text-grey success-text">
            Playing on your phone means you can share this screen with other people as a scoreboard.
          </p>
        </div>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../../shared/events";
import { ModalConfig } from "buefy/types/components";

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
    },
    [Events.joinedGame](this: Host, roomId) {
      (this.$parent as any).close()
    }
  }
})
export default class Host extends Vue {
  password = "";
  gameType = 0;

  gameId = "";

  points = 8;

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

    (this.$parent as ModalConfig).canCancel = false;

    this.$socket.client.emit(Commands.hostGame, payload);
  }

  join() {

    if(this.gameId.length != 4) {
      alert("Cannot join room")
      return
    }
    
    const payload = { gameId: this.gameId }

    if(this.gameType == 0) {
      payload['password'] = this.password 
    }

    this.$socket.client.emit(Commands.joinGame, payload);
  }

  spectate() {
      this.join()
  }
}
</script>

<style lang="scss">
.host {
  max-width: 420px;
  color: black;
  text-align: left;

  .b-slider {
    padding: 0 5px;
    margin-bottom: 40px;
  }
  .b-slider-tick {
    background-color: transparent !important;
  }
  .b-slider-tick-label {
    top: calc(0.625rem / 2 + 8px) !important;
  }
  .modal-buttons {
    display: block;
    text-align: right;
  }
  .stream-tooltip {
    top: 3px;
    left: 5px;
    cursor: help;
  }

  .room-success {
    .button {
      font-weight: bold;
      margin-top: 15px;
    }
    .success-text {
      margin-top: 20px;
    }
  }
}

#gameType > .tab-content {
  display: none !important;
}
</style>
