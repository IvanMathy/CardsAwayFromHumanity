<template>
  <div class="spectator">


    <transition name="fade">
      <Scoreboard class="scoreboard" v-if="showScoreboard" />
    </transition>

    <WaitingRoom v-if="gameState.stage == Stage.waitingToStart" />

    <div class="hero" v-if="gameState.stage == Stage.pickingCards">
      <p class="helvetica prompt">Pick an answer on your device.</p>
      <div class="black-card-container">
        <p class="black-card helvetica">{{ getBlackCard(gameState.gameInfo.blackCard) }}</p>
      </div>
    </div>

   <CardViewer />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Scoreboard from "./Scoreboard.vue";
import WaitingRoom from "./WaitingRoom.vue";
import CardViewer from "./CardViewer.vue";
import { GameStage, GameState } from "../../../shared/events";
import { mapState } from "vuex";

@Component({
  components: {
    Scoreboard,
    WaitingRoom,
    CardViewer
  },
  computed: {
    ...mapState(["gameState"])
  }
})
export default class Spectator extends Vue {
  showScoreboard = false;
  showRoomCode = true;

  Stage = GameStage;

  
  getCzarName(): string {
    return (
      ((this as any).gameState as GameState).players.find(p => p.czar === true)
        ?.name ?? "Someone"
    );
  }
}
</script>

<style scoped lang="scss">
@import url("styles.scss");

.spectator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
  .scoreboard {
    position: absolute;
    bottom: 10px;
    right: 10px;
    transform-origin: bottom right;
    transform: scale(0.7);
    opacity: 0.7;
  }

  
  .prompt {
    color: white;
    width: 300px;
    margin: auto;
    font-size: 40px;
    line-height: 40px;
    margin-bottom: 60px;
  }

  @media only screen and (max-height: 700px) {
    .hero {
      padding-top: 300px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
