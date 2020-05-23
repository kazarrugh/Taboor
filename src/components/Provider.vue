<template>
  <div>
    <audio id="ding" src="../assets/ding.mp3" muted></audio>

    <b-container
      fluid
      class="container"
      :dir="dir"
      v-if="!served || afterserved"
    >
      <!-- Start Provider Information -->
      <ProviderContact
        :ur="provider"
        :dir="dir"
        :ta="ta"
        style="margin-bottom:30px;"
      />
      <!-- End Provider Information -->

      <!-- Start Get Number-->
      <b-form @submit="getnumber" v-if="mynumber == null && !afterserved">
        <v-select
          v-if="provider.windowtype && provider.windowtype.length > 1"
          :options="this.provider.windowtype"
          :placeholder="$t('select.typeofserviceneeded')"
          v-model="servicewindow"
          v-on:input="changeservicewindow"
          style="margin-bottom:30px;"
          :dir="dir"
        >
          <template #search="{attributes, events}">
            <input
              :required="!servicewindow"
              class="vs__search"
              v-bind="attributes"
              v-on="events"
            />
          </template>
        </v-select>

        <b-button
          block
          :disabled="getnumberdisabled"
          variant="outline-primary"
          type="submit"
          size="lg"
        >
          {{ $t("buttons.getnumber") }}
        </b-button>
      </b-form>

      <!-- End Get Number-->
      <!-- Start Show my numebr -->
      <b-alert show v-if="mynumber != null" variant="dark" class="bold">
        {{ $t("alerts.mynumberinline") }}
      </b-alert>
      <b-card
        v-if="mynumber != null"
        :header="servicewindow"
        class="mb-2 bigtxt"
      >
        <b-card-text>
          <!-- <div class="mynumberinline">
            {{ $t("alerts.mynumberinline") }}
          </div> -->
          {{ mynumber }}</b-card-text
        >
        <template v-slot:footer v-if="servicedate">
          {{ servicedate }}
        </template>
      </b-card>
      <!-- End Show my numebr -->
      <b-alert
        variant="danger"
        :show="dismissCountDown"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        {{ error }}
      </b-alert>
      <!-- Start Cancel Request -->

      <b-button
        block
        v-if="mynumber != null && docid != null"
        variant="outline-danger"
        size="lg"
        @click="confirmcancelmodal = true"
      >
        {{ $t("buttons.cancelnumber") }}
      </b-button>

      <b-modal
        v-model="confirmcancelmodal"
        :title="$t('buttons.cancelnumber')"
        :ok-title="$t('buttons.ok')"
        :cancel-title="$t('buttons.cancel')"
        @ok="cancelnumber"
        :dir="dir"
      >
        <h3 style="text-align: center;">
          {{ $t("alerts.areyousure") }}
        </h3>
      </b-modal>

      <!-- Start Cancel Request -->

      <!-- Start Review -->
      <Review
        v-if="afterserved"
        :ur="provider"
        :pk="providerkey"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
        @reviewed="reviewadded"
      />
      <!-- End Review -->
      <div v-if="!afterserved">
        <!-- currently served numbers -->

        <Display
          :ur="provider"
          :pk="providerkey"
          :servicewindow="servicewindow"
          :dir="dir"
          :ta="ta"
          :showtime="showtime"
          :showdate="showdate"
        />
        <!-- end currently served numbers -->

        <!-- current total numbers -->
        <TotalNumbers
          :ur="provider"
          :pk="providerkey"
          :servicewindow="servicewindow"
          :dir="dir"
          :ta="ta"
          :showtime="showtime"
          :showdate="showdate"
        />
        <!-- end current total numbers -->
        <!-- Start customer reviews -->
        <Reviews
          :ur="provider"
          :pk="providerkey"
          :servicewindow="servicewindow"
          :dir="dir"
          :ta="ta"
        />
        <!-- End customer reviews -->
      </div>
    </b-container>
    <b-container
      v-if="mywindow != null"
      fluid
      style="height: 60vh;min-height: 60vh;"
      class="container"
    >
      <!-- Start Provider Information -->
      <ProviderContact :ur="provider" :dir="dir" :ta="ta" />
      <!-- End Provider Information -->
      <div class="h-100 row align-items-center">
        <b-jumbotron
          fluid
          container-fluid
          :header="$t('select.windownumber') + mywindow"
          style="width:100%;"
        >
          <template v-slot:lead>
            <br />
            {{ $t("alerts.mynumberinline") + " " + mynumber }}
            <br /><br />
            {{ servicedate }}
          </template>
        </b-jumbotron>
        <br />
      </div>
    </b-container>
  </div>
