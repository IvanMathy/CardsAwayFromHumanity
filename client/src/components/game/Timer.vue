<template>
  <div class="timer helvetica">{{ text }} {{this.$store.state.gameState.time}}.</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GameStage } from "../../../shared/events";

@Component({
  computed: {
    text() {
      switch (this.$store.state.gameState.stage) {
        case GameStage.waitingToStart:
          return "Starting  in";
        case GameStage.startingRound:
          return "Next round in";
        case GameStage.pickingCards:
          return "Round ends in";
        case GameStage.pickingWinner:
          return "Selection ends in";
      }
    }
  }
})
export default class Timer extends Vue {}
</script>


<style scoped lang="scss">
.timer {
  background-color: black;
  width: 200px;
  height: 40px;
  margin: auto;
  margin-bottom: 60px;
  font-size: 16px;
  padding-top: 8px;
  color: #ccc;
  border-bottom-left-radius: 10px;
  position: fixed;
  @media (min-width: 769px) {
    width: 250px;
    height: 50px;
    font-size: 20px;
    left: 0;
    border-bottom-right-radius: 10px;
  }
  top: 0;
  right: 0;
  margin-right: auto;
  margin-left: auto;
  z-index: 1000;
}
</style>
