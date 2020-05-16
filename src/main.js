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

// Vue.use(require('vue-moment'));

import moment from "moment-timezone";
moment.tz.setDefault("Africa/Tripoli");

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";

import VuePwaInstallPlugin from "vue-pwa-install";
Vue.use(VuePwaInstallPlugin);

// import VueQrcodeReader from "vue-qrcode-reader";
// Vue.use(VueQrcodeReader);

/*
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
*/

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
