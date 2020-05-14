<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-overlay :show="loading" rounded="sm">
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
              <!--
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
            -->
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

              <b-alert
                :variant="alertcolor"
                :show="dismissCountDown"
                @dismissed="dismissCountDown = 0"
                @dismiss-count-down="countDownChanged"
              >
                {{ alertmsg }}
              </b-alert>

              <b-button type="submit" variant="primary">تخزين</b-button>

              <b-button @click="passwordmodal = true" variant="warning"
                >تغيير كلمة المرور</b-button
              >
            </b-col>
          </b-row>
        </b-form>
      </b-overlay>
      <b-modal
        v-model="passwordmodal"
        id="modal-1"
        title="تغيير كلمة المرور"
        ok-title="موافق"
        cancel-title="الغاء الأمر"
        @ok="updatePasswordconfirmlogin"
        :ok-disabled="!validconfirmpassword"
      >
        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          label="كلمة المرور الجديدة:"
          label-for="input-2"
          class="input-title"
          :dir="dir"
        >
          <b-form-input
            dir="ltr"
            id="input-3c"
            v-model="newPassword"
            type="password"
            :state="validnewpassword"
            placeholder="كلمة مرور تتكون من اكثر من 6 حروف او ارقام"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          label="كلمة المرور الحالية:"
          label-for="input-2"
          class="input-title"
          :dir="dir"
        >
          <b-form-input
            dir="ltr"
            id="input-3b"
            v-model="password"
            type="password"
            :state="validpassword"
            placeholder="كلمة المرور القديمة"
          ></b-form-input>
        </b-form-group>
      </b-modal>
      <b-modal
        v-model="emailmodal"
        id="modal-2"
        title="تأكيد كلمة المرور"
        ok-title="موافق"
        cancel-title="الغاء الأمر"
        @ok="updateProfile"
        :ok-disabled="!validpassword"
      >
        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          label="كلمة المرور الحالية:"
          label-for="input-2"
          class="input-title"
          :dir="dir"
        >
          <b-form-input
            dir="ltr"
            id="input-3a"
            v-model="password"
            type="password"
            placeholder="كلمة المرور القديمة"
            :state="validpassword"
          ></b-form-input>
        </b-form-group>
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
        // displayName: "",
        // email: "",
        // phoneNumber: "",
        // opentime: "",
        // closetime: "",
        // servicetype: "",
        // coordinates: null,
      },
      servicetypes: [],
      originalemail: "",
      password: "",
      newPassword: "",
      emailmodal: false,
      passwordmodal: false,
      loading: false,
      error: "",
      vuephone: "",
      show: true,
      changephoto: false,
      center: { lat: 32.894821, lng: 13.181072 },
      alertmsg: "",
      alertcolor: "",
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  props: ["dir", "ta", "ur"],
  components: {
    VuePhoneNumberInput,
    filepond,
  },
  computed: {
    validpassword: function() {
      if (this.password && this.password.length > 5) return true;
      else return false;
    },
    validnewpassword: function() {
      if (this.newPassword && this.newPassword.length > 5) return true;
      else return false;
    },
    validconfirmpassword: function() {
      if (this.validpassword && this.validnewpassword) return true;
      else return false;
    },
  },
  methods: {
    convertphone(payload) {
      this.form.phoneNumber = payload.formattedNumber;
    },
    savefilepath(arrayofpaths) {
      var filepath = arrayofpaths[arrayofpaths.length - 1];
      setTimeout(() => {
        db.collection("users")
          .doc(this.ur.uid)
          .update({
            logo: filepath,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        this.changephoto = false;
      }, 5000);
    },
    updateProfile() {
      //Submit Clicked
      if (this.form.email != this.originalemail && this.emailmodal == false) {
        this.emailmodal = true;
      } else {
        this.loading = true;
        if (this.form.email != this.originalemail) {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.originalemail, this.password)
            .then((signedin) => {
              signedin.user
                .updateEmail(this.form.email)
                .then(() => {
                  // console.log("updating original email to ", this.form.email);
                  this.originalemail = this.form.email;
                  this.updateProfileDetails();
                  this.loading = false;
                  this.password = null;
                })
                .catch((error) => {
                  this.password = null;
                  //Get Translated Error Message
                  db.collection("translations")
                    .add({
                      input: error.message,
                    })
                    .then(function(docRef) {
                      //console.log("Document written with ID: ", docRef.id);
                      setTimeout(() => {
                        this.loading = false;
                        this.alertmsg = docRef.translated.ar;
                        this.alertcolor = "danger";
                        this.showAlert();
                      }, 3000);
                    });
                  //End Translated error
                });
            })
            .catch((error) => {
              this.password = null;
              //Get Translated Error Message
              db.collection("translations")
                .add({
                  input: error.message,
                })
                .then((docRef) => {
                  console.log("docRef: ", docRef);
                  console.log("translations written with ID: ", docRef.id);
                  setTimeout(() => {
                    db.collection("translations")
                      .doc(docRef.id)
                      .get()
                      .then((doc) => {
                        this.loading = false;
                        console.log(doc.data().translated.ar);
                        this.alertmsg = doc.data().translated.ar;
                        this.alertcolor = "danger";
                        this.showAlert();
                      })
                      .then(() => {
                        // console.log("deleting translation", docRef.id);
                        db.collection("translations")
                          .doc(docRef.id)
                          .delete();
                      });
                  }, 3000);
                });
              //End Translated error
            });
        } else {
          //Update profile details if email was not changed
          this.updateProfileDetails();
          // console.log(
          //   "Update profile details if email was not changed",
          //   this.originalemail,
          //   this.form.email
          // );
          this.loading = false;
        }
      }
    },
    updateProfileDetails() {
      db.collection("users")
        .doc(this.ur.uid)
        .update({
          displayName: this.form.displayName,
          email: this.form.email,
          phoneNumber: this.form.phoneNumber,
          opentime: this.form.opentime,
          closetime: this.form.closetime,
          servicetype: this.form.servicetype,
          coordinates: this.form.coordinates,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.alertmsg = "تم التخزين بنجاح";
          this.alertcolor = "success";
          this.showAlert();
        });
    },
    updatePasswordconfirmlogin() {
      this.loading = true;
      firebase
        .auth()
        .signInWithEmailAndPassword(this.originalemail, this.password)
        .then((signedin) => {
          signedin.user
            .updatePassword(this.newPassword)
            .then(() => {
              this.password = null;
              this.newPassword = null;
              this.loading = false;
              this.alertmsg = "تم تغيير كلمة المرور بنجاح";
              this.alertcolor = "success";
              this.showAlert();
            })
            .catch((error) => {
              this.password = null;
              this.newPassword = null;
              //Get Translated Error Message
              db.collection("translations")
                .add({
                  input: error.message,
                })
                .then((docRef) => {
                  setTimeout(() => {
                    db.collection("translations")
                      .doc(docRef.id)
                      .get()
                      .then((doc) => {
                        this.loading = false;
                        this.alertmsg = doc.data().translated.ar;
                        this.alertcolor = "danger";
                        this.showAlert();
                      })
                      .then(() => {
                        db.collection("translations")
                          .doc(docRef.id)
                          .delete();
                      });
                  }, 3000);
                });
              //End Translated error
            });
        })
        .catch((error) => {
          this.password = null;
          this.newPassword = null;
          //Get Translated Error Message
          db.collection("translations")
            .add({
              input: error.message,
            })
            .then((docRef) => {
              setTimeout(() => {
                db.collection("translations")
                  .doc(docRef.id)
                  .get()
                  .then((doc) => {
                    this.loading = false;
                    this.alertmsg = doc.data().translated.ar;
                    this.alertcolor = "danger";
                    this.showAlert();
                  })
                  .then(() => {
                    db.collection("translations")
                      .doc(docRef.id)
                      .delete();
                  });
              }, 2500);
            });
          //End Translated error
        });
    },
    // receives a place object via the autocomplete component

    geolocate() {
      //console.log("gettinglocation");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.form.coordinates = new firebase.firestore.GeoPoint(
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
      this.form.coordinates = new firebase.firestore.GeoPoint(
        evnt.lat(),
        evnt.lng()
      );
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
  created() {
    // Object.assign(this.form, this.ur);
    this.form = JSON.parse(JSON.stringify(this.ur));
    this.vuephone = this.ur.phoneNumber;
    this.originalemail = JSON.parse(JSON.stringify(this.ur.email));
    // console.log(
    //   "reseting original email from",
    //   this.originalemail,
    //   "to",
    //   this.ur.email
    // );

    //Get user location
    this.geolocate();

    //Get possible service types
    db.collection("users").onSnapshot((querySnapshot) => {
      var servicetypes = [
        "مصارف",
        "مخابز",
        "محلات مواد غدائية",
        "محلات حلويات",
        "محلات خضروات",
        "موزعين غار",
        "محطات بنزين",
        "حلاقين",
        "صيدليات",
        "عيادات",
        "الجوازات",
        "قنصليات",
        "مراكز حكومية",
      ];
      querySnapshot.forEach(function(doc) {
        if (
          doc.data().servicetype != null &&
          !servicetypes.includes(doc.data().servicetype)
        ) {
          servicetypes.push(doc.data().servicetype);
        }
      });
      //console.log("Current Service Types: ", servicetypes.join(", "));
      this.servicetypes = servicetypes;
    });

    // console.log("copying ur to form");
    /*
    this.displayName = this.ur.displayName;
    this.email = this.ur.email;

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

.logocont {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
