<template>
  <div class="join">

    <div v-if="joinState == State.Init">
      <br>Room Code:
      <input v-model="roomCode"  @input="roomCode=$event.target.value.toUpperCase()">
      <br>
      <button v-on:click="join(false)" :disabled="isRoomInvalid">Join game</button>
    </div>
    <div v-if="joinState == State.Joining">
      Joining {{roomCode}}.
    </div>
    <div v-if="joinState == State.Password">
      <br>Password:
      <input v-model="password" type="password">
      <br>
      <p v-if="isPasswordInvalid">Password is invalid</p>
      <br>
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
      (this as Join).askPassword(false)
    },
    [Events.invalidPassword]() {
      (this as Join).askPassword(true)
    }
  }
})

export default class Join extends Vue {
  roomCode = ""
  joinState = State.Init
  State = State
  password = ""
  isPasswordInvalid = false

  get isRoomInvalid() {
    return this.roomCode.length !== 4 || /[^A-Z]/.test(this.roomCode)
  }

  join(withPassword: boolean) {

    if (this.isRoomInvalid) {
      alert("Room code is invalid.");
      return;
    }

    const payload = { gameId: this.roomCode }

    if(withPassword) {
      payload['password'] = this.password 
    }

    this.joinState = State.Joining

    this.$socket.client.emit(
      Commands.joinGame,
      payload,
      (gameId: string) => {
        if (gameId == undefined) {
          alert("Could not create game. Sorry!");
          return;
        }
      }
    );
  }

  askPassword(isRetry: boolean) {
    this.password = ""
    this.joinState = State.Password
    this.isPasswordInvalid = isRetry
  }
}
</script>

<style scoped lang="scss">
</style>
