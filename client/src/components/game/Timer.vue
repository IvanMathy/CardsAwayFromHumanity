<template>
  <div class="timer">
    Next round in {{this.$store.state.time}}.
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Timer extends Vue {}
</script>


<style scoped lang="scss">

.timer {
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
  top: 0;
  right: 0;
  left: 0;
  margin-right: auto;
  margin-left: auto;
  z-index: 1000;
}

</style>
