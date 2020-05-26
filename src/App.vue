<template>
  <div id="app">
    <Header
      v-if="loaded"
      :ur="CurrentUserRoles"
      :mynumber="clientdata.clientnumber"
      :lang="lang"
      @setLanguage="setLanguage"
      @logout="clearroles"
    />

    <!-- {{
      <br /><br /><br />
      $moment()
        .add(1, "d")
        .format("YYYY-MM-DD")
    }} -->

    <!-- {{ 3600000 | duration("humanize") }} -->
    <!-- <p>{{ $t("message.hello", { msg: "hello" }) }}</p> -->

    <router-view
      class="rv"
      v-if="loaded"
      :dir="direction"
      :lang="lang"
      :ta="textalign"
      :showtime="showtime"
      :showdate="showdate"
      :ur="CurrentUserRoles"
      :providers="providers"
      :mynumberprop="clientdata.clientnumber"
      :myproviderprop="clientdata.clientprovider"
      :myserviceprop="clientdata.clientservice"
      :myservicedateprop="clientdata.servicedate"
      :clientname="clientdata.clientname"
      :clientphone="clientdata.clientphone"
      :mydocidprop="clientdata.docid"
      @getdistance="getproviders"
      @updateclient="updateclient"
    />

    <splash-screen v-if="!loaded" />

    <div id="recaptcha"></div>
  </div>
</template>

<script>
document.title = "Taboor";

import Header from "./components/Header.vue";
import SplashScreen from "./components/SplashScreen.vue";

import getDistance from "geolib/es/getDistance";

import moment from "moment";

