<template>
  <div class="columns">
    <div class="column">First column</div>
    <div class="column">
        <b-button type="is-light" v-on:click="host()">Host</b-button>
      <Join />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Host from "./Host.vue";
import Join from "./Join.vue";

@Component({
  components: {
    Host,
    Join
  }
})
export default class Home extends Vue {
  host() {
    this.$buefy.modal.open({
      parent: this,
      component: Host,
      hasModalCard: true,
      trapFocus: true,
      width: 420
    });
  }
}
</script>

<style scoped lang="scss">
.panel-block {
  background-color: white;
}
</style>
