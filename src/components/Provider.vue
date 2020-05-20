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
          placeholder="نوع الخدمة المطلوبة"
          v-model="servicewindow"
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
          :disabled="!servicewindow"
          variant="outline-primary"
          type="submit"
          size="lg"
        >
          {{ $t("buttons.getnumber") }}
        </b-button>
      </b-form>

      <!-- End Get Number-->
      <!-- Start Show my numebr -->
      <b-card
        v-if="mynumber != null"
        header="رقمي في الطابور"
        class="mb-2 bigtxt"
      >
        <b-card-text> {{ mynumber }}</b-card-text>
      </b-card>
      <!-- End Show my numebr -->

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
          :header="'شباك رقم ' + mywindow"
          :lead="'رقمي في الطابور ' + mynumber"
          style="width:100%;"
        >
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
  props: ["ur", "dir", "ta", "mynumberprop", "myproviderprop", "myserviceprop"],
  data() {
    return {
      providerkey: "",
      provider: {},
      servicewindow: null,
      mynumber: null,
      mylocation: null,
      served: false,
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
    mywindow() {
      if (
        this.mynumber == null ||
        this.provider.currentlyserving == null ||
        this.servicewindow == null
      ) {
        return null;
      }
      var value = this.mynumber;
      var obj = this.provider.currentlyserving[this.servicewindow];

      if (Object.values(obj).includes(value)) {
        this.itsmyturn();

        return Object.keys(obj).find((key) => obj[key] === value);
      } else {
        return null;
      }
    },
    afterserved() {
      if (this.served && this.mywindow == null) {
        this.aftermyturn();
        return true;
      } else return false;
    },
  },
  methods: {
    aftermyturn() {
      //Delete My number
      this.mynumber = null;
      //Clear cookies
      this.$session.remove("clientnumber");
      this.$session.remove("clientprovider");
      this.$session.remove("clientservice");
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
      this.mynumber = null;
      this.served = false;
      this.$session.set("clientname", customername);
      this.$session.set("clientphone", customerphone);
      this.$session.remove("clientnumber");
      this.$session.remove("clientprovider");
      this.$session.remove("clientservice");

      this.$emit(
        "updateclient",
        customername, //clientname
        customerphone, //clientphone
        null, //clientnumber
        null, //clientprovider
        null //clientservice
      );

      this.$router.push({ name: "Dashboard", query: {} });
    },
    getnumber(evt) {
      evt.preventDefault();

      if (this.provider.currentnumber == null) {
        this.provider.currentnumber = {};
      }

      if (this.provider.currentnumber[this.servicewindow] != null) {
        this.mynumber = this.provider.currentnumber[this.servicewindow] + 1;
      } else {
        this.mynumber = 1;
      }
      console.log("my number is", this.mynumber);

      //Update local data object
      this.provider.currentnumber[this.servicewindow] = this.mynumber;

      //Update remote data object
      db.collection("users")
        .doc(this.providerkey)
        .update({
          currentnumber: this.provider.currentnumber,
        });
      console.log("updated firebase with my number", this.mynumber);

      this.$emit(
        "updateclient",
        null,
        null,
        this.mynumber,
        this.providerkey,
        this.servicewindow
      );
      this.$session.set("clientnumber", this.mynumber);
      this.$session.set("clientprovider", this.providerkey);
      this.$session.set("clientservice", this.servicewindow);

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
          console.log("got location", this.mylocation);

          if (this.provider.clientlocations == null) {
            this.provider.clientlocations = {};
          }
          if (this.provider.clientlocations[this.servicewindow] == null) {
            this.provider.clientlocations[this.servicewindow] = {};
          }
          this.provider.clientlocations[this.servicewindow][
            this.mynumber
          ] = this.mylocation;

          console.log("wrote location locally", this.mylocation);

          if (this.mylocation) {
            //Update remote data object
            db.collection("users")
              .doc(this.providerkey)
              .update({
                clientlocations: this.provider.clientlocations,
              });
          }
          console.log("wrote location to firebase", this.mylocation);

          //this.$emit("getdistance", this.mylocation);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
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
        if (
          this.provider.windowtype == null ||
          this.provider.windowtype.length == 0
        ) {
          this.servicewindow = "اجمالي عدد الطابور";
        }
      });
    if (this.mynumberprop != null) {
      this.mynumber = this.mynumberprop;
    }
    if (this.myserviceprop != null) {
      this.servicewindow = this.myserviceprop;
    }
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
