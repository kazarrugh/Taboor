<template>
  <div>
    <b-container class="container" :dir="dir">
      <!-- currently served numbers -->
      <div
        v-if="
          this.provider.currentlyserving &&
            Object.keys(this.provider.currentlyserving).length > 0
        "
      >
        <b-alert show variant="dark" class="bold">
          {{ $t("alerts.currentlyserved") }}
        </b-alert>
        <b-row v-if="servicewindow == null" fluid>
          <b-col
            v-for="(cn, label) in provider.currentlyserving"
            v-bind:key="label"
            :cols="cols"
            :md="md"
          >
            <b-card
              :header="label"
              class="mb-2"
              :style="'min-height:' + minheight + 'px;'"
            >
              <b-card-body>
                <b-row
                  style="margin:0px"
                  v-for="(number, window) in cn"
                  v-bind:key="window"
                >
                  <b-col class="bordered">
                    {{ $t("labels.window") }}
                    <span class="bold">{{ window }}</span>
                  </b-col>
                  <b-col class="bordered">
                    {{ $t("labels.number") }}
                    <span class="bold">{{ number }}</span>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
        <!-- In Case servicewindow is selected -->
        <b-card
          v-else
          :header="servicewindow"
          class="mb-2"
          :style="'min-height:' + minheight + 'px;'"
        >
          <b-card-body>
            <b-row
              style="margin:0px"
              v-for="(number, window) in provider.currentlyserving[
                servicewindow
              ]"
              v-bind:key="window"
            >
              <b-col class="bordered">
                {{ $t("labels.window") }} <span class="bold">{{ window }}</span>
              </b-col>
              <b-col class="bordered">
                {{ $t("labels.number") }} <span class="bold">{{ number }}</span>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </div>
      <!-- end currently served numbers -->
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Display",
  props: ["ur", "servicewindow", "dir", "ta"],
  data() {
    return {
      //provider: {},
      //servicewindow: null,
    };
  },
  computed: {
    cols() {
      if (Object.keys(this.provider.currentnumber).length > 1) return 12;
      else return 12;
    },
    md() {
      if (this.provider.currentnumber) {
        return Math.ceil(12 / Object.keys(this.provider.currentnumber).length);
      } else {
        return "12";
      }
    },
    minheight() {
      var largestwindows = 1;
      if (this.servicewindow == null) {
        Object.values(this.provider.currentlyserving).forEach((window) => {
          var counter = Object.keys(window).length;
          if (counter > largestwindows) {
            largestwindows = counter;
          }
        });
      } else {
        var counter = Object.keys(
          this.provider.currentlyserving[this.servicewindow]
        ).length;
        if (counter > largestwindows) {
          largestwindows = counter;
        }
      }
      if (window.innerWidth < 400) {
        var cardhead = 46;
      } else {
        cardhead = 49;
      }
      return largestwindows * 50 + cardhead;
    },
    provider() {
      return this.ur;
    },
  },
  methods: {},
  beforeCreate() {},
  created() {
    // this.providerkey = this.$route.query.key;
    // db.collection("users")
    //   .doc(this.providerkey)
    //   .onSnapshot((doc) => {
    //this.provider = this.ur;
    /*
    if (
      this.provider.windowtype == null ||
      this.provider.windowtype.length < 2
    ) {
      this.servicewindow = "اجمالي عدد الطابور";
    }
    */
    //   });
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
.card-body {
  padding: 0px;
}

.bordered {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-style: solid;
  font-size: 1em;
  padding: 0px;
  height: 50px;

  display: table-cell;
  vertical-align: middle;

  line-height: 50px;
  text-align: center;
}

@media only screen and (max-width: 400px) {
  .bordered {
    font-size: 1.1em;
  }
  .card {
    font-size: 0.9em;
  }
}
</style>
