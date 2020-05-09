<template>
  <div class="game">
    <Timer v-if="gameState.stage == Stage.pickingCards || gameState.stage == Stage.startingRound" />

    <Menu @toggleScoreboard="showScoreboard ^= true" @toggleRoomCode="showRoomCode ^= true" />

    <div v-if="gameState == null">Loading.</div>
    <div v-else>
      <div
        v-if="gameState.stage == Stage.waitingToStart || gameState.stage == Stage.notEnoughPlayers"
        class="fullscreen centeredText"
      >
        <RoundRecap class="fullscreen" />
      </div>
      <div v-else-if="currentState == State.spectating"></div>
      <template v-else-if="gameState.stage == Stage.pickingCards">
        <div class="fullscreen centeredText" v-if="user.isCzar">
          <p class="hero helvetica">You are the Czar.</p>
          <p class="secondary">Wait for other players to pick their cards.</p>
        </div>
        <CardPicker v-else />
      </template>
      <template v-else-if="gameState.stage == Stage.pickingWinner">
        <CardPicker v-if="user.isCzar" />
        <CardViewer v-else />
      </template>
      <RoundRecap v-else-if="gameState.stage == Stage.startingRound" />
    </div>
    <transition name="fade">
      <div class="join helvetica is-hidden-mobile" v-if="showRoomCode">
        Join at
        <span class="has-text-info">away.game</span>
        <br />with room code
        <br />
        <span class="room-code has-text-light">{{ this.$store.state.joinedRoom }}</span>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Timer from "./Timer.vue";
import Menu from "./Menu.vue";
import CardPicker from "./CardPicker.vue";
import CardViewer from "./CardViewer.vue";
import {
  Events,
  Commands,
  GameEvents,
  GameStage,
  GameCommand
} from "../../../shared/events";
import { Socket } from "vue-socket.io-extended";
import { mapState } from "vuex";
import RoundRecap from "./RoundRecap.vue";
import ClientState from "../../store/index";

@Component({
  components: {
    RoundRecap,
    Timer,
    Menu,
    CardPicker,
    CardViewer
  },
  computed: {
    ...mapState(["gameState", "user", "currentState"])
  }
})
export default class Game extends Vue {
  Stage = GameStage;
  State = ClientState;
  showRoomCode = true;
}
</script>

<style scoped lang="scss">
.game {
  color: white;

  .join {
    background-color: #1c1c1c;
    font-weight: 500;
    color: #888888;
    line-height: 12px;
    padding: 10px 18px;
    border-radius: 10px;
    top: 10px;
    right: 10px;
    position: fixed;
    font-size: 12px;
    .room-code {
      font-size: 45px;
      font-weight: 800;
      line-height: 44px;
    }
  }
  .menu {
    top: 10px;
    left: 10px;
    position: fixed;
  }
  .waiting {
    padding-top: 50px;
  }

  .fullscreen {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .centeredText {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .hero {
      font-size: 35px;
      padding: 10px;
    }
    .secondary {
      color: #cccccc;
      padding: 10px;
    }
    .button {
      margin: 10px;
    }
  }
}
</style>
