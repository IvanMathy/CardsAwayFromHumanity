<template>
  <div class="card-viewer">

    {{winner.name}} wins.
    <div
      class="cards-container"
      :class="cards.length > 5 ? 'moreThan5Cards' : (cards.length > 2 ? 'lessThan5cards' : 'twocards')"
    >
      <div class="cards topCards">
        <div class="card-container" v-for="card in cards" :key="card">
          <p class="white-card helvetica">{{ getWhiteCard(card)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GameStage, GameState, GameStatePlayer } from "../../../shared/events";
import { mapState } from "vuex";
import { blackCards, whiteCards } from "../meta/cards";

@Component({
  computed: {
    ...mapState(["gameState"])
  }
})
export default class CardViewer extends Vue {
  showScoreboard = false;
  showRoomCode = true;

  Stage = GameStage;

  get winner(this: any): GameStatePlayer | undefined {
    return (this.gameState as GameState).players.find(player => player.winner)
  }

  get cards(this: any) {
    const stage = (this.gameState as GameState).stage
    if(stage == GameStage.celebratingWinner) {
      return [(this.gameState as GameState).gameInfo.winningCard]
    } else {
      return (this.gameState as GameState).players.map((player) => 
        player.card
      ).filter(card => card !== undefined)
    }
  }

  getBlackCard(card: number) {
    return blackCards[card];
  }

  getWhiteCard(card: number) {
    return whiteCards[card];
  }
  getCzarName(): string {
    return (
      ((this as any).gameState as GameState).players.find(p => p.czar === true)
        ?.name ?? "Someone"
    );
  }
}
</script>

<style scoped lang="scss">
@import url("styles.scss");

.card-viewer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
  
  .cards-container {
    bottom: 0;
    left: 0;
    right: 50px;
    position: fixed;
  }

  .topCards {
    margin-left: 50px !important;
  }

  .cards {
    margin: auto;
    display: flex;
    justify-content: center;
    height: 180px;

    @media (max-width: 1350px) {
      transform: scale(0.8);
    }

    @media (max-width: 800px) {
      transform: scale(0.7);
    }

    .card-container {
      margin: -5px;
      z-index: 10;
      transition: 0.1s margin;
      margin-left: -65px;
      margin-right: -60px;
      &:hover {
        margin-top: -60px;
      }
    }
  }

  .moreThan5Cards {
    @media (min-width: 1071px) {
      .card-container:nth-child(2n-1) {
        margin-top: -140px;

        &:hover {
          margin-top: -165px;
        }
        z-index: 9;
      }
    }

    @media (max-width: 1070px) {
      .card-container {
        margin-left: -85px;
        margin-right: -85px;
      }

      .card-container:nth-child(3n + 2) {
        margin-top: -130px;

        &:hover {
          margin-top: -190px;
        }
        z-index: 9;
      }
      .card-container:nth-child(3n) {
        margin-top: -260px;

        &:hover {
          margin-top: -320px;
        }
        z-index: 8;
      }
    }
  }

  .lessThan5cards {
    .card-container:nth-child(2n) {
      margin-top: -130px;

      &:hover {
        margin-top: -190px;
      }
      z-index: 9;
    }
  }

  .twocards {
    .card-container {
      margin: 5px;
    }
  }
  .prompt {
    color: white;
    width: 300px;
    margin: auto;
    font-size: 40px;
    line-height: 40px;
    margin-bottom: 60px;
  }

  .black-card-container {
    height: 400px;

    @media (max-width: 1350px) {
      transform: scale(0.9);
    }

    @media (max-width: 800px) {
      transform: scale(0.8);
    }
  }

  @media only screen and (max-height: 700px) {
    .hero {
      padding-top: 300px;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
