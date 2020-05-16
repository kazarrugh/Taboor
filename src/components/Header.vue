<template>
  <div>
    <b-navbar fixed="top" toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/">
        <img alt="Vue logo" src="../assets/logo.svg" height="30px" />
        Taboor
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Left aligned nav items -->
        <b-navbar-nav> </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-item v-if="!ur.displayName" href="#">المستخدم</b-nav-item> -->

          <b-nav-item v-if="loggedin" to="/profile">{{
            ur.displayName
          }}</b-nav-item>
          <b-nav-item v-if="!loggedin" to="/Signup">فرع جديد</b-nav-item>
          <!--
          <b-nav-item v-if="loggedin" @click="logout()"
            >تسجيل الخروج</b-nav-item
          >

          <b-nav-item v-if="!loggedin" to="/Login">تسجيل الدخول</b-nav-item>
          
          
          <b-nav-item-dropdown right menu-class="w-100">
            <template v-slot:button-content>
              <em v-if="!ur.displayName">المستخدم</em>
              <em v-else>{{ ur.displayName }}</em>
            </template>
            <b-dropdown-item v-if="!loggedin" to="/Login"
              >تسجيل الدخول</b-dropdown-item
            >
            <br v-if="!loggedin" />
            <b-dropdown-item v-if="!loggedin" to="/Signup"
              >فرع جديد</b-dropdown-item
            >
            <br v-if="!loggedin" />
            <b-dropdown-item v-if="loggedin" to="/profile"
              >الملف التعريفي</b-dropdown-item
            >
            <br v-if="loggedin" />

            <b-dropdown-item v-if="loggedin" @click="logout()"
              >تسجيل الخروج</b-dropdown-item
            >
          </b-nav-item-dropdown>
-->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-navbar fixed="bottom" type="dark" variant="dark">
      <!-- style="padding-bottom:10px;padding-left:30px;padding-top:10px;padding-right:0px;" -->

      <b-row style="width:100%;margin:0px;">
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/">
            <b-icon icon="house-door" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">الرئيسية</div>
          </router-link>
          <router-link v-if="loggedin" to="/serve">
            <b-icon icon="play" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">خدمة</div>
          </router-link>
        </b-col>
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/QrScan">
            <b-icon
              icon="columns-gap"
              variant="light"
              font-scale="1.5"
            ></b-icon>
            <div class="icontitle">QR Scan</div>
          </router-link>
          <router-link v-if="loggedin" to="/QrPaper">
            <b-icon
              icon="columns-gap"
              variant="light"
              font-scale="1.5"
            ></b-icon>
            <div class="icontitle">QR Paper</div>
          </router-link>
        </b-col>
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/login">
            <b-icon icon="lock" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">تسجيل الدخول</div>
          </router-link>

          <div v-if="loggedin" @click="logout()" style="cursor:pointer;">
            <b-icon icon="lock-fill" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">تسجيل الخروج</div>
          </div>
        </b-col>
      </b-row>
      <!-- </b-container> -->
      <!-- <div class="mx-auto bg-info" style="width: 200px;">
        Centered element
      </div> -->

      <!-- <b-nav-item href="#">Link 2</b-nav-item> -->
      <!-- </b-navbar-nav> -->
    </b-navbar>
  </div>
</template>

<script>
// const firebase = require("firebase/app");
// require("firebase/auth");

export default {
  props: ["ur"],
  data() {
    return {
      // user: null,
    };
  },
  computed: {
    loggedin() {
      return Object.keys(this.ur).length !== 0;
    },
  },
  created() {},
  methods: {
    logout() {
      this.$emit("logout");
      //this.$router.push({ name: "Login", query: {} });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.icontitle {
  margin: 0px;
  padding: 0px;
  color: white;
  text-decoration: none;
  font-size: 0.8rem;
}
a:hover {
  text-decoration: none;
}

.navbar-center {
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}
</style>
