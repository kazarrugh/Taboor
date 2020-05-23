<template>
  <div>
    <b-navbar fixed="top" toggleable="md" type="dark" variant="dark">
      <b-navbar-brand to="/" v-if="!disablerouter">
        <img alt="Vue logo" src="../assets/logo.svg" height="30px" />
        Taboor
      </b-navbar-brand>

      <b-navbar-brand v-if="disablerouter">
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
          <b-nav-item v-if="loggedin && !disablerouter" to="/display">
            {{ $t("nav.display") }}
          </b-nav-item>

          <b-nav-item v-if="loggedin && !disablerouter" to="/profile">
            {{ ur.displayName }}
          </b-nav-item>
          <b-nav-item v-if="!loggedin && !disablerouter" to="/Signup">
            {{ $t("nav.newbranch") }}
          </b-nav-item>

          <b-nav-item v-if="lang == 'ar-ly'" @click="setLanguage('en')">
            English
          </b-nav-item>
          <b-nav-item v-if="lang == 'en'" @click="setLanguage('ar-ly')">
            عربي
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-navbar fixed="bottom" type="dark" variant="dark" v-show="!disablerouter">
      <!-- style="padding-bottom:10px;padding-left:30px;padding-top:10px;padding-right:0px;" -->

      <b-row style="width:100%;margin:0px;">
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/">
            <b-icon icon="house-door" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">
              {{ $t("nav.home") }}
            </div>
          </router-link>
          <router-link v-if="loggedin" to="/serve">
            <b-icon icon="play" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">
              {{ $t("nav.serve") }}
            </div>
          </router-link>
        </b-col>
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/QrScan">
            <b-icon
              icon="columns-gap"
              variant="light"
              font-scale="1.5"
            ></b-icon>
            <div class="icontitle">
              {{ $t("nav.qrscan") }}
            </div>
          </router-link>
          <router-link v-if="loggedin" to="/QrPaper">
            <b-icon
              icon="columns-gap"
              variant="light"
              font-scale="1.5"
            ></b-icon>
            <div class="icontitle">
              {{ $t("nav.qrpaper") }}
            </div>
          </router-link>
        </b-col>
        <b-col cols="4">
          <router-link v-if="!loggedin" to="/login">
            <b-icon icon="lock" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">
              {{ $t("nav.signin") }}
            </div>
          </router-link>

          <div v-if="loggedin" @click="logout()" style="cursor:pointer;">
            <b-icon icon="lock-fill" variant="light" font-scale="1.5"></b-icon>
            <div class="icontitle">
              {{ $t("nav.signout") }}
            </div>
          </div>
        </b-col>
      </b-row>
    </b-navbar>
  </div>
</template>

<script>
export default {
  props: ["ur", "mynumber", "lang"],
  data() {
    return {};
  },
  computed: {
    loggedin() {
      return Object.keys(this.ur).length !== 0;
    },
    disablerouter() {
      if (this.mynumber != null) return true;
      else return false;
    },
  },
  created() {},
  methods: {
    logout() {
      if (!this.disablerouter) {
        this.$emit("logout");
      }
    },
    setLanguage(lang) {
      this.$emit("setLanguage", lang);
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
