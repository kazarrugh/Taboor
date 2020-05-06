<template>
  <div>
    <b-container class="Logincontainer" :dir="dir">
      <h3>ملف تعريف الفرعم</h3>
      <b-form v-if="show" @submit.prevent="updateProfile">
        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              label="إسم الفرع:"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="displayName"
                type="text"
                required
                placeholder="اسم فرع موزع الخدمة او الشركة"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="رقم الهاتف:"
              label-for="input-1a"
              class="input-title"
            >
              <VuePhoneNumberInput
                v-model="vuephone"
                @update="convertphone"
                size="lg"
                default-country-code="LY"
                color="#ff0000"
                required
                clearable
              />
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="نوع النشاط:"
              label-for="input-1a"
              class="input-title"
            >
              <!-- <v-select :options="Object.values(items)" label="Item" :reduce="option => option.key" v-model="servicetype">
                  <template v-slot:option="option" :value="option.key">
                      {{ option.Item }} {{option.Code}} {{option.size}} {{option.capacity}}
                  </template>
                  <template #search="{attributes, events}">
                      <input :required="!servicetype" class="vs__search" v-bind="attributes" v-on="events" />
                  </template> 
                </v-select> -->
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-2"
              label="البريد الإلكتروني:"
              label-for="input-2"
              class="input-title"
            >
              <b-form-input
                id="input-2"
                v-model="email"
                type="text"
                required
                placeholder="البريد الالكتروني للفرع"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-3"
              label="كلمة المرور:"
              label-for="input-2"
              class="input-title"
            >
              <b-form-input
                id="input-3"
                v-model="newPassword"
                type="password"
                placeholder="كلمة مرور تتكون من اكثر من 6 حروف او ارقام"
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Update</b-button>
          </b-col>
        </b-row>
      </b-form>

      <b-modal
        v-model="passwordmodal"
        id="modal-1"
        title="Password Confirmation"
        @ok="updatePasswordconfirmlogin"
      >
        <b-form-input
          id="input-password"
          v-model="password"
          type="password"
          required
          placeholder="Please Enter your current Password"
        ></b-form-input>
      </b-modal>

      <b-modal
        v-model="emailmodal"
        id="modal-1"
        title="Password Confirmation"
        @ok="updateEmailconfirmlogin"
      >
        <b-form-input
          id="input-password"
          v-model="password"
          type="password"
          required
          placeholder="Please Enter your current Password"
        ></b-form-input>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";

export default {
  name: "Profile",
  data() {
    return {
      originalemail: "",
      email: "",
      emailmodal: false,
      passwordmodal: false,
      password: "",
      newPassword: "",
      displayName: "",
      phoneNumber: "",
      servicetype: "",
      photoURL: "",
      error: "",
      vuephone: "",
      authUser: null,
      show: true,
    };
  },
  props: ["dir", "ta"],
  components: {
    VuePhoneNumberInput,
  },
  methods: {
    convertphone(payload) {
      this.phoneNumber = payload.formattedNumber;
    },

    updateProfile() {
      this.authUser
        .updateProfile({
          displayName: this.displayName,
          //photoURL: this.photoURL
          //this.$app.HeaderKey += 1;
        })
        .then(() => {
          this.$emit("clickedItem", this.hk); //Update header with the new name
          //update users table with the new display name
          firebase
            .database()
            .ref("users")
            .child(this.authUser.uid)
            .update({ displayName: this.displayName });
        });
    },
    updateCustomDetails() {
      firebase
        .database()
        .ref("users")
        .child(this.authUser.uid)
        .update({ phoneNumber: this.phoneNumber });
    },
    updateEmail() {
      this.emailmodal = true;
    },
    updateEmailconfirmlogin() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.originalemail, this.password)
        .then((created) => {
          this.authUser
            .updateEmail(this.email)
            .then(() => {
              this.password = null;
              this.originalemail = this.email;
            })
            .catch((error) => alert("🤕" + error.message));
          firebase
            .database()
            .ref("users")
            .child(created.user.uid)
            .update({ email: this.email });
        })
        .catch((error) => {
          alert(error.message);
        });
    },
    updatePassword() {
      this.passwordmodal = true;
    },
    updatePasswordconfirmlogin() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.authUser
            .updatePassword(this.newPassword)
            .then(() => {
              this.password = null;
            })
            .catch((error) => alert("🤕" + error.message));
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  created() {
    this.displayName = this.ur.displayName;
    this.email = this.ur.email;
    this.originalemail = this.ur.email;
    this.vuephone = this.ur.phoneNumber;
    this.phoneNumber = this.ur.phoneNumber;

    /*if (user) {
          this.displayName = user.displayName;
          //this.photoURL = user.photoURL
          this.email = user.email;
          this.originalemail = user.email;
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (snapshot.val()) {
              this.vuephone = snapshot.val().phoneNumber;
              this.phoneNumber = snapshot.val().phoneNumber;
            }
          })
        }
    */
  },
};
</script>
<style scoped>
.Logincontainer {
  margin-top: 40px;
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
