<template>
  <div>
    <b-container class="container cont cuthead" fluid :dir="dir">
      <!-- Start Provider Information -->
      <ProviderContact :ur="ur" :dir="dir" :ta="ta" :lang="lang" />
      <!-- End Provider Information -->
      <div>
        <v-select
          v-if="ur.windowtype && ur.windowtype.length > 1"
          :options="this.ur.windowtype"
          :placeholder="$t('select.typeofservice')"
          v-model="servicewindow"
          :dir="dir"
          class="cont"
        >
        </v-select>

        <v-select
          :options="totalwindows"
          :reduce="(option) => option.value"
          :placeholder="$t('select.windownumberselect')"
          v-model="mywindow"
          :dir="dir"
          class="cont"
        >
        </v-select>

        <b-button
          block
          variant="outline-primary"
          size="lg"
          @click="printwindow"
          class="cont"
        >
          {{ $t("buttons.print") }}
        </b-button>

        <div class="printlabel" v-if="servicewindow || mywindow">
          <div v-if="servicewindow" class="bigtext">
            {{ $t("text.service") }} {{ servicewindow }}
          </div>
          <div v-if="mywindow" class="bigtext ">
            {{ $t("select.windownumber") }} {{ mywindow }}
          </div>
        </div>
      </div>
      <qrcode-vue
        v-if="!servicewindow && !mywindow"
        :value="qrpath"
        :size="qrsize"
        level="H"
        class="container cont"
      ></qrcode-vue>
      <h4 class="container cont" v-if="!servicewindow && !mywindow">
        {{ $t("text.usecamera") }}
      </h4>

      <!-- <div class="divcenter container">
        <img src="../assets/logo.svg" class="taboorlogo" />
        <h1 class="taboortext">Taboor</h1>
      </div> -->

      <!-- <b-row dir="ltr">
        <b-col offset="4" cols="2">
          <img src="../assets/logo.png" class="taboorlogo" />
        </b-col>
        <b-col cols="2" class="textcol">
          <h1 class="taboortext" style="">
            <span style="font-size:0.8em;margin-right:-10px;">
              Taboor
            </span>
            <span style="font-size:0.3em;">
              .ly
            </span>
          </h1>
        </b-col>
      </b-row> -->
      <img src="../assets/logo.png" width="300" />
      <!-- add sponsors -->
      <!-- -->
      <b-row v-if="Object.keys(sponsors).length > 0">
        <b-col cols="12" style="font-size:2em">
          <hr />
          {{ $t("labels.sponsors") }}
          <hr />
        </b-col>
        <b-col
          v-for="(sp, label) in sponsors"
          v-bind:key="label"
          class="sponsorcol"
        >
          <img v-if="sp.logo" :src="sp.logo" width="150" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();
import ProviderContact from "@/components/ProviderContact";
import QrcodeVue from "qrcode.vue";
export default {
  name: "QrPaper",
  props: ["ur", "dir", "ta", "lang"],
  data() {
    return {
      servicewindow: null,
      mywindow: null,
      sponsors: {},
    };
  },
  components: {
    ProviderContact,
    QrcodeVue,
  },
  computed: {
    qrpath() {
      return window.location.origin + "/provider?key=" + this.ur.uid;
    },
    qrsize() {
      return window.innerWidth * 0.5;
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
    printwindow() {
      window.print();
    },
  },
  beforeCreate() {},
  created() {
    db.collection("sponsors")
      .where("active", "==", true)
      .onSnapshot((snapshot) => {
        this.sponsors = {};
        snapshot.forEach((doc) => {
          this.sponsors[doc.id] = doc.data();
          this.sponsors[doc.id].id = doc.id;
        });
      });
  },
  mounted() {},
};
</script>

<style scoped>
.cont {
  margin-top: 30px;
  margin-bottom: 30px;
}
.v-select {
  font-size: 20px;
  text-align: center;
}
@media print {
  .v-select {
    display: none;
  }
}
.border {
  border: 5px;
  border-style: solid;
}
.bigtext {
  font-size: 8vw;
  margin: 4vw;
  margin-bottom: 8vw;
}
.printlabel {
  margin-bottom: 8vw;
}
.divcenter {
  display: inline-block;
  width: 50%;
}
.taboorlogo {
  height: 13vh;
  width: 13vh;
  float: left;
}
.textcol {
  display: table;
  width: 100%;
  height: 13vh;
  text-align: center;
}
.taboortext {
  display: table-cell;
  vertical-align: middle;
}

.sponsorcol {
  margin: auto;
  vertical-align: middle;
}
</style>
