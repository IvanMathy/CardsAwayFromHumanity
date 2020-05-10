<template>
  <div class="round-recap">
    <div class="columns">
      <div class="column infoColumn">
        <div v-if="gameState.stage == Stage.waitingToStart">
          <div v-if="user.isRoomHost">
            <p class="hero helvetica">You are the host.</p>

            

            <b-tooltip
              v-if="gameState.players.length < 3"
              type="is-light"
              multilined
              size="is-small"
              label="You need at least 3 players to start a game."
            >
              <b-button type="is-primary" size="is-medium" class="spaced helvetica" disabled>Start Game</b-button>
            </b-tooltip>
            <b-button
              v-else
              type="is-primary"
              size="is-medium"
              @click="startGame()"
              class="spaced helvetica"
            >Start Game</b-button>
            <p class="smaller muted">Players can still join after you start.</p>
          </div>
          <p class="hero helvetica" v-else>
            Waiting for
            <strong class="has-text-success">{{ hostName }}</strong>to start.
          </p>
        </div>

        <div v-else-if="gameState.stage == Stage.notEnoughPlayers" class="fullscreen centeredText">
          <p class="hero helvetica">Not enough players.</p>
          <p
            class="muted smaller"
            v-if="gameState.players.length == 2"
          >The game will start again once another player joins.</p>
          <p class="muted smaller" v-else>You are alone in this room. That sounds awesome.</p>
        </div>
        <div v-else class="fullscreen info centeredText">
          <p v-if="winner">
            {{ winner }}
            <span class="muted">wins this round.</span>
          </p>
          <p v-if="czar">
            {{ czar }}
            <span class="muted">is the next Czar.</span>
          </p>
        </div>
      </div>
      <div class="column">
        <h2 class="scores-title helvetica">{{ boardTitle }}</h2>
        <Scoreboard />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Scoreboard from "./Scoreboard.vue";
import { mapState } from "vuex";
import { GameStage, Commands, GameCommand } from "../../../shared/events";

@Component({
  components: {
    Scoreboard
  },
  computed: {
    ...mapState(["gameState", "user"]),
    czar() {
      return (this as any).gameState.players.find(
        player => player.czar === true
      )?.name;
    },
    winner() {
      return (this as any).gameState.players.find(
        player => player.winner === true
      )?.name;
    },
    hostName() {
      return (
        (this as any).gameState.players.find(player => player.host === true)
          ?.name ?? "the host"
      );
    },
    boardTitle() {
      if ((this as any).gameState.stage == GameStage.waitingToStart) {
        return "Players";
      } else {
        return "Scores";
      }
    }
  }
})
export default class RoundRecap extends Vue {
  Stage = GameStage;
  startGame() {
    this.$socket.client.emit(Commands.gameCommand, GameCommand.startGame);
  }
}
</script>


<style scoped lang="scss">
.round-recap {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.columns {
  margin: 0;
  padding-top: 100px;
}

.round-recap {
  max-width: 800px;
  margin: auto;
}

.infoColumn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  font-size: 35px;
  color: white;
  padding-top: 25px;
  p {
    margin-bottom: 15px;
    line-height: 35px;
  }
  .muted {
    color: #aaaaaa;
  }

  .spaced {
    margin: 22px 0 25px 0;
  }

  .smaller {
    font-size: 15px;
  }
}

@media only screen and (max-width: 769px) {
  .player-score {
    margin: 0px auto;
    margin-top: 5px;
  }

  .infoColumn {
    text-align: center;
    font-size: 25px;
  }
}
</style>
