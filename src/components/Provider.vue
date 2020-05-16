<template>
  <div>
    <b-container class="container" :dir="dir" v-if="!served">
      <audio id="ding" src="../assets/ding.mp3" muted></audio>

      <!-- Start Provider Information -->
      <ProviderContact :ur="provider" :dir="dir" :ta="ta" />
      <!-- End Provider Information -->

      <!-- Start Get Number-->
      <b-form @submit="getnumber" v-if="mynumber == null">
        <v-select
          v-if="provider.windowtype && provider.windowtype.length > 1"
          :options="this.provider.windowtype"
          placeholder="نوع الخدمة المطلوبة"
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
        <!--
        <b-form-select
          v-if="provider.windowtype && provider.windowtype.length > 1"
          :dir="dir"
          v-model="servicewindow"
          :options="this.provider.windowtype"
          size="lg"
          required
        ></b-form-select>
        -->
        <br />
        <b-button
          block
          :disabled="!servicewindow"
          variant="outline-primary"
          type="submit"
          size="lg"
          >طلب رقم</b-button
        >
      </b-form>

      <!-- End Get Number-->
      <!-- Start Show my numebr -->
      <b-card v-if="mynumber != null" header="رقمي في الطابور" class="mb-2">
        <b-card-text> {{ mynumber }}</b-card-text>
      </b-card>
      <!-- End Show my numebr -->

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

import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
export default {
  name: "Provider",
  props: ["ur", "dir", "ta"],
  data() {
    return {
      providerkey: "",
      provider: {},
      servicewindow: null,
      mynumber: null,
      served: false,
    };
  },
  components: {
    ProviderContact,
    Display,
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
      //   return Object.keys(obj).some((key) => obj[key] == value);
      if (Object.values(obj).includes(value)) {
        this.itsmyturn();
        //console.log("computed turn");
        return Object.keys(obj).find((key) => obj[key] === value);
      } else {
        return null;
      }
    },
  },
  methods: {
    itsmyturn() {
      //Play sound
      document.getElementById("ding").muted = false;
      document.getElementById("ding").play();
      //Set served
      this.served = true;
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
      //Update local data object
      this.provider.currentnumber[this.servicewindow] = this.mynumber;

      //Update remote data object
      db.collection("users")
        .doc(this.providerkey)
        .update({
          currentnumber: this.provider.currentnumber,
        });
    },
  },
  beforeCreate() {},
  created() {
    this.providerkey = this.$route.query.key;
    db.collection("users")
      .doc(this.providerkey)
      .onSnapshot((doc) => {
        this.provider = doc.data();
        if (
          this.provider.windowtype == null ||
          this.provider.windowtype.length < 2
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
