<template>
  <div class="round-recap">
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
        <Scoreboard/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Scoreboard from "./Scoreboard.vue";

@Component({
  components: {
    Scoreboard
  }
})
export default class RoundRecap extends Vue {}
</script>


<style scoped lang="scss">
.columns {
  margin: 0;
  padding-top: 100px;
}

.round-recap {
  max-width: 800px;
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
