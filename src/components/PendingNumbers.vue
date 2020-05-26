<template>
  <div :dir="dir">
    <!-- <b-container class="container" :dir="dir"> -->
    {{ diff }}
    <div v-if="this.pendingnumberssize > 0">
      <b-alert show variant="dark">
        <h4>
          {{ $t("alerts.pendingnumbers") }}
        </h4>
      </b-alert>
      <!-- v-if="servicewindow == null" -->
      <b-row fluid>
        <b-col
          v-for="(cn, label) in pendingnumbers"
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
              {{ cn.updatedAt | moment("from") }}
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
  name: "PendingNumbers",
  props: [
    "ur",
    "pk",
    "mynumber",
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
      currentlyserving: {},
      lastpendingnumbers: {},
      currentnumberloaded: false,
      currentlyservingloaded: false,
      //   pendingnumberssize: 1,
      diff: null,
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
        return Math.ceil(12 / this.pendingnumberssize);
      } else {
        return 12;
      }
    },

    pendingnumbers() {
      var pendingnumbers = {};
      //console.log("Pendingnumbers");
      Object.values(this.currentnumber).forEach((cn) => {
        //console.log("servicewindow number", servicewindow.number);
        //pendingnumbers[cn.servicewindow] = cn.number;
        if (cn.number) {
          if (
            this.currentlyserving &&
            this.currentlyserving[cn.servicewindow] &&
            this.currentlyserving[cn.servicewindow].servingnumber
          ) {
            var sn = this.currentlyserving[cn.servicewindow].servingnumber;
          } else {
            sn = 0;
          }
          if (
            this.currentlyserving &&
            this.currentlyserving[cn.servicewindow] &&
            this.currentlyserving[cn.servicewindow].updatedAt
          ) {
            var snu = this.currentlyserving[cn.servicewindow].updatedAt.seconds;
          } else {
            snu = 0;
          }

          if (cn.AllupdatedAt && cn.AllupdatedAt.seconds) {
            var cnu = cn.AllupdatedAt.seconds;
          } else {
            cnu = 0;
          }
          if (snu == cnu && cnu == 0) {
            var updatedAt = 0;
          } else {
            updatedAt = Math.max(snu, cnu);
          }

          if (cn.canceled && cn.canceled.length > 0) {
            var canceled = cn.canceled.filter((x) => x > sn);
            var numcancled = canceled.length;
          } else {
            numcancled = 0;
          }

          var pendinginline = cn.number - numcancled - sn;
          if (this.mynumber) {
            var peopleahead = this.mynumber - numcancled - sn - 1;
            if (peopleahead < 0) peopleahead = 0;
          }

          if (pendinginline > 0) {
            pendingnumbers[cn.id] = {};
            pendingnumbers[cn.id].number = pendinginline;
            pendingnumbers[cn.id].peopleahead = peopleahead;
            pendingnumbers[cn.id].servicewindow = cn.servicewindow;
            pendingnumbers[cn.id].updatedAt = updatedAt;
          }
        }
        //pendingnumbers = { odf: "333" };
      });
      return pendingnumbers;
    },
    pendingnumberssize() {
      return Object.values(this.pendingnumbers).length;
    },
  },
  watch: {
    showdate() {
      //When date changes get numbers of new date
      this.getcurrentnumbers();
      this.getcurrentlyserving();
    },
    pendingnumbers() {
      // console.log("pendingnumbers watch");
      // if (
      //   this.lastpendingnumbers &&
      //   this.lastpendingnumbers[cn.id] &&
      //   this.lastpendingnumbers[cn.id].number &&
      //   this.lastpendingnumbers[cn.id].number != pendinginline
      // ) {
      //   this.updatednumber(cn.id);
      // }
      var o1 = this.lastpendingnumbers;
      var o2 = this.pendingnumbers;
      let diff = Object.keys(o2).reduce((diff, key) => {
        if (o1[key] === o2[key]) return diff;
        return {
          ...diff,
          [key]: o2[key],
        };
      }, {});

      if (
        diff &&
        Object.keys(diff) &&
        Object.keys(diff)[0] &&
        Object.keys(diff)[0].length > 0
      ) {
        // console.log(this.lastpendingnumbers);
        // if (Object.keys(this.lastpendingnumbers).length != 0) {
        // if (this.currentnumberloaded && this.currentlyservingloaded) {
        //No color change on first load
        // console.log("color");
        var key = Object.keys(diff)[0];
        this.updatednumber(key);
        // }

        var servicewindow = Object.values(diff)[0].servicewindow;
        var peopleahead = Object.values(diff)[0].peopleahead;
        this.$emit("aheadofme", servicewindow, peopleahead);
        //this.diff = Object.values(diff)[0]; //for debug only
      }

      this.lastpendingnumbers = this.pendingnumbers;
    },
  },
  methods: {
    updatednumber(id) {
      //alert("updating id " + id);
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
      // Start Listen for snapshot
      db.collection("currentnumber")
        .where("provider", "==", this.pk)
        .where("servicedate", "==", this.servicedate)
        .onSnapshot((snapshot) => {
          this.currentnumber = {};
          var l = 0;
          snapshot.forEach((doc) => {
            // console.log("setting current number with new data");
            //this.currentnumber[doc.id] = doc.data();
            //this.currentnumber[doc.id].id = doc.id;
            var obj = {};
            if (doc.data().number) {
              obj.number = doc.data().number;
              obj.servicewindow = doc.data().servicewindow;
              obj.AllupdatedAt = doc.data().AllupdatedAt;
              obj.id = doc.id + "pn";
              if (doc.data().canceled) {
                var canceled = doc.data().canceled;
                canceled.sort((a, b) => a - b); // For ascending sort
                obj.canceled = canceled;
              }
              this.currentnumber[doc.data().servicewindow] = obj;
            }
            l++;
            if (l == snapshot.size) this.currentnumberloaded = true;
          });
        });
    },
    getcurrentlyserving() {
      // Start Listen for snapshot
      db.collection("currentlyserving")
        .where("provider", "==", this.pk)
        .where("servicedate", "==", this.servicedate)
        .onSnapshot((snapshot) => {
          var l = 0;
          this.currentlyserving = {};
          snapshot.forEach((doc) => {
            // console.log("setting current number with new data");
            //this.currentlyserving[doc.id] = doc.data();
            //this.currentlyserving[doc.id].id = doc.id;
            if (doc.data().servingnumber) {
              var obj = {};
              obj.servingnumber = doc.data().servingnumber;
              obj.servicewindow = doc.data().servicewindow;
              obj.updatedAt = doc.data().updatedAt;
              this.currentlyserving[doc.data().servicewindow] = obj;
            }
          });
          l++;
          if (l == snapshot.size) this.currentlyservingloaded = true;
        });
    },
  },
  beforeCreate() {},
  created() {
    this.servicedate = this.$moment().format("YYYY-MM-DD");
    this.getcurrentnumbers();
    this.getcurrentlyserving();

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
  /* color: #0275d8; */
  color: #d9534f;
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
