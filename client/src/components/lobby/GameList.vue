<template>
  <div class="game-list columns">
    <b-table
      :data="data"
      :striped="true"
      :paginated="true"
      :per-page="5"
      :focusable="false"
      :hoverable="true"
    >
      <template slot-scope="props">
        <b-table-column field="host" label="Host" class="helvetica bold">{{ props.row.host }}</b-table-column>

        <b-table-column field="date" label="Players" centered>
            <span
              class="tag bold"
              :class="(props.row.playerCount > 7) ? 'is-warning' : 'is-success'"
            >{{ (props.row.playerCount > 7) ? 'Full' : props.row.playerCount + '/8' }}</span>
        </b-table-column>

        <b-table-column field="stage" label="Stage" centered>{{ getStageText(props.row.stage) }}</b-table-column>

        <b-table-column>
          <b-button type="is-info" outlined size="is-small" class="is-hidden-mobile">Join</b-button>
          <b-button type="is-info" outlined expanded class="is-hidden-tablet">Join</b-button>
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon icon="emoticon-sad" size="is-large"></b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class GameList extends Vue {
  data = [
    {
      id: 1,
      host: "QQQQQQQQQQQQQQQ",
      stage: "w",
      playerCount: 2
    },
    {
      id: 2,
      host: "John",
      stage: "w",
      playerCount: 6
    },
    {
      id: 3,
      host: "Tina",
      stage: "i",
      playerCount: 8
    },
    {
      id: 4,
      host: "Clarence",
      stage: "i",
      playerCount: 1
    },
    {
      id: 5,
      host: "Anne",
      stage: "i",
      playerCount: 8
    },
    {
      id: 4,
      host: "Clarence",
      stage: "i",
      playerCount: 1
    },
    {
      id: 5,
      host: "Anne",
      stage: "i",
      playerCount: 6
    }
  ];

  getStageText(stage: string) {
    switch (stage) {
      case "w":
        return "Waiting";
      case "i":
        return "In Game";

      default:
        break;
    }
  }
}
</script>

<style lang="scss">
.game-list {
  .b-table {
    width: 100%;
    .bold {
      font-weight: bold;
    }
    .centered {
      text-align: center;
    }
  }
}
</style>
