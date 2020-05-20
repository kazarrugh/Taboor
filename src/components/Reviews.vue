<template>
  <b-container class="container" :dir="dir">
    <div v-if="Object.keys(this.reviews).length > 0">
      <b-alert show variant="dark" class="bold">
        {{ $t("alerts.servicerating") }}
      </b-alert>
      <b-row fluid>
        <b-col
          v-for="(review, key) in reviews"
          v-bind:key="key"
          cols="12"
          :md="md"
        >
          <b-card
            :header="servicewindow"
            class="mb-2"
            :style="'min-height:' + minheight + 'px;'"
          >
            <b-card-body>
              <b-form-rating
                :value="review.rating"
                readonly
                show-value
                precision="1"
              ></b-form-rating>
            </b-card-body>
            <b-card-body>
              <b-card-title>{{ review.displayName }}</b-card-title>
              <b-card-sub-title class="mb-2">
                {{ review.phoneNumber }}
              </b-card-sub-title>

              <b-card-text :style="'text-align:' + ta + ';'">
                {{ review.comment }}
              </b-card-text>
            </b-card-body>
            <template v-slot:footer>
              {{ review.createdAt.seconds | moment("from") }}
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "Reviews",
  props: ["ur", "pk", "servicewindow", "dir", "ta"],
  data() {
    return { reviews: {} };
  },
  computed: {
    md() {
      if (Object.keys(this.reviews).length > 0) {
        return Math.ceil(12 / Object.keys(this.reviews).length);
      } else {
        return "12";
      }
      // return 12;
    },
    minheight() {
      return 300;
    },
  },
  methods: {},
  beforeCreate() {},
  created() {},
  mounted() {
    db.collection("reviews")
      .where("provider", "==", this.pk)
      .onSnapshot((querySnapshot) => {
        this.reviews = {};
        querySnapshot.forEach((doc) => {
          this.reviews[doc.id] = doc.data();
          this.reviews[doc.id].id = doc.id;
        });
        // console.log("Current reviews: ", this.reviews);
      });
  },
};
</script>

<style scoped>
.card-body {
  padding: 0em;
}
.card-title {
  margin-top: 15px;
}
.card-text {
  padding: 15px;
}
</style>
