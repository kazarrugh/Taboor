<template>
  <b-container class="container" :dir="dir">
    <div>
      <!-- Start Provider Information -->
      <ProviderContact :ur="provider" :dir="dir" :ta="ta" />
      <!-- End Provider Information -->

      <b-form @submit="getnumber">
        <v-select
          v-if="provider.windowtype && provider.windowtype.length > 1"
          :options="this.provider.windowtype"
          :placeholder="$t('select.typeofservice')"
          v-model="servicewindow"
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
        <br /><br />
        <v-select
          :options="totalwindows"
          :reduce="(option) => option.value"
          :placeholder="$t('select.windownumberselect')"
          v-model="mywindow"
          :dir="dir"
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

        <br /><br />
        <b-button
          block
          :disabled="servicewindow == null || nextnumber > maxnumber"
          variant="outline-primary"
          type="submit"
          size="lg"
        >
          {{ $t("buttons.nextnumber") }}
        </b-button>
        <!-- v-if="servingnumber" -->
        <div v-if="servingnumber">
          <br /><br />
          <b-alert variant="primary" show>
            <h2>{{ $t("alerts.currentnumber", { value: servingnumber }) }}</h2>
            <div v-if="distance">
              <br />
              <h5>{{ $t("alerts.distance", { value: distance }) }}</h5>
            </div>
          </b-alert>
        </div>
      </b-form>

      <!-- currently served numbers -->

      <Display
        :ur="provider"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
      />
      <!-- end currently served numbers -->
      <!-- current total numbers -->
      <TotalNumbers
        :ur="provider"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
      />
      <!-- end current total numbers -->
      <!-- Start customer reviews -->
      <Reviews
        :ur="provider"
        :pk="ur.uid"
        :servicewindow="servicewindow"
        :dir="dir"
        :ta="ta"
      />
      <!-- End customer reviews -->
    </div>
  </b-container>
</template>

<script>
import ProviderContact from "@/components/ProviderContact";
import Display from "@/components/Display";
import TotalNumbers from "@/components/TotalNumbers";
import getDistance from "geolib/es/getDistance";
import Reviews from "@/components/Reviews";

import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Serve",
  props: ["ur", "dir", "ta", "providers"],
  data() {
    return {
      provider: {},
      servicewindow: null,
      mywindow: null,
      servingnumber: null,
      distance: null,
    };
  },
  components: {
    ProviderContact,
    Display,
    Reviews,
    TotalNumbers,
  },
  computed: {
    md() {
      if (this.provider.currentnumber) {
        return Math.ceil(12 / Object.keys(this.provider.currentnumber).length);
      } else {
        return "12";
      }
    },
    maxnumber() {
      if (
        this.servicewindow == null ||
        this.provider.currentnumber == null ||
        this.provider.currentnumber[this.servicewindow] == null
      ) {
        return null;
      }
      return this.provider.currentnumber[this.servicewindow];
    },
    nextnumber() {
      if (
        this.servicewindow == null ||
        this.provider.currentlyserving == null ||
        this.provider.currentlyserving[this.servicewindow] == null
      ) {
        return 1;
      }
      var arr = Object.values(
        this.provider.currentlyserving[this.servicewindow]
      );
      var max = arr.reduce(function(a, b) {
        return Math.max(a, b);
      });
      return max + 1;
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
    getnumber(evt) {
      evt.preventDefault();
      this.distance = null;

      if (this.provider.currentlyserving == null) {
        this.provider.currentlyserving = {};
      }

      if (this.provider.currentlyserving[this.servicewindow] == null) {
        this.provider.currentlyserving[this.servicewindow] = {};
      }

      //Delete cordinates of the last served number
      db.collection("users")
        .doc(this.ur.uid)
        .update({
          ["clientlocations." +
          this.servicewindow +
          "." +
          this.servingnumber]: firebase.firestore.FieldValue.delete(),
        });

      //Set serving number to be the next number
      this.servingnumber = this.nextnumber;

      //Update local data object
      this.provider.currentlyserving[this.servicewindow][
        this.mywindow
      ] = this.servingnumber;

      //Update remote data object
      db.collection("users")
        .doc(this.ur.uid)
        .update({
          currentlyserving: this.provider.currentlyserving,
        });

      //Check distance with the client

      if (
        this.provider.clientlocations &&
        this.provider.clientlocations[this.servicewindow] &&
        this.provider.clientlocations[this.servicewindow][this.servingnumber]
      ) {
        var clientcoordinates = this.provider.clientlocations[
          this.servicewindow
        ][this.servingnumber];
      }
      if (this.provider.coordinates != null && clientcoordinates != null) {
        this.distance = getDistance(
          { latitude: clientcoordinates.Pc, longitude: clientcoordinates.Vc },
          {
            latitude: this.provider.coordinates.Pc,
            longitude: this.provider.coordinates.Vc,
          }
        );
      }

      //End Distance
    },
  },
  beforeCreate() {},
  created() {
    db.collection("users")
      .doc(this.ur.uid)
      .onSnapshot((doc) => {
        this.provider = doc.data();
        if (
          this.provider.windowtype == null ||
          this.provider.windowtype.length == 0
        ) {
          this.servicewindow = "اجمالي عدد الطابور";
        }
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

.v-select {
  font-size: 20px;
  text-align: center;
}
</style>
