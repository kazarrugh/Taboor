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
              :label="$t('labels.name')"
              label-for="input-1"
              class="input-title"
            >
              <b-form-input
                id="input-1"
                v-model="form.displayName"
                type="text"
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
              :label="$t('labels.review')"
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
                v-model="form.comment"
                :placeholder="
                  $t('text.howexperince', { value: ur.displayName })
                "
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>
        <b-alert
          variant="danger"
          :show="dismissCountDown"
          @dismissed="dismissCountDown = 0"
          @dismiss-count-down="countDownChanged"
        >
          {{ alertmsg }}
        </b-alert>

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
  props: ["ur", "pk", "servicewindow", "dir", "ta"],
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
      db.collection("reviews")
        .add(this.form)
        .then(() => {
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
      this.form.phoneNumber = payload.phoneNumber;
      this.form.formattedNumber = payload.formattedNumber;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
  beforeCreate() {},
  created() {
    this.form.provider = this.pk;
    this.form.servicewindow = this.servicewindow;
    this.form.displayName = this.$session.get("clientname");
    this.vuephone = this.$session.get("clientphone");
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
