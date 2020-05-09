<template>
  <div>
    <b-container class="Logincontainer" :dir="dir">
      <b-form v-if="show">
        <h3>نموذج التسجيل</h3>

        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-0"
              label="إسم الفرع:"
              label-for="input-0"
              class="input-title"
            >
              <b-form-input
                id="input-0"
                v-model="name"
                type="text"
                required
                placeholder="اسم فرع موزع الخدمة او الشركة"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              label="البريد الإلكتروني:"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="email"
                type="email"
                dir="ltr"
                required
                placeholder="البريد الالكتروني للفرع"
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
                dir="ltr"
                min="6"
                required
                placeholder="كلمة مرور تتكون من اكثر من 6 حروف او ارقام"
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

        <b-button @click="signUP" variant="primary">التسجيل</b-button>
        <p>
          او الرجوع
          <router-link :to="'/Login?redirect=' + this.$route.query.redirect">
            لتسجيل الدخول</router-link
          >.
        </p>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  props: ["dir", "ta"],
  data() {
    return {
      name: "",
      email: "",
      password: "",
      errors: [],
      error: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      show: true
    };
  },
  mounted() {},
  methods: {
    signUP: function() {
      //this.name =  this.name.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
      /*
db.collection("users")
  .add({
    displayName: this.name,
    email: this.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  })
*/

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(created => {
          // console.log(created);
          db.collection("users")
            .doc(created.user.uid)
            .set({
              displayName: this.name,
              email: this.email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
              //First time user
              this.$router.push("Profile");
            });
        })
        .catch(error => {
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
    }
  },
  beforeCreate() {},
  created() {
    //console.log(firebase.firestore.Timestamp.now().seconds);
  }
};
</script>
<style scoped>
.Logincontainer {
  margin-top: 60px;
}

h3 {
  margin-bottom: 40px;
}
input {
  margin: 10px 0;
  padding: 15px;
  text-align: center;
}
button {
  margin-top: 20px;
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
