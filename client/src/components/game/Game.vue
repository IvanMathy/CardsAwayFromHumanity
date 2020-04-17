<template>
  <div class="game">
    Hello
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands, GameEvents } from "../../../shared/events";
import { Socket } from 'vue-socket.io-extended';

@Component
export default class Game extends Vue {
  @Socket(GameEvents.stateChanged)
  onStateChanged (newState) {
    alert(newState)
  }
}
</script>

<style scoped lang="scss">
</style>
