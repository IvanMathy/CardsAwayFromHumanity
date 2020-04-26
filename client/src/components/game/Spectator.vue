<template>
  <div class="spectator">
    <Timer />

    <transition name="fade">
      <div class="join helvetica" v-if="showRoomCode">
        Join at
        <span class="has-text-info">away.game</span>
        <br />with room code
        <br />
        <span class="room-code has-text-light">JEPS</span>
      </div>
    </transition>
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

    <div class="cards-container">
      <div class="cards topCards">
        <div class="card-container" v-for="card in topCards" :key="card">
          <p class="white-card helvetica">{{ getWhiteCard(card)}}</p>
        </div>
      </div>
      <div class="cards">
        <div class="card-container" v-for="card in bottomCards" :key="card">
          <p class="white-card helvetica">{{ getWhiteCard(card)}}</p>
        </div>
      </div>
    </div>
    <Menu @toggleScoreboard="showScoreboard ^= true" @toggleRoomCode="showRoomCode ^= true" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Scoreboard from "./Scoreboard.vue";
import Timer from "./Timer.vue";
import Menu from "./Menu.vue";
import WaitingRoom from "./WaitingRoom.vue";
import { GameStage } from "../../../shared/events";
import { mapState } from "vuex";
import { blackCards, whiteCards } from "../meta/cards";

@Component({
  components: {
    Scoreboard,
    Timer,
    Menu,
    WaitingRoom
  },
  computed: {
    ...mapState(["gameState"])
  }
})
export default class Spectator extends Vue {
  showScoreboard = true;
  showRoomCode = true;

  topCards = [1, 2, 3, 4];
  bottomCards = [5, 6, 7, 8];

  Stage = GameStage;

  getBlackCard(card: number) {
    return blackCards[card];
  }

  getWhiteCard(card: number) {
    return whiteCards[card];
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
    left: 10px;
    transform-origin: bottom left;
    transform: scale(0.7);
    opacity: 0.7;
  }

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

  .cards-container {

    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
  }

  .topCards {
    margin-left: 50px !important;
  }

  .cards {
    margin: auto;
    display: flex;
    justify-content: center;
    transform: scale(0.8);
    height:150px;

    .card-container {
      margin: -5px;
    }
  }


  .prompt {
    color: white;
    width: 300px;
    margin: auto;
    font-size: 40px;
    line-height: 40px;
    margin-bottom: 60px;
  }

  .black-card-container {
    height: 400px;
  }

  .menu {
    top: 10px;
    left: 10px;
    position: fixed;
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