import firebase from "./firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "app",
  components: {
    Header,
    SplashScreen,
  },
  data() {
    return {
      CurrentUserRoles: {},
      providers: {},
      loadcompleted: false,
      showtime: null,
      showdate: null,
      lang: "ar-ly",
      direction: "rtl",
      textalign: "right",
      clientdata: {
        clientname: null,
        clientphone: null,
        clientnumber: null,
        clientprovider: null,
        clientservice: null,
        servicedate: null,
        docid: null,
      },
    };
  },
  computed: {
    loaded() {
      if (this.loadcompleted || Object.keys(this.CurrentUserRoles).length !== 0)
        return true;
      else return false;
    },
  },
  methods: {
    updateclient(
      clientname,
      clientphone,
      clientnumber,
      clientprovider,
      clientservice,
      servicedate,
      docid
    ) {
      //clientname
      if (this.$session.exists("clientname")) {
        this.clientdata.clientname = this.$session.get("clientname");
      } else if (clientname) {
        this.clientdata.clientname = clientname;
      } else {
        this.clientdata.clientname = null;
      }

      //clientphone
      if (this.$session.exists("clientphone")) {
        this.clientdata.clientphone = this.$session.get("clientphone");
      } else if (clientphone) {
        this.clientdata.clientphone = clientphone;
      } else {
        this.clientdata.clientphone = null;
      }

      //clientnumber
      if (this.$session.exists("clientnumber")) {
        this.clientdata.clientnumber = this.$session.get("clientnumber");
      } else if (clientnumber) {
        this.clientdata.clientnumber = clientnumber;
      } else {
        this.clientdata.clientnumber = null;
      }

      //clientprovider;
      if (this.$session.exists("clientprovider")) {
        this.clientdata.clientprovider = this.$session.get("clientprovider");
      } else if (clientprovider) {
        this.clientdata.clientprovider = clientprovider;
      } else {
        this.clientdata.clientprovider = null;
      }

      //clientservice
      this.clientdata.clientservice = clientservice;
      if (this.$session.exists("clientservice")) {
        this.clientdata.clientservice = this.$session.get("clientservice");
      } else if (clientservice) {
        this.clientdata.clientservice = clientservice;
      } else {
        this.clientdata.clientservice = null;
      }

      //servicedate
      this.clientdata.servicedate = servicedate;
      if (this.$session.exists("servicedate")) {
        this.clientdata.servicedate = this.$session.get("servicedate");
      } else if (servicedate) {
        this.clientdata.servicedate = servicedate;
      } else {
        this.clientdata.servicedate = null;
      }

      //docid
      this.clientdata.docid = docid;
      if (this.$session.exists("docid")) {
        this.clientdata.docid = this.$session.get("docid");
      } else if (docid) {
        this.clientdata.docid = docid;
      } else {
        this.clientdata.docid = null;
      }
    },
    timenow() {
      this.showtime = moment().format("YYYY-MM-DD  - hh:mm:ss a");
      this.showdate = moment().format("YYYY-MM-DD");
    },
    clearroles() {
      this.CurrentUserRoles = {};
      // this.loggedin(); //Important
      this.logout();
    },
    logout() {
      console.log("logout");
      // this.$session.remove("clientname");
      // this.$session.remove("clientphone");
      this.$session.remove("clientnumber");
      this.$session.remove("clientprovider");
      this.$session.remove("clientservice");
      this.$session.remove("servicedate");
      this.$session.remove("docid");
      this.clientdata.clientnumber = null;
      this.clientdata.clientprovider = null;
      this.clientdata.clientservice = null;
      this.clientdata.servicedate = null;
      this.clientdata.docid = null;

      //Remove session in case of refresh
      this.$session.remove("servingclientname");
      this.$session.remove("servingclientphone");
      this.$session.remove("servingnumber");
      this.$session.remove("servingwindow");
      this.$session.remove("mywindow");

      //TEMPORARY HERE
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase.auth().onAuthStateChanged(() => {
            if (this.$router.currentRoute.name != "Dashboard") {
              this.$router.push({ name: "Dashboard", query: {} });
            }
          });
        });
    },
    getproviders(mylocation) {
      //var workingdays = [1, 2, 3, 4, 7]; //5 Thursday and 6 Friday
      // var workingdays = [1, 2, 3, 4, 5, 6, 7]; //5 Thursday and 6 Friday
      //console.log(this.$moment().isoWeekday());
      db.collection("users")
        .where("active", "==", true)
        .orderBy("servicetype")
        .onSnapshot((querySnapshot) => {
          this.providers = {};

          querySnapshot.forEach((doc) => {
            this.providers[doc.id] = doc.data();
            this.providers[doc.id].id = doc.id;
            if (mylocation != null) {
              if (doc.data().coordinates != null) {
                this.providers[doc.id].distance = getDistance(
                  { latitude: mylocation.Pc, longitude: mylocation.Vc },
                  {
                    latitude: doc.data().coordinates.Pc,
                    longitude: doc.data().coordinates.Vc,
                  }
                );
              } else {
                this.providers[doc.id].distance = 0;
              }
            }
            if (
              doc.data().opentime &&
              doc.data().closetime &&
              doc.data().opendays
            ) {
              var opentimeAr = doc.data().opentime.split(":");
              var opentime =
                +opentimeAr[0] * 60 * 60 + +opentimeAr[1] * 60 + +opentimeAr[2];

              var closetimeAr = doc.data().closetime.split(":");
              var closetime =
                +closetimeAr[0] * 60 * 60 +
                +closetimeAr[1] * 60 +
                +closetimeAr[2];

              var nowinseconds =
                this.$moment().format("X") -
                this.$moment(this.$moment().format("YYYY-MM-DD")).format("X");
              // console.log(
              //   "today",
              //   this.$moment().isoWeekday(),
              //   doc.data().opendays
              // );
              // console.log(
              //   "nowinseconds",
              //   nowinseconds,
              //   "opentime",
              //   opentime,
              //   "closetime",
              //   closetime
              // );

              if (
                nowinseconds > opentime &&
                nowinseconds < closetime &&
                doc.data().opendays.includes(this.$moment().isoWeekday())
              ) {
                this.providers[doc.id].opennow = true;
                //console.log("open");
              } else {
                this.providers[doc.id].opennow = false;
              }
            }
          });
        });
    },
    setLanguage(lang) {
      this.lang = lang;
      this.$i18n.locale = lang;
      this.$moment.locale(lang);
      if (lang == "ar" || lang == "ar-ly") {
        this.direction = "rtl";
        this.textalign = "right";
      } else {
        this.direction = "ltr";
        this.textalign = "left";
      }
      this.$session.set("lang", lang);
      //console.log("set sesstion to ", lang);
    },
  },
  beforeCreate() {},
  created() {
    //Set Language based on last session
    if (
      this.$session.exists("lang") &&
      this.$session.get("lang") != this.lang
    ) {
      this.setLanguage(this.$session.get("lang"));
    }

    //Get session data
    this.updateclient();

    //Update timer
    setInterval(() => this.timenow(), 1 * 1000);

    //Manual logout
    if (this.$route.path == "/logout") {
      this.logout();
    }

    //Get all the provicers on launch
    this.getproviders();

    //Check Login Status
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log("Logged in user ", user.uid);
        db.collection("users")
          .doc(user.uid)
          .onSnapshot(
            (doc) => {
              // console.log("user.uid", user.uid);
              // console.log("CurrentUserRoles", this.CurrentUserRoles);
              // console.log("doc.data()", doc.data());

              if (doc.data()) {
                this.CurrentUserRoles = doc.data();
              }
              if (user.uid) {
                this.CurrentUserRoles.uid = user.uid;
              }
              //this.loadcompleted = true;
            },
            function(error) {
              console.log(error);
            }
          );
      } else {
        //For Public
        var allowedpages = [
          "Dashboard",
          "Provider",
          "Login",
          "Signup",
          "QrScan",
        ];

        if (!allowedpages.includes(this.$router.currentRoute.name)) {
          this.$router.push({ name: "Dashboard", query: {} });
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
        },
      }
    );
    window.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  },
};
</script>
<style>
@font-face {
  font-family: "Cairo";
  src: url("./assets/fonts/Cairo/Cairo-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Cairo";
  src: url("./assets/fonts/Cairo/Cairo-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: bold;
}
/*
@font-face {
  font-family: "Baloo 2";
  src: url("./assets/fonts/Baloo_2/Baloo2-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Baloo 2";
  src: url("./assets/fonts/Baloo_2/Baloo2-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: bold;
}
*/
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  /* font-family: Almarai, Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Cairo", "Helvetica Neue", "Helvetica", "sans-serif", "Arial";

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.modal-content {
  font-family: "Cairo", "Helvetica Neue", "Helvetica", "sans-serif", "Arial";
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
.bold {
  font-weight: bold;
}

@media print {
  button {
    display: none !important;
  }
  .rv {
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
</style>
