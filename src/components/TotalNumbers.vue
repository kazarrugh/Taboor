<template>
  <div>
    <b-container class="container" :dir="dir">
      <div
        v-if="
          this.provider.currentnumber &&
            Object.keys(this.provider.currentnumber).length > 0
        "
      >
        <b-alert show variant="dark" class="bold">
          {{ $t("alerts.totalnumbers") }}
        </b-alert>
        <b-row v-if="servicewindow == null" fluid>
          <b-col
            v-for="(cn, label) in provider.currentnumber"
            v-bind:key="label"
            cols="6"
            :md="md"
          >
            <b-card :header="label" class="mb-2">
              <b-card-text class="bold"> {{ cn }}</b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <!-- For Single Card Use Below -->
        <b-card v-else :header="servicewindow" class="mb-2">
          <b-card-text class="bold">
            {{ provider.currentnumber[servicewindow] }}
          </b-card-text>
        </b-card>
      </div>
      <!-- end currently served numbers -->
    </b-container>
  </div>
</template>

<script>
export default {
  name: "TotalNumbers",
  props: ["ur", "servicewindow", "dir", "ta"],
  data() {
    return {};
  },
  computed: {
    md() {
      if (this.provider.currentnumber) {
        return Math.ceil(12 / Object.keys(this.provider.currentnumber).length);
      } else {
        return "12";
      }
    },
    provider() {
      return this.ur;
    },
  },
  methods: {},
  beforeCreate() {},
  created() {},
  mounted() {},
};
</script>

<style scoped>
.container {
}
</style>
