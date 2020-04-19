<template>
  <div class="game">
    <div v-if="gameState == null">Loading.</div>
    <div>
      <h1>{{ this.$store.state.joinedRoom }}</h1>
      <h1>Is Host: {{ this.$store.state.user.isRoomHost }}</h1>
      <h2>Players</h2>
      <p v-for="player in gameState.players" :key="player.id">
        {{ player.name }}
        <span v-if="player.host">HOST</span>
      </p>
      <div v-if="gameState.stage == Stage.waitingToStart">
        <p>Waiting to Start</p>

        <div v-if="this.$store.state.user.isRoomHost">
          <b-tooltip
            v-if="gameState.players.length < 3"
            type="is-light"
            multilined
            label="You need at least 3 players to start a game."
          >
            <b-button type="is-primary" outlined disabled>Start Game</b-button>
          </b-tooltip>
          <b-button v-else type="is-primary" outlined @click="startGame()">Start Game</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  Events,
  Commands,
  GameEvents,
  GameStage,
  GameCommand
} from "../../../shared/events";
import { Socket } from "vue-socket.io-extended";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState(["gameState"])
  }
})
export default class Game extends Vue {
  Stage = GameStage;

  startGame() {

    this.$socket.client.emit(Commands.gameCommand, GameCommand.startGame);
  }
}
</script>

<style scoped lang="scss">
.game {
  color: white;
}
</style>
