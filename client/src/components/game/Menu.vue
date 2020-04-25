<template>
  <div class="menu">
    <b-dropdown aria-role="list">
      <button class="button is-dark is-outlined" type="button" slot="trigger">
        <b-icon icon="bars"></b-icon>
        <span>Menu</span>
      </button>

      <b-dropdown-item @click="toggleFullscreen()" aria-role="listitem">
        <div class="media">
          <b-icon class="media-left" icon="expand"></b-icon>
          <div class="media-content">
            <h3>Full Screen</h3>
            <small>Nobody needs browser bars.</small>
          </div>
        </div>
      </b-dropdown-item>

      <b-dropdown-item @click="toggleScoreboard()" aria-role="listitem">
        <div class="media">
          <b-icon class="media-left" icon="trophy"></b-icon>
          <div class="media-content">
            <h3>Toggle Scoreboard</h3>
            <small>You were winning anyway, right?</small>
          </div>
        </div>
      </b-dropdown-item>

      <b-dropdown-item @click="toggleRoomCode()" aria-role="listitem">
        <div class="media">
          <b-icon class="media-left" icon="bullhorn"></b-icon>
          <div class="media-content">
            <h3>Toggle Room Code</h3>
            <small>Other players will still be able to join.</small>
          </div>
        </div>
      </b-dropdown-item>

      <b-dropdown-item :value="false" aria-role="listitem">
        <div class="media">
          <b-icon class="media-left" icon="sign-out-alt"></b-icon>
          <div class="media-content">
            <h3>Exit Game</h3>
            <small>Go back to the main menu.</small>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Menu extends Vue {
  toggleFullscreen() {
    const doc: any = document;
    const element: any = document.body;
    const isFullscreen = doc.webkitIsFullScreen || doc.mozFullScreen || false;

    element.requestFullScreen =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      function() {
        return false;
      };
    doc.cancelFullScreen =
      doc.cancelFullScreen ||
      doc.webkitCancelFullScreen ||
      doc.mozCancelFullScreen ||
      function() {
        return false;
      };

    isFullscreen ? doc.cancelFullScreen() : element.requestFullScreen();
  }

  toggleScoreboard() {
    this.$emit("toggleScoreboard");
  }

  toggleRoomCode() {
    this.$emit("toggleRoomCode");
  }
}
</script>


<style scoped lang="scss">
</style>
