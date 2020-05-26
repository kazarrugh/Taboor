<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-overlay :show="loading" rounded="sm">
        <h3>
          {{ $t("text.profile") }}
        </h3>
        <b-form v-if="show" @submit.prevent="updateProfile">
          <b-row align-h="center">
            <b-col sm="8">
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
                  @input="changesmade = true"
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
                <!-- <span style="display:inline;"><b-icon-plus-circle /></span> -->
                <v-select
                  :options="servicetypes"
                  v-model="form.servicetype"
                  :label="lang"
                  :dir="dir"
                  :searchable="false"
                  @input="changesmade = true"
                >
                  <!-- :reduce="(option) => option.id" -->
                  <!-- <template v-slot:option="option">
                    {{ [lang] }}
                  </template> -->
                  <!-- <template v-slot:option="option" :value="option.Item">
                    {{option.Item}}
                  </template> -->
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
                  @input="changesmade = true"
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
                  @input="changesmade = true"
                ></b-form-timepicker>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                id="input-group-1ab"
                :label="$t('labels.closetime')"
                class="input-title"
              >
                <b-form-timepicker
                  size="md"
                  :locale="lang"
                  :placeholder="$t('text.timenotset')"
                  v-model="form.closetime"
                  @input="changesmade = true"
                ></b-form-timepicker>
              </b-form-group>

              <b-form-group
                :style="'text-align: ' + ta + ';'"
                :label="$t('labels.opendays')"
                class="input-title"
              >
                <b-form-checkbox-group
                  size="md"
                  v-model="form.opendays"
                  :options="daysofweek"
                  @input="changesmade = true"
                ></b-form-checkbox-group>
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
                  @input="changesmade = true"
                ></b-form-input>
              </b-form-group>

              <!-- showPendingNumbers -->
              <hr />
              <b-row>
                <b-col cols="7" style="display: flex;">
                  <div
                    class="input-title providerinfo"
                    :style="'text-align: ' + ta + ';'"
                  >
                    {{
                      $t("text.showtopublic", {
                        value: $t("alerts.pendingnumbers"),
                      })
                    }}
                  </div>
                </b-col>
                <b-col>
                  <b-button
                    variant="outline-danger"
                    style="margin:0px;"
                    v-if="form.showPendingNumbers == false"
                    @click="form.showPendingNumbers = true"
                  >
                    <b-icon-toggle-on rotate="180" font-scale="1.8" />
                    {{ $t("buttons.hide") }}
                  </b-button>
                  <b-button
                    variant="outline-primary"
                    style="margin: 0px;"
                    v-if="form.showPendingNumbers == true"
                    @click="
                      form.showPendingNumbers = false;
                      changesmade = true;
                    "
                  >
                    <b-icon-toggle-on font-scale="1.8" />
                    {{ $t("buttons.show") }}
                  </b-button>
                </b-col>
              </b-row>
              <!-- <hr /> -->
              <!-- showDisplay -->
              <!-- <hr /> --><br />
              <b-row>
                <b-col cols="7" style="display: flex;">
                  <div
                    class="input-title providerinfo"
                    :style="'text-align: ' + ta + ';'"
                  >
                    {{
                      $t("text.showtopublic", {
                        value: $t("alerts.currentlyserved"),
                      })
                    }}
                  </div>
                </b-col>
                <b-col>
                  <b-button
                    variant="outline-danger"
                    style="margin:0px;"
                    v-if="form.showDisplay == false"
                    @click="form.showDisplay = true"
                  >
                    <b-icon-toggle-on rotate="180" font-scale="1.8" />
                    {{ $t("buttons.hide") }}
                  </b-button>
                  <b-button
                    variant="outline-primary"
                    style="margin: 0px;"
                    v-if="form.showDisplay == true"
                    @click="
                      form.showDisplay = false;
                      changesmade = true;
                    "
                  >
                    <b-icon-toggle-on font-scale="1.8" />
                    {{ $t("buttons.show") }}
                  </b-button>
                </b-col>
              </b-row>
              <!-- <hr /> -->
              <!-- showTotalNumbers -->
              <!-- <hr /> --><br />
              <b-row>
                <b-col cols="7" style="display: flex;">
                  <div
                    class="input-title providerinfo"
                    :style="'text-align: ' + ta + ';'"
                  >
                    {{
                      $t("text.showtopublic", {
                        value: $t("alerts.totalnumbers"),
                      })
                    }}
                  </div>
                </b-col>
                <b-col>
                  <b-button
                    variant="outline-danger"
                    style="margin:0px;"
                    v-if="form.showTotalNumbers == false"
                    @click="
                      form.showTotalNumbers = true;
                      changesmade = true;
                    "
                  >
                    <b-icon-toggle-on rotate="180" font-scale="1.8" />
                    {{ $t("buttons.hide") }}
                  </b-button>
                  <b-button
                    variant="outline-primary"
                    style="margin: 0px;"
                    v-if="form.showTotalNumbers == true"
                    @click="form.showTotalNumbers = false"
                  >
                    <b-icon-toggle-on font-scale="1.8" />
                    {{ $t("buttons.show") }}
                  </b-button>
                </b-col>
              </b-row>
              <hr />

              <b-alert
                :variant="alertcolor"
                :show="dismissCountDown"
                @dismissed="dismissCountDown = 0"
                @dismiss-count-down="countDownChanged"
              >
                {{ alertmsg }}
              </b-alert>
              <b-row style="margin:0px;">
                <b-col>
                  <b-button block type="submit" variant="primary">
                    {{ $t("buttons.save") }}
                  </b-button>
                </b-col>
                <b-col>
                  <b-button
                    block
                    @click="passwordmodal = true"
                    variant="warning"
                  >
                    {{ $t("text.passwordchange") }}
                  </b-button>
                </b-col>
                <b-col>
                  <b-button block @click="mapmodal = true" variant="info">
                    {{ $t("buttons.changecord") }}
                  </b-button>
                </b-col>
                <b-col v-if="ur.displayNameLang">
                  <b-button
                    block
                    v-if="ur.displayNameLang"
                    @click="translationmodal = true"
                    variant="secondary"
                  >
                    {{ $t("buttons.edittranslation") }}
                  </b-button>
                </b-col>
              </b-row>
              <br /><br />

              <!-- <pre>{{ this.form.windowtypeLang }}</pre> -->
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

      <b-modal
        v-model="translationmodal"
        id="modal-3"
        :title="$t('buttons.edittranslation')"
        :ok-title="$t('buttons.ok')"
        :cancel-title="$t('buttons.cancel')"
        @ok="updateProfileLang"
        :dir="dir"
        size="lg"
      >
        <b-form-group
          :style="'text-align: ' + ta + ';'"
          :label="$t('labels.branch')"
          label-for="displayname-ar"
          class="input-title"
          :dir="dir"
        >
          <b-row>
            <b-col>
              <b-form-input
                v-if="ur.displayNameLang && ur.displayNameLang['ar-ly']"
                id="displayname-ar"
                v-model="form.displayNameLang['ar-ly']"
                type="text"
                required
                placeholder="إسم الفرع باللغة العربية"
                dir="rtl"
              ></b-form-input>
            </b-col>
            <b-col>
              <b-form-input
                id="displayname-en"
                v-if="ur.displayNameLang && ur.displayNameLang['en']"
                v-model="form.displayNameLang['en']"
                type="text"
                required
                placeholder="Branch Name in English"
                dir="ltr"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-form-group>
        <!-- Start Edit translation for service windows -->

        <b-form-group
          :style="'text-align: ' + ta + ';'"
          :label="$t('labels.servicewindow')"
          label-for="servicewindow-translation"
          class="input-title"
          :dir="dir"
          v-if="ur.windowtypeLang"
        >
          <b-row v-for="(windowtype, key) in form.windowtype" v-bind:key="key">
            <b-col cols="12">
              <hr />
              <span
                style="display: flex;justify-content: center;font-size:0.8em;"
              >
                {{ windowtype }}</span
              >
              <hr />
            </b-col>
            <b-col>
              <b-form-input
                v-if="form.windowtypeLang && form.windowtypeLang[windowtype]"
                :id="'servicewindow-translation-ar' + windowtype"
                v-model="form.windowtypeLang[windowtype]['ar-ly']"
                type="text"
                required
                placeholder="نوع الخدمة باللغة العربية"
                dir="rtl"
              ></b-form-input>
            </b-col>
            <b-col>
              <b-form-input
                v-if="form.windowtypeLang && form.windowtypeLang[windowtype]"
                v-model="form.windowtypeLang[windowtype]['en']"
                type="text"
                required
                placeholder="Service Type in English"
                dir="ltr"
              ></b-form-input>
            </b-col>
          </b-row>
        </b-form-group>
        <!-- End Edit translation for service windows -->
      </b-modal>
      <b-modal
        v-model="leavemodal"
        id="modal-3"
        :title="$t('text.confirmleave')"
        :ok-title="$t('buttons.ok')"
        :cancel-title="$t('buttons.cancel')"
        :dir="dir"
        @ok="itsokaytoleave"
      >
        {{ $t("text.leaveask") }}
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
      translationmodal: false,
      leavemodal: false,
      pathtogo: null,
      mapmodal: false,
      loading: false,
      changesmade: false,
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
    daysofweek() {
      return [
        { text: this.$t("days.6"), value: 6 },
        { text: this.$t("days.7"), value: 7 },
        { text: this.$t("days.1"), value: 1 },
        { text: this.$t("days.2"), value: 2 },
        { text: this.$t("days.3"), value: 3 },
        { text: this.$t("days.4"), value: 4 },
        { text: this.$t("days.5"), value: 5 },
      ];
    },
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
    // translatedservicetypes() {
    //   return Object.keys(this.servicetypes);
    // },
  },
  beforeRouteLeave(to, from, next) {
    //console.log(to);
    this.pathtogo = to.name;
    if (this.changesmade) {
      this.leavemodal = true;
      // const answer = window.confirm(
      //   "Do you really want to leave? you have unsaved changes!"
      // );
      // if (answer) {
      //   next();
      // } else {
      //   next(false);
      // }
    } else {
      next();
    }
  },
  methods: {
    itsokaytoleave() {
      this.changesmade = false;
      this.$router.push({ name: this.pathtogo, query: {} });
    },
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
                  //  console.log("docRef: ", docRef);
                  //  console.log("translations written with ID: ", docRef.id);
                  setTimeout(() => {
                    db.collection("translations")
                      .doc(docRef.id)
                      .get()
                      .then((doc) => {
                        this.loading = false;
                        //  console.log(doc.data().translated.ar);
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
    updateProfileLang() {
      var obj = { updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
      if (this.form.displayNameLang) {
        obj = Object.assign(obj, {
          displayNameLang: this.form.displayNameLang,
        });
      }
      if (this.form.windowtypeLang) {
        obj = Object.assign(obj, { windowtypeLang: this.form.windowtypeLang });
      }
      db.collection("users")
        .doc(this.ur.uid)
        .set(obj, { merge: true })
        .then(() => {
          this.alertmsg = this.$t("alerts.savecompleted");
          this.alertcolor = "success";
          this.showAlert();
        });
    },
    arraysEqual(a, b) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length != b.length) return false;

      // If you don't care about the order of the elements inside
      // the array, you should sort both arrays here.
      // Please note that calling sort on an array will modify that array.
      // you might want to clone your array first.

      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },
    updateProfileDetails() {
      if (
        !this.form.displayNameLang ||
        this.ur.displayName != this.form.displayName
      ) {
        console.log("Getting name translation");
        this.gettranslation(
          this.form.displayName,
          "users",
          this.ur.uid,
          "displayNameLang",
          true, //capital
          "string"
        );
      }
      if (this.form.windowtype && this.form.windowtype.length > 0) {
        if (
          !this.form.windowtypeLang ||
          !this.arraysEqual(this.ur.windowtype, this.form.windowtype)
        ) {
          console.log("Getting windowtype translation");
          this.form.windowtype.forEach((wt, index) => {
            var translateit = false;
            //Check if there are changes
            //For new input
            if (!this.ur.windowtypeLang && !this.form.windowtypeLang) {
              console.log("Translating new", wt);
              translateit = true;
            } else if (!this.ur.windowtypeLang[wt]) {
              console.log("Translating changed ", wt);
              translateit = true;
            }
            if (translateit) {
              setTimeout(() => {
                this.gettranslation(
                  wt,
                  "users",
                  this.ur.uid,
                  "windowtypeLang",
                  true, //capital
                  "object"
                );
              }, index * 3000);
            }
          }); //End forEach
        }
      }
      console.log("saving form to users table");

      db.collection("users")
        .doc(this.ur.uid)
        .set(
          {
            displayName: this.form.displayName,
            email: this.form.email,
            phoneNumber: this.form.phoneNumber,
            formattedNumber: this.form.formattedNumber,
            opentime: this.form.opentime,
            closetime: this.form.closetime,
            opendays: this.form.opendays,
            servicetype: this.form.servicetype,
            windowtype: this.form.windowtype,
            coordinates: this.form.coordinates,
            showPendingNumbers: this.form.showPendingNumbers,
            showDisplay: this.form.showDisplay,
            showTotalNumbers: this.form.showTotalNumbers,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .then(() => {
          this.changesmade = false;
          this.alertmsg = this.$t("alerts.savecompleted");
          this.alertcolor = "success";
          this.showAlert();
          //Translate Name
          //this.gettranslation(input, collection, docid, fieldname);

          //servicetype
          // this.gettranslation(
          //   this.form.servicetype,
          //   "users",
          //   this.ur.uid,
          //   "servicetypeLang"
          // );
          //servicewindows
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
              }, 3000);
            });
          //End Translated error
        });
    },
    // receives a place object via the autocomplete component
    gettranslation(
      input,
      collection,
      docid,
      fieldname,
      capital,
      destinationtype
    ) {
      var output = null;
      var translated = false;
      console.log("Getting translation for: ", input);
      db.collection("translations")
        .add({
          input: input,
        })
        .then((docRef) => {
          setTimeout(() => {
            db.collection("translations")
              .doc(docRef.id)
              .get()
              .then((doc) => {
                console.log("translated: ", doc.data().translated);
                if (doc.data().translated) {
                  translated = true;
                  if (capital == true) {
                    var english = this.capitalize_Words(
                      doc.data().translated.en
                    );
                  } else {
                    english = doc.data().translated.en;
                  }
                  output = {
                    en: english,
                    "ar-ly": doc.data().translated.ar,
                  };
                }
                console.log("writing output: ", output);
              })
              .then(() => {
                if (collection && docid && fieldname && translated) {
                  if (destinationtype == "object") {
                    if (!this.form[fieldname]) {
                      this.form[fieldname] = {};
                      //console.log("creating new object in form", fieldname);
                    }
                    this.form[fieldname][input] = output;

                    //For firestore
                    output = { [input]: output };
                  } else {
                    //return output
                    this.form[fieldname] = output;
                  }

                  console.log("to fieldname: ", fieldname);

                  db.collection(collection)
                    .doc(docid)
                    .set(
                      {
                        [fieldname]: output,
                      },
                      { merge: true }
                    )
                    .then(() => {
                      //Delete trnalation
                      db.collection("translations")
                        .doc(docRef.id)
                        .delete();
                    });
                }

                return output;
              });
          }, 4500);
        });
      //End Translatation
    },
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
    capitalize_Words(str) {
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },
  },
  created() {
    // Object.assign(this.form, this.ur);
    this.form = JSON.parse(JSON.stringify(this.ur));
    // if (!this.form.windowtype) {
    //   this.form.windowtype = null;
    // }
    this.vuephone = this.form.phoneNumber;
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
    db.collection("categories").onSnapshot((querySnapshot) => {
      this.servicetype = [];
      querySnapshot.forEach((doc) => {
        this.servicetypes.push(doc.data());
      });
    });
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
  margin: 0.5em;
  cursor: pointer;
  font-size: 1em;
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
.v-select {
  font-size: 20px;
}
.logocont {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.providerinfo {
  margin: auto;
  vertical-align: middle;
}
</style>
