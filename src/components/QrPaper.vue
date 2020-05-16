<template>
  <div>
    <b-container class="container" fluid>
      <!-- Start Provider Information -->
      <ProviderContact :ur="ur" :dir="dir" :ta="ta" />
      <!-- End Provider Information -->
      <b-button block variant="outline-primary" size="lg" @click="printwindow"
        >طباعة
      </b-button>
      <qrcode-vue
        :value="qrpath"
        :size="qrsize"
        level="H"
        class="container"
      ></qrcode-vue>
      <h4 class="container">صور الرمز بالكاميرا لطلب طابور</h4>

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
  props: ["ur", "dir", "td"],
  data() {
    return {};
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
