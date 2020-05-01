<template>
  <div class="game">
    <Timer />

    <Menu @toggleScoreboard="showScoreboard ^= true" @toggleRoomCode="showRoomCode ^= true" />
    <transition name="fade">
      <div class="join helvetica is-hidden-mobile" v-if="showRoomCode">
        Join at
        <span class="has-text-info">away.game</span>
        <br />with room code
        <br />
        <span class="room-code has-text-light">{{ this.$store.state.joinedRoom }}</span>
      </div>
    </transition>
    <div>
      <!-- <h1></h1>
      <h1>Is Host: {{ this.$store.state.user.isRoomHost }}</h1>
      <h2>Players</h2>
      <p v-for="player in gameState.players" :key="player.id">
        {{ player.name }}
        <span v-if="player.host">HOST</span>
      </p>
      {{gameState.stage}}
      <p>{{gameState}}</p>
      <p>{{gameState.time}}</p>-->

      <div v-if="gameState == null">Loading.</div>
      <div v-if="gameState.stage == Stage.notEnoughPlayers" class="waiting">
        <p>Not enough players.</p>
      </div>
      <div v-if="gameState.stage == Stage.waitingToStart" class="waiting">
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
      <div v-else-if="currentState == State.spectating"></div>
      <div v-else>
        <template v-if="gameState.stage == Stage.pickingCards">
          <p  v-if="user.isCzar">You are the Czar</p>
           <CardPicker  v-else/>
        </template>
        <RoundRecap v-if="gameState.stage == Stage.startingRound" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Timer from "./Timer.vue";
import Menu from "./Menu.vue";
import CardPicker from "./CardPicker.vue";
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
    CardPicker
  },
  computed: {
    ...mapState(["gameState", "user", "currentState"])
  }
})
export default class Game extends Vue {
  Stage = GameStage
  State = ClientState
  showRoomCode = true

  startGame() {
    this.$socket.client.emit(Commands.gameCommand, GameCommand.startGame);
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
}
</style>
