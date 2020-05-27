<template>
  <div>
    <b-row v-if="Object.keys(sponsors).length > 0">
      <b-col cols="12" style="font-size:2em">
        <hr />
        {{ $t("labels.sponsors") }}
        <hr />
      </b-col>
      <b-col
        v-for="(sp, label) in sponsors"
        v-bind:key="label"
        class="sponsorcol"
      >
        <img v-if="sp.logo" :src="sp.logo" width="150" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Sponsors",
  props: ["ur", "dir", "ta", "lang"],
  data() {
    return {
      sponsors: {},
      unsubscribe: null,
    };
  },
  components: {},
  computed: {},
  methods: {},
  beforeCreate() {},
  created() {
    this.unsubscribe = db
      .collection("sponsors")
      .where("active", "==", true)
      .onSnapshot((snapshot) => {
        this.sponsors = {};
        snapshot.forEach((doc) => {
          this.sponsors[doc.id] = doc.data();
          this.sponsors[doc.id].id = doc.id;
        });
      });
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    this.unsubscribe();
    next();
  },
};
</script>

<style scoped>
.sponsorcol {
  margin: auto;
  vertical-align: middle;
}
</style>
