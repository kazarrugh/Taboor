<template>
  <div>
    <b-container class="container" fluid>
      <!-- Start Provider Information -->
      <ProviderContact :ur="ur" :dir="dir" :ta="ta" />
      <!-- End Provider Information -->
      <v-select
        v-if="ur.windowtype && ur.windowtype.length > 1"
        :options="this.ur.windowtype"
        :placeholder="$t('select.typeofservice')"
        v-model="servicewindow"
        :dir="dir"
      >
      </v-select>
      <br />
      <v-select
        :options="totalwindows"
        :reduce="(option) => option.value"
        :placeholder="$t('select.windownumberselect')"
        v-model="mywindow"
        :dir="dir"
      >
      </v-select>
      <br />
      <b-button block variant="outline-primary" size="lg" @click="printwindow">
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

      <qrcode-vue
        v-if="!servicewindow && !mywindow"
        :value="qrpath"
        :size="qrsize"
        level="H"
        class="container"
      ></qrcode-vue>
      <h4 class="container" v-if="!servicewindow && !mywindow">
        {{ $t("text.usecamera") }}
      </h4>

      <!-- <div class="divcenter container">
        <img src="../assets/logo.svg" class="taboorlogo" />
        <h1 class="taboortext">Taboor</h1>
      </div> -->
      <b-row>
        <b-col offset="3" cols="3">
          <img src="../assets/logo.svg" class="taboorlogo" />
        </b-col>
        <b-col cols="3" class="textcol">
          <h1 class="taboortext" style="font-size:5vw;">
            Taboor
          </h1>
          <span class="taboortext" style="font-size:2vw;padding-top:2vw;"
            >.ly</span
          >
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import ProviderContact from "@/components/ProviderContact";
import QrcodeVue from "qrcode.vue";
export default {
  name: "QrPaper",
  props: ["ur", "dir", "ta"],
  data() {
    return {
      servicewindow: null,
      mywindow: null,
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
  created() {},
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
@media print {
  .v-select {
    display: none;
  }
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
  height: 20vw;
  width: 20vw;
  float: left;
}
.textcol {
  display: table;
  width: 100%;
  height: 20vw;
  text-align: center;
}
.taboortext {
  display: table-cell;
  vertical-align: middle;
}
</style>
