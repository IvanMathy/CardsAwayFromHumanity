<template>
  <div class="scoreboard">
    <div v-for="player in scores" :key="player.id">
      <div
        class="player-score helvetica is-flex-touch"
        :class="{czar: player.czar, winner: player.won}"
      >
        <b-tooltip label="Card Czar" type="is-light" class="player-icon" v-if="player.czar">
          <b-icon size="is-small" icon="chess-king" class="has-text-grey" />
        </b-tooltip>
        <b-tooltip label="Round Winner" type="is-light" class="player-icon" v-if="player.won">
          <b-icon size="is-small" icon="star" class="has-text-primary" />
        </b-tooltip>
        <span class="score">{{player.score}}</span>
        {{player.name}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Scoreboard extends Vue {
  scores = [
    { id: "AA", name: "Elwood Blues", score: 1, host: true },
    { id: "BB", name: "Player One", score: 3, won: true },
    { id: "CC", name: "Somebody With a Name", score: 6 },
    { id: "DD", name: "Mom", score: 2 },
    { id: "EE", name: "HelloThere", score: 8, czar: true },
    { id: "FF", name: "Test", score: 12 },
    { id: "GG", name: "AAAAAAAAAA", score: 0 },
    { id: "HH", name: "Me", score: 3 }
  ].sort((a, b) => b.score - a.score);
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
