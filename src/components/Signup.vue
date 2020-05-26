<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-form v-if="show" @submit="signUP">
        <h3>
          {{ $t("nav.registration") }}
        </h3>

        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-0"
              :label="$t('labels.branch')"
              label-for="input-0"
              class="input-title"
            >
              <b-form-input
                id="input-0"
                v-model="name"
                type="text"
                required
                :placeholder="$t('text.branch_name')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              :label="$t('labels.email')"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="email"
                type="email"
                dir="ltr"
                required
                :placeholder="$t('text.email_branch')"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col sm="6" align-self="center">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-2"
              :label="$t('labels.password')"
              label-for="input-2"
              class="input-title"
            >
              <b-form-input
                id="input-2"
                v-model="password"
                type="password"
                dir="ltr"
                min="6"
                required
                :placeholder="$t('text.passwordmin', { value: 6 })"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-alert
          variant="danger"
          :show="dismissCountDown"
          @dismissed="dismissCountDown = 0"
          @dismiss-count-down="countDownChanged"
        >
          {{ error }}
        </b-alert>

        <b-button type="submit" variant="success">
          {{ $t("buttons.register") }}
        </b-button>
        <!-- <b-button to="/Login" variant="primary">تسجيل الدخول</b-button> -->
        <!-- <p>
          او الرجوع
          <router-link :to="'/Login?redirect=' + this.$route.query.redirect">
            لتسجيل الدخول</router-link
          >.
        </p> -->
      </b-form>
    </b-container>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  props: ["dir", "ta", "lang"],
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errors: [],
      error: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      show: true,
    };
  },
  mounted() {},
  methods: {
    signUP(evt) {
      evt.preventDefault();
      //this.name =  this.name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((created) => {
          //console.log(created.user.uid);
          db.collection("users")
            .doc(created.user.uid)
            .set({
              displayName: this.name,
              displayNameLang: null,
              email: this.email,
              phoneNumber: null,
              formattedNumber: null,
              opentime: null,
              closetime: null,
              opendays: null,
              servicetype: null,
              windowtype: null,
              windowtypeLang: null,
              coordinates: null,
              avgRating: null,
              numRatings: null,
              active: true,
              showPendingNumbers: true,
              showDisplay: true,
              showTotalNumbers: true,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              //First time user
              this.$router.push("Profile");
            });
        })
        .catch((error) => {
          //this.errors.push(error.message);
          this.error = error.message;
          this.showAlert();
        });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
  beforeCreate() {},
  created() {},
};
</script>
<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
h3 {
  margin-bottom: 40px;
}
input {
  margin: 10px 0;
  padding: 15px;
  text-align: center;
}
.btn {
  margin: 20px;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}
.input-title {
  font-size: 1.1rem;
}
.form-control {
  height: 2.5em;
  min-height: 2.5em;
  font-size: 1.1rem;
  margin: 10px 0;
  padding: 15px;
  text-align: center;
}
@media only screen and (max-width: 400px) {
  .form-control {
    font-size: 0.8em;
  }
}
</style>
