import Vue from "vue";
import VueRouter from "vue-router";

import Signup from '@/components/Signup'
import Profile from '@/components/Profile'

Vue.use(VueRouter);

const routes = [
  {
    path: '/Signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  }

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
