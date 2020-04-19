<template>
  <div class="card-picker">
    <div v-if="picked">Waiting for other players.</div>
    <div class="black-card-container">
      <p class="black-card helvetica">{{blackCard}}</p>
    </div>
    <div class="cards" :class="{ picked: picked }">
      <flickity ref="flickity" :options="flickityOptions">
        <div class="card-container" v-for="card in hand" :key="card">
          <p class="card helvetica" v-html="card"></p>
          <div class="picker">
            <b-button
              type="is-dark"
              size="is-medium"
              outlined
              v-if="!picked"
              @click="pick()"
            >Pick Card</b-button>
          </div>
        </div>
      </flickity>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Flickity from "vue-flickity";

@Component({
  components: {
    Flickity
  }
})
export default class Game extends Vue {
  picked = false;

  blackCard =
    "I do not know with which weapons World War III will be fought, but World War IV will be fought with _.";
  hand = [
    "A mopey zoo lion.",
    "All-you-can-eat shrimp for $4.99.",
    "Passive-agression.",
    "A Bop It&trade;.",
    "Saxophone solos.",
    "Horrifying laser hair removal accidents.",
    "Boogers.",
    "Unfathomable stupidity.",
    "Breaking out into song and dance."
  ];

  isMoving = false;

  flickityOptions = {
    selectedAttraction: 0.2,
    friction: 0.6
  };

  pick() {
    (this.$refs.flickity as any).disableDrag()
    this.picked = true
  }
}
</script>


<style lang="scss">
.flickity-viewport {
  overflow: visible;
}

.flickity-button {
  background: #333;
}
.flickity-button:hover {
  background: #f90;
}

.flickity-prev-next-button {
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
/* icon color */
.flickity-button-icon {
  fill: white;
}

.picked {
  .flickity-button {
    display: none;
  }
}
</style>

<style scoped lang="scss">
.card-picker {
  color: white;
}

.cards {
  bottom: 0;
  position: absolute;
  width: 100%;
}
.card-container {
  overflow: visible;
  height: 250px;
}

.card-container .card {
  color: black;
  width: 260px;
  text-align: left;
  font-weight: bold;
  font-size: 28px;
  line-height: 35px;
  padding: 20px;
  border-radius: 15px;
  height: 400px;
  background-color: white;
  background: linear-gradient(135deg, #ffffff 0%, #bbbbbb 100%);
  transition: 0.2s;
  transform: scale(0.9);
  border: 1px black solid;
  box-shadow: 0px 10px 5px 0px rgba(0, 0, 0, 0.75);
}

.card-container.is-selected {
  .card {
    transform: scale(1);
    box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 1);
  }
  .picker button {
    display: block;
  }
}

.picked {
  .card {
    transform: translate(0px, 300px) scale(0.9);
  }
  .is-selected .card {
    transform: translate(0px, -20px) scale(1.1);
  }
}

.black-card-container {
  position: absolute;
  bottom: 50px;
  width: 100%;
}

.black-card {
  color: white;
  width: 260px;
  text-align: left;
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  padding: 20px;
  border-radius: 15px;
  height: 400px;
  background-color: black;
  background: linear-gradient(135deg, #333333 0%, #000000 100%);
  border: 1px black solid;
  transition: transform 0.3s;
  margin: auto;
  box-shadow: 0px 5px 3px 0px rgba(0, 0, 0, 0.75);
}

.picker {
  position: absolute;
  bottom: 20px;
  width: 100%;
}

.picker button {
  width: 80%;
  margin: auto;
  display: none;
}
</style>
