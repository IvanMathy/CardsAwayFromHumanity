<template>
  <div class="round-recap">
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
