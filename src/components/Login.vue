<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-overlay :show="loading" rounded="sm">
        <b-form v-if="show">
          <h3>تسجيل الدخول</h3>

          <b-row align-h="center">
            <b-col sm="6">
              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1"
                label="البريد الالكتروني:"
                label-for="input-1"
                class="input-title"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="text"
                  required
                  dir="ltr"
                  placeholder="البريد الإلكتروني لتسجيل الدخول"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col sm="6" align-self="center">
              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-2"
                label="كلمة المرور:"
                label-for="input-2"
                class="input-title"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  required
                  placeholder="كلمة المرور"
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
              @click="signIN"
              :disabled="loginbuttondisabled"
              variant="primary"
              >تسجيل الدخول
            </b-button>
            <b-button @click="forgotpasswordmodal = true" variant="warning">
              نسيت كلمة المرور
            </b-button>
            <b-button to="/Signup" variant="success">
              فرع جديد
            </b-button>
          </div>
          <b-modal
            v-model="forgotpasswordmodal"
            id="modal-forgot-password"
            title="نسيت كلمة المرور"
            ok-title="موافق"
            cancel-title="الغاء الأمر"
            @ok="resetpassword"
          >
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              label="البريد الالكتروني:"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="email"
                type="text"
                required
                dir="ltr"
                placeholder="البريد الإلكتروني لتسجيل الدخول"
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
      loading: false
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
        .catch(error => {
          console.log(error);
        });
    },
    signIN() {
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(loggedin => {
          //Update Last Login Time
          db.collection("users")
            .doc(loggedin.user.uid)
            .update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
          this.loginbuttondisabled = true;
          var redirect = this.$route.query.redirect;
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = "/";
          }
        })
        .catch(error => {
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
    }
  },
  created() {}
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
</style>
