<template>
  <div class="error helvetica">
    <div class="flex">
      <b-message title="Oh no." type="is-danger" :closable="false">
        <p>Something went wrong... Please reload the page and hopefully it'll be better this time around. Sorry about that.</p>
        <br/>
        <p class="has-text-right"><b-button type="is-success" icon-left="sync-alt" outlined @click="reload()">Reload the page</b-button></p>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  methods: {
    reload() {
      location.reload()
    }
  }
})
export default class Error extends Vue {}
</script>


<style scoped lang="scss">
.error {
  background: #111111;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 99999999;
}
.flex {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  align-items: center;
  justify-content: center;
  .message {
    max-width: 500px;
  }
}
</style>
