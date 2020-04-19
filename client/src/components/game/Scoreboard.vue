<template>
  <div class="scoreboard">
    <div class="countdown helvetica">Next round in 5.</div>
    <div class="columns">
      <div class="column info helvetica">
        <p>
          Player One
          <span class="muted">wins this round.</span>
        </p>
        <p>
          Elwood Blues
          <span class="muted">is the next Czar.</span>
        </p>
      </div>
      <div class="column">
        <h2 class="scores-title">Scores</h2>
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
    { id: "CC", name: "Mom", score: 2 },
    { id: "CC", name: "HelloThere", score: 8, czar: true },
    { id: "CC", name: "Test", score: 12 },
    { id: "CC", name: "AAAAAAAAAA", score: 0 },
    { id: "CC", name: "Me", score: 3 }
  ].sort((a, b) => b.score - a.score);
}
</script>


<style scoped lang="scss">
.columns {
  margin: 0;
  padding-top: 100px;
}

.scoreboard {
  max-width: 600px;
  margin: auto;
}
.countdown {
  background-color: black;
  width: 300px;
  height: 60px;
  margin: auto;
  margin-bottom: 60px;
  font-size: 25px;
  padding-top: 8px;
  color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  position: fixed;
  right: 0;
  left: 0;
  margin-right: auto;
  margin-left: auto;
  z-index: 1000;
}

.player-score {
  position: relative;
  width: 300px;
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

.scores-title {
  color: white;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: right;
  font-size: 35px;
  color: white;
  line-height: 35px;
  padding-top: 25px;
  p {
    margin-bottom: 15px;
  }
  .muted {
    color: #aaaaaa;
  }
}

@media only screen and (max-width: 769px) {
  .player-score {
    margin: 0px auto;
    margin-top: 5px;
  }

  .info {
    text-align: center;
    font-size: 25px;
  }
}
</style>
