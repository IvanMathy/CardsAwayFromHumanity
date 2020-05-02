<template>
  <div class="waitingRoom">
    <p>Waiting to Start</p>

    <div v-if="user.isRoomHost">
      <b-tooltip
        v-if="gameState.players.length > 3"
        type="is-light"
        multilined
        label="You need at least 3 players to start a game."
      >
        <b-button type="is-primary" outlined disabled>Start Game</b-button>
      </b-tooltip>
      <b-button v-else type="is-primary" outlined @click="startGame()">Start Game</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  Commands,
  GameCommand
} from "../../../shared/events";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState(["gameState", "user"])
  }
})
export default class Game extends Vue {
  startGame() {
    this.$socket.client.emit(Commands.gameCommand, GameCommand.startGame);
  }
}
</script>

<style lang="scss">
.waitingRoom {
  color: white;
}
</style>
