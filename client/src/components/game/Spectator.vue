<template>
  <div class="spectator">
    <div class="join helvetica">
      Join at
      <span class="has-text-info">away.game</span>
      <br />with room code
      <br />
      <span class="room-code has-text-light">JEPS</span>
    </div>
    <div>
      <p class="helvetica prompt">Pick an answer on your device.</p>
      <div class="black-card-container">
        <p class="black-card helvetica">What is Batman's guilty pleasure?</p>
      </div>
    </div>
    <Scoreboard class="scoreboard" />
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
export default class Spectator extends Vue {}
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
    top: 10px;
    left: 10px;
    transform-origin: top left;
    transform: scale(0.7);
    height: 100%;
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
}
</style>
