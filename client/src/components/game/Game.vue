<template>
  <div class="game">
    <div>
      <h1>{{ this.$store.state.joinedRoom }}</h1>
      <h2>Players</h2>
      <p v-for="player in players" :key="player.id">
        {{ player.name }} <span v-if="player.host">HOST</span>
      </p>
{{gameState.stage}}
      <p v-if="gameState.stage == Stage.waitingToStart">Waiting to Start</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands, GameEvents, GameStage } from "../../../shared/events";
import { Socket } from 'vue-socket.io-extended';
import { mapState } from 'vuex';

@Component({
  computed: {
    ...mapState(['gameState'])
  },
})
export default class Game extends Vue {

  Stage = GameStage

  players = []

  @Socket(GameEvents.stateChanged)
  onStateChanged (newState) {
    this.players = newState.players
  }
}
</script>

<style scoped lang="scss">
.game {
  color: white;
}
</style>
