<template>
  <b-container class="container" :dir="dir">
    <div>
      {{ providerkey }}
      <br /><br />
      {{ provider }}
    </div>
  </b-container>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "HelloWorld",
  props: ["ur", "dir", "td"],
  data() {
    return {
      providerkey: "",
      provider: {},
    };
  },
  computed: {},
  methods: {},
  beforeCreate() {},
  created() {
    this.providerkey = this.$route.query.key;
    db.collection("users")
      .doc(this.providerkey)
      .onSnapshot((doc) => {
        this.provider = doc.data();
      });
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
