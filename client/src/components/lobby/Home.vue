<template>
  <div class="home columns">
    <div class="column smaller">
      <h1 class="helvetica">
        Cards
        <br />Away
        <br />From
        <br />Humanity
      </h1>
    </div>
    <div class="column">
      <article class="panel is-primary">
        <p class="panel-heading helvetica">Game Lobby</p>
        <b-tabs v-model="activeTab" position="is-centered">
          <b-tab-item label="Welcome" icon="home">
            <p>Welcome! What would you like to do?</p>

            <p>
              <b-button
                type="is-dark"
                size="is-medium"
                icon-left="sign-in-alt"
                expanded
                v-on:click="activeTab = 1"
              >Join an existing Game</b-button>
            </p>
            <p>
              <b-button
                type="is-primary"
                size="is-medium"
                icon-left="plus-square"
                expanded
                
                v-on:click="host()"
              >Host a new Game</b-button>
            </p>
          </b-tab-item>

          <b-tab-item label="Join" icon="sign-in-alt">
            <Join />
          </b-tab-item>

          <b-tab-item label="Public Games" icon="globe">
            <GameList />
          </b-tab-item>
          <!-- 
          <b-tab-item label="About" icon="heart">
            Nunc nec velit nec libero vestibulum eleifend.
            Curabitur pulvinar congue luctus.
            Nullam hendrerit iaculis augue vitae ornare.
            Maecenas vehicula pulvinar tellus, id sodales felis lobortis eget.
          </b-tab-item>-->
        </b-tabs>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Host from "./Host.vue";
import Join from "./Join.vue";
import GameList from "./GameList.vue";

@Component({
  components: {
    Host,
    Join,
    GameList
  }
})
export default class Home extends Vue {
  activeTab = null;
  roomCode = "";

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
  max-width: 750px;
  margin: auto !important;

  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;

  height: 100%;

  .smaller {
    max-width: 300px;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    color: white;
    line-height: 28px;
    font-size: 32px;
    text-align: right;
    margin: 20px;
  }
  .panel-block {
    background-color: white;
  }

  .b-tabs {
    background-color: white;
    margin-bottom: 0;
    padding-top: 3px;
    border-radius: 0 0 4px 4px;

    p {
      margin-bottom: 15px;
    }
    .tabs {
      .icon {
        height: 1.1rem !important;
        width: 1.1rem !important;
        svg {
          height: 1.1rem !important;
          width: 1.1rem !important;
        }
      }
    }
  }
}
</style>
