<template>
  <div class="privacy">
    <b-message title="Privacy Policy" :closable="false">
      <p>This game does not actively collect or store personal information. Some non-identifiable, aggregated data such as which cards were played may be collected to learn more about usage. Some standard usage statistics such as browser type and screen size may be collected automatically by Google Analytics (see below).</p>
      <p>
        Your browser
        <a href="https://en.wikipedia.org/wiki/Web_storage" targe="_blank">local storage</a> feature is used so that your browser can pre-fill who you are. Google Analytics and Socket.io (which is the backbone of this game) may generate cookies for session management. If you would like to avoid cookies, please disable them in your browser's settings.
      </p>
      <p>Some data such as your chosen display name is kept in memory for a short time to allow for session-recovery. This data gets deleted automatically after a short period of time. Your display name may also appear in private error or debug logs as part of normal server operation.</p>
      <p>Regardless of its origin, no individual data generated from the game's code will ever be used for commercial purposes or sold to a third party.</p>
      <p>
        This game is hosted on Heroku by Salesforce. You can find their privacy policy at this url:
        <a
          href="https://www.salesforce.com/company/privacy/"
          target="_blank"
        >https://www.salesforce.com/company/privacy/</a>
      </p>
     <!-- <p>
        This game uses Google Analytics. You can find their privacy policy at this url:
        <a
          href="https://support.google.com/analytics/answer/6004245"
          target="_blank"
        >https://support.google.com/analytics/answer/6004245</a>
      </p> -->
      <p>This privacy policy may get updated at any point, so please check it often in case it does. If you do not agree, please leave this game.</p>
    </b-message>
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
export default class PrivacyPolicy extends Vue {}
</script>


<style scoped lang="scss">
p {
  margin-bottom: 20px;
  a {
    color: rgb(0, 110, 255) !important;
    font-weight: bold;
  }
}
</style>
