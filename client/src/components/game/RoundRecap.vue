<template>
  <div class="round-recap">
    <div class="columns">
      <div class="column info helvetica">
        <p v-if="winner">
          {{ winner }}
          <span class="muted">wins this round.</span>
        </p>
        <p v-if="czar">
           {{ czar }}
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
import { mapState } from 'vuex';

@Component({
  components: {
    Scoreboard
  },
  computed: {
    ...mapState(["gameState"]),
    czar() {
      return (this as any).gameState.players.find((player) => player.czar === true)?.name
    },
    winner() {
      return (this as any).gameState.players.find((player) => player.winner === true)?.name
    }
  }
})
export default class RoundRecap extends Vue {
  
}
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
