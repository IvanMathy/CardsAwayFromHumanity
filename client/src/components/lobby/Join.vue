<template>
  <div class="join">
    <div v-if="joinState == State.Init">
      <p>Please enter the room code:</p>
      <b-field class="wide" expanded>
        <b-input
          v-model="roomCode"
          size="is-large"
          placeholder="AAAH"
          @input="roomCode=$event.toUpperCase()"
        ></b-input>
        <div class="control">
          <b-button
            type="is-info"
            size="is-large"
            v-on:click="join(false)"
            :disabled="roomCode.length !== 4"
            :loading="buttonLoading"
          >Join</b-button>
        </div>
      </b-field>
      <div class="wide">
        <b-button
          type="is-primary"
          v-on:click="spectate()"
          :disabled="roomCode.length !== 4"
          :loading="buttonLoading"
          size="is-medium"
          outlined
          expanded
        >Join as Spectator</b-button>
      </div>
    </div>
    <div v-if="joinState == State.Joining">Joining {{roomCode}}.</div>
    <div v-if="joinState == State.Password">
      <br />Password:
      <input v-model="password" type="password" />
      <br />
      <p v-if="isPasswordInvalid">Password is invalid</p>
      <br />
      <button v-on:click="join(true)" :disabled="password.length == 0">Join game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../../shared/events";

enum State {
  Init,
  Joining,
  Password
}

@Component({
  sockets: {
    [Events.invalidRoomCode]() {
      alert("Invalid Room Code");
    },
    [Events.passwordNeeded]() {
      (this as Join).askPassword(false);
    },
    [Events.invalidPassword]() {
      (this as Join).askPassword(true);
    }
  }
})
export default class Join extends Vue {
  roomCode = "";
  joinState = State.Init;
  State = State;
  password = "";
  isPasswordInvalid = false;

  get isRoomInvalid() {
    return this.roomCode.length !== 4 || /[^A-Z]/.test(this.roomCode);
  }

  join(withPassword: boolean) {
    if (this.isRoomInvalid) {
      alert("Room code is invalid.");
      return;
    }

    const payload = { gameId: this.roomCode };

    if (withPassword) {
      payload["password"] = this.password;
    }

    this.joinState = State.Joining;

    this.$socket.client.emit(Commands.joinGame, payload);
  }

  spectate() {
    if (this.isRoomInvalid) {
      alert("Room code is invalid.");
      return;
    }

    this.joinState = State.Joining;

    this.$socket.client.emit(Commands.joinGame, { gameId: this.roomCode, action: Commands.spectate});
  }

  askPassword(isRetry: boolean) {
    this.password = "";
    this.joinState = State.Password;
    this.isPasswordInvalid = isRetry;
  }
}
</script>

<style lang="scss">
.join {
  .wide {
    width: 190px;
    margin: auto;

    input {
      font-family: "HelveticaNeueBold", "HelveticaNeue-Bold",
        "Helvetica Neue Bold", "HelveticaNeue", "Helvetica Neue",
        "TeXGyreHerosBold", "Helvetica", "Tahoma", "Geneva", "Arial", sans-serif;
      font-weight: 600;
    }
  }
}
</style>
