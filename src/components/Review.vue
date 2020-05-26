<template>
  <div>
    <b-container class="container" :dir="dir">
      <b-form v-if="show" @submit="AddReview">
        <h3>
          {{ $t("alerts.servicerating") }}
        </h3>

        <b-row align-h="center">
          <b-col sm="6">
            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-1"
              :label="$t('labels.name') + ' *'"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="form.displayName"
                type="text"
                required
                :placeholder="$t('text.fullname')"
              ></b-form-input>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-2"
              :label="$t('labels.phone')"
              label-for="input-2"
              class="input-title"
            >
              <VuePhoneNumberInput
                dir="ltr"
                v-model="vuephone"
                @update="convertphone"
                size="lg"
                default-country-code="LY"
                color="#ff0000"
                clearable
              />
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-3"
              :label="$t('labels.review') + ' *'"
              label-for="input-3"
              class="input-title"
            >
              <b-form-rating
                v-model="form.rating"
                show-value
                size="lg"
                required
              ></b-form-rating>
            </b-form-group>

            <b-form-group
              :style="'text-align: ' + ta + ';'"
              id="input-group-4"
              :label="$t('labels.comment')"
              label-for="input-4"
              class="input-title"
            >
              <b-form-textarea
                v-if="ur.displayNamelang && ur.displayNamelang[lang]"
                v-model="form.comment"
                :placeholder="
                  $t('text.howexperince', { value: ur.displayNamelang[lang] })
                "
                rows="3"
                max-rows="6"
              ></b-form-textarea>

              <b-form-textarea
                v-else
                v-model="form.comment"
                :placeholder="
                  $t('text.howexperince', { value: ur.displayName })
                "
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>

            <b-alert
              variant="danger"
              :show="dismissCountDown"
              @dismissed="dismissCountDown = 0"
              @dismiss-count-down="countDownChanged"
            >
              {{ alertmsg }}
            </b-alert>
          </b-col>
        </b-row>

        <b-button type="submit" variant="success">
          {{ $t("buttons.submitreview") }}
        </b-button>
        <b-button @click="startover" variant="danger">
          {{ $t("buttons.back") }}
        </b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";

import firebase from "../firebaseConfig.js";
const db = firebase.firestore();

export default {
  name: "Review",
  props: ["ur", "pk", "servicewindow", "dir", "ta", "lang"],
  data() {
    return {
      form: {
        provider: null,
        servicewindow: null,
        displayName: null,
        rating: null,
        comment: null,
        phoneNumber: null,
        formattedNumber: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      alertmsg: "",
      dismissSecs: 5,
      dismissCountDown: 0,
      vuephone: "",
      show: true,
    };
  },
  components: {
    VuePhoneNumberInput,
  },
  computed: {},
  methods: {
    AddReview(evt) {
      evt.preventDefault();
      if (!this.form.rating) {
        this.alertmsg = this.$t("alerts.ratingrequired");
        this.showAlert();
        return false;
      }

      db.collection("reviews")
        .add(this.form)
        .then((doc) => {
          if (this.form.rating != null) {
            // Compute new number of ratings
            var newNumRatings = this.ur.numRatings + 1;

            // Compute new average rating
            var oldRatingTotal = this.ur.avgRating * this.ur.numRatings;
            var newAvgRating =
              (oldRatingTotal + this.form.rating) / newNumRatings;

            // Commit to Firestore
            db.collection("users")
              .doc(this.pk)
              .update({
                numRatings: newNumRatings,
                avgRating: newAvgRating,
              });
          }
          //console.log("review added");

          //Translate name
          if (this.form.displayName) {
            this.gettranslation(
              this.form.displayName,
              "reviews",
              doc.id,
              "displayNameLang",
              true //capital
            );
          }
          //translate comment
          if (this.form.comment) {
            this.gettranslation(
              this.form.comment,
              "reviews",
              doc.id,
              "commentLang",
              false //capital
            );
          }

          this.startover();
        })
        .catch((error) => {
          this.alertmsg = error;
          this.showAlert();
        });
    },
    startover() {
      this.$emit("reviewed", this.form.displayName, this.form.phoneNumber);
    },
    convertphone(payload) {
      if (payload.phoneNumber) {
        this.form.phoneNumber = payload.phoneNumber;
      } else {
        this.form.phoneNumber = null;
      }
      if (payload.formattedNumber) {
        this.form.formattedNumber = payload.formattedNumber;
      } else {
        this.form.formattedNumber = null;
      }
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
    gettranslation(input, collection, docid, fieldname, capital) {
      var output = null;
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
                if (capital == true) {
                  var english = this.capitalize_Words(doc.data().translated.en);
                } else {
                  english = doc.data().translated.en;
                }
                output = {
                  en: english,
                  "ar-ly": doc.data().translated.ar,
                };

                //console.log(output);
              })
              .then(() => {
                if (collection && docid && fieldname) {
                  //console.log("writing output to fieldname: ", fieldname);
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

                //return output
                this.form[fieldname] = output;
                return output;
              });
          }, 3000);
        });
      //End Translatation
    },
  },
  beforeCreate() {},
  created() {
    this.form.provider = this.pk;
    this.form.servicewindow = this.servicewindow;
    if (this.$session.get("clientname")) {
      this.form.displayName = this.$session.get("clientname");
    }
    if (this.$session.get("clientphone")) {
      var phone = this.$session.get("clientphone").replace(/-/g, "");
      //console.log("getting client phone", phone);
      this.vuephone = phone;
    }
  },
  mounted() {},
};
</script>

<style scoped>
.container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.btn {
  margin: 15px;
}
</style>
