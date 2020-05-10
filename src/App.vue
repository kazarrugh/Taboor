<template>
  <div id="app">
    <Header v-if="loadcompleted" :ur="CurrentUserRoles" @logout="clearroles" />
    <router-view
      v-if="loadcompleted"
      :dir="direction"
      :ta="textalign"
      :ur="CurrentUserRoles"
    />
  </div>
</template>
<script>
document.title = "Taboor";
import Header from "./components/Header.vue";
import firebase from "./firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "app",
  components: {
    Header,
  },
  data() {
    return {
      // authUser: "",
      CurrentUserRoles: {},
      //AllUsers: {},
      loadcompleted: false,
      direction: "rtl",
      textalign: "right",
    };
  },
  methods: {
    clearroles() {
      this.CurrentUserRoles = {};
      // window.location.reload();
    },
  },
  beforeCreate() {},
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log(user);
        db.collection("users")
          .doc(user.uid)
          .onSnapshot((doc) => {
            this.CurrentUserRoles = doc.data();
            this.CurrentUserRoles.uid = user.uid;
            this.loadcompleted = true;
          });
        // .catch((error) => {
        //   console.log(error);
        // });
      } else {
        if (this.$route.path != "/Login") {
          var referrer = this.$router.history.current.fullPath;
          this.$router.push({ name: "Login", query: { redirect: referrer } });
        }
        this.loadcompleted = true;
      }
    });
    /*
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase.auth().onAuthStateChanged(() => {
          this.$router.push({ name: "Login", query: {} });
          this.$emit("logout");
        });
      });
      */
    /*
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data()}`);
        });
      });
    firebase
      .auth()
      .signOut()
      .then(() => {
        firebase.auth().onAuthStateChanged(() => {
          this.$router.push({ name: "Login", query: {} });
          this.$emit("logout");
        });
      });
*/
    /*
    db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    born: 1815
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    
    //Read Data
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    });
    */
    // db.collection("users").get().then((querySnapshot) => {
    //     this.AllUsers = querySnapshot;
    // });

    // db.collection("users")
    // .onSnapshot(function(snapshot) {
    //     this.AllUsers = snapshot;
    // }, function(error) {
    //     console.log(error);
    // });

    // db.collection("users")
    //   .onSnapshot(function(doc) {
    //        console.log("Current data: ", doc.data());
    //       //this.AllUsers = doc.data();
    //   });
    //this.AllUsers = this.getUsers();
  },
  watch: {},
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
