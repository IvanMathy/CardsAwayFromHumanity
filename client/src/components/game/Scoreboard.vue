<template>
  <div class="scoreboard">
    <template v-if="gameState.players.length">
      <div v-for="player in gameState.players" :key="player.id">
        <div
          class="player-score helvetica is-flex-touch"
          :class="{czar: player.czar && gameState.stage !== Stage.notEnoughPlayers, winner: player.winner && gameState.stage !== Stage.notEnoughPlayers}"
        >

          <b-tooltip label="Round Winner" type="is-light" class="player-icon" v-if="player.winner">
            <b-icon size="is-small" icon="star" class="has-text-primary" />
          </b-tooltip>
          <b-tooltip label="Card Czar" type="is-light" class="player-icon" v-else-if="player.czar && gameState.stage !== Stage.notEnoughPlayers">
            <b-icon size="is-small" icon="chess-king" class="has-text-grey" />
          </b-tooltip>
          <b-tooltip label="Game Host" type="is-light" class="player-icon" v-else-if="player.host">
            <b-icon size="is-small" icon="home" class="has-text-grey-light" />
          </b-tooltip>
          <span class="score" v-if="gameState.stage != Stage.waitingToStart">{{player.score}}</span>
          {{player.name}}
        </div>
      </div>
    </template>
    <div class="player-score helvetica is-flex-touch czar waiting" v-else>
      No one has joined yet.
    </div>
    <b-button type="is-dark" size="is-medium" outlined expanded inverted @click="startGame()" class="invite helvetica">Invite Players</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { GameStage } from "../../../shared/events";

@Component({
  computed: {
    ...mapState(["gameState"])
  }
})
export default class Scoreboard extends Vue {
  Stage = GameStage;
}
</script>


<style scoped lang="scss">
.scoreboard {
  max-width: 400px;
  min-width: 300px;
  margin: auto;
}
.player-score {
  position: relative;
  background-color: #444444;
  color: white;
  padding: 10px 35px;
  margin-top: 5px;
  text-align: left;
  font-size: 20px;
  border-radius: 5px;
  height: 50px;
  .score {
    color: white;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: black;
    font-size: 33px;
    width: 55px;
    text-align: center;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .player-icon {
    position: absolute;
    left: 10px;
    top: 17px;
  }
}

.waiting {
  text-align: center;
}

.invite {
  margin-top: 5px;
}

.player-score.czar {
  background-color: #2c2c2c;
  color: #777777;
  .score {
    color: #777777;
  }
}

.player-score.winner {
  background-color: white;
  color: black;
}

@media only screen and (max-width: 769px) {
  .player-score {
    margin: 0px auto;
    margin-top: 5px;
  }
}
</style>
