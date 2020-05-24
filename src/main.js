import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// import datePicker from 'vue-bootstrap-datetimepicker';
// import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
// Vue.use(datePicker);

// import moment from "moment-timezone";
// moment.tz.setDefault("Africa/Tripoli");
// require("moment/locale/es");

// Vue.use(require("vue-moment"), moment);

//import VueMoment from 'vue-moment'
import momentzone from "moment-timezone";
momentzone.tz.setDefault("Africa/Tripoli");

const moment = require("moment");
require("moment/locale/ar-ly");

Vue.use(require("vue-moment"), {
  moment,
});

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";

import VuePwaInstallPlugin from "vue-pwa-install";
Vue.use(VuePwaInstallPlugin);

import VueQrcodeReader from "vue-qrcode-reader";
Vue.use(VueQrcodeReader);

import VueSessionStorage from "vue-sessionstorage";
Vue.use(VueSessionStorage);

import VueNumber from "vue-number-animation";
Vue.use(VueNumber);

import * as VueGoogleMaps from "vue2-google-maps";
import { gmapApi } from "./api.js";

Vue.use(VueGoogleMaps, {
  load: {
    key: gmapApi,
    libraries: "places", // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  autobindAllEvents: true,

  //// If you want to manually install components, e.g.

  //// then disable the following:
  // installComponents: true,
});
import { GmapMarker } from "vue2-google-maps/src/components/marker";
Vue.component("GmapMarker", GmapMarker);

//Google Adsense
import Adsense from "vue-google-adsense/dist/Adsense.min.js";
Vue.use(require("vue-script2"));
Vue.use(Adsense);

import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import { messages } from "./language.js";

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: "ar-ly", // set locale
  fallbackLocale: "ar-ly",
  messages, // set locale messages
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
  i18n,
}).$mount("#app");
