<template>
  <div class="invite">
    <div class="modal-card" style="width: auto">
      <section class="modal-card-body">
        <p>
          <b-field>
            <b-input
              :value="url"
              icon="share-square"
              class="helvetica"
              onClick="this.select();"
              ref="input"
              expanded
            ></b-input>
            <p class="control">
              <button class="button is-primary" @click="copy()">Copy Link</button>
            </p>
          </b-field>
        </p>

        <div class="share" v-if="canShare">
          <b-button type="is-success" icon-left="link" size="is-large" expanded>Share Link</b-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState(["joinedRoom"])
  }
})
export default class Invite extends Vue {
  get url(this: any): string {
    return `https://cafh.herokuapp.com/# Room Code: ${this.joinedRoom}`;
  }

  get canShare(): boolean {
    return (navigator as any).share !== undefined;
  }

  share(this: any) {
    (navigator as any).share({
      title: `Join me with room code: ${this.joinedRoom}`,
      url: `https://cafh.herokuapp.com/`
    });
  }

  copy() {
    (this.$refs.input as any).focus();

    document.execCommand("copy");
    navigator.clipboard.writeText(this.url);
  }
}
</script>


<style scoped lang="scss">
.share {
  padding-top: 20px;
}

.modal-card {
  border-radius: 5px;
}
</style>
