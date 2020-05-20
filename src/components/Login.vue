<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-overlay :show="loading" rounded="sm">
        <b-form v-if="show" @submit="signIN">
          <h3>{{ $t("nav.signin") }}</h3>

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
                  type="text"
                  required
                  dir="ltr"
                  :placeholder="$t('text.email_sign_in')"
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
                  required
                  :placeholder="$t('text.password')"
                  dir="ltr"
                  @keyup.native.enter="signIN"
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
          <div>
            <b-button
              type="submit"
              :disabled="loginbuttondisabled"
              variant="primary"
            >
              {{ $t("nav.signin") }}
            </b-button>
            <b-button @click="forgotpasswordmodal = true" variant="warning">
              {{ $t("text.forgotpassword") }}
            </b-button>
            <b-button to="/Signup" variant="success">
              {{ $t("nav.newbranch") }}
            </b-button>
          </div>
          <b-modal
            v-model="forgotpasswordmodal"
            id="modal-forgot-password"
            :title="$t('text.forgotpassword')"
            :ok-title="$t('buttons.ok')"
            :cancel-title="$t('buttons.cancle')"
            @ok="resetpassword"
          >
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
                type="text"
                required
                dir="ltr"
                :placeholder="$t('text.email_sign_in')"
              ></b-form-input>
            </b-form-group>
          </b-modal>
        </b-form>
      </b-overlay>
    </b-container>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      loginbuttondisabled: false,
      forgotpasswordmodal: false,
      show: true,
      loading: false,
    };
  },
  props: ["dir", "ta", "ur"],
  methods: {
    resetpassword() {
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.error = "تم ارسال بريد الكتروني لتدوين كلمة مرور جديدة";
          this.showAlert();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    signIN(evt) {
      evt.preventDefault();
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((loggedin) => {
          //Update Last Login Time
          db.collection("users")
            .doc(loggedin.user.uid)
            .update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            });
          this.loginbuttondisabled = true;
          var redirect = this.$route.query.redirect;
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = "/";
          }
        })
        .catch((error) => {
          this.loading = false;
          this.loginbuttondisabled = false;
          if (
            error.message ==
            "The password is invalid or the user does not have a password."
          ) {
            this.error = "كلمة المرور غير صحيحة";
          } else if (
            error.message ==
            "There is no user record corresponding to this identifier. The user may have been deleted."
          ) {
            this.error = "لا يوجد مستخدم مسجل بهذا البريد الإلكتروني.";
          } else if (error.message == "The email address is badly formatted.") {
            this.error = "لا يوجد مستخدم مسجل بهذا البريد الإلكتروني.";
          } else {
            this.error = error.message;
          }

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
  created() {},
};
</script>
<style scoped>
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
.input-title {
  text-align: left;
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
  margin: 10px;
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
