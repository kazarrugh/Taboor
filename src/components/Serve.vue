<template>
  <div>
    <b-container fluid class="container cont" :dir="dir">
      <!-- Start Provider Information -->
      <ProviderContact :ur="provider" :dir="dir" :ta="ta" :lang="lang" />
      <!-- End Provider Information -->

      <b-form @submit="servenumber" class=" cont">
        <v-select
          v-if="provider.windowtype && provider.windowtype.length > 1"
          :disabled="disabledserviceandwindow"
          :options="translatedwindowtype"
          :placeholder="$t('select.typeofservice')"
          v-model="servicewindow"
          :dir="dir"
          class="cont"
          :searchable="false"
          :reduce="(option) => option.value"
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

        <v-select
          :options="totalwindows"
          :reduce="(option) => option.value"
          :disabled="disabledserviceandwindow"
          :placeholder="$t('select.windownumberselect')"
          v-model="mywindow"
          :dir="dir"
          class="cont"
          :searchable="false"
        >
          <template #search="{attributes, events}">
            <input
              :required="!mywindow"
              class="vs__search"
              v-bind="attributes"
              v-on="events"
            />
          </template>
        </v-select>

        <b-button
          block
          :disabled="!mywindow || !nextnumber"
          variant="outline-primary"
          type="submit"
          size="lg"
          class="cont"
        >
          <span v-if="this.nextnumber">
            {{ $t("buttons.nextnumber") + ": " + this.nextnumber }}
          </span>
          <span v-else>
            {{ $t("buttons.nextnumber") }}
          </span>
        </b-button>
        <!-- 
        {{ "Maxnumber: " + this.maxnumber }}
        ----
        {{ "Next Number: " + this.nextnumber }}
         -->
        <div v-if="servingnumber">
          <b-alert variant="primary" show>
            <h1>{{ $t("alerts.currentnumber", { value: servingnumber }) }}</h1>

            <div v-if="clientname">
              <br />
              <h3>{{ clientname }}</h3>
            </div>
            <div v-if="clientphone">
              <h4>{{ clientphone }}</h4>
            </div>
            <div v-if="timer">
              <br />
              <h5>{{ timer }}</h5>
            </div>
          </b-alert>
          <b-alert
            variant="danger"
            :show="dismissCountDown"
            @dismissed="dismissCountDown = 0"
            @dismiss-count-down="countDownChanged"
          >
            {{ error }}
          </b-alert>

          <b-button
            block
            v-if="servingnumber"
            variant="outline-danger"
            size="lg"
            @click="skipnumber"
            class="cont"
          >
            {{ $t("buttons.skipnumber") }}
          </b-button>

          <b-button
            block
            v-if="servingnumber"
            variant="outline-danger"
            size="lg"
            @click="doneserving"
            class="cont"
          >
            {{ $t("buttons.doneserving") }}
          </b-button>
        </div>
      </b-form>

      <PendingNumbers
        class="cont"
        :ur="provider"
        :pk="providerkey"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
        :lang="lang"
        :showtime="showtime"
        :showdate="showdate"
      />
      <!-- currently served numbers -->

      <Display
        class="cont"
        :ur="provider"
        :pk="providerkey"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
        :lang="lang"
        :showtime="showtime"
        :showdate="showdate"
      />
      <!-- end currently served numbers -->
      <!-- current total numbers -->

      <TotalNumbers
        class="cont"
        :ur="provider"
        :pk="providerkey"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
        :lang="lang"
        :showtime="showtime"
        :showdate="showdate"
      />
      <!-- end current total numbers -->
      <!-- Start customer reviews -->
      <Reviews
        class="cont"
        :ur="provider"
        :pk="providerkey"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
        :lang="lang"
      />

      <!-- End customer reviews -->
    </b-container>
  </div>
</template>

