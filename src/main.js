import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// import datePicker from 'vue-bootstrap-datetimepicker';
// import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
// Vue.use(datePicker);

// Vue.use(require('vue-moment'));

import moment from 'moment-timezone'
moment.tz.setDefault('Africa/Tripoli')

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
 