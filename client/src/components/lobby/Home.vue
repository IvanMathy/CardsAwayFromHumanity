<template>
  <div class="home columns">
    <div class="column">
      <h1 class="helvetica">
        Cards
        <br />Away
        <br />From
        <br />Humanity
      </h1>
    </div>
    <div class="column">
      <b-button type="is-light" v-on:click="host()">Host</b-button>
      <Join />
      <article class="panel is-primary">
        <p class="panel-heading helvetica">Game Lobby</p>
        <b-tabs v-model="activeTab" position="is-centered">
          <b-tab-item label="Welcome" icon="home">
            <p>Welcome! What would you like to do?</p>
            <p>
              <b-button
                type="is-success"
                size="is-medium"
                icon-left="mobile"
                expanded
                v-on:click="join()"
              >Host a new Game</b-button>
            </p>
            <p>
              <b-button
                type="is-info"
                size="is-medium"
                icon-left="mobile"
                expanded
                v-on:click="activeTab = 1"
              >Join an existing Game</b-button>
            </p>
          </b-tab-item>

          <b-tab-item label="Join" icon="sign-in-alt">
            Lorem
            <br />ipsum
            <br />dolor
            <br />sit
            <br />amet.
          </b-tab-item>

          <b-tab-item label="Public Games" icon="globe">
            Nunc nec velit nec libero vestibulum eleifend.
            Curabitur pulvinar congue luctus.
            Nullam hendrerit iaculis augue vitae ornare.
            Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
          </b-tab-item>

          <b-tab-item label="About" icon="heart">
            Nunc nec velit nec libero vestibulum eleifend.
            Curabitur pulvinar congue luctus.
            Nullam hendrerit iaculis augue vitae ornare.
            Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
          </b-tab-item>
        </b-tabs>
      </article>
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
  activeTab = null;

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

<style lang="scss">
.home {
  max-width: 900px;
  margin: 10px auto !important;
  
  h1 {
    color: white;
    line-height: 24px;
    font-size: 26px;
    text-align: left;
    width: 120px;
    margin: 20px auto;
  }
  .panel-block {
    background-color: white;
  }

  .b-tabs {
    background-color: white;
    margin-bottom: 0;
    padding-top: 3px;

    p {
      margin: 5px;
    }
  }

  .icon {
    height: 1.1rem !important;
    width: 1.1rem !important;
    svg {
      height: 1.1rem !important;
      width: 1.1rem !important;
    }
  }
}
</style>
