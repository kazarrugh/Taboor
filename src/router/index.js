import Vue from "vue";
import VueRouter from "vue-router";

import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Profile from "@/components/Profile";
import Provider from "@/components/Provider";
import Serve from "@/components/Serve";
import Display from "@/components/Display";
import QrPaper from "@/components/QrPaper";
import QrScan from "@/components/QrScan";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/Provider",
    name: "Provider",
    component: Provider,
  },
  {
    path: "/Serve",
    name: "Serve",
    component: Serve,
  },
  {
    path: "/Display",
    name: "Display",
    component: Display,
  },
  {
    path: "/QrPaper",
    name: "QrPaper",
    component: QrPaper,
  },
  {
    path: "/QrScan",
    name: "QrScan",
    component: QrScan,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
