<template>
  <div class="game">
    <Timer
      v-if="gameState.stage == Stage.pickingCards || gameState.stage == Stage.startingRound || gameState.stage == Stage.pickingWinner || gameState.stage == Stage.celebratingWinner || gameState.stage == Stage.notEnoughCardsPlayed"
    />

    <div v-if="gameState == null">Loading.</div>
    <div v-else>

      <div class="black-card-container" v-if="showBlackCard">
        <p class="hero helvetica">{{ heroText }}</p>
        <p class="black-card helvetica">{{getBlackCard(gameState.gameInfo.blackCard)}}</p>
      </div>

      <div
        v-if="gameState.stage == Stage.waitingToStart || gameState.stage == Stage.startingRound || gameState.stage == Stage.notEnoughPlayers || gameState.stage == Stage.gameOver"
        class="fullscreen centeredText"
      >
        <RoundRecap class="fullscreen" @invite="invitePlayers()"/>
      </div>
      <template v-else-if="gameState.stage == Stage.pickingCards">
        <div class="fullscreen centeredText" v-if="user.isCzar">
          <p class="hero helvetica">You are the Czar.</p>
          <p class="secondary">Wait for other players to pick their cards.</p>
        </div>
        <CardPicker v-else-if="!isSpectator" />
      </template>
      <template v-else-if="gameState.stage == Stage.pickingWinner">
        <CardPicker v-if="user.isCzar" :key="gameState.players" />
        <CardViewer v-else />
      </template>
      <template
        v-else-if="gameState.stage == Stage.pickingWinner || gameState.stage == Stage.celebratingWinner"
      >
        <CardViewer />
      </template>
      <div
        class="fullscreen centeredText"
        v-else-if="gameState.stage == Stage.notEnoughCardsPlayed"
      >
        <p class="hero helvetica">Not enough cards played.</p>
        <p class="secondary">Skipping to next round.</p>
      </div>
    </div>
    <transition name="fade">
      <div class="join helvetica is-hidden-mobile" v-if="showRoomCode">
        Join at
        <span class="has-text-info">cafh.herokuapp.com</span>
        <br />with room code
        <br />
        <span class="room-code has-text-light">{{ this.$store.state.joinedRoom }}</span>
      </div>
    </transition>

    <Menu @toggleScoreboard="showScoreboard ^= true" @toggleRoomCode="showRoomCode ^= true" />
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
import { ClientState } from "../../store/index";
import { blackCards } from "../meta/cards";
import Invite from './Invite.vue';

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

  get showBlackCard(this: any): boolean {
    if (
      this.gameState.stage == GameStage.waitingToStart ||
      this.gameState.stage == GameStage.notEnoughPlayers ||
      this.gameState.stage == GameStage.startingRound ||
      this.gameState.stage == GameStage.notEnoughCardsPlayed ||
      this.gameState.stage == GameStage.gameOver
    ) {
      return false;
    }
    if (this.gameState.stage == GameStage.pickingCards) {
      return !this.user.isCzar;
    }
    return true;
  }

  get czar(this: any) {
    return this.gameState.players.find(player => player.czar === true)?.name;
  }
  get winner(this: any) {
    return this.gameState.players.find(player => player.winner === true)?.name;
  }


  get isSpectator(this: any): boolean {
    return this.currentState == ClientState.spectating
  }

  get heroText(this: any): string {
    switch (this.gameState.stage) {
      case GameStage.pickingCards:
        if(this.isSpectator) {
          return "Players are picking their cards.";
        } else {
          return "Pick a card.";
        }
      case GameStage.pickingWinner:
        if (this.user.isCzar) {
          return "Pick the winner.";
        } else {
          return `${this.czar} is picking a winner.`;
        }
      case GameStage.celebratingWinner:
        return `${this.winner} is the winner.`;
      default:
        return "";
    }
  }

  getBlackCard(card: number) {
    return (
      blackCards[card] ?? "Card not found?? Please tell the dev thank you!"
    );
  }

  invitePlayers() {
    this.$buefy.modal.open({
      parent: this,
      component: Invite,
      hasModalCard: true,
      trapFocus: true,
      width: 400
    });
  }
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

  .hero {
    font-size: 35px;
    padding: 10px;
    line-height: 45px;
  }

  .centeredText {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .secondary {
      color: #cccccc;
      padding: 10px;
    }
    .button {
      margin: 10px;
    }
  }

  .black-card-container {
    position: absolute;
    bottom: 100px;
    width: 100%;

    .black-card {
      transform: scale(0.9);
    }
  }
}
</style>
