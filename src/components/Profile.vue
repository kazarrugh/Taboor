<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-overlay :show="loading" rounded="sm">
        <h3>
          {{ $t("text.profile") }}
        </h3>
        <b-form v-if="show" @submit.prevent="updateProfile">
          <b-row align-h="center">
            <b-col sm="6">
              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1"
                :label="$t('labels.branch')"
                label-for="input-1"
                class="input-title"
              >
                <b-form-input
                  id="input-1"
                  v-model="form.displayName"
                  type="text"
                  required
                  :placeholder="$t('text.branch_name')"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1a"
                :label="$t('labels.phone')"
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
                :label="$t('labels.servicetype')"
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
                :label="$t('labels.servicewindow')"
                label-for="input-1a"
                class="input-title"
              >
                <b-form-tags
                  v-model="form.windowtype"
                  :placeholder="$t('text.servicewindow')"
                  :addButtonText="$t('buttons.addButton')"
                  addButtonVariant="primary"
                  tag-variant="primary"
                  size="md"
                  tagClass="tagClass"
                  class="mb-2"
                  :dir="dir"
                  :style="'text-align: ' + ta + ';'"
                ></b-form-tags>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1a"
                :label="$t('labels.opentime')"
                label-for="input-1a"
                class="input-title"
              >
                <b-form-timepicker
                  size="md"
                  :locale="lang"
                  :placeholder="$t('text.timenotset')"
                  v-model="form.opentime"
                ></b-form-timepicker>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1a"
                :label="$t('labels.closetime')"
                label-for="input-1a"
                class="input-title"
              >
                <b-form-timepicker
                  :locale="lang"
                  :placeholder="$t('text.timenotset')"
                  v-model="form.closetime"
                ></b-form-timepicker>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1a"
                :label="$t('labels.logo')"
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
              <b-modal
                v-model="mapmodal"
                id="modal-map"
                :title="$t('text.maplocation')"
                :ok-title="$t('buttons.ok')"
                :cancel-title="$t('buttons.cancel')"
                @ok="updateProfile"
                :dir="dir"
              >
                <b-form-group
                  :style="'text-align: ' + ta + ';'"
                  id="input-group-1a"
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
              </b-modal>
              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-2"
                :label="$t('labels.email')"
                label-for="input-2"
                class="input-title"
              >
                <b-form-input
                  dir="ltr"
                  id="input-2"
                  v-model="form.email"
                  type="text"
                  required
                  :placeholder="$t('text.email_branch')"
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

              <b-button type="submit" variant="primary">
                {{ $t("buttons.save") }}
              </b-button>

              <b-button @click="passwordmodal = true" variant="warning">
                {{ $t("text.passwordchange") }}
              </b-button>

              <b-button @click="mapmodal = true" variant="info">
                {{ $t("buttons.changecord") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-overlay>
      <b-modal
        v-model="passwordmodal"
        id="modal-1"
        :title="$t('text.passwordchange')"
        :ok-title="$t('buttons.ok')"
        :cancel-title="$t('buttons.cancel')"
        @ok="updatePasswordconfirmlogin"
        :ok-disabled="!validconfirmpassword"
        :dir="dir"
      >
        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          :label="$t('labels.newpassword')"
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
            :placeholder="$t('text.passwordmin', { value: 6 })"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          :label="$t('labels.curpassword')"
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
            :placeholder="$t('text.oldpassword')"
          ></b-form-input>
        </b-form-group>
      </b-modal>
      <b-modal
        v-model="emailmodal"
        id="modal-2"
        :title="$t('text.confirmpassword')"
        :ok-title="$t('buttons.ok')"
        :cancel-title="$t('buttons.cancel')"
        @ok="updateProfile"
        :ok-disabled="!validpassword"
        :dir="dir"
      >
        <b-form-group
          :style="'text-align: ' + ta + ';'"
          id="input-group-3"
          :label="$t('labels.curpassword')"
          label-for="input-2"
          class="input-title"
          :dir="dir"
        >
          <b-form-input
            dir="ltr"
            id="input-3a"
            v-model="password"
            type="password"
            :placeholder="$t('text.oldpassword')"
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
      mapmodal: false,
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
  props: ["dir", "ta", "ur", "lang"],
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
      this.form.phoneNumber = payload.phoneNumber;
      this.form.formattedNumber = payload.formattedNumber;
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
          formattedNumber: this.form.formattedNumber,
          opentime: this.form.opentime,
          closetime: this.form.closetime,
          servicetype: this.form.servicetype,
          windowtype: this.form.windowtype,
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
      //console.log("marker changed to ", evnt.lat(), evnt.lng());
      this.form.coordinates = new firebase.firestore.GeoPoint(
        evnt.lat(),
        evnt.lng()
      );
      this.center = {
        lat: evnt.lat(),
        lng: evnt.lng(),
      };
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
    if (this.form.coordinates == null) {
      this.geolocate();
    } else {
      //this.center = this.form.coordinates;
      this.center = {
        lat: this.form.coordinates.Pc,
        lng: this.form.coordinates.Vc,
      };
    }

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
button {
  margin: 20px;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
.tagClass {
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
