<template>
  <div :dir="dir" :class="container">
    <!-- <b-container class="container" :dir="dir"> -->
    <!-- {{ currentlyserving }} -->
    <!-- currently served numbers -->

    <b-alert :show="showtitle" variant="dark">
      <h4>
        {{ $t("alerts.currentlyserved") }}
      </h4>
    </b-alert>

    <div v-if="this.currentlyserving && this.currentlyservingsize > 0">
      <b-row fluid>
        <b-col
          v-for="cn in currentlyserving"
          v-bind:key="cn.id"
          :cols="cols"
          :md="md"
        >
          <b-card
            v-if="servicewindow == null || servicewindow == cn.servicewindow"
            class="mb-2"
            :style="'min-height:' + minheight + 'px;'"
            :id="cn.id"
          >
            <template v-slot:header v-if="cn.servicewindow">
              <span
                v-if="
                  ur.windowtypeLang &&
                    ur.windowtypeLang[cn.servicewindow] &&
                    ur.windowtypeLang[cn.servicewindow][lang]
                "
              >
                {{ ur.windowtypeLang[cn.servicewindow][lang] }}
              </span>
              <span v-else>{{ cn.servicewindow }}</span>
            </template>
            <b-card-body>
              <b-row
                style="margin:0px"
                v-for="(number, window) in cn.inservice"
                v-bind:key="window"
                :id="cn.id + '-' + window"
              >
                <b-col class="bordered">
                  {{ $t("labels.number") }}
                  <span class="bold"><number :to="number" /> </span>
                </b-col>
                <b-col class="bordered">
                  {{ $t("labels.window") }}
                  <span class="bold"><number :to="window"/></span>
                </b-col>
              </b-row>
            </b-card-body>
            <template v-slot:footer v-if="cn.updatedAt">
              {{ $t("text.lastupdated") }}
              {{ cn.updatedAt.seconds | moment("from") }}
            </template>
          </b-card>
        </b-col>
      </b-row>
      <!-- In Case servicewindow is selected -->
    </div>
    <!-- end currently served numbers -->
    <div style="display:none;">
      {{ showtime }}
    </div>
    <!-- </b-container> -->
    <audio
      id="ding"
      v-if="this.$router.currentRoute.name == 'Display'"
      src="../assets/ding.mp3"
      muted
    ></audio>
    <b-modal
      v-model="modalShow"
      size="xl"
      ok-disabled
      cancel-disabled
      hide-header
      hide-footer
      hide-header-close
    >
      <b-jumbotron fluid container-fluid style="text-align:center;">
        <template v-slot:header>
          {{ $t("alerts.currentnumber", { value: mynumber }) }}
        </template>
        <template v-slot:lead>
          <div style="font-size:3em">
            <br />
            {{ $t("select.windownumber") + mywindow }}
            <br />
            <br v-if="myservicewindow" />
            {{ myservicewindow }}
          </div>
          <br />
          {{ showdate }}
        </template>
      </b-jumbotron>
    </b-modal>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Display",
  props: [
    "ur",
    "pk",
    "servicewindow",
    "dir",
    "ta",
    "showtime",
    "showdate",
    "lang",
  ],
  data() {
    return {
      //provider: {},
      //servicewindow: null,
      currentlyserving: {},
      currentlyservingsize: 0,
      lastcurrentlyserving: {},
      servicedate: null,
      modalShow: false,
      mynumber: null,
      mywindow: null,
      myservicewindow: null,
      unsubscribe: null,
    };
  },
  computed: {
    showtitle() {
      if (
        this.$router.currentRoute.name == "Display" ||
        (this.currentlyserving && this.currentlyservingsize > 0)
      )
        return true;
      else return false;
    },
    container() {
      if (this.$router.currentRoute.name == "Display") return "container";
      else return "";
    },
    cols() {
      if (this.currentlyservingsize != null) {
        return 12;
      } else {
        return 6;
      }
    },
    md() {
      if (this.currentlyserving && this.servicewindow == null) {
        return Math.ceil(12 / this.currentlyservingsize);
      } else {
        return 12;
      }
    },
    minheight() {
      var largestwindows = 1;
      var csz = this.currentlyservingsize;
      var nullservicewindow = false;
      if (this.servicewindow == null && this.currentlyserving && csz > 0) {
        Object.values(this.currentlyserving).forEach((servicewindow) => {
          var counter = Object.keys(servicewindow.inservice).length;
          if (counter > largestwindows) {
            largestwindows = counter;
          }
          if (servicewindow.servicewindow == null) {
            nullservicewindow = true;
          }
        });
      }

      if (window.innerWidth < 400) {
        var cardhead = 46;
        var cardfooter = 46;
      } else {
        cardhead = 49;
        cardfooter = 49;
      }
      if (nullservicewindow) {
        cardhead = 0;
      }
      return largestwindows * 50 + cardhead + cardfooter;

      //return 200;
    },
    provider() {
      return this.ur;
    },
    providerkey() {
      if (this.pk) return this.pk;
      else return this.ur.uid;
    },
  },
  watch: {
    showdate() {
      //When date changes get numbers of new date
      this.servicedate = this.showdate;
      this.getcurrentlyserving();
    },
    currentlyserving() {
      //console.log("currentlyserving watch");
      Object.keys(this.currentlyserving).forEach((swindow) => {
        /*
        if (this.lastcurrentlyserving[swindow]) {
          var o1 = this.lastcurrentlyserving[swindow].inservice;
        } else {
          o1 = {};
        }
        var o2 = this.currentlyserving[swindow].inservice;
        let diff = Object.keys(o2).reduce((diff, key) => {
          if (o1[key] === o2[key]) return diff;
          return {
            ...diff,
            [key]: o2[key],
          };
        }, {});
        console.log("o1:", o1);
        console.log("o2:", o2);
        console.log("diff:", diff);
        */
        if (
          this.lastcurrentlyserving &&
          this.lastcurrentlyserving[swindow] &&
          this.lastcurrentlyserving[swindow].servingnumber
        ) {
          var a1 = this.lastcurrentlyserving[swindow].servingnumber;
        } else {
          a1 = this.currentlyserving[swindow].servingnumber;
        }

        var a2 = this.currentlyserving[swindow].servingnumber;
        let numdiff = a2 - a1;
        // console.log("a1:", a1);
        // console.log("a2:", a2);
        // console.log("numdiff:", numdiff);
        if (numdiff > 0) {
          var alertid = this.currentlyserving[swindow].id;
          this.updatednumber(alertid, "card-alert-blue");

          var o1 = this.lastcurrentlyserving[swindow].inservice;
          var o2 = this.currentlyserving[swindow].inservice;
          let diff = Object.keys(o2).reduce((diff, key) => {
            if (o1[key] === o2[key]) return diff;
            return {
              ...diff,
              [key]: o2[key],
            };
          }, {});
          // console.log("o1:", o1);
          // console.log("o2:", o2);
          // console.log("diff:", diff);
          var window = Object.keys(diff)[0];
          this.mywindow = window;
          this.mynumber = diff[window];
          if (swindow != "null") {
            this.myservicewindow = swindow;
          }

          alertid = this.currentlyserving[swindow].id + "-" + window;
          setTimeout(() => {
            this.updatednumber(alertid, "card-alert-red");
          }, 300); //wait for the card to be updated

          // if (
          //   diff &&
          //   Object.keys(diff) &&
          //   Object.keys(diff)[0] &&
          //   Object.keys(diff)[0].length > 0
          // ) {
          // var key = Object.keys(diff)[0];
          // var alertid = change.doc.id + "-" + window;
          // this.updatednumber(alertid, "card-alert-red");
          // this.updatednumber(key);
          // Object.keys(diff).forEach((window) => {
          //   console.log("window changed", window);
          //   this.mywindow = window;
          //   this.mynumber = diff[window];
          //   if (change.doc.data().servicewindow) {
          //     this.myservicewindow = change.doc.data().servicewindow;
          //   }
          //   var alertid = change.doc.id + "-" + window;
          //   this.updatednumber(alertid, "card-alert-red");
          // });
          //}
        }
        this.lastcurrentlyserving[swindow] = Object.assign(
          {},
          this.currentlyserving[swindow]
        );
      });
    },
  },
  methods: {
    updatednumber(id, classchange) {
      //console.log("card alert id", id);
      if (document.getElementById(id)) {
        //Check if it is still there or deleted
        //console.log("found element id", id);
        document.getElementById(id).classList.add(classchange);
      }
      setTimeout(() => {
        if (document.getElementById(id)) {
          document.getElementById(id).classList.remove(classchange);
        }
      }, 3000);

      if (
        this.$router.currentRoute.name == "Display" &&
        classchange == "card-alert-red"
      ) {
        if (this.mynumber && this.mywindow && this.modalShow == false) {
          //Play Audio
          document.getElementById("ding").muted = false;
          document.getElementById("ding").play();

          //Show number on big screen
          this.modalShow = true;
          setTimeout(() => {
            this.modalShow = false;
            this.mywindow = null;
            this.mynumber = null;
            this.myservicewindow = null;
          }, 10000); //show full screen alert for 10 seconds
        }
      }
    },
    getcurrentlyserving() {
      /*
      // console.log(
      //   "currently serving numbers with date ",
      //   this.servicedate,
      //   "pk",
      //   this.providerkey
      // );
      // Start Listen for snapshot
      this.unsubscribe = db
        .collection("currentlyserving")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        // .where("servicewindow", "==", this.servicewindow)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // if (change.type === "added") {
            //   console.log("New: ", change.doc.data());
            // }
            if (change.type === "modified") {
              // console.log("Modified ERROR: ", change.doc.data());
              // console.log("Modified Number: ", change.doc.data().servingnumber);
              // console.log(
              //   "Modified servicewindow: ",
              //   change.doc.data().servicewindow
              // );

              if (
                change.doc.data().inservice &&
                this.lastcurrentlyserving &&
                this.lastcurrentlyserving[change.doc.id] &&
                this.lastcurrentlyserving[change.doc.id].inservice &&
                change.doc.data().inservice !=
                  this.lastcurrentlyserving[change.doc.id].inservice
              ) {
                // console.log("Modified: ", change.doc.id);
                this.updatednumber(change.doc.id, "card-alert-blue");

                //Find the window that was changed in the object inservice
                var o1 = this.lastcurrentlyserving[change.doc.id].inservice;
                var o2 = change.doc.data().inservice;
                // console.log("old inservice: ", o1);
                // console.log("new inservice: ", o2);

                let diff = Object.keys(o2).reduce((diff, key) => {
                  if (o1[key] === o2[key]) return diff;
                  return {
                    ...diff,
                    [key]: o2[key],
                  };
                }, {});
                console.log("o1:", o1);
                console.log("o2:", o2);
                console.log("diff:", diff);
                Object.keys(diff).forEach((window) => {
                  console.log("window changed", window);
                  this.mywindow = window;
                  this.mynumber = diff[window];
                  if (change.doc.data().servicewindow) {
                    this.myservicewindow = change.doc.data().servicewindow;
                  }

                  var alertid = change.doc.id + "-" + window;
                  this.updatednumber(alertid, "card-alert-red");
                });
              }
              this.lastcurrentlyserving = Object.assign(
                {},
                this.currentlyserving
              );
            }

            // if (change.type === "removed") {
            //   console.log("Removed: ", change.doc.data());
            // }
          });

          //Update the current number object
          //console.log("clearing current number");
          //this.lastcurrentlyserving = Object.assign({}, this.currentlyserving);

          this.currentlyservingsize = 0;
          snapshot.forEach((doc) => {
            if (Object.keys(doc.data().inservice).length > 0) {
              //Filter Empty Service windows
              // console.log("getting currently serving docid", doc.id);
              this.currentlyserving[doc.id] = doc.data();
              this.currentlyserving[doc.id].id = doc.id;
              this.currentlyservingsize++;
            } else {
              //Remove it from currently serving if it is still there
              // console.log("removing currentlyserving doc.id", doc.id);
              if (this.currentlyserving[doc.id]) {
                setTimeout(() => {
                  delete this.currentlyserving[doc.id];
                }, 3000);
              }
            }
          });
        });
 */

      this.unsubscribe = db
        .collection("currentlyserving")
        .where("provider", "==", this.providerkey)
        .where("servicedate", "==", this.servicedate)
        .onSnapshot((snapshot) => {
          this.currentlyserving = {};
          this.currentlyservingsize = 0;
          // snapshot.forEach((doc) => {
          //   this.currentlyserving[doc.id] = doc.data();
          //   this.currentlyserving[doc.id].id = doc.id;
          //   this.currentlyservingsize++;
          // });
          snapshot.forEach((doc) => {
            if (Object.keys(doc.data().inservice).length > 0) {
              var obj = {};
              obj.servingnumber = doc.data().servingnumber;
              obj.servicewindow = doc.data().servicewindow;
              obj.inservice = doc.data().inservice;
              obj.updatedAt = doc.data().updatedAt;
              obj.id = doc.id;
              this.currentlyserving[doc.data().servicewindow] = obj;
              this.currentlyservingsize++;
            } else if (this.currentlyserving[doc.data().servicewindow]) {
              setTimeout(() => {
                delete this.currentlyserving[doc.data().servicewindow];
              }, 3000);
            }
          });
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    //console.log("unsubscribe");
    this.unsubscribe();
    next();
  },
  beforeCreate() {},
  created() {
    this.servicedate = this.$moment().format("YYYY-MM-DD");
    this.getcurrentlyserving();
    //console.log("this.$router.currentRoute");
    //console.log(this.$router.currentRoute);
    // this.providerkey = this.$route.query.key;
    // db.collection("users")
    //   .doc(this.providerkey)
    //   .onSnapshot((doc) => {
    //this.provider = this.ur;
    /*
    if (
      this.provider.windowtype == null ||
      this.provider.windowtype.length < 2
    ) {
      this.servicewindow = "اجمالي عدد الطابور";
    }
    */
    //   });
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.card-body {
  padding: 0px;
}

.bordered {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-style: solid;
  font-size: 1em;
  padding: 0px;
  height: 50px;

  display: table-cell;
  vertical-align: middle;

  line-height: 50px;
  text-align: center;
}

.card-alert-red {
  /* background-color: #e74c3c; */
  /* color: #0275d8; */
  color: #d9534f;
  font-weight: 700;
  /* font-size: 1em; */
}

.card-alert-blue {
  /* background-color: #e74c3c; */
  color: #0275d8;
  /* color: #d9534f; */
  font-weight: 700;
  /* font-size: 1em; */
}

@media only screen and (max-width: 400px) {
  .bordered {
    font-size: 1.1em;
  }
  .card {
    font-size: 0.9em;
  }
}
</style>
