<template>
  <div class="disconnected helvetica">
    <div class="flex">
      <b-message title="Hold on a second" type="is-warning" :closable="false">
        <div class="media">
          <div class="media-left">
            <b-icon
              pack="fas"
              icon="circle-notch"
              custom-size="fa-5x"
              type="is-primary"
              custom-class="fa-spin"
            />
          </div>
          <div class="media-content">
            <p>It looks like you've lost connection. Hold on a second while you get reconnected.</p>
            <p>If this lasts more than a couple of seconds, please refresh the page.</p>
          </div>
        </div>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  methods: {
    reload() {
      location.reload();
    }
  }
})
export default class Disconnected extends Vue {}
</script>


<style scoped lang="scss">
.disconnected {
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
    p {
      margin-bottom: 15px;
    }
  }
}
</style>
