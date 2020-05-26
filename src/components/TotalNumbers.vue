<template>
  <div :dir="dir">
    <!-- <b-container class="container" :dir="dir"> -->
    <!-- {{ currentnumber }} -->
    <div v-if="this.currentnumber && currentnumbersize > 0">
      <b-alert show variant="dark">
        <h4>
          {{ $t("alerts.totalnumbers") }}
        </h4>
      </b-alert>
      <!-- v-if="servicewindow == null" -->
      <b-row fluid>
        <b-col
          v-for="(cn, label) in currentnumber"
          v-bind:key="label"
          :cols="cols"
          :md="md"
        >
          <b-card
            v-if="servicewindow == null || servicewindow == cn.servicewindow"
            class="mb-2"
            :id="label"
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

            <b-card-text class="bold"> <number :to="cn.number"/></b-card-text>
            <template v-slot:footer v-if="cn.updatedAt">
              {{ $t("text.lastupdated") }}
              {{ cn.updatedAt.seconds | moment("from") }}
            </template>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <!-- end currently served numbers -->
    <div style="display:none;">
      {{ showtime }}
    </div>
    <!-- </b-container> -->
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "TotalNumbers",
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
      currentnumber: {},
      lastcurrentnumber: {},
      currentnumbersize: 0,
    };
  },
  computed: {
    cols() {
      if (this.servicewindow != null) {
        return 12;
      } else {
        return 12;
      }
    },
    md() {
      if (this.currentnumber && this.servicewindow == null) {
        return Math.ceil(12 / this.currentnumbersize);
      } else {
        return 12;
      }
    },
    // provider() {
    //   return this.ur;
    // },
    // servicedate() {
    //   return this.showdate;
    // },
  },
  watch: {
    showdate() {
      //When date changes get numbers of new date
      this.getcurrentnumbers();
    },
  },
  methods: {
    updatednumber(id) {
      if (document.getElementById(id)) {
        document.getElementById(id).classList.add("card-alert");
      }
      setTimeout(() => {
        if (document.getElementById(id)) {
          document.getElementById(id).classList.remove("card-alert");
        }
      }, 3000);
    },
    getcurrentnumbers() {
      //console.log("getting numbers with date ", this.servicedate);
      // Start Listen for snapshot
      db.collection("currentnumber")
        .where("provider", "==", this.pk)
        .where("servicedate", "==", this.servicedate)
        // .where("servicewindow", "==", this.servicewindow)
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            // if (change.type === "added") {
            //   console.log("New: ", change.doc.data());
            // }
            if (change.type === "modified") {
              // console.log("Modified ERROR: ", change.doc.data());
              // console.log("Modified Number: ", change.doc.data().number);

              if (
                change.doc.data().number &&
                this.lastcurrentnumber &&
                this.lastcurrentnumber[change.doc.id] &&
                this.lastcurrentnumber[change.doc.id].number &&
                change.doc.data().number !=
                  this.lastcurrentnumber[change.doc.id].number
              ) {
                // console.log("Modified: ", change.doc.id);

                // console.log(
                //   "old number: ",
                //   this.lastcurrentnumber[change.doc.id].number
                // );
                //console.log("channged number: ", change.doc.data().number);

                this.updatednumber(change.doc.id);
              }
            }

            // if (change.type === "removed") {
            //   console.log("Removed: ", change.doc.data());
            // }
          });

          //Update the current number object
          //console.log("clearing current number");
          this.lastcurrentnumber = Object.assign({}, this.currentnumber);
          this.currentnumber = {};
          this.currentnumbersize = 0;
          snapshot.forEach((doc) => {
            //console.log("setting current number with new data");
            this.currentnumber[doc.id] = doc.data();
            this.currentnumber[doc.id].id = doc.id;
            this.currentnumbersize++;
          });
        });
    },
  },
  beforeCreate() {},
  created() {
    this.servicedate = this.$moment().format("YYYY-MM-DD");
    this.getcurrentnumbers();

    // End Listen for snapshot
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.card-alert {
  /* background-color: #e74c3c; */
  color: #0275d8;
  /* color: #d9534f; */
  font-weight: 700;
  /* font-size: 1em; */
}
.card {
  font-size: 1em;
}
.card-body {
  /* max-height: 50px; */
  padding: 13px;
}
.card-footer {
  font-size: 0.8em;
}
</style>
