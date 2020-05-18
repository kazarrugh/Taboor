<template>
  <div id="app">
    <Header v-if="loadcompleted" :ur="CurrentUserRoles" @logout="clearroles" />
    <router-view
      class="rv"
      v-if="loadcompleted"
      :dir="direction"
      :ta="textalign"
      :ur="CurrentUserRoles"
      :providers="providers"
      @getdistance="getproviders"
    />
    <splash-screen v-if="!loadcompleted" />

    <div id="recaptcha"></div>
  </div>
</template>

<script>
document.title = "Taboor";

import Header from "./components/Header.vue";
import SplashScreen from "./components/SplashScreen.vue";

import getDistance from "geolib/es/getDistance";

import firebase from "./firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "app",
  components: {
    Header,
    SplashScreen
  },
  data() {
    return {
      // authUser: "",
      CurrentUserRoles: {},
      providers: {},
      loadcompleted: false,
      direction: "rtl",
      textalign: "right",
      loggedin: ""
    };
  },
  methods: {
    clearroles() {
      this.CurrentUserRoles = {};
      this.loggedin(); //Important
      this.logout();
    },
    logout() {
      console.log("logout");
      //TEMPORARY HERE
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase.auth().onAuthStateChanged(() => {
            this.$router.push({ name: "Login", query: {} });
          });
        });
    },
    getproviders(mylocation) {
      db.collection("users")
        .orderBy("servicetype")
        .onSnapshot(querySnapshot => {
          this.providers = {};

          querySnapshot.forEach(doc => {
            this.providers[doc.id] = doc.data();
            this.providers[doc.id].id = doc.id;
            if (mylocation != null) {
              if (doc.data().coordinates != null) {
                this.providers[doc.id].distance = getDistance(
                  { latitude: mylocation.Pc, longitude: mylocation.Vc },
                  {
                    latitude: doc.data().coordinates.Pc,
                    longitude: doc.data().coordinates.Vc
                  }
                );
              } else {
                this.providers[doc.id].distance = 0;
              }
            }
          });
          this.loadcompleted = true;
        });
    }
  },
  beforeCreate() {},
  created() {
    if (this.$route.path == "/logout") {
      this.logout();
    }
    /*
For testing only
    db.collection("users")
      .doc("H0ddTQZWpuTArmpZDv74sguZyi63")
      .get()
      .then((doc) => {
        console.log("onSnapshot", doc.data());
      });
*/
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //   "recaptcha",
    //   {
    //     callback: (response) => {
    //       // reCAPTCHA solved, allow signInWithPhoneNumber.
    //       console.log("reCAPTCHA-solved", response);
    //     },
    //     "expired-callback": () => {
    //       // Response expired. Ask user to solve reCAPTCHA again.
    //       console.log("reCAPTCHA-expired");
    //     },
    //   }
    // );
    // window.recaptchaVerifier.render();

    this.getproviders();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        //console.log("Logged in user ", user.uid);

        this.loggedin = db
          .collection("users")
          .doc(user.uid)
          .onSnapshot(
            doc => {
              this.CurrentUserRoles = doc.data();
              this.CurrentUserRoles.uid = user.uid;
              this.loadcompleted = true;
            },
            function(error) {
              console.log(error);
            }
          );

        //this.CurrentUserRoles.uid = user.uid;
        //this.loadcompleted = true;
      } else {
        //console.log("else");
        // if (this.$route.path != "/Login") {
        //   var referrer = this.$router.history.current.fullPath;
        //   this.$router.push({ name: "Login", query: { redirect: referrer } });
        // }

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
  mounted() {
    firebase.auth().useDeviceLanguage();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow .
          console.log("reCAPTCHA-solved");
        },
        "expired-callback": function() {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("reCAPTCHA-expired");
        }
      }
    );
    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Baloo+2:wght@400;500;600;700&display=swap");
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: Almarai, Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Almarai", "Baloo 2", "sans-serif";

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
.grecaptcha-badge {
  visibility: collapse !important;
}
.rv {
  padding-top: 60px;
  padding-bottom: 60px;
}

@media print {
  button {
    display: none !important;
  }
}
</style>
