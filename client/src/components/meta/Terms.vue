<template>
  <div class="terms">
    <b-message title="Terms of Use" :closable="false">
      <p>
        This game is provided free of charge, without ads, for a temporary time period.
        It is a personal non-commercial project, and therefore no promise or guarantee of availability, quality, support, or maintenance can be made.
      </p>
      <p>
        This game contains user-generated content. This content might be offensive, dangerous, and/or downright stupid. If you wish to avoid that content, only play through the &quot;private game&quot; feature with trusted players.
      </p>
      <p>
        This game is based on
        <a
          href="https://cardsagainsthumanity.com/"
          target="_blank"
        >Cards Against Humanity</a>, which is available under a
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/2.0/"
          target="_blank"
        >Creative Commons Attribution-NonCommercial-ShareAlike</a> license. Any new or alternate cards present in this game is made available under the same license.
      </p>
      <p>
        This game is not approved, endorsed, or in any way affiliated with/by Cards Against Humanity. &quot;Cards Against Humanity&quot; and the CAH logos are trademarks of Cards Against Humanity LLC. Please consider
        <a href="https://store.cardsagainsthumanity.com/" target="_blank">buying a physical copy</a> of the game once this whole thing blows over.
      </p>
      <p>This game may collect some data while you play. Please review the Privacy Policy to learn more.</p>
      <p>This game is licensed under the MIT License.</p>
      <p>Copyright &copy; 2020 OKatBest</p>
      <p>
        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:
      </p>
      <p>
        The above copyright notice and this permission notice shall be included in all
        copies or substantial portions of the Software.
      </p>
      <p>
        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
      </p>
      <p>These terms may get updated at any point, so please check this page often in case they do. If you do not agree, please leave this game.</p>

      <p><br/></p>

      <p class="has-text-centered helvetica is-size-7">Brought to you by <br/> <a href="https://okat.best"><img width="90" src="https://okat.best/img/logo.svg" /></a></p>
    </b-message>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Terms extends Vue {}
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
