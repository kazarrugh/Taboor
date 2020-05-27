<template>
  <div v-if="filterdreviews.length > 0">
    <!-- <b-container class="container" :dir="dir"> -->
    <b-alert show variant="dark">
      <h4>
        {{ $t("alerts.servicerating") }}
      </h4>
    </b-alert>
    <b-row fluid>
      <b-col
        v-for="review in filterdreviews"
        v-bind:key="review.id"
        cols="12"
        :md="md"
        class="spacebelow"
        id="pagereviews"
      >
        <b-card class="mb-2" :style="'min-height:' + minheight + 'px;'">
          <template v-slot:header v-if="review.servicewindow">
            <span
              v-if="
                ur.windowtypeLang &&
                  ur.windowtypeLang[review.servicewindow] &&
                  ur.windowtypeLang[review.servicewindow][lang]
              "
            >
              {{ ur.windowtypeLang[review.servicewindow][lang] }}
            </span>
            <span v-else>{{ review.servicewindow }}</span>
          </template>

          <b-card-body>
            <b-form-rating
              :value="review.rating"
              readonly
              show-value
              precision="1"
            ></b-form-rating>
            <!-- {{ review.id }} -->
          </b-card-body>
          <b-card-body>
            <b-card-title
              v-if="review.displayNameLang && review.displayNameLang[lang]"
              >{{ review.displayNameLang[lang] }}</b-card-title
            >
            <b-card-title v-else>{{ review.displayName }}</b-card-title>

            <b-card-sub-title class="mb-2">
              <a :href="'tel:' + review.formattedNumber">
                {{ review.phoneNumber }}
              </a>
            </b-card-sub-title>

            <b-card-text :style="'text-align:' + ta + ';'">
              <!-- {{ review.comment }} -->
              <span v-if="review.commentLang && review.commentLang[lang]">
                {{ review.commentLang[lang] }}
              </span>
              <span v-else>
                {{ review.comment }}
              </span>
            </b-card-text>
          </b-card-body>
          <template v-slot:footer>
            {{ review.createdAt.seconds | moment("from") }}
          </template>
        </b-card>
      </b-col>
    </b-row>
    <b-pagination
      v-if="rows > 3"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="pagereviews"
      align="fill"
      variant="secondary"
      style="padding:0px"
    ></b-pagination>
    <!-- </b-container> -->
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "Reviews",
  props: ["ur", "pk", "servicewindow", "dir", "ta", "lang"],
  data() {
    return { reviews: {}, currentPage: 1, unsubscribe: null };
  },
  computed: {
    md() {
      // if (
      //   Object.keys(this.reviews).length > 0 &&
      //   Object.keys(this.reviews).length < 4
      // ) {
      //   return Math.ceil(12 / Object.keys(this.reviews).length);
      // } else {
      //   return 4;
      // }
      return 12;
    },
    perPage() {
      //return 12 / this.md;
      return 3;
    },
    minheight() {
      return 100;
    },
    filterdreviews() {
      var reviews = [];
      if (this.servicewindow) {
        reviews = Object.values(this.reviews).filter(
          (m) => m.servicewindow == this.servicewindow
        );
      } else {
        reviews = Object.values(this.reviews);
      }
      return reviews.slice(
        (this.currentPage - 1) * this.perPage,
        this.currentPage * this.perPage
      );
    },
    rows() {
      return Object.keys(this.reviews).length;
      // return this.filterdreviews.length;
    },
  },
  methods: {},
  beforeCreate() {},
  created() {},
  mounted() {
    this.unsubscribe = db
      .collection("reviews")
      .where("provider", "==", this.pk)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        this.reviews = {};
        querySnapshot.forEach((doc) => {
          this.reviews[doc.id] = doc.data();
          this.reviews[doc.id].id = doc.id;
        });
        // console.log("Current reviews: ", this.reviews);
      });
  },
  beforeRouteLeave(to, from, next) {
    this.unsubscribe();
    next();
  },
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.card-body {
  padding: 0em;
}
.card-title {
  margin-top: 15px;
}
.card-text {
  padding: 15px;
}
.spacebelow {
  margin-bottom: 30px;
}
</style>