</template>

<script>
import ProviderContact from "@/components/ProviderContact";
import Display from "@/components/Display";
import TotalNumbers from "@/components/TotalNumbers";
import Review from "@/components/Review";
import Reviews from "@/components/Reviews";

import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Provider",
  props: [
    "ur",
    "dir",
    "ta",
    "showtime",
    "showdate",
    "mynumberprop",
    "myproviderprop",
    "myserviceprop",
    "myservicedateprop",
    "clientname",
    "clientphone",
    "mydocidprop",
  ],
  data() {
    return {
      providerkey: null,
      provider: {},
      currentlyserving: {},
      servicewindow: null,
      getnumberdisabled: false,
      confirmcancelmodal: false,
      mynumber: null,
      servicedate: null,
      mylocation: null,
      docid: null,
      served: false,
      error: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      tomorrowalert: false,
    };
  },
  components: {
    ProviderContact,
    Display,
    TotalNumbers,
    Review,
    Reviews,
  },
  computed: {
    ////////////////////////NEEEDS WORK//////////////////
    mywindow() {
      if (
        this.mynumber == null ||
        this.currentlyserving == null ||
        this.currentlyserving[this.servicewindow] == null ||
        this.currentlyserving[this.servicewindow].inservice == null
      ) {
        return null;
      } else {
        var obj = this.currentlyserving[this.servicewindow].inservice;
        if (Object.values(obj).includes(this.mynumber)) {
          this.itsmyturn();
          return Object.keys(obj).find((key) => obj[key] === this.mynumber);
        } else {
          return null;
        }
      }
      // var value = this.mynumber;
      // if (this.servicewindow != null) {
      //   var obj = this.provider.currentlyserving[this.servicewindow];
      // } else {
      //   obj = this.provider.currentlyserving;
      // }

      // if (Object.values(obj).includes(value)) {
      //   this.itsmyturn();

      //   return Object.keys(obj).find((key) => obj[key] === value);
      // } else {
      //   return null;
      // }
      //return null;
    },
    afterserved() {
      if (this.served && this.mywindow == null) {
        this.aftermyturn();
        return true;
      } else return false;
    },
  },
  methods: {
    getcurrentlyserving() {
      console.log(
        "currentlyserving pk ",
        this.providerkey,
        "date: ",
        this.showdate
      );
      db.collection("currentlyserving")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.showdate)
        .onSnapshot((snapshot) => {
          this.currentlyserving = {};
          snapshot.forEach((doc) => {
            this.currentlyserving[doc.data().servicewindow] = doc.data();
            this.currentlyserving[doc.data().servicewindow].id = doc.id;
          });
        });
    },
    changeservicewindow() {
      if (this.servicewindow != null) {
        this.getnumberdisabled = false;
      } else {
        this.getnumberdisabled = true;
      }
    },
    aftermyturn() {
      //Delete My number
      this.mynumber = null;
      this.servicedate = null;
      //Clear cookies
      this.$session.remove("clientnumber");
      this.$session.remove("clientprovider");
      this.$session.remove("clientservice");
      this.$session.remove("servicedate");
      this.$session.remove("docid");
    },
    itsmyturn() {
      if (!this.served) {
        //Play sound
        document.getElementById("ding").muted = false;
        document.getElementById("ding").play();

        //Get location again
        this.geolocate();
      }

      //Set served
      this.served = true;
    },
    reviewadded(customername, customerphone) {
      console.log("review added and deleting number");
      this.mynumber = null;
      this.served = false;
      this.$session.set("clientname", customername);
      this.$session.set("clientphone", customerphone);
      this.$session.remove("clientnumber");
      this.$session.remove("clientprovider");
      this.$session.remove("clientservice");
      this.$session.remove("servicedate");
      this.$session.remove("docid");

      this.$emit(
        "updateclient",
        customername, //clientname
        customerphone, //clientphone
        null, //clientnumber
        null, //clientprovider
        null, //clientservice
        null, //servicedate
        null //docid
      );

      this.$router.push({ name: "Dashboard", query: {} });
    },
    cancelnumber() {
      db.collection("currentnumber")
        .doc(this.docid)
        .update({
          canceled: firebase.firestore.FieldValue.arrayUnion(this.mynumber),
        })
        .then(() => {
          this.reviewadded(this.clientname, this.clientphone);
        });
    },
    addclientcontact() {
      if (
        (this.clientname || this.clientphone) &&
        this.docid &&
        this.mynumber
      ) {
        console.log("update client contact to doc id", this.docid);
        db.collection("currentnumber")
          .doc(this.docid)
          .set(
            {
              // provider: this.providerkey,
              // servicedate: this.servicedate,
              // servicewindow: this.servicewindow,
              // [this.mynumber]: {
              //   clientname: this.clientname,
              //   clientphone: this.clientphone,
              // },
              clientnames: { [this.mynumber]: this.clientname },
              clientphones: { [this.mynumber]: this.clientphone },
            },
            { merge: true }
          );
      } else {
        console.log(
          "Couldn't add client contact because name:",
          this.clientname,
          ", phone:",
          this.clientphone,
          ", docid:",
          this.docid,
          ", my number:",
          this.mynumber
        );
      }
    },
    addnewnumber() {
      console.log("adding to Firesetore number", this.mynumber);
      db.collection("currentnumber")
        .add({
          provider: this.providerkey,
          servicedate: this.servicedate,
          servicewindow: this.servicewindow,
          number: this.mynumber,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          this.docid = doc.id;
          this.getnumberfollowup();
        });
    },

    getnumber(evt) {
      evt.preventDefault();

      //Disable Get Number button
      this.getnumberdisabled = true;

      //If time now is before the closing time
      var today = this.$moment().format("YYYY-MM-DD");

      if (this.provider.closetime) {
        console.log("provider close time is ", this.provider.closetime);
        //X = Unix timestamp in seconds
        //x = Unix timestamp in milliseconds
        var nowinseconds =
          this.$moment().format("X") -
          this.$moment(this.$moment().format("YYYY-MM-DD")).format("X");

        var a = this.provider.closetime.split(":"); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var closetimeinseconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

        console.log("close time in seconds ", closetimeinseconds);
        console.log("time now in seconds ", nowinseconds);

        //If time now is after the closing time
        if (nowinseconds > closetimeinseconds) {
          console.log("The date will be tomorrow because provider is closed");
          today = this.$moment()
            .add(1, "d")
            .format("YYYY-MM-DD");
          //Show alert
          this.tomorrowalert = true;
        } else {
          this.tomorrowalert = false;
        }
      }
      this.servicedate = today;

      db.collection("currentnumber")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        .where("servicewindow", "==", this.servicewindow)
        .get({ source: "server" })
        .then((querySnapshot) => {
          console.log("querySnapshot.size is ", querySnapshot.size);
          if (querySnapshot.size == 0) {
            //In case this is a new date
            this.mynumber = 1;
            this.addnewnumber();
          } else {
            querySnapshot.forEach((doc) => {
              if (doc.data().number) {
                this.docid = doc.id;

                //Start Transaction
                // Create a reference to the SF doc.
                var cnDocRef = db.collection("currentnumber").doc(this.docid);

                // Uncomment to initialize the doc.
                // cnDocRef.set({ population: 0 });

                return db
                  .runTransaction((transaction) => {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction.get(cnDocRef).then((cnDoc) => {
                      if (!cnDoc.exists) {
                        throw "Document does not exist!";
                      }

                      // Add one person to the city population.
                      // Note: this could be done without a transaction
                      //       by updating the population using FieldValue.increment()
                      this.mynumber = cnDoc.data().number + 1;
                      transaction.update(cnDocRef, {
                        number: this.mynumber,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                      });
                    });
                  })
                  .then(() => {
                    console.log("Transaction successfully committed!");
                    this.getnumberfollowup();
                  })
                  .catch((error) => {
                    console.log("Transaction failed: ", error);
                  });
              } else {
                console.log(doc.id, " doc id Doesnt contain a number");
                this.mynumber = 1;
                this.addnewnumber();
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = this.$t("alerts.offline");
          this.showAlert();
          //Enable Get Number button
          this.getnumberdisabled = false;
        });
    },
    getnumberfollowup() {
      if (this.tomorrowalert) {
        this.error = this.$t("alerts.closedtomorrow");
        this.showAlert();
      }

      this.$emit(
        "updateclient",
        this.clientname,
        this.clientphone,
        this.mynumber,
        this.providerkey,
        this.servicewindow,
        this.servicedate,
        this.docid
      );
      this.$session.set("clientnumber", this.mynumber);
      this.$session.set("clientprovider", this.providerkey);
      this.$session.set("clientservice", this.servicewindow);
      this.$session.set("servicedate", this.servicedate);
      this.$session.set("docid", this.docid);

      //Add client contact
      this.addclientcontact();

      //Get Location
      this.geolocate();
    },
    geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.mylocation = new firebase.firestore.GeoPoint(
            position.coords.latitude,
            position.coords.longitude
          );
          if (this.mylocation && this.docid) {
            db.collection("currentnumber")
              .doc(this.docid)
              .set(
                {
                  //provider: this.providerkey,
                  //ervicedate: this.servicedate,
                  //servicewindow: this.servicewindow,
                  clientlocations: { [this.mynumber]: this.mylocation },
                },
                { merge: true }
              );
            console.log("wrote location to firebase doc id", this.docid);
          }
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
  beforeCreate() {},
  created() {
    this.providerkey = this.$route.query.key;
    if (this.myproviderprop != null) {
      this.providerkey = this.myproviderprop;
    }

    db.collection("users")
      .doc(this.providerkey)
      .onSnapshot((doc) => {
        this.provider = doc.data();
        // if (
        //   this.provider.windowtype == null ||
        //   this.provider.windowtype.length == 0
        // ) {
        //   this.servicewindow = "اجمالي عدد الطابور";
        // }
        if (this.provider.windowtype && this.provider.windowtype.length > 0) {
          this.getnumberdisabled = true;
        }
      });
    /*
    this.provider = this.providers[this.providerkey];
    if (this.provider.windowtype && this.provider.windowtype.length > 0) {
      this.getnumberdisabled = true;
    }
    */

    if (this.mynumberprop != null) {
      this.mynumber = this.mynumberprop;
    }
    if (this.myserviceprop != null) {
      this.servicewindow = this.myserviceprop;
    }
    if (this.myservicedateprop != null) {
      this.servicedate = this.myservicedateprop;
    }
    if (this.mydocidprop != null) {
      this.docid = this.mydocidprop;
    }

    //Get currently serving
    this.getcurrentlyserving();
  },
  watch: {
    showdate() {
      //When date changes get numbers of new date
      this.getcurrentlyserving();
    },
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.bigtxt {
  font-weight: 700;
  font-size: 20px;
}

.v-select {
  font-size: 20px;
}
.mynumberinline {
  font-size: 0.7em;
  padding-bottom: 10px;
}
.callwindow {
  display: table-cell;
  vertical-align: middle;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 2px dashed white;
  font-size: 4 em;
}
</style>
