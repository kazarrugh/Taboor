<template>
  <div>
    <b-container class="container" :dir="dir">
      <div
        v-if="
          this.provider.currentnumber &&
            Object.keys(this.provider.currentnumber).length > 0
        "
      >
        <b-alert show variant="dark">الارقام الكلية في الطابور</b-alert>
        <b-row v-if="servicewindow == null" fluid>
          <b-col
            v-for="(cn, label) in provider.currentnumber"
            v-bind:key="label"
            cols="6"
            :md="md"
          >
            <b-card :header="label" class="mb-2">
              <b-card-text> {{ cn }}</b-card-text>
            </b-card>
          </b-col>
        </b-row>
        <b-card v-else :header="servicewindow" class="mb-2">
          <b-card-text>
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
  props: ["ur", "servicewindow", "dir", "td"],
  data() {
    return {
      //provider: {},
      //servicewindow: null,
    };
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
</style>
