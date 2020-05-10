<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img alt="Vue logo" src="../assets/logo.svg" height="30px" />
        Taboor
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Left aligned nav items -->
        <b-navbar-nav> </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right menu-class="w-100">
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em v-if="!ur.displayName">المستخدم</em>
              <em v-else>{{ ur.displayName }}</em>
            </template>
            <b-dropdown-item v-if="!loggedin" to="/Login"
              >تسجيل الدخول</b-dropdown-item
            >
            <b-dropdown-item v-if="!loggedin" to="/Signup"
              >فرع جديد</b-dropdown-item
            >
            <b-dropdown-item v-if="loggedin" to="/profile"
              >الملف التعريفي</b-dropdown-item
            >
            <br />

            <b-dropdown-item v-if="loggedin" @click="logout()"
              >تسجيل الخروج</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
const firebase = require("firebase/app");
require("firebase/auth");

export default {
  props: ["ur"],
  data() {
    return {
      // user: null,
    };
  },
  computed: {
    loggedin() {
      return Object.keys(this.ur).length !== 0;
    },
  },
  created() {},
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase.auth().onAuthStateChanged(() => {
            this.$router.push({ name: "Login", query: {} });
            this.$emit("logout");
          });
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
