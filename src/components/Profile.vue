<template>
  <div>
    <b-container class="container" :dir="dir">
      <h3>ملف تعريف الفرع</h3>
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
                v-model="form.displayName"
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
                dir="ltr"
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
              <v-select :options="servicetypes" v-model="form.servicetype">
                <template #search="{attributes, events}">
                  <input
                    :required="!form.servicetype"
                    class="vs__search"
                    v-bind="attributes"
                    v-on="events"
                  />
                </template>
              </v-select>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="بداية ساعات العمل:"
              label-for="input-1a"
              class="input-title"
            >
              <b-form-timepicker
                size="md"
                locale="ar-ly"
                placeholder="لم يتم تحديد الوقت"
                v-model="form.opentime"
              ></b-form-timepicker>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="نهاية ساعات العمل:"
              label-for="input-1a"
              class="input-title"
            >
              <b-form-timepicker
                locale="ar-ly"
                placeholder="لم يتم تحديد الوقت"
                v-model="form.closetime"
              ></b-form-timepicker>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="الشعار:"
              label-for="input-1a"
              class="input-title"
            >
              <filepond
                v-if="!ur.logo || changephoto"
                :path="'Logos/'"
                :filename="ur.uid"
                instantUpload="true"
                multiple="false"
                imagePreviewHeight="200"
                @getFiles="savefilepath"
              />
              <div v-else class="logocont">
                <img
                  :src="ur.logo"
                  @click="changephoto = true"
                  class="logoimg"
                />
              </div>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1a"
              label="الموقع في الخريطة:"
              label-for="input-1a"
              class="input-title"
            >
              <gmap-map
                :center="center"
                :zoom="17"
                style="width: 100%; height: 300px"
              >
                <gmap-marker
                  :position="center"
                  :draggable="true"
                  @dragend="dragMarker($event.latLng)"
                />
              </gmap-map>
            </b-form-group>
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-2"
              label="البريد الإلكتروني:"
              label-for="input-2"
              class="input-title"
            >
              <b-form-input
                dir="ltr"
                id="input-2"
                v-model="form.email"
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
                dir="ltr"
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

import filepond from "./filepond.vue";

export default {
  name: "Profile",
  data() {
    return {
      form: {
        displayName: "",
        email: "",
        phoneNumber: "",
        servicetype: "",
      },
      servicetypes: [],
      originalemail: "",
      password: "",
      newPassword: "",
      emailmodal: false,
      passwordmodal: false,
      photoURL: "",
      error: "",
      vuephone: "",
      authUser: null,
      show: true,
      changephoto: false,
      center: { lat: 32.894821, lng: 13.181072 },
      coordinates: null,
      markers: [],
      places: [],
      currentPlace: null,
    };
  },
  props: ["dir", "ta", "ur"],
  components: {
    VuePhoneNumberInput,
    filepond,
  },
  methods: {
    convertphone(payload) {
      this.phoneNumber = payload.formattedNumber;
    },
    savefilepath(arrayofpaths) {
      var filepath = arrayofpaths[arrayofpaths.length - 1];
      setTimeout(() => {
        db.collection("users")
          .doc(this.ur.uid)
          .set({
            logo: filepath,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        // console.log("status ", this.$router.resolve(filepath).route.name);
        this.changephoto = false;
      }, 5000);
    },
    updateProfile() {
      db.collection("users")
        .doc(this.ur.uid)
        .set({
          displayName: this.form.displayName,
          email: this.form.email,
          phoneNumber: this.form.phoneNumber,
          servicetype: this.form.servicetype,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          //First time user
          //this.$router.push("Profile");
        });

      // this.authUser
      //   .updateProfile({
      //     displayName: this.displayName,
      //     //photoURL: this.photoURL
      //     //this.$app.HeaderKey += 1;
      //   })
      //   .then(() => {
      //     this.$emit("clickedItem", this.hk); //Update header with the new name
      //     //update users table with the new display name
      //     firebase
      //       .database()
      //       .ref("users")
      //       .child(this.authUser.uid)
      //       .update({ displayName: this.displayName });
      //   });
    },
    updateCustomDetails() {
      // firebase
      //   .database()
      //   .ref("users")
      //   .child(this.authUser.uid)
      //   .update({ phoneNumber: this.phoneNumber });
    },
    updateEmail() {
      this.emailmodal = true;
    },
    updateEmailconfirmlogin() {
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(this.originalemail, this.password)
      //   .then((created) => {
      //     this.authUser
      //       .updateEmail(this.email)
      //       .then(() => {
      //         this.password = null;
      //         this.originalemail = this.email;
      //       })
      //       .catch((error) => alert("🤕" + error.message));
      //     firebase
      //       .database()
      //       .ref("users")
      //       .child(created.user.uid)
      //       .update({ email: this.email });
      //   })
      //   .catch((error) => {
      //     alert(error.message);
      //   });
    },
    updatePassword() {
      this.passwordmodal = true;
    },
    updatePasswordconfirmlogin() {
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(this.email, this.password)
      //   .then(() => {
      //     this.authUser
      //       .updatePassword(this.newPassword)
      //       .then(() => {
      //         this.password = null;
      //       })
      //       .catch((error) => alert("🤕" + error.message));
      //   })
      //   .catch((error) => {
      //     alert(error.message);
      //   });
    },
    // receives a place object via the autocomplete component

    geolocate() {
      console.log("gettinglocation");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.coordinates = new firebase.firestore.GeoPoint(
            position.coords.latitude,
            position.coords.longitude
          );
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    //set after merker end drag
    dragMarker(evnt) {
      this.coordinates = new firebase.firestore.GeoPoint(
        evnt.lat(),
        evnt.lng()
      );
    },
  },
  created() {
    //Get user location
    this.geolocate();

    // Object.assign(this.form, this.ur);
    this.form = this.ur;

    //Get possible service types
    db.collection("users").onSnapshot((querySnapshot) => {
      var servicetypes = [];
      querySnapshot.forEach(function(doc) {
        if (
          doc.data().servicetype != null &&
          !servicetypes.includes(doc.data().servicetype)
        ) {
          servicetypes.push(doc.data().servicetype);
        }
      });
      console.log("Current Service Types: ", servicetypes.join(", "));
      this.servicetypes = servicetypes;
    });

    // console.log("copying ur to form");
    /*
    this.displayName = this.ur.displayName;
    this.email = this.ur.email;
    this.originalemail = this.ur.email;
    this.vuephone = this.ur.phoneNumber;
    this.phoneNumber = this.ur.phoneNumber;
    */
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
.container {
  margin-top: 40px;
  margin-bottom: 40px;
}
.form-control {
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

.logocont {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