<script>
import ProviderContact from "@/components/ProviderContact";
import Display from "@/components/Display";
import TotalNumbers from "@/components/TotalNumbers";
import PendingNumbers from "@/components/PendingNumbers";
import getDistance from "geolib/es/getDistance";
import Reviews from "@/components/Reviews";

import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Serve",
  props: ["ur", "dir", "ta", "providers", "lang", "showtime", "showdate"],
  data() {
    return {
      servicedate: null,
      servicewindow: null,
      mywindow: null,
      servingnumber: null,
      distance: null,
      clientname: null,
      clientphone: null,
      servenumberdisabled: null,
      docid: null,
      currentnumber: null,
      currentlyserving: null,
      error: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      timer: null,
      startTimestamp: null,
    };
  },
  components: {
    ProviderContact,
    Display,
    Reviews,
    TotalNumbers,
    PendingNumbers,
  },
  computed: {
    translatedwindowtype() {
      var twtAr = [];
      this.provider.windowtype.forEach((twt) => {
        if (
          this.provider.windowtypeLang &&
          this.provider.windowtypeLang[twt] &&
          this.provider.windowtypeLang[twt][this.lang]
        ) {
          twtAr.push({
            label: this.provider.windowtypeLang[twt][this.lang],
            value: twt,
          });
        } else {
          twtAr.push({ label: twt, value: twt });
        }
      });

      return twtAr;
    },
    disabledserviceandwindow() {
      if (this.servingnumber) return true;
      else return false;
    },
    providerkey() {
      return this.ur.uid;
    },
    provider() {
      return this.providers[this.ur.uid];
    },
    // servicedate() {
    //   return this.showdate;
    // },
    maxnumber() {
      if (
        this.currentnumber == null ||
        this.currentnumber[this.servicewindow] == null ||
        this.currentnumber[this.servicewindow].number == null
      ) {
        return null;
      } else {
        return this.currentnumber[this.servicewindow].number;
      }
    },
    cancelednumbers() {
      if (
        this.currentnumber == null ||
        this.currentnumber[this.servicewindow] == null ||
        this.currentnumber[this.servicewindow].canceled == null
      ) {
        return null;
      } else {
        return this.currentnumber[this.servicewindow].canceled;
      }
    },
    nextnumber() {
      if (
        this.currentlyserving == null ||
        this.currentlyserving[this.servicewindow] == null ||
        this.currentlyserving[this.servicewindow].servingnumber == null
      ) {
        var nextnumber = 1;
      } else {
        nextnumber =
          this.currentlyserving[this.servicewindow].servingnumber + 1;
      }
      if (this.cancelednumbers && this.cancelednumbers.length > 0) {
        while (this.cancelednumbers.includes(nextnumber)) {
          nextnumber++;
        }
      }
      if (nextnumber > this.maxnumber) {
        return null;
      } else {
        return nextnumber;
      }
    },
    totalwindows() {
      var tw = [];
      var label = this.$t("select.windownumber");

      for (var i = 1; i < 21; i++) {
        tw.push({ label: label + i, value: i });
      }
      return tw;
    },
  },
  methods: {
    addnewnumber() {
      //WE HAVE TO MAKE SURE THAT SOMEONE IS IN LINE BEFORE SERVING THEM
      if (this.maxnumber) {
        this.servingnumber = 1;
        // console.log("adding servingnumber 1 ", this.servingnumber);

        db.collection("currentlyserving")
          .add({
            provider: this.providerkey,
            servicedate: this.servicedate,
            servicewindow: this.servicewindow,
            inservice: { [this.mywindow]: this.servingnumber },
            servingnumber: this.servingnumber,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((doc) => {
            this.docid = doc.id;
            this.servenumberfollowup();

            //Delete the service wait time
            db.collection("users")
              .doc(this.providerkey)
              .set(
                {
                  time: {
                    [this
                      .servicewindow]: firebase.firestore.FieldValue.delete(),
                  },
                },
                { merge: true }
              );
            // console.log(
            //   "Delted time for user ",
            //   this.providerkey,
            //   " service ",
            //   this.servicewindow
            // );
          });
      } else {
        // console.log("Not adding to firestore because maxnumber is null!");
      }
    },
    skipnumber() {
      //Clicked if someone is not served

      // console.log("skipping number");
      if (this.nextnumber) {
        this.servenumber("skipnumber");
      } else {
        this.cleanupnumber();
      }

      //Clean up number happens in servenumber
    },
    doneserving() {
      //In case all people in line are served, including the people currently served

      //Save Service time of last service
      this.saveservicetime(this.timer, this.providerkey, this.servicewindow);
      this.cleanupnumber();
    },
    saveservicetime(timer, providerkey, servicewindow) {
      // console.log("Saving Service Time");
      if (timer) {
        var t = timer.split(":");
        var servicetimeinseconds = +t[0] * 60 * 60 + +t[1] * 60 + +t[2];

        var timerDocRef = db.collection("users").doc(providerkey);
        return db
          .runTransaction((transaction) => {
            return transaction.get(timerDocRef).then((timerDoc) => {
              if (!timerDoc.exists) {
                throw "Document does not exist!";
              }
              if (
                timerDoc.data().time &&
                timerDoc.data().time[servicewindow] &&
                timerDoc.data().time[servicewindow].AvgTime &&
                timerDoc.data().time[servicewindow].NumTimes
              ) {
                var AvgTime = timerDoc.data().time[servicewindow].AvgTime;

                var NumTimes = timerDoc.data().time[servicewindow].NumTimes;

                // console.log(
                //   "servicetimeinseconds",
                //   servicetimeinseconds,
                //   "AvgTime: ",
                //   AvgTime,
                //   "NumTimes: ",
                //   NumTimes
                // );

                // Compute new average rating
                var oldAvgTime = AvgTime * NumTimes;

                var newNumTimes = NumTimes + 1;

                var newAvgTime =
                  (oldAvgTime + servicetimeinseconds) / newNumTimes;

                // console.log(
                //   "newNumTimes: ",
                //   newNumTimes,
                //   "oldAvgTime: ",
                //   oldAvgTime,
                //   "newAvgTime: ",
                //   newAvgTime
                // );
              } else {
                newNumTimes = 1;
                newAvgTime = servicetimeinseconds;
              }

              // var newPopulation = timerDoc.data().population + 1;
              var timeobj = {
                [servicewindow]: {
                  NumTimes: newNumTimes,
                  AvgTime: newAvgTime,
                },
              };
              // console.log("saving time obj", timeobj);
              transaction.set(timerDocRef, { time: timeobj }, { merge: true });
            });
          })
          .then(() => {
            // console.log("Save Time Transaction successfully committed!");
          })
          .catch((error) => {
            console.log("Save Time Transaction failed: ", error);
          });
      } else {
        // console.log("there was no timer to save");
      }
    },
    cleanupnumber() {
      // console.log("cleaning up number", this.servingnumber);
      //Delete the number from currentlysering inservice object
      if (this.docid) {
        // console.log(
        //   "deleting number from inservice window",
        //   this.mywindow,
        //   "docid",
        //   this.docid
        // );
        db.collection("currentlyserving")
          .doc(this.docid)
          .set(
            {
              inservice: {
                [this.mywindow]: firebase.firestore.FieldValue.delete(),
              },
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
      }

      //Delete local data
      this.distance = null;
      this.clientname = null;
      this.clientphone = null;
      this.servingnumber = null;
      this.timer = null;

      //Remove session in case of refresh
      this.$session.remove("servingclientname");
      this.$session.remove("servingclientphone");
      this.$session.remove("servingnumber");
      this.$session.remove("servingwindow");
      this.$session.remove("mywindow");
    },
    servenumber(evt) {
      this.servenumberdisabled = true;
      if (evt != "skipnumber") {
        evt.preventDefault();
        //Disable Get Number button

        //Save Service time of last service
        this.saveservicetime(this.timer, this.providerkey, this.servicewindow);
      }
      //Clean Up last number
      this.cleanupnumber();

      db.collection("currentlyserving")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        .where("servicewindow", "==", this.servicewindow)
        .get({ source: "server" })
        .then((querySnapshot) => {
          // console.log("querySnapshot.size is ", querySnapshot.size);
          if (querySnapshot.size == 0) {
            //In case this is a new date
            this.addnewnumber();
          } else {
            querySnapshot.forEach((doc) => {
              if (doc.data().servingnumber) {
                this.docid = doc.id;

                //Start Transaction
                var snDocRef = db
                  .collection("currentlyserving")
                  .doc(this.docid);

                return db
                  .runTransaction((transaction) => {
                    // This code may get re-run multiple times if there are conflicts.
                    return transaction.get(snDocRef).then((snDoc) => {
                      if (!snDoc.exists) {
                        throw "Document does not exist!";
                      }

                      var servingnumber = snDoc.data().servingnumber + 1;
                      // console.log(
                      //   "servingnumber before checking canceled",
                      //   servingnumber
                      // );

                      //Check if serving number is not in the canceled numbers
                      if (
                        this.cancelednumbers &&
                        this.cancelednumbers.length > 0
                      ) {
                        while (this.cancelednumbers.includes(servingnumber)) {
                          servingnumber++;
                        }
                      }

                      // console.log(
                      //   "servingnumber before transaction",
                      //   servingnumber
                      // );
                      if (servingnumber <= this.maxnumber) {
                        transaction.set(
                          snDocRef,
                          {
                            servingnumber: servingnumber,
                            inservice: { [this.mywindow]: servingnumber },
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                          },
                          { merge: true }
                        );
                        return servingnumber;
                      } else {
                        return Promise.reject(
                          "No more people in line to serve."
                        );
                      }
                    });
                  })
                  .then((servingnumber) => {
                    // console.log("Transaction servingnumber:", servingnumber);
                    this.servingnumber = servingnumber;
                    this.servenumberfollowup();
                  })
                  .catch((error) => {
                    //console.log("Transaction failed: ", error);
                    if (error == "No more people in line to serve.") {
                      this.error = this.$t("alerts.nomorepeople");
                      this.showAlert();
                    }
                  });
              } else {
                // console.log(doc.id, " doc id Doesnt contain a serving number");
                this.addnewnumber();
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.error = this.$t("alerts.offline");
          this.showAlert();
          //Enable Serve Number button
          this.servenumberdisabled = false;
        });
    },
    servenumberfollowup() {
      if (this.currentnumber && this.currentnumber[this.servicewindow]) {
        //START GET CLIENT NAME
        if (
          this.currentnumber[this.servicewindow].clientnames &&
          this.currentnumber[this.servicewindow].clientnames[this.servingnumber]
        ) {
          this.clientname = this.currentnumber[this.servicewindow].clientnames[
            this.servingnumber
          ];
        }
        //END GET CLIENT NAME
        //
        //START GET CLIENT Phone
        if (
          this.currentnumber[this.servicewindow].clientphones &&
          this.currentnumber[this.servicewindow].clientphones[
            this.servingnumber
          ]
        ) {
          this.clientphone = this.currentnumber[
            this.servicewindow
          ].clientphones[this.servingnumber];
        }
        //END GET CLIENT Phone
        //
        //START GET CLIENT Distance
        if (
          this.currentnumber[this.servicewindow].clientlocations &&
          this.currentnumber[this.servicewindow].clientlocations[
            this.servingnumber
          ]
        ) {
          var clientcoordinates = this.currentnumber[this.servicewindow]
            .clientlocations[this.servingnumber];
        }

        if (this.provider.coordinates != null && clientcoordinates != null) {
          this.distance = getDistance(
            { latitude: clientcoordinates.Pc, longitude: clientcoordinates.Vc },
            {
              latitude: this.provider.coordinates.Pc,
              longitude: this.provider.coordinates.Vc,
            }
          );

          this.error = this.$t("alerts.distance", { value: this.distance });
          this.showAlert();
        }
        //END GET CLIENT Distance

        //Start recording time of service

        this.startTimestamp = this.$moment().startOf("day");
      }

      //Save in session in case of refresh
      this.$session.set("servingclientname", this.clientname);
      this.$session.set("servingclientphone", this.clientphone);
      this.$session.set("servingnumber", this.servingnumber);
      this.$session.set("servingwindow", this.servingwindow);
      this.$session.set("mywindow", this.mywindow);

      //Enable Serve Number button
      this.servenumberdisabled = false;
    },

    getcurrentnumbers() {
      // console.log(
      //   "getting numbers pk ",
      //   this.providerkey,
      //   "date: ",
      //   this.servicedate
      // );
      db.collection("currentnumber")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        .onSnapshot((snapshot) => {
          this.currentnumber = {};
          snapshot.forEach((doc) => {
            this.currentnumber[doc.data().servicewindow] = doc.data();
            this.currentnumber[doc.data().servicewindow].id = doc.id;
            // console.log(doc.id);
          });
        });
    },
    getcurrentlyserving() {
      // console.log(
      //   "currentlyserving pk ",
      //   this.providerkey,
      //   "date: ",
      //   this.servicedate
      // );
      db.collection("currentlyserving")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        .onSnapshot((snapshot) => {
          this.currentlyserving = {};
          snapshot.forEach((doc) => {
            this.currentlyserving[doc.data().servicewindow] = doc.data();
            this.currentlyserving[doc.data().servicewindow].id = doc.id;
          });
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    startTimer() {
      setInterval(() => {
        if (this.servingnumber != null) {
          this.startTimestamp.add(1, "second");
          this.timer = this.startTimestamp.format("HH:mm:ss");
        }
      }, 1000);
    },
  },
  watch: {
    showdate() {
      //When date changes get numbers of new date
      this.getcurrentnumbers();
      this.getcurrentlyserving();
    },
  },
  beforeCreate() {},
  created() {
    // db.collection("users")
    //   .doc(this.ur.uid)
    //   .onSnapshot((doc) => {
    //     this.provider = doc.data();
    //     if (
    //       this.provider.windowtype == null ||
    //       this.provider.windowtype.length == 0
    //     ) {
    //       this.servicewindow = "اجمالي عدد الطابور";
    //     }
    //   });

    //Get today's date
    this.servicedate = this.$moment().format("YYYY-MM-DD");
    // console.log("servicedate", this.servicedate);
    this.startTimestamp = this.$moment().startOf("day");
    this.startTimer();
    this.getcurrentnumbers();
    this.getcurrentlyserving();

    if (this.$session.exists("servingclientname")) {
      this.clientname = this.$session.get("servingclientname");
    }

    if (this.$session.exists("servingclientphone")) {
      this.clientphone = this.$session.get("servingclientphone");
    }

    if (this.$session.exists("servingnumber")) {
      this.servingnumber = this.$session.get("servingnumber");
    }

    if (this.$session.exists("servingwindow")) {
      this.servingwindow = this.$session.get("servingwindow");
    }

    if (this.$session.exists("mywindow")) {
      this.mywindow = this.$session.get("mywindow");
    }
  },
  mounted() {},
};
</script>

<style scoped>
.cont {
  margin-top: 30px;
  margin-bottom: 30px;
}

@media only screen and (max-width: 400px) {
  /* .container { */
  /* margin: 10px; */
  /* padding: 10px; */
  /* } */
}

.v-select {
  font-size: 20px;
  text-align: center;
}
</style>
