<template>
  <div class="authenticate">
    <h1 class="helvetica">
      Cards
      <br />Away
      <br />From
      <br />Humanity
    </h1>

    <transition name="slide-fade">
      <div class="box auth is-size-6 has-text-centered" v-if="accepted">
        <p>
          <strong class="helvetica">Welcome aboard!</strong><br/> What should we call you?
        </p>
        <b-field>
          <b-input v-model="username" icon="user" size="is-medium" placeholder="Guest"></b-input>
          <p class="control">
            <b-button type="is-primary" size="is-medium" v-on:click="authenticate()" :disabled="username == ''" :loading="buttonLoading">Next</b-button>
          </p>
        </b-field>
        <b-message type="is-info" size="is-small">
            Remember kids, it's cool to be kind!
        </b-message>
      </div>
    </transition>

    <transition name="slide-fade">
      <div class="box is-size-6" v-if="!accepted">
        <p>
          Welcome!
          <i>Cards Away From Humanity</i> is an
          <strong>unofficial</strong>,
          <strong>unauthorized</strong>,
          <strong>unaffiliated</strong>, and quite frankly
          <strong>underwhelming</strong> online version of
          <a
            href="https://cardsagainsthumanity.com/"
            target="_blank"
          >Card Against Humanity</a>
          so that you can be horrible people with your family, friends, colleagues, or complete strangers while staying home.
        </p>
        <b-collapse :open="false" position="is-bottom" aria-id="contentIdForA11y1">
          <template slot="trigger" slot-scope="props">
            <b-button v-if="props.open" type="is-light" expanded icon-right="angle-up">Read Less</b-button>
            <span v-else>
              <b-button type="is-light" expanded icon-right="angle-down">Read More</b-button>
            </span>
          </template>
          <p>This game is provided for free, for the duration of the current pandemic. When the stay at home order expires, this game will be taken offline and its code released on Github.</p>
          <p>If you liked this game, consider buying a physical version of the original once we get out of this mess. In the meantime please stay home, wash your hands, support local businesses, and stay safe!</p>
        </b-collapse>

        <br />

        <p>
          By playing, you accept the
          <a @click="openTerms()">Terms of Use</a> and the
          <a @click="openPrivacyPolicy()">Privacy Policy</a>.
        </p>

        <p>
          <b-button
            type="is-primary"
            size="is-medium"
            expanded
            @click="accepted = true"
          >Agree and Continue</b-button>
        </p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Events, Commands } from "../../shared/events";
import PrivacyPolicy from "./meta/PrivacyPolicy.vue";
import Terms from "./meta/Terms.vue";

@Component
export default class Welcome extends Vue {
  username = ""
  accepted = false
  buttonLoading = false

  authenticate() {
    if (this.username.length == 0) {
      alert("Please enter a username.");
      return;
    }

    this.buttonLoading = true

    this.$socket.client.emit(
      Commands.authenticate,
      {
        id: this.$store.state.user.userId,
        name: this.username
      },
      (newId?: string) => {
        if (newId == null || newId == undefined) {
          alert("Could not authenticate. Sorry!");
          return;
        }
        this.$store.dispatch("authenticated", {
          newId: newId,
          username: this.username
        });
      }
    );
    console.log("sent");
  }
  openPrivacyPolicy() {
    this.$buefy.modal.open({
      parent: this,
      component: PrivacyPolicy,
      trapFocus: true,
      width: 600
    });
  }

  openTerms() {
    this.$buefy.modal.open({
      parent: this,
      component: Terms,
      trapFocus: true,
      width: 600
    });
  }
}
</script>

<style lang="scss">
.authenticate {
  max-width: 570px;
  padding: 10px;
  text-align: left;
  margin: auto;

  .auth {
    max-width: 300px;
    margin: auto;
  }

  p {
    margin-bottom: 15px;
    a {
      font-weight: bold;
    }
  }

  h1 {
    color: white;
    line-height: 24px;
    font-size: 26px;
    text-align: left;
    width: 120px;
    margin: 20px auto;
  }
}
</style>
